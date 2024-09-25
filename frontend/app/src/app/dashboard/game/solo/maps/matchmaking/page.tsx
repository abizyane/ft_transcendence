import Mars from "../../../../../../../public/Mars.jpeg";

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
    <div className="bg-custom-gradient border-[1px] border-violet-primary flex h-full flex-col lg:flex-row gap-4  items-center justify-center">
      <div className="bg-[rgba(145,145,145,0.23)] p-4 rounded-lg flex flex-col items-center lg:min-h-[500px] lg:min-w-[400px]  md:min-h-[300px] md:min-w-[300px] m-2">
        <img
          src={users[0].profilePic}
          alt={`${users[0].name}'s profile`}
          className="w-16 h-16 object-cover rounded-full mb-2"
        />
        <span className="text-lg text-nowrap text-white font-semibold mb-2">
          {users[0].name}
        </span>
        <div className="flex flex-col border-[2px] border-violet-primary rounded-xl m-1 w-full p-2">
          <p className="text-white font-semibold text-xs justify-start flex m-1">
            Level {users[0].level}
          </p>
          <div className="flex items-center h-2 w-full rounded-xl bg-white m-1">
            <div
              className="bg-violet-primary h-2 rounded-xl"
              style={{ width: `${(users[0].xp / 50000) * 100}%` }}
            ></div>
          </div>
          <p className="flex justify-end text-white font-light text-xs mr-4 w-full m-1">
            {users[0].xp} xp
          </p>
        </div>
        <span className="text-white">Rank</span>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
          <span className="text-violet-primary font-bold text-lg">Vs</span>
        </div>
      </div>
      <div className="bg-[rgba(145,145,145,0.23)] p-4 rounded-lg flex flex-col items-center lg:min-h-[700px] lg:min-w-[400px]  md:min-h-[400px] md:min-w-[300px] m-2">
        <img
          src={users[1].profilePic}
          alt={`${users[1].name}'s profile`}
          className="w-16 h-16 object-cover rounded-full mb-2"
        />
        <span className="text-lg text-center text-nowrap text-white font-semibold mb-2">
          {users[1].name}
        </span>
        <div className="flex flex-col border-[2px] border-violet-primary rounded-xl m-1 w-full p-2">
          <p className="text-white font-semibold text-xs justify-start flex m-1 ">
            Level {users[1].level}
          </p>
          <div className="flex items-center h-2 w-full rounded-xl bg-white m-1">
            <div
              className="bg-violet-primary h-2 rounded-xl"
              style={{ width: `${(users[1].xp / 50000) * 100}%` }}
            ></div>
          </div>
          <p className="flex justify-end text-white font-light text-xs mr-4 w-full m-1">
            {users[1].xp} xp
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

