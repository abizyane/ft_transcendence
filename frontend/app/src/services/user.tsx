import { customFetch } from "@/utils/customFetch";
import toast from 'react-hot-toast';



export const getUserData = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
     toast.error('No token found');
    }
  
    const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 403) {
     toast.error('token expired');
    } 
    else if (!response.ok) {
     toast.error('Failed to fetch user data');
    }

  
    return await response.json();
  };
  