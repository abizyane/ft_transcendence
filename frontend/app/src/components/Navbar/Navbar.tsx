"use client";
import Image from "next/image";
import bar from "../../../public/Bar.svg";
import notification from "../../../public/Notification.svg";
import { Icon } from "@iconify/react";
import notifications from "@iconify/icons-tabler/bell-filled";
import settings from "@iconify/icons-icon-park-solid/setting";
import Logo from "../Logo/Logo";
import { Settings, LogOut } from "lucide-react";
import { handleLogout } from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { log } from "console";
import Searchusers from '../search/searchUsers';
import { useUser } from "@/services/context/usercontext";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { IoNotifications } from "react-icons/io5";
import { useNotif } from "@/services/context/notifContext";
import { useState } from "react";

const Navbar = () => {

  const router = useRouter();
  const { user } = useUser();
  const { notifications, isLoading } = useNotif();
  const [isOpen, setIsOpen] = useState(false);
  if (!user) {
    return null;
  }
  const toggleOpen = () => {
    setIsOpen((prev) => {
      return !prev;
    });
  }
  return (
    <>
      <nav className=" backdrop-blur-md  border-gray-800 flex justify-between right-0 top-0 h-16  md:w-full">
        <div className=" ml-3">
          <Logo />
        </div>

        <div className="hidden lg:flex justify-end md:justify-between md:pl-10 items-center w-full">
          <div className="mt-3 p-4 flex-none">
            <Searchusers />
          </div>

          <div className="md:justify-end md:p-1">
            <div className=" lg:flex items-center">
              <div className=" mx-4 " onClick={toggleOpen}>


                <IoNotifications className="w-7 h-7 text-gray-600" />
                {isOpen && (
                <div className="absolute top-full w-[300px] right-14 bg-gray-800 mt-2 rounded-md shadow-lg max-h-64 overflow-y-auto no-scrollbar">
                  <h2 className="bg-gray-800 text-center text-white text-xl">
                    Notifications
                  </h2>
                  <hr className="border-violet-primary" />
                  {isLoading ? (
                    <div className="p-2 text-white text-center">Loading...</div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notif, i) => {
                      console.log(notif);
                      return (
                        <div  key={i} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer min-h-[50px] space-x-4">
                          <p className="text-sm w-2/3 px-2 font-medium text-white">
                            {notif.content}
                          </p>
                          <p className="text-sm w-1/3 font-medium text-gray-400">
                            {isToday(new Date(notif.timestamp))
                                    ? formatDistanceToNow(new Date(notif.timestamp), {
                                        addSuffix: true,
                                      })
                                    : isYesterday(new Date(notif.timestamp))
                                    ? "Yesterday"
                                    : format(new Date(notif.timestamp), "yyyy-MM-dd")}
                          </p>
                        </div>
                      ) 
                    })
                  ) : (
                    <div className="p-2 text-white text-center ">
                      <p>No notifications found</p>
                    </div>
                  )}
                </div>
              )}
              </div>
              
              <div className=" lg:relative w-12 h-12">


                <span className=" h-3 w-3 bg-green-500 absolute bottom-0 right-1  rounded-full z-0" />
                <img
                  src={user.profile_pic_url}
                  alt="User Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div className="mx-4 justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger className=" text-white">
                    {user.username}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="m-4 bg-gray-800/60 border-violet-primary">
                    <Link href="/settings">
                      <DropdownMenuItem>
                        <Settings className=" text-white" />
                        <span className=" text-white">Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem onClick={() => handleLogout(router)}>
                      <LogOut className=" text-white" />
                      <span className=" text-white">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        {/* log out on mobile  */}
        <div className="w-full lg:hidden flex justify-end items-center">
          <button className="flex justify-end items-center mr-3" onClick={() => handleLogout(router)}>
            <LogOut className=" text-white w-5 h-5" />
            <span className=" text-white text-sm">Log out</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
