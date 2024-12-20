"use client"
import Logo from "@/components/Logo/Logo";
import LoginForm from "components/login/LoginForm";
import { useState } from "react";
import {useUser} from "@/services/context/usercontext";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { customFetch } from "@/utils/customFetch";

const MFAPage = () => {

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState('');

  const router = useRouter();


  const fetchUser = async () => {
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/user', {credentials: 'include',});
      if (response.ok) {
        const data = await response.json();
        router.push(`/profile/${data.id}`);

      }
    } catch (error) {
      toast.error('Failed to fetch user:');
    } finally {
    }
  };
  
  const submitOtp = async () => {
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/2fa_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: otpValue }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error( "Failed to fetch auth",data)
      }
    } catch (error) {
      toast.error('Error:');
    }
    fetchUser();
  
  }

  return (
    <>
      <div className="flex flex-col  min-h-screen">
        <Logo />
        <div className="flex-1 flex justify-center items-center overflow-hidden ">
          <div className="font-mont p-6 backdrop-blur-lg bg-gray-800/30 rounded-xl shadow-lg max-w-sm w-full">
            {successMessage && (
              <div className="text-green-500 text-center mb-4">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="text-red-500 text-center mb-4">{errorMessage}</div>
            )}
            {/* <div className="font-mont p-6 backdrop-blur-lg bg-gray-800/60  rounded-xl shadow-lg max-w-sm w-full  overflow-hidden"> */}
            <h2 className="text-3xl font-bold text-white mb-4">Two Factor Auth</h2>
              <div className="rounded-md shadow-sm">
                
                <div className="pt-6">
                  <label htmlFor="otp" className="sr-only">OTP :</label>
                  <input
                    id="otp"
                    type="text"
                    autoComplete="otp"
                    className={`relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 rounded-xl border ${
                      "border-gray-400"
                    } rounded-md outline-none`}
                    placeholder="OTP"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}>

                    </input>
                </div>
              </div>
              <div className="flex justify-center items-center mt-4">
                <button
                  type="submit"
                  className="purple_button bg-violet-primary py-2 px-4 rounded-md text-white"
                  disabled={isSubmitting}
                  onClick={submitOtp}
                >
                  Submit
                </button>
              </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default MFAPage;
