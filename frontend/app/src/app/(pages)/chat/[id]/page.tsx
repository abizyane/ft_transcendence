"use client";
import { useUser } from "@/services/context/usercontext";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const UserChatPage = ({ currentUser, chatUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { username, profile_pic_url, is_online, id } = currentUser;
  useEffect(() => {
    setMessages(chatUser.messages);
  });

  
  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input, 
        sender: currentUser.username, 
        timestamp: new Date().toLocaleTimeString(), 
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]); 
      setInput("");
    }
  };
  console.log("test");
  return (
    <div className="h-full">
      <main className="flex-grow flex flex-row min-h-full">
        <section className="flex flex-col flex-auto border-l border-gray-800">

          <div className="chat-body p-4  h-[630px] overflow-y-scroll">
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
                    className={`messages text-sm ${
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
                        className={`px-6 py-3 m-1 rounded-full ${
                          msg.sender === currentUser.username
                            ? "bg-violet-primary"
                            : "bg-white"
                        } max-w-xs lg:max-w-md`}
                      >
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            <p className="p-4 text-center text-sm text-gray-500">
              {messages.length
                ? messages[messages.length - 1].timestamp
                : "No messages yet"}
            </p>
          </div>

          <div className="chat-footer h-fit">
            <div className="relative flex-grow">
              <label className="flex items-center">
                <input
                  className="m-4 rounded-full py-2 pl-3 pr-20 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write your message"
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
        console.log("here", data);
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
