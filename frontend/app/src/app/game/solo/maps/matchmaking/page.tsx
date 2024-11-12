import Mars from "../../../../../../../public/Mars.jpeg";
import VS from "../../../../../../public/VS.jpeg";
import Link from "next/link";

// Sample users data
const users = [
  {
    id: 1,
    name: "Ismail Chaiq",
    profilePic: "../../../../../Profil.jpg",
    level: 2,
    xp: 20000,
  },
  {
    id: 2,
    name: "Achraf Bizyane",
    profilePic: "../../../../../Profil.jpg",
    level: 1,
    xp: 10000,
  },
];

const Page = () => {
  return (
    <div className=" flex flex-col lg:flex-row gap-4   lg:gap-24 items-center justify-center lg:w-fit h-fit ">
      <div className="bg-[rgba(145,145,145,0.23)] p-4 rounded-lg flex flex-col items-center lg:min-h-[500px] lg:min-w-[300px]  md:min-h-[300px] md:min-w-[300px] m-2">
        <img
          src={users[0].profilePic}
          alt={`${users[0].name}'s profile`}
          className="w-16 h-16 lg:w-72 lg:h-72 object-cover rounded-full mb-2"
        />
        <span className="text-lg text-nowrap text-white font-semibold pt-4">
          {users[0].name}
        </span>
        <div className="flex flex-col border-[2px] border-gray-400 rounded-xl m-9 w-full p-2">
          <p className="text-white font-semibold text-xs justify-start flex m-1">
            Level {users[0].level}
          </p>
          <div className="flex items-center h-2 w-full rounded-xl bg-white m-1">
            <div
              className="bg-violet-900 h-2 rounded-xl"
              style={{ width: `${(users[0].xp / 50000) * 100}%` }}
            ></div>
          </div>
          <p className="flex justify-end text-white font-light text-xs mr-4 w-full m-1">
            {users[0].xp} xp
          </p>
        </div>
  </div>


      <div className="flex items-center justify-center">
        <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center">
         <img src={VS.src} alt="vs" className="w-full h-full rounded-full" />
        </div>
      </div>
      <div className="bg-[rgba(145,145,145,0.23)] p-4 rounded-lg flex flex-col items-center lg:min-h-[500px] lg:min-w-[300px]  md:min-h-[300px] md:min-w-[300px] m-2">
        <img
          src={users[1].profilePic}
          alt={`${users[1].name}'s profile`}
          className="w-16 h-16 lg:w-72 lg:h-72 object-cover rounded-full mb-2"
        />
        <span className="text-lg text-center text-nowrap text-white font-semibold mb-2">
          {users[1].name}
        </span>
        <div className="flex flex-col border-[2px] border-gray-400 rounded-xl m-9 w-full p-2">
          <p className="text-white font-semibold text-xs justify-start flex m-1 ">
            Level {users[1].level}
          </p>
          <div className="flex items-center h-2 w-full rounded-xl bg-white m-1">
            <div
              className="bg-violet-900 h-2 rounded-xl"
              style={{ width: `${(users[1].xp / 50000) * 100}%` }}
            ></div>
          </div>
          <p className="flex justify-end text-white font-light text-xs mr-4 w-full m-1">
            {users[1].xp} xp
          </p>
        </div>
      </div>
      <Link href="matchmaking/ponggame" className="bg-blue-500 text-blue-800"> <button>start</button> </Link>
    </div>
  );
};

export default Page;

