'use client'
import UserInfo from "@/components/dashboardcomponents/userinfo";
import Linechart from "@/components/Charts/Linechart";
import data from "@/app/data/Dashboarddata.json";
import History from "@/components/dashboardcomponents/history";
import TopPlayers from "@/components/dashboardcomponents/topplayers";
import Friends from "@/components/dashboardcomponents/friends";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/services/context/usercontext";



const user = data.user;
const values = user.charts.lineChart.data;
const gameHistory = user.history;


const Page = () => {
  const { id: userId } = useParams();
  const { user: currentUser, userloading } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    if (currentUser?.id === userId) {
      setUser(currentUser);
    } else {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:8000/api/userid`, {
        method: 'POST',
        body: JSON.stringify({ id: userId }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            console.log("Response not ok:", response.status);
            throw new Error("User not found");
          }
          return response.json();
        })
        .then((data: User) => setUser(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [userId, currentUser]);

  if (userloading) return <p className="text-white">Loading...</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user found.</p>;
  return (
    <div className="mt-10 lg:mt-0 flex flex-1  w-full px-1 overflow-hidden justify-center items-center">
    <div className="flex-1 w-full flex flex-col items-center justify-center mb-14 mt-2 relative">
      <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl lg:w-2/4 lg:border border-violet-primary mb-4 lg:mb-0">
          <UserInfo user={user}/>
        </div>
        <div className="bg-gray-800/60 backdrop-blur-sm  rounded-xl flex-1 border border-violet-primary">
          <p className="m-2 text-white text-2xl p-4 font-extrabold w-full">
            Experience Performance
          </p>
          <div className=" w-[90%] h-[90%] justify-center items-center">
            <Linechart data={values} />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
        <History />
        <TopPlayers />
        <Friends user={user}/>
      </div>
    </div>
  </div>
  )
}

export default Page