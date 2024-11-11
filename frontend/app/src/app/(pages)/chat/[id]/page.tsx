"use client";
import { useUser } from "@/services/context/usercontext";
import React, { useState, useEffect } from "react";

const UserChatPage = ({ currentUser, chatUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { username, profile_pic_url, is_online, id } = currentUser;
  useEffect(()=>{
      setMessages(chatUser.messages)
  });

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input, // Store the message text
        sender: currentUser.username, // Set sender as the current user
        timestamp: new Date().toLocaleTimeString(), // Store the timestamp of the message
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add new message to messages array
      setInput(""); // Clear the input field after sending the message
    }
  };
  console.log('test')
  return (
    <div className="h-full">
      <main className="flex-grow flex flex-row min-h-full">
        <section className="flex flex-col flex-auto border-l border-gray-800">
          
          {/* Chat header with user details */}
          <div className="chat-header px-6 py-4 flex bg-gray-800/60 rounded-tl-xl flex-row flex-none justify-between items-center shadow">
            <div className="flex">
              <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                <img
                  className="shadow-md rounded-full w-full h-full object-cover"
                  src={chatUser.user.profile_pic} // Display the other user's profile picture
                  alt={chatUser.user.username} // Alt text should be the other user's username
                />
              </div>
              <div className="text-sm">
                <p className="font-bold">{chatUser.user.username}</p>
                <p>{is_online ? "Online" : "Offline"}</p>
              </div>
            </div>
          </div>

          {/* Chat body displaying messages */}
          <div className="chat-body p-4  h-[630px] overflow-y-scroll">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === currentUser.username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`messages text-sm ${
                    msg.sender === currentUser.username ? "text-white" : "text-gray-700"
                  } grid grid-flow-row gap-2`}
                >
                  <div
                    className={`flex items-center ${
                      msg.sender === currentUser.username ? "flex-row-reverse" : ""
                    }`}
                  >
                    <p
                      className={`px-6 py-3 m-1 rounded-full ${
                        msg.sender === currentUser.username ? "bg-violet-primary" : "bg-white"
                      } max-w-xs lg:max-w-md`}
                    >
                      {msg.message} {/* Render the message text */}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p className="p-4 text-center text-sm text-gray-500">
              {messages.length
                ? messages[messages.length - 1].timestamp // Show the timestamp of the last message
                : "No messages yet"}
            </p>
          </div>

          {/* Chat footer for typing a message */}
          <div className="chat-footer h-fit">
            <div className="relative flex-grow">
              <label className="flex items-center">
                <input
                  className="m-4 rounded-full py-2 pl-3 pr-20 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)} // Update input state on change
                  placeholder="Write your message"
                />
                <button
                  type="button"
                  onClick={handleSendMessage} // Call send message on button click
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



// import React, { useState, useEffect } from "react";
// import { useUser } from "path-to-useUser-hook"; // Assuming this hook gives you the current user
// import UserChatPage from "./UserChatPage"; // Assuming this is the chat page component

export default function Page() {
  const { user: currentUser } = useUser();
  const [chatUser, setChatUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/chat/room/testt", {
          method: "GET",
          credentials: "include",
        });

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
