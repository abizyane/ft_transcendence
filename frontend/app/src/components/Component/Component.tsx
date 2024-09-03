import Image from "next/image";
import Marshmellow from "../../../public/marshmello.svg";
// import Tournement from "../../../public/BgTournement.svg";
import "../../app/globals.css";
import Link from "next/link";
import DoughnutChart from "../Charts/Winrate";

const Component = () => {
  return (
    <>
<div className="h-full w-auto border-[1px] border-violet-primary rounded-xl p-3">
  <div className="flex gap-2">
    {/* Left Column with Picture */}
    <div className="flex-shrink-0 w-3/5">
      <div className="mb-2">
        <Image
          src="/Profil.jpg"
          alt="User Profile"
          width={144}
          height={128}
          className="w-full h-auto rounded-2xl"
        />
      </div>
      {/* Level Div */}
      <div className="flex flex-col border-[2px] border-violet-primary rounded-3xl m-1 h-auto p-2">
        <p className="text-white font-semibold text-xs justify-start flex">Level 2</p>
        <div className="flex items-center h-2 w-5/6 rounded-xl bg-white">
          <div className="bg-violet-primary w-5/6 h-2 rounded-xl"></div>
        </div>
        <p className="flex justify-end text-white font-light text-xs mr-4 w-full">40 xp</p>
      </div>
    </div>
    
    {/* Right Column with Welcome Message and Chart */}
    <div className="flex flex-col w-2/5">
      {/* Welcome Message */}
      <div className="border-[2px] border-violet-primary rounded-3xl h-auto p-1 mb-1">
        <h1 className="text-base mr-2 md:text-2xl font-bold text-violet-primary">Welcome!</h1>
        <p className="text-base md:text-2xl font-bold text-white">Ahallali</p>
      </div>
      
      {/* Chart Section */}
      <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 h-auto">
        <p className="text-white font-bold text-xl mb-4">Chart Section</p>
        {/* <div className="h-64 bg-gray-600 rounded-xl flex items-center justify-center text-white">
           <DoughnutChart />
        </div> */}
      </div>
    </div>
  </div>
</div>

     
    </>

  );
};


export default Component;
