"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const UserChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  const { username, profile_pic_url, is_online } = user;

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        sender: "me",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
    }
  };

  return (
    <div className="h-full">
      <main className="flex-grow flex flex-row min-h-full">
        <section className="flex flex-col flex-auto border-l border-gray-800">
          <div className="chat-header px-6 py-4 flex bg-gray-800/60 rounded-tl-xl flex-row flex-none justify-between items-center shadow">
            <div className="flex">
              <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                <img
                  className="shadow-md rounded-full w-full h-full object-cover"
                  src={profile_pic_url} // Fallback image
                  alt={username}
                />
              </div>
              <div className="text-sm">
                <p className="font-bold">{username}</p>
                <p>{is_online}</p>
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
  const [user, setUser] = useState(null); // Start with null, to show loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const param=useParams();
  const userId =param.id; // Replace with actual userId, this can be from URL, context, or props
  useEffect(() => {
    const fetchUser = async () => {


      try {
        const response = await fetch("http://localhost:8000/api/userid", {
          method: "POST",
          body: JSON.stringify({ id: userId }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // If you're using cookies or session authentication
        });

        if (!response.ok) {
          throw new Error("User not found or API error");
        }

        const data = await response.json();
        setUser(data); // Set the user data
      } catch (err) {
        setError(err.message); // Handle error if fetching fails
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchUser();
  }, []); // Empty dependency array means this runs once when component mounts

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner or text
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if the fetch fails
  }

  if (!user) {
    return <div>No user data found.</div>; // Fallback if no user data is available
  }

  return <UserChatPage user={user} />;
}
