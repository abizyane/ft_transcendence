'use client';

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // Uncomment additional validation if needed
  // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  // .regex(/[!@#$+\-*%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  
  const router = useRouter(); 

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (response.ok) {
        const responseData = await response.json();
        const jwt = responseData.jwt;
        localStorage.setItem("jwt", jwt);
        console.log("Login successful");
        console.log(responseData);
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      {errorMessage && (
        <div className="w-full max-w-md bg-red-500 text-white text-center py-2 mb-4 rounded-md">
          {errorMessage}
        </div>
      )}
      <div className="font-mont p-6 backdrop-blur-lg bg-gray-800/60  rounded-xl shadow-lg max-w-sm w-full  overflow-hidden">
        <h2 className="text-3xl font-bold text-white mb-4">Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
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
        <button
  type="button"
  className="relative flex justify-center items-center w-12 h-12 bg-white rounded-full p-1"
>
  <img
    src="https://res.cloudinary.com/dwxvnezhn/image/upload/f_auto,q_auto/v1/pics/hxangc1kyhtibnepmygf"
    alt="42 Logo"
    className="w-8 h-8 rounded-full"
    width={24}
    height={24}
  />
</button>
</div>
        <div className="text-center text-white mt-4">
          Don't have an account yet?&nbsp;
          <Link href="/auth/register" className="text-sm underline hover:opacity-70">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
