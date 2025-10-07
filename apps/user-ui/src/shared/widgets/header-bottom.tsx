'use client'
import React, {useEffect, useState} from 'react'
import { navItems } from '../../configs/constants';
import Link from 'next/link';
import useUser from "../../hooks/useUser"

// NavItemTypes is defined in global.d.ts

const HeaderBottom = () => {
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const {user, isLoading} = useUser();
    
    useEffect(()=>{
        const handleScroll = () => {
            if(window.scrollY > 100){
                setIsSticky(true);
            } else setIsSticky(false);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    const toggleMenu = () => {
        setShow(!show);
    };
    
    return (
        <div className={`w-full transition-all duration-300 ${isSticky? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"}`}>
            <div className={`w-[90%] md:w-[80%] relative m-auto flex items-center justify-between ${isSticky ? "py-3" : "py-4"}`}>
                <div className={`${isSticky && '-mb-1'} cursor-pointer font-bold text-xl`}>
                    <Link href="/">PetStore</Link>
                </div>
                
                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button 
                        onClick={toggleMenu}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <span className={`block w-6 h-0.5 bg-black mb-1.5 ${show ? 'transform rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-black ${show ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-black mt-1.5 ${show ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>
                
                {/* Desktop menu */}
                <div className="hidden md:flex items-center">
                    {navItems.map((item: NavItemTypes, index: number) => (
                        <Link 
                            href={item.href} 
                            className='px-5 font-medium text-lg hover:text-blue-600 transition-colors' 
                            key={index}
                        >
                            {item.title}
                        </Link>
                    ))}
                    
                    {isLoading ? (
                        <div className="ml-5 h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                    ) : user ? (
                        <Link href="/profile" className="ml-5 p-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Profile
                        </Link>
                    ) : (
                        <Link href="/login" className="ml-5 p-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </div>
            
            {/* Mobile menu */}
            <div className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${show ? 'max-h-screen opacity-100 shadow-lg' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 py-4">
                    {navItems.map((item: NavItemTypes, index: number) => (
                        <Link 
                            href={item.href} 
                            className='block py-3 font-medium border-b border-gray-100' 
                            key={index}
                            onClick={() => setShow(false)}
                        >
                            {item.title}
                        </Link>
                    ))}
                    
                    {isLoading ? (
                        <div className="mt-4 h-10 w-32 rounded bg-gray-200 animate-pulse"></div>
                    ) : user ? (
                        <Link 
                            href="/profile" 
                            className="block mt-4 p-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => setShow(false)}
                        >
                            Profile
                        </Link>
                    ) : (
                        <Link 
                            href="/login" 
                            className="block mt-4 p-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => setShow(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HeaderBottom