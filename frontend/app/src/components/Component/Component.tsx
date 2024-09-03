import Image from "next/image";
import Marshmellow from "../../../public/marshmello.svg";
// import Tournement from "../../../public/BgTournement.svg";
import "../../app/globals.css";
import Link from "next/link";
import test from "node:test";

const Component = () => {
  return (
    <>
    {/* <div className="h-full w-full  bg-red-700 border-[1px] border-violet-primary rounded-xl p-2">
        <div className="flex items-start justify-start  mb-2 md:mb-0 md:w-1/3">
        <Image
          src="/Profil.jpg"
          alt="User Profile"
          width={144}
          height={128}
          className="w-34 h-32 rounded-2xl"
        />
        </div>
    </div> */}
<div className="h-full w-auto bg-red-700 border-[1px] border-violet-primary rounded-xl p-4">
  <div className="flex gap-4">
    {/* Left Column with Picture */}
    <div className="flex-shrink-0 w-1/3">
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
      <div className="flex w-auto flex-col border-[2px] border-violet-primary rounded-3xl p-3">
        <p className="text-white font-semibold text-xs">Level 2</p>
        <div className="h-4 rounded-xl bg-white">
          <div className="bg-violet-primary w-auto h-4 rounded-xl"></div>
          <div className="text-white font-semibold m-1 flex justify-end">40 xp</div>
        </div>
      </div>
    </div>
    {/* Right Column with Welcome Message */}
      <div className="flex flex-col w-auto h-20 border-[2px] border-violet-primary rounded-3xl p-3">
        <h1 className="text-xl md:text-4xl font-extrabold text-violet-primary">Welcome!</h1>
        <p className="text-xl md:text-2xl font-bold text-white">Ahallali</p>
      </div>
      {/* Chart Space */}
      {/* <div className="mt-4 bg-gray-700 p-4 rounded-xl border border-gray-600">
        <p className="text-white font-bold text-xl mb-4">Chart Section</p>
        <div className="h-64 bg-gray-600 rounded-xl flex items-center justify-center text-white">
          Chart goes here
        </div>
      </div> */}
  </div>
</div>

      {/* Level Line */}
      {/* <div className="flex flex-col items-start w-full">
        <div className="flex flex-col mb-3 border-[2px] border-violet-primary rounded-3xl p-3 w-full"> */}
          {/* Level Div */}
          {/* <p className="text-white font-bold text-xl">Level 2</p>
          <div className="h-4 rounded-xl bg-white mt-2">
            <div className="bg-violet-primary w-[120px] h-4 rounded-xl"></div>
            <div className="text-white font-bold m-1 flex justify-end">40 xp</div>
          </div> */}
        {/* </div>
        </div>
        </div> */}
        {/* // </div> */}
        {/* </div> */}
      {/* </div> */}
    {/* </div> */}

    {/* Right Column for Welcome Message */}
    {/* <div className="flex-1 flex flex-col justify-between"> */}
      {/* Chart Space */}
      {/* <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 mt-4">
        <p className="text-white font-bold text-xl mb-4">Chart Section</p> */}
        {/* Placeholder for Chart */}
        {/* <div className="h-64 bg-gray-600 rounded-xl flex items-center justify-center text-white">
          Chart goes here
        </div>
      </div>
    </div>
  </div> */}
{/* </div> */}

      {/* <div className="flex flex-col items-start w-full">
        <div className="flex flex-col mb-3 border-[2px] border-violet-primary rounded-3xl p-3 w-full">
          {/* Placeholder for content */}
        {/* <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-violet-primary">Welcome!</h1>
          <p className="text-xl md:text-2xl font-bold text-white">Ahallali</p>
        </div> */}
      {/* </div>
    </div>
  </div>  */}

     
    </>

  );
};


export default Component;
