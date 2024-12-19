"use client";
import { useChat } from "@/services/context/chatContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from 'react-hot-toast';

const Newchat = ({ isOpen, closeModal, handleUserClick }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [timer, setTimer] = useState(undefined);
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
  };
  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(timer);
      setTimer(setTimeout(() => func(...args), delay));
    };
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+":8000/api/friends/friends/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);




  const handleSearchKeyUp = (e) => {
    if (e.target.value.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(e.target.value.toLowerCase())));
    }

  };

  const childHandleUserClick = (user) => {
    if (handleUserClick) handleUserClick(user);
    else router.push(`/chat/${user.id}`);
    closeModal();
  }


  if (!isOpen) return null;

  return  (
    <div className="w-full fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="relative bg-gray-800 p-6 rounded-xl w-96">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>
        <h2 className="text-xl text-white font-semibold mb-4">Create New Chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white" htmlFor="input1">
              Name
            </label>
            <input
              type="text"
              id="input1"
              onKeyUp={handleSearchKeyUp}
              className="w-full mt-2 p-2 border text-black rounded"
              placeholder="Search for a user"
              required
            />
            <div className="absolute contents top-full left-0 w-full bg-gray-800 mt-2 rounded-md shadow-lg max-h-64 overflow-y-auto no-scrollbar">
              <hr className="border-violet-primary mt-4" />
              {loading ? (
                <div className="p-2 text-white text-center">Loading...</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer space-x-4"
                    key={user.id}
                    onClick={() => childHandleUserClick(user)}
                  >
                    <img
                      src={user.profile_pic_url || "default-image-url.jpg"}
                      alt={`${user.username}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium text-white">{user.username}</p>
                  </div>
                )) 
              ) : (
                <div className="p-2 text-white text-center ">
                  <p>No users found</p>
                </div>
              )
              }
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Newchat;
