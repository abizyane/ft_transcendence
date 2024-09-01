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
      <Sidebar /> 
      <div className="flex flex-col flex-grow">
        <Navbar /> 
        <div className="flex-grow flex items-center justify-center mt-4">
          {children}
        </div>
      </div> 
    </>
  );
}
