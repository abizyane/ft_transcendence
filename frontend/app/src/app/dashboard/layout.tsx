import React, { ReactNode } from "react";
import "../globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="flex-grow w-full  p-10 lg:mt-10 lg:w-desktop lg:ml-24 min-w-[316px] lg:p-0 lg:flex lg:justify-center lg:items-center overflow-hidden">
        {children}
        </div>
      <Sidebar />
    </>
  );
}
