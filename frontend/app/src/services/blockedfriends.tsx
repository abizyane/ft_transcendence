import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface BlockedFriend {
  id:number;
  username: string;
  pic: string;
}

export const useBlockedFriends = () => {
  const [blocked, setBlocked] = useState<BlockedFriend[]>([]);
  const [blkloading, setblkLoading] = useState<boolean>(true);
  const [blkerror, setblkError] = useState<string | null>(null);

  const fetchBlocked = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/blocked', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        setBlocked(responseData);
      } else {
        const errorData = await response.json();
        toast.error('Failed to load friend blocked');
      }
    } catch (error) {
      toast.error('Error fetching friend blocked');
    } finally {
      setblkLoading(false);
    }
  };
  useEffect(() => {

    fetchBlocked();
  }, []);

  return { blocked, blkloading, blkerror,fetchBlocked };
};
