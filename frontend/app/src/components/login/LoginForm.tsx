'use client';

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleLogin } from "@/services/auth";


const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[!@#$+\-*%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: { email: string; password: string }) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    await handleLogin(formData,setSuccessMessage,  setErrorMessage, router);
  };

  return (
    <div className="font-mont p-6 backdrop-blur-lg bg-gray-800/30 rounded-xl shadow-lg max-w-sm w-full">
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}
        <h2 className="text-3xl font-bold text-white mb-4">Login</h2>
        <form className="mt-8 space-y-6" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={`relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 rounded-xl border ${
                  errors.email ? "border-red-500" : "border-gray-400"
                } rounded-md outline-none`}
                placeholder="Email address"
              />
              {errors.email && (
                <div className="text-red-500 text-xs italic mt-1">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="pt-6">
              <label  htmlFor="password" className="sr-only">Password</label>
              <input
                id="userPassword"
                type="password" 
                autoComplete="new-password"
                {...register("password")}
                className={`relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 rounded-xl border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Password"
              />
              {errors.password && (
                <div className="text-red-500 text-xs italic mt-1">
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="purple_button bg-violet-primary py-2 px-4 rounded-md text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-white mt-4">Or continue with</div>
        <div className="w-full flex justify-center mt-4">
        <a
        type="button"
        className="relative flex justify-center items-center w-12 h-12 bg-white rounded-full p-1"
        href={process.env.NEXT_PUBLIC_API_URL+"/api/42OAuth"}
      >
  <img
    src="/42.png"
    alt="42 Logo"
    className="w-10 h-10 rounded-full"

  />
</a>
</div>
        <div className="text-center text-white mt-4">
          Don't have an account yet?&nbsp;
          <Link href="/auth/register" className="text-sm underline hover:opacity-70">
            Register
          </Link>
        </div>
      </div>
  );
};

export default LoginForm;
