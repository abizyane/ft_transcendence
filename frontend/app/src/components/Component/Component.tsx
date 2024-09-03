import Image from "next/image";
import Marshmellow from "../../../public/marshmello.svg";
// import Tournement from "../../../public/BgTournement.svg";
import "../../app/globals.css";
import Link from "next/link";
import test from "node:test";

const Component = () => {
  return (
    <>
       {/* user info */}
       <div className=" flex p-4 border-[2px] border-gray-800 rounded-3xl">
  {/* Left Column with Picture and Level Line */}
  <div className="flex flex-col items-start">
    {/* Picture */}
    <div className="mb-2">
    <Image
            src="/Profil.jpg"
            alt="User Profile"
            width={144}
            height={128}
            className="w-36 h-32 rounded-2xl" 
          />
    </div>

    {/* Level Line */}
    <div className="w-64 h-24 p-3 rounded-3xl border-[2px] border-violet-primary  mt-2 flex flex-col">
      <p className="text-white font-bold text-xl">Level 2</p>
      <div className="h-4 rounded-xl bg-white">
          <div className="bg-violet-primary w-[120px] h-4 rounded-xl">
          </div>
          <div className="text-white font-bold m-1 flex justify-end">
            40 xp
          </div>
      </div>
    </div>
  </div>
      {/* You can add level progress here */}

  {/* Right Column with Welcome Message, Name, and Circular Chart */}
  {/* <div className="flex-1 flex flex-col  ml-4 ">
    <div className="flex flex-col mb-3 border-[2px] border-violet-primary rounded-3xl p-3"> */}
      {/* Welcome Message and Name */}
      {/* <div>
        <h1 className="text-4xl font-extrabold text-violet-primary">Welcome!</h1>
        <p className="text-2xl font-bold text-white">Ahallali</p>
      </div>
    </div> */}

    {/* Circular Win Rate Chart */}
    {/* <div className="flex items-center justify-center w-full h-32">
      <div className="w-24 h-24 border-4 border-gray-300 rounded-full flex items-center justify-center">
        Placeholder for win rate chart */}
        {/* <p className="text-center text-gray-600">Chart</p>
      </div>
    </div> */}
  </div>
{/* </div>


  {/* <div className="flex-1 border w-full border-solid border-gray-300 flex items-center justify-center">
    <div className="w-full h-full flex items-center justify-center">
      minutes spending on game
    </div>
  </div>
  <div className="flex-1 border w-full border-solid border-gray-300 flex items-center justify-center">
    <div className="w-full h-full flex items-center justify-center">
      history
    </div>
  </div>
  <div className="flex-1 border w-full border-solid border-gray-300 flex items-center justify-center">
    <div className="w-full h-full flex items-center justify-center">
      top players
    </div>
  </div>
  <div className="flex-1 border w-full border-solid border-gray-300 flex items-center justify-center">
    <div className="w-full h-full flex items-center justify-center">
      friends
    </div>
  </div> */}
  {/* </div>  */}
    </>

  );
};

export default Component;
