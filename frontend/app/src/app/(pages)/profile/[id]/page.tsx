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
import Loader from "components/loader/loader";
import Rookie from "../../../../../public/Rookie.svg";
import Challenger from "../../../../../public/Challenger.svg";
import Legend from "../../../../../public/Legend.svg";
import Expert from "../../../../../public/expert.svg";
import Grandmaster from "../../../../../public/Grandmaster.svg";
import ProfileChart from "@/components/Charts/profileChart";

const user = data.user;
const values = user.charts.lineChart.data;
const gameHistory = user.history;


const Page = () => {
  const { id: userId } = useParams();
  const { user: currentUser, userloading } = useUser();
  const [user, setUser] = useState< User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState(1);

  const levelImages = {
    1: Rookie.src,
    2: Challenger.src,
    3: Legend.src,
    4: Expert.src,
    5: Grandmaster.src,
  };
  

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
  useEffect(() => {
    if (user && user.level !== undefined) {
      const level = Math.floor(user.level / 5) + 1;
      setUserLevel(level);
    }
  }, [user]);

  const getLevelImage = (level) => {
    if (levelImages[level]) return levelImages[level];
    return Rookie;
  };

  if (userloading) return (<div className="w-full h-full flex justify-center items-center"><Loader/></div>);
  if (loading) return (<div className="w-full h-full flex justify-center items-center"><Loader/></div>);
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user found.</p>;
  return (
    <div className="mt-10 lg:mt-0 flex flex-1  w-full px-1 overflow-hidden justify-center items-center">
    <div className="flex-1 w-full flex flex-col items-center justify-center mb-14 mt-2 relative">
      <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl lg:w-2/4 lg:border border-violet-primary mb-4 lg:mb-0">
          <UserInfo user={user} setUser={setUser}/>
        </div>
        <div className="bg-gray-800/60 backdrop-blur-sm  rounded-xl flex-1 border border-violet-primary">
          <p className="m-2 text-white text-2xl p-4 font-extrabold w-full">
              Rank
          </p>
          <div className="h-64  flex justify-center items-center">
          <img
            src={getLevelImage(userLevel)}
            alt="User Rank"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
        <ProfileChart user={user} />
        {currentUser?.id == userId ? 
         <TopPlayers /> :
        <div className="w-full lg:w-1/3 py-4 lg:h-full">
        <History/> 
        </div>
        }
        <Friends user={user}/>
      </div>
    </div>
  </div>
  )
}

export default Page

