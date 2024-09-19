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
      <div className="flex-grow p-10 lg:mt-10 lg:w-desktop lg:ml-24 min-w-36 lg:p-10">
        {children}
        </div>
      <Sidebar />
    </>
  );
}
