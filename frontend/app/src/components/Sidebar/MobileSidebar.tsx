import home from "../../../public/Category.svg";
import game from "../../../public/Game.svg";
import chat from "../../../public/Chat.svg";
import friends from "../../../public/User.svg";
import rank from "../../../public/Activity.svg";
import Image from "next/image";





const MobileSidebar = () => {
  return (
    <>
      <div className="bottom-0 w-full absolute border-gray-600 border-t-[1.2px] h-20  backdrop-blur-lg">
        <div className="flex p-4 flex-row space-x-12 items-center justify-center flex-1">
          <Image
            src={home}
            alt="home"
            className="w-7 h-7"
          />
          <Image
            src={game}
            alt="game"
            className="w-7 h-7"
          />
          <Image
            src={chat}
            alt="chat"
            className="w-7 h-7"
          />
          <Image
            src={friends}
            alt="friends"
            className="w-7 h-7"
          />
          <Image
            src={rank}
            alt="rank"
            className="w-7 h-7"
          />
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
