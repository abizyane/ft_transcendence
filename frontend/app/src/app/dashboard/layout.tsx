import React, { ReactNode } from "react";
import "../globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
<div className="w-full min-h-screen flex flex-col justify-start items-start">
  <div className="w-full h-16"><Navbar /></div>

  {/* Main content area */}
  <div className="w-full flex lg:flex-row flex-col-reverse justify-center items-center flex-grow overflow-hidden">
    {/* Sidebar section */}
    <div className="lg:h-screen lg:w-24 fixed bottom-0 lg:static  w-full z-50 lg:z-0">
      <Sidebar />
    </div>

    {/* Main content area */}
    <div className="w-full flex justify-center items-center">
      <div className="w-full h-max lg:h-fit flex flex-col justify-center items-center p-2">
        {children}
      </div>
    </div>
  </div>
</div>


);
}

