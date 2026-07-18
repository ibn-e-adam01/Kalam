import React, { useRef } from 'react'
import { useEffect } from 'react'
import {easeInOut, motion, AnimatePresence} from "framer-motion"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFontAwesome, faMagnifyingGlass, faEllipsisVertical, faVideo, faPhoneVolume, faPaperPlane, faAngleLeft, faCircleUser, faLeftLong, faCirclePlus, faPaperclip, faUser, faArrowLeftLong} from '@fortawesome/free-solid-svg-icons';
import {io} from 'socket.io-client'

  

const ChatSection = ({socket, setSelectedUser, SelectedUser, UserFoundID, setUserFoundID,searchUsers,setsearchUsers,FoundUsers, setFoundUsers, searchResults, setsearchResults, RoomID, setRoomID, Chat, setChat, Search, setSearch, ChatText, setChatText, API}) => {
    const [Message, setMessage] = useState("");
    const [Status, setStatus] = useState([]);
    const [Messages, setMessages] = useState([]);
    const [User, setUser] = useState('')
    const bottomref = useRef(null)
    

    useEffect(() => {

      socket.on("connect", () => {
      socket.on("onlineUsersArray", (data) => {
      let {users} = data
      console.log("usersOnline now are: ",users)
      setStatus(users);
    })
    })
    }, [])

    const getMessages = async () => {
      let res = await axios.get(`${API}/messages/${UserFoundID}`, {
        withCredentials: true
      })

      console.log(res.data)
      setMessages(res.data)
    }


    useEffect(() => {
      if(!UserFoundID) return;
      getMessages();
    }, [UserFoundID])

    // html--> <div id= "bottom"></div>
    // js vanilla --> document.getElementById("bottom") or document.querySelector("#bottom")
   useEffect(() => {
     setMessages([]);
    getMessages();
   }, [UserFoundID])

  useEffect(() => {
     let userLoggedin;
    
    const getDataUserLoggedIn = async () => {
      let res = await axios.get(`${API}/chat`, {
        withCredentials: true
      });

      // console.log(res.data.user)
      // console.log(res.data)
      userLoggedin = res.data.user
      setUser(res.data.user)

   

    
    // console.log(userLoggedin)
    

    socket.on("connect", () => {
      if(!User) return; //if problem, check by removing this line!!!
    console.log("Frontend is connected to socket");
    socket.emit("Online_User", {
      userID: userLoggedin._id
    })
    })

    if(RoomID){
      socket.emit("join_room", RoomID);
      console.log("listener activated");
      socket.on("Recieved_Message", (data) => {
        let {Message} = data
        console.log(data);
        setMessages((prev) => [...prev, Message])
      });
  }
   }
   getDataUserLoggedIn();

        socket.off("Recieved_Message")
    
}, [RoomID]);
   

//keep an eye on this evil thing!!! --> ruins socket if not set for each new RoomID

useEffect(() => {
  bottomref.current?.scrollIntoView({
    behavior: "smooth" //behaviour(British Spelling) --> wrong!!!
  });
}, [Messages])




    const sendChatMessage = async () => {
      if(!Message.trim()){
        return;
      }

      console.log("sending message...")
       let res = await axios.post(`${API}/chat`, {Message, UserFoundID}, 
        {withCredentials: true}
       )
       if(res?.data?.success){
       console.log([res.data.message]);
       console.log([res.data.user])
       console.log([res.data.message][0].message)
       setMessages((prev) => [...prev, res.data.message]); //this is messages in chat
       }

       setMessage(""); //this message writing in input

       console.log("the roomID is: ",RoomID)
      //  console.log("the SearchUsers are: ",searchUsers);
      //  console.log("the SearchUserss username at 0th index is: ",searchUsers[0][0].username);

    
      
        console.log("THE FRONTEND GOT ROOMID IS: ",res.data.roomIdFound);
        let roomId = res.data.roomIdFound
        setRoomID(roomId);
               console.log("the roomID after setROOMID is: ",roomId)

        
        socket.emit("UserMessage", {Message: res.data.message, RoomID: roomId});


    }

  return (
    <>
    
    <div className=' bg-zinc-300 flex h-screen flex-col'>
      <div className='h-17 w-195  bg-zinc-800 flex items-center px-6 justify-between '>
        <div className='flex items-center gap-4'>
          <button onClick={() => {
            setSelectedUser(null)
          }} className='hover:text-zinc-300 hover:scale-95 hover:cursor-pointer flex items-centerflex items-center '>
        <FontAwesomeIcon icon={faAngleLeft} className='text-3xl'/>
        </button>
       
        <div className='h-11 py-2 w-45 bg-zinc-700 rounded-sm flex items-center gap-1 px-1'>
          
            {/* <FontAwesomeIcon icon={faUser} className='text-3xl'/> */}
            {FoundUsers && FoundUsers?.map((user) => (
            <div className='h-9 ml-1 w-9 mr-1 rounded-full overflow-hidden flex'>
              <img src={`${API}/uploads/${user.profilePic}`} alt="" className='object-cover' />
            </div>
            ))} 
            
            <div className='flex flex-col items-center h-3 justify-start mb-7 mr-16'>
               {FoundUsers?.map((user) => (
            <h1 className='text-md font-semibold'>{user?.username}</h1>
              ))}
        
                {Status?.includes(UserFoundID)?
            <h1 className='text-emerald-300 font-semibold text-xs'>Online</h1>
            : <h1 className='text-zinc-300 font-semibold text-xs'>Offline</h1>
              }
            </div>
          
        </div>
        
        </div>
        
        <div className='flex gap-9'>
          <button className='flex items-center hover:text-zinc-300 hover:scale-95 hover:cursor-pointer'>
          <FontAwesomeIcon icon={faPhoneVolume}  className='text-xl'/>
          </button>
          <button className='flex items-center hover:text-zinc-300 hover:scale-95 hover:cursor-pointer'>
          <FontAwesomeIcon icon={faVideo}  className='text-xl'/>
          </button>
          <button className='flex items-center hover:text-zinc-300 hover:scale-95 hover:cursor-pointer'>
          <FontAwesomeIcon icon={faEllipsisVertical} className='text-xl' />
          </button>
        </div>
      </div>

      <div className='bg-zinc-300 flex-1 overflow-y-auto py-5 px-3 items-end w-full'>
         {Messages?.length > 0 &&
            Messages?.map((msg) => (
        <div className={`flex px-6 ${msg.sender === User._id? "justify-end" : "justify-start"} mb-3`}>
            
           
            <div key={msg._id} className='h-auto max-w-[70%] px-3 py-2 w-auto bg-zinc-800 rounded-md'>
                <p>{msg.message}</p>
            </div>

            
            {/* //bottomref.current --> <div></div>  */}
        

        </div>
          ))}
          <div ref={bottomref}></div> 
      </div>
      <form action="" onSubmit={(e) => {
        e.preventDefault()
      }}>
      <div className='bg-zinc-800 px-11 h-32 flex items-center justify-center'>
            <div className='flex gap-6 items-center'>
              <FontAwesomeIcon icon={faPaperclip} className='text-2xl hover:text-emerald-200 hover:scale-95 hover:cursor-pointer'/>
            <input onChange={(e) => {
             setMessage(e.target.value)
            }} type="text" className='h-15  w-143 md:h-12 border-2 border-zinc-400 text-zinc-100 px-5 text-2xl md:text-lg outline-none rounded-4xl hover:border-emerald-200 hover:bg-zinc-950 active:border-zinc-200 active:bg-zinc-950' placeholder='Start Chatting Wisely...' value={Message}/>
            <Link onClick={sendChatMessage} className='hover:scale-95 hover:cursor-pointer'>
            <FontAwesomeIcon icon={faPaperPlane}  className='text-zinc-100 rotate-45 text-2xl hover:text-emerald-200'/>
            </Link>
            </div>
      </div>
      </form>

      </div>
    
    </>
  )
}

export default ChatSection