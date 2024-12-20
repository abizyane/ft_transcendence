"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './usercontext';
import toast from "react-hot-toast";
import { customFetch } from '@/utils/customFetch';


interface Notification {
    id: number;
    content: string;
    timestamp: string;
    link: string | null;
}

interface NotifContextType {
    notifications: Notification[] | null;
    fetchNotifications: () => void;
  }


const NotifContext = createContext<NotifContextType | undefined>(undefined);

export const useNotif = () => {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error('useNotif must be used within a NotifProvider');
  }
  return context;
};

export const NotifProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/notifications/list/');
      if (response && response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log('Notification clicked:', notification);
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [notification,...(prevNotifications || [])]);
  };

  const connectSocket = () => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_API_URL.replace('http', 'ws')+'/notifications/');
    ws.onopen = () => {
    };
    
    ws.onclose = () => {
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        addNotification({
          id: data.id,
          content: data.content,
          timestamp: data.timestamp,
          link: data?.link || null
        });
        toast(data.content);
      } else if (data.type === "game_invite"){
          addNotification({
            id: data.id,
            content: data.content,
            timestamp: data.timestamp,
            link: data?.link || null
          });
          toast((t)=>{
            return <div className='flex items-center justify-center'>
              <p className='text-md mr-4'>{data.content}</p>
              <button className='bg-violet-500 hover:bg-violet-700 text-md font-bold text-white px-2 py-1 border-2 border-violet-700 hover:border-violet-700 rounded-md' onClick={() => {
                window.location.href = data.link;
                toast.dismiss(t.id);
              }}>Join</button>
            </div>
          }, {duration: 10000,
            icon : '🎮'
          });
      }
    };
    
    setSocket(ws);
  };


  useEffect(() => {
      connectSocket();
    fetchNotifications();
  }, []);

  return (
    <NotifContext.Provider value={{ notifications, isLoading, fetchNotifications }}>
      {children}
    </NotifContext.Provider>
  );
};
