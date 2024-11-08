import React from "react";
import solo from "../../../../public/solo.jpeg";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { CgUnblock } from "react-icons/cg";
const friends = () => {
  return (
    <div className=" w-full  p-2 mb-24 lg:mb-0 lg:h-full">
      <h1 className="text-white text-center w-full text-xl font-bold mb-4 mt-2 ">
        Friends List
      </h1>
      <div className="bg-gray-800/65 rounded-xl border w-full border-violet-primary grid grid-cols-1 lg:grid-cols-2 gap-4   h-[300px] lg:h-[600px] overflow-y-auto no-scrollbar p-4">
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-700/70 hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
          >
            <div className="h-14 w-14 rounded-full overflow-hidden">
              <img
                src={solo.src}
                alt="mode solo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <span className="text-md font-semibold text-white">Name</span>
              <span className="text-sm text-gray-400">@username</span>
            </div>
            <div className="ml-auto flex space-x-4">
              <button
                aria-label="Chat"
                className="hover:text-blue-500 text-white transition-colors"
              >
                <IoChatbubbleEllipsesSharp className="w-6 h-6  text-blue-600 hover:text-blue-900" />
              </button>
              <button
                aria-label="Settings"
                className="hover:text-red-500 text-white transition-colors"
              >
                <FaTableTennisPaddleBall className="w-6 h-6  text-red-600 hover:text-red-900" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="lg:flex lg:gap-4 ">
      <div className="lg:flex lg:flex-col lg:w-full  ">

      <h1 className="text-white text-center w-full text-xl font-bold mb-4 mt-2 ">
        Request List
      </h1>
      <div className="bg-gray-800/65 rounded-xl border w-full border-violet-primary grid grid-cols-1 gap-4   h-[300px] overflow-y-auto no-scrollbar p-4">
        {[...Array(30)].map((_, index) => (
          <div
          key={index}
          className="flex items-center bg-gray-700/70 hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
          >
            <div className="h-14 w-14 rounded-full overflow-hidden">
              <img
                src={solo.src}
                alt="mode solo"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <span className="text-md font-semibold text-white">Name</span>
              <span className="text-sm text-gray-400">@username</span>
            </div>
            <div className="ml-auto flex space-x-4">
              <button
                aria-label="Accept"
                className=" text-white transition-colors"
                >
                <FaCircleCheck className="w-6 h-6  text-green-600 hover:text-green-900" />
              </button>
              <button
                aria-label="Decline"
                className=" text-white transition-colors"
                >
                <IoCloseCircle className="w-7 h-7  text-red-600 hover:text-red-900" />
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
      <div className="lg:flex lg:flex-col lg:w-full">

      <h1 className="text-white text-center w-full text-xl font-bold mb-4 mt-2 ">
        Blocked List
      </h1>
      <div className="bg-gray-800/65 rounded-xl border w-full border-violet-primary grid grid-cols-1  gap-4   h-[300px] overflow-y-auto no-scrollbar p-4">
        {[...Array(30)].map((_, index) => (
          <div
          key={index}
          className="flex items-center bg-gray-700/70 hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
          >
            <div className="h-14 w-14 rounded-full overflow-hidden">
              <img
                src={solo.src}
                alt="mode solo"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <span className="text-md font-semibold text-white">Name</span>
              <span className="text-sm text-gray-400">@username</span>
            </div>
            <div className="ml-auto flex space-x-4">
              <button
                className=" text-white transition-colors"
                aria-label="Unblock user"
                >
                <CgUnblock
                  className="w-6 h-6  text-white hover:text-black"
                  aria-label="unblock"
                  />
              </button>
              <span className="absolute bottom-full mb-1 hidden group-hover:block text-sm text-white bg-gray-700 rounded-md px-2 py-1">
                Unblock
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>
        </div>
    </div>
  );
};

export default friends;
