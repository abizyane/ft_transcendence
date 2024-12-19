'use client';
import { useState } from 'react';
import solo from "../../../../public/solo.jpeg";
import multiplayers from "../../../../public/multiplayers.jpeg";
import Link from "next/link";
import Instructions from '@/components/Instructions/page';



const Page = () => {

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modelopen,setModelOpen]=useState(false);
  const handlehowtoplay=()=>{
    setModelOpen(true);
  }
  const handleCloseInstructions = () => {
    setModelOpen(false);
  };
  return (
    <>
           <div className="mb-8">
      {modelopen ? (
          <div className="flex justify-center items-start w-fit">
            <Instructions setModal={setModelOpen} />
          </div>
      ) : (
        <div className= "h-12 w-44   bg-gray-800/60 border border-violet-primary rounded-xl text-center">

        <button className="text-white p-2 w-full h-full text-center hover:bg-gray-800 rounded-xl" onClick={handlehowtoplay}>How to Play</button>
        </div>
      )}
    </div>
      <div className=" rounded-xl flex flex-col gap-4  w-fit  h-fit justify-center items-center md:flex-row mb-24 lg:mb-0 z-10">
        <div
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`min-w-[300px] max-w-[500px] lg:min-w-[400px] lg:max-w-[600px] xl:min-w-[500px] xl:max-w-[900px] m-2 mt-8 md:mt-2 h-fit rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 0 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
        >
          <Link href="/game/solo">
            <div
              className="relative h-[30vh] md:h-[70vh] w-full z-0 bg-cover bg-center rounded-t-xl"
              style={{ backgroundImage: `url(${solo.src})` }}
            >
              <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-xl md:text-3xl font-bold text-white rounded-b-xl p-4">
                Mode Solo
              </p>
            </div>
          </Link>
        </div>

        <div
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`min-w-[300px] max-w-[500px] lg:min-w-[400px] lg:max-w-[600px] xl:min-w-[500px] xl:max-w-[900px] m-2 mt-8 md:mt-2 h-fit rounded-2xl border-4 border-violet-primary overflow-hidden transform transition-transform duration-300 ${hoveredIndex === 1 ? 'scale-105' : hoveredIndex === null ? 'scale-100' : 'blur-sm'}`}
        >
          <Link href="/game/tournaments">
            <div
              className="relative h-[30vh] md:h-[70vh] w-full z-0 bg-cover bg-center rounded-t-xl"
              style={{ backgroundImage: `url(${multiplayers.src})` }}
            >
              <p className="absolute bottom-0 text-nowrap left-0 right-0 bg-black/50 text-center text-xl md:text-3xl font-bold text-white rounded-b-xl p-4">
                Mode Tournaments
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
