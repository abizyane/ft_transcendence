"use client";

import React, { ReactNode, useEffect, useState } from "react";
import "../../globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/router";
import { FiPlusCircle } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
interface ChatLayoutProps {
  children: ReactNode;
}

interface User {
  id:number;
  username: string;
  profile_pic: string;
  message: string;
  time: string;
}

export default function Chat({ children }: ChatLayoutProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchConversation = async () => {
    try {
      const response = await fetch(`http://localhost:8000/chat/conversations`,{
        credentials: 'include',
      });
      if (!response.ok) {
        console.error('Fetch error:', error);
      }
      const data = await response.json();
      console.log(data.results);
      setUsers(() => {
        return data?.results.map((User: any) => {
          return {
            id:User.id,
            username: User.username,
            profile_pic: User.profile_pic,
            message: User.message,
            time: formatDistanceToNow(new Date(User.timestamp), {
              addSuffix: true,
            }),
          };
        });
      });
      return data?.results;
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };
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

    const openChat = (user) => {
      router.push(`/chat/${user.id}`)
    }
  const currentUserId = 2;
  return (
    <div className="w-full flex flex-col justify-start items-start ">
      <div className="w-full flex lg:flex-row h-full  flex-col-reverse">
        <div className="w-full  h-full ">
          <div className="w-full  h-full lg:h-full flex flex-col justify-center items-center p-2 ">
            <div className=" bg-gray-800/60 h-[800px]  w-1/2  text-gray-200 rounded-xl border-2 border-violet-primary flex">
              <div className="w-full lg:w-96 backdrop-blur-md  rounded-xl">
                <section className="w-full">
                  <div className="header p-4  rounded-xl flex justify-between items-center w-full">
                    <p className="text-md font-bold">Messages</p>
                    <div className="rounded-full  bg-violet-primary w-10 h-10 flex justify-center items-center">
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
                            <FaSearch className="w-5 h-5 text-gray-400"/>
                          </span>
                        </label>
                      </div>
                    </form>
                  </div>

                  {/* Online User Items */}
                  {/* <div className="flex flex-row p-2 overflow-auto">
                    <div className="flex flex-row overflow-auto">
                      {users &&
                        users?.map((user) => (
                          <Link
                            // key={`chat-${user.id}`}
                            href={`/chat/${user.id}`}
                            className="text-sm text-center mr-4 relative"
                          >
                            <div className="relative">
                              <img
                                className="shadow-md rounded-full w-20 h-20 object-cover"
                                src={"http://localhost:8000" + user.img}
                                alt={user.name}
                              />
                              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <p>{user.name}</p>
                          </Link>
                        ))}
                    </div>
                  </div> */}
                </section>
                   {/* <Link key={`message-${user.id}`} href="">
                  </Link> */}
               <div className="p-2 flex-1 md:w-full h-[600px] overflow-y-scroll">
      {users
          .map((user, i) => (
            <Link 
              key={`message-${user.id}`}
              href={`/chat/${user.id}`}
              passHref
            >
              <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
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
            </Link>
          ))}
    </div>

                {/* Slide Component */}
              </div>
              <div className="flex-1 hidden lg:block">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
                // <div
                //   className={`lg:hidden fixed top-0 right-0 h-full w-full bg-gray-800 rounded-xl backdrop-blur-3xl transition-transform transform ${
                //     isSliderOpen ? "translate-x-0" : "translate-x-full"
                //   }`}
                // >
                //   <div className="flex justify-start  p-4 border-b">
                //     <button
                //       onClick={closeSlider}
                //       className="text-gray-600 hover:text-black"
                //     >
                //       Close
                //     </button>
                //     <div className="flex flex-col text-center w-full">
                //       <h2 className="pl-2 text-lg font-semibold">
                //         {selectedUser?.name}
                //       </h2>
                //       <p>Active 1h ago</p>
                //     </div>
                //   </div>
                //   <div className="flex-1 overflow-y-auto p-4">
                //     {/* Messages go here */}
                //   </div>
                //   <div className="chat-footer w-full fixed bottom-0 left-0 rounded-xl p-4 bg-gray-800 border-t border-gray-700">
                //     <div className="relative">
                //       <label className="flex items-center w-full">
                //         <input
                //           className="rounded-full py-2 pl-3 pr-20 w-full border border-gray-800 focus:border-gray-700 bg-gray-800  focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md"
                //           type="text"
                //           placeholder="Write your message"
                //         />
                //         <button
                //           type="button"
                //           className="absolute top-1/2 transform -translate-y-1/2 right-4 focus:outline-none text-violet-primary hover:text-blue-700 px-4 py-1"
                //         >
                //           Send
                //         </button>
                //       </label>
                //     </div>
                //   </div>
                // </div>