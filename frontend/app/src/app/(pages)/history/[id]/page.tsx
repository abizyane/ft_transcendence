"use client"
import React from "react";
import Profil from "../../../../../public/Profil.jpg";
import { useUser } from "@/services/context/usercontext";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from '@/components/loader/loader';

import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";


const MatchDetails = ({ game }: { game: Game }) => {
  if (!game) return 
  (
    <div className="flex items-center justify-center">
      <Loader />
    </div>
  );
  return (
    <div className="flex flex-row items-center justify-between bg-gray-800/70 py-4  rounded-2xl border border-violet-primary mb-4
      md:px-2 lg:py-6 lg:px-2">
      <div className="flex items-center justify-start">
        <img
          src={game.player.picture}
          alt={`${game.player.username} Profile`}
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full mx-1"
        />
        <p className="font-thin text-white text-xs text-nowrap md:text-base lg:text-lg">{game.player.username}</p>
      </div>
      <div className="flex flex-col items-center justify-center mx-3">
        <p className="font-bold w-full text-white text-center text-xs w-10  md:text-base lg:text-lg">{game.score.user}:{game.score.opponent}</p>
        {game.date ? <>
            <p className="ml-4 w-full text-white-primary whitespace-nowrap">
              {isToday(new Date(game.date))
                ? formatDistanceToNow(new Date(game.date), {
                    addSuffix: true,
                  })
                : isYesterday(new Date(game.date))
                ? "Yesterday"
                : format(new Date(game.date), "yyyy-MM-dd")}
            </p>
        </> : <></>}
      </div>
      <div className="flex justify-end items-center">
        <p className="font-thin text-white text-nowrap text-xs md:text-base lg:text-lg">{game.opponent.username}</p>
        <img
          src={game.opponent.picture}
          alt={`${game.opponent.username} Profile`}
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

interface User {
  username: string;
  picture: string;
}

interface GameScore {
  user: number;
  opponent: number;
}

interface Game {
  gameId: number;
  date: string;
  player: User;
  opponent: User;
  score: GameScore;
  result: string;
}

const HistoryPage = () => {
  const { id: userId } = useParams();
  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: cUser, setUser } = useUser();

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}:8000/api/games_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }), // Pass the logged-in user's ID
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          console.log("Response not ok:", response.status);
        }
        const responseData = await response.json();
        console.log(responseData)
        setGameHistory(responseData.history);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
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
    <div className="w-full h-full flex justify-center items-center">

    <div className="h-full py-10 px-4 max-w-screen-2xl lg:min-w-full">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-6">History</h1>

      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
        {/* 1 VS 1 Section */}
        <div className="w-full lg:w-1/2 p-2 rounded-xl border border-violet-primary mb-6 lg:mb-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center text-white mb-4">1 VS 1</h2>
          <div className="h-[518px] space-y-4 overflow-y-auto max-h-64 lg:max-h-[28rem] no-scrollbar">
            {loading ? (
                <div className="flex w-full h-[28rem] items-center justify-center">
                  <Loader />
                </div>
            ) : gameHistory.length > 0 ? (
              gameHistory.map((game, index) => (
                <MatchDetails key={index} game={game} />
              ))
            ) : (
              <div className="flex justify-center  h-[500px] items-center">

              <p className="text-white text-center text-xl">No Games Found .</p>
              </div>
            )}
          </div>
        </div>

        {/* Tournament Section */}
        <div className="w-full lg:w-1/2 p-2 rounded-xl border border-violet-primary">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center text-white mb-4">Tournaments</h2>
          <div className="space-y-6 overflow-y-auto max-h-[30rem] lg:max-h-[28rem] no-scrollbar">
            {tournamentData.map((tournament, index) => (
              <TournamentDetails key={index} {...tournament} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default HistoryPage;
