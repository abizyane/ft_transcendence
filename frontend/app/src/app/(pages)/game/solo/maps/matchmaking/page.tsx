"use client";

import Image from "next/image";
import Mars from "../../../../../../../public/Mars.jpeg";
import { useEffect, useRef, useState } from "react";
import VS from "../../../../../../../public/VS.jpeg";
import Link from "next/link";
import { useUser } from "@/services/context/usercontext";
import { useSearchParams, useRouter } from "next/navigation";
import Loader from "../../../../../../components/loader/loader";
import Vsbotcanva from "@/components/Localcanva/page";
import Localgamecanva from "@/components/twopcanvas/page";
import Canvas from "@/components/Canva/page";
import ConfettiComponent from "@/components/Celebration/win";

// Default competitors and user data
const defaultCompetitors = [
  {
    username: "player2",
    profile_pic_url: "/player2.jpg",
    level: 5,
    xp: 756,
  },
  {
    username: "random",
    profile_pic_url: "/profile-bot.jpg",
    level: 1,
    xp: 0,
  },
  {
    id: 2,
    username: "bot",
    profile_pic_url: "/bot.jpg",
    level: 8,
    xp: 600,
  },
];


const randomizeUser = () => {
  const randomPic = `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 100)}.jpg`;
  const randomLevel = Math.floor(Math.random() * 100); // Random level between 0-100
  const randomXP = Math.floor(Math.random() * 1000);
  const maxXPPerLevel = 1000;
  const remainingXP = ((randomXP % maxXPPerLevel) / maxXPPerLevel) * 100;

  return {
    profile_pic_url: randomPic,
    username: `User_${Math.floor(Math.random() * 1000)}`,
    level: randomLevel,
    xp: randomXP,
  };
};

// Avatar component for displaying user info
function Avatar({ user }) {
  return (
    <div className="bg-[rgba(145,145,145,0.23)] p-4 rounded-lg flex flex-col items-center lg:min-h-[500px] lg:min-w-[300px] md:min-h-[300px] md:min-w-[300px] m-2">
      <img
        src={user.profile_pic_url}
        alt={`${user.username}'s profile`}
        className="w-16 h-16 lg:w-72 lg:h-72 object-cover rounded-full mb-2"
      />
      <span className="text-lg text-nowrap text-white font-semibold pt-4">
        {user.username}
      </span>
      <div className="flex flex-col border-[2px] border-gray-400 rounded-xl m-9 w-full p-2">
        <p className="text-white font-semibold text-xs justify-start flex m-1">
          Level {user.level}
        </p>
        <div className="flex items-center h-2 w-full rounded-xl bg-white m-1">
          <div
            className="bg-violet-900 h-2 rounded-xl"
            style={{ width: `${(user.xp / 1000) * 100}%` }}
          ></div>
        </div>
        <p className="flex justify-end text-white font-light text-xs mr-4 w-full m-1">
          {user.xp} xp
        </p>
      </div>
    </div>
  );
}

const Page = () => {
  const [gameready, setReady] = useState(false);
  const socketRef = useRef(null);
  const [users, setCompetitors] = useState(defaultCompetitors);
  const [scores, setScores] = useState({ one: 0, two: 0 });
  const { user: currentUser } = useUser();
  const [countdown, setCountdown] = useState(3);
  // Retrieve the 'game' and 'map' query params
  const searchParams = useSearchParams();
  const game = searchParams.get("game");
  const map = searchParams.get("map");
  const isLocalGame = game === "localgame";
  const isRandomMatch = game === "randommatch";
  const isVsBot = game === "vsbot";
  const [isCountDownStarted, setCountDownStarted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [winner, setWinner] = useState(false);
  const [looser, setLooser] = useState(false);
  const router = useRouter();
  const IsConnected = useRef(false);
  const [isSecondPlayerValid, setIsSecondPlayerValid] = useState(false);
  const [displayCelebration, setDisplayCelebration] = useState(false);


  let startCountDown = () => {

    if (timer === null) {
      setCountDownStarted(true);
      setTimer(
        setInterval(() => {
          setCountdown((prev) => {
            if (prev > 0) return prev - 1;
            if (prev == 0) {
              setCountDownStarted(false);
              clearInterval(timer);
              setTimer(null);
            }
            return 0;
          });
        }, 1000)
      );
    }
  };

  // WebSocket connection for random matchmaking
  useEffect(() => {

    if (isRandomMatch && socketRef.current === null) {
      socketRef.current = new WebSocket(
        "ws://localhost:8000/ws/tournament/TWO/"
      );
      socketRef.current.onopen = () => {
        IsConnected.current = true;
        console.log("WebSocket connected");
      };

      socketRef.current.onclose = () => {
        IsConnected.current = false;
        console.log("WebSocket closed");
      };

      socketRef.current.onmessage = (e) => {
        if (!(e.data instanceof Blob)) {
          const data = JSON.parse(e.data);
          if (data.type === "room") {
            if (data.command === "setReady") {
              setReady(true);
            } else if (data.command === "wait") {
              setReady(false);
            }

            // Update competitors from WebSocket data
            if (data.competitors) {
              if (data.competitors.length == 2) {
                setIsSecondPlayerValid(true);
                startCountDown();
              }
              setCompetitors([...data.competitors]);
            }
          }
        }
      };
    }

    return () => {
      if (socketRef.current && IsConnected.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isRandomMatch, IsConnected]);

  // useEffect(() => {
  //   if (winner || looser) {
  //     router.push("/game/solo");
  //     return;
  //   }
  // }, [winner, looser]);

  const updateCompetitors = (competitors) => {
    const nextCompetitors = users.map((c) => {
      if (c.id == competitors.id) {
        console.log("competitors ----->", c.id, competitors.id);
        return competitors;
      } else return c;
    });
  };

  useEffect(() => {
    if (!currentUser) return;
    console.log("isLocalGame", isLocalGame, isVsBot, currentUser);
    if (isLocalGame) {
      setCompetitors([
        currentUser,
        { ...defaultCompetitors[0], username: "Player2" },
      ]);
      if (timer == null)
        startCountDown();
    } else if (isVsBot) {
      setCompetitors([
        currentUser,
        { ...defaultCompetitors[2], username: "Bot", profile_pic_url: "/bot.jpg" },
      ]);
      console.log("local start count");
      if (timer == null)
        startCountDown();
    }
  }, [isLocalGame, isVsBot, currentUser]);

  useEffect(() => {
    startCountDown = () => {
      console.log("startCountDown", timer);
      if (timer == null) {
        setCountDownStarted(true);
        setTimer(
          setInterval(() => {
            setCountdown((prev) => {
              if (prev > 0) return prev - 1;
              if (prev == 0) {
                setCountDownStarted(false);
                clearInterval(timer);
                setTimer(null);
              }
              return 0;
            });
          }, 1000)
        );
      }
    };
    console.log("countdown", countdown);
    return () => {
      if (timer && countdown === 0) {
        clearInterval(timer);
        setTimer(null);
      }
    };
  }, [countdown, timer, gameready]);

  const [randomUser, setRandomUser] = useState(randomizeUser());

  useEffect(() => {
    if (isRandomMatch) {
      const interval = setInterval(() => {
        const newRandomUser = randomizeUser();
        setRandomUser(newRandomUser);
        if (users[1]?.id) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRandomMatch, users]);

  useEffect(() => {
    if (winner || looser) {
    console.log("displayCelebration", winner, looser);

      setDisplayCelebration(true);
    }
  }, [winner, looser]);

  if (!currentUser) {
    return (
      <div>
        <Loader />
      </div>
    );
  }



  if (displayCelebration) {
    return (
      <ConfettiComponent isWinner={winner} />
    );
  }
  
  return (
    <>
      {timer && countdown > 0 && (
        <div className="w-full h-full absolute text-center inset-0 bg-black/20  z-[100] ">
          <h3 className="justify-center items-center w-full h-full flex text-center text-3xl text-white text-nowrap font-extrabold">
            Game Starting in: {countdown}s
          </h3>
        </div>
      )}
      {gameready && isRandomMatch && countdown <= 0 ? (
        <div className="max-w-[1200px] w-full h-fit flex flex-col items-center justify-between p-2">
          <div className="max-w-[1200px] w-full  h-fit border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col mb-24 lg:mb-0">
            <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-start">
                <img
                  src={users[0].profile_pic_url}
                  alt="First Player"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div className="text-white">
                  <div className="text-xs font-bold">{users[0].username}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 m-2">
                <div className="text-xl lg:text-3xl text-white font-bold">
                  {scores.one}
                </div>
                <span className="text-xl lg:text-3xl text-white">:</span>
                <div className="text-xl lg:text-3xl text-white font-bold">
                  {scores.two}
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-end">
                <div className="text-white">
                  <div className="text-xs font-bold text-right">
                    {users[1].username}
                  </div>
                </div>
                <img
                  src={users[1].profile_pic_url}
                  alt="Second User"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
            </div>
            <div
              className=" w-full h-full flex items-center justify-center border-4 object-cover border-white rounded-lg relative"
              style={{
                backgroundImage: `url('/${map}map.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.7,
              }}
            >
              <Canvas
                socketRef={socketRef}
                setWinner={setWinner}
                setLooser={setLooser}
                callback={setReady}
                scoreSetter={setScores}
              ></Canvas>
            </div>
          </div>
        </div>
      ) : isVsBot && countdown <= 0 ? (
        <div className="max-w-[1200px] w-full  h-fit flex flex-col items-center justify-between p-2">
          <div className="max-w-[1200px] w-full h-fit border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col mb-24 lg:mb-0">
            <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-start">
                <div className=" w-12 h-12 lg:w-14 lg:h-14">
                  <img src={users[0].profile_pic_url} alt="player 1 pic" className="rounded-full object-cover w-full h-full p-1" />
                </div>
                <div className="text-white">
                  <div className="text-xs font-bold">{users[0].username}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 m-2">
                <div className="text-xl lg:text-3xl text-white font-bold">
                  {scores.one}
                </div>
                <span className="text-xl lg:text-3xl text-white">:</span>
                <div className="text-xl lg:text-3xl text-white font-bold">
                  {scores.two}
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-end">
                <div className="text-white">
                  <div className="text-xs font-bold text-right">
                    {users[1].username}
                  </div>
                </div>
                <img
                  src={users[1].profile_pic_url}
                  alt="Bot pic"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
            </div>
            <div
              className=" w-full max-h-[800px] flex items-center justify-center border-4 object-cover border-white rounded-lg relative"
              style={{
                backgroundImage: `url('/${map}map.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.7,
              }}
            >
              <Vsbotcanva 
                scoreSetter={setScores} 
                setWinner={setWinner} 
                setLooser={setLooser}
              ></Vsbotcanva>
            </div>
          </div>
        </div>
      ) : isLocalGame && countdown <= 0 ? (
        <div className="max-w-[1200px] w-full h-fit flex flex-col items-center justify-between p-2">
          <div className="max-w-[1200px] w-full h-fit border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col mb-24 lg:mb-0">
            <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-start">
                <div className=" w-12 h-12 lg:w-14 lg:h-14">
                  <img src={users[0].profile_pic_url} alt="player 1 pic" className="rounded-full object-cover w-full h-full p-1" />
                </div>
                <div className="text-white">
                  <div className="text-xs font-bold">{users[0].username}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 m-2">
                <div className="text-xl lg:text-3xl text-white font-bold">
                  {scores.one}
                </div>
                <span className="text-xl lg:text-3xl text-white">:</span>
                <div className="text-xl lg:text-3xl text-white font-bold">
                  {scores.two}
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-end">
                <div className="text-white">
                  <div className="text-xs font-bold text-right">
                    {users[1].username}
                  </div>
                </div>
                <img
                  src={users[1].profile_pic_url}
                  alt="player 2"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
            </div>
            <div
              className="flex-grow w-full h-full flex items-center justify-center border-4 object-cover border-white rounded-lg relative"
              style={{
                backgroundImage: `url('/${map}map.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.7,
              }}
            >
              <Localgamecanva setScores={setScores} setWinner={setWinner} setLooser={setLooser}></Localgamecanva>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-24 items-center justify-center lg:w-fit h-fit">
          {
            isRandomMatch && users[1]?.id ? (
              <li key={`user-${users[0].id}`}>
                <Avatar user={users[0]} />
              </li>
            ) : (
              <Avatar user={currentUser} />
            )
          }

          <div className="flex items-center justify-center">
            <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center">
              <img
                src={VS.src}
                alt="VS"
                className="w-full h-full rounded-full"
              />
            </div>
          </div>

          {isLocalGame && users[1] && <Avatar user={users[1]} />}
          {isVsBot && defaultCompetitors[2] && <Avatar user={defaultCompetitors[2]} />}

          {isRandomMatch && users[1]?.id && (
            <li key={users[1].id}>
              <Avatar user={users[1]} />
            </li>
          )}

          {isRandomMatch && !users[1]?.id && (
            <li key={randomUser.username}>
              <Avatar user={randomUser} />
            </li>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
