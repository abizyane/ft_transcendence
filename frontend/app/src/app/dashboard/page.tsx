"use client";
import { useEffect, useState } from "react";
import UserInfo from "@/components/dashboardcomponents/userinfo";
import Linechart from "@/components/Charts/Linechart";
import data from "@/app/data/Dashboarddata.json";
import History from "@/components/dashboardcomponents/history";
import TopPlayers from "@/components/dashboardcomponents/topplayers";
import Friends from "@/components/dashboardcomponents/friends";


const Dashboard = () => {

  const user = data.user;
  const values = user.charts.lineChart.data;
  const gameHistory = user.history;

  return (
    <>
      <div className="flex flex-1  lg:w-full px-1 overflow-hidden justify-center items-center">
        <div className="flex-1 w-full flex flex-col items-center justify-center mb-14 mt-2 relative">
          <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl lg:w-2/4 lg:border border-violet-primary mb-4 lg:mb-0">
              <UserInfo />
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm  rounded-xl flex-1 border border-violet-primary">
              <p className="m-2 text-white text-2xl p-4 font-extrabold w-full">
                Experience Performance
              </p>
              <div className=" w-[99%] justify-center items-center">
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
    </>
  );
};

export default Dashboard;
