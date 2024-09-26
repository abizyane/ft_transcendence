import React, { ReactNode } from "react";
import "../globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
<div className="w-full h-screen flex flex-col justify-start items-start">
  <div className="w-full h-16 min-h-16 "><Navbar /></div>
  <div className="w-full h-full  flex lg:flex-row  flex-col-reverse  overflow-y-hidden">
   <div className="lg:h-screen lg:w-24 w-full z-50 lg:z-0">
    <Sidebar/>
   </div>
   <div className="w-full h-full overflow-y-auto flex justify-center items-center">
    <div className="w-full h-max  lg:h-fit flex justify-center items-center  p-2">
    {children}
    </div>
   </div>
  </div>
  
  </div>
);
}
