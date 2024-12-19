import { useState, useEffect } from 'react';
// import '@/loadEnvConfig'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Friend {
  id:number;
  username: string;
  profile_pic_url: string;
  is_online: boolean;
  xp: number;
}
interface User{
  id:number
}
export const useFriendsof = (user:User) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter ();

  
    const fetchFriendsof = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}:8000/api/friendsof/${user.id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const responseData = await response.json();
          setFriends(responseData);
        } else {
          const error = await response.json();
          toast.error("friends not found");
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        setError('Error fetching friends');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchFriendsof();
    }, []);
    return { friends, loading, error,fetchFriendsof };
  };
  export default useFriendsof;