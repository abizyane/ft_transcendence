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
        <div className="flex-grow ">
          {children}
        </div>
      <Sidebar /> 
    </>
  );
}
