import { useState, useEffect } from 'react';

interface Friend {
  username: string;
  profile_pic_url: string;
  xp: number;
}

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/friends/friends', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        setFriends(responseData);
      } else {
        const error = await response.json();
        setError('Failed to load friends');
      }
    } catch (error) {
      setError('Error fetching friends');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFriends();
  }, []);

  return { friends, loading, error ,fetchFriends };
};
