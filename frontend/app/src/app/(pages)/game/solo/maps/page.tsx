'use client';
import { useState } from 'react';
import Mars from "../../../../../../public/Mars.jpeg";
import Earth from "../../../../../../public/Earth.jpeg";
import Jupiter from "../../../../../../public/Jupiter.jpeg";
import Link from "next/link";

const ChooseGalaxy = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <div className="h-[80%] gap-4 rounded-xl p-2 w-full flex flex-col items-center ">
        <h1 className="w-full text-white text-center font-bold md:text-2xl lg:text-3xl mb-4 lg:mb-0">
          CHOOSE YOUR GALAXY
        </h1>

        {/* Flex container for cards */}
        <div className="flex flex-col md:flex-row md:justify-center w-full h-[113%] md:h-[76%] lg:h-[85%] flex-none items-center ">
          {/* Mars Card */}
          <div
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`w-[90%] md:w-[40%] xl:w-[20%] h-[24%] md:h-[70%] xl:h-[90%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 0 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
          >
            <Link href="maps/matchmaking" className="h-full w-full">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${Mars.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
                  Mars
                </div>
              </div>
            </Link>
          </div>

          <div
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`w-[90%] md:w-[40%] xl:w-[20%] h-[24%] md:h-[70%] xl:h-[90%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 1 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
          >
            <Link href="maps/matchmaking" className="h-full w-full">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${Earth.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
                Earth
                </div>
              </div>
            </Link>
          </div>

          <div
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`w-[90%] md:w-[40%] xl:w-[20%] h-[24%] md:h-[70%] xl:h-[90%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 2 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
          >
            <Link href="maps/matchmaking" className="h-full w-full">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${Jupiter.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
                Jupiter
                </div>
              </div>
            </Link>
          </div>
          <div className="bg-red-500 align-text-bottom">

        <p className=" mt-2 md:hidden p-2 rounded-2xl text-white text-xs md:text-xl lg:text-2xl font-bold text-center">
          OR CHOOSE A <Link href="maps/matchmaking" className="text-blue-800">SIMPLE COLOR</Link>
        </p>
          </div>
        </div>
        <p className="md:mb-22 lg:mt-auto rounded-2xl text-white text-xs md:text-xl lg:text-2xl font-bold text-center">
          OR CHOOSE A <Link href="maps/matchmaking" className="hover:text-gray-800 underline  " >SIMPLE COLOR</Link>
        </p>
      </div>
    </>
  );
};

export default ChooseGalaxy;
