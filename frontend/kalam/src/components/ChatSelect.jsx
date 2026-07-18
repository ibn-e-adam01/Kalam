import React from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFontAwesome, faMagnifyingGlass, faPaperPlane, faCircleUser, faCirclePlus, faUser, faArrowLeftLong} from '@fortawesome/free-solid-svg-icons';
import { Menu, MoreVertical, ListFilter } from 'lucide-react';
import {io} from 'socket.io-client'

const ChatSelect = ({socket, API, SelectedUser, FoundUsers, setFoundUsers, setSelectedUser, UserFoundID, setUserFoundID,searchUsers,setsearchUsers, searchResults, setsearchResults, RoomID, setRoomID, Search, setSearch, ChatText, setChatText}) => {



const searchUser = async () => {
   let res = await axios.get(`${API}/search`,{ 
      params: {query: Search} },
      {withCredentials: true}
    );

    let userFoundId;
    try{
    if(res?.data?.success){
      // console.log(res.data.users); //array
      setsearchResults(res.data.users);
      userFoundId = res.data.users[0]._id

    } } catch(err){
      console.error(err);
    }

    // console.log(userFoundId)
    

}

const sendUserFoundId = async () => {
    let res = await axios.get(`${API}/search`,{ 
      params: {query: Search} },
      {withCredentials: true}
    );
   
    // console.log(res.data.users);
    let foundId = res.data.users[0]._id
   
    // console.log("Found ID: ", foundId)
    
    // console.log(res.data.users[0].username);

    const clickedUser = res.data.users[0]
    setsearchUsers((prev) => { //[{}, {}, {}, [{}]]
      console.log(prev)
        if(prev.some(user => user._id == clickedUser._id)){
        return prev;
      }
      return [...prev, clickedUser]; // [[{user1 details}, {user2 details}, ...]]
    });

  let response = await axios.post(`${API}/chat`, {UserFoundID: foundId}, 
    {withCredentials: true}
  );

 

    setSearch("");
    setsearchResults([])

}

useEffect(() => {
  const getData = async () => {
  let res = await axios.get(`${API}/search`,{ 
      params: {query: Search} },
      {withCredentials: true}
    );
    console.log(res.data.users[0]);
   
    }
    getData();
}, [])

  return (

    <>
        <div className='flex flex-col items-center px-16 justify-center h-full  text-zinc-100 bg-zinc-900 w-125'>
          <div className='w-full h-full'>
            <div className='flex  justify-between items-center'>
              <Link to='/profile'>
            <FontAwesomeIcon icon={faCircleUser} className='text-zinc-100 text-4xl py-7 hover:cursor-pointer hover:scale-95 hover:text-zinc-300' />
            </Link>
            <div className='flex flex-col justify-center '>
            <h1 className='text-5xl font-extrabold serif text-[#DDDDDD] tracking-[1rem] cursor-default'>KALAM</h1>
            <h1 className='tracking-[0.26rem]'>CHAT·CONNECT·KALAM</h1>
            </div>
            <button className='hover:cursor-pointer hover:scale-95 hover:text-zinc-300' aria-label="Open Menu">
        <Menu size={30} color="#fff" />
      </button>
      </div>
        <div className='flex gap-1 hover:border-2 hover:border-zinc-700 hover:bg-zinc-950 active:border-zinc-200 active:bg-zinc-950 justify-center h-11 rounded-4xl items-center bg-zinc-800 mt-2'>
          <input onChange={(e) => {
          setSearch(e.target.value)
        }} type="search" className='h-13 w-87 md:h-10  text-zinc-100 px-7 text-2xl md:text-lg outline-none rounded-4xl' placeholder='Search Someone...' value={Search}/>
        <div className='px-3 py-3 h-11 w-12 flex items-center justify-center rounded-3xl hover:border-2 hover:border-zinc-300'>
          <Link onClick={searchUser}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className='text-zinc-100 text-2xl mt-1 hover:cursor-pointer'/>
        </Link>
        </div>
        </div>
        {searchResults?.length > 0 &&
          searchResults?.map((user) => (
        <div key={user._id} className='h-auto w-93 rounded-b-xl py-1 overflow-hidden rounded-t-xl bg-zinc-800'>
            <Link onClick={sendUserFoundId} className='w-full h-7 hover:bg-zinc-700 flex items-center px-4 gap-2'>
              <FontAwesomeIcon icon={faMagnifyingGlass} /><h1>{user?.username}</h1>
            </Link>
        </div>
        ))}
        
        
          <div className='bg-zinc-800 h-8 w-30 rounded-2xl flex  items-center justify-center mt-5'><h1 className='text-zinc-300 font-semibold text-md hover:cursor-default'>Recent Chats</h1></div>
          <h1 className='text-zinc-100 font-semibold text-sm ml-3 mt-1 hover:cursor-default'>Select a Chat:</h1>
          <div className='flex flex-wrap gap-2'>
            {searchUsers?.length > 0 && //searchUsers ---> nested array!
            searchUsers?.map((userClicked) => ( 
            //clickedUser --> [{user1}, {user2}, ...]
          <div key={userClicked._id} onClick={async () => {
            console.log(userClicked)
            //Reason: searchUsers --> nested array --> array, don't make it object!
            setFoundUsers([userClicked]);
             setSelectedUser(userClicked._id);
             setUserFoundID(userClicked._id);

             let res = await axios.post(`${API}/room`, {UserFoundID: userClicked._id}, {withCredentials: true});

             setRoomID(res.data.roomIdFound || res.data.chat._id);
            
          }} className='w-30 rounded-3xl gap-1 h-10 mt-2 hover:bg-zinc-800 hover:cursor-pointer bg-zinc-700 flex justify-start px-4 items-center'>
            <FontAwesomeIcon icon={faUser} className='text-md'/>
            <h1>{userClicked?.username}</h1>
            </div>
            ))} {searchUsers?.length === 0 && 
              <div><h1 className='text-sm ml-3 mt-4 text-zinc-300'>No Recent Chats Yet.</h1></div>
            }
            </div>
         </div>
         <div>
          <div className='flex w-full mb-19 mt-9 mr-63'>
            <button className='flex gap-1 mx-2 items-center justify-center bg-zinc-800 w-31  rounded-4xl h-9 hover:bg-zinc-950 hover:cursor-pointer'>
          <FontAwesomeIcon icon={faCirclePlus} className='text-lg'/>
          <h1 className='text-zinc-100 font-semibold text-md '>New Chat</h1>
          </button>
         
        </div>
        </div>
        
        </div>
    
    </>
  )
}

export default ChatSelect