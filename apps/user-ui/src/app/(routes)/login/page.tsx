'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { set, useForm } from 'react-hook-form'
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type FormData = {
  email: string,
  password: string
};

const Page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn : async(data : FormData) =>{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`, data, {
        withCredentials : true
      });
      return response.data;
    },
    onSuccess : (data) =>{
      setServerError(null);
      router.push("/");
    },
    onError : (error : AxiosError)=>{
      const errorMessage = (error.response?.data as {message?:string})?.message || "Invalid credentials";
      setServerError(errorMessage);
    }
  })

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data)
  };

  return (
    <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'>
      <h1 className='text-2xl font-bold text-center'>
        Login
      </h1>
      <p className='text-center text-lg font-medium'>
        Home . Login
      </p>
      <div className='w-full flex justify-center'>
        <div className='md:w-[480px] p-8 bg-white shadow rounded-sm'>
          <h3 className='text-xl font-semibold text-center'>Login to furever</h3>
          <p className='text-center mt-2 mb-4'>
            Don't have an account? <Link href="/signup" className='text-blue-600'>Sign up</Link>
          </p>
          <button className='w-full flex items-center justify-center gap-2 border p-2 rounded-md mb-4'>
            <Image src="/google.svg" alt="Google icon" width={20} height={20} /> <p>Login with google</p>
          </button>
          <div className='flex items-center my-5 text-gray-500 text-sm'>
            <div className='flex-1 border-t'></div>
            <span className='mx-4'>OR login with email</span>
            <div className='flex-1 border-t'></div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label htmlFor="email" className='block text-gray-700 mb-1'>Email</label>
              <input
                type="email"
                id="email"
                placeholder='furever@gmail.com'
                className='w-full p-2 border rounded-md'
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <p className='text-red-500 text-sm mt-1'>{String(errors.email.message)}</p>
              )}
            </div>

            <div className='relative'>
              <label htmlFor="password" className='block text-gray-700 mb-1'>Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder='********'
                className='w-full p-2 border rounded-md'
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button 
                type='button' 
                className='absolute right-3 top-9 text-gray-500'
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>{String(errors.password.message)}</p>
              )}
            </div>

            <div className='flex justify-end'>
              <Link href="/forgot-password" className='text-blue-600 text-sm'>
                Forgot password?
              </Link>
            </div>

            <div className='pt-4'>
              <button 
                type='submit' 
                disabled={loginMutation.isPending}
                className='w-full text-lg cursor-pointer bg-black text-white p-3 rounded-md hover:bg-gray-800'
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </button>
              {serverError && (
                <p className='text-red-500 text-sm mt-2 text-center'>{serverError}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page