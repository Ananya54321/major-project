'use client'
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react'
import { set, useForm } from 'react-hook-form'
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { error } from 'console';
import toast from 'react-hot-toast'

type FormData = {
  email: string,
  password: string
};

const Page = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""])
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const forgotPasswordMutation = useMutation({
    mutationFn : async(data : FormData) =>{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`, data, {
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

  const requestOtpMutation = useMutation({
    mutationFn : async ({email} : {email : string})=>{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`, {email});
      return response.data;
    },
    onSuccess : (_, {email}) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      startResendTimer();
    },
    onError : (error : AxiosError) => {
      const errorMessage = (error.response?.data as {message? : string})?.message || "Invalid OTP. Please try again!";
      setServerError(errorMessage)
    }
  })

  const verifyOtpMutation = useMutation({
    mutationFn : async () => {
      if(!userEmail) return;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`, {email : userEmail, otp : otp.join("")});
      return response.data;
    },
    onSuccess : ()=> {
      setStep("reset");
      setServerError(null);
    },
    onError : (error : AxiosError) => {
      const errorMessage = (error.response?.data as {message? : string})?.message || "Invalid OTP. Please try again!";
      setServerError(errorMessage)
    }
  })

  const resetPasswordMutation = useMutation({
    mutationFn : async ({password}: {password : string}) => {
      if(!password) return;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`, {email : userEmail, newPassword : password});
      return response.data;
    },
    onSuccess : ()=> {
      setStep("email");
      toast.success("Password reset successfully! Please login with your new password.");
      setServerError(null);
      router.push("/login");
    },
    onError : (error : AxiosError) => {
      const errorMessage = (error.response?.data as {message? : string})?.message || "Invalid OTP. Please try again!";
      setServerError(errorMessage)
    }
  })

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
  
  const onSubmitEmail = ({email} : {email : string}) => {
    requestOtpMutation.mutate({email});
  }
  const onSubmitPassword  = ({password} : {password : string}) => {
    resetPasswordMutation.mutate({password});
  }

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


  const onSubmit = (data: FormData) => {
    forgotPasswordMutation.mutate(data)
  };

  return (
    <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'>
      <h1 className='text-2xl font-bold text-center'>
        Login
      </h1>
      <p className='text-center text-lg font-medium'>
        Home . Forgot Password
      </p>
      <div className='w-full flex justify-center'>
        <div className='md:w-[480px] p-8 bg-white shadow rounded-sm'>
          {step === "email" && (
            <>
            <h3 className='text-xl font-semibold text-center'>Login to furever</h3>
          <p className='text-center mt-2 mb-4'>
            Go back to <Link href="/signup" className='text-blue-600'>Login</Link>
          </p>
          
          <form onSubmit={handleSubmit(onSubmitEmail)} className='space-y-4'>
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

            <div className='pt-4'>
              <button 
                type='submit' 
                disabled={requestOtpMutation.isPending}
                className='w-full text-lg cursor-pointer bg-black text-white p-3 rounded-md hover:bg-gray-800'
              >
                {requestOtpMutation.isPending ? "Submitting..." : "Submit"}
              </button>
              {serverError && (
                <p className='text-red-500 text-sm mt-2 text-center'>{serverError}</p>
              )}
            </div>
          </form>
            </>
          )}
          {step === "otp" && (
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
                              <p>{((verifyOtpMutation.error as AxiosError).response?.data as { message?: string })?.message || (verifyOtpMutation.error as Error).message}</p>
                          )
                      }
                  </>
                )}
              </div>
            </div>
          )}
          {step === "reset" && (
            <>
            <h3 className='text-xl font-semibold text-center'>Login to furever</h3>
          <p className='text-center mt-2 mb-4'>
            Go back to <Link href="/signup" className='text-blue-600'>Login</Link>
          </p>
          
          <form onSubmit={handleSubmit(onSubmitPassword)} className='space-y-4'>
            <div>
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

            <div className='pt-4'>
              <button 
                type='submit' 
                disabled={resetPasswordMutation.isPending}
                className='w-full text-lg cursor-pointer bg-black text-white p-3 rounded-md hover:bg-gray-800'
              >
                {resetPasswordMutation.isPending ? "Submitting..." : "Submit"}
              </button>
              {serverError && (
                <p className='text-red-500 text-sm mt-2 text-center'>{serverError}</p>
              )}
            </div>
          </form>
            </>
          )}
          
        </div>
      </div>
    </div>
  )
}

export default Page