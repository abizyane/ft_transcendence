import Image from 'next/image';

export default function Pong() {
  return (
    <div className="h-auto flex flex-col items-center z-50 text-white py-6 px-4">
      <div className="max-w-4xl w-[350px] bg-gray-900/60 rounded-lg border border-violet-primary p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-4">Pong Game Rules</h1>
        <p className="text-lg mb-4">In the Pong game, each player controls a paddle and attempts to hit a ball back and forth.</p>
        <p className="text-lg mb-4">The rules are simple:</p>
        <ul className="list-disc pl-8 text-lg">
          <li>The player who misses the ball loses a point.</li>
          <li>The first player to reach a score of 10 wins the game.</li>
        </ul>

        <p className="text-lg mt-6 font-semibold">Controls:</p>
        <ul className="list-none text-lg mt-2 mb-4">
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
