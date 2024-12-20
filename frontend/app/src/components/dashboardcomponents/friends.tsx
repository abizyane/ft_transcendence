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
import { useUser } from "@/services/context/usercontext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { customFetch } from "@/utils/customFetch";


const Friends = ({ user }) => {
  const { friends, loading, error } = useFriendsof(user);
  const { user: currentUser, userloading } = useUser();
  const router = useRouter();
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (userloading) return (<div className="w-full h-full flex justify-center items-center"><Loader /></div>);
  const inviteFriendToGame = async (friendId) => {
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+"/api/invite_friend/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friend_id: friendId }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const token = data.token;
        toast.success("Friend invited to game");
        router.push(`/game/solo/maps?game=randommatch&token=${token}`);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error rejecting friend:", error);
    }
  };

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
          <Loader />
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
                    <div className=" lg:relative h-12 w-12 rounded-full">
                      <img
                        src={friend.profile_pic_url}
                        alt="User Profile"
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-white">{friend.username}</p>
                      <p className="text-xs justify-start flex ml-3 text-gray-400">
                        {friend.xp} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2 ">
                    {currentUser.id !== friend.id && (
                      <>
                        <div className="bg-black rounded-full p-2 w-12 h-12 flex items-center justify-center">
                          <Link href={`/chat/${friend.id}`}>
                            <button
                              aria-label="Chat"
                              className="hover:text-blue-500 text-white transition-colors"
                            >
                              <IoChatbubbleEllipsesSharp className="w-6 h-6 rounded-full text-blue-600 hover:text-blue-900" />
                            </button>
                          </Link>
                        </div>
                        <div className="bg-black rounded-full p-2 w-12 h-12 flex items-center justify-center">
                          <button
                            onClick={() => inviteFriendToGame(friend.id)}
                            aria-label="Invite"
                            className="hover:text-red-500 text-white transition-colors"
                          >
                            <FaTableTennisPaddleBall className="w-6 h-6 rounded-full text-red-600 hover:text-red-900" />
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                </div>
              ))
          )}

      </div>
    </div>
  );
};

export default Friends;
