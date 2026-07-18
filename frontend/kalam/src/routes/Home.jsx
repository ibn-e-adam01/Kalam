import Lottie from 'lottie-react'
import React from 'react'
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
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFontAwesome, faMagnifyingGlass, faEllipsisVertical, faVideo, faPhoneVolume, faPaperPlane, faAngleLeft, faCircleUser, faLeftLong, faCirclePlus, faPaperclip, faUser, faArrowLeftLong} from '@fortawesome/free-solid-svg-icons';
import { Menu, MoreVertical, ListFilter } from 'lucide-react';
import {io} from 'socket.io-client'
import ChatSelect from '../components/ChatSelect'
import AnimationChat from '../components/AnimationChat'
import ChatSection from '../components/ChatSection'


const Home = () => {
  const socket = io("http://localhost:3000");
  console.log("Frontend Is connected to socket!!!");
  const [Search, setSearch] = useState("");
  const [ChatText, setChatText] = useState("");
  const [SelectedUser, setSelectedUser] = useState('');
  const [searchResults, setsearchResults] = useState([]);
  const [searchUsers, setsearchUsers] = useState([]);
  const [FoundUsers, setFoundUsers] = useState([]);
  const [UserFoundID, setUserFoundID] = useState("");
  const [RoomID, setRoomID] = useState("");
  const [Chat, setChat] = useState("");
  const API = import.meta.env.VITE_BACKEND_URL;

  return (
   <>
    <div className='h-screen w-full bg-zinc-200 flex items-center justify-evenly text-zinc-100'>

      <ChatSelect socket={socket} API={API} SelectedUser={SelectedUser} Search={Search} setSearch={setSearch} ChatText={ChatText} setChatText={setChatText} searchResults={searchResults} setsearchResults={setsearchResults} searchUsers={searchUsers} setsearchUsers={setsearchUsers} UserFoundID={UserFoundID} setUserFoundID={setUserFoundID} Chat={Chat} setChat={setChat} RoomID={RoomID} setRoomID={setRoomID} setSelectedUser={setSelectedUser} FoundUsers={FoundUsers} setFoundUsers={setFoundUsers} className={`${SelectedUser? "hidden md:flex" : "flex"} w-full md:w-1/3`}/>

      {SelectedUser? <ChatSection socket={socket} Search={Search} setSearch={setSearch} ChatText={ChatText} setChatText={setChatText} searchResults={searchResults} setsearchResults={setsearchResults} searchUsers={searchUsers} setsearchUsers={setsearchUsers} UserFoundID={UserFoundID} setUserFoundID={setUserFoundID} RoomID={RoomID} setRoomID={setRoomID} SelectedUser={SelectedUser} FoundUsers={FoundUsers} setFoundUsers={setFoundUsers} Chat={Chat} setChat={setChat} setSelectedUser={setSelectedUser} className={`${SelectedUser? "flex" : "hidden md:flex"} w-full md:w-2/3`}/> : <AnimationChat />}

        
    </div>
   </>
  )
}

export default Home