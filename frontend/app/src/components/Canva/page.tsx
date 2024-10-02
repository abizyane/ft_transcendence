"use client"
import { useEffect, useState,useRef } from "react"
import Game_Front from "./gameFront"

export default function Canvas (){
    const canvasRef = useRef(null);
    const socketRef = useRef();
    const GameRef = useRef(null)
    let Connected = useRef(false)

    const [bluePos, setBleu] = useState({})
    const [redPos, setRed] = useState({x:0, y:0})
    const [ball, setBall] = useState({x:0, y:0})

    useEffect (() => {
        const timer = setTimeout(() => {
            if (Connected.current == false)
                socketRef.current =  new WebSocket('ws://'+ window.location.hostname+':8000/ws/game/1/')
            socketRef.current.onopen = e => {
                console.log(e.data)
                Connected.current = true
            }
            
            socketRef.current.onclose = e=>{
                console.log('closed')
                Connected.current = false
            }
            
            socketRef.current.onmessage = (e) => {
                const msgObj = JSON.parse(e.data)
                if (msgObj.type === 'send_position')
                    if (msgObj.id === '0')
                    {
                        setBleu(msgObj.player)
                        setRed(msgObj.player_two)
                        setBall({x:msgObj.ball.x, y:msgObj.ball.y})
                    }
    
                    if (msgObj.id === '1'){
                        setRed(msgObj.player)
                        setBleu(msgObj.player_two)
                        setBall({x:msgObj.ball.x, y:msgObj.ball.y})
                    }
                    
            }
            if (canvasRef.current){
                canvasRef.current.addEventListener('keydown', keyDownHandler, false);
                canvasRef.current.addEventListener('keyup', keyUpHandler, false);
            }
        }, 300)
        return () => {clearTimeout(timer)}
    }, [])
    
    const keyDownHandler = (e) =>{
        if (e.key === 'w'){
            socketRef.current.send(JSON.stringify(
                {
                    type: 'input',
                    w : 'true'
                }
            ))
        }
        else if (e.key === 's'){
            socketRef.current.send(JSON.stringify(
                {
                    type: 'input',
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
                    w: 'false'
                }
            ))
        }
        else if (e.key === 's'){
            socketRef.current.send(JSON.stringify(
                {
                    type: 'input',
                    s: 'false'
                }
            ))
        }
    }


    /*Canvas Function */
    useEffect(()=>{
        const canvas = canvasRef.current
        canvas.width = 1080
        canvas.height = 720
        const context = canvas.getContext('2d');
        if (!GameRef.current)
            GameRef.current = new Game_Front(canvas, {player_one: {posX:bluePos.x, posY: 3, width: 12, height:50, color: 'blue'}, player_two:{posX:redPos.x, posY: 3, width: 12, height:50, color: 'red'}, ball:{}})
        let animatedFrame
        const animate = () =>{
            context.clearRect(0,0, canvas.width, canvas.height)
            GameRef.current.render(context)
            animatedFrame = window.requestAnimationFrame(animate)
            GameRef.current.update({player_1: bluePos, player_2: redPos, ball: ball})
        }
        animate()
        canvas.focus();
    }, [bluePos, redPos, ball])

    return (
        <canvas tabIndex={1} ref={canvasRef} className="w-full h-full"></canvas>
    );
}