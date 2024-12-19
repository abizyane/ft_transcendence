import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/user', {credentials: 'include',});
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      toast.error('Failed to fetch user:');
    } finally {
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
