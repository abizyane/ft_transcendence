'use client';

import Profil from "../../../../../public/Profil.jpg";
import Line from "../../../../../public/tournamentline.svg";
import Line1 from "../../../../../public/tournementline2.svg";
import Trophy from "../../../../../public/Trophy.png";
import { useState, useEffect, useRef } from 'react';

const Page = () => {
  const [confirmation, setConfirmation] = useState(false);
  const [alias, setAlias] = useState('');
  const [roomName, setTournamentName] = useState('');
  const [tournamentImage, setTournamentImage] = useState(null);
  const WebSocketRef = useRef(null)
  const [availableTournaments, setAvailableTournaments] = useState([
    { name: 'Tournament 1', img: '/tournament1.jpg' },
    { name: 'Tournament 2', img: '/tournament2.jpg' },
    { name: 'Tournament 3', img: '/tournament2.jpg' },
    { name: 'Tournament 4', img: '/tournament2.jpg' },
    { name: 'Tournament 5', img: '/tournament2.jpg' },
    { name: 'Tournament 6', img: '/tournament2.jpg' },
    { name: 'Tournament 7', img: '/tournament2.jpg' },
    { name: 'Tournament 8', img: '/tournament2.jpg' },
  ]);
  const [tournamentMap, setTournamentMap] = useState(false);

  //---------Tournament Map vars Start---------
  const defaultUser = {
    username: 'player',
    img: '',
    id: 0
  }
  const defaultUsers = (() => {
    let users = [];
    for (let i = 0; i < 4; i++)
      users[i] = {...defaultUser, id:i, username:"player"+i.toString()}
    return users  
  })()

  const [players, setPlayers] = useState(defaultUsers)

  const handleRoomUpdate = (users)=> {
    const nextUserList = defaultUsers.map(user => 
        users.find( (u) => (u.id === user.id) ? u : user))
    setPlayers(nextUserList)
  }

  //---------Tournament Map var END--------- 

  const defaObj = {
    name: 'Tournament', img: '/tournament1.jpg', size: 0 
  }

  const handleTournamentList = (tournaments) => {
    const rooms = tournaments.room.map((room) => ({
      ...room,
      img: '/tournament1.jpg',
    }))
    console.log(rooms)
    setAvailableTournaments((prevlst) => [defaObj, ...rooms]);
  }

  useEffect(() => {
    let isConnected = false
    if (!WebSocketRef.current)
      WebSocketRef.current = new WebSocket('ws://localhost:8000/ws/tournament/FOUR/');
    
    WebSocketRef.current.onopen = () => {
      isConnected = true
      console.log('WebSocket connection established');
    };

    WebSocketRef.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      const received_data = JSON.parse(event.data);

      if (received_data.type == "tournament_state")
        handleTournamentList(received_data);
      if (received_data.approving)
        setTournamentMap(received_data.approving)
      if (received_data.type == "alias"){
        if(received_data.accepted){
          setConfirmation(true)
        }else{
          console.error(received_data.ErrorMsg)
        }
      }
      if (received_data.type === "room"){
        if (received_data.command === "setCompetitors"){
          handleRoomUpdate(received_data.competitors)
        }
      }

    };

    WebSocketRef.current.onerror = (error) => {
      isConnected = false
      console.error('WebSocket error:', error);
    };

    WebSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      // Cleanup the WebSocket connection when component unmounts
      if (isConnected) {
        WebSocketRef.current.close();
      }
    };
  }, []);


  const handleCreateTournament = (event) => {
    event.preventDefault();
    // if (!alias || !roomName) {
    //   alert("Please fill in all fields.");
    //   return;
    // }

    const command = 'create';
    // Prepare the data to send
    const roomData = {
      command,
      alias,
      roomName,
    // You can send a URL or base64 image here
    };

    if (WebSocketRef.current && WebSocketRef.current.readyState === WebSocket.OPEN) {
      WebSocketRef.current.send(JSON.stringify(roomData));
      console.log('Data sent:', roomData);
    } else {
      console.error('WebSocket is not connected');
    }
  };


  const handleJoinTournament = (tournament) => {
    tournament.command = "join";
    console.log('Joining Tournament:', tournament);
    if (WebSocketRef.current && WebSocketRef.current.readyState === WebSocket.OPEN) {
      WebSocketRef.current.send(JSON.stringify(tournament));
      setTournamentName(tournament.name)
      console.log('Data sent:', tournament);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const handleAlias = () => {
    const command = 'setAlias';
    const data = {
      command,
      alias
    }

    if (WebSocketRef.current && WebSocketRef.current.readyState === WebSocket.OPEN){
      WebSocketRef.current.send(JSON.stringify(data))
      console.log("Data send :", data)
    }else{
      console.error('Websocket is not connected');
    }
    setAlias('')
  }

  // Tournament map component
  const TournamentMap = () => {
      // "competitors": [
      //   {"username": "",
      //  "profile_pic_url": "",
      //   "lost": false,
      //   "id": 0},

    return (
      <div className="w-full h-full flex justify-center items-center">

      <div className="mb-24 mt-6 lg:mb-0 lg:mt-0 bg-gray-800/50 border border-violet-primary rounded-xl text-center w-full lg:w-fit lg:p-4 p-4 flex justify-center items-center flex-col">
        <div className="flex justify-center items-center mb-8 lg:mb-0 lg:ml-8">
          <img
            src={Profil.src}
            alt="Tournament pic"
            className="object-cover w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full"
            />
          <h1 className="text-white ml-4 text-lg md:text-xl lg:text-2xl">{roomName}</h1>
        </div>
        <div className="p-2 w-full mt-4 lg:flex lg:flex-row lg:p-0">
          <div className="flex justify-around items-end w-full lg:flex lg:flex-col lg:items-end lg:w-24">
            <div className="flex flex-col items-center lg:mt-6 xl:mt-0">
              <img
                src={Profil.src}
                alt="Player 1"
                className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
              <span className="text-white text-sm lg:text-base mt-2">{players[0].username}</span>
            </div>
            <div className="flex flex-col items-center lg:mt-[190px]">
              <img
                src={Profil.src}
                alt="Player 2"
                className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
              <span className="text-white text-sm lg:text-base mt-2">{players[1].username}</span>
            </div>
          </div>

          <div className="hidden mt-10 h-[350px] lg:block">
            <img
              src={Line1.src}
              alt="Line"
              className="w-full lg:w-[350px] h-[350px]"
              />
          </div>

          <div className="flex flex-col justify-center items-center gap-8 lg:gap-2 lg:flex-row lg:mt-6">
            <div className="flex flex-col items-center ">
              <img
                src={Profil.src}
                alt="Finalist 1"
                className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
              <span className="text-white text-sm lg:text-nowrap lg:text-base mt-2">Finalist 1</span>
            </div>
            <div className="flex flex-col items-center lg:mb-48">
              <img
                src={Trophy.src}
                alt="Trophy"
                className="w-14 h-14 md:w-16 md:h-16 lg:w-12 lg:h-12 xl:w-18 xl:h-18 object-cover p-2"
                />
              <span className="text-white text-sm lg:text-base mt-2">Trophy</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={Profil.src}
                alt="Finalist 2"
                className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 z-50 object-cover rounded-full shadow-lg"
                />
              <span className="text-white text-sm lg:text-nowrap lg:text-base mt-2">Finalist 2</span>
            </div>
          </div>

          <div className="hidden mt-10 h-[330px] lg:block">
            <img
              src={Line1.src}
              alt="Line"
              className="w-full lg:w-[350px] h-[350px] transform scale-x-[-1]"
              />
          </div>

          <div className="flex justify-around items-end w-full lg:flex lg:flex-col lg:items-start lg:w-24">
            <div className="flex flex-col items-center lg:mt-6 xl:mt-0">
              <img
                src={Profil.src}
                alt="Player 3"
                className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
              <span className="text-white text-sm lg:text-base mt-2">{players[2].username}</span>
            </div>
            <div className="flex flex-col items-center lg:mt-[190px]">
              <img
                src={Profil.src}
                alt="Player 4"
                className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
              <span className="text-white text-sm lg:text-base mt-2">{players[3].username}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-start items-center px-4 w-full h-full py-8">
      {!tournamentMap ? (
        !confirmation ? (
          <div className="bg-gray-700/50 shadow-lg border border-violet-primary max-w-lg w-full p-6 rounded-lg mb-8">
            <h1 className="text-xl text-white font-semibold text-center">Enter Your Alias</h1>
            <input
              type="text"
              placeholder="Enter name"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full mt-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
              required
            />
            <button
              className="mt-4 w-full bg-gray-400 py-2 rounded-md"
              onClick={() => handleAlias()}
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-full max-w-7xl p-4 rounded-lg shadow-lg mt-8">
              <div className="w-full lg:flex lg:gap-8">
                {/* Create Tournament Card */}
                <div className="bg-gray-700/50 shadow-lg border border-violet-primary rounded-lg p-6 w-full lg:max-w-2xl lg:min-w-[350px] h-[500px] flex flex-col space-y-6">
                  <h2 className="text-lg text-white text-center font-semibold mb-4">Create Tournament</h2>
                  <form onSubmit={handleCreateTournament} className="flex flex-col space-y-6 h-full">
                    <input
                      type="text"
                      placeholder="Tournament Name"
                      value={roomName}
                      onChange={(e) => setTournamentName(e.target.value)}
                      className="w-full p-3 border rounded-md bg-gray-500/40 text-white"
                    />
                    <div className="flex justify-center items-center w-full">
                      <input
                        type="file"
                        onChange={(e) => setTournamentImage(URL.createObjectURL(e.target.files[0]))}
                        className="w-24 h-24 p-3 border rounded-full bg-gray-500/40"
                      />
                    </div>
                    <div className="flex justify-center mt-4">
                      <button
                        type="submit"
                        className="w-full bg-green-500 py-2 rounded-md"
                      >
                        Create Tournament
                      </button>
                    </div>
                  </form>
                </div>

                {/* Join Tournament Card */}
                <div className="bg-gray-700/50 shadow-lg rounded-lg p-6  w-full border border-violet-primary lg:min-w-[350px] h-[500px] overflow-y-scroll mt-6 lg:mt-0">
                  <h2 className="text-lg text-center text-white font-semibold mb-10">Join Tournament</h2>
                  <div className="flex flex-col gap-4">
                    {availableTournaments.map((tournament, index) => (
                      <div
                        key={index}
                        className="flex items-center w-full space-x-4 p-4 border rounded-lg hover:bg-gray-100 cursor-pointer"
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
        )
      ) : (
        <TournamentMap />
      )}
    </div>
  );
};

export default Page;
