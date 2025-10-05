import React from 'react'
import Link from 'next/link'
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
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header
