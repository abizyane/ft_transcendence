import { useState, useEffect } from 'react';

interface Friend {
  id:number;
  username: string;
  profile_pic_url: string;
  xp: number;
}
interface User{
  id:number
}
export const useFriendsof = (user:User) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriendsof = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/friendsof/${user.id}`, {
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

    if (user?.id) {
      fetchFriendsof();
    }
  }, [user.id]);

  return { friends, loading, error };
};
export default useFriendsof;