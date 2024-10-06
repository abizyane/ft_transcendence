import Link from "next/link";



const Page = () => {
  return (
    <>
     <div className="hidden lg:block h-full w-full">
      <main className="w-full h-full">
        <div className="flex flex-col  h-full border-l border-gray-800 justify-center items-center ">
        <p className="p-4 text-center text-wrap text-xl text-gray-400">
    Click On A Chat <br /> Or Create New One
</p>

           <div className="mt-4 top-1/2 transform -translate-y-1/2 bg-black rounded-xl right-4 flex flex-shrink-0 focus:outline-none text-white hover:text-blue-700 px-4 py-1">

            <button>New Chat</button>
            </div>
        </div>
      </main>
    </div></>

  );
};
export default Page;
