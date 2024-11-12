"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "components/loader/loader";

const OAuthPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
  
    useEffect(() => {
      if (!searchParams) return; 
  
      const queryParams = searchParams.toString();
      const backendUrl = 'http://localhost:8000/api/42OAuth/callback';
  
      const verifyOAuth = async () => {
        try {
          const response = await fetch(`${backendUrl}?${queryParams}`, {
            method: 'GET',
          });
  
          if (response.status === 200) {
            const data = await response.json();
            // Cookies.set('access_token', data.access, { expires: 1 }); // Expires in 1 day
            // Cookies.set('refresh_token', data.refresh, { expires: 7 }); // Expires in 7 days
  
            router.push('/dashboard');
          } else {
            const errorData = await response.json();
            router.push(`/login?error=${encodeURIComponent(errorData.message)}`);
          }
        } catch (error) {
          console.error('OAuth verification failed', error);
          router.push(`/login?error=${encodeURIComponent('OAuth verification failed')}`);
        }
      };
  
      verifyOAuth();
    }, [router, searchParams]);
  
    return (
      <>
        <Loader />
      </>
    );
  };
  
  export default OAuthPage;