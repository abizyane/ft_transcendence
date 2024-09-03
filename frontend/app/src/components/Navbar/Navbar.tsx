"use client";
import Image from "next/image";
import bar from "../../../public/Bar.svg";
import notification from "../../../public/Notification.svg";
import { Icon } from "@iconify/react";
import notifications from "@iconify/icons-tabler/bell-filled";
import settings from "@iconify/icons-icon-park-solid/setting";

import { useEffect, useRef, useState } from "react";

//function to check if notif or settings clicked

const Navbar = () => {
  const notificationsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleNotificationsDropdown = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isSettingsOpen) setIsSettingsOpen(false); // Close settings if open
  };

  const toggleSettingsDropdown = () => {
    setIsSettingsOpen(!isSettingsOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false); // Close notifications if open
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target as Node)
    ) {
      setIsNotificationsOpen(false);
    }
    if (
      settingsRef.current &&
      !settingsRef.current.contains(event.target as Node)
    ) {
      setIsSettingsOpen(false);
    }
  };

  useEffect(() => {
    if (isNotificationsOpen || isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen, isSettingsOpen]);

  return (
    <>
<nav className="absolute right-0 top-0 m-4 h-10 rounded-xl z-10 md:w-desktop">
      <div className="flex justify-between md:justify-between md:pl-10 items-center w-full">
        {/* Search Bar */}
        <div className="hidden bg-black rounded-xl w-[20%] md:w-[260px] md:h-[10%] border-[0.5px] md:flex">
          <svg
            className="w-6 h-6 text-gray-500 m-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m1.1-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
            ></path>
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Notification Icon */}
        <div className="flex space-x-4 md:justify-end">
          <div className="relative" ref={notificationsRef}>
            <div
              className="bg-black rounded-md w-12 h-12 flex justify-center items-center"
              onClick={toggleNotificationsDropdown}
            >
              <Icon
                icon={notifications}
                style={{ fontSize: "28px", color: "gray" }}
                className="w-7 hover:cursor-pointer"
              />
            </div>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black text-white rounded-md shadow-lg">
                <ul>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer border border-white">
                    Notification 1
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer border border-white">
                    Notification 2
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer border border-white">
                    Notification 3
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Option Icon (Phone) */}
          <div className="bg-black rounded-md w-12 h-12 flex justify-center items-center md:hidden">
            <Image
              src={bar}
              alt="option-bar"
              className="w-7 h-7"
              width={48}
              height={48}
            />
          </div>

          {/* Settings Icon */}
          <div className="hidden md:block relative" ref={settingsRef}>
            <div
              className="bg-black rounded-md w-12 h-12 flex justify-center items-center"
              onClick={toggleSettingsDropdown}
            >
              <Icon
                icon={settings}
                style={{ fontSize: "28px", color: "gray" }}
                className="w-7 hover:cursor-pointer"
              />
            </div>
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black text-white rounded-md shadow-lg">
                <ul>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer border border-white">
                    Settings 1
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer border border-white">
                    Settings 2
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer border border-white">
                    Settings 3
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="hidden md:block relative">
            <Image
              src="/Profil.jpg"
              alt="User Profile"
              width={64}
              height={48}
            />
          </div>

          <div className="hidden md:block flex-col items-center">
            <span className="text-white">Name</span>
            <div className="flex items-center">
              <span className="ml-4 text-white">online</span>
              <span className="h-2 w-2 bg-green-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </nav>

    </>
  );
};

export default Navbar;
