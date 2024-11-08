import React, { useEffect, useState } from "react";
import DoughnutChart from "../Charts/Winrate";
import Image from "next/image";
import { useUser } from "@/services/context/usercontext";
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdPersonAddDisabled } from "react-icons/md";
import { ImBlocked } from "react-icons/im";

type User = {
  name: string;
  profile_pic_url?: string;
  totalXP: number;
  wins: number;
  totalGames: number;
};

type UserInfoProps = {
  user: User;
};

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {

  console.log(user);
  // const [iscurruser , setUser] = useState<true | false>(false);
  const curruser=useUser();
  // if (user.id === curruser)
  
  const { username, profile_pic_url, xp,wins,totalGames} = user;
  const maxXPPerLevel = 1000;
  const level = Math.floor(user.xp / maxXPPerLevel);
  const remainingXP = ((user.xp % maxXPPerLevel) / maxXPPerLevel) * 100;

  const calculateWinRate = (wins: number, totalGames: number) => {
    return totalGames === 0 ? 0 : (wins / totalGames) * 100;
  };
  const winRatePercentage = calculateWinRate(wins, totalGames);

  return (
    <>
<div className="h-full w-full border-[1px] border-violet-primary rounded-xl p-2">
  <div className="flex gap-2">
    <div className="flex-shrink-0 w-3/5">
      <div className="mb-4 max-w-full aspect-square max-h-[300px] mx-auto">
            <img
            src={user.profile_pic_url}
            alt="User Profile"
            className="w-full h-auto object-cover rounded-2xl"
          />
      </div>
      <div className="flex flex-col border-[2px] border-violet-primary rounded-xl m-1 h-auto p-2 ">
        <p className="text-white font-semibold text-xs justify-start flex">Level {level}</p>
        <div className="flex items-center h-2 w-full rounded-xl bg-white">
                <div
                  className="bg-violet-primary h-2 rounded-xl"
                  style={{ width: `${remainingXP}%` }}
                ></div>
              </div>
              <p className="flex justify-end text-white font-light text-xs mr-4 w-full">
                {user.xp} xp
              </p>
            </div>
    </div>
    <div className="flex flex-col w-2/5">
      {curruser.user.id  === user.id ?
        (<div className="border-[2px] border-violet-primary rounded-3xl h-auto p-1 mb-2 mr-2">
        <h1 className="text-base mr-2 lg:text-2xl font-bold text-violet-primary text-center">Welcome!</h1>
        <p className="text-base lg:text-2xl font-bold text-white text-center">{user.username}</p>
      </div>
          ) :
          (
            <div className="border-2 border-violet-primary rounded-3xl p-4 mb-2 mr-2 bg-gray-800 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <button className="px-4 py-2 flex items-center justify-center bg-blue-900 text-white rounded-lg hover:bg-violet-600 transition duration-200 w-full md:w-1/2 lg:w-1/2">
              <MdPersonAddAlt1 className="text-xl" />
            </button>
            <button className="px-4 py-2 flex items-center justify-center bg-red-900 text-white rounded-lg hover:bg-violet-600 transition duration-200 w-full md:w-1/2 lg:w-1/2">
              <ImBlocked className="text-xl" />
            </button>
          </div>
          
          )
      }
      <div className="p-2 rounded-xl border h-full border-violet-primary mr-2">
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-800/20 rounded-xl">
        <p className="text-white font-mont xl:font-bold xl:text-lg text-xs m-1">Win Rate</p>
        <div className="relative w-full h-full flex items-center justify-center">
          <DoughnutChart winpercentage={winRatePercentage}/>
        </div>
      </div>
      </div>
    </div>
  </div>
  </div>
    </>

  );
};


export default UserInfo;
