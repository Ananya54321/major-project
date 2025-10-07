'use client'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'; // Changed from next/router
import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

type FormData = {
    name: string,
    email: string,
    password: string
};

const Page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const startResendTimer = () =>{
    const interval = setInterval(()=>{
        setTimer((prev)=>{
            if(prev <= 1){
                clearInterval(interval);
                setCanResend(true);
                return 0;
            }
            return prev-1;
        })
    }, 1000);
  }

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        // Log the data we're sending for debugging
        console.log("Sending data:", data);
        
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`, 
          {
            name: data.name,
            email: data.email,
            password: data.password
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        console.log("Success response:", response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data);
          setServerError(error.response?.data?.message || "Registration failed. Please try again.");
        } else {
          console.error("Unknown error:", error);
          setServerError("An unexpected error occurred. Please try again.");
        }
        throw error;
      }
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error) => {
      // Error is already handled in the mutationFn
      console.log("Error in mutation:", error);
    }
  })

  const verifyOtpMutation = useMutation({
    mutationFn : async ()=>{
        if(!userData) return;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`, {
            ...userData,
            otp : otp.join(""),
        })
        return response.data;
    },
    onSuccess : ()=>{
        router.push("/login");
    }
  })

  const onSubmit = (data: FormData) => {
    console.log(data);
    signupMutation.mutate(data);

  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const resendOtp = ()=>{
    if(userData){
      signupMutation.mutate(userData);
    }
  }

  return (
    <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'> {/* Fixed bg class */}
      <h1 className='text-2xl font-bold text-center'>
        Signup
      </h1>
      <p className='text-center text-lg font-medium'>
        Home . Signup
      </p>
      <div className='w-full flex justify-center'>
        <div className='md:w-[480px] p-8 bg-white shadow rounded-sm'> {/* Fixed width */}
          <h3 className='text-xl font-semibold text-center'>Signup to furever</h3>
          <p className='text-center mt-2 mb-4'>
            Already have an account? <Link href="/login" className='text-blue-600'>Login</Link>
          </p>
          <button className='w-full flex items-center justify-center gap-2 border p-2 rounded-md mb-4'>
            <Image src="/google.svg" alt="Google icon" width={20} height={20} /> <p>Sign up with google</p>
          </button>
          <div className='flex items-center my-5 text-gray-500 text-sm'>
            <div className='flex-1 border-t'></div>
            <span className='mx-4'>OR sign in with email</span>
            <div className='flex-1 border-t'></div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label htmlFor="name" className='block text-gray-700 mb-1'>Name</label>
              <input
                type="text"
                id="name" 
                placeholder='Your full name'
                className='w-full p-2 border rounded-md'
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className='text-red-500 text-sm mt-1'>{String(errors.name.message)}</p>
              )}
            </div>

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
              <label htmlFor="password" className='block text-gray-700 mb-1'>Password</label> {/* Fixed label */}
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder='********'
                className='w-full p-2 border rounded-md'
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]{8,}$/,
                    message: "Password must contain at least one uppercase letter, one lowercase letter and one number"
                  }
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

            {!showOtp ? (
              <div className='pt-4'>
                <button 
                  type='submit' 
                  disabled= {signupMutation.isPending}
                  className='w-full text-lg cursor-pointer bg-black text-white p-3 rounded-md hover:bg-gray-800'
                >
                  {signupMutation.isPending ? "Signing up...": "Signup"}
                </button>
                {serverError && (
                  <p className='text-red-500 text-sm mt-2 text-center'>{serverError}</p>
                )}
              </div>
            ) : (
              <div className='pt-4'>
                <h3 className='text-xl text-center mb-4'>Enter OTP</h3>
                <div className='flex justify-center gap-3 mb-4'>
                  {otp.map((digit, index) => (
                    <input
                      type="text"
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      maxLength={1}
                      className='w-12 h-12 text-center text-xl border rounded-md'
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                
                <button 
                  type='button'
                  className='w-full text-lg cursor-pointer bg-black text-white p-3 rounded-md hover:bg-gray-800'
                  disabled={verifyOtpMutation.isPending}
                  onClick={()=>verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? "Verifying...": "Verify OTP"}
                </button>
                
                <div className='text-center mt-3'>
                  {canResend ? (
                    <button className='text-blue-600' type='button'>Resend OTP</button>
                  ) : (
                    <>
                        <p className='text-gray-500'>Resend OTP in {timer}s</p>
                        {
                            verifyOtpMutation?.isError && verifyOtpMutation.error instanceof AxiosError && (
                                <p>{verifyOtpMutation.error.response?.data.message || verifyOtpMutation.error.message}</p>
                            )
                        }
                    </>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page