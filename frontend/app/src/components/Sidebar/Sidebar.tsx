'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import home from '../../../public/Category.svg';
import game from '../../../public/Game.svg';
import chat from '../../../public/Chat.svg';
import friends from '../../../public/User.svg';
import rank from '../../../public/Activity.svg';

export default function  Sidebar() {
  const [activeIcon, setActiveIcon] = useState<string>('home');

  const handleIconClick = (icon: string) => {
    setActiveIcon(icon);
  };

  const iconClass = (icon: string) =>
    activeIcon === icon ? 'filter brightness-100' : 'filter brightness-50';

  return (
    <div className=" bottom-0 left-0 w-full lg:w-24 h-full lg:justify-center lg:items-center lg:flex  backdrop-blur-md">
      <div className="w-full flex p-4 flex-row space-x-8 lg:space-x-0 lg:space-y-12 items-center justify-center lg:flex-col">
        <Link href="/dashboard" onClick={() => handleIconClick('home')}>
          <Image
            src={home}
            alt="home"
            className={`w-7 h-7 ${iconClass('home')}`}
          />
        </Link>
        <Link href="/game" onClick={() => handleIconClick('game')}>
          <Image
            src={game}
            alt="game"
            className={`w-7 h-7 ${iconClass('game')}`}
          />
        </Link>
        <Link href="/chat" onClick={() => handleIconClick('chat')}>
          <Image
            src={chat}
            alt="chat"
            className={`w-7 h-7 ${iconClass('chat')}`}
          />
        </Link>
        <Link href="/friends" onClick={() => handleIconClick('friends')}>
          <Image
            src={friends}
            alt="friends"
            className={`w-7 h-7 ${iconClass('friends')}`}
          />
        </Link>
        <Link href="/rank" onClick={() => handleIconClick('rank')}>
          <Image
            src={rank}
            alt="rank"
            className={`w-7 h-7 ${iconClass('rank')}`}
          />
        </Link>
      </div>
    </div>
  );
}
