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
      const backendUrl = 'http://localhost:8000/api/42OAuth/callback' ;
  
      const verifyOAuth = async () => {
        try {
          const response = await fetch(`${backendUrl}?${queryParams}`, {
            method: 'GET',
            credentials: 'include',
          });
  
          if (response.status === 200) {
            const data = await response.json();
  
            router.push(`/profile/${data.id}`);
            
          } else if (response.status === 403) {
            const data = await response.json();
            if (data.mfa_enabled) {
              router.push(`/auth/mfa`);
            }
            
          }else {
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
        <div className="h-screen justify-center items-center flex flex-col">
          <Loader />
          <p className="text-zinc-600 font-medium text-2xl md:text-4xl">
          Your adventure is about to begin
          </p>
        </div>
      </>
    );
  };
  
  export default OAuthPage;