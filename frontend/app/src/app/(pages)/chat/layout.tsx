"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { FiPlusCircle } from "react-icons/fi";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import Link from "next/link";
import Newchat from "@/components/Chat/Newchat";
import { ChatProvider, useChat } from '@/services/context/chatContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Loader from "components/loader/loader";
import { useUser } from "@/services/context/usercontext";
import toast from "react-hot-toast";
import { customFetch } from "@/utils/customFetch";
interface ChatLayoutProps {
  children: ReactNode;
}

interface User {
  id: number;
  username: string;
  profile_pic_url: string;
  message: string;
  time: string;
}

export function Chat({ children }: ChatLayoutProps) {
  const { conversations, currentChat, fetchConversations, searchConversations, setSearchConversations,  
    handleBlockUser: contextBlockUser

  } = useChat();
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const is_online = true;
  const messageContainerRef = useRef(null);
  const param = useParams();
  const userId = param.id;

   useEffect(() => {
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
  }, [conversations]);

  const openSlider = (user: User) => {
    setIsSliderOpen(true);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
    router.push("/chat");
  };

  const handleUserClick = (user: User) => {
    if (isMobile) openSlider(user);
    router.push(`/chat/${user.id}`);
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSearch = (value: string) => {
    if (value == "") {
      setSearchValue("");
      setSearchConversations(undefined);
      return;
    }else{
      setSearchValue(value);
      setSearchConversations(Object.values(conversations).filter((conv) => conv.user.username.toLowerCase().includes(value.toLowerCase())));
    }
  };

  const handleViewProfileClick = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  const apiBlockUser = async (userid:number) => {
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userid,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Friend blocked successfully");
        return true;

      } else {
        const errorData = await response.json();
        toast.error('Failed to block friend:');
        return false;
      }
    } catch (error) {
      toast.error('Error during the request:', error);
      return false;
    } finally {
    }
  };

  const apiUnblockUser = async (userid:number) => {
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userid,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Friend unblocked successfully');
        return true;

      } else {
        const errorData = await response.json();
        toast.error('Failed to block friend:');
        return false;
      }
    } catch (error) {
      toast.error('Error during the request:');
      return false;
    } finally {
    }
  };
  const handleBlockUser = (user:User, relationship:string) => {
    if (relationship === "Blocked") {
      apiBlockUser(user.id).then((success) => {
        if (success === true) {
          contextBlockUser(user.username, relationship);
        }
      });
    } else {
      apiUnblockUser(user.id).then((success) => {
        if (success === true) {
          contextBlockUser(user.username, relationship);
        }
      });
    }
  }
  const inviteFriendToGame = async (friendId) => {
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+"/api/invite_friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friend_id: friendId }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const token = data.token;
        toast.success("Friend invited to game");
        router.push(`/game/solo/maps?game=randommatch&token=${token}`);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error rejecting friend:", error);
    }
  };
if (!conversations || !user)
  return <div className="w-full h-full flex justify-center items-center"><Loader/></div>

  return (

    <div className=" w-full flex flex-col justify-start items-start">
      <div className="w-full flex lg:flex-row h-full flex-col-reverse">
        <Newchat isOpen={isModalOpen} closeModal={closeModal} handleUserClick={handleUserClick} />
        <div className="w-full h-full lg:h-full flex flex-col justify-center items-center p-2">
          <div className="bg-gray-800/60 mt-8 mb-22 lg:mt-0 h-[400px] lg:h-[800px]   w-full text-gray-200 rounded-xl border-2 border-violet-primary flex">
            <div className="w-full lg:w-96 backdrop-blur-md rounded-xl">
              <section className="w-full">
                <div className="p-4 rounded-xl flex justify-between items-center w-full">
                  <p className="text-md font-bold">Messages</p>
                  <div className="rounded-full bg-violet-primary w-10 h-10 flex justify-center items-center">
                    <button className="text-sm" onClick={toggleModal}>
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
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Search Conversations"
                        />
                        <span className="absolute top-0 left-0 mt-3 ml-3 inline-block">
                          <FaSearch className="w-5 h-5 text-gray-400" />
                        </span>
                      </label>
                    </div>
                  </form>
                </div>

                <div className="p-2 flex-1 md:w-full h-[240px] lg:h-[650px]  overflow-y-scroll">
                  {Object.values(searchValue ? searchConversations : conversations)
                    .sort((a, b) => 
                      new Date(b.lastMessage?.timestamp).getTime() - new Date(a.lastMessage?.timestamp).getTime()
                    )
                    .map((conv) => {
                    return (
                      <div
                        key={`message-${conv.user.id}`}
                        onClick={() => handleUserClick(conv.user)}
                        className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <span className={`h-3 w-3 ${conv.user.is_online ? "bg-green-500" : "bg-gray-500"} absolute bottom-0 right-1  rounded-full z-0`} />
                          <img
                            className="shadow-md rounded-full w-full h-full object-cover"
                            src={conv.user.profile_pic_url}
                            alt={conv.user.username}
                          />
                        </div>
                        <div className="flex-auto min-w-0 ml-4 mr-6">
                          <p className="font-bold">{conv.user.username}</p>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            {conv.lastMessage ? <>
                              <p className={`truncate ${conv.unreadCount > 0 && conv.lastMessage.sender !== user?.username ? "font-bold text-white" : ""}`}>{conv.lastMessage?.message}</p>
                                <p className="ml-4 text-white-primary whitespace-nowrap">
                                  {isToday(new Date(conv.lastMessage?.timestamp))
                                    ? formatDistanceToNow(new Date(conv.lastMessage?.timestamp), {
                                        addSuffix: true,
                                      })
                                    : isYesterday(new Date(conv.lastMessage?.timestamp))
                                    ? "Yesterday"
                                    : format(new Date(conv.lastMessage?.timestamp), "yyyy-MM-dd")}
                                </p>
                            </> : <></>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            <div className="flex-1 hidden lg:block ">
              {currentChat && (
                <div className="px-6 py-4 flex  bg-gray-800/60 rounded-xl flex-row flex-none justify-start gap-4 items-center shadow">
                  <div className="flex">
                    <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                      <img
                        className="shadow-md rounded-full w-full h-full object-cover"
                        src={currentChat.user.profile_pic_url}
                        alt={currentChat.user.username}
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-bold">{currentChat.user.username}</p>
                      <p>{currentChat.user.is_online ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                  <div className="w-full  flex justify-end">
                    <div className="h-8 w-8 rounded-full bg-gray-900 flex  justify-center items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-white">
                          <FaEllipsisV />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-12 mt-1 bg-gray-800 border-violet-primary">
                          <DropdownMenuItem onClick={() => handleViewProfileClick(currentChat.user.id)}>
                            <span className="text-white">View profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-black" />
                          <DropdownMenuItem onClick={() => {
                            if (currentChat?.user !== undefined)
                              inviteFriendToGame(currentChat.user.id);
                          }}>
                            <span className="text-white">Invite friend</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-black" />
                          <DropdownMenuItem onClick={() => {
                            if (currentChat?.user !== undefined){
                              if (currentChat.user.relationship === "Blocked") {
                                handleBlockUser(currentChat.user, "Unknown");
                              } else {
                                handleBlockUser(currentChat.user, "Blocked");
                              }
                            }
                          }}>
                            {currentChat.user.relationship === "Blocked" ?
                                <span className="text-white">Unblock</span>
                                  : <span className="text-white">Block</span>
                            }
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={messageContainerRef}
        className={`class="lg:hidden fixed  bg-gray-800 mt-10 pb-4 h-[400px] w-[95%] sm:w-[97%] m-2  text-gray-200 rounded-xl border-2 border-violet-primary  transition-transform transform ${
          isSliderOpen ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        {currentChat && (
          <div className="px-6 py-4 flex bg-gray-800/60 rounded-xl flex-row flex-none justify-start gap-4 items-center shadow">
            <div className="flex justify-start w-full">
            <button
              onClick={closeSlider}
              className="text-gray-600 hover:text-black mr-8"
            >
              Close
            </button>
            <div className="flex">
              <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                <img
                  className="shadow-md rounded-full w-full h-full object-cover"
                  src={currentChat.user.profile_pic_url}
                  alt={currentChat.user.username}
                />
              </div>
              <div className="text-sm">
                <p className="font-bold">{currentChat.user.username}</p>
                <p>{currentChat.user.is_online ? "Online" : "Offline"}</p>
                </div>
              </div>
            </div>
            <div className="w-full  flex justify-end">
              <div className="h-8 w-8 rounded-full bg-gray-900 flex  justify-center items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white">
                    <FaEllipsisV />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-12 mt-1 bg-gray-800 border-violet-primary">
                    <DropdownMenuItem onClick={() => handleViewProfileClick(currentChat.user.id)}>
                      <span className="text-white">View profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem onClick={() => {
                        if (currentChat?.user !== undefined)
                          inviteFriendToGame(currentChat.user.id);
                      }}>
                      <span className="text-white">Invite friend</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem onClick={() => {
                      if (currentChat?.user !== undefined){
                        if (currentChat.user.relationship === "Blocked") {
                          handleBlockUser(currentChat.user, "Unknown");
                        } else {
                          handleBlockUser(currentChat.user, "Blocked");
                        }
                      }
                    }}>
                      {currentChat.user.relationship === "Blocked" ?
                          <span className="text-white">Unblock</span>
                            : <span className="text-white">Block</span>
                      }
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}


export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <ChatProvider>
      <Chat children={children} />
    </ChatProvider>
  );
}
