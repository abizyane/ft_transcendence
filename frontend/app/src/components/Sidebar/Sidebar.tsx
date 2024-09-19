import home from "../../../public/Category.svg";
import game from "../../../public/Game.svg";
import chat from "../../../public/Chat.svg";
import friends from "../../../public/User.svg";
import rank from "../../../public/Activity.svg";
import Image from "next/image";





const Sidebar = () => {
  return (
    <>
<div className="fixed bottom-0 left-0 w-full lg:w-24 lg:h-full  border-gray-800 bg-gray-800 border-t-[1.2px] lg:border-t-0 lg:border-r-[1.2px] backdrop-blur-lg">
  <div className="w-full lg:min-h-full flex p-4 flex-row space-x-8 lg:space-x-0 lg:space-y-12 items-center justify-center lg:flex-col">
    <Image src={home} alt="home" className="w-7 h-7 lg:mt-20" />
    <Image src={game} alt="game" className="w-7 h-7" />
    <Image src={chat} alt="chat" className="w-7 h-7" />
    <Image src={friends} alt="friends" className="w-7 h-7" />
    <Image src={rank} alt="rank" className="w-7 h-7" />
  </div>
</div>



    </>
  );
};

export default Sidebar;
