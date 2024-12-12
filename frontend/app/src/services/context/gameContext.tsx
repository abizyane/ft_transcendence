import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './usercontext';
import toast from "react-hot-toast";



export interface GameContextType {
    user_paddle_color: string;
    opponent_paddle_color: string;
    ball_color: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useNotif must be used within a NotifProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [gameCustomization, setGameCustomization] = useState<GameContextType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchGameCustomization = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/game_customization', {credentials: 'include',});
      if (response.ok) {
        const data = await response.json();
        console.log("notifications", data);
        setGameCustomization(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      let options = {
        user_paddle_color: "255,0,0",
        opponent_paddle_color: "0,255,0",
        ball_color: "0,0,255"
      }
      setGameCustomization(options);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGameCustomization = async (data: GameContextType) => {
    try {
      const response = await fetch('http://localhost:8000/api/game_customization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setGameCustomization(data);
        toast.success('Game customization updated successfully');
      }
      return true;
    } catch (error) {
      console.error('Failed to update game customization:', error);
      toast.error('Failed to update game customization');
      return false;
    }
  };


  useEffect(() => {
    fetchGameCustomization();
  }, []);

  return (
    <GameContext.Provider value={{ isLoading, gameCustomization, updateGameCustomization, fetchGameCustomization }}>
      {children}
    </GameContext.Provider>
  );
};
