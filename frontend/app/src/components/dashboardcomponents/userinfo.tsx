import Image from "next/image";
import Marshmellow from "../../../public/marshmello.svg";
import "../../app/globals.css";
import Link from "next/link";
import DoughnutChart from "../Charts/Winrate";
import data from"@/app/data/Dashboarddata.json";
import {useUser} from "@/services/context/usercontext";

const Component = () => {

  const {user} =useUser();
  if (!user)
      return null;
  const totalXP = 2200;
  const maxXPPerLevel = 1000;
  const level = Math.floor(totalXP / maxXPPerLevel);
  const remainingXP = (totalXP % maxXPPerLevel)/10;
  const  wins= 100;
  const  totalGames= 200;

  function calculateWinRate(wins :number, totalGames :number) {
    if (totalGames === 0) return 0;
    return (wins / totalGames) * 100;
}
const percentage = calculateWinRate(wins, totalGames);
  return (
    <>
<div className="h-full w-full border-[1px] border-violet-primary rounded-xl p-2">
  <div className="flex gap-2">
    <div className="flex-shrink-0 w-3/5">
      <div className="mb-4 max-w-full aspect-square max-h-[600px] mx-auto">
            <img
            src={user.profile_pic_url}
            alt="User Profile"
            className="w-full h-auto object-cover rounded-2xl"
          />
      </div>
      <div className="flex flex-col border-[2px] border-violet-primary rounded-xl m-1 h-auto p-2 ">
        <p className="text-white font-semibold text-xs justify-start flex">Level {level}</p>
        <div className="flex items-center h-2 w-5/6 rounded-xl bg-white">
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
      <div className="border-[2px] border-violet-primary rounded-3xl h-auto p-1 mb-2 mr-2">
        <h1 className="text-base mr-2 lg:text-2xl font-bold text-violet-primary text-center">Welcome!</h1>
        <p className="text-base lg:text-2xl font-bold text-white text-center">{user.username}</p>
      </div>
      <div className="p-2 rounded-xl border h-full border-violet-primary mr-2">
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-800/20 rounded-xl">
        <p className="text-white font-mont xl:font-bold xl:text-lg text-xs m-1">Win Rate</p> 
        <div className="relative w-full h-[30%] flex items-center justify-center">
          <DoughnutChart winpercentage={percentage}/>
        </div>
      </div>
      </div>
    </div>
    
    
    
  </div>
</div>
 

     
    </>

  );
};


export default Component;
