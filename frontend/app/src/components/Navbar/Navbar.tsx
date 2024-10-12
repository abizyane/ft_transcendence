"use client";
import Image from "next/image";
import bar from "../../../public/Bar.svg";
import notification from "../../../public/Notification.svg";
import { Icon } from "@iconify/react";
import notifications from "@iconify/icons-tabler/bell-filled";
import settings from "@iconify/icons-icon-park-solid/setting";

import { useEffect, useRef, useState } from "react";
import Logo from "../Logo/Logo";

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
      <nav className=" backdrop-blur-md  border-gray-800 flex justify-between right-0 top-0 h-16  md:w-full">
        <div className="z-50 ml-3">
          <Logo />
        </div>
        <div className="flex justify-end md:justify-between md:pl-10 items-center w-full">
        <div className="search-box p-4 flex-none">
                    <form>
                      <div className="relative">
                        <label>
                          <input
                            className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                            type="text"
                            defaultValue=""
                            placeholder="Search"
                          />
                          <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                            <svg viewBox="0 0 24 24" className="w-6 h-6">
                              <path
                                fill="#bbb"
                                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                              />
                            </svg>
                          </span>
                        </label>
                      </div>
                    </form>
                  </div>
          <div className="md:justify-end md:p-1">

            {/* Notification Icon */}
            <div className="flex space-x-4 md:justify-end">
              <div className="relative" ref={notificationsRef}>
                <div
                  className="bg-gray-800/90 rounded-xl w-9 h-9  md:h-12 md:w-12 flex justify-center items-center"
                  onClick={toggleNotificationsDropdown}
                >
                  <Icon
                    icon={notifications}
                    style={{ fontSize: "28px", color: "white" }}
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

              {/* option Icon phone */}
              <div className="bg-black rounded-xl w-12 h-12 flex justify-center items-center md:hidden">
                <Image
                  src={bar}
                  alt="option-bar"
                  className="w-9 h-9"
                  width={36}
                  height={36}
                />
              </div>

              {/* Settings Icon */}
              <div className="hidden md:block relative" ref={settingsRef}>
                <div
                  className="hidden bg-gray-800/90 rounded-xl w-9 h-9 md:h-12 md:w-12 md:flex justify-center items-center"
                  onClick={toggleSettingsDropdown}
                >
                  <Icon
                    icon={settings}
                    style={{ fontSize: "28px", color: "white" }}
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
              <div className="flex items-center">
  <div className="relative w-12 h-12">
    {/* Dot positioned behind the profile picture, with larger size */}
    <span className="h-3 w-3 bg-green-500 absolute bottom-0 right-1  rounded-full z-0" />
    <img src="/Profil.jpg" alt="User Profile" className="object-cover w-full h-full rounded-full" />
  </div>
  <div className="ml-3">
    <span className="text-white">Name</span>
  </div>
</div>



            </div>
          </div>
        </div>

      </nav>
    </>
  );
};

export default Navbar;
