import React, { ReactNode } from 'react';
import "../globals.css";
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <Navbar /> 
        <div className="flex-grow w-full mt-10 xs:mt-0 ">
          {children}
        </div>
      <Sidebar /> 
    </>
  );
}
