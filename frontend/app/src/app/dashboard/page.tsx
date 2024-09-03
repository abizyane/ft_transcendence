'use client';
import { useEffect, useState } from 'react';
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
            <Component />

    </>
  );
};

export default Dashboard;
