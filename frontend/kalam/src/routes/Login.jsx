import Lottie from 'lottie-react'
import React from 'react'
import LoaderCat from '../assets/LoaderCat.json'
import LoaderAnimation from '../assets/Loading animation.json'
import LoadingData from '../assets/Server-bro.svg'
import { useEffect } from 'react'
import {easeInOut, motion} from "framer-motion"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
  


const Login = () => {

   const [Email, setEmail] = useState("");
   const [Password, setPassword] = useState("");
   const API = import.meta.env.VITE_BACKEND_URL;
 
   const navigate = useNavigate();
 
   const sendData = async (e) => {
     e.preventDefault();
   const dataLogin = {
     Email,
     Password
   }
 
   let res = await axios.post(`${API}/login`, dataLogin, {
     headers: {
       "Content-Type": "application/json"
     }, withCredentials: true
   });
    if(res?.data?.success){
       console.log(res.data);
       navigate('/chat')
     }
 }

  return (
   <>
    <div className='h-screen w-full bg-zinc-300 gap-3 flex'>
      <form action="" onSubmit={sendData}>
        <div className='flex flex-col gap-11 items-center justify-center h-full py-4 bg-zinc-900 w-125 '>
        <h1 className='text-5xl text-zinc-100 font-bold'>LOGIN</h1>
        <div className='flex flex-col gap-4'>
        
        <input onChange={(e) => {
          setEmail(e.target.value)
        }} type="email" className='h-10 w-72 border-2 border-zinc-400 text-zinc-100 text-center text-lg outline-none rounded-md hover:border-zinc-200 hover:bg-zinc-950 active:border-zinc-200 active:bg-zinc-950' placeholder='Email' value={Email}/>
        <input onChange={(e) => {
          setPassword(e.target.value)
        }} type="password" className='h-10 w-72 border-2 border-zinc-400 text-zinc-100 text-center text-lg outline-none rounded-md hover:border-zinc-200 hover:bg-zinc-950 active:border-zinc-200 active:bg-zinc-950' placeholder='Password' value={Password}/>
        </div>
        <button className='text-zinc-100 h-11 w-25 rounded-4xl bg-[#2E4540] hover:bg-[#0c5848] hover:cursor-pointer  active:bg-[#0c5848] active:cursor-pointer hover:scale-98 active:scale-98'>LOGIN</button>

        <Link className='text-zinc-300 hover:text-zinc-100 hover:underline active:text-zinc-100 active:underline' to='/'>Don't Have An Account? Sign Up</Link>
        </div>
        </form>

        <div className='text-zinc-100'>

        </div>
        <div className='hidden md:flex items-center justify-center w-full'>
        <motion.img 
          src={LoadingData}
          alt='chat illustration'
          className='w-96'
          animate={{y: [0, -12, 0]}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        </div>
    </div>
   </>
  )
}

export default Login