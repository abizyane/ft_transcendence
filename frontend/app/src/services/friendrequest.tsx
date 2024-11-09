import { useState, useEffect } from 'react';

interface FriendRequest {
  id:number;
  username: string;
  pic: string;
  xp: number;
}

export const useFriendRequests = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/friends/friend_requests', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        setRequests(responseData);
      } else {
        const errorData = await response.json();
        setError('Failed to load friend requests');
      }
    } catch (error) {
      setError('Error fetching friend requests');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, loading, error,fetchRequests };
};
