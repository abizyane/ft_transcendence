'use client';
import { useEffect, useState } from 'react';
import MobileNavbar from "@/components/Navbar/MobileNavbar";
import WebNavbar from "@/components/Navbar/WebNavbar";
import MobileSidebar from "@/components/Sidebar/MobileSidebar";
import WebSidebar from "@/components/Sidebar/WebSidebar";
import Component from '@/components/Component/Component';

const Dashboard = () => {
  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if(window.innerWidth <= 655 || window.innerHeight <= 655){
  //       setIsMobile(true);
  //     }else{
  //       setIsMobile(false);
  //     }
  //   };

  //   handleResize(); 

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  return (
    <>
        <div className='p-6 flex justify-center items-center overflow-hidden max-h-screen'>
        <Component />
        </div>

    </>
  );
};

export default Dashboard;
