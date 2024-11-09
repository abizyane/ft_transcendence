import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";

const Page = () => {
  return (
    <>
      <div className="hidden lg:block h-full w-full">
        <main className="w-full h-full">
          <div className="flex flex-col  h-full border-l border-gray-800/60 justify-center items-center ">
            <p className="p-4 text-center text-wrap text-xl text-gray-400">
              Click On A Chat <br /> Or Create New One
            </p>

            <div className="mt-2 bg-violet-primary rounded-xl flex  hover:text-gray-700 text-white  px-2 py-2">
              <FiPlusCircle className="w-5 h-5 rounded-full m-1" />
              <button className="hover:text-gray-700">New Chat</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default Page;
