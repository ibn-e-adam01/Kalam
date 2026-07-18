import React from 'react'
import Lottie from 'lottie-react'
import LoaderCat from '../assets/LoaderCat.json'
import LoaderAnimation from '../assets/Loading animation.json'
import LoadingData from '../assets/Server-bro.svg'
import process from '../assets/Processing-bro.svg'
import world from '../assets/Online world-bro.svg'
import serverImg from '../assets/Secure Server-bro.svg'
import LogoApp from '../assets/Kalam_Logo-removebg-preview.png'
import { useEffect } from 'react'
import {easeInOut, motion, AnimatePresence} from "framer-motion"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFontAwesome, faMagnifyingGlass, faPlus, faHandPointer, faPaperPlane, faCircleUser, faCirclePlus, faUser, faArrowLeftLong} from '@fortawesome/free-solid-svg-icons';
import { Menu, MoreVertical, ListFilter } from 'lucide-react';
  

const AnimationChat = () => {
    const svgs = [process, world, serverImg];
    const [Current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        
    const interval = setInterval(() => {
      setCurrent((prev) => 
        (prev + 1) % svgs.length);
      }, 4000);

      return () => {
        clearInterval(interval);
      }

    }, [])

  return (
    <>
    
    <div className='text-zinc-900 px-2'>

        </div>
        <div className='hidden md:flex items-center justify-center flex-col w-full'>
        <AnimatePresence mode="wait">
        <motion.img 
          key={Current}
          src={svgs[Current]} //svgs[0] --> process svg will run on screen
          alt=''
          className='w-96'
          initial={{opacity: 0, scale: 1}}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 1
          }}
          transition={{
            duration: 0.6,
          }}
        />
        </AnimatePresence>

        <div className='flex flex-col justify-center items-center mt-2'>
          <div className='flex items-center gap-1'>
         <FontAwesomeIcon icon={faHandPointer} className='mt-1 text-2xl text-zinc-500' /><h1 className=' text-zinc-500 text-xl font-semibold'>Choose a conversation from a left panel.</h1>
          </div>
        <h1 className='text-md font-semibold text-zinc-500'>Your messages are encrypted.</h1></div>
        </div>
    
    </>
  )
}

export default AnimationChat