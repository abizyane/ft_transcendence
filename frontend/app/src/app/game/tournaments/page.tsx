// import solo from "../../../../public/solo.jpeg";
// import multiplayers from "../../../../public/multiplayers.jpeg";
"use client"
"use strict"
import Link from "next/link";
import Canvas from "@/components/Canva/page";
import Lobby from "@/components/Lobby/page";
import { useEffect, useReducer, useState, useRef } from "react";

const Page = () => {
  const ws = useRef(null)
  const [ready, setReady] = useState(false)
  const [competitors, setCompetitors] = useState({})

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/tournament/FOUR/")
    ws.current.onopen = () =>{
      console.log("ws Connected")
    }
    ws.current.onclose = () => {
      console.log("ws closed")
    }

    ws.current.onmessage = (e) => {
      const jsondata = JSON.parse(e.data)
      if (jsondata.type == "room"){
        if (jsondata.command == "setReady"){
          setReady(true)
          console.log("READY")
        }
        else if (jsondata.command == "setCompetitors")
        {
          setCompetitors(jsondata.competitors)
        }
        else if (jsondata.command == "wait")
          setReady(false)
      }
      else if (e.type == "update"){

      }

    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])
  return (
    <>
      <div className=" bg-gray-800 bg-opacity-60 lg:p-10 rounded-xl flex flex-col gap-4 border-[1px] border-violet-primary lg:w-full  md:gap-6  mb-10 w-full md:min-w-[400px] md:max-w-[900px] md:min-h-[700px] md:max-h-[800px]  lg:min-w-[700px] lg:max-w-[1200px] lg:min-h-[900px] lg:max-h-[1200px]justify-center items-center md:flex-row">
        <>{ready ? <Canvas socketRef={ws} callback={setReady} /> : <Lobby players={competitors}/>}</>
      </div>
    </>
  );
};

export default Page;