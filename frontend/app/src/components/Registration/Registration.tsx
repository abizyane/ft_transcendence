'use client';

import Image from "next/image";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmpassword: z.string()
}).refine((data) => data.password === data.confirmpassword, {
  message: 'Passwords must match',
  path: ['confirmpassword'],
});

type FormData = z.infer<typeof formSchema>;

const Registration = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting...');
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            router.push('/auth/login');
          }
        }, 2000); // Delay for success message to be shown
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg max-w-sm">
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
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
        <div>
          <button
            type="submit"
            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-violet-primary rounded-xl"
          >
            Sign up
          </button>
        </div>
        <div className="text-center text-white mt-4">
          or continue with
        </div>
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
          Already have an account?&nbsp;
          <Link href="/auth/login" className="hover:opacity-70">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Registration;
