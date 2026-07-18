import Lottie from 'lottie-react'
import React from 'react'
import LoaderCat from '../assets/LoaderCat.json'
import LoaderAnimation from '../assets/Loading animation.json'
import ProfileData from '../assets/profile-bro.svg'
import ProfileData2 from '../assets/profile-bro2.svg'
import { useEffect } from 'react'
import {easeInOut, motion} from "framer-motion"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFontAwesome, faMagnifyingGlass, faEllipsisVertical, faVideo, faPhoneVolume, faPaperPlane, faAngleLeft, faCircleUser, faLeftLong, faCirclePlus, faPaperclip, faUser, faArrowLeftLong, faUserPlus, faHandPointer} from '@fortawesome/free-solid-svg-icons';
  


const Profile = () => {
  const [User, setUser] = useState([]);
  const [File, setFile] = useState("");
  const navigate = useNavigate();

  const formdata = new FormData();
  formdata.append("profilePicture", File); //Reason: we cannot send file data in json format to backend, it doesn't work like that, so we have to make an instance here and send it to backend using axios!!!|

  const handleLogout = async (e) =>{
    e.preventDefault();

    let res = await axios.post("http://localhost:3000/logout", {
      withCredentials: true
    });

    if(res?.data?.success){
      navigate('/login')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await axios.post("http://localhost:3000/uploads", formdata, {
      withCredentials: true
    });

    console.log(res.data.user.profilePic)
    console.log(`http://localhost:3000/uploads/${res.data.user.profilePic}`)

    getLoggedinUserData();
  }

   const getLoggedinUserData = async () => {
      let res = await axios.get("http://localhost:3000/profile",{
        withCredentials:true
      })

      console.log(res.data.user)
      setUser([res.data.user])
    }

  useEffect(() => {
      getLoggedinUserData();
  },[]);
    

  return (
   <>
    <div className='h-screen w-full bg-zinc-300 gap-3 flex'>
        <div className='flex flex-col gap-2 items-center justify-start h-full py-7 
        bg-zinc-900 w-205 px-5'>
          <div className='flex items-center justify-between w-full px-2  '>
            <Link className='hover:text-zinc-300 hover:scale-95 ' to='/chat'>
              <FontAwesomeIcon icon={faAngleLeft} className='text-3xl  text-zinc-100'/>
            </Link>
            <div className='flex items-center justify-center gap-4'>
          <div className='flex items-center justify-center flex-col'>
        <h1 className='text-4xl text-zinc-100 font-bold  tracking-[0.94rem]'>PROFILE</h1>
        <h1 className='text-zinc-100 tracking-[0.25rem] mr-3'>DEFINE·YOUR·PROFILE</h1>
        </div>
        <form action="" onSubmit={handleLogout}>
        <button className='text-zinc-100 hover:bg-[#ad1111] bg-[#bb3131] rounded-md w-auto h-auto font-semibold text-sm px-3 py-2 mb-1 cursor-pointer'>LOGOUT</button>
        </form>
        </div>
        </div>
        {User?.map((user) => (
        <div className='w-32 h-32 rounded-full flex overflow-hidden'>
          <img src={`http://localhost:3000/uploads/${user.profilePic}`} className='object-cover' alt="" />
        </div>
        ))}
        
        {User?.map((user) => (
        <h1 className='text-xl text-zinc-100 font-bold'>{user?.username}</h1>
        ))}
        <form action=""onSubmit={handleSubmit} method='post' encType="multipart/form-data" className='flex flex-col items-center justify-center gap-3'>
        <input type="file" onChange={(e) => {
          setFile(e.target.files[0])
        }} className='text-zinc-100 bg-zinc-800 w-50 pl-2 rounded-md hover:cursor-pointer'/>
        <button className='text-zinc-100 hover:bg-[#ad1111] bg-[#bb3131] rounded-md w-auto h-auto font-semibold text-sm px-3 py-1 mb-1 cursor-pointer'><FontAwesomeIcon icon={faHandPointer} className='mt-1 text-md text-zinc-100' />UPLOAD PROFILE PICTURE</button>
        </form>

        <div className='w-full flex h-28 bg-zinc-800 rounded-md items-center justify-center gap-6 px-8 py-6'>
          <div className='text-zinc-100 flex items-center justify-center flex-col gap-1'>
            <h1 className='text-xl font-semibold text-zinc-300'>Joined On</h1>
            {User?.map((user) => (
            
            <h1 className='text-lg font-normal text-zinc-100'>{(user?.createdAt).split('T')[0].split('-').reverse().join('-')}</h1>

            ))}
          </div>
          <div className='border-div h-8/10 bg-zinc-700 w-[0.3%] rounded-sm flex-col ' ></div>
          <div className='text-zinc-100 flex items-center justify-center flex-col gap-1'>
            <h1 className='text-xl font-semibold text-zinc-300'>Messages</h1>
            {User?.length > 0 && User?.map((user) => (
            <h1 className='text-lg font-normal text-zinc-100'>{user?.messages.length}</h1>
            ))} {User?.length == 0 && User?.map((user) => (
            <h1 className='text-lg font-normal text-zinc-300'>No Messages.</h1>
            ))}
          </div>
          <div className='border-div h-8/10 bg-zinc-700 w-[0.3%] rounded-sm flex-col ' ></div>
          <div className='text-zinc-100 flex items-center justify-center flex-col gap-1'>
            <h1 className='text-xl font-semibold text-zinc-300'>Last Seen</h1>
            <h1 className='text-lg font-normal text-zinc-100'>10:29 pm</h1>
          </div>

        </div>

        <Link className='bg-zinc-800 mt-3 w-auto h-auto px-3 py-2 rounded-md hover:bg-zinc-700 text-zinc-100 flex items-end justify-center gap-1'>
          <FontAwesomeIcon className='text-3xl' icon={faUserPlus} />
          <h1 className='text-xl font-semibold'>Add A Friend</h1>
        </Link>
        
        
        <Link className='text-zinc-300 mt-1 hover:text-zinc-100 hover:underline active:text-zinc-100 active:underline' to='/chat'>Contact Us! Review Our App</Link>
        </div>
      


        <div className='text-zinc-100'>

        </div>
        <div className='hidden md:flex items-center justify-center w-full'>
        <motion.img 
          src={ProfileData2}
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

export default Profile