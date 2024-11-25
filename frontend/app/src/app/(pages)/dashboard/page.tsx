"use client";
import DoughnutChart from "@/components/Charts/Winrate";
import Profil from "../../../../public/Profil.jpg";
import History from "@/components/dashboardcomponents/history";
import LineChart from "../../../components/Charts/Linechart";
import Data from "../../data/Dashboarddata.json";
import { useUser } from "@/services/context/usercontext";

const Dashboard = () => {
  const { user: cUser } = useUser();
  console.log(cUser);
  if (!cUser) return null;
  const winRatePercentage = 20;
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
                  <span className="w-1/3">20</span>
                  <span className="w-1/3">11</span>
                  <span className="w-1/3">9</span>
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
                  <DoughnutChart winpercentage={winRatePercentage} />
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
                    <span className="w-1/2">20</span>
                    <span className="w-1/2">11</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8 w-full">
            <div className="w-full lg:w-1/2 p-4 rounded-xl border border-violet-primary mt-4">
              <h1 className="text-white text-center">Experience Performance</h1>
              <LineChart data={Data.user.charts.lineChart.data} />
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
