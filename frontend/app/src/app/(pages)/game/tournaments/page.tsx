'use client'; 
import Profil from "../../../../../public/Profil.jpg";
import { useState } from 'react';

const Page = () => {
  const [confirmation, setConfirmation] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentImage, setTournamentImage] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [availableTournaments, setAvailableTournaments] = useState([
    { name: 'Tournament 1', img: '/tournament1.jpg' },
    { name: 'Tournament 2', img: '/tournament2.jpg' },
  ]);

  const handleCreateTournament = (e) => {
    e.preventDefault();
    console.log('Creating Tournament:', tournamentName, isPrivate);
  };

  const handleJoinTournament = (tournament) => {
    console.log('Joining Tournament:', tournament);
  };

  return (
    <div className="flex flex-col justify-start items-center px-4 w-full h-full py-8">
      {!confirmation ? (
        <div className=" bg-gray-700/50 shadow-lg border border-violet-primary max-w-md p-6 rounded-lg mb-8">
          <h1 className="text-xl text-white font-semibold text-center">Enter Your Alias</h1>
          <input
            type="text"
            placeholder="Enter name"
            className="w-full mt-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
            required
          />
          <button
            className="mt-4 w-full bg-gray-400 py-2 rounded-md"
            onClick={() => setConfirmation(true)}
          >
            Confirm
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="max-w-md lg:max-w-7xl p-4 rounded-lg shadow-lg mt-8">
            <div className="w-full lg:flex lg:gap-8">
              <div className={`bg-gray-700/50 shadow-lg border border-violet-primary rounded-lg p-6 max-w-xs lg:min-w-[350px] h-fit lg:min-h-[500px] flex flex-col  space-y-6 ${!confirmation && 'opacity-50 pointer-events-none'}`}>
                <h2 className="text-lg text-white text-center font-semibold mb-4">Create Tournament</h2>
                <form onSubmit={handleCreateTournament} className="flex flex-col space-y-6 h-full">
                  <input
                    type="text"
                    placeholder="Tournament Name"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="w-full p-3 border rounded-md bg-gray-500/40 text-white"
                  />
                  <input
                    type="file"
                    onChange={(e) => setTournamentImage(URL.createObjectURL(e.target.files[0]))}
                    className="w-full p-3 border rounded-md bg-gray-500/40 lg:mb-48"
                  />
                  <div className="flex items-center space-x-2 lg:mt-64 ">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(!isPrivate)}
                      className="h-4 w-4"
                    />
                    <label className="text-white">Private Tournament</label>
                  </div>
                  <div className='flex-1 flex justify-center items-center'>

                  <button
                    type="submit"
                    className="w-full bg-green-500 py-2 rounded-md"
                    >
                    Create Tournament
                  </button>
                    </div>
                </form>
              </div>


              <div className={`bg-gray-700/50 shadow-lg rounded-lg p-6 max-w-xs border border-violet-primary lg:min-w-[350px] min-h-[500px] mt-6 lg:mt-0 ${!confirmation && 'opacity-50 pointer-events-none'}`}>
                <h2 className="text-lg text-center text-white font-semibold mb-4">Join Tournament</h2>
                <div className="flex flex-col gap-2 lg:gap-6">
                  {availableTournaments.map((tournament, index) => (
                    <div
                      key={index}
                      className="flex items-center max-w-lg space-x-2 p-2 gap-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleJoinTournament(tournament)}
                    >
                      <img
                        src={Profil.src}
                        alt={tournament.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <span className="font-medium text-white">{tournament.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
