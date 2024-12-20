import { any } from "zod";
import { getUserData } from "./user";
import { useRouter } from "next/navigation";
import { registerFormData } from "@/components/Registration/Registration";
import { cookies } from "next/headers";
import toast from "react-hot-toast";
import { customFetch } from "@/utils/customFetch";
export const handleLogin = async (
  data: FormData,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  router: NextRouter
) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/login', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    const responseData = await response.json();
    if (response.ok) {
      setErrorMessage(null);
      setSuccessMessage('Login successful.');
      toast.success('Login successful.')
      router.push(`/profile/${responseData.id}`);
    } else if (response.status === 401) {
      setErrorMessage(() => 'Invalid email or password');
      toast.error('Invalid email or password.');
    } else if (response.status === 403 && responseData.mfa_enabled) {
      router.push(`/auth/mfa`);
    }
  } catch (error) {
    setErrorMessage(() => 'An unexpected error occurred. Please try again.');
    toast.error('Login error.')
  }
};


 export const handleRegistrationSubmit = async (
    data: registerFormData,
    setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
    router: any 
  ) => {
  try {
    const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setErrorMessage(null);
      setSuccessMessage('Registration successful! Redirecting...');
      router.push('/auth/login');
    } else {
      const errorData = await response.json();
      if (response.status === 400) {
        if (errorData.email) {
          setErrorMessage('The email is already in use.');
        } else if (errorData.username) {
          setErrorMessage('The username is already taken.');
        } else {
          setErrorMessage(`Bad request: ${errorData.message}`);
        }
      } else {
        setErrorMessage(`Error: ${errorData.message}`);
      }
    }
  } catch (error) {
    toast.error('An unexpected error occurred');
    setErrorMessage('An unexpected error occurred. Please try again later.');
  }
};



export const handleLogout = async (
  router: NextRouter
) => {
  try {
    const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
   
    if (response.ok) {
      const responseData = await response.json();
      router.push('/auth/login');
    } else {
      const errorData = await response.json();
      toast.error("failed to logout");
    }
  } catch (error) {
    toast.error("failed to logout");
  }
};