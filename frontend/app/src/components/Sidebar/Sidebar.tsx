import home from "../../../public/Category.svg";
import game from "../../../public/Game.svg";
import chat from "../../../public/Chat.svg";
import friends from "../../../public/User.svg";
import rank from "../../../public/Activity.svg";
import Image from "next/image";





const Sidebar = () => {
  return (
    <>
      <div className="bottom-0 md:left-0 h-20  md:min-h-full w-full md:w-24 absolute border-gray-600 border-t-[1.2px] md:border-t-0 md:border-r-[1.2px] backdrop-blur-lg ">
        <div className="flex p-4 flex-row space-x-8 md:space-x-0 md:space-y-12 items-center justify-center  md:flex-col md:min-h-full">
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

export default Sidebar;
