"use client"
import Mars from "../../../../../../../public/Mars.jpeg";
import VS from "../../../../../../../public/VS.jpeg";
import Link from "next/link";
import Canvas from "@/components/Canva/page";
import { useEffect, useRef, useState } from "react";
// Sample users data
// const users = [
//   {
//     id: 1,
//     name: "Ismail Chaiq",
//     profilePic: "../../../../../Profil.jpg",
//     level: 2,
//     xp: 20000,
//   },
//   {
//     id: 2,
//     name: "Achraf Bizyane",
//     profilePic: "../../../../../Profil.jpg",
//     level: 1,
//     xp: 10000,
//   },
// ];

const defaultCompetitors = [
  {
    id: 1,
    name: "",
    username: "",
    profilePic:"",
    score: 0,
    level: 0,
    xp:0
  },
  {
    id: 2,
    name: "",
    username: "",
    profilePic:"",
    score: 0,
    level:0,
    xp:0
  },
]
function Avatar({user}){
  <div className="bg-[rgba(145,145,145,0.23)] p-4 rounded-lg flex flex-col items-center lg:min-h-[500px] lg:min-w-[300px]  md:min-h-[300px] md:min-w-[300px] m-2">
        <img
          src={user.profilePic}
          alt={`${user.name}'s profile`}
          className="w-16 h-16 lg:w-72 lg:h-72 object-cover rounded-full mb-2"
        />
        <span className="text-lg text-nowrap text-white font-semibold pt-4">
          {user.name}
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
}


const Page = () => {
  const [gameready, setReady] = useState(false)
  const socketRef = useRef(null)
  const [users, setCompetitors] = useState(defaultCompetitors)

  const updateCompetitors = (competitor) => {
    const nextCompetitors = users.map(c => {
      if (c.id == competitor.id)
        return competitor
      else
        return c
    })
    setCompetitors(nextCompetitors)
  }

  useEffect(()=>{
    socketRef.current = new WebSocket("ws://localhost:8000/ws/tournament/TWO/")
    socketRef.current.onopen = () =>{
      console.log("ws connected")
    }

    socketRef.current.onclose = (e) =>{
      console.log("ws closed")
    }

    return (()=>{
      socketRef.current.close()
    })
  }, [])

  useEffect(() =>{
    socketRef.current.onmessage = (e) => {
      if (e.data instanceof Blob){
      }else{
        const data = JSON.parse(e.data)
        if (data.type == 'room'){
          if (data.command == "setReady")
            setReady(true)
          else if (data.command == "wait")
            setReady(false)
        }
      }
    }
  }, [socketRef])

  return (
    <>
    {
    gameready ? <Canvas socketRef={socketRef} callback={setReady}/> :
    <div className=" flex flex-col lg:flex-row gap-4   lg:gap-24 items-center justify-center lg:w-fit h-fit ">
      <Avatar user={users[0]} />
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center">
         <img src={VS.src} alt="vs" className="w-full h-full rounded-full" />
        </div>
      </div>
      <Avatar user={users[1]} />
      <Link href="matchmaking/ponggame" className="bg-blue-500 text-blue-800"> <button>start</button> </Link>
    </div>
  }
  </>);
};

export default Page;

