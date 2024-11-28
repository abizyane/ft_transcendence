"use client"
import Image from "next/image";
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
    id: 0,
    name: "",
    username: "",
    profilePic:"../../../../../Profil.jpg",
    score: 0,
    level: 0,
    xp:0
  },
  {
    id: 1,
    name: "",
    username: "",
    profilePic:"../../../../../Profil.jpg",
    score: 0,
    level:0,
    xp:0
  },
]

const defaultUser ={
    id: 2,
    name: "",
    username: "",
    profilePic:"",
    score: 0,
    level:0,
    xp:0
  }

function Avatar({user}){
  return(
  <div className="bg-[rgba(145,145,145,0.23)] p-4 rounded-lg flex flex-col items-center lg:min-h-[500px] lg:min-w-[300px]  md:min-h-[300px] md:min-w-[300px] m-2">
        <img
          src={user.profilePic}
          alt={`${user.name}'s profile`}
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
  </div>)
}


const Page = () => {
  const [gameready, setReady] = useState(false)
  const socketRef = useRef(null)
  const [users, setCompetitors] = useState(defaultCompetitors)
  let indexId = 0

  const updateCompetitors = (competitors) => {
    
    // const nextCompetitors = users.map((c) =>{
    //   if (c.id == competitor.id){
    //     console.log(c.id, competitor.id)
    //     return competitor
    //   }
    //   else
    //     return c
    // })
    // console.log(nextCompetitors)
    setCompetitors(competitors)
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
        console.log("yo",data)
        if (data.type == 'room'){
          if (data.command == "setReady")
            setReady(true)
          else if (data.command == "wait")
            setReady(false)
          if (data.competitors){
            updateCompetitors(data.competitors)
            indexId++
          }
        }
      }
    }
  }, [socketRef])

  return (
    <>
    {
    gameready ?<div className="min-w-[320px] w-full h-full flex flex-col items-center justify-between p-2  ">
    <div className="w-full max-w-full h-full border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col mb-24 lg:mb-0">
      <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-2">
        <div className="flex items-center space-x-2 bg-gray-700 p-1  lg:p-3 rounded-full w-36  lg:w-1/3 lg:h-14  justify-center lg:justify-start">
          <Image src={Mars} alt="First User" width={30} height={30} className="rounded-full " />
          <div className="text-white">
            <div className="text-xs font-bold">{users[0].name}</div>
            <div className="text-[10px] text-gray-300">@{users[0].username}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 m-2">
          <div className="text-xl lg:text-3xl text-white font-bold">{users[0].score}</div>
          <span className="text-xl lg:text-3xl text-white">:</span>
          <div className="text-xl lg:text-3xl text-white font-bold">{users[1].score}</div>
        </div>
        <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-end">
          <div className="text-white">
            <div className="text-xs font-bold text-right">{users[1].name}</div>
            <div className="text-[10px] text-gray-300 text-right">@{users[1].username}</div>
          </div>
          <Image src={Mars} alt="Second User" width={30} height={30} className="rounded-full" />
        </div>
      </div>
      <div
        className="flex-grow w-full h-full flex items-center justify-center border-4 bg-fixed border-white rounded-lg relative"
        style={{
          backgroundImage: "url('/Mars.jpeg')", 
          backgroundSize: "cover",
          backgroundPosition: "center",            
          opacity: 0.7,
        }}
      >
        <Canvas socketRef={socketRef} callback={setReady}></Canvas>
      </div>
    </div>
    </div> :
    <div className=" flex flex-col lg:flex-row gap-4   lg:gap-24 items-center justify-center lg:w-fit h-fit ">
      <Avatar user={users[0]} />
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center">
         <img src={VS.src} alt="vs" className="w-full h-full rounded-full" />
        </div>
      </div>
      {users[1] ? <Avatar user={users[1]} /> : <></>}
      <Link href="matchmaking/ponggame" className="bg-blue-500 text-blue-800"> <button>start</button> </Link>
    </div>
  }
  </>);
};

export default Page;

