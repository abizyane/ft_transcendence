import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './usercontext';
import { toast } from 'react-hot-toast';

interface Message {
  message_id: number;
  sender: string;
  sender_id: number;
  receiver: string;
  receiver_id: number;
  message: string;
  timestamp: string;
  seen: boolean;
  notification: boolean;
}

interface ChatUser {
  id: number;
  username: string;
  profile_pic_url: string;
  is_online: boolean;
  relationship: string;
}

interface Conversation {
  user: ChatUser;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatContextType {
  conversations: { [key: string]: Conversation };
  currentChat?: Conversation;
  ws: WebSocket | null;
  typing: boolean;
  searchConversations: { [key: string]: Conversation };
  messageContainerRef: React.RefObject<HTMLDivElement> | null;
  setSearchConversations: (searchConversations: { [key: string]: Conversation }) => void;
  setCurrentChat: (username: string, conversation?: Conversation) => void;
  setMessageContainerRef: (ref: React.RefObject<HTMLDivElement> | null) => void;
  setTyping: (typing: boolean) => void;
  addMessage: (message: Message) => void;
  updateUserStatus: (username: string, isOnline: boolean) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (userId: number, resetPage: boolean) => Promise<void>;
  setNewChat: (user: ChatUser) => void;
  handleBlockUser: (username:string, relationship:string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<{ [key: string]: Conversation }>(undefined);
  const [searchConversations, setSearchConversations] = useState<{ [key: string]: Conversation }>(undefined);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Conversation>(undefined);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [typing, setTyping] = useState(false);
  const [messageContainerRef, setMessageContainerRef] = useState<React.RefObject<HTMLDivElement> | null>(null);
  const { user } = useUser();

  const handleScrollToBottom = () => {
    if (messageContainerRef?.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/chat/conversations', {
        credentials: 'include',
        
      });
      if (response.ok) {
        const data = await response.json();
        const newConversations: { [key: string]: Conversation } = {};
        data.results.forEach((conv: any) => {
          newConversations[conv.username] = {
            user: {
              id: conv.id,
              username: conv.username,
              profile_pic_url: conv.profile_pic_url,
              relationship: conv.relationship,
              is_online: conv.is_online
            },
            messages: [],
            lastMessage: {
              message_id: 0,
              sender: conv.sender,
              receiver: conv.receiver,
              message: conv.message,
              sender_id: conv.sender_id,
              receiver_id: conv.receiver_id,
              timestamp: conv.timestamp,
              seen: conv.seen
            },
            unreadCount: conv.seen ? 0 : 1
          };
        });
        setConversations(newConversations);
      }
    } catch (error) {
      toast.error('Failed to fetch conversations:');
    }
  };

  const handleBlockUser = (username:string, relationship:string) => {
    setConversations(prev => ({
      ...prev,
      [username]: {
        ...prev[username],
        user: {
          ...prev[username].user,
          relationship: relationship
        }
      }
    }));

    setCurrentChat(prev => prev ? {
      ...prev,
      user: {
        ...prev.user,
        relationship: relationship
      }
    } : undefined);
  }

  const fetchMessages = async (userId: number, resetPage: boolean = false) => {
    try {
      if (nextPage == null && !resetPage) {
        return;
      }
      const url = resetPage ? `${process.env.NEXT_PUBLIC_HOST_URL}:8000/chat/room/${userId}/` : nextPage;
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setNextPage(data.next);
        const username = data.user.username;
        
        const newMessages = resetPage ? [] : conversations[username]?.messages || [];
        newMessages.push(...data.messages);
        newMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const updatedConversation = {
          user: data.user,
          ...conversations[username],
          messages: newMessages,
          unreadCount: newMessages.filter((msg: Message) => 
            !msg.seen && msg.sender === username
          ).length
        };
        if (newMessages.length > 0) {
          updatedConversation.lastMessage = {
            message_id: 0,
            sender: newMessages[newMessages.length - 1].sender,
            sender_id: newMessages[newMessages.length - 1].sender_id,
            receiver: newMessages[newMessages.length - 1].receiver,
            receiver_id: newMessages[newMessages.length - 1].receiver_id,
            message: newMessages[newMessages.length - 1].message,
            timestamp: newMessages[newMessages.length - 1].timestamp,
            seen: newMessages[newMessages.length - 1].seen
          };
        }
        setConversations(prev => ({
          ...prev,
          [username]: updatedConversation
        }));
        sendSeenMessage(username, user?.username);

        handleSetCurrentChat(username, updatedConversation);
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  const addMessage = (message: Message) => {
    const otherUser = message.sender === user?.username ? message.receiver : message.sender;
    const convSeen = message.sender === currentChat?.user.username || user.username === message.sender ? 0 : 1;
    const otherUserId = message.sender === user?.username ? message.receiver_id : message.sender_id;
    
    if (conversations && conversations[otherUser]) {
      setConversations(prev => ({
        ...prev,
        [otherUser]: {
          ...prev[otherUser],
          messages: [message, ...(prev[otherUser]?.messages || [])],
          lastMessage: message,
          unreadCount: convSeen
        }
      }));
      if (currentChat?.user.username === otherUser) {
        sendSeenMessage(message.sender, message.receiver);
        setCurrentChat(prev => prev ? {
          ...prev,
          unreadCount: convSeen,
          messages: [message, ...prev.messages],
          lastMessage: message
        } : undefined);
      }
    }
    else {
      fetchConversations().then(() => {
        if (currentChat?.user.username === otherUser) {
          sendSeenMessage(message.sender, message.receiver);
          setCurrentChat(prev => prev ? {
            ...prev,
            unreadCount: convSeen,
            messages: [message, ...prev.messages],
            lastMessage: message
          } : undefined);
        }
      });
    }

    
    
    setTimeout(handleScrollToBottom, 100);
  };

  const sendSeenMessage = (senderUser:string, receiverUser:string) => {
    if (senderUser === user?.username) return;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({
      type: "read_message",
      sender: senderUser,
      receiver: receiverUser
    }));
  }

  const updateUserStatus = (username: string, isOnline: boolean) => {
    if (conversations[username]) {
      setConversations(prev => ({
        ...prev,
        [username]: {
          ...prev[username],
          user: {
            ...prev[username].user,
            is_online: isOnline
          }
        }
      }));
    }
    if (currentChat?.user.username === username) {
      setCurrentChat(prev => prev ? {
        ...prev,
        user: {
          ...prev.user,
          is_online: isOnline
        }
      } : undefined);
    }
  };

  const setNewChat = (user: ChatUser) => {
    if (conversations[user.username]) {
      setCurrentChat(conversations[user.username]);
    }
    else {
      let newConversations: { [key: string]: Conversation } = {};
      newConversations[user.username] = {
        user: {
          id: user.id,
          username: user.username,
          profile_pic_url: user.profile_pic_url,
          relationship: user.relationship,
          is_online: user.is_online
        },
        messages: [],
        lastMessage: {
          message_id: 0,
          sender: user?.username || '',
          sender_id: user.id,
          receiver: user.username,
          receiver_id: user.id,
          message: '',
          timestamp: '',
          seen: false
        },
        unreadCount: 0,
      };

      setCurrentChat(newConversations[user.username]);
    }
  };

  const handleSetCurrentChat = (username: string, conversation?: Conversation, resetPage: boolean = false) => {
    if (resetPage) {
      setNextPage(null);
    }
    if (conversation) {
      setCurrentChat(conversation);
      sendSeenMessage(user.username, username);
      setConversations(prev => ({
        ...prev,
        [username]: {
          ...prev[username],
          unreadCount: 0
        }
      }));
    }
  };

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        if (event.type === "message") {
          const data = JSON.parse(event.data);
          if (data.type === "chat_message") {
            addMessage(data.message);
            setTyping(false);
            setTimeout(handleScrollToBottom, 100);
          } else if (data.type === "typing") {
            if (user.username === data.receiver && currentChat?.user.username === data.sender) {
              setTyping(true);
              setTimeout(handleScrollToBottom, 100);
            }
          } else if (data.type === "user_status")
          {
            updateUserStatus(data.username, data.is_online);
          }
           else if (data.type === "stop_typing") {
            setTyping(false);
          } else if (data.message === "You must be friends in order to chat.") {
            toast.error("You must be friends in order to chat.");
          }
        }
      };
    }
  }, [user, currentChat, ws, messageContainerRef, conversations]);

  useEffect(() => {
    setConversations({});

  }, []);


  useEffect(() => {
    if (user) {
      fetchConversations();
    }
    if (ws && ws.readyState === WebSocket.CLOSED) {
      ws.close();
      setWs(null);
    }
    const socket = new WebSocket(process.env.NEXT_PUBLIC_HOST_URL.replace('http','ws')+":8000/ws/chat/room/");
    socket.onopen = () => {
    };
    
    socket.onclose = () => {
    };
    setWs(socket);

    return () => {
      socket.close();
    };
  }, [user]);

  return (
    <ChatContext.Provider value={{
      conversations,
      currentChat,
      ws,
      typing,
      setTyping,
      searchConversations,
      setSearchConversations,
      messageContainerRef,
      setCurrentChat: handleSetCurrentChat,
      addMessage,
      setMessageContainerRef,
      updateUserStatus,
      fetchConversations,
      fetchMessages,
      setNewChat,
      handleBlockUser
    }}>
      {children}
    </ChatContext.Provider>
  );
};
