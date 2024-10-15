"use client";

import React, { ReactNode, useEffect, useState } from "react";
import "../globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import {formatDistanceToNow } from 'date-fns'
interface ChatLayoutProps {
  children: ReactNode;
}

interface User {
  id: number;
  name: string;
  messageid: number | undefined;
  img: string;
  lastMessage: string;
  time: string;
}

export default function Chat({ children }: ChatLayoutProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchConversation = async () => {
    try {
      const response = await fetch(`http://localhost:8000/chat/conversations`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(() => {
        return data?.results.map((User: any) => {
          return {
            id: User.id,
            messageid: User.messageid,
            name: User.sender.username,
            img: User.sender.profile_pic,
            lastMessage: User.message,
            time:formatDistanceToNow(new Date(User.timestamp), { addSuffix: true })
          };
        });
      });
      console.log(data?.results[0]);
      return (data?.results);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  console.log("userslength"   ,users.length);
  useEffect(() => {
    fetchConversation();
  }, []);

  const openSlider = (user: User) => {
    setSelectedUser(user);
    setIsSliderOpen(true);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
    setSelectedUser(null);
  };


  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-start ">
      <div className="w-full">
        <Navbar />
      </div>

      {/* Main content area */}
      <div className="w-full flex lg:flex-row h-full  flex-col-reverse flex-grow ">
        {/* Sidebar section */}
        <div className="lg:w-24 fixed lg:static bottom-0 left-0  w-full z-50 lg:z-0">
          <Sidebar />
        </div>
       <div className="w-full  h-full ">test
<div className="w-full  h-full lg:h-full flex flex-col justify-center items-center p-2 ">
  <div className=" bg-gray-800/60 h-[1100px]  w-full  text-gray-200 rounded-xl border-2 border-violet-primary flex">
    <div className="w-full lg:w-96 backdrop-blur-md  rounded-xl">
      <section className="w-full">
        <div className="header p-4  rounded-xl flex justify-between items-center w-full">
          <p className="text-md font-bold">Messages</p>
          <div className="rounded-full hover:bg-gray-700 bg-violet-primary w-10 h-10 flex justify-center items-center">
            <button className="text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 32 32">
            <path fill="#ffffff" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z" />
          </svg>
          </button>
          </div>
        </div>

        <div className="search-box p-4 flex-none">
          <form>
            <div className="relative">
              <label>
                <input
                  className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                  type="text"
                  defaultValue=""
                  placeholder="Search Messages"
                />
                <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      fill="#bbb"
                      d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                    />
                  </svg>
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Online User Items */}
        <div className="flex flex-row p-2 overflow-auto">
          <div className="flex flex-row overflow-auto">
            {users && users?.map((user) => (
              <Link
                // key={`chat-${user.id}`}
                href={`/chat/${user.id}`}
                className="text-sm text-center mr-4 relative"
              >

                <div className="relative">
                
                  <img
                    className="shadow-md rounded-full w-20 h-20 object-cover"
                    src={"http://localhost:8000"+ user.img}
                    alt={user.name}
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <p>{user.name}</p>
               </Link>
            ))}
          </div>
        </div>
      </section>
      {/* href={`/chat/${user.id}` */}
      <div className="p-2 flex-1 md:w-full h-[820px] overflow-y-scroll">
        {users && users.map((user) => (
          <Link key={`message-${user.id}` } href='#'  >
            <div
              onClick={() => openSlider(user)}
              className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
            >
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  className="shadow-md rounded-full w-full h-full object-cover"
                  src={"http://localhost:8000"+ user.img}
                  alt={user.name}
                />
              </div>
              <div className="flex-auto min-w-0 ml-4 mr-6">
                <p className="font-bold">{user.name}</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <p className="truncate">{user.lastMessage}</p>
                  <p className="ml-4 text-white-primary whitespace-nowrap">
                    {user.time}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Slide Component */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-full bg-gray-800 rounded-xl backdrop-blur-3xl transition-transform transform ${
          isSliderOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-start  p-4 border-b">
          <button
            onClick={closeSlider}
            className="text-gray-600 hover:text-black"
          >
            Close
          </button>
          <div className="flex flex-col text-center w-full">
            <h2 className="pl-2 text-lg font-semibold">
              {selectedUser?.name}
            </h2>
            <p>Active 1h ago</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Messages go here */}
        </div>
        <div className="chat-footer w-full fixed bottom-0 left-0 rounded-xl p-4 bg-gray-800 border-t border-gray-700">
          <div className="relative">
            <label className="flex items-center w-full">
              <input
                className="rounded-full py-2 pl-3 pr-20 w-full border border-gray-800 focus:border-gray-700 bg-gray-800  focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md"
                type="text"
                placeholder="Write your message"
              />
              <button
                type="button"
                className="absolute top-1/2 transform -translate-y-1/2 right-4 focus:outline-none text-violet-primary hover:text-blue-700 px-4 py-1"
              >
                Send
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 hidden lg:block">{children}</div>
  </div>
</div>
</div>
        </div>
      </div>
  );
}
