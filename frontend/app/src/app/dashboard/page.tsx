"use client";
import { useEffect, useState } from "react";
import Component from "@/components/Component/Component";
import Linechart from "@/components/Charts/Linechart";
const Dashboard = () => {
  return (
    <>
      <div className="flex flex-1 relative md:w-full px-1 overflow-hidden md:overflow-auto">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center  justify-center  mb-14 mt-2 relative">
          {/* First Component */}
          <div className="bg-gray-800 rounded-xl w-full max-w-full md:ml-20 md:overflow-hidden md:max-w-screen-2xl border border-gray-600 mb-4 md:mb-0">
            <Component />
          </div>

          {/* Second Component */}
          <div className="mt-4 w-full">
            <div className="bg-gray-800 rounded-xl w-full max-w-full md:ml-20 md:overflow-hidden md:max-w-screen-2xl border border-gray-600 mb-4 md:mb-0">
              <p className="m-2 text-white text-2xl font-extrabold">
                Experience Performance
              </p>
              <Linechart />
            </div>
          </div>

          {/* Third Component */}
          <div className="mt-4 w-full">
            <div className="bg-gray-800 rounded-xl border border-gray-600 mb-4">
              <div className="m-2 flex justify-between items-center">
                {/* Left aligned text */}
                <p className="m-2 text-white text-2xl font-extrabold">
                  History
                </p>
                {/* Right aligned text */}
                <div className="m-2 p-2 border border-white backdrop-blur-lg bg-opacity-30 bg-white rounded-xl">
                  <p className="text-white">View All</p>
                </div>
              </div>
              <div className="p-2">
                <div className="w-full max-w-full overflow-hidden">
                  <div className="flex flex-row items-center justify-between bg-gray-700 p-2 rounded-xl border border-gray-600">
                    {/* Left side with larger image, name, and username */}
                    <div className="flex items-center space-x-2">
                      <img
                        src="/profil.jpg"
                        alt="User Image"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="font-bold text-white text-xs">Name</p>
                        <p className="text-xs text-gray-400">@username</p>
                      </div>
                    </div>

                    {/* Centered score */}
                    <p className="font-semibold text-white text-center">4:5</p>

                    {/* Mirrored effect on the right side */}
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-center">
                        <p className="font-bold text-white text-xs">Name</p>
                        <p className="text-xs text-gray-400">@username</p>
                      </div>
                      <img
                        src="/profil.jpg"
                        alt="User Image"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <div className="w-full max-w-full overflow-hidden">
                  <div className="flex flex-row items-center justify-between bg-gray-700 p-2 rounded-xl border border-gray-600">
                    {/* Left side with larger image, name, and username */}
                    <div className="flex items-center space-x-2">
                      <img
                        src="/profil.jpg"
                        alt="User Image"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="font-bold text-white text-xs">Name</p>
                        <p className="text-xs text-gray-400">@username</p>
                      </div>
                    </div>

                    {/* Centered score */}
                    <p className="font-semibold text-white text-center">4:5</p>

                    {/* Mirrored effect on the right side */}
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-center">
                        <p className="font-bold text-white text-xs">Name</p>
                        <p className="text-xs text-gray-400">@username</p>
                      </div>
                      <img
                        src="/profil.jpg"
                        alt="User Image"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <div className="w-full max-w-full overflow-hidden">
                  <div className="flex flex-row items-center justify-between bg-gray-700 p-2 rounded-xl border border-gray-600">
                    {/* Left side with larger image, name, and username */}
                    <div className="flex items-center space-x-2">
                      <img
                        src="/profil.jpg"
                        alt="User Image"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="font-bold text-white text-xs">Name</p>
                        <p className="text-xs text-gray-400">@username</p>
                      </div>
                    </div>

                    {/* Centered score */}
                    <p className="font-semibold text-white text-center">4:5</p>

                    {/* Mirrored effect on the right side */}
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-center">
                        <p className="font-bold text-white text-xs">Name</p>
                        <p className="text-xs text-gray-400">@username</p>
                      </div>
                      <img
                        src="/profil.jpg"
                        alt="User Image"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fourth Component */}
          <div className="mt-4 w-full">
            <div className="bg-gray-800 rounded-xl border border-gray-600 mb-4">
              <div className="m-2 flex justify-between items-center">
                {/* Left aligned text */}
                <p className="m-2 text-white text-2xl font-extrabold">
                  Top Players
                </p>
                {/* Right aligned text */}
                <div className="m-2 p-2 border border-white backdrop-blur-lg bg-opacity-30 bg-white rounded-xl">
                  <p className="text-white">View All</p>
                </div>
              </div>

              {/* Player Profile Container */}
              <div className="flex items-center justify-between m-2 golden rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
                {/* Profile Picture and Details */}
                <div className="flex items-center space-x-4">
                  <img
                    src="/profil.jpg"
                    alt="User Image"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-white">Ahmed Allali</p>
                    <p className="text-xs justify-start flex ml-3 text-gray-400">
                      4 XP
                    </p>
                  </div>
                </div>

                {/* Gold Badge */}
                <div className="flex items-center">
                  <img
                    src="Gold badge.svg"
                    alt="Gold Badge"
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between m-2 golden rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
                {/* Profile Picture and Details */}
                <div className="flex items-center space-x-4">
                  <img
                    src="/profil.jpg"
                    alt="User Image"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-white">Ahmed Allali</p>
                    <p className="text-xs justify-start flex ml-3 text-gray-400">
                      4 XP
                    </p>
                  </div>
                </div>

                {/* Gold Badge */}
                <div className="flex items-center">
                  <img
                    src="Gold badge.svg"
                    alt="Gold Badge"
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between m-2 golden rounded-[34px] pl-2 py-2 pr-5 border border-gray-600">
                {/* Profile Picture and Details */}
                <div className="flex items-center space-x-4">
                  <img
                    src="/profil.jpg"
                    alt="User Image"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-white">Ahmed Allali</p>
                    <p className="text-xs justify-start flex ml-3 text-gray-400">
                      4 XP
                    </p>
                  </div>
                </div>

                {/* Gold Badge */}
                <div className="flex items-center">
                  <img
                    src="Gold badge.svg"
                    alt="Gold Badge"
                    className="w-8 h-8"
                  />
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
