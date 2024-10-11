import React, { ReactNode } from "react";
import "../globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

interface RankingLayoutProps {
  children: ReactNode;
}

export default function RankingLayout({ children }: RankingLayoutProps) {
  return (
<div className="w-full  flex flex-col justify-start items-start">
  <div className="w-full"><Navbar /></div>

  {/* Main content area */}
  <div className="w-full flex lg:flex-row flex-grow">
    {/* Sidebar section */}
    <div className="lg:w-24  fixed bottom-0 lg:static  w-full z-50 lg:z-0">
      <Sidebar />
    </div>

    {/* Main content area */}
    <div className="w-full ">
      <div className="w-full h-[91vh]  flex flex-col justify-center items-center p-2">
        {children}
      </div>
    </div>
  </div>
</div>

);
}
