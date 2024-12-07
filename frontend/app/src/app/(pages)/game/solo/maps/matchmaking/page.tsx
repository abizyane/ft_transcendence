"use client";

import Image from "next/image";
import Mars from "../../../../../../../public/Mars.jpeg";
import { useEffect, useRef, useState } from "react";
import VS from "../../../../../../../public/VS.jpeg";
import Link from "next/link";
import { useUser } from "@/services/context/usercontext";
import { useSearchParams } from "next/navigation";
import Loader from "../../../../../../components/loader/loader";
import Vsbotcanva from "@/components/Localcanva/page";
import Localgamecanva from "@/components/twopcanvas/page";
import Canvas from "@/components/Canva/page";
// Default competitors and user data
const defaultCompetitors = [
  {
    id: 0,
    username: "player2",
    profile_pic_url: "/profile1.jpg",
    level: 1,
    xp: 0,
  },
  {
    id: 1,
    username: "random",
    profile_pic_url: "/profile-bot.jpg",
    level: 1,
    xp: 0,
  },
  {
    id: 2,
    username: "bot",
    profile_pic_url: "/profile-bot.jpg",
    level: 1,
    xp: 0,
  },
];

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
            style={{ width: `${(user.xp / 50000) * 100}%` }}
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
  const [countdown, setCountdown] = useState(5);
  // Retrieve the 'game' and 'map' query params
  const searchParams = useSearchParams();
  const game = searchParams.get("game");
  const map = searchParams.get("map");
  let indexUser = 0;
  const isLocalGame = game === "localgame";
  const isRandomMatch = game === "randommatch";
  const isVsBot = game === "vsbot";
  const  [isCountDownStarted , setCountDownStarted] = useState(false);
  const  [timer , setTimer] = useState(null);

  let startCountDown = ()=>{

    if (timer === null)
    {
      setCountDownStarted(true);
      setTimer(setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000));
    }
    
  };

  // WebSocket connection for random matchmaking
  useEffect(() => {
    if (isRandomMatch) {
      socketRef.current = new WebSocket(
        "ws://localhost:8000/ws/tournament/TWO/"
      );
      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket closed");
      };

      socketRef.current.onmessage = (e) => {
        if (e.data instanceof Blob) {
        } else {
          const data = JSON.parse(e.data);
          if (data.type === "room") {
            if (data.command === "setReady") {
              setReady(true);
            } else if (data.command === "wait") {
              setReady(false);
            }

            // Update competitors from WebSocket data
            if (data.competitors) {
              if (data.competitors.length > 1) {
                setCompetitors([
                  ...data.competitors,
                  { ...defaultCompetitors[0] },
                ]);
              console.log("stared countdozw")
              startCountDown();

              } else {
                setCompetitors(data.competitors);
              }
            }
          }
        }
      };

      return () => {
        socketRef.current.close();
      };
    }
  }, [isRandomMatch]);

  // Get the current user from context
  const updateCompetitors = (competitors) => {
    const nextCompetitors = users.map((c) => {
      if (c.id == competitors.id) {
        console.log(c.id, competitors.id);
        return competitors;
      } else return c;
    });
    // indexUser++
    console.log(nextCompetitors);
    // setCompetitors(competitors)
  };

  useEffect(() => {
    if (!currentUser)
      return;
    // console.log(isLocalGame, isRandomMatch, currentUser);
    if (isLocalGame) {
      setCompetitors([
        currentUser,
        { ...defaultCompetitors[0], username: "Player2" },
      ]);
      startCountDown();
    } else if (isRandomMatch) {

    } else {
      setCompetitors([
        currentUser,
        { ...defaultCompetitors[2], username: "Bot" },
      ]);
      console.log("local start count")
      startCountDown();
    }
  }, [isLocalGame, isRandomMatch, currentUser]);

  useEffect(() => {
    startCountDown = ()=>{

      if (timer == null)
      {
        setCountDownStarted(true);
        setTimer(setInterval(() => {
           setCountdown((prev) => {
            if (prev > 0)
              return prev - 1
            return 0
           });
        }, 1000));
      }
      
    };
    // if (countdown === 0) {
    //   setReady(true);
    //   if (timer)
    //   {
    //     clearInterval(timer)
    //     setTimer(null);
    //   }
    // }
    console.log("countdown", countdown);
    return () => {
      if (timer && countdown === 0)
      {
        setReady(true);
        clearInterval(timer)
        setTimer(null);
      }
    }
  }, [gameready, countdown,timer]);

  if (!currentUser) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <>
    {timer  && (
      <div className="w-full h-full absolute text-center inset-0 bg-black/20 backdrop-blur-md  z-[100] ">
        <h3 className="justify-center items-center w-full h-full flex text-center text-3xl text-white text-nowrap font-extrabold">Game Starting in: {countdown}s</h3>
      </div>)}
      {gameready && isRandomMatch && countdown <= 0 ? (
        <div className="max-w-[1200px] w-full h-fit flex flex-col items-center justify-between p-2">
          <div className="max-w-[1200px] w-full  h-fit border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col mb-24 lg:mb-0">
            <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-start">
                <Image
                  src={Mars}
                  alt="First User"
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
                <Image
                  src={Mars}
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
                backgroundImage: `url('/${map}.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.7,
              }}
            >
                <Canvas socketRef={socketRef} callback={setReady} scoreSetter={setScores}></Canvas>
            </div>
          </div>
        </div>
      ) : isVsBot && countdown <= 0 ? (
        <div className="max-w-[1200px] w-full  h-fit flex flex-col items-center justify-between p-2">
          <div className="max-w-[1200px] w-full h-fit border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col mb-24 lg:mb-0">
            <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-start">
                <Image
                  src={Mars}
                  alt="First User"
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
                <Image
                  src={Mars}
                  alt="Second User"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
            </div>
            <div
              className=" w-full max-h-[800px] flex items-center justify-center border-4 object-cover border-white rounded-lg relative"
              style={{
                backgroundImage: `url('/${map}.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.7,
              }}
            >
              <Vsbotcanva scoreSetter={setScores}></Vsbotcanva>
            </div>
          </div>
        </div>
      ) : isLocalGame && countdown <= 0 ? (
        <div className="max-w-[1200px] w-full h-fit flex flex-col items-center justify-between p-2">
          <div className="max-w-[1200px] w-full h-fit border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col mb-24 lg:mb-0">
            <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-start">
                <Image
                  src={Mars}
                  alt="First User"
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
                <Image
                  src={Mars}
                  alt="Second User"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
            </div>
            <div
              className="flex-grow w-full h-full flex items-center justify-center border-4 object-cover border-white rounded-lg relative"
              style={{
                backgroundImage: `url('/${map}.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.7,
              }}
            >
              <Localgamecanva setScores={setScores}></Localgamecanva>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-24 items-center justify-center lg:w-fit h-fit">
          {isRandomMatch && users[0] ? (
            <li key={users[0].id}>
              <Avatar user={users[0]}></Avatar>
            </li>
          ) : (
            <Avatar user={currentUser} />
          )}
          <div className="flex items-center justify-end">
            <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center">
              <img
                src={VS.src}
                alt="VS"
                className="w-full h-full rounded-full"
              />
            </div>
          </div>

          {isLocalGame && <Avatar user={users[1]} />}
          {isVsBot && <Avatar user={defaultCompetitors[2]} />}
          {isRandomMatch && users[1] && (
            <li key={users[1].id}>
              <Avatar user={users[1]}></Avatar>
            </li>
          )}
        </div>
      )}
    </>

  );
};

export default Page;
