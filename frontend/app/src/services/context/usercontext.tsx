import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { customFetch } from '@/utils/customFetch';

interface User {
  id: number;
  username: string;
  email: string;
  profile_pic_url:string
  mfa_enabled: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: () => void;
  loading: boolean;
  updateProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userloading, setUserloading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/user');
      if (response && response.ok) {
        const userData = await response.json();
        setUser(userData);
        setUserloading(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUserloading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, userloading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
