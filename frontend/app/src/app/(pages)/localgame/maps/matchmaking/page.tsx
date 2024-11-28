"use client"
import Mars from "../../../../../public/Mars.jpeg";
import VS from "../../../../../../public/VS.jpeg";
import Link from "next/link";
import Canvas from "@/components/Canva/page";
import { useEffect, useRef, useState } from "react";

const Page = () => {

    return (
    <>
    <h1 className="text-white text-[100px] font-[800]">USE ARROWS</h1>
    <div className=" flex flex-col lg:flex-row gap-4   lg:gap-24 items-center justify-center lg:w-fit h-fit ">
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center">
         <img src={VS.src} alt="vs" className="w-full h-full rounded-full" />
        </div>
      </div>
      <Link href="matchmaking/ponggame" className="bg-blue-500 text-blue-800"> <button>start</button> </Link>
    </div>
  </>);
};

export default Page;

