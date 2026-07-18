import Lottie from 'lottie-react'
import React from 'react'
import LoaderCat from '../assets/LoaderCat.json'
import LoaderAnimation from '../assets/Loading animation.json'
import LoadingData from '../assets/Data processing-bro.svg'
import { useEffect } from 'react'
import {easeInOut, motion} from "framer-motion"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
  


const SignUp =  () => {
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [EmailisUsed, setEmailisUsed] = useState([]);
  const [NameisUsed, setNameisUsed] = useState([]);

  const navigate = useNavigate();

  const sendData = async (e) => {
    e.preventDefault();
  const data = {
    Username,
    Email,
    Password
  }
try{
  let res = await axios.post('http://localhost:3000/', data, {
    headers: {
      "Content-Type": "application/json"
    }, withCredentials: true
  });
  
   if(res.data){
      console.log(res.data);
      navigate('/chat')
    }
    } catch(error){
      console.log("Something went wrong!")
      if(error.response){
      
      console.log("The Failed JSON response is: ", error.response.data);
      setEmailisUsed([error.response.data]);
      setNameisUsed([error.response.data]);
      }
    }
    
}

    

  return (
   <>
    <div className='h-screen w-full bg-zinc-300 gap-3 flex'>
      <form action="" onSubmit={sendData}>
        <div className='flex flex-col gap-11 items-center justify-center h-full py-4 bg-zinc-900 w-125 '>
        <h1 className='text-5xl text-zinc-100 font-bold'>SIGN UP</h1>
        <div className='flex flex-col gap-4 justify-center items-center'>
          <div className='flex items-center justify-center gap-1 flex-col'>
        <input onChange={(e) => {
          setUsername(e.target.value)
        }} type="text" className='h-10 w-72 border-2 border-zinc-400 text-zinc-100 text-center text-lg outline-none rounded-md hover:border-zinc-200 hover:bg-zinc-950 active:border-zinc-200 active:bg-zinc-950' placeholder='Username' value={Username}/>
        {NameisUsed?.map((nameUsed) => (
        <h1 key={nameUsed._id} className='text-xs text-red-400'>{nameUsed?.msg}</h1>
        ))}
        </div>
        <div className='flex gap-1 flex-col justify-center items-center'>
        <input onChange={(e) => {
          setEmail(e.target.value)
        }} type="email" className='h-10 w-72 border-2 border-zinc-400 text-zinc-100 text-center text-lg outline-none rounded-md hover:border-zinc-200 hover:bg-zinc-950 active:border-zinc-200 active:bg-zinc-950' placeholder='Email' value={Email}/>
        {EmailisUsed?.map((emailUsed) => (
        <h1 key={emailUsed._id} className='text-xs text-red-400'>{emailUsed?.message}</h1>
        ))}
        </div>
        <input onChange={(e) => {
          setPassword(e.target.value)
        }} type="password" className='h-10 w-72 border-2 border-zinc-400 text-zinc-100 text-center text-lg outline-none rounded-md hover:border-zinc-200 hover:bg-zinc-950 active:border-zinc-200 active:bg-zinc-950' placeholder='Password' value={Password}/>
        </div>
        <button className='text-zinc-100 h-11 w-25 rounded-4xl bg-[#2E4540] hover:bg-[#0c5848] hover:cursor-pointer  active:bg-[#0c5848] active:cursor-pointer hover:scale-98 active:scale-98'>SIGNUP</button>

        <Link className='text-zinc-300 hover:text-zinc-100 hover:underline active:text-zinc-100 active:underline' to='/login'>Already Have An Account? Sign In</Link>
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

export default SignUp