import Mars from "../../../../../../public/Mars.jpeg";
import Earth from "../../../../../../public/Earth.jpeg";
import Jupiter from "../../../../../../public/Jupiter.jpeg";
import Link from "next/link";


const Page = () => {
  return (
    <>
<div className="bg-custom-gradient border-2 border-violet-primary w-full h-full p-8 gap-4 rounded-xl mb-10 lg:m-10">
  {/* Title at the top */}
  <h1 className="w-full text-white text-center font-bold text-nowrap md:text-2xl lg:text-3xl mb-6">
    CHOOSE YOUR GALAXY
  </h1>

  {/* Flex container for images */}
  <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
    <div className="w-full lg:w-1/3 border-[2px] border-violet-primary rounded-xl flex flex-col">
      <div className="flex-grow">
        <img src={Mars.src} alt="MarsMap" className="w-full h-full object-cover rounded-t-xl" />
      </div>
      <div className="bg-black h-[50px] text-white text-center font-bold rounded-b-xl text-xl lg:text-2xl lg:font-bold">
        Mars
      </div>
    </div>

    <div className="w-full lg:w-1/3 border-[2px] border-violet-primary rounded-xl flex flex-col">
      <div className="flex-grow">
        <img src={Earth.src} alt="EarthMap" className="w-full h-full object-cover rounded-t-xl" />
      </div>
      <div className="bg-black opacity-95 h-[50px] text-white text-center font-bold rounded-b-xl text-xl lg:text-2xl lg:font-bold">
        EARTH
      </div>
    </div>

    <div className="w-full lg:w-1/3 border-[2px] border-violet-primary rounded-xl flex flex-col">
      <div className="flex-grow">
        <img src={Jupiter.src} alt="JupiterMap" className="w-full h-full object-cover rounded-t-xl" />
      </div>
      <div className="bg-black h-[50px] text-white text-center font-bold rounded-b-xl text-xl lg:text-2xl lg:font-bold">
        Jupiter
      </div>
    </div>
  </div>
  <p className=" p-2 rounded-2xl text-white text-xs md:text-xl text-nowrap w-full lg:text-2xl font-bold text-center">
    OR CHOOSE A <Link href="#" className="text-blue-800">SIMPLE COLOR</Link>
  </p>

</div>


    </>
  );
};

export default Page;
