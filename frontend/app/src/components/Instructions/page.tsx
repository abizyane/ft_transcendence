import Image from 'next/image';
import { IoIosCloseCircle } from "react-icons/io";

export default function Pong({ setModal }) {
  return (
    <div
      className="fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50"
    >
      <div
        className="w-[340px] h-[540px] bg-gray-900/60 rounded-lg border border-violet-primary p-6  shadow-lg text-white relative"
      >
        <IoIosCloseCircle
          size={24}
          className="text-red-800 cursor-pointer absolute top-4 right-4"
          onClick={() => setModal(false)}
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">Pong Game Rules</h1>
        <p className="text-base sm:text-lg mb-4">
          In the Pong game, each player controls a paddle and attempts to hit a ball back and forth.
        </p>
        <p className="text-base sm:text-lg mb-4">The rules are simple:</p>
        <ul className="list-disc pl-8 text-base sm:text-lg">
          <li>The player who misses the ball loses a point.</li>
          <li>The first player to reach a score of 10 wins the game.</li>
        </ul>

        <p className="text-base sm:text-lg mt-6 font-semibold">Controls:</p>
        <ul className="list-none text-base sm:text-lg mt-2 mb-4">
          <li>
            Player 1: Press <strong className="text-yellow-400">W</strong> to move up, <strong className="text-yellow-400">S</strong> to move down.
          </li>
          <li>
            Player 2: Press <strong className="text-yellow-400">↑</strong> to move up, <strong className="text-yellow-400">↓</strong> to move down.
          </li>
        </ul>
      </div>
    </div>
  );
}
