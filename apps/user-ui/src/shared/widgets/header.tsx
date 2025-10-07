import React from 'react'
import Link from 'next/link'
import {Search, User, BookHeart, ShoppingCart} from 'lucide-react';
import HeaderBottom from './header-bottom';

const Header = () => {
  return (
    <div className='w-full bg-white'>
        <div className='w-[80%] py-5 m-auto flex items-center justify-between'>
            <div>
                <Link href={'/'}>
                    <span className='text-2xl font-600'>Furever</span>
                </Link>
            </div>
            <div className='w-[50%] relative'>
                <input type="text" name="" id="" placeholder='Search for products...' className='w-full px-4 font-poppins font-medium border-[2.5px] border-[#3489ff] outline-none h-[55px]' />
                <div className='w-[60%] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489ff] absolute top-0 right-0'>
                    <Search color='fff' />
                </div>
                <div className='flex items-center gap-8'>
                    <div className="flex items-center gap-2">
                        <Link href={'/login'}>
                            <User />
                        </Link>
                    </div>
                    <Link href={'/login'}>
                    <span className='block font-medium'>Hello, </span>
                    <span className='font-semibold'>Sign In</span>
                    </Link>
                </div>
                <div className='flex items-center gap-5'>
                    <Link href={'/wishlist'} className='relative'>
                        <BookHeart />
                        <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full justify-center items-center absolute top-[-10px] right-[-10px]'><span className='text-white font-medium text-sm'>0</span></div>
                    </Link>
                    <Link href={'/cart'} className='relative'>
                        <ShoppingCart />
                        <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full justify-center items-center absolute top-[-10px] right-[-10px]'><span className='text-white font-medium text-sm'>9+</span></div>
                    </Link>
                </div>
            </div>
        </div>
        <div className='border-b border-b-slate-200'>
            <HeaderBottom />
        </div>
    </div>
  )
}

export default Header
