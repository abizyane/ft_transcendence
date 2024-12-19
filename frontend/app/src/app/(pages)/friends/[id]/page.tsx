"use client";
import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaRegCircleCheck, FaTableTennisPaddleBall } from "react-icons/fa6";
import { FaCircleCheck, FaEllipsisV } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { CgUnblock } from "react-icons/cg";
import { useFriendsof } from "@/services/friendsof";
import { useFriendRequests } from "@/services/friendrequest";
import { useBlockedFriends } from "@/services/blockedfriends";
import { fetchFriendsof } from "@/services/friendsof";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import { useUser } from "@/services/context/usercontext";
import { request } from "http";
import Loader from '../../../../components/loader/loader';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
const Friends = () => {
  const param = useParams();
  const userId = param.id;
  const router = useRouter();

  const { user: currentUser, userloading } = useUser();
  const { friends, loading, error, fetchFriendsof } = useFriendsof({
    id: parseInt(userId),
  });
  const { requests, reqloading, reqerror, fetchRequests } = useFriendRequests();
  const { blocked, blkloading, blkerror, fetchBlocked } = useBlockedFriends();

  if (userloading) {
    return <div>   <Loader /></div>;
  }
  if (loading) {
    return <div className="text-white"> loading ... </div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const isFriendListAlone = userId === currentUser.id.toString();
  const listHeight = isFriendListAlone
    ? "h-[230px] lg:h-[600px]"
    : "h-[400px] lg:h-[800px]";

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // // Block friend
  const handleblockFriend = async (userid) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+":8000/api/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userid }),
        credentials: "include",
      });
      if (response.ok) {
        fetchFriendsof();
        fetchRequests();
        fetchBlocked();
      }
    } catch (error) {
      toast.error("Error blocking friend:");
    }
  };

  // // Unblock friend
  const handleUnblockFriend = async (friendId) => {
    // setUnblkloading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+":8000/api/unblock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: friendId }),
        credentials: "include",
      });
      if (response.ok) {
        fetchFriendsof();
        fetchRequests();
        fetchBlocked();
      }
    } catch (error) {
      toast.error("Error unblocking friend");
    }
  };

  // // Accept friend
  const handleAcceptFriend = async (friendId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+":8000/api/accept_friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friend_id: friendId }),
        credentials: "include",
      });
      if (response.ok) {
        fetchFriendsof();
        fetchRequests();
        fetchBlocked();
      }
    } catch (error) {
      toast.error("Error accepting friend");
    }
  };
  // // Accept friend
  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+":8000/api/remove_friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friend_id: friendId }),
        credentials: "include",
      });
      if (response.ok) {
        fetchFriendsof();
        fetchRequests();
        fetchBlocked();
      }
    } catch (error) {
      toast.error("Error accepting friend:");
    }
  };

  // // Reject friend
  const handleRejectFriend = async (friendId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+":8000/api/reject_friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friend_id: friendId }),
        credentials: "include",
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      toast.error("Error rejecting friend");
    }
  };
  const inviteFriendToGame = async (friendId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+":8000/api/invite_friend", {
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
      toast.error("Error rejecting friend");
    }
  };

  return (
    <div className="w-full lg:max-w-[1200px] p-2 mb-24 lg:h-full">
    <h1 className="text-white text-center w-full text-xl lg:text-3xl font-bold mb-4 mt-2">
      Friends List
    </h1>
  
    {/* Friends List */}
    <div
      className={`bg-gray-800/65 rounded-xl border w-full p-4 border-violet-primary ${listHeight} overflow-y-auto no-scrollbar p-41`}
    >
      {friends?.length > 0 ? (
        friends.map((friend, index) => (
          <div
            key={index}
            className="flex justify-center items-center bg-gray-700/70 h-[90px] w-full hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 my-2 shadow-lg hover:shadow-2xl"
          >
            <Link className="flex items-center " href={`/profile/${friend.id}`} key={friend.id}>
              <div className=" lg:relative h-14 w-14 rounded-full">
                <img
                  src={friend.profile_pic_url}
                  alt="User Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div className="flex flex-col justify-center ml-4">
                <span className="text-md font-semibold text-white">
                  {friend.username}
                </span>
              </div>
            </Link>
            <div className="ml-auto flex space-x-2 lg:space-x-4">
              <Link href={`/chat/${friend.id}`}>
                <button
                  aria-label="Chat"
                  className="hover:text-blue-500 text-white transition-colors"
                >
                  <IoChatbubbleEllipsesSharp className="w-6 h-6 text-blue-600 hover:text-blue-900" />
                </button>
              </Link>
              <button
                onClick={() => inviteFriendToGame(friend.id)}
                aria-label="Invite"
                className="hover:text-red-500 text-white transition-colors"
              >
                <FaTableTennisPaddleBall className="w-6 h-6 text-red-600 hover:text-red-900" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white">
                  <FaEllipsisV />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-14 lg:mr-32 bg-gray-800/60 border-violet-primary">
                  <DropdownMenuItem onClick={() => { handleRemoveFriend(friend.id)}}>
                    <span className="text-white">Unfriend</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black" />
                  <DropdownMenuItem onClick={() => handleblockFriend(friend.id)}>
                    <span className="text-white">Block</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-white">
          No data found
        </div>
      )}
    </div>
  
    {/* Conditional rendering based on userId */}
    {userId === currentUser.id.toString() && (
      <>
        {/* Request List */}
        <div className="lg:flex lg:gap-4 ">
          <div className="lg:flex lg:flex-col lg:w-full">
            <h1 className="text-white text-center w-full text-xl font-bold mb-4 mt-2">
              Request List
            </h1>
            <div className="bg-gray-800/65 rounded-xl border w-full border-violet-primary gap-4 h-[250px] overflow-y-auto no-scrollbar p-4">
              {requests?.length > 0 ? (
                requests.map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center h-[90px] bg-gray-700/70 hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
                  >
                    <Link className="flex items-center" href={`/profile/${request.id}`} key={request.id}>
                      <div className="h-14 w-14 rounded-full overflow-hidden">
                        <img
                          src={request.profile_pic_url}
                          alt="mode solo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center ml-4">
                        <span className="text-md font-semibold text-white">
                          {request.username}
                        </span>
                      </div>
                    </Link>
                    <div className="ml-auto flex space-x-4">
                      {request.sender_id === currentUser.id ? (
                        <span className="text-white font-black tracking-[1.5px]">
                          Pending
                        </span>
                      ) : (
                        <>
                          <button
                            aria-label="Accept"
                            className="text-white transition-colors"
                            onClick={() => handleAcceptFriend(request.id)}
                          >
                            <FaRegCircleCheck className="w-6 h-6 text-green-600 hover:text-green-900" />
                          </button>
                          <button
                            aria-label="Decline"
                            className="text-white transition-colors"
                            onClick={() => handleRejectFriend(request.id)}
                          >
                            <IoCloseCircle className="w-7 h-7 text-red-600 hover:text-red-900" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white">
                  No data found
                </div>
              )}
            </div>
          </div>
          <div className="lg:flex lg:flex-col lg:w-full">
            <h1 className="text-white text-center w-full text-xl font-bold mb-4 mt-2 ">
              Blocked List
            </h1>
            <div className="bg-gray-800/65 rounded-xl border w-full border-violet-primary grid grid-cols-1 gap-4 h-[250px] overflow-y-auto no-scrollbar p-4">
              {blocked?.length > 0 ? (
                blocked.map((block, index) => (
                  <div
                    key={index}
                    className="flex items-center h-[90px] bg-gray-700/70 hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
                  >
                    <Link className="flex items-center" href={`/profile/${block.id}`} key={block.id}>
                      <div className="h-14 w-14 rounded-full overflow-hidden">
                        <img
                          src={block.profile_pic}
                          alt="mode solo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center ml-4">
                        <span className="text-md font-semibold text-white">
                          {block.username}
                        </span>
                      </div>
                    </Link>
                    <div className="ml-auto flex space-x-4">
                      <button
                        className=" text-white transition-colors"
                        aria-label="Unblock user"
                      >
                        <CgUnblock
                          className="w-6 h-6  text-white hover:text-black"
                          aria-label="unblock"
                          onClick={() => handleUnblockFriend(block.id)}
                        />
                      </button>
                      <span className="absolute bottom-full mb-1 hidden group-hover:block text-sm text-white bg-gray-700 rounded-md px-2 py-1">
                        Unblock
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white">
                  No data found
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )}
  </div>
  
  );
};

export default Friends;
