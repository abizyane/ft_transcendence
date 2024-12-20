"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "components/loader/loader";
import toast from 'react-hot-toast';
import { customFetch } from "@/utils/customFetch";

const OAuthContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams || typeof searchParams.toString !== "function") return; 

    const queryParams = searchParams.toString();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL+'/api/42OAuth/callback';

    const verifyOAuth = async () => {
      try {
        const response = await customFetch(`${backendUrl}?${queryParams}`, {
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
        } else {
          const errorData = await response.json();
          router.push(`/auth/login?error=${encodeURIComponent(errorData.message)}`);
        }
      } catch (error) {
        toast.error('OAuth verification failed');
        router.push(`/auth/login?error=${encodeURIComponent('OAuth verification failed')}`);
      }
    };

    verifyOAuth();
  }, [router, searchParams]);

  return (
    <div className="h-screen justify-center items-center flex flex-col">
      <Loader />
      <p className="text-zinc-600 font-medium text-2xl md:text-4xl">
        Your adventure is about to begin
      </p>
    </div>
  );
};

const OAuthPage = () => {
  return (
    <Suspense fallback={
      <div className="h-screen justify-center items-center flex flex-col">
        <Loader />
        <p className="text-zinc-600 font-medium text-2xl md:text-4xl">
          Loading...
        </p>
      </div>
    }>
      <OAuthContent />
    </Suspense>
  );
};

export default OAuthPage;