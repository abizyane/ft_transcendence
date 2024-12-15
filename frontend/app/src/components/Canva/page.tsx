"use client"
import { useEffect, useState,useRef } from "react"
import Game_Front from "./gameFront"
import { useGame } from "@/services/context/gameContext";


export default function Canvas ({socketRef, callback, scoreSetter , setWinner, setLooser, scores}){
    const canvasRef = useRef(null);
    const GameRef = useRef(null)
    const Context = useRef(null)
    const bluePosRef = useRef({ x: 0, y: 0 });
    const redPosRef = useRef({ x: 0, y: 0 });
    const ballRef = useRef({ x: 0, y: 0 });
    const {gameCustomization} = useGame();
    const keyWUp = useRef(false);
    const keyWdown = useRef(false)
    const keySUp = useRef(false);
    const keySDown = useRef(false);



    const keyDownHandler = (e) =>{

        if (e.key === 'w'){
          console.log("down:", e.key)
          socketRef.current.send(JSON.stringify({
                      'command' : 'input',
                      'type' : 'keyW_up'
                  }))
        }
        else if (e.key === 's'){
          console.log("dowm:", e.key)
          socketRef.current.send(JSON.stringify({
                      'command' : 'input',
                      'type' : 'keyS_up'
              }))
        }
    }

    const keyUpHandler = (e) =>{
        if (e.key === 'w'){
          console.log("up:", e.key)
          socketRef.current.send(JSON.stringify({
                      'command' : 'input',
                      'type' : 'keyW_down'
              }))
        }
        else if (e.key === 's'){
          console.log("up: ", e.key)
          socketRef.current.send(JSON.stringify({
                      'command' : 'input',
                      'type' : 'keyS_down'
              }))
        }
    }

    useEffect(() => {
      console.log("effect")

        // if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
        //     if (keyWUp.current) {
        //         console.log("yoyoyoyooyo")
        //         socketRef.current.send(JSON.stringify({
        //             'command' : 'input',
        //             'type' : 'keyW_up'
        //         }))
        //         keyWUp.current = false
        //     }if (keyWdown){
        //         socketRef.current.send(JSON.stringify({
        //             'command' : 'input',
        //             'type' : 'keyW_down'
        //     }))
        //     keyWdown.current = false
        //     }if (keySUp){
        //         socketRef.current.send(JSON.stringify({
        //             'command' : 'input',
        //             'type' : 'keyS_up'
        //     }))
        //     keySUp.current = false
        //     }if (keySDown){
        //         socketRef.current.send(JSON.stringify({
        //             'command' : 'input',
        //             'type' : 'keyS_down'
        //     }))
        //     }
        //     keySDown.current = false
        // }else{
        //     console.error("websocket is already closed")
        // }
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);

        return () => {
            console.log("key lestners detroyed")
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
        };

    }, [socketRef])

    useEffect(() => {
        console.log("socket ref on  effect ", socketRef.current)
        if (socketRef.current) {
            socketRef.current.onmessage = async (event) => {
                if (event.data instanceof Blob) {
                    const arrayBuffer = await event.data.arrayBuffer();
                    const floatArray = new Float32Array(arrayBuffer);
                    bluePosRef.current = {x:floatArray[0], y:floatArray[1]}
                    redPosRef.current = {x:floatArray[2],y:floatArray[3]}
                    ballRef.current = {x:floatArray[4], y:floatArray[5]}
                    if (scores?.one != floatArray[6] || scores?.two != floatArray[7]){
                        scoreSetter({one: floatArray[6], two: floatArray[7]})
                    }
                } else {
                    // console.log('Received non-binary data:', event.data);
                    const jsondata = JSON.parse(event.data)
                    if (jsondata.command == "setReady"){
                        callback(true)
                        console.log("READY")
                    }
                    else if (jsondata.command == "wait"){
                        console.log("not ready")
                        callback(false)
                    }
                    if (jsondata.msg){
                        if (jsondata.msg == "You Won"){
                            if (setWinner)
                                setWinner(true);
                            callback(false)
                        }
                        else if (jsondata.msg == "You Lost"){
                            if (setLooser)
                                setLooser(true);
                            callback(false)
                        }
                        console.log(jsondata.msg)
                    }
                }
            };

        }

      }, []);




    /*Canvas Function */
    useEffect(()=>{
        const canvas = canvasRef.current
        if (canvas){
            canvas.width = 1080
            canvas.height = 720
            Context.current = canvas.getContext('2d');
            if (!GameRef.current)
                GameRef.current = new Game_Front(canvas, {player_one: {posX:bluePosRef.current.x, posY: 3, width: 2, height:60, color: gameCustomization.user_paddle_color  }, player_two:{posX:redPosRef.current.x, posY: 3, width: 2, height:60, color: gameCustomization.opponent_paddle_color}, ball:{color: gameCustomization.ball_color}})
        }
    }, [])

    useEffect(() => {
    let animationFrameId = null;
        const game_loop = (timestamp) =>{
            if (canvasRef.current && Context.current) {
                    Context.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    GameRef.current.update({
                        player_1: bluePosRef.current,
                        player_2: redPosRef.current,
                        ball: ballRef.current
                    });
                    GameRef.current.render(Context.current);
            }
            animationFrameId = requestAnimationFrame(game_loop);
        }
            animationFrameId = requestAnimationFrame(game_loop);
            return () => {
                cancelAnimationFrame(animationFrameId);
            };

    },[])

    return (
        <canvas tabIndex={1} ref={canvasRef} className="w-full h-full"></canvas>
    );
}
