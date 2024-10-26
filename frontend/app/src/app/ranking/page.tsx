// import React from 'react'
import Profil from "../../../public/Profil.jpg"
const page = () => {
  return (
      // <div className="w-full min-h-1 rounded-xl  mb-24 lg:mb-0 ">
//     <div className="p-4 w-full h-full rounded-lg bg-gray-800/60 overflow-y-scroll ">
//         <div className="flex w-full  text-center p-2rounded-t-lg">
//             <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Position</div>
//             <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Image</div>
//             <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Username</div>
//             <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">ID</div>
//             <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Level</div>
//         </div>
//         {Array.from({ length: 24 }).map((_, index) => (
//             <div
//                 key={index}
//                 className={`flex w-full mb-1 text-center `}
//             >
//                 <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center text-white">{index + 1}</div>
//                 <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center">
//                     <img
//                         src={`https://i.pravatar.cc/150?img=${index + 1}`}
//                         alt="User Avatar"
//                         className="w-10 h-10 rounded-full"
//                     />
//                 </div>
//                 <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center text-white">User{index + 1}</div>
//                 <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center text-white">{(index + 1) * 10}</div>
//                 <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center text-white">{(index + 1) * 2}</div>
//             </div>
//         ))}
//     </div>
<div className=" w-full h-full">
    <div className=" w-full h-1/2 flex ">
        <div className="w-1/3 h-full">
            <div className="w-full h-full justify-center items-center flex">
            <div className="border-2 p-10 flex flex-col rounded-xl bg-gray-800/60 justify-center items-center w-fit h-fit">
                <img src={Profil.src} alt="player3 Profil" className="h-48 w-48 border-2 rounded-full"/>
                <span className="font-bold text-4xl text-white">Name</span>    
            <div className="w-full flex text-center h-24 font-bold gap-14 text-white text-2xl items-center">
                <span className="w-1/3 justify-start text-nowrap">Score 8250</span>
                <span className="w-1/3 justify-center" >@username </span>
                <span className="w-1/3 justify-end">rank #2 </span>
            </div>
            </div>
            </div>
        </div>    
        <div className=" w-1/3 h-full">
        <div className="w-full h-full justify-center items-center flex">
            <div className="border-2 p-10 flex flex-col rounded-xl bg-gray-800/60 justify-center items-center w-fit h-fit">
                <img src={Profil.src} alt="player3 Profil" className="h-48 w-48 border-2 rounded-full"/>
                <span className="font-bold text-4xl text-white">Name</span>    
            <div className="w-full flex text-center h-24 font-bold gap-14 text-white text-2xl items-center">
                <span className="w-1/3 justify-start text-nowrap">Score 8800</span>
                <span className="w-1/3 justify-center" >@username </span>
                <span className="w-1/3 justify-end">rank #1 </span>
            </div>
            </div>
            </div>
        </div>    
        <div className=" w-1/3 h-full">
        <div className="w-full h-full justify-center items-center flex">
            <div className="border-2 p-10 flex flex-col rounded-xl bg-gray-800/60 justify-center items-center w-fit h-fit">
                <img src={Profil.src} alt="player3 Profil" className="h-48 w-48 border-2 rounded-full"/>
                <span className="font-bold text-4xl text-white">Name</span>    
            <div className="w-full flex text-center h-24 font-bold gap-14 text-white text-2xl items-center">
                <span className="w-1/3 justify-start text-nowrap">Score 7600</span>
                <span className="w-1/3 justify-center" >@username </span>
                <span className="w-1/3 justify-end">rank #3 </span>
            </div>
            </div>
            </div>
        </div>    
    </div>
    <div className="bg-green-500 w-full h-1/2">
    <div className="p-4 w-full h-full rounded-lg bg-gray-800/60 overflow-y-scroll ">
        <div className="flex w-full  text-center p-2 rounded-t-lg">
            <div className="w-1/5 h-14 bg-red-600  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold"></div>
            <div className="w-1/5 h-14 bg-red-600  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Rank</div>
            <div className="w-1/5 h-14 bg-red-600  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Name</div>
            <div className="w-1/5 h-14 bg-red-600  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Username</div>
            <div className="w-1/5 h-14 bg-red-600  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">totalGames</div>
            <div className="w-1/5 h-14 bg-red-600  border-gray-500 f   lex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Score</div>
    </div>
    </div>
    </div>
</div>

  )
}

export default page