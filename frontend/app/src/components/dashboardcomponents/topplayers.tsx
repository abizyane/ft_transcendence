import React, { useEffect, useState } from "react";
import Link from "next/link";
import data from "../../app/data/Dashboarddata.json";
import Loader from "components/loader/loader";
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  username: string;
  profile_pic_url: string;
}

interface Player {
  xp: number;
  level:number;
  user:User;
}

const TopPlayers: React.FC = () => {
  const user = data.user;
  // const topPlayers: Player[] = user.topPlayers;
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}:8000/api/top_players`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    .then(async (response) => {
      if (!response.ok) {
        toast.error("Response not ok:", response.status);
        // throw new Error("User not found");
      }
      const responseData = await response.json();
      setTopPlayers(responseData.topPlayers);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const sortedTopPlayers = topPlayers.sort((a, b) => b.xp - a.xp);

  const displayCount =
    sortedTopPlayers.length >= 3 ? 3 : sortedTopPlayers.length;

  return (
    <div className="w-full lg:w-1/3 py-4">
      <div className="bg-gray-800/60 p-2 rounded-xl border border-violet-primary flex flex-col flex-1 h-full">
        <div className=" flex justify-between items-center m-2">
          <p className="text-white text-2xl font-extrabold">Top Players</p>
          <Link href="/ranking">
            <div className="border p-2 border-violet-primary backdrop-blur-lg bg-opacity-30 hover:bg-violet-primary rounded-xl">
              <p className="text-white">View All</p>
            </div>
          </Link>
        </div>

          {loading ? 
            <div className="w-full h-full flex justify-start items-center">
              <Loader />
            </div>
          : sortedTopPlayers.length === 0 ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-xl text-white-primary font-bold">
                No Data Found.
              </p>
            </div>
          ) : (
            <div className=" flex flex-col h-full justify-start">
          
            {sortedTopPlayers.slice(0, displayCount).map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between m-1   ${
                    index === 0 ? "golden" : index === 1 ? "silver" : "bronze"
                  } rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={player.user.profile_pic_url}
                      alt={`${player.user.username}`}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-white">{`${player.user.username}`}</p>
                      <p className="text-xs justify-start flex ml-3 text-gray-400">
                        {player.xp} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={
                        index === 0
                          ? "/GoldBadge.svg"
                          : index === 1
                          ? "/SilverBadge.svg"
                          : "/BronzeBadge.svg"
                      }
                      alt={`${
                        index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze"
                      } Badge`}
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              ))}
          </div>
          )}
      </div>
    </div>
  );
};

export default TopPlayers;
