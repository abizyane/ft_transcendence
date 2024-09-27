import Image from "next/image";
import Mars from "../../../../../../../../public/Mars.jpeg";
import VS from "../../../../../../../../public/VS.jpeg";

const users = [
  {
    id: 1,
    name: "Ahmed Allali",
    username: "ahallali",
    score: 6,
  },
  {
    id: 2,
    name: "Ismail Chaiq",
    username: "Ichaiq",
    score: 7,
  },
];

const Page = () => {
  return (
    <div className="min-w-[320px] w-full h-screen flex flex-col items-center justify-between p-2  lg:p-10">
      <div className="w-full max-w-full h-screen border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col">
        <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-4">
          <div className="flex items-center space-x-2 bg-gray-700 p-1  lg:p-3 rounded-full w-36  lg:w-1/3 lg:h-14  justify-center lg:justify-start">
            <Image src={Mars} alt="First User" width={30} height={30} className="rounded-full " />
            <div className="text-white">
              <div className="text-xs font-bold">{users[0].name}</div>
              <div className="text-[10px] text-gray-300">@{users[0].username}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 m-2">
            <div className="text-xl lg:text-3xl text-white font-bold">{users[0].score}</div>
            <span className="text-xl lg:text-3xl text-white">:</span>
            <div className="text-xl lg:text-3xl text-white font-bold">{users[1].score}</div>
          </div>
          <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-end">
            <div className="text-white">
              <div className="text-xs font-bold text-right">{users[1].name}</div>
              <div className="text-[10px] text-gray-300 text-right">@{users[1].username}</div>
            </div>
            <Image src={Mars} alt="Second User" width={30} height={30} className="rounded-full" />
          </div>
        </div>
        <div
          className="flex-grow w-full flex items-center justify-center border-4 border-white rounded-lg relative"
          style={{
            backgroundImage: "url('/Mars.jpeg')", 
            backgroundSize: "cover",
            backgroundPosition: "center",            
            opacity: 0.7,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-25 rounded-lg" />
                    {/* Canvas */}
        </div>
      </div>
      </div>
  );
};

export default Page;
