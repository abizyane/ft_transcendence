import { useState, useEffect } from 'react';

interface BlockedFriend {
  id:number;
  username: string;
  pic: string;
}

export const useBlockedFriends = () => {
  const [blocked, setBlocked] = useState<BlockedFriend[]>([]);
  const [blkloading, setblkLoading] = useState<boolean>(true);
  const [blkerror, setblkError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/blocked', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          setBlocked(responseData);
        } else {
          const errorData = await response.json();
          setError('Failed to load friend requests');
        }
      } catch (error) {
        setError('Error fetching friend requests');
      } finally {
        setblkLoading(false);
      }
    };

    fetchBlocked();
  }, []);

  return { blocked, blkloading, blkerror };
};
