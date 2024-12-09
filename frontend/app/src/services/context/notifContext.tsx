import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './usercontext';


interface Notification {
    id: number;
    message: string;
    created_at: string;
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

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8000/notifications/list', {credentials: 'include',});
      if (response.ok) {
        const data = await response.json();
        console.log("notifications", data);
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const connectSocket = () => {
    const ws = new WebSocket('ws://localhost:8000/notifications/');
    ws.onopen = () => {
    };
    
    ws.onclose = () => {
    };
    
    setSocket(ws);
  };


  useEffect(() => {
      connectSocket();
    fetchNotifications();
  }, []);

  return (
    <NotifContext.Provider value={{ notifications, fetchNotifications }}>
      {children}
    </NotifContext.Provider>
  );
};
