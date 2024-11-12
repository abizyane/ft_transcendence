"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { FiPlusCircle } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

interface ChatLayoutProps {
  children: ReactNode;
}

interface User {
  id: number;
  username: string;
  profile_pic: string;
  message: string;
  time: string;
}

export default function Chat({ children }: ChatLayoutProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<User | undefined>();
  const [isMobile, setIsMobile] = useState(false); 
  const router = useRouter();
  const is_online = true;
  
  const fetchConversation = async () => {
    try {
      const response = await fetch(`http://localhost:8000/chat/conversations`, {
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Fetch error:", error);
      }
      const data = await response.json();
      setUsers(() => {
        return data?.results.map((User: any) => {
          return {
            id: User.id,
            username: User.username,
            profile_pic: User.profile_pic,
            message: User.message,
            time: formatDistanceToNow(new Date(User.timestamp), {
              addSuffix: true,
            }),
          };
        });
      });
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchConversation();
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openSlider = (user: User) => {
    setSelectedId(user);
    setIsSliderOpen(true);
  };

  useEffect(() => {
    console.log(selectedId);
  }, [selectedId]);

  const closeSlider = () => {
    setIsSliderOpen(false);
    router.push("/chat");
  };

  const handleUserClick = (user: User) => {
    if (isMobile)
      openSlider(user);
    else
      setSelectedId(user);
    router.push(`/chat/${user.id}`);
  };

  return (
    <div className=" w-full flex flex-col justify-start items-start">
      <div className="w-full flex lg:flex-row h-full flex-col-reverse">
        {/* Main content */}
          <div className="w-full h-full lg:h-full flex flex-col justify-center items-center p-2">
            <div className="bg-gray-800/60 h-[800px] w-full text-gray-200 rounded-xl border-2 border-violet-primary flex">
              <div className="w-full lg:w-96 backdrop-blur-md rounded-xl">
                <section className="w-full">
                  <div className="p-4 rounded-xl flex justify-between items-center w-full">
                    <p className="text-md font-bold">Messages</p>
                    <div className="rounded-full bg-violet-primary w-10 h-10 flex justify-center items-center">
                      <button className="text-sm">
                        <FiPlusCircle className="w-8 h-8 rounded-full hover:text-gray-700" />
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
                          <span className="absolute top-0 left-0 mt-3 ml-3 inline-block">
                            <FaSearch className="w-5 h-5 text-gray-400" />
                          </span>
                        </label>
                      </div>
                    </form>
                  </div>

                  {/* User list */}
                  <div className="p-2 flex-1 md:w-full h-[650px] overflow-y-scroll">
                    {users.map((user) => (
                      <div
                        key={`message-${user.id}`}
                        onClick={() => handleUserClick(user)}
                        className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            className="shadow-md rounded-full w-full h-full object-cover"
                            src={user.profile_pic}
                            alt={user.username}
                          />
                        </div>
                        <div className="flex-auto min-w-0 ml-4 mr-6">
                          <p className="font-bold">{user.username}</p>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <p className="truncate">{user.message}</p>
                            <p className="ml-4 text-white-primary whitespace-nowrap">
                              {user.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Main Content (Children) */}
              <div className="flex-1 hidden lg:block">
                {selectedId && (
                  <div className="px-6 py-4 flex bg-gray-800/60 rounded-xl flex-row flex-none justify-start gap-4 items-center shadow">
                    <div className="flex">
                      <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                        <img
                          className="shadow-md rounded-full w-full h-full object-cover"
                          src={selectedId.profile_pic}
                          alt={selectedId.username}
                        />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold">{selectedId.username}</p>
                        <p>{is_online ? "Online" : "Offline"}</p>
                      </div>
                    </div>
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>
      </div>

      {/* Slide-out Sidebar (mobile) */}
      <div
        className={`lg:hidden fixed  bg-gray-800 h-[800px] w-[95%] sm:w-[97%] m-2  text-gray-200 rounded-xl border-2 border-violet-primary  transition-transform transform ${
          isSliderOpen ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        {selectedId && (
          <div className="px-6 py-4 flex bg-gray-800/60 rounded-xl flex-row flex-none justify-start gap-4 items-center shadow">
            <button
              onClick={closeSlider}
              className="text-gray-600 hover:text-black"
            >
              Close
            </button>
            <div className="flex">
              <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                <img
                  className="shadow-md rounded-full w-full h-full object-cover"
                  src={selectedId.profile_pic}
                  alt={selectedId.username}
                />
              </div>
              <div className="text-sm">
                <p className="font-bold">{selectedId.username}</p>
                <p>{is_online ? "Online" : "Offline"}</p>
              </div>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
