"use client";

import Profil from "../../../../../public/Profil.jpg";
import Line from "../../../../../public/tournamentline.svg";
import Line1 from "../../../../../public/tournementline2.svg";
import Trophy from "../../../../../public/Trophy.png";
import { useState, useEffect, useRef, useCallback } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { toast } from "react-hot-toast";
import Mars from "../../../../../public/Mars.jpeg";
import Unknwon from "../../../../../public/Unknown_person.jpeg";
import { isReadable } from "stream";
import Canvas from "@/components/Canva/page";

interface Comptetitor {
  username: string;
  alias: string;
  profile_pic_url: string;
  lost: boolean;
  id: number;
}

interface Room {
  name: string;
  img: string;
  size: number;
  started: boolean;
  competitors: Comptetitor[];
}

const Page = () => {
  const [confirmation, setConfirmation] = useState(false);
  const [alias, setAlias] = useState("");
  const [roomName, setTournamentName] = useState("");
  const [tournamentImage, setTournamentImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const WebSocketRef = useRef(null);
  const [availableTournaments, setAvailableTournaments] = useState([]);
  const [tournamentMap, setTournamentMap] = useState(false);
  const [room, setRoom] = useState(null);
  const [ready, setReady] = useState(false)
  const [inGame, setInGame] = useState(false);
  const socketRef = useRef(null);
  const [scores, setScores] = useState({ one: 0, two: 0 });
  const [winner, setWinner] = useState(false);
  const [looser, setLooser] = useState(false);
  const [gameready, setGameReady] = useState(false);
  const [creationImageid, setCreationImageid] = useState(-1);

  //---------Tournament Map vars Start---------
  const defaultUser = {
    alias: 'player',
    profile_pic_url: '',
    id: 0
  }
  const defaultUsers = (() => {
    let users = [];
    for (let i = 0; i < 4; i++)
      users[i] = { ...defaultUser, id: i, alias: "player" + i.toString() }
    return users
  })()

  const [players, setPlayers] = useState(defaultUsers)

  const handleRoomUpdate = (users) => {
    console.log(users)
    const nextUserList = defaultUsers.map((defuser) => {
      const newUser = users.find(u => u.id === defuser.id);
      return newUser ? { ...defuser, ...newUser } : defuser
    })
    setPlayers(nextUserList)
  }

  //---------Tournament Map var END--------- 


  const defaObj = {
    name: "Tournament",
    img: "/tournament1.jpg",
    size: 0,
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTournamentImage(file);
      setPreviewImage(URL.createObjectURL(file));
      handleImage(file);
    }
  };

  const handleTournamentList = (tournaments) => {
    const rooms = (tournaments.room || []).map((room) => {
      if (room.img) {
        return {
          ...room,
          img: room.img,
        }
      } else {
        return {
          ...room,
          img: "/tournament1.jpg",
        }
      }
    }) || [];
    console.log(rooms);
    console.log(availableTournaments);
    setAvailableTournaments(rooms);
  };

  useEffect(() => {
    let isConnected = false;
    if (!WebSocketRef.current)
      WebSocketRef.current = new WebSocket(
        "ws://localhost:8000/ws/tournament/FOUR/"
      );

    WebSocketRef.current.onopen = () => {
      isConnected = true;
      console.log("WebSocket connection established");
    };

    WebSocketRef.current.onmessage = (event) => {
      console.log("Message from server:", event.data);
      if (typeof event.data != "string")
        return;
      const received_data = JSON.parse(event.data);
      if (received_data.type == "tournament_state")
        handleTournamentList(received_data);
      else if (received_data.approving){
        setTournamentMap(received_data.approving)
        setRoom(received_data.room)
      }
      else if (received_data.type == "alias") {
        if (received_data.accepted) {
          toast.success("alias accepted");
          setConfirmation(true);
        } else {
          toast.error(received_data.ErrorMsg);
        }
      }
      else if (received_data.type === "room") {
        if (received_data.command === "setCompetitors") {
          handleRoomUpdate(received_data.competitors)
        }
        else if (received_data.command === "setReady") {
          console.log("setting Ready", received_data);
          setReady(true);
        } else if (received_data.command === "wait") {
          setReady(false);
        }
      }
      else if (received_data.ErrorMsg ) {
        toast.error(received_data.ErrorMsg);
      
      }

    };

    WebSocketRef.current.onerror = (error) => {
      isConnected = false;
      console.error("WebSocket error:", error);
    };

    WebSocketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      // Cleanup the WebSocket connection when component unmounts
      if (isConnected) {
        WebSocketRef.current.close();
      }
    };
  }, []);
  const handleImage = async (profileImage: File) => {
    const formData = new FormData();
    formData.append('tournament_pic', profileImage);

    try {
      const response = await fetch('http://localhost:8000/api/upload_tournament_pic', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error(responseData);
        toast.error('Image upload failed');
        setPreviewImage(null);
        return false;
      } else {
        console.log(responseData);
        toast.success('Image updated successfully');
        setCreationImageid(responseData.picture_id);
        setPreviewImage(responseData.tournament_pic_url);
        return true;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
      setPreviewImage(null);
    }
  };
  const handleCreateTournament = (event) => {
    event.preventDefault();
    if (!tournamentImage || !roomName) {
      toast.error("Please fill in all fields.");
      return;
    }
    // if (!alias || !roomName) {
    //   alert("Please fill in all fields.");
    //   return;
    // }
    if (roomName.length < 2 || roomName.length > 5) {
      toast.error("Tournament name must be between 2 and 5 characters.");
      return;
    }
    const command = "create";
    // Prepare the data to send
    const roomData = {
      command,
      alias,
      roomName,
      roomImage: creationImageid,
    };

    if (
      WebSocketRef.current &&
      WebSocketRef.current.readyState === WebSocket.OPEN
    ) {
      WebSocketRef.current.send(JSON.stringify(roomData));
      console.log("Data sent:", roomData);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  // Handle joining a tournament
  const handleJoinTournament = (tournament) => {
    tournament.command = "join";
    console.log("Joining Tournament:", tournament);
    if (
      WebSocketRef.current &&
      WebSocketRef.current.readyState === WebSocket.OPEN
    ) {
      WebSocketRef.current.send(JSON.stringify(tournament));
      setTournamentName(tournament.name)
      console.log('Data sent:', tournament);
    } else {
      console.error("WebSocket is not connected");
    }
  };


  const handleAlias = () => {
    if (alias.length < 2 || alias.length > 5)
      {
        toast.error("Alias must be between 2 and 4 characters");
        return;
      }
      
    const command = "setAlias";
    const data = {
      command,
      alias,
    };

    if (
      WebSocketRef.current &&
      WebSocketRef.current.readyState === WebSocket.OPEN
    ) {
      WebSocketRef.current.send(JSON.stringify(data));
      console.log("Data send :", data);
    } else {
      console.error("Websocket is not connected");
      console.log("Websocket is not connected");
    }
    setAlias("");
  };


  const handleStartGame = () => {
    const command = 'play';
    const data = {
      command,
    }
    if (
      WebSocketRef.current &&
      WebSocketRef.current.readyState === WebSocket.OPEN
    ) {
      WebSocketRef.current.send(JSON.stringify(data));
      console.log("Data send :", data);
    } else {
      console.error("Websocket is not connected");
      console.log("Websocket is not connected");
    }
    setInGame(true);
  };

  const handleMatchEnd = () => {
    setInGame(false);
  };

  const RenderCanvas = () => {
    const updateScores = useCallback((newScores) => {
      setScores((prev) => ({ ...prev, ...newScores }));
    }, []);
    return (
      <div className="w-full h-full flex items-center justify-center">

        <div className="max-w-[1200px] w-full h-fit flex flex-col items-center justify-between p-2">
          <div className="max-w-[1200px] w-full  h-fit border-violet-primary backdrop-blur-lg border-2 p-2 rounded-lg flex flex-col mb-24 lg:mb-0">
            <div className="flex justify-between items-center w-full bg-transparent p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-start">
                <img
                  src={Mars.src}
                  alt="First User"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div className="text-white">
                  {/* <div className="text-xs font-bold">{users[0].username}</div> */}
                </div>
              </div>
              <div className="flex items-center space-x-2 m-2">
                <div className="text-xl lg:text-3xl text-white font-bold">
                  {scores.one}
                </div>
                <span className="text-xl lg:text-3xl text-white">:</span>
                <div className="text-xl lg:text-3xl text-white font-bold">
                  {scores.two}
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-700 p-1 lg:p-3 rounded-full w-36 lg:w-1/3 lg:h-14 justify-center lg:justify-end">
                <div className="text-white">
                  <div className="text-xs font-bold text-right">
                    {/* {users[1].username} */}
                  </div>
                </div>
                <img
                  src={Mars.src}
                  alt="Second User"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
            </div>
            <div
              className=" w-full h-full flex items-center justify-center border-4 object-cover border-white rounded-lg relative"
              style={{
                backgroundImage: `url('/Mars.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.7,
              }}
            >
              <Canvas
                socketRef={WebSocketRef}
                setWinner={setWinner}
                setLooser={setLooser}
                callback={setReady}
                scores={scores}
                scoreSetter={updateScores}
              ></Canvas>
            </div>
          </div>
        </div>
      </div>
    )
  };

  // Tournament map component
  const TournamentMap = ({ onPlay }: { onPlay: () => void }) => {
    const defaultUser = {
      username: "Player",
      profile_pic_url: Profil.src,
      id: 0,
    };
    const defaultUsers = (() => {
      let users = room.competitors;
      for (let i = 0; i < 4; i++)
        if (!users[i]) {
          users[i] = { ...defaultUser, id: i, username: "Player " + i.toString() };
        }
      return users;
    })();

    const [players, setPlayers] = useState(defaultUsers);

    const handleRoomUpdate = (users) => {
      const nextUserList = defaultUsers.map(
        (user) => users.find((u) => u.id === user.id) || user
      );
      setPlayers(nextUserList);
    };
    useEffect(() => {
      WebSocketRef.current.onmessage = (e) => {
        if (typeof e.data === "string") {
          console.log("received data 22", e.data);
          const data = JSON.parse(e.data);
          if (data.type === "room") {
            if (data.command === "setCompetitors" || data.command === "wait") {
              if (data.competitors) {
                handleRoomUpdate(data.competitors);
              }
            }
            else if (data.command === "setReady") {
              console.log("setting Ready", data);
              setReady(true);
            } else if (data.command === "wait") {
              setReady(false);
            }
          }
        }
      };
    }, []);


    console.log("ready", ready);
    return (
      <div className="w-full h-full flex justify-center items-center">

        <div className="mb-24 mt-6 lg:mb-0 lg:mt-0 bg-gray-800/50 border border-violet-primary rounded-xl text-center w-full lg:w-fit lg:p-4  p-4 flex flex-col">
          <div className="flex justify-center items-center mb-8 lg:mb-0 lg:ml-8">
            <img
              src={room.img || Profil.src}
              alt="Tournament pic"
              className="object-cover w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full"
            />
            <h1 className="text-white ml-4 text-lg md:text-xl lg:text-2xl">
              {room.name}
            </h1>
          </div>

          <div className="p-2 w-full mt-4 lg:flex lg:flex-row lg:p-0">
            <div className="flex justify-around items-end w-full lg:flex lg:flex-col lg:items-end lg:w-24">
              <div className="flex flex-col items-center lg:mt-6 xl:mt-0">
                <img
                  src={players[0].profile_pic_url}
                  alt="Player 1"
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16  xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
                <span className="text-white text-sm lg:text-base mt-2">{players[0].alias}</span>
              </div>
              <div className="flex flex-col items-center lg:mt-[190px]">
                <img
                  src={players[1].profile_pic_url}
                  alt="Player 2"
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
                <span className="text-white text-sm lg:text-base mt-2">{players[1].alias}</span>
              </div>
            </div>

            <div className="hidden mt-10 h-[350px] lg:block">
              <img
                src={Line1.src}
                alt="Line"
                className="w-full lg:w-[350px] h-[350px]"
              />
            </div>
            <div className="flex justify-center items-center h-fit lg:hidden">
              <img
                src={Line.src}
                alt="Line"
                className="w-[50%] h-[20%] md:h-[3%] z-50"
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
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-12  lg:h-12  xl:w-18 xl:h-18 object-cover p-2"
                />
                <span className="text-white text-sm lg:text-base mt-2">Trophy</span>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={Profil.src}
                  alt="Finalist 2"
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 z-50 object-cover rounded-full shadow-lg"
                />
                <span className="text-white text-sm  lg:text-nowrap lg:text-base mt-2">Finalist 2</span>
              </div>
            </div>

            <div className="hidden mt-10 h-[330px] lg:block">
              <img
                src={Line1.src}
                alt="Line"
                className="w-full lg:w-[350px] h-[350px] transform scale-x-[-1]"
              />
            </div>
            <div className="lg:hidden flex justify-center items-center h-fit">
              <img
                src={Line.src}
                alt="Line"
                className="w-[50%] h-[20%] z-50 transform scale-y-[-1]"
              />
            </div>

            <div className="flex justify-around items-end w-full lg:flex lg:flex-col lg:items-start lg:w-24">
              <div className="flex flex-col items-center lg:mt-6 xl:mt-0">
                <img
                  src={players[2].profile_pic_url}
                  alt="Player 3"
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
                <span className="text-white text-sm lg:text-base mt-2">{players[2].alias}</span>
              </div>
              <div className="flex flex-col items-center lg:mt-[190px]">
                <img
                  src={Profil.src}
                  alt="Player 4"
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full shadow-lg"
                />
                <span className="text-white text-sm lg:text-base mt-2">{players[3].alias}</span>
              </div>
            </div>
          </div>
          <button
            className="bg-violet-900/90 text-white font-bold py-2 px-4 mt-6 rounded hover:bg-violet-700"
            onClick={(e) => {
              WebSocketRef.current.send(JSON.stringify({
                command: 'play'
              }))
            }}
          >
            Play
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-start items-center px-4 w-full h-full py-8">
      {
        !tournamentMap ? (
          !confirmation ? (
            <div className="bg-gray-700/50 shadow-lg border border-violet-primary max-w-lg w-full p-6 rounded-lg mb-8">
              <h1 className="text-xl text-white font-semibold text-center">
                Enter Your Alias
              </h1>
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
                  <div className="bg-gray-700/50 shadow-lg border border-violet-primary rounded-lg p-6 w-full lg:max-w-2xl lg:min-w-[350px] h-[500px] flex flex-col gap-6 space-y-6">
                    <h2 className="text-lg text-white text-center font-semibold mb-4">
                      Create Tournament
                    </h2>
                    <form
                      onSubmit={handleCreateTournament}
                      className="flex flex-col space-y-6 h-full gap-10"
                    >
                      <input
                        type="text"
                        placeholder="Tournament Name"
                        value={roomName}
                        onChange={(e) => setTournamentName(e.target.value)}
                        className="w-full p-3 border rounded-md bg-gray-500/40 text-white"
                        required
                      />
                      <div className="flex flex-col items-center w-full">
                        <label
                          htmlFor="upload"
                          className="flex justify-center items-center w-24 h-24 p-3 border rounded-full bg-gray-500/40 cursor-pointer"
                        >
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Tournament"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <IoAddCircleSharp className="w-8 h-8 text-black" />
                          )}
                        </label>
                        <input
                          id="upload"
                          type="file"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="flex justify-between">
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
                  <div className="bg-gray-700/50 shadow-lg rounded-lg p-6  w-full border border-violet-primary lg:min-w-[350px] h-[500px] no-scrollbar overflow-y-scroll mt-6 lg:mt-0">
                    <h2 className="text-lg text-center text-white font-semibold mb-10">
                      Join Tournament
                    </h2>
                    <div className="flex flex-col gap-4 ">
                      {availableTournaments.length > 0 ? (
                        availableTournaments.map((tournament, index) => (
                          <div
                            key={index}
                            className="flex items-center w-full space-x-4 p-4 border rounded-lg hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleJoinTournament(tournament)}
                          >
                            <img
                              src={tournament.img || Profil.src}
                              alt={tournament.name}
                              className="w-12 h-12 object-cover rounded-full"
                            />
                            <span className="font-medium text-white">
                              {tournament.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex  text-center h-[340px] items-center  p-6 rounded-lg ">
                          <p className="text-2xl text-white w-full  font-medium">
                            No tournaments found
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : ready ? (
          <RenderCanvas onMatchEnd={handleMatchEnd} />
        ) : 
                <TournamentMap onPlay={handleStartGame} />
        }
    </div>
  );
};

export default Page;
