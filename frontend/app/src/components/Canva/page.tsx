"use client"
import { useEffect, useState,useRef } from "react"
import Game_Front from "./gameFront"

export default function Canvas ({socketRef, callback}){
    const canvasRef = useRef(null);
    const GameRef = useRef(null)
    const Context = useRef(null)
    const bluePosRef = useRef({ x: 0, y: 0 });
    const redPosRef = useRef({ x: 0, y: 0 });
    const ballRef = useRef({ x: 0, y: 0 });
    
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
        if (socketRef.current) {
            socketRef.current.onmessage = async (event) => {
                if (event.data instanceof Blob) {
                    const arrayBuffer = await event.data.arrayBuffer();
                    const floatArray = new Float32Array(arrayBuffer);
                    bluePosRef.current = {x:floatArray[0], y:floatArray[1]}
                    redPosRef.current = {x:floatArray[2],y:floatArray[3]}
                    ballRef.current = {x:floatArray[4], y:floatArray[5]}
                } else {
                    // const jsondata = JSON.parse(event.data)
                    // if (jsondata.type == "room"){
                    //     if (jsondata.command == "setReady"){
                    //     callback(true)
                    //     console.log("READY")
                    //     } 
                    //     else if (jsondata.command == "wait")
                    //         callback(false)       
                    // }
                }
            };
        }
    
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
    
        return () => {
          window.removeEventListener('keydown', keyDownHandler);
          window.removeEventListener('keyup', keyUpHandler);
        };
      }, [socketRef]);

    /*Canvas Function */
    let lastTime = 0
    useEffect(()=>{
        const canvas = canvasRef.current
        if (canvas){
            canvas.width = 1080
            canvas.height = 720
            Context.current = canvas.getContext('2d');
            if (!GameRef.current)
                GameRef.current = new Game_Front(canvas, {player_one: {posX:bluePosRef.current.x, posY: 3, width: 12, height:50, color: 'blue'}, player_two:{posX:redPosRef.current.x, posY: 3, width: 12, height:50, color: 'red'}, ball:{}})
        }

        }, [])
        
    useEffect(() => {
        if (canvasRef.current){
            const game_loop = () =>{
                Context.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
                GameRef.current.update({player_1: bluePosRef.current, player_2: redPosRef.current, ball: ballRef.current})
                GameRef.current.render(Context.current)
                requestAnimationFrame(game_loop)
            }
            requestAnimationFrame(game_loop)
        }
    },[])

    return (
        <canvas tabIndex={1} ref={canvasRef} className="w-full h-full "></canvas>
    );
}