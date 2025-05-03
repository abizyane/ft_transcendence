"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AiFillAppstore } from "react-icons/ai";
import { IoStatsChart, IoGameController } from "react-icons/io5";
import { BsFillChatDotsFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { useUser } from "@/services/context/usercontext";

export default function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const isActive = (path: string) => pathname.startsWith(path);
  return (
    <div className="bottom-0 left-0 px-4 w-full lg:w-24 h-full lg:justify-center lg:items-center lg:flex backdrop-blur-md">
      <div className="w-full flex p-4 flex-row space-x-8 lg:space-x-0 lg:space-y-12 items-center justify-center lg:flex-col">
        <Link href={`/profile/${user.id}`}>
          <AiFillAppstore
            className={`w-6 h-6 ${
              isActive(`/profile`) ? "text-white" : "text-gray-700"
            }`}
          />
        </Link>
        <Link href="/dashboard">
          <IoStatsChart
            className={`w-6 h-6 ${
              isActive("/dashboard") ? "text-white" : "text-gray-700"
            }`}
          />
        </Link>
        <Link href="/game">
          <IoGameController
            className={`w-6 h-6 ${
              isActive("/game") ? "text-white" : "text-gray-700"
            }`}
          />
        </Link>
        <Link href="/chat">
          <BsFillChatDotsFill
            className={`w-6 h-6 ${
              isActive("/chat") ? "text-white" : "text-gray-700"
            }`}
          />
        </Link>
        <Link href={`/friends/${user.id}`}>
          <FaUserFriends
            className={`w-6 h-6 ${
              isActive(`/friends/${user.id}`) ? "text-white" : "text-gray-700"
            }`}
          />
        </Link>
        <Link href="/ranking">
          <FaRankingStar
            className={`w-6 h-6 ${
              isActive("/ranking") ? "text-white" : "text-gray-700"
            }`}
          />
        </Link>
      </div>
    </div>
  );
}
