'use client'
import React, { ReactNode } from "react";
import "../globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import { UserProvider } from "@/services/context/usercontext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <UserProvider>
      <div className="w-full min-h-screen flex flex-col justify-start items-start">
        <div className="absolute w-full z-50"><Navbar /></div>

        <div className="w-full flex lg:flex-row flex-grow">
          <div className="lg:w-24 fixed bottom-0 lg:static w-full z-20 lg:z-0">
            <Sidebar />
          </div>

          <div className="w-full mt-10">
            <div className="w-full h-full lg:h-full flex flex-col justify-center items-center p-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </UserProvider>
  );
}
