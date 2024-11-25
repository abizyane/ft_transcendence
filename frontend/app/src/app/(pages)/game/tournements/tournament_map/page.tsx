import Profil from "../../../../../../public/Profil.jpg";
import Line from "../../../../../../public/Group 1171275822.svg";
import Line1 from "../../../../../../public/Group 1171275820.svg";
import Line2 from "../../../../../../public/Line 12.svg";
import Line3 from "../../../../../../public/Line 13.svg";
import Trophy from "../../../../../../public/Trophy.png";

export default function AstroTournament() {
  return (
    <div className="mb-24 mt-6 lg:mb-0 lg:mt-0 bg-gray-800/50 border border-violet-primary rounded-xl text-center w-full lg:w-fit  lg:p-4 m-4 p-4 flex flex-col">
      <div className="flex justify-center items-center mb-8 lg:mb-0 lg:ml-8">
        <img
          src={Profil.src}
          alt="Tournament pic"
          className="object-cover w-14 h-14 lg:w-20 lg:h-20 rounded-full"
        />
        <h1 className="text-white ml-4 text-lg md:text-xl lg:text-2xl">
          Name Tournament
        </h1>
      </div>
      <div className="p-2 w-full  mt-4    lg:flex lg:flex-row lg:p-0 ">
        <div className="flex items-center justify-around  w-full lg:flex lg:flex-col  lg:items-end lg:w-20">
          <img
            src={Profil.src}
            alt="Tournament pic"
            className="w-14 h-14 md:w-16 md:h-16 lg:mt-6 lg:ml-6 object-cover rounded-full"
          />
          <img
            src={Profil.src}
            alt="Tournament pic2"
            className="w-14 h-14 md:w-16 md:h-16 lg:mt-60 object-cover rounded-full"
          />
        </div>
        <div className="hidden mt-10 h-[350px] lg:block">
          <img
            src={Line1.src}
            alt="Line"
            className="w-[200]px h-[350px] "
          />
        </div>
        <div className="flex justify-center items-center h-fit lg:hidden">
          <img
            src={Line.src}
            alt="Line"
            className="w-[50%] h-[20%]  md:h-[3%] z-50"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-8 lg:gap-2 lg:flex-row lg:mt-6">
          <img
            src={Profil.src}
            alt="Tournament pic finale"
            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-full"
          />
          <img
            src={Trophy.src}
            alt="Prize pic"
            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-full border border-violet-primary p-2"
          />
          <img
            src={Profil.src}
            alt="Tournament pic finale"
            className="w-14 h-14 md:w-16 md:h-16 z-50 object-cover rounded-full"
          />
        </div>
        <div className="hidden mt-10 h-[330px] lg:block">
          <img
            src={Line1.src}
            alt="Line"
            className="w-full h-[350px]   transform scale-x-[-1]"
          />
        </div>
        <div className="lg:hidden flex justify-center items-center h-fit">
          <img
            src={Line.src}
            alt="Line"
            className="w-[50%] h-[20%]  z-50 transform scale-y-[-1]"
          />
        </div>
        <div className="flex justify-around items-end  w-full lg:flex lg:flex-col lg:items-start lg:w-24 ">
          <img
            src={Profil.src}
            alt="Tournament pic"
            className="w-14 h-14 md:w-16 md:h-16 lg:mt-6 lg:mr-6 object-cover rounded-full"
          />
          <img
            src={Profil.src}
            alt="Tournament pic"
            className="w-14 h-14 md:w-16 md:h-16 lg:mt-60 object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
