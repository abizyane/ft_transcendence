"use client"
import { useEffect, useState,useRef } from "react"
import Game_Front from "./gameFront"

export default function Canvas ({socketRef}){
    const canvasRef = useRef(null);
    const GameRef = useRef(null)
    const Context = useRef(null)
    let Connected = useRef(false)

    const [bluePos, setBlue] = useState({})
    const [redPos, setRed] = useState({x:0, y:0})
    const [ball, setBall] = useState({x:0, y:0})
    
    const keyDownHandler = (e) =>{
        if (e.key === 'w'){
            socketRef.current.send(JSON.stringify(
                {
                    type: 'input',
                    command: 'keyW_down',
                    w : 'true'
                }
            ))
        }
        else if (e.key === 's'){
            socketRef.current.send(JSON.stringify(
                {
                    type: 'input',
                    command: 'keyS_down',
                    s: 'true'
                }
            ))
        }
    }

    const keyUpHandler = (e) =>{
        if (e.key === 'w'){
            socketRef.current.send(JSON.stringify(
                {
                    type: 'input',
                    command : 'keyW_up',
                    w: 'false'
                }
            ))
        }
        else if (e.key === 's'){
            socketRef.current.send(JSON.stringify(
                {
                    type: 'input',
                    command: 'keyS_up',
                    s: 'false'
                }
            ))
        }
    }

    useEffect(() => {
        // Make sure the WebSocket is available before using it
        if (socketRef.current) {
          socketRef.current.onmessage = (e) => {
            const jsondata = JSON.parse(e.data);
            console.log('Received message:', jsondata);
    
            // Handle position updates or other messages here
            if (jsondata.type === 'update') {
              setBlue(jsondata.blue); // assuming the update contains the blue player's position
              setRed(jsondata.red);   // assuming the update contains the red player's position
              setBall(jsondata.ball);    // assuming the update contains the ball's position
            }
          };
        }
    
        // Add event listeners for key events
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
    
        // Cleanup event listeners on unmount
        return () => {
          window.removeEventListener('keydown', keyDownHandler);
          window.removeEventListener('keyup', keyUpHandler);
        };
      }, [socketRef]);

    /*Canvas Function */
    useEffect(()=>{
        const canvas = canvasRef.current
        canvas.width = 1080
        canvas.height = 720
        Context.current = canvas.getContext('2d');
        if (!GameRef.current)
            GameRef.current = new Game_Front(canvas, {player_one: {posX:bluePos.x, posY: 3, width: 12, height:50, color: 'blue'}, player_two:{posX:redPos.x, posY: 3, width: 12, height:50, color: 'red'}, ball:{}})

        }, [])
        
    useEffect(() => {
        Context.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
        GameRef.current.update({player_1: bluePos, player_2: redPos, ball: ball})
        GameRef.current.render(Context.current)
    },[bluePos, redPos, ball])

    return (
        <canvas tabIndex={1} ref={canvasRef} className="w-full h-full "></canvas>
    );
}