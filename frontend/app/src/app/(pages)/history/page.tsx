import React from "react";
import Profil from "../../../../public/Profil.jpg";

const MatchDetails = ({ player1, player2, score }: { player1: string; player2: string; score: string }) => {
  return (
    <div className="flex flex-row items-center justify-between bg-gray-800/70 py-4 px-1 rounded-2xl border border-violet-primary mb-4 
      md:px-4 lg:py-6 lg:px-6">
      <div className="flex items-center">
        <img
          src={Profil.src}
          alt={`${player1} Profile`}
          className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full mx-1"
        />
        <p className="font-thin text-white text-sm md:text-base lg:text-lg">{player1}</p>
      </div>
      <p className="font-bold text-white text-center text-sm w-10 mx-1 md:text-base lg:text-lg">{score}</p>
      <div className="flex items-center">
        <p className="font-thin text-white text-sm md:text-base lg:text-lg">{player2}</p>
        <img
          src={Profil.src}
          alt={`${player2} Profile`}
          className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full mx-1"
        />
      </div>
    </div>
  );
};

const TournamentDetails = ({ title, image, matches }: { title: string; image: string; matches: any[] }) => {
  return (
    <div className="bg-gray-800/70 rounded-xl border border-violet-primary mb-6 px-2 py-2 md:px-6 md:py-4 lg:px-8 lg:py-6">
      <div className="flex items-center justify-center my-1 w-full">
        <img
          src={image}
          alt={`${title} Image`}
          className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full mr-4"
        />
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Name</h3>
      </div>
      <div className="px-1">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-center text-white">{title}</h3>
        {matches.map((match, index) => (
          <MatchDetails key={index} {...match} />
        ))}
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const tournamentData = [
    {
      title: "Semi-Finals",
      image: Profil.src,
      matches: [
        { player1: "Team A", player2: "Team B", score: "8:6" },
        { player1: "Team C", player2: "Team D", score: "10:9" },
      ],
    },
    {
      title: "Finals",
      image: Profil.src,
      matches: [{ player1: "Team A", player2: "Team C", score: "12:10" }],
    },
  ];

  return (
    <div className="h-full py-10 px-4">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-6">History</h1>

      <div className="flex flex-col md:flex-row md:space-x-4">
        {/* 1 VS 1 Section */}
        <div className="md:w-1/2 p-4 md:p-6 lg:p-8 rounded-xl border border-violet-primary mb-6 md:mb-0">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center text-white mb-4">1 VS 1</h2>
          <div className="space-y-4 overflow-y-auto max-h-64 md:max-h-80 lg:max-h-96">
            <MatchDetails player1="Player1" player2="Player2" score="5:3" />
            <MatchDetails player1="Player3" player2="Player4" score="6:4" />
            <MatchDetails player1="Player5" player2="Player6" score="7:5" />
          </div>
        </div>

        {/* Tournament Section */}
        <div className="md:w-1/2 p-4 md:p-6 lg:p-8 rounded-xl border border-violet-primary">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center text-white mb-4">Tournament</h2>
          <div className="space-y-6 overflow-y-auto max-h-96 md:max-h-[30rem] lg:max-h-[40rem]">
            {tournamentData.map((tournament, index) => (
              <TournamentDetails key={index} {...tournament} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
