import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './usercontext';
import toast from "react-hot-toast";


interface Notification {
    id: number;
    content: string;
    timestamp: string;
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
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/notifications/list', {credentials: 'include',});
      if (response.ok) {
        const data = await response.json();
        console.log("notifications", data);
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
    setIsLoading(false);
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log('Notification clicked:', notification);
    // Add your logic here, e.g., redirecting to a specific page
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [...(prevNotifications || []), notification]);
  };

  const connectSocket = () => {
    const ws = new WebSocket('ws://localhost:8000/notifications/');
    ws.onopen = () => {
    };
    
    ws.onclose = () => {
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);
      if (data.type === 'chat_message') {
        addNotification({
          id: data.id,
          content: data.content,
          timestamp: data.timestamp,
        });
        toast(data.content);
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
