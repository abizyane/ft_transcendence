import React from 'react';
import Profil from "../../../../public/Profil.jpg";

const players = [
  { rank: 1, name: "Alice Johnson", username: "@alicej", totalGames: 120, score: 9800 },
  { rank: 2, name: "Bob Smith", username: "@bobsmith", totalGames: 110, score: 9500 },
  { rank: 3, name: "Charlie Brown", username: "@charlieb", totalGames: 90, score: 9200 },
  { rank: 4, name: "Diana Prince", username: "@dianaprince", totalGames: 85, score: 8900 },
  { rank: 5, name: "Ethan Hunt", username: "@ethanh", totalGames: 75, score: 8600 },
  { rank: 6, name: "Fiona Gallagher", username: "@fionag", totalGames: 70, score: 8300 },
  { rank: 7, name: "George Lucas", username: "@georgel", totalGames: 65, score: 8000 },
  { rank: 8, name: "Hannah Montana", username: "@hannahm", totalGames: 60, score: 7800 },
  { rank: 9, name: "Isaac Newton", username: "@isaacn", totalGames: 55, score: 7600 },
  { rank: 10, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 11, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 12, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 13, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 14, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 15, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 16, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 17, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 18, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 19, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 20, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 21, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
  { rank: 22, name: "Julia Roberts", username: "@juliar", totalGames: 50, score: 7400 },
];

const page = () => {
  return (
    <div className="w-full h-full flex flex-col  pb-24 md:pb-0 ">
        <div className='flex gap-4 flex-col md:w-full p-2  md:flex-row'>

      <div className="w-full md:w-1/3 md:h-fit md:order-2 md:mb-4">
        <div className="w-full  flex">
          <div className="border-2 rainbow-border p-4 flex flex-col text-white lg:h-[300px] rounded-xl bg-gradient-to-r from-[rgba(248,229,123,0.45)] to-[rgba(70,65,28,0.89)] justify-center items-center w-full">
            <img src={Profil.src} alt="player3 Profil" className="h-14 w-14 lg:w-48 lg:h-48 border-2 rounded-full" />
            <span className="font-bold text-center text-lg ">Name</span>
            <span className="w-full text-center font-thin">@username</span>
            <div className="w-full flex text-center pt-2 font-bold gap-4 text-white justify-between items-center">
              <span className="w-1/3 text-base text-nowrap">Score 8250</span>
              <span className="w-1/3 text-base text-nowrap">Rank #1</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3  md:h-fit md:order-1 md:mt-4">
        <div className="w-full  flex">
          <div className="border-2  hover:border-gray-600 p-4 flex flex-col text-white  lg:h-[300px] rounded-xl bg-gradient-to-r from-[rgba(186,185,185,0.47)] to-[rgb(57,58,57)] justify-center items-center  w-full">
            <img src={Profil.src} alt="player3 Profil" className="h-14 w-14 lg:w-48 lg:h-48 border-2 rounded-full" />
            <span className="font-bold text-center text-lg ">Name</span>
            <span className="w-full text-center font-thin">@username</span>
            <div className="w-full flex text-center pt-2 font-bold gap-4 text-white justify-between items-center">
              <span className="w-1/3 text-base text-nowrap">Score 8250</span>
              <span className="w-1/3 text-base text-nowrap">Rank #2</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3 md:h-fit md:order-3 md:mt-4">
        <div className="w-full  flex">
          <div className="border-2 hover:border-orange-200 p-4 flex flex-col text-white lg:h-[300px] rounded-xl bg-gradient-to-r from-[rgba(255,190,50,0.3)] to-[rgba(59,42,11,0.3)] justify-center items-center w-full">
            <img src={Profil.src} alt="player3 Profil" className="h-14 w-14 lg:w-48 lg:h-48 border-2 rounded-full" />
            <span className="font-bold text-center text-lg ">Name</span>
            <span className="w-full text-center font-thin">@username</span>
            <div className="w-full flex text-center pt-2 font-bold gap-4 text-white justify-between items-center">
              <span className="w-1/3 text-base text-nowrap">Score 8250</span>
              <span className="w-1/3 text-base text-nowrap">Rank #3</span>
            </div>
          </div>
        </div>
      </div>
        </div>
        <div className="h-96 md:h-fit pt-4">
  <div className="md:overflow-hidden rounded-tl-lg rounded-tr-lg">
    <table className="w-full bg-gray-800/60 text-center">
      <thead className="bg-gray-800/70">
        <tr>
          <th className="w-1/5 h-14 text-white text-xs md:text-base lg:text-xl md:font-bold rounded-tl-lg">Rank</th>
          <th className="w-1/5 h-14 text-white text-xs md:text-base lg:text-xl md:font-bold">Name</th>
          <th className="w-1/5 h-14 text-white text-xs md:text-base lg:text-xl md:font-bold">Username</th>
          <th className="w-1/5 h-14 text-white text-xs md:text-base lg:text-xl md:font-bold">Total Games</th>
          <th className="w-1/5 h-14 text-white text-xs md:text-base lg:text-xl md:font-bold rounded-tr-lg">Score</th>
        </tr>
      </thead>
    </table>
  </div>
  <div className="overflow-y-auto h-[400px] md:h-[740px] rounded-bl-lg rounded-br-lg">
    <table className="w-full text-center">
      <tbody>
        {players.map((player) => (
          <tr key={player.rank} className="bg-gray-800/60 transition-colors duration-200">
            <td className="w-1/5 text-white text-xs md:text-base lg:text-xl md:font-bold p-2">{player.rank}</td>
            <td className="w-1/5 text-white text-xs md:text-base lg:text-xl md:font-bold p-2">{player.name}</td>
            <td className="w-1/5 text-white text-xs md:text-base lg:text-xl md:font-bold p-2">{player.username}</td>
            <td className="w-1/5 text-white text-xs md:text-base lg:text-xl md:font-bold p-2">{player.totalGames}</td>
            <td className="w-1/5 text-white text-xs md:text-base lg:text-xl md:font-bold p-2">{player.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      
      </div>
  );
};

export default page;
