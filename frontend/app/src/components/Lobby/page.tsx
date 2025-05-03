import { useEffect, useState } from "react"

export default function Lobby ({players}){
    const [playersList, setPlayersList] = useState([])
    useEffect(() => {
        setPlayersList(Object.values(players))
    }, [players]);
    
    const renderList = playersList.map((player, i) => <li key={i}>
        <img src={player.imgUrl} alt={`Player ${player.id}`}/>
        <h3>{player.id}</h3>
        </li>)
    return(<>
        <h1>Lobby</h1>
        <ul>{renderList}</ul>
    </>)
}