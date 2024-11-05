import React from 'react'

const loader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen  text-center ">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-500"></div>
    <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
    <p className="text-zinc-600 dark:text-zinc-400">
        Your adventure is about to begin
    </p>
</div>

  )
}

export default loader
