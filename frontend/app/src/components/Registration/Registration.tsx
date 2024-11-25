'use client';

import Image from "next/image";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleRegistrationSubmit } from "@/services/auth";

const formSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmpassword: z.string()
}).refine((data) => data.password === data.confirmpassword, {
  message: 'Passwords must match',
  path: ['confirmpassword'],
});

export type registerFormData = z.infer<typeof formSchema>;

const Registration = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<registerFormData>({
    resolver: zodResolver(formSchema),
  });
  
  const router = useRouter();

  const onSubmit = (data: registerFormData) => {
    handleRegistrationSubmit(data, setSuccessMessage, setErrorMessage, router);
  };
  return (
    <div className="font-mont p-6 backdrop-blur-lg bg-gray-800/60 rounded-xl shadow-lg max-w-sm w-full">
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}
      <h2 className="text-3xl font-bold text-white mb-4">Registration</h2>
      <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div className="py-2">
            <input
              id="username"
              type="text"
              autoComplete="username"
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md"
              placeholder="Username"
              {...register('username')}
            />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          </div>
          <div className="py-2">
            <input
              id="email-address"
              type="email"
              autoComplete="email"
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md"
              placeholder="Email address"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="py-2">
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md"
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <div className="py-2">
            <input
              id="confirmpassword"
              type="password"
              autoComplete="current-password"
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md"
              placeholder="Confirm password"
              {...register('confirmpassword')}
            />
            {errors.confirmpassword && <p className="text-red-500">{errors.confirmpassword.message}</p>}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="purple_button bg-violet-primary py-2 px-4 rounded-md text-white"
          >
            Sign up
          </button>
        </div>
        <div className="text-center text-sm text-white mt-4">
          Or continue with
        </div>
        <div className="w-full flex justify-center mt-4">
        <a
  type="button"
  className="relative flex justify-center items-center w-12 h-12 bg-white rounded-full p-1"
  href="http://localhost:8000/api/42OAuth"
>
  <img
    src="https://res.cloudinary.com/dwxvnezhn/image/upload/f_auto,q_auto/v1/pics/hxangc1kyhtibnepmygf"
    alt="42 Logo"
    className="w-8 h-8 rounded-full"
    width={24}
    height={24}
  />
</a>
        </div>
        <div className="text-center text-white mt-4">
          Already have an account?&nbsp;
          <Link href="/auth/login" className="text-sm underline hover:opacity-70">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Registration;
