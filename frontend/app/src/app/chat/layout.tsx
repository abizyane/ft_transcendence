"use client";

import React, { ReactNode, useState } from "react";
import "../globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

interface ChatLayoutProps {
  children: ReactNode;
}

const users = [
  {
    id: 1,
    name: "Angelina Jolie",
    img: "https://randomuser.me/api/portraits/women/61.jpg",
    lastMessage: "Ok, see you at the subway in a bit.",
    time: "Just now",
  },
  {
    id: 2,
    name: "Tony Stark",
    img: "https://randomuser.me/api/portraits/men/97.jpg",
    lastMessage: "I'll bring the suit.",
    time: "5 minutes ago",
  },
  {
    id: 3,
    name: "Scarlett Johan",
    img: "https://randomuser.me/api/portraits/women/33.jpg",
    lastMessage: "Let's meet at the cafe.",
    time: "10 minutes ago",
  },
  {
    id: 4,
    name: "John Snow",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
    lastMessage: "You missed a call John.",
    time: "4h",
  },
  {
    id: 5,
    name: "Sunny Leone",
    img: "https://randomuser.me/api/portraits/women/87.jpg",
    lastMessage: "Ah, it was an awesome one night stand.",
    time: "1 Feb",
  },
  {
    id: 6,
    name: "Bruce Lee",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    lastMessage: "You are a great human being.",
    time: "23 Jan",
  },
  {
    id: 7,
    name: "TailwindCSS Group",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    lastMessage: "Adam: Hurray, Version 2 is out now!!.",
    time: "23 Jan",
  },
];

export default function Chat({ children }: ChatLayoutProps) {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openSlider = (user) => {
    setSelectedUser(user);
    setIsSliderOpen(true);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-start">
      <div className="w-full h-16">
        <Navbar />
      </div>

      {/* Main content area */}
      <div className="w-full flex lg:flex-row justify-center items-center flex-col-reverse flex-grow overflow-hidden">
        {/* Sidebar section */}
        <div className="lg:h-screen fixed lg:static bottom-0 lg:w-24 w-full z-50 lg:z-0">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="w-full flex justify-center items-center overflow-hidden">
          <div className="w-full h-max lg:h-fit flex flex-col justify-center items-center p-2 overflow-hidden">
            <div className="backdrop-blur-md w-full text-gray-200 rounded-xl border-2 border-violet-primary flex">
              <div className="w-full lg:w-96 backdrop-blur-md h-fit">
                <section className="w-full">
                  <div className="header p-4 flex justify-between items-center w-full">
                    <p className="text-md font-bold">Messages</p>
                    <div className="rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 flex justify-center items-center">
                      <button className="text-sm">New</button>
                    </div>
                  </div>

                  <div className="search-box p-4 flex-none">
                    <form>
                      <div className="relative">
                        <label>
                          <input
                            className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                            type="text"
                            value=""
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
                  <div className="story-section flex flex-row p-2 overflow-auto">
                    <div className="active-users flex flex-row overflow-auto">
                      {users.slice(0, 3).map((user) => (
                        <Link
                          key={user.id}
                          href={`/chat/${user.id}`}
                          className="text-sm text-center mr-4 relative"
                        >
                          <div className="relative">
                            <img
                              className="shadow-md rounded-full w-20 h-20 object-cover"
                              src={user.img}
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

                <div className="contacts p-2 flex-1 md:w-full overflow-y-scroll">
                  {users.map((user) => (
                    <Link key={user.id} href={`/chat/${user.id}`}>
                      <div
                        key={user.id}
                        onClick={() => openSlider(user)}
                        className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            className="shadow-md rounded-full w-full h-full object-cover"
                            src={user.img}
                            alt={user.name}
                          />
                        </div>
                        <div className="flex-auto min-w-0 ml-4 mr-6">
                          <p className="font-bold">{user.name}</p>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <p className="truncate">{user.lastMessage}</p>
                            <p className="ml-2 text-white-primary whitespace-nowrap">
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
