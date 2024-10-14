import React from "react";
// Import the JSON data
import data from "../../app/data/Dashboarddata.json";

interface Player {
  firstName: string;
  lastName: string;
  pic: string;
  xp: number;
}

const TopPlayers: React.FC = () => {
  const user = data.user; // Access user data from the JSON
  const topPlayers: Player[] = user.topPlayers;

  // Sort topPlayers by xp in descending order
  const sortedTopPlayers = topPlayers.sort((a, b) => b.xp - a.xp);

  // Determine the number of players to display
  const displayCount = sortedTopPlayers.length >= 3 ? 3 : sortedTopPlayers.length;

  return (
    <div className="w-full lg:w-1/3 py-4">
          <div className="bg-gray-800/60 rounded-xl border border-violet-primary flex flex-col flex-1 h-full">
 
        {/* Title Section */}
        <div className=" flex justify-between items-center m-2">
          <p className="m-2 text-white text-2xl font-extrabold">Top Players</p>
          <div className="m-2 p-2 border border-violet-primary backdrop-blur-lg bg-opacity-30 hover:bg-violet-primary rounded-xl">
            <p className="text-white">View All</p>
          </div>
        </div>

        {/* Content Section */}
        <div className=" flex flex-col h-full justify-center items center">
          {sortedTopPlayers.length === 0 ? (
           <div className="w-full h-full flex justify-center items-center">
           <p className="text-xl text-white-primary font-bold">
             No Data Found.
           </p>
         </div>
          ) : (
            sortedTopPlayers.slice(0, displayCount).map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between m-1   ${
                  index === 0 ? "golden" : index === 1 ? "silver" : "bronze"
                } rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={player.pic}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-white">{`${player.firstName} ${player.lastName}`}</p>
                    <p className="text-xs justify-start flex ml-3 text-gray-400">
                      {player.xp} XP
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <img
                    src={
                      index === 0
                        ? "GoldBadge.svg"
                        : index === 1
                        ? "SilverBadge.svg"
                        : "BronzeBadge.svg"
                    }
                    alt={`${index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze"} Badge`}
                    className="w-8 h-8"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TopPlayers;
