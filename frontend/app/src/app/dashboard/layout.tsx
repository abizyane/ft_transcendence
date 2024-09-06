import React, { ReactNode } from 'react';
import "../globals.css";
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';

export default function  AuthLayout  ({ children  } )  {
  return (
    <>
               <Sidebar /> 
                <div className="flex flex-col flex-grow ">
                        <Navbar /> 
                        <div className="flex-grow flex items-center justify-center mt-4">
                                {children}
                        </div>
                    </div> 
    </>
  );
};

