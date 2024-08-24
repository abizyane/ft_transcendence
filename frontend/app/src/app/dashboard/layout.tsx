import React, { ReactNode } from 'react';
import "../globals.css";
import WebSidebar from '@/components/Sidebar/WebSidebar';
import WebNavbar from '@/components/Navbar/WebNavbar';

export default function  AuthLayout  ({ children  } )  {
  return (
    <>
               <WebSidebar /> 
                <div className="flex flex-col flex-grow">
                        <WebNavbar /> 
                        <div className="flex-grow flex items-center justify-center mt-4">
                                {children}
                        </div>
                    </div> 
    </>
  );
};

