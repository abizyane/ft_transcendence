import Link from "next/link";



const Page = () => {
  return (
    <>
     <div className="hidden lg:block h-full w-full">
      <main className="w-full h-full">
        <div className="flex flex-col  h-full border-l border-gray-800/60 justify-center items-center ">
        <p className="p-4 text-center text-wrap text-xl text-gray-400">
    Click On A Chat <br /> Or Create New One
</p>

           <div className="mt-4 top-1/2 transform -translate-y-1/2 bg-violet-primary rounded-xl right-4 flex flex-shrink-0 focus:outline-none text-white hover:text-blue-700 px-2 py-1">

            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32">
            <path fill="#ffffff" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z" />
          </svg>
            <button>
              New Chat
              </button>
            </div>
        </div>
      </main>
    </div></>

  );
};
export default Page;
