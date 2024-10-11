import React from 'react'

const page = () => {
  return (
<div className="w-full min-h-1 bg-custom-gradient border-2 rounded-xl border-violet-primary mb-24 lg:mb-0 ">
    <div className="p-4 w-full h-full bg-custom-gradient rounded-lg backdrop-blur-3xl border-violet-primary border-2 overflow-y-scroll ">
        <div className="flex w-full  text-center p-2rounded-t-lg">
            <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Position</div>
            <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Image</div>
            <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Username</div>
            <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">ID</div>
            <div className="w-1/5 h-14  border-gray-500 flex items-center justify-center text-white text-xs md:text-base lg:text-xl md:font-bold">Level</div>
        </div>
        {Array.from({ length: 24 }).map((_, index) => (
            <div
                key={index}
                className={`flex w-full mb-1 text-center `}
            >
                <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center text-white">{index + 1}</div>
                <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center">
                    <img
                        src={`https://i.pravatar.cc/150?img=${index + 1}`}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                </div>
                <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center text-white">User{index + 1}</div>
                <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center text-white">{(index + 1) * 10}</div>
                <div className="w-1/5 h-14 border-gray-500 flex items-center justify-center text-white">{(index + 1) * 2}</div>
            </div>
        ))}
    </div>
</div>

  )
}

export default page