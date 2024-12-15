import React, { useEffect, useState } from "react";
import DoughnutChart from "../Charts/Winrate";
import { useUser } from "@/services/context/usercontext";
import { MdOutlinePersonAddAlt1, MdPersonAddAlt1 } from "react-icons/md";
import { FaHourglassEnd } from "react-icons/fa";
import { ImBlocked, ImEyeBlocked } from "react-icons/im";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import Link from "next/link";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { IoPersonRemove } from "react-icons/io5";


type User = {
  id: string;
  name: string;
  profile_pic_url?: string;
  xp: number;
  sender_id: number;
  wins: number;
  totalGames: number;
  relationship: string;
};

type UserInfoProps = {
  user: User;
  setUser: (user:any) => void
};

const UserInfo: React.FC<UserInfoProps> = ({ user, setUser }) => {
  const { user: currentUser } = useUser();
  const { name, profile_pic_url, xp, level, id } = user;
  const maxXPPerLevel = 1000;
  const remainingXP = ((user.xp % maxXPPerLevel) / maxXPPerLevel) * 100;
  

  const [loading, setLoading] = useState(false);
  const Router = useRouter ();
  const fetchUser = async () => {
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}:8000/api/userid`, {
      method: 'POST',
      body: JSON.stringify({ id: user.id }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Response not ok:", response.status);
          if (response.status == 400)
            {
              throw new Error("You cannot see this profile");
              toast.error('you cannot see this profile');
              Router.push('dashboard');
            }
        }
        return response.json();
      })
      .then((data: User) => setUser(data))
      .finally(() => setLoading(false));
  };

  // Handle Add Friend
  const handleAddFriend = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/add_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friend_id: id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Friend added successfully:', data);
        // Update the relationship after success
        // onRelationshipChange("Friend");
        fetchUser();
      } else {
        const errorData = await response.json();
        console.log('Failed to add friend:', errorData);
      }
    } catch (error) {
      console.log('Error during the request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Block Friend
  const handleBlockFriend = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Friend blocked successfully:');
        Router.push("/dashboard");
        // Update the relationship after success
        // onRelationshipChange("Blocked");
        fetchUser();

      } else {
        const errorData = await response.json();
        toast.error('Failed to block friend:');
      }
    } catch (error) {
      console.log('Error during the request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Unblock Friend
  const handleUnblockFriend = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Friend unblocked successfully:', data);
        // Update the relationship after success
        // onRelationshipChange("None");
        fetchUser();

      } else {
        const errorData = await response.json();
        console.log('Failed to unblock friend:', errorData);
      }
    } catch (error) {
      console.log('Error during the request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Remove Friend
  const handleRemoveFriend = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/remove_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friend_id: id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Friend removed successfully:', data);
        // Update the relationship after success
        // onRelationshipChange("None");
        fetchUser();

      } else {
        const errorData = await response.json();
        console.log('Failed to remove friend:', errorData);
      }
    } catch (error) {
      console.log('Error during the request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Accept Friend Request
  const handleAcceptFriend = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/accept_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friend_id: id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Friend request accepted:', data);
        // Update the relationship after success
        // onRelationshipChange("Friend");
        fetchUser();

      } else {
        const errorData = await response.json();
        console.log('Failed to accept friend request:', errorData);
      }
    } catch (error) {
      console.log('Error during the request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Reject Friend Request
  const handleRejectFriend = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/reject_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friend_id: id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Friend request rejected:', data);
        // Update the relationship after success
        // onRelationshipChange("Unknown");
        fetchUser();

      } else {
        const errorData = await response.json();
        console.log('Failed to reject friend request:', errorData);
      }
    } catch (error) {
      console.log('Error during the request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" w-full rounded-xl p-2">
        <div className="flex gap-2">   
          <div className="flex-shrink-0 w-3/5">
            <div className="mb-4 max-w-full aspect-square  mx-auto">
              <img
                src={user.profile_pic_url}
                alt="User Profile"
                className="w-full h-auto object-cover h-auto rounded-2xl"
              />
              {currentUser?.id !== user?.id && 
              <div className="text-white text-xl font-bold text-center mt-2"><p>{user.username} </p></div>}
            </div>
            <div className="flex flex-col border-[2px] border-violet-primary rounded-xl m-1 h-auto w-full p-2">
              <p className="text-white font-semibold text-xs justify-start flex">Level {user.level}</p>
              <div className="flex items-center h-2 w-full rounded-xl bg-white">
                <div
                  className="bg-violet-primary h-2 rounded-xl"
                  style={{ width: `${remainingXP}%` }}
                ></div>
              </div>
              <p className="flex justify-end text-white font-light text-xs mr-4 w-full">
                {user.xp} xp
              </p>
            </div>
          </div>

          <div className="flex flex-col w-2/5 ">
            {currentUser?.id === user?.id ? (
              <div className="border-[2px] border-violet-primary rounded-3xl h-auto p-1 mb-2 mr-2">
                <h1 className="text-base mr-2 lg:text-2xl font-bold text-violet-primary text-center">
                  Welcome!
                </h1>
                <p className="text-base lg:text-2xl font-bold text-white text-center">{user.username}</p>
              </div>
            ) : user.relationship === "Friend" ? (
              <div className="border-2 border-violet-primary rounded-3xl p-4 mb-2 mr-2 bg-gray-800 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <button
                  className="px-4 py-2 flex items-center justify-center bg-red-900 text-nowrap lg:text-wrap text-white rounded-lg hover:bg-red-950 transition duration-200 w-full md:w-1/2 lg:w-1/2"
                  onClick={handleRemoveFriend}
                  disabled={loading}
                >
                  <IoPersonRemove  className="text-fluid mr-2 xl:text-base" />
                  Remove Friend
                </button>
                <button
                  className="px-4 py-2 flex items-center justify-center bg-red-900 text-white rounded-lg hover:bg-red-950 transition duration-200 w-full md:w-1/2 lg:w-1/2"
                  onClick={handleBlockFriend}
                  disabled={loading}
                >
                  <ImBlocked className="text-fluid mr-2 xl:text-base" />
                  Block
                </button>
              </div>
            ) : user.relationship === "Friend Request" && user?.sender_id !== currentUser?.id ? (
              <div className="border-2 border-violet-primary rounded-3xl p-4 mb-2 mr-2 bg-gray-800 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <button
                  className="px-4 py-2 flex items-center justify-center bg-green-900 text-white rounded-lg hover:bg-green-950 transition duration-200 w-full md:w-1/2 lg:w-1/2"
                  onClick={handleAcceptFriend}
                  disabled={loading}
                >
                  <MdOutlinePersonAddAlt1 className="text-fluid mr-2 xl:text-base" />
                  Accept
                </button>
                <button
                  className="px-4 py-2 flex items-center justify-center bg-red-900 text-white rounded-lg hover:bg-red-950 transition duration-200 w-full md:w-1/2 lg:w-1/2"
                  onClick={handleRejectFriend}
                  disabled={loading}
                >
                  <ImEyeBlocked className="text-fluid mr-2 xl:text-base" />
                  Reject
                </button>
              </div>
            ) : user.relationship === "Friend Request" && user?.sender_id === currentUser?.id ? (
              <div className="border-2 border-violet-primary rounded-3xl p-4 mb-2 mr-2 bg-gray-800 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <button
                  className="px-4 py-2 flex items-center justify-center bg-orange-400 text-white rounded-lg hover:bg-orange-450 transition duration-200 w-full md:w-1/2 lg:w-1/2"
                  disabled
                >
                  <FaHourglassEnd className="text-fluid mr-2 xl:text-base" />
                  Pending
                </button>
                <button
                  className="px-4 py-2 flex items-center justify-center bg-red-900 text-white rounded-lg hover:bg-red-950 transition duration-200 w-full md:w-1/2 lg:w-1/2"
                  onClick={handleRejectFriend}
                  disabled={loading}
                >
                  <ImEyeBlocked className="text-fluid mr-2 xl:text-base" />
                  Cancel
                </button>
              </div>
            ) : (
              <div className="border-2 border-violet-primary rounded-3xl p-4 mb-2 mr-2 bg-gray-800 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <button
                  className="px-4 py-2 flex items-center justify-center bg-green-900 text-white rounded-lg hover:bg-green-950 transition duration-200 w-full md:w-1/2 lg:w-1/2"
                  onClick={handleAddFriend}
                  disabled={loading}
                >
                  <MdPersonAddAlt1 className="text-fluid mr-2 xl:text-base" />
                  Add Friend
                </button>
                <button
                  className="px-4 py-2 flex items-center justify-center bg-red-900 text-white rounded-lg hover:bg-red-950 transition duration-200 w-full md:w-1/2 lg:w-1/2"
                  onClick={handleBlockFriend}
                  disabled={loading}
                >
                  <ImBlocked className="text-fluid mr-2 xl:text-base" />
                  Block
                </button>
              </div>
            )}

            <div className="p-2 rounded-xl border h-full border-violet-primary mr-2">
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-800/20 rounded-xl">
                <p className="text-white font-mont xl:font-bold xl:text-lg text-xs m-1">Win Rate</p>
                <div className="relative w-full h-full flex items-center justify-center">
                  <DoughnutChart idUser={user.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
