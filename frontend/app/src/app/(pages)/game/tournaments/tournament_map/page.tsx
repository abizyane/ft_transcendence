import Profil from "../../../../../../public/Profil.jpg";
import Line from "../../../../../../public/Group 1171275822.svg";
import Line1 from "../../../../../../public/Group 1171275820.svg";
import Trophy from "../../../../../../public/Trophy.png";

export default function AstroTournament() {
  return (
    <div className="mb-24 mt-6 lg:mb-0 lg:mt-0 bg-gray-800/50 border border-violet-primary rounded-xl text-center w-full lg:w-fit lg:p-4  p-4 flex flex-col">
      <div className="flex justify-center items-center mb-8 lg:mb-0 lg:ml-8">
        <img
          src={Profil.src}
          alt="Tournament pic"
          className="object-cover w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full"
        />
        <h1 className="text-white ml-4 text-lg md:text-xl lg:text-2xl">
          Name Tournament
        </h1>
      </div>

      <div className="p-2 w-full mt-4 lg:flex lg:flex-row lg:p-0">
        <div className="flex justify-around items-end w-full lg:flex lg:flex-col lg:items-end lg:w-24">
          <div className="flex flex-col items-center lg:mt-6 xl:mt-0">
            <img
              src={Profil.src}
              alt="Player 1"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16  xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
            />
            <span className="text-white text-sm lg:text-base mt-2">Player 1</span>
          </div>
          <div className="flex flex-col items-center lg:mt-[190px]">
            <img
              src={Profil.src}
              alt="Player 2"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
            />
            <span className="text-white text-sm lg:text-base mt-2">Player 2</span>
          </div>
        </div>

        <div className="hidden mt-10 h-[350px] lg:block">
          <img
            src={Line1.src}
            alt="Line"
            className="w-full lg:w-[350px] h-[350px]"
          />
        </div>
        <div className="flex justify-center items-center h-fit lg:hidden">
          <img
            src={Line.src}
            alt="Line"
            className="w-[50%] h-[20%] md:h-[3%] z-50"
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-8 lg:gap-2 lg:flex-row lg:mt-6">
          <div className="flex flex-col items-center ">
            <img
              src={Profil.src}
              alt="Finalist 1"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
            />
            <span className="text-white text-sm lg:text-nowrap lg:text-base mt-2">Finalist 1</span>
          </div>
          <div className="flex flex-col items-center lg:mb-48">
            <img
              src={Trophy.src}
              alt="Trophy"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-12  lg:h-12  xl:w-18 xl:h-18 object-cover p-2"
            />
            <span className="text-white text-sm lg:text-base mt-2">Trophy</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={Profil.src}
              alt="Finalist 2"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 z-50 object-cover rounded-full shadow-lg"
            />
            <span className="text-white text-sm  lg:text-nowrap lg:text-base mt-2">Finalist 2</span>
          </div>
        </div>

        <div className="hidden mt-10 h-[330px] lg:block">
          <img
            src={Line1.src}
            alt="Line"
            className="w-full lg:w-[350px] h-[350px] transform scale-x-[-1]"
          />
        </div>
        <div className="lg:hidden flex justify-center items-center h-fit">
          <img
            src={Line.src}
            alt="Line"
            className="w-[50%] h-[20%] z-50 transform scale-y-[-1]"
          />
        </div>

        <div className="flex justify-around items-end w-full lg:flex lg:flex-col lg:items-start lg:w-24">
          <div className="flex flex-col items-center lg:mt-6 xl:mt-0">
            <img
              src={Profil.src}
              alt="Player 3"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
            />
            <span className="text-white text-sm lg:text-base mt-2">Player 3</span>
          </div>
          <div className="flex flex-col items-center lg:mt-[190px]">
            <img
              src={Profil.src}
              alt="Player 4"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
            />
            <span className="text-white text-sm lg:text-base mt-2">Player 4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
