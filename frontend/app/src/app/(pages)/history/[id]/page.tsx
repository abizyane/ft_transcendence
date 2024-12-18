"use client"
import React from "react";
import Profil from "../../../../../public/Profil.jpg";
import { useUser } from "@/services/context/usercontext";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from '@/components/loader/loader';

import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";


const MatchDetails = ({ match }: { match: Game }) => {
  if (!match) return 
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
          src={match.player.picture}
          alt={`${match.player.username} Profile`}
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full mx-1"
        />
        <p className="font-thin text-white text-xs text-nowrap md:text-base lg:text-lg">{match.player.username}</p>
      </div>
      <div className="flex flex-col items-center justify-center mx-3">
        <p className="font-bold w-full text-white text-center text-xs w-10  md:text-base lg:text-lg">{match.score.user}:{match.score.opponent}</p>
        {match.date ? <>
            <p className="ml-4 w-full text-white-primary whitespace-nowrap">
              {isToday(new Date(match.date))
                ? formatDistanceToNow(new Date(match.date), {
                    addSuffix: true,
                  })
                : isYesterday(new Date(match.date))
                ? "Yesterday"
                : format(new Date(match.date), "yyyy-MM-dd")}
            </p>
        </> : <></>}
      </div>
      <div className="flex justify-end items-center">
        <p className="font-thin text-white text-nowrap text-xs md:text-base lg:text-lg">{match.opponent.username}</p>
        <img
          src={match.opponent.picture}
          alt={`${match.opponent.username} Profile`}
          className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full mx-1"
        />
      </div>
    </div>
  );
};

const TournamentDetails = ({ tournament }: { tournament: Tournament }) => {
  return (
    <div className="bg-gray-800/70 rounded-xl border border-violet-primary mb-6 h-fit py-4 md:px-2 md:py-6 lg:px-2 lg:py-6">
      <div className="flex items-center justify-center my-1 w-full">
        <img
          src={tournament.picture}
          alt={`${tournament.name} Image`}
          className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full mr-4"
        />
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">{tournament.name}</h3>
      </div>

      <div className="px-1">
        
        {tournament.matchs.map((match, index) => (
          <div key={index} className="mb-6">
            <h4 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-4">{match.type}</h4>
            <div className="space-y-4">
                <MatchDetails key={index} match={match} />
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

interface TournamentMatch {
  type: string;
  player: User;
  opponent: User;
  score: GameScore;
  result: string;
  }

interface Tournament {
  name: string;
  picture: string;
  winner: string;
  date: string;
  matchs: Game[];
}

const HistoryPage = () => {
  const { id: userId } = useParams();
  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  const [tournamentHistory, setTournamentHistory] = useState<Tournament[]>([]);
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
      
      
      fetch(`${process.env.NEXT_PUBLIC_HOST_URL}:8000/api/tournament_history`, {
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
          setTournamentHistory(responseData.tournaments);
          console.log(responseData)

        })
        .finally(() => {
          setLoading(false);
        });
  }, []);
 

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
                <MatchDetails key={index} match={game} />
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
            {tournamentHistory.map((tournament, index) => (
              <TournamentDetails key={index} tournament={tournament} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default HistoryPage;
