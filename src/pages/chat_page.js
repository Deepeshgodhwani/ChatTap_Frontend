import React,{ useEffect, useState } from 'react'
import Chatlist from '../components/Chatlist'
import Chat from '../components/Chat';
import Navbar from '../components/Navbar';
import { useHistory } from 'react-router-dom';
import Profile from '../components/Details';
import ChatContext from '../context/chat/ChatContext';
import { useContext } from 'react';
import io from "socket.io-client";
import { Spinner } from '@chakra-ui/react';
import logo from '../images/logo.png'
const ENDPOINT = "http://localhost:4000";

var socket;






function Chat_page() {

  const [profileView, setprofileView] = useState(false);
  const [details, setdetails] = useState({});
  const context = useContext(ChatContext);
  const [toggleSearch, settoggleSearch] = useState(false);
  const {chatroom,logUser,setlogUser}=context;
  const [loading, setloading] = useState(true);


 
 
    let history= useHistory();

    const redirectPage=()=>{
      if(!localStorage.getItem('token')){
        history.push('/');
      }else{
        let userInfo = JSON.parse(localStorage.getItem("user"));
        setlogUser(userInfo);
        socket=io(ENDPOINT);
        socket.emit("setup", userInfo);
      }
    }

    useEffect(() => {
        redirectPage();
        // eslint-disable-next-line
    }, [])


   const toggleLoading =()=>{
      setloading(false);
   }


    const toggleProfileView=(value)=>{
      
         if(chatroom.isGroupChat){
             setdetails(chatroom);
         }else{
         
             if(logUser._id===chatroom.users[0].user._id){
                  setdetails(chatroom.users[1].user);
             }else{
                  setdetails(chatroom.users[0].user);
             }
         }

         setprofileView(value);
         if(!value){
            setdetails({});
         }
    }

    const ToggleSearch=(value)=>{
         settoggleSearch(value);
    }

  return (
    <div onLoad={toggleLoading} className='flex h-[100vh] '>
      {loading&&
      <div className='absolute flex flex-col z-50 pt-44 bg-[rgb(26,26,26)] w-full h-[100vh] items-center '>
            <img className='w-52' alt='' src={"https://res.cloudinary.com/dynjwlpl3/image/upload/v1674985284/Chat-app/logo_rmgpil.png"}></img>
              <div className='text-4xl  text-[rgb(194,194,194)] flex font-semibold'>
                <p className='text-[rgb(79,224,165)]'>Ch</p>
                <p className='text-[rgb(126,87,194)]'>at</p>
                <p className='text-[rgb(254,194,0)]'>Tap</p> 
                </div>
                <div className='text-[rgb(170,170,170)] pt-36 items-center  flex space-x-2'> 
                <i className="fa-solid fa-lock"></i>
                <p>
                End to end encrypted
                </p>
                </div>
        </div>}
      <Navbar socket={socket} settoggleSearch={ToggleSearch} toggleSearch={toggleSearch}/>
      <Chatlist socket={socket} settoggleSearch={ToggleSearch} />
      <Chat toggleProfileView={toggleProfileView} details={profileView} socket={socket} />
      {profileView &&<Profile toggleProfileView={toggleProfileView} 
      socket={socket} Profile={details} />} 
  
  </div>
  )
}

export default Chat_page;
