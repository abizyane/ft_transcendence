import Image from "next/image";
import { Icon } from '@iconify/react';
import home from '@iconify/icons-icon-park-solid/more-app';
import chat from '@iconify/icons-icon-park-solid/wechat';
import game from '@iconify/icons-icon-park-solid/gamepad';
import rank from '@iconify/icons-icon-park-solid/ranking-list';
import friends from '@iconify/icons-icon-park-solid/peoples';
import Link from "next/link";



const WebSidebar = () => {
  return (
    <>
      <div className="max-h-screen">
        <div className="left-0  w-24 border-gray-600 border-r-[1.2px] backdrop-blur-lg flex flex-col space-y-12 min-h-full items-center justify-center">
          <Link href="/dashboard">
            <Icon
              icon={home}
              style={{ fontSize: '28px', color: 'white' }}
              className="w-7 hover:cursor-pointer"
            />
          </Link>
          <Link href="/games">
            <Icon
              icon={game}
              style={{ fontSize: '28px', color: 'gray' }}
              className="w-7 hover:cursor-pointer"
            />
          </Link>
          <Link href="/chat">
            <Icon
              icon={chat}
              style={{ fontSize: '28px', color: 'gray' }}
              className="w-7 hover:cursor-pointer"
            />
          </Link>
          <Link href="/friends">
            <Icon
              icon={friends}
              style={{ fontSize: '28px', color: 'gray' }}
              className="w-7 hover:cursor-pointer"
            />
          </Link>
          <Link href="/rank">
            <Icon
              icon={rank}
              style={{ fontSize: '28px', color: 'gray' }}
              className="w-7 hover:cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default WebSidebar;
