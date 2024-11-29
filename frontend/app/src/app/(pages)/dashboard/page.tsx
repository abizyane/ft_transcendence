"use client";
import DoughnutChart from "@/components/Charts/Winrate";
import Profil from "../../../../public/Profil.jpg";
import History from "@/components/dashboardcomponents/history";
import LineChart from "../../../components/Charts/Linechart";
import Data from "../../data/Dashboarddata.json";
import { useUser } from "@/services/context/usercontext";
import { useDebugValue, useEffect, useState } from "react";
import Loader from "@/components/loader/loader";

const Dashboard = () => {
  const { user: cUser } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: cUser.id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.log('Failed to fetch stats:', await response.json());
      }
    } catch (error) {
      console.log('Error during the request:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (cUser) {
      fetchDashboard();
    }
  }, [cUser]);

  if (!cUser) return null;
  if (loading) return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader />
    </div>
  );
  if (!dashboardData) return (
    <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-white text-2xl">No data found</h1>
    </div>
  );
  return (
    <>
      <div className="w-full my-10 h-full">
        <div className="p-10 flex flex-col  lg:gap-8 items-center w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 w-full ">
            <img
              src={cUser.profile_pic_url}
              alt="User pic"
              className="rounded-full h-40 w-40 mx-auto lg:mx-0"
            />
            <div className="w-full lg:w-full flex flex-col">
              <div className="w-full flex bg-gray-800/50 h-18 p-2 text-center mt-2 rounded-tl-2xl rounded-tr-2xl text-white">
                <span className="w-1/3">Total Games</span>
                <span className="w-1/3">Games won</span>
                <span className="w-1/3">Games Losses</span>
              </div>
              <div className="w-full  bg-gray-800/50  h-18 p-2 rounded-bl-2xl rounded-br-2xl text-white">
                <div className="border-t w-full flex text-center">
                  <span className="w-1/3">{dashboardData.totalGames}</span>
                  <span className="w-1/3">{dashboardData.wins}</span>
                  <span className="w-1/3">{dashboardData.losses}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 w-full">
            <div className="w-full lg:w-1/2 p-4 rounded-xl border border-violet-primary mt-4">
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-800/20 rounded-xl p-4">
                <p className="text-white font-mont xl:font-bold xl:text-lg text-xs m-1">
                  Win Rate
                </p>
                <div className="relative w-full h-full flex items-center justify-center">
                  <DoughnutChart idUser={cUser.id} />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 ">
              <div className="w-full flex flex-col ">
                <div className="w-full flex bg-gray-800/50 h-18 p-2 text-center mt-2 rounded-tl-2xl rounded-tr-2xl text-white">
                  <span className="w-1/2">Tournament Played</span>
                  <span className="w-1/2">Tournament Won</span>
                </div>
                <div className="w-full flex bg-gray-800/50  h-18 p-2 rounded-bl-2xl rounded-br-2xl text-white">
                  <div className="border-t w-full flex text-center">
                    <span className="w-1/2">{dashboardData.tournamentLosses}</span>
                    <span className="w-1/2">{dashboardData.tournamentWins}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8 w-full">
            <div className="w-full lg:w-1/2 p-4 rounded-xl border border-violet-primary mt-4">
              <h1 className="text-white text-center">Experience Performance</h1>
              <LineChart userid={cUser.id} />
            </div>
            <div className="w-full lg:w-1/2  mt-4">
              <History />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
