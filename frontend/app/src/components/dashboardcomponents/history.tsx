import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "components/loader/loader";
import { useUser } from "@/services/context/usercontext";
import { useParams } from 'next/navigation';
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

interface User {
  name: string;
  username: string;
  picture: string;
}

interface Opponent {
  name: string;
  username: string;
  picture: string;
}

interface GameScore {
  user: number;
  opponent: number;
}

interface Game {
  gameId: number;
  player: User;
  opponent: User;
  score: GameScore;
  result: string;
}

interface HistoryProps {
  data: {
    user: User & { history: Game[] };
  };
}

const History = () => {
  const { id: userId } = useParams(); 
  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: cUser, setUser } = useUser();
  const finalUserId =  userId || cUser.id; 


  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}:8000/api/games_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: finalUserId }), // Pass the logged-in user's ID
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          console.log("Response not ok:", response.status);
        }
        const responseData = await response.json();
        setGameHistory(responseData.history);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cUser]);

  if (!cUser) return null;

  const renderGame = (game: Game) => (
    <div
      key={game.gameId}
      className="flex flex-row items-center justify-between bg-gray-800/70 p-2 rounded-[34px] border border-violet-primary"
    >
      <div className="flex items-center space-x-2 flex-1">
        <img
          src={game.player.picture}
          alt={`${game.player.username} Image`}
          className="w-6 h-6 lg:w-12 lg:h-12 rounded-full"
        />
        <div className="flex flex-col">
          <p className="font-bold text-white text-xs">
            {game.player.username}
          </p>
        </div>
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
      <div className="flex items-center space-x-2 flex-1 justify-end">
        <div className="flex flex-col items-end">
          <p className="font-bold text-white text-xs">
            {game.opponent.username}
          </p>
        </div>
        <img
          src={game.opponent.picture}
          alt={`${game.opponent.username} Image`}
          className="w-6 h-6 lg:w-12 lg:h-12 rounded-full"
        />
      </div>
    </div>
  );

  return (
    <div className="mt-8 w-full lg:mt-0 pt-4 lg:pt-0 lg:h-[366px] lg:w-full lg:flex lg:flex-col overflow-hidden">
      <div className="bg-gray-800/60 rounded-xl border border-violet-primary flex flex-col flex-1">
        <div className="m-2 flex justify-between items-center">
          <p className="m-2 text-white text-2xl font-extrabold">History</p>

          {/* Link to the user-specific history page */}
          <Link href={`/history/${finalUserId}`} key={finalUserId}>
            <div className="m-2 p-2 border-2 border-violet-primary backdrop-blur-lg rounded-xl hover:bg-violet-primary">
              <p className="text-white">View All</p>
            </div>
          </Link>
        </div>

        <div className="p-1 sm:p-2 flex-1 overflow-auto">
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col justify-between space-y-2 w-full h-full">
              {gameHistory?.length ? (
                gameHistory
                  .slice(0,3)
                  .map((game) => renderGame(game))
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <p className="text-xl text-white-primary font-bold">
                    No Data Found.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
