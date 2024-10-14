"use client";
import { useEffect, useState } from "react";
import Component from "@/components/Component/Component";
import Linechart from "@/components/Charts/Linechart";
import { Icon } from "@iconify/react";
import chatIcon from "@iconify-icons/mdi/chat-processing";
import battleIcon from "@iconify-icons/mdi/sword-fight";
import data from "@/app/data/Dashboarddata.json";
const Dashboard = () => {

  const user = data.user;
  const values = user.charts.lineChart.data;
  const gameHistory = user.history;
  // const game = gameHistory
  return (
    <>
      <div className="flex flex-1  lg:w-full px-1 overflow-hidden justify-center items-center">
        <div className="flex-1 w-full flex flex-col items-center justify-center mb-14 mt-2 relative">
          <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="bg-gray-800/60 rounded-xl lg:w-2/4 lg:border border-violet-primary mb-4 lg:mb-0">
              <Component />
            </div>
            <div className="bg-gray-800/60 rounded-xl flex-1 border border-violet-primary">
              <p className="m-2 text-white text-2xl p-4 font-extrabold w-full">
                Experience Performance
              </p>
              <div className=" w-[99%] justify-center items-center">
                  <Linechart data={values}/>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="mt-8 w-full lg:mt-4 lg:w-1/3 lg:flex lg:flex-col overflow-hidden">
              <div className="bg-gray-800/60 rounded-xl border border-violet-primary flex flex-col flex-1 mb-4">
                <div className="m-2 flex justify-between items-center">
                  <p className="m-2 text-white text-2xl font-extrabold">
                    History
                  </p>
                  <div className="m-2 p-2 border-2 border-violet-primary backdrop-blur-lg rounded-xl hover:bg-violet-primary">
                    <p className="text-white">View All</p>
                  </div>
                </div>
                <div className="p-1 sm:p-2 flex-1 overflow-auto">
                  <div className="flex flex-col space-y-2">
                  {gameHistory.map((game) => (
  <div
    key={game.gameId}
    className="flex flex-row items-center justify-between bg-gray-800 p-2 rounded-[34px] border border-violet-primary"
  >
    {game.inviter === "user" ? (
      <>
        {/* User (Invitee) on the left */}
        <div className="flex items-center space-x-2 flex-1">
          <img
            src={user.pic}
            alt={`${user.name} Image`}
            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="font-bold text-white text-xs">{user.name}</p>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
        </div>

        {/* Score */}
        <p className="font-semibold text-white text-center w-20 mx-4"> {/* Adjust width if necessary */}
          {game.score.user}:{game.score.opponent}
        </p>

        {/* Opponent (Inviter) on the right */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <div className="flex flex-col items-end">
            <p className="font-bold text-white text-xs">{game.opponent.name}</p>
            <p className="text-xs text-gray-400">@{game.opponent.username}</p>
          </div>
          <img
            src={game.opponent.picture}
            alt={`${game.opponent.name} Image`}
            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
          />
        </div>
      </>
    ) : (
      <>
        {/* Opponent (Invitee) on the left */}
        <div className="flex items-center space-x-2 flex-1">
          <img
            src={game.opponent.picture}
            alt={`${game.opponent.name} Image`}
            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="font-bold text-white text-xs">{game.opponent.name}</p>
            <p className="text-xs text-gray-400">@{game.opponent.username}</p>
          </div>
        </div>

        {/* Score */}
        <p className="font-semibold text-white text-center w-20 mx-4"> {/* Adjust width if necessary */}
          {game.score.user}:{game.score.opponent}
        </p>

        {/* User (Inviter) on the right */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <div className="flex flex-col items-end">
            <p className="font-bold text-white text-xs">{user.name}</p>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
          <img
            src={user.pic}
            alt={`${user.name} Image`}
            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
          />
        </div>
      </>
    )}
  </div>
))}


                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full lg:w-1/3 ">
              <div className="bg-gray-800/60 rounded-xl border border-violet-primary mb-4 mt-4 lg:mt-4">
                <div className="m-2 flex justify-between items-center ">
                  <p className="m-2 text-white text-2xl font-extrabold">
                    Top Players
                  </p>
                  <div className="m-2 p-2 border border-violet-primary backdrop-blur-lg bg-opacity-30  hover:bg-violet-primary rounded-xl">
                    <p className="text-white">View All</p>
                  </div>
                </div>
                <div className="flex items-center justify-between m-3 golden rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/Profil.jpg"
                      alt="User Image"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-white">Ahmed Allali</p>
                      <p className="text-xs justify-start flex ml-3 text-gray-400">
                        54890 XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="GoldBadge.svg"
                      alt="Gold Badge"
                      className="w-8 h-8"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between m-3 silver rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/Profil.jpg"
                      alt="User Image"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-white">Achraf Bizyane</p>
                      <p className="text-xs justify-start flex ml-3 text-gray-400">
                        54823 XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="SilverBadge.svg"
                      alt="Silver Badge"
                      className="w-8 h-8"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between m-3 bronze rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/Profil.jpg"
                      alt="User Image"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-white">Ismail Chaiq</p>
                      <p className="text-xs justify-start flex ml-3 text-gray-400">
                        54089 XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="BronzeBadge.svg"
                      alt="Bronze Badge"
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full lg:w-1/3">
              <div className="bg-gray-800/60 rounded-xl border border-violet-primary mb-4 lg:mt-4">
                <div className="m-2 flex justify-between items-center">
                  <p className="m-2 text-white text-2xl font-extrabold">
                    Friends
                  </p>
                  <div className="m-2 p-2 border border-violet-primary backdrop-blur-lg hover:bg-violet-primary rounded-xl">
                    <p className="text-white">View All</p>
                  </div>
                </div>
                <div className="flex items-center justify-between m-3 rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/Profil.jpg"
                      alt="User Image"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-white">Ahallali</p>
                      <p className="text-xs justify-start flex ml-3 text-gray-400">
                        54890 XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-black rounded-full p-2">
                      <Icon icon={chatIcon} className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="bg-black rounded-full p-2">
                      <Icon
                        icon={battleIcon}
                        className="w-8 h-8 text-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between m-3  rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/Profil.jpg"
                      alt="User Image"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-white">Abizyane</p>
                      <p className="text-xs justify-start flex ml-3 text-gray-400">
                        54823 XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-black rounded-full p-2">
                      <Icon icon={chatIcon} className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="bg-black rounded-full p-2">
                      <Icon
                        icon={battleIcon}
                        className="w-8 h-8 text-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between m-3 rounded-[34px] pl-2 py-2 pr-5 border border-violet-primary">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/Profil.jpg"
                      alt="User Image"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-white">Ichaiq</p>
                      <p className="text-xs justify-start flex ml-3 text-gray-400">
                        54089 XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-black rounded-full p-2">
                      <Icon icon={chatIcon} className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="bg-black rounded-full p-2">
                      <Icon
                        icon={battleIcon}
                        className="w-8 h-8 text-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
