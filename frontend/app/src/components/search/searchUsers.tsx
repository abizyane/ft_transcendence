import React from "react";
import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import toast from 'react-hot-toast';
import { customFetch } from '@/utils/customFetch';

const searchUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState(undefined);

  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(timer);
      setTimer(setTimeout(() => func(...args), delay));
    };
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchUsers = async (query) => {
    setLoading(true);
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+"/api/searchuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: query }),
      });

      if (response && response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response) {
        toast.error("Error fetching data");
      }
    } catch (error) {
      toast.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(fetchUsers, 500);
  const handleSearchKeyUp = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  const searchRef = useRef(null);

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  return (
    <div ref={searchRef} className="relative  ">
      <label>
        <div className="w-full">
          <input
            id="search"
            name="search"
            className="hidden lg:block rounded-full py-2 pr-6 pl-10 w-full border bg-gray-800 border-gray-800 focus:border-violet-primary   focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
            placeholder="Search"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={handleSearchKeyUp}
          />
          {isOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 w-full bg-gray-800 mt-2 rounded-md shadow-lg max-h-64 overflow-y-auto no-scrollbar">
              <h2 className="bg-gray-800 text-center text-white text-xl">
                Users
              </h2>
              <hr className="border-violet-primary" />
              {loading ? (
                <div className="p-2 text-white text-center">Loading...</div>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <Link href={`/profile/${user.id}`} key={user.id}>
                    <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer space-x-4">
                      <div className=" lg:relative w-12 h-12">
                        <span className={` h-3 w-3 bg-${user.is_online ? "green" : "gray"}-500 absolute bottom-0 right-1  rounded-full z-0`} />
                        <img
                          src={user.profile_pic_url}
                          alt="User Profile"
                          className="object-cover w-full h-full rounded-full"
                        />
                      </div>
                      <p className="text-sm font-medium text-white">
                        {user.username}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-2 text-white text-center ">
                  <p>No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
        <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
          <svg viewBox="0 0 24 24" className="hidden lg:block w-6 h-6">
            <path
              fill="#bbb"
              d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
            />
          </svg>
        </span>
      </label>
    </div>
  );
};

export default searchUsers;
