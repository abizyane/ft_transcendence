import Link from "next/link";
import Vsbot from "../../../../../public/vsbot.jpg";
import Localgame from "../../../../../public/localgame.jpg";
import Random from "../../../../../public/random.jpg";
import battleIcon from "@iconify-icons/mdi/sword-fight";
import { Icon } from "@iconify/react";

const friends = [
  {
    id: 1,
    name: "Ismail Chaiq",
    username: "ismail_chaiq",
    profilePic: "../../../../../Profil.jpg",
  },
  {
    id: 2,
    name: "Achraf Bizyane",
    username: "achraf_bizyane",
    profilePic: "../../../../../Profil.jpg",
  },
  // Add more friends here
];

const Page = () => {
  return (
    <>
      <div className="bg-custom-gradient bg-opacity-60 lg:m-10 rounded-xl flex flex-wrap gap-4 border-[1px] border-violet-primary mb-10 w-full justify-center items-center ">
        {/* Common style for all the boxes */}
          <Link href="dashboard/game/solo" className="w-[92%] max-w-[366.4px] mr-4 md:mr-10 ">
            <div className="lg:max-w-[600px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-[730px] m-2 flex flex-col rounded-2xl border-4 border-violet-primary overflow-hidden">
              <div className="w-full h-3/4 flex flex-col ">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-2 m-1 rounded-lg bg-red-500 border-[1px]  border-gray-600"
                  >
                    {/* Friend's profile picture */}
                    <img
                      src={friend.profilePic}
                      alt={`${friend.name}'s profile`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {/* Friend's name and username */}
                    <div className="flex flex-col ml-4">
                      <span className="font-light text-nowrap">{friend.name}</span>
                      <span className="text-sm text-gray-600">
                        @{friend.username}
                      </span>
                    </div>
                    {/* Challenge button */}
                    <button className="bg-black rounded-full p-2">
                      <Icon
                        icon={battleIcon}
                        className="w-4 h-4 text-red-500"
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-black h-1/4 lg:mt-[545px]  text-center pb-2 text-nowrap text-xl md:text-3xl font-bold text-white">
                Invite A Friend
              </div>
            </div>
          </Link>

        <Link href="dashboard/game/tournaments">
          <div className="w-[90%] max-w-[400px]  lg:max-w-[600px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-full m-2 flex flex-col rounded-2xl border-4 border-violet-primary">
            <div className="h-3/4">
              <img
                src={Vsbot.src}
                alt="VS AI"
                className="w-full h-full object-cover rounded-t-xl"
              />
            </div>
            <div className="bg-black h-1/4 text-center text-xl md:text-3xl font-bold text-white rounded-b-xl">
              VS AI
            </div>
          </div>
        </Link>

        <Link href="dashboard/game/tournaments">
          <div className="w-[90%] max-w-[400px]  lg:max-w-[600px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-full m-2 flex flex-col rounded-2xl border-4 border-violet-primary">
            <div className="h-3/4">
              <img
                src={Localgame.src}
                alt="Local Game"
                className="w-full h-full object-cover rounded-t-xl"
              />
            </div>
            <div className="bg-black h-1/4 text-center text-xl md:text-3xl font-bold text-white rounded-b-xl">
              Local Game
            </div>
          </div>
        </Link>

        <Link href="dashboard/game/tournaments">
          <div className="w-[90%] max-w-[400px]  lg:max-w-[600px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-full m-2 flex flex-col rounded-2xl border-4 border-violet-primary">
            <div className="h-3/4 flex justify-center items-center">
            <img
                src={Random.src}
                alt="Random match"
                className="w-full h-full object-cover rounded-t-xl"
              />
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
