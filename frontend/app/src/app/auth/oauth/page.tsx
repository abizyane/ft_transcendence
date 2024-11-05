"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "components/loader/loader";

const OAuthPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
  
    useEffect(() => {
      if (!searchParams || typeof searchParams.toString !== "function") return; 
  
      const queryParams = searchParams.toString();
      const backendUrl = 'http://localhost:8000/api/42OAuth/callback';
  
      const verifyOAuth = async () => {
        try {
          const response = await fetch(`${backendUrl}?${queryParams}`, {
            method: 'GET',
          });
  
          if (response.status === 200) {
            const data = await response.json();
  
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