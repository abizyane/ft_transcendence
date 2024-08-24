import Image from "next/image";
import Marshmellow from "../../../public/marshmello.svg";
// import Tournement from "../../../public/BgTournement.svg";
import "../../app/globals.css";
import Link from "next/link";

const Component = () => {
  return (
    <>
      <div>

        <div className="grid grid-cols-2 gap-5 w-full h-full max-h-screen">
          <div className="rounded-2xl w-full h-full flex flex-row space-x-5 border-2 border-violet-primary">
            <div className="m-2">
              <h1 className="text-2xl m-1 text-white font-bold">Instructions</h1>
              <ul className="text-base ml-8 text-white list-disc">
                <li>There are two paddles that can move vertically up and down the left and right sides of the screen.</li>
                <li>Player 1 controls the left paddle using the 'W' and 'S' keys to move it up and down.</li>
                <li>Player 2 controls the right paddle using the 'Up Arrow' and 'Down Arrow' keys to move it up and down.</li>
              </ul>
            </div>
            <div className="right-0 flex flex-end">
              <Image src={Marshmellow} alt="home" width={300} height={300} />
            </div>
          </div>
          <Link href="/game/Tournement">
            <div className="relative w-full h-full border-2 rounded-3xl border-violet-primary bg-no-repeat bg-center bg-cover bg-[url('../../public/BgTournement.svg')]">
              <h1 className="absolute top-3 left-3 text-2xl text-white font-bold">Tournaments</h1>
            </div>
          </Link>



        </div>
        <div className="grid grid-cols-3 gap-5 mt-4 max-h-screen">
          <div className=" rounded-2xl w-full border-2 text-white text-4xl border-violet-primary ">
            <h1 className=" m-2 font-bold text-white">History</h1>
            <div className="m-1 h-full">

              <div className=" h-fit flex flex-col m-1">
                <div className="bg-gray-700 mb-2 h-fit w-full rounded-2xl  flex justify-center">
                  <div className="flex flex-start w-full">
                    <div className="rounded-full w-10 h-10 bg-black m-1 flex justify-center">
                      <Image src={Marshmellow} alt="home" width={30} height={20} />
                    </div>
                    <div className="flex flex-col ">
                      <p className="text-sm font-semibold">name</p>
                      <p className="text-xs font-medium">@username</p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center  text-base w-full">
                    <p>20 : 27</p>
                  </div>
                  <div className="w-fit flex flex-end">

                    <div className="rounded-full w-10 h-10 bg-black flex justify-center m-1 flex-center">
                      <Image src={Marshmellow} alt="home" width={30} height={20} />
                    </div>
                    <div className="flex flex-col ">
                      <p className="text-sm font-semibold">name</p>
                      <p className="text-xs font-medium m-1">@username</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 mb-2 h-fit w-full rounded-2xl  flex justify-center">
                  <div className="flex flex-start w-full">
                    <div className="rounded-full w-10 h-10 bg-black m-1 flex justify-center">
                      <Image src={Marshmellow} alt="home" width={30} height={20} />
                    </div>
                    <div className="flex flex-col ">
                      <p className="text-sm font-semibold">name</p>
                      <p className="text-xs font-medium">@username</p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center  text-base w-full">
                    <p>20 : 27</p>
                  </div>
                  <div className="w-fit flex flex-end">

                    <div className="rounded-full w-10 h-10 bg-black flex justify-center m-1 flex-center">
                      <Image src={Marshmellow} alt="home" width={30} height={20} />
                    </div>
                    <div className="flex flex-col ">
                      <p className="text-sm font-semibold">name</p>
                      <p className="text-xs font-medium m-1">@username</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 mb-2 h-fit w-full rounded-2xl  flex justify-center">
                  <div className="flex flex-start w-full">
                    <div className="rounded-full w-10 h-10 bg-black m-1 flex justify-center">
                      <Image src={Marshmellow} alt="home" width={30} height={20} />
                    </div>
                    <div className="flex flex-col ">
                      <p className="text-sm font-semibold">name</p>
                      <p className="text-xs font-medium">@username</p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center  text-base w-full">
                    <p>20 : 27</p>
                  </div>
                  <div className="w-fit flex flex-end">

                    <div className="rounded-full w-10 h-10 bg-black flex justify-center m-1 flex-center">
                      <Image src={Marshmellow} alt="home" width={30} height={20} />
                    </div>
                    <div className="flex flex-col ">
                      <p className="text-sm font-semibold">name</p>
                      <p className="text-xs font-medium m-1">@username</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link href="/rank">
            <div className="h-full bg-[url('../../public/BgRank.jpeg')] bg-no-repeat bg-cover bg-center rounded-2xl w-full border-2 text-white text-4xl border-violet-primary">
              {/* <h1 className="text-2xl m-2 font-bold text-white">Ranking</h1> */}
            </div>
          </Link>
          <div className="rounded-2xl w-full border-2 text-white text-4xl border-violet-primary ">
            <h1 className="text-2xl m-2 font-bold text-white">Achievements</h1>
            <div className="h-fit flex flex-col">
              <div className="m-1  rounded-2xl flex ">
                <div className="rounded-full w-10 h-10 bg-black m-1 flex justify-center">
                  <Image src={Marshmellow} alt="home" width={30} height={20} />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">Perfect player</p>
                  <p className="text-gray-900 text-xs font-semibold">Win 10 games</p>
                </div>
              </div>
              <div className="m-1  rounded-2xl flex ">
                <div className="rounded-full w-10 h-10 bg-black m-1 flex justify-center">
                  <Image src={Marshmellow} alt="home" width={30} height={20} />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">King of streak</p>
                  <p className="text-gray-900 text-xs font-semibold">Win 15 streak games </p>
                </div>
              </div>
              <div className="m-1  rounded-2xl flex ">
                <div className="rounded-full w-10 h-10 bg-black m-1 flex justify-center">
                  <Image src={Marshmellow} alt="home" width={30} height={20} />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">Good player</p>
                  <p className="text-gray-900 text-xs font-semibold">Win 2 games</p>
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
