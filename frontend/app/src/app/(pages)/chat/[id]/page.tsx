"use client";
import { useUser } from "@/services/context/usercontext";
import { useChat } from "@/services/context/chatContext";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { format, isToday } from "date-fns";
import toast from "react-hot-toast";
import { ConstructionIcon } from "lucide-react";
import Loader from "../../../../components/loader/loader";

import { IoSend } from "react-icons/io5";



const UserChatPage = ({ currentUser }) => {
  const { currentChat, conversations, typing, ws, setMessageContainerRef, addMessage, fetchMessages } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { username, profile_pic_url, is_online, id } = currentUser;
  const [timeoutTyping, setTimeoutTyping] = useState(undefined);
  const messageContainerRef = useRef(null);
  
  
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setMessageContainerRef(messageContainerRef);
  }, [messageContainerRef]);
  
useEffect(() => {
  scrollToBottom();
}, [typing]);

  const handleSendMessage = () => {
    if (input.trim() && ws?.readyState === WebSocket.OPEN) {
      const newMessage = {
        message: input,
        sender: currentUser.username,
        receiver: currentChat.user.username,
        type: "chat_message",
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(newMessage));
      addMessage(newMessage);
      setInput("");
      setTimeout(scrollToBottom, 100);
    } 
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    ws.send(JSON.stringify({
      type: "typing",
      sender: currentUser.username,
      receiver: currentChat.user.username
    }));
    

    if (timeoutTyping) {
      clearTimeout(timeoutTyping);
    }
    setTimeoutTyping(setTimeout(() => {
      ws.send(JSON.stringify({
        type: "stop_typing",
        sender: currentUser.username,
        receiver: currentChat.user.username,
      }));
    }, 1000));


    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage(); 
    }
  };
  
  const handleScroll = async () => {
    if (messageContainerRef.current) {
      const { scrollTop } = messageContainerRef.current;
      
      if (scrollTop === 0 && !loading && currentChat?.messages?.length) {
        setLoading(true);
        
        try {
          await fetchMessages(currentChat.user.id);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      messageContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (messageContainer) {
        messageContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentChat, loading]);

  if (!currentChat) {
    return <div className="h-full w-full flex justify-center items-center">No chat data found.</div>;
  }
  return (
    <div className="h-full">
      <main className="flex-grow flex flex-row h-fit">
        <section className="flex flex-col flex-auto border-l border-gray-800">
          <div className=" p-4  h-[240px] lg:h-[640px] overflow-y-scroll" ref={messageContainerRef}>
            {loading && (
              <div className="flex justify-center py-2">
                <Loader />
              </div>
            )}
            {currentChat?.messages
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((msg, index) => {
                if (msg.notification) {
                  return (<div key={index} className="flex justify-center items-center w-full">
                    <div className="flex flex-col items-center justify-center py-4">
                      <p className="text-gray-500 text-lg">{msg.message}</p>
                    </div>
                  </div>)
                }
                return (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === currentUser.username
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`text-sm ${
                        msg.sender === currentUser.username
                          ? "text-white"
                          : "text-gray-700"
                      } grid grid-flow-row gap-2`}
                    >
                      <div
                        className={`flex items-center ${
                          msg.sender === currentUser.username
                            ? "flex-row-reverse"
                            : ""
                        }`}
                      >
                        <p
                          className={`px-6 py-3 m-1 rounded-3xl max-w-xs lg:max-w-sm break-words whitespace-pre-wrap ${
                            msg.sender === currentUser.username
                              ? "bg-violet-primary"
                              : "bg-white"
                          }`}
                          >
                          {msg.message}
                          <span className={` m-2 text-center w-full text-sm text-gray-500 ${ msg.sender === currentUser.username
                          ? "order-first"
                          : "bg-white justify-self-end"
                        }`}>
                                <span className="text-[10px] text-gray-500">
                        {isToday(new Date(msg.timestamp))
                        ? format(new Date(msg.timestamp), "hh:mm a")
                        : format(new Date(msg.timestamp), "MMM dd")}
                        </span>
                        </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              {typing ? <div className="bg-white rounded-3xl h-11 w-16 flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="dot bg-gray-900 rounded-full h-2 w-2"></div>
                    <div className="dot bg-gray-900 rounded-full h-2 w-2"></div>
                    <div className="dot bg-gray-900 rounded-full h-2 w-2"></div>
                  </div>
                </div> : <></>}
          </div>

        {currentChat.user.relationship && currentChat.user.relationship === "Friend" ? <><div className="h-fit">
            <div className="relative flex-grow">
              <label className="flex items-center">
                <input
                  className="m-4 rounded-full py-2 pl-3 pr-20 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write your message"
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="absolute top-1/2 transform -translate-y-1/2 right-4 flex flex-shrink-0 focus:outline-none text-violet-primary  px-4 py-1"
                >
                  <IoSend  className="w-6 h-6"/>
                </button>
              </label>
            </div>
          </div></> : <>
          </>}
        </section>
      </main>
    </div>
  );
};

export default function Page() {
  const chatUserid = useParams();
  const { user: currentUser } = useUser();
  const { fetchMessages } = useChat();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {

      fetchMessages(chatUserid.id, true).then(()=>{
          setLoading(false);
        });
  }, [chatUserid.id]);

  if (loading) {
  return <div className="w-full h-full flex justify-center items-center"><Loader/></div>
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if ( !currentUser) {
    return <div>No user data found.</div>;
  }

  return <UserChatPage currentUser={currentUser} />;
}
