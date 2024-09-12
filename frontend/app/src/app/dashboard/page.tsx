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
<div className="flex flex-1 relative md:w-full overflow-hidden md:overflow-auto">
  {/* <!-- Main Content Area --> */}
  <div className="flex-1 flex items-center justify-center p-4 relative ">
    <div className="bg-gray-800 rounded-xl w-full max-w-full md:ml-20 md:overflow-hidden md:max-w-screen-2xl border border-gray-600 mb-4 md:mb-0">
      {/* <!-- Child elements go here --> */}
          <Component/>
      {/* <p className="text-gray-400">This is some content inside the parent div.</p> */}
      {/* More content here */}
      {/* <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Button</button> */}
    </div>
  </div>
</div>


    </>
  );
};

export default Dashboard;
