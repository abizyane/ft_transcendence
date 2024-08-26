'use client';

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation

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

      if (response.ok) {
        const responseData = await response.json();
        const jwt = responseData.jwt;
        localStorage.setItem("jwt", jwt);
        console.log("Login successful");
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
  
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div className="w-full max-h-screen flex justify-center items-center">
      <div className="font-mont p-6 backdrop-blur-lg bg-gray-800 bg-opacity-10 rounded-xl shadow-lg mx-auto my-auto">
        <h2 className="text-3xl font-bold text-white">Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={`relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 outline-none bg-gray-200 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md `}
                placeholder="Email address"
              />
              {errors.email && (
                <div className="text-red-500 text-xs italic mt-1">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="pt-8">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className={`relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10`}
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
              className="purple_button bg-violet-primary"
              disabled={isSubmitting} 
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="text-center text-white mt-4">or continue with</div>
        <div className="w-full flex justify-center mt-4">
          <button
            type="button"
            className="relative flex justify-center px-10 py-2 font-medium bg-white rounded-full"
          >
            <Image
              src="https://res.cloudinary.com/dwxvnezhn/image/upload/f_auto,q_auto/v1/pics/hxangc1kyhtibnepmygf"
              alt="42 Logo"
              className="w-7 h-7"
              width={28}
              height={28}
            />
          </button>
        </div>
        <div className="text-center text-white mt-4">
          Don't have an account yet?&nbsp;
          <Link href="../auth/register" className="hover:opacity-70">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
