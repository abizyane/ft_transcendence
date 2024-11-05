import React from "react";
import solo from "../../../public/solo.jpeg";

const friends = () => {
  return (
    <div className=" max-w-7xl  h-[1200px] overflow-y-auto p-6 mb-24 lg:mb-0">
      <h1 className="text-white text-center w-full text-4xl font-bold mb-6">Friends List</h1>
      <div className="bg-gray-800/65 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-700/70 hover:bg-gray-600 transition-shadow border border-gray-600 rounded-lg p-4 shadow-lg hover:shadow-2xl"
          >
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img
                src={solo.src}
                alt="mode solo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <span className="text-lg font-semibold text-white">Name</span>
              <span className="text-sm text-gray-400">@username</span>
            </div>
            <div className="ml-auto flex space-x-4">
              <button aria-label="Chat" className="hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8m5 9v-2h-2v2zm-4 0v-2h-2v2zm-4 0v-2H7v2z" />
                </svg>
              </button>
              <button aria-label="Settings" className="hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M416 288c-50.1 0-93.6 28.8-114.6 70.8L68.9 126.3l.6-.6l60.1-60.1c87.5-87.5 229.3-87.5 316.8 0c67.1 67.1 82.7 166.3 46.8 248.3C471.8 297.6 445 288 416 288M49.3 151.9l240.8 240.8c-1.4 7.5-2.1 15.3-2.1 23.3c0 23.2 6.2 44.9 16.9 63.7c-3 .2-6.1.3-9.2.3H293c-33.9 0-66.5-13.5-90.5-37.5l-9.8-9.8c-13.1-13.1-34.6-12.4-46.8 1.7L88.2 501c-5.8 6.7-14.2 10.7-23 11s-17.5-3.1-23.8-9.4l-32-32c-6.3-6.3-9.7-14.9-9.4-23.7s4.3-17.2 11-23l66.6-57.7c14-12.2 14.8-33.7 1.7-46.8l-9.8-9.8C45.5 285.5 32 252.9 32 219v-2.7c0-22.8 6.1-44.9 17.3-64.3zM416 320a96 96 0 1 1 0 192a96 96 0 1 1 0-192" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default friends;
