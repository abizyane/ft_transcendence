import { useState, useEffect } from 'react';
import { customFetch } from '@/utils/customFetch';

interface Friend {
  id:number
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
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/friends/friends', {
        method: 'GET'
      });

      if (response && response.ok) {
        const responseData = await response.json();
        setFriends(responseData);
      } else if (response) {
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

  return { friends, loading, error, fetchFriends };
};
