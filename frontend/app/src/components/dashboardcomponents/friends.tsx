import { Icon } from "@iconify/react";
import Link from "next/link";
import userData from '../../app/data/Dashboarddata.json'; 

interface Friend {
    username: string;
    pic: string;
    xp: number;
}

const Friends = () => {
    const friendsData: Friend[] = userData.user.friends;

    return (
        <div className=" w-full py-4 lg:w-1/3">
            <div className="bg-gray-800/60 rounded-xl border h-full border-violet-primary mb-4 ">
                <div className="m-2 flex justify-between items-center">
                    <p className="m-2 text-white text-2xl font-extrabold">
                        Friends
                    </p>
                    <Link href="/friends">
                    <div className="m-2 p-2 border border-violet-primary backdrop-blur-lg hover:bg-violet-primary rounded-xl">
                        <p className="text-white">View All</p>
                    </div>
                    </Link>
                </div>

                {friendsData.length === 0 ? (
                     <div className="w-full h-full flex justify-center items-center">
                     <p className="text-xl text-white-primary font-bold">
                       No Data Found.
                     </p>
                   </div>
                ) : (
                    friendsData.slice(0, Math.min(friendsData.length, 3)).map((friend, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between m-3 rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary"
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={friend.pic}
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
                            <div className="flex items-center space-x-2">
                                <div className="bg-black rounded-full p-2">
                                    {/* <Icon icon={chatIcon} className="w-6 h-6 text-white" /> */}
                                </div>
                                <div className="bg-black rounded-full p-2">
                                    {/* <Icon icon={battleIcon} className="w-6 h-6 text-red-800" /> */}
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
