'use client';
import Image from "next/image";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "../Logo/Logo";

const formSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[!@#$+\-*%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmpassword: z.string()
}).refine((data) => data.password === data.confirmpassword, {
  message: 'Passwords must match',
  path: ['confirmpassword'],
});

type FormData = z.infer<typeof formSchema>;

const Registration = () => {
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
        console.log('Register successful');
        window.location.href = '../auth/login';
      } else {
        console.log('Registration failed');
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <>
    
        <h2 className="max-h-screen font-mont text-xl  font-bold text-white-primary pt-4 mt-4">REGISTRATION</h2>
        <form className=" space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="py-2 ">
              <input
                id="username"
                type="text"
                autoComplete="username"
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md "
                placeholder="Username"
                {...register('username')}
                />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>
            <div className="py-2 ">
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md "
                placeholder="Email address"
                {...register('email')}
                />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="py-2 ">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md "
                placeholder="Password"
                {...register('password')}
                />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="py-2 ">
              <input
                id="confirmpassword"
                type="password"
                autoComplete="current-password"
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md "
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
          <div className="text-center text-white-primary">
            or continue with
          </div>
          <div className="w-full flex justify-center">
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
          <div className="text-center text-white-primary">
            Already have an account?&nbsp;
            <Link href="../auth/login" className="hover:opacity-70">
              Login
            </Link>
          </div>
        </form>
                </>
  );
};

export default Registration;
