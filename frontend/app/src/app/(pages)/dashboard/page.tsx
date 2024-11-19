"use client";
import DoughnutChart from "@/components/Charts/Winrate";
import Profil from "../../../../public/Profil.jpg"
import History from "@/components/dashboardcomponents/history";
import LineChart from '../../../components/Charts/Linechart';
import Data from "../../data/Dashboarddata.json"


const Dashboard = () => {
    const winRatePercentage= 20;
  return (
    <>
      <div className=" w-full mt-10 h-full">
        <div className="p-10 flex flex-col items-center w-full">
            <img src={Profil.src} alt="User pic"   className="rounded-full h-40 w-40 "/>
            <div className="w-full flex bg-gray-800/50 h-18 p-2 text-center  mt-2 rounded-tl-2xl rounded-tr-2xl text-white">
                <span className="w-1/3 ">Total Games</span>
                <span className="w-1/3 ">Games won</span>
                <span className="w-1/3 ">Games Losses</span>
            </div>
            <div className="w-full flex text-center bg-gray-800/50  border-t-2  h-18 p-2 rounded-bl-2xl rounded-br-2xl text-white">
                <span className="w-1/3 ">20</span>
                <span className="w-1/3 ">11</span>
                <span className="w-1/3 ">9</span>
            </div>
            <div className="w-full flex bg-gray-800/50 h-18 p-2 text-center mt-2 rounded-tl-2xl rounded-tr-2xl text-white">
                <span className="w-1/2 ">Tournament Played</span>
                <span className="w-1/2 ">Tournament won</span>
            </div>
            <div className="w-full flex text-center bg-gray-800/50 h-18 p-2  border-t-2 rounded-bl-2xl rounded-br-2xl text-white">
                <span className="w-1/2 ">20</span>
                <span className="w-1/2 ">11</span>
            </div>
            <div className="w-full p-4 rounded-xl border h-full border-violet-primary  mt-4">
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-800/20 rounded-xl p-4">
                <p className="text-white font-mont xl:font-bold xl:text-lg text-xs m-1">Win Rate</p>
                <div className="relative w-full h-full flex items-center justify-center ">
                  <DoughnutChart winpercentage={winRatePercentage} />
                </div>
              </div>
            </div>
            <div className="w-full">
            <div className="w-full p-4 rounded-xl border h-full border-violet-primary  mt-4">
                <h1 className="text-white text-center">Experience Performance</h1>
                <LineChart data={Data.user.charts.lineChart.data} />
            </div>
            </div>
            {/* <History /> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
