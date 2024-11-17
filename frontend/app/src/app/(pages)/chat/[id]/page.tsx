"use client";
import { useUser } from "@/services/context/usercontext";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { format, formatDistanceToNow, isToday } from "date-fns";





const UserChatPage = ({ currentUser, chatUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);
  const { username, profile_pic_url, is_online, id } = currentUser;
  
  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/chat/room/${currentUser.username}/${chatUser.user.username}`
    );
    setWs(socket);
    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };
    socket.onmessage = (event) => {
      console.log(event);
      const message = JSON.parse(event.data);
      console.log("Received message:", message.message);
       console.log(currentUser.id);
       console.log(message.sender);
       if (currentUser.id === message.message.receiver)
        setMessages((prevMessages) => [message.message, ...prevMessages]);
    };
    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };
    return () => {
      socket.close();
    };
  }, [currentUser.username, chatUser.user.username]);
  
  const messageContainerRef = useRef(null);
  useEffect(() => {
    if (chatUser?.messages?.length > 0) {
      setMessages(chatUser.messages);
    }
    
  }, [chatUser.messages]);
  
  const handleSendMessage = () => {
    if (input.trim() && ws?.readyState === WebSocket.OPEN) {
      const newMessage = {
        message: input,
        sender: currentUser.username,
        receiver: chatUser.user.username,
        type: "chat_message",
      };

      ws.send(JSON.stringify(newMessage));
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setInput("");
    } else {
      console.log("WebSocket is not open.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key Pressed:', e.key); 
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage(); 
    }
  };
  useEffect(()=>{
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  },[messages]);

  return (
    <div className="h-full">
      <main className="flex-grow flex flex-row h-fit">
        <section className="flex flex-col flex-auto border-l border-gray-800">
          <div className=" p-4  h-[640px] overflow-y-scroll" ref={messageContainerRef}>
            {messages
            .slice(0)
            .reverse()
              .map((msg, index) => (
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
                     
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="h-fit">
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
                  Send
                </button>
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default function Page() {
  const chatUserid = useParams();
  const { user: currentUser } = useUser();
  const [chatUser, setChatUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/chat/room/${chatUserid.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("User not found or API error");
        }

        const data = await response.json();
        setChatUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!chatUser || !currentUser) {
    return <div>No user data found.</div>;
  }

  return <UserChatPage currentUser={currentUser} chatUser={chatUser} />;
}
{/* <p className={` text-center w-full text-sm text-gray-500 ${ msg.sender === currentUser.username
  ? "order-first"
  : "bg-white justify-self-end"
}`}>
        <span className="text-[10px] text-gray-500">
{isToday(new Date(msg.timestamp))
? format(new Date(msg.timestamp), "hh:mm a")
: format(new Date(msg.timestamp), "MMM dd")}
</span>
</p> */}