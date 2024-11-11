import React from 'react'

const loader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full text-center ">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-500"></div>
    <h2 className=" text-white mt-4">Loading...</h2>
  
</div>

  )
}

export default loader
