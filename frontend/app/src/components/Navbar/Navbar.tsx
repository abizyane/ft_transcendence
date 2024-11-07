"use client";
import Image from "next/image";
import bar from "../../../public/Bar.svg";
import notification from "../../../public/Notification.svg";
import { Icon } from "@iconify/react";
import notifications from "@iconify/icons-tabler/bell-filled";
import settings from "@iconify/icons-icon-park-solid/setting";
import { useUser } from "@/services/context/usercontext";
import { useEffect, useRef, useState } from "react";
import Logo from "../Logo/Logo";
import { Settings, LogOut } from "lucide-react";
import { handleLogout } from "@/services/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
//function to check if notif or settings clicked

const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();
  if (!user) {
    // Optional: Handle the case where user data isn't available
    return null;
  }


  return (
    <>
      <nav className=" backdrop-blur-md  border-gray-800 flex justify-between right-0 top-0 h-16  md:w-full">
        <div className="z-50 ml-3">
          <Logo />
        </div>
        <div className="flex justify-end md:justify-between md:pl-10 items-center w-full">
          <div className="mt-3 p-4 flex-none">
            <form>
              <div className="relative  ">
                <label>
                  <input
                    className=" hidden lg:block rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                    type="text"
                    defaultValue=""
                    placeholder="Search"
                  />
                  <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                    <svg
                      viewBox="0 0 24 24"
                      className="hidden lg:block w-6 h-6"
                    >
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
            <div className=" hidden lg:flex items-center">
              <div className="lg:relative w-12 h-12">
                <span className=" h-3 w-3 bg-green-500 absolute bottom-0 right-1  rounded-full z-0" />
                <img
                  src={user.profile_pic_url}
                  alt="User Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div className="mx-4 hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className=" text-white">
                    {user.username}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="m-4 bg-gray-800/60 border-violet-primary">
                    <DropdownMenuItem >
                      <Settings className=" text-white" />
                      <span className=" text-white">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem onClick={()=>handleLogout(router)}>
                      <LogOut className=" text-white" />
                      <span className=" text-white">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
