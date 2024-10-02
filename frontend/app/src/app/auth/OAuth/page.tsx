"use client"
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "components/login/LoginForm";
import Loader from "components/loader/loader";
const OAuthRedirectPage = () => {
  const router = useRouter(); // For navigation
  const searchParams = useSearchParams(); // For accessing query parameters
  useEffect(() => {
    if (!searchParams) return; // Wait until searchParams is available
    // Convert the searchParams into a query string
    const queryParams = searchParams.toString();
    // Define the backend URL you want to redirect to
    const backendUrl = 'http://localhost:8000/api/42OAuth/callback';
    // Redirect to the backend URL with the query parameters
    router.push(`${backendUrl}?${queryParams}`);
  }, [router, searchParams]);
  return (
    <>
      <Loader />
    </>
  );
};
export default OAuthRedirectPage;