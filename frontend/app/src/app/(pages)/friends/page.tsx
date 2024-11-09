'use client'
import React, { useEffect,useState } from "react";
import solo from "../../../../public/solo.jpeg";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { CgUnblock } from "react-icons/cg";
import data from '@/app/data/Dashboarddata.json';
import {User} from "../../../services/context/usercontext"
import { useFriends } from "@/services/friends";
import { useFriendRequests } from "@/services/friendrequest";
import { useBlockedFriends } from "@/services/blockedfriends";


const friends = () => {
  const { friends, loading, error } = useFriends();
  const { requests, reqloading, reqerror } = useFriendRequests();
  const { blocked, blkloading, blkerror } = useBlockedFriends();
  
  if (loading ||reqloading || blkloading ) {
    return <div>Loading...</div>;
  }

  if (error || reqerror || blkerror) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className=" w-full lg:max-w-[1200px] p-2 mb-24  lg:h-full ">
      <h1 className="text-white text-center w-full text-xl lg:text-3xl font-bold mb-4 mt-2 ">
        Friends List
      </h1>
      <div className="bg-gray-800/65 rounded-xl border w-full border-violet-primary grid grid-cols-1 lg:grid-cols-2 gap-4   h-[230px] lg:h-[600px] overflow-y-auto no-scrollbar p-4">
        {friends?.map((friend, index) => (
          <div
            key={index}
            className="flex justify-center items-center bg-gray-700/70 h-[90px] hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
          >
            <div className="h-14 w-14 rounded-full overflow-hidden">
              <img
                src={friend.profile_pic_url}
                alt="mode solo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <span className="text-md font-semibold text-white">{friend.username}</span>
            </div>
            <div className="ml-auto flex space-x-4">
              <button
                aria-label="Chat"
                className="hover:text-blue-500 text-white transition-colors"
              >
                <IoChatbubbleEllipsesSharp className="w-6 h-6  text-blue-600 hover:text-blue-900" />
              </button>
              <button
                aria-label="invite"
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
      <div className="bg-gray-800/65 rounded-xl border w-full border-violet-primary grid grid-cols-1 gap-4   h-[250px] overflow-y-auto no-scrollbar p-4">
        {requests?.map((request, index) => (
          <div
          key={index}
          className="flex items-center h-[90px] bg-gray-700/70 hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
          >
            <div className="h-14 w-14 rounded-full overflow-hidden">
              <img
                src={request.profile_pic_url}
                alt="mode solo"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <span className="text-md font-semibold text-white">{request.username}</span>
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
      <div className="bg-gray-800/65 rounded-xl border w-full border-violet-primary grid grid-cols-1  gap-4   h-[250px] overflow-y-auto no-scrollbar p-4">
        {blocked?.map((block, index) => (
          <div
          key={index}
          className="flex items-center  h-[90px] bg-gray-700/70 hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
          >
            <div className="h-14 w-14 rounded-full overflow-hidden">
              <img
                src={block.profile_pic}
                alt="mode solo"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <span className="text-md font-semibold text-white">{block.username}</span>
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
