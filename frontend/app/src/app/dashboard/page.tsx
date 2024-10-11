"use client";
import { useEffect, useState } from "react";
import Component from "@/components/Component/Component";
import Linechart from "@/components/Charts/Linechart";
import { Icon } from "@iconify/react";
import chatIcon from "@iconify-icons/mdi/chat-processing";
import battleIcon from "@iconify-icons/mdi/sword-fight";

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-1  lg:w-full px-1 overflow-hidden justify-center items-center">
        <div className="flex-1 w-full flex flex-col items-center justify-center mb-14 mt-2 relative">
          <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="bg-gray-800 rounded-xl lg:w-2/4 lg:border border-gray-600 mb-4 lg:mb-0">
              <Component />
            </div>
            <div className="bg-gray-800 rounded-xl flex-1 border border-gray-600">
              <p className="m-2 text-white text-2xl p-4 font-extrabold w-full">
                Experience Performance
              </p>
              <div className=" w-[99%] justify-center items-center  ">

                  <Linechart />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="mt-8 w-full lg:mt-4 lg:w-1/3 lg:flex lg:flex-col overflow-hidden">
              <div className="bg-gray-800 rounded-xl border border-gray-600 flex flex-col flex-1 mb-4">
                <div className="m-2 flex justify-between items-center">
                  <p className="m-2 text-white text-2xl font-extrabold">
                    History
                  </p>
                  <div className="m-2 p-2 border border-white backdrop-blur-lg bg-opacity-30 bg-white rounded-xl">
                    <p className="text-white">View All</p>
                  </div>
                </div>
                <div className="p-1 sm:p-2 flex-1 overflow-auto">
                  <div className="flex flex-col space-y-2">
                    {[1, 2, 3].map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center justify-between bg-gray-700 p-2 rounded-[34px]  border border-gray-600"
                      >
                        <div className="flex items-center space-x-0 sm:space-x-2">
                          <img
                            src="/Profil.jpg"
                            alt="User Image"
                            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                          />
                          <div className="flex flex-col">
                            <p className="font-bold text-white text-xs">Name</p>
                            <p className="text-xs text-gray-400">@username</p>
                          </div>
                        </div>
                        <p className="font-semibold text-white text-center">
                          4:5
                        </p>
                        <div className="flex items-center space-x-0 sm:space-x-2">
                          <div className="flex flex-col items-center">
                            <p className="font-bold text-white text-xs">Name</p>
                            <p className="text-xs text-gray-400">@username</p>
                          </div>
                          <img
                            src="/Profil.jpg"
                            alt="User Image"
                            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full lg:w-1/3 ">
              <div className="bg-gray-800 rounded-xl border border-gray-600 mb-4 mt-4 lg:mt-4">
                <div className="m-2 flex justify-between items-center">
                  <p className="m-2 text-white text-2xl font-extrabold">
                    Top Players
                  </p>
                  <div className="m-2 p-2 border border-white backdrop-blur-lg bg-opacity-30 bg-white rounded-xl">
                    <p className="text-white">View All</p>
                  </div>
                </div>
                <div className="flex items-center justify-between m-3 golden rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
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
                <div className="flex items-center justify-between m-3 silver rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
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
                <div className="flex items-center justify-between m-3 bronze rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
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
              <div className="bg-gray-800 rounded-xl border border-gray-600 mb-4 lg:mt-4">
                <div className="m-2 flex justify-between items-center">
                  <p className="m-2 text-white text-2xl font-extrabold">
                    Friends
                  </p>
                  <div className="m-2 p-2 border border-white backdrop-blur-lg bg-opacity-30 bg-white rounded-xl">
                    <p className="text-white">View All</p>
                  </div>
                </div>
                <div className="flex items-center justify-between m-3 rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
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

                <div className="flex items-center justify-between m-3  rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
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

                <div className="flex items-center justify-between m-3 rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
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
