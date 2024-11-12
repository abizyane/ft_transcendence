'use client';
import { useState } from 'react';
import Vsbot from "../../../../public/vsbot.jpg";
import Localgame from "../../../../public/localgame.jpg";
import Random from "../../../../public/random.jpg";
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
        <div
          className={`flex  flex-col w-[70%] md:w-[40%] md:h-[40%] xl:w-[20%]  xl:h-[90%]  rounded-2xl border-4 m-2 border-violet-primary overflow-hidden transform transition-transform duration-300 `}
        >
          <Link href="dashboard/game/solo">
            <div className=" w-full h-48   overflow-hidden">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-1 m-1 rounded-lg border-[1px] bg-gray-600/40 border-violet-primary"
                >
                  <img
                    src={friend.profilePic}
                    alt={`${friend.name}'s profile`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col ml-1">
                    <span className="font-extralight text-nowrap">{friend.name}</span>
                    <span className="text-xs text-black">
                      @{friend.username}
                    </span>
                  </div>
                  <button className="bg-black/50 rounded-full p-1">
                  </button>
                </div>
              ))}
              <div className="absolute  bottom-0 left-0 right-0 bg-black/50 text-center text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
                Invite A Friend
              </div>
            </div>
          </Link>
        </div>

        {/* VS AI Card */}
        <div
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`w-[70%] md:w-[40%] xl:w-[20%] h-[22%] md:h-[40%] xl:h-[90%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 1 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
        >
          <Link href="solo/maps" className='h-full'>
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
          className={`w-[70%] md:w-[40%] xl:w-[20%] md:h-[40%]  xl:h-[90%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 2 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
        >
          <Link href="solo/maps" className='h-full'>
            <div className=" h-48 md:h-full bg-cover bg-center" style={{ backgroundImage: `url(${Localgame.src})` }}>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50  text-center text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
                Local Game
              </div>
            </div>
          </Link>
        </div>

        {/* Random Match Card */}
        <div
          onMouseEnter={() => setHoveredIndex(3)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`w-[70%] md:w-[40%] xl:w-[20%] md:h-[40%] xl:h-[90%] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 3 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
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
