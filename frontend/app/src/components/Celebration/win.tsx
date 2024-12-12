'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';


function ConfettiComponent({ isWinner }: { isWinner: boolean }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col justify-center items-center">
      {isWinner ? (
        <>
          <ReactConfetti />
          <div className="text-center text-yellow-500 font-bold text-9xl mb-6">
            You Win!
          </div>
          <img src="/celebrate-cheers.gif" alt="celebration" />
          <Link href="/dashboard">
            <button className="hover:bg-red-700 text-fluid border border-white mt-20 h-12 w-36 text-center rounded-full text-2xl font-bold text-white">
              Quit
            </button>
          </Link>
        </>
      ) : (
        <>
          <div className="text-center text-red-500 font-bold text-9xl mb-6">
            You Lose!
          </div>
          <img src="/spinning-poop.gif" alt="loser" className='w-48 h-48' />
          <Link href="/dashboard">
            <button className="hover:bg-red-700 border text-nowrap border-white mt-20 h-12 w-36 text-center rounded-full text-xl font-bold text-white">
              Quit
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default ConfettiComponent;
