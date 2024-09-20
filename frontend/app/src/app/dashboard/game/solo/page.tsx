import Vsbot from "../../../../../public/vsbot.jpeg";
import Localgame from "../../../../../public/localgame.jpeg";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div className=" bg-gray-800 bg-opacity-60 lg:p-10 rounded-xl flex flex-col gap-4 border-[1px] border-violet-primary lg:w-full  md:gap-6  mb-10 w-full md:min-w-[400px] md:max-w-[900px] md:min-h-[700px] md:max-h-[800px]  lg:min-w-[700px] lg:max-w-[1200px] lg:min-h-[900px] lg:max-h-[1200px]justify-center items-center md:flex-row">
         <Link  href="dashboard/game/solo">
        <div className="min-w-[200px] max-w-[400px]  lg:max-w-[600px]   m-2 mt-8 md:mt-2  h-fit flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden">
          {/* <div className="h-1/4">
            <img
              src={vsbot.src}
              alt="mode solo"
              className="w-full h-full  lg:max-w-[600px]  object-cover rounded-t-xl"
            />
          </div> */}
          <div className="bg-black h-1/4 text-center text-xl md:text-3xl font-bold text-white rounded-b-xl">
            Invite A Friend
          </div>
        </div>
          </Link>
        <Link  href="dashboard/game/tournements">
        <div className=" min-w-[200px] max-w-[400px]  lg:max-w-[600px]  m-2 h-1/2 flex flex-col rounded-2xl mb-8 md:mb-2 border-4 border-violet-primary ">
        <div className="h-1/4">
            <img
              src={Vsbot.src}
              alt="mode solo"
              className="w-full h-full  lg:max-w-[600px]  object-cover rounded-t-xl"
            />
          </div>
          <div className="bg-black h-1/4 text-center text-xl md:text-3xl font-bold text-white rounded-b-xl">
           VS Bot
          </div>
        
        </div>
        </Link>


        <Link  href="dashboard/game/tournements">
        <div className=" min-w-[200px] max-w-[400px]  lg:max-w-[600px]  m-2 h-1/2 flex flex-col rounded-2xl mb-8 md:mb-2 border-4 border-violet-primary ">
        <div className="h-1/4">
            <img
              src={Localgame.src}
              alt="mode solo"
              className="w-full h-full  lg:max-w-[600px]  object-cover rounded-t-xl"
            />
          </div>
          <div className="bg-black h-1/4 text-center text-xl md:text-3xl font-bold text-white rounded-b-xl">
            Local Game
          </div>
        
        </div>
        </Link>

        <Link  href="dashboard/game/tournements">
        <div className=" min-w-[200px] max-w-[400px]  lg:max-w-[600px]  m-2 h-1/2 flex flex-col rounded-2xl mb-8 md:mb-2 border-4 border-violet-primary ">
          <div className="h-1/4">
            {/* <img
              src={multiplayers.src}
              alt="mode multiplayers"
              className="w-full h-full   lg:max-w-[600px]   object-cover rounded-t-xl"
            /> */}
            test
          </div>
          <div className="bg-black h-1/4 text-center text-xl md:text-3xl font-bold text-white rounded-b-xl">
            Random Match
          </div>
        
        </div>
        </Link>

      </div>
    </>
  );
};

export default Page;