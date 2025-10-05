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
                <input type="text" name="" id="" placeholder='Search for products...' className='' />
            </div>
        </div>
      header
    </div>
  )
}

export default Header
