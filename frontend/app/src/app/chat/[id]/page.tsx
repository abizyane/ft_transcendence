"use client";
import { useRouter } from "next/router";
import React, { useState } from "react";

const UserChatPage = () => {
  // const router = useRouter();
  // const { id } = router.query; // Extract the ID from the URL
  const [messages, setMessages] = useState([]); // State to hold chat messages
  const [input, setInput] = useState(""); // State to hold input value

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        sender: "me", // Change based on sender
        timestamp: new Date().toLocaleTimeString(), // Get current time
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput(""); // Clear the input field after sending
    }
  };

  return (
    <div className="h-full">
      <main className="flex-grow flex flex-row min-h-full">
        <section className="flex flex-col flex-auto border-l border-gray-800">
          <div className="chat-header px-6 py-4 flex  bg-gray-800   rounded-tr-xl flex-row flex-none justify-between items-center shadow">
            <div className="flex">
              <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                <img
                  className="shadow-md rounded-full w-full h-full object-cover"
                  src="https://randomuser.me/api/portraits/women/33.jpg"
                  alt=""
                />
              </div>
              <div className="text-sm">
                <p className="font-bold">Scarlett Johansson</p>
                <p>Active 1h ago</p>
              </div>
            </div>
          </div>
          <div className="chat-body p-4 flex-1 overflow-y-scroll">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`messages text-sm ${
                    msg.sender === "me" ? "text-white" : "text-gray-700"
                  } grid grid-flow-row gap-2`}
                >
                  <div
                    className={`flex items-center ${
                      msg.sender === "me" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <p
                      className={`px-6 py-3 m-1 rounded-full ${
                        msg.sender === "me" ? "bg-violet-primary" : "bg-white"
                      } max-w-xs lg:max-w-md`}
                    >
                      {msg.text}
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
                  placeholder="write your message"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="absolute top-1/2 transform -translate-y-1/2 right-4 flex flex-shrink-0 focus:outline-none text-violet-primary hover:text-blue-700 px-4 py-1"
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

export default UserChatPage;
