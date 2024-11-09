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


const page = () => {
    const param = useParams();
    const userId= param.id;
    const { user:currentuser } = useUser();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    if (currentuser?.id === userId)
      {
        
        setUser(currentuser);
      }
    else
    {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:8000/api/userid`,{
      method : 'POST',
      body : JSON.stringify({id : userId}),
      headers :{
       'content-type' : 'application/json',
      },
      credentials : 'include',
      }
      )
        .then((response) => {
          if (!response.ok) throw new Error("User not found");
          return response.json();
        })
        .then((data: User) => setUser(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [userId, currentuser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return null;
  return (
    <div className="flex flex-1  w-full px-1 overflow-hidden justify-center items-center">
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
        <Friends/>
      </div>
    </div>
  </div>
  )
}

export default page