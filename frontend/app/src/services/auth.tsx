import { any } from "zod";
import { getUserData } from "./user";
import { useRouter } from "next/navigation";
import { registerFormData } from "@/components/Registration/Registration";
import { cookies } from "next/headers";


export const handleLogin = async (
  data: FormData,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  router: NextRouter
) => {
  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      setErrorMessage(null);
      setSuccessMessage('Login successful.');
      router.push(`/profile/${responseData.id}`);
    } else {
      const errorData = await response.json();
      setErrorMessage(() => 'Invalid email or password');
    }
  } catch (error) {
    setErrorMessage(() => 'An unexpected error occurred. Please try again.');
  }
};


// register
// services/registrationSubmit.ts

// registrationHandler.ts
 export const handleRegistrationSubmit = async (
    data: registerFormData,
    setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
    router: any 
  ) => {
  try {
    const response = await fetch('http://localhost:8000/api/register', {
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
    console.error('An unexpected error occurred:', error);
    setErrorMessage('An unexpected error occurred. Please try again later.');
  }
};



export const handleLogout = async (
  router: NextRouter
) => {
  try {
    const response = await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
   
    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      router.push('/auth/login');
    } else {
      const errorData = await response.json();
      console.log(errorData);
    }
  } catch (error) {
    console.log(error);
  }
};