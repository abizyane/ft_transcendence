import React from "react";
import Profil from "../../../../../public/Profil.jpg";

const MatchDetails = ({ player1, player2, score }: { player1: string; player2: string; score: string }) => {
  return (
    <div className="flex flex-row items-center justify-between bg-gray-800/70 py-4  rounded-2xl border border-violet-primary mb-4
      md:px-2 lg:py-6 lg:px-2">
      <div className="flex items-center justify-start">
        <img
          src={Profil.src}
          alt={`${player1} Profile`}
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full mx-1"
        />
        <p className="font-thin text-white text-xs text-nowrap md:text-base lg:text-lg">{player1}</p>
      </div>
      <div className="flex items-center justify-center mx-3">
      <p className="font-bold text-white text-center text-xs w-10  md:text-base lg:text-lg">{score}</p>
        </div>
        <div className="flex justify-end items-center">
        <p className="font-thin text-white text-nowrap text-xs md:text-base lg:text-lg">{player2}</p>
        <img
          src={Profil.src}
          alt={`${player2} Profile`}
          className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full mx-1"
          />
          </div>
    </div>
  );
};

const TournamentDetails = ({ title, image, rounds }: { title: string; image: string; rounds: any[] }) => {
  return (
    <div className="bg-gray-800/70 rounded-xl border border-violet-primary mb-6 h-fit py-4 md:px-2 md:py-6 lg:px-2 lg:py-6">
      <div className="flex items-center justify-center my-1 w-full">
        <img
          src={image}
          alt={`${title} Image`}
          className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full mr-4"
        />
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">{title}</h3>
      </div>

      <div className="px-1">
        {rounds.map((round, index) => (
          <div key={index} className="mb-6">
            <h4 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-4">{round.title}</h4>
            <div className="space-y-4">
              {round.matches.map((match, matchIndex) => (
                <MatchDetails key={matchIndex} {...match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const tournamentData = [
    {
      title: "Tournament 1",
      image: Profil.src,
      rounds: [
        {
          title: "Semi-Finals",
          matches: [
            { player1: "Team A", player2: "Team B", score: "8:6" },
            { player1: "Team C", player2: "Team D", score: "10:9" },
          ],
        },
        {
          title: "Finals",
          matches: [{ player1: "Team A", player2: "Team C", score: "12:10" }],
        },
      ],
    },
    {
      title: "Tournament 2",
      image: Profil.src,
      rounds: [
        {
          title: "Semi-Finals",
          matches: [
            { player1: "Team E", player2: "Team F", score: "9:7" },
            { player1: "Team G", player2: "Team H", score: "11:8" },
          ],
        },
        {
          title: "Finals",
          matches: [{ player1: "Team E", player2: "Team G", score: "13:11" }],
        },
      ],
    },
  ];

  return (
    <div className="h-full py-10 px-4 max-w-screen-2xl lg:min-w-full">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-6">History</h1>

      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
        {/* 1 VS 1 Section */}
        <div className="w-full lg:w-1/2 p-2 rounded-xl border border-violet-primary mb-6 lg:mb-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center text-white mb-4">1 VS 1</h2>
          <div className="space-y-4 overflow-y-auto max-h-64 lg:max-h-[30rem]">
            <MatchDetails player1="Player1" player2="Player2" score="5:3" />
            <MatchDetails player1="Player3" player2="Player4" score="6:4" />
            <MatchDetails player1="Player5" player2="Player6" score="7:5" />
          </div>
        </div>

        {/* Tournament Section */}
        <div className="w-full lg:w-1/2 p-2 rounded-xl border border-violet-primary">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center text-white mb-4">Tournaments</h2>
          <div className="space-y-6 overflow-y-auto max-h-[30rem] lg:max-h-[40rem]">
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
