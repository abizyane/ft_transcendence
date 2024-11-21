import { Icon } from "@iconify/react";
import Link from "next/link";
import userData from "../../app/data/Dashboarddata.json";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { useFriendsof } from "@/services/friendsof";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import Loader from "components/loader/loader";


const Friends = ({user}) => {
  const { friends, loading, error } = useFriendsof(user);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className=" w-full py-4 lg:w-1/3">
      <div className="bg-gray-800/60 rounded-xl border h-full border-violet-primary mb-4 ">
        <div className="m-2 flex justify-between items-center">
          <p className="m-2 text-white text-2xl font-extrabold">Friends</p>
          <Link href={`/friends/${user.id}`}>
            <div className="m-2 p-2 border border-violet-primary backdrop-blur-lg hover:bg-violet-primary rounded-xl">
              <p className="text-white">View All</p>
            </div>
          </Link>
        </div>

        {loading ? <div className="w-full h-[252px] flex justify-center items-center">
          <Loader/>
        </div> : 
        friends.length === 0 ? (
          <div className="w-full h-[252px] flex justify-center items-center">
            <p className="text-xl text-white-primary font-bold">
              No Data Found.
            </p>
          </div>
        ) : (
          friends
            .slice(0, Math.min(friends.length, 3))
            .map((friend, index) => (
              <div
                key={index}
                className="flex items-center justify-between m-3 rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.profile_pic_url}
                    alt={`${friend.username}'s Profile`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-white">{friend.username}</p>
                    <p className="text-xs justify-start flex ml-3 text-gray-400">
                      {friend.xp} XP
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2 ">
                  <div className="bg-black rounded-full p-2 w-12 h-12 flex items-center justify-center">
                    <button
                      aria-label="Chat"
                      className="hover:text-blue-500 text-white transition-colors"
                    >
                      <IoChatbubbleEllipsesSharp className="w-6 h-6 rounded-full text-blue-600 hover:text-blue-900" />
                    </button>
                  </div>
                  <div className="bg-black rounded-full p-2 w-12 h-12 flex items-center justify-center">
                    <button
                      aria-label="Settings"
                      className="hover:text-red-500 text-white transition-colors"
                    >
                      <FaTableTennisPaddleBall className="w-6 h-6 rounded-full  text-red-600 hover:text-red-900" />
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
        
      </div>
    </div>
  );
};

export default Friends;
