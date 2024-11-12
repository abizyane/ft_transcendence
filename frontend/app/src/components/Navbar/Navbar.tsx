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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { log } from "console";
import Searchusers from '../search/searchUsers';
import { useUser } from "@/services/context/usercontext";


const Navbar = () => {

  const router = useRouter();
  const { user } = useUser();
  
  if (!user) {
    return null;
  }
  return (
    <>
      <nav className=" backdrop-blur-md  border-gray-800 flex justify-between right-0 top-0 h-16  md:w-full">
        <div className=" ml-3">
          <Logo />
        </div>
        <div className="flex justify-end md:justify-between md:pl-10 items-center w-full">
          <div className="mt-3 p-4 flex-none">
              <Searchusers/>
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
      </nav>
    </>
  );
};

export default Navbar;
