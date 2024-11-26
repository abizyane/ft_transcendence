'use client';
import { useState } from 'react';
import Vsbot from "../../../../../public/vsbot.jpg";
import Localgame from "../../../../../public/localgame.jpg";
import Random from "../../../../../public/random.jpg";
// import battleIcon from "@iconify-icons/mdi/sword-fight";
import { Icon } from "@iconify/react";
import Link from "next/link";

const friends = [
  {
    id: 1,
    name: "Ismail Chaiq",
    username: "ismail_chaiq",
    profilePic: "../../../../../Profil.jpg",
  },
  {
    id: 2,
    name: "Achraf Bizyane",
    username: "achraf_bizyane",
    profilePic: "../../../../../Profil.jpg",
  },
];

const Page = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col items-center  h-full">
      <div className="rounded-xl flex flex-col md:flex-row md:flex-wrap gap-6  w-full justify-center items-center p-4 h-full mb-24 lg:mb-0">

        {/* VS AI Card */}
        <div
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`w-[70%] md:w-[40%] xl:w-[30%] h-[22%] md:h-[40%] xl:h-[50%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 1 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
        >
          <Link href="./vsbot/maps" className='h-full'>
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${Vsbot.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
                VS AI
              </div>
            </div>
          </Link>
        </div>


        {/* Local Game Card */}
        <div
          onMouseEnter={() => setHoveredIndex(2)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`w-[70%] md:w-[40%] xl:w-[30%] md:h-[40%]  xl:h-[50%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 2 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
        >
          <Link href="solo/maps" className='h-full'>
            <div className=" h-48 md:h-full bg-cover bg-center" style={{ backgroundImage: `url(${Localgame.src})` }}>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50  text-center text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
                Local Game
              </div>
            </div>
          </Link>
        </div>

        <div
          onMouseEnter={() => setHoveredIndex(3)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`w-[70%] md:w-[40%] xl:w-[30%] md:h-[40%] xl:h-[50%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 3 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
        >
          <Link href="solo/maps" className='h-full'>
            <div className=" h-48 md:h-full bg-cover bg-center" style={{ backgroundImage: `url(${Random.src})` }}>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50  text-center text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
                Random Match
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
