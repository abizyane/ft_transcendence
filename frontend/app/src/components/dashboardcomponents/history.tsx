import data from "@/app/data/Dashboarddata.json";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "components/loader/loader";

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

const history = ({id}: {id: number}) => {
    const user = data.user;
    // const gameHistory = user.history;
    const [gameHistory, setGameHistory] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      fetch(`http://localhost:8000/api/games_history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
        credentials: 'include',
      })
      .then(async (response) => {
        if (!response.ok) {
          console.log("Response not ok:", response.status);
          // throw new Error("User not found");
        }
        const responseData = await response.json();
        setGameHistory(responseData.history);
      }).finally(() => {
        setLoading(false);
      });
        // .then((data: User) => setUser(data))
        // .catch((err) => setError(err.message))
        // .finally(() => setLoading(false));

    }, [user.history]);
    const renderGame = (game:Game) => (
      <div
        key={game.gameId}
        className="flex flex-row items-center justify-between bg-gray-800/70 p-2 rounded-[34px] border border-violet-primary"
      >
        <div className="flex items-center space-x-2 flex-1">
          <img
            src={game.player.picture}
            alt={`${game.player.username} Image`}
            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="font-bold text-white text-xs">
              {game.player.username}
            </p>
            <p className="text-xs text-gray-400 text-nowrap">
              @{game.player.username}
            </p>
          </div>
        </div>
        <p className="font-semibold text-white text-center w-20 mx-4">
          {game.score.user}:{game.score.opponent}
        </p>  
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <div className="flex flex-col items-end">
            <p className="font-bold text-white text-xs">
              {game.opponent.username}
            </p>
            <p className="text-xs text-gray-400 text-nowrap">
              @{game.opponent.username}
            </p>
          </div>
          <img
            src={game.opponent.picture}
            alt={`${game.opponent.username} Image`}
            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
          />
        </div>
      </div>
    );
  
    return (
      
        <div className="mt-8 w-full lg:mt-0 py-4 lg:w-1/3 lg:flex lg:flex-col overflow-hidden">
          <div className="bg-gray-800/60 rounded-xl border border-violet-primary flex flex-col flex-1 ">
            <div className="m-2 flex justify-between items-center">
              <p className="m-2 text-white text-2xl font-extrabold">History</p>
              <Link href="/history">
              <div className="m-2 p-2 border-2 border-violet-primary backdrop-blur-lg rounded-xl hover:bg-violet-primary">
                <p className="text-white">View All</p>
              </div>
              </Link>
            </div>
  
            <div className="p-1 sm:p-2 flex-1 overflow-auto">
              {loading ? 
              <div className="w-full h-full flex justify-center items-center">
                <Loader/> 
                
              </div>              
                : <div className="flex flex-col space-y-2 w-full h-full">
                {gameHistory.length ? (
                  gameHistory
                    .slice(-3)
                    .reverse()
                    .map((game) =>
                      renderGame(game)
                    )
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <p className="text-xl text-white-primary font-bold">
                      No Data Found.
                    </p>
                  </div>
                )}
              </div>}
            </div>
          </div>
        </div>
    );
  };
  
  export default history;
  