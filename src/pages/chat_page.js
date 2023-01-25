import React,{ useEffect, useState } from 'react'
import Chatlist from '../components/Chatlist'
import Chat from '../components/Chat';
import Navbar from '../components/Navbar';
import { useHistory } from 'react-router-dom';
import Profile from '../components/Details';
import ChatContext from '../context/chat/ChatContext';
import { useContext } from 'react';
import io from "socket.io-client";
const ENDPOINT = "http://localhost:4000";
var socket;






function Chat_page() {

  const [profileView, setprofileView] = useState(false);
  const [details, setdetails] = useState({});
  const context = useContext(ChatContext);
  const {chatroom,logUser,setlogUser}=context;


 
 
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

  return (
    <div className='flex h-[100vh] '>
    <Navbar socket={socket}/>
    <Chatlist socket={socket} />
    <Chat toggleProfileView={toggleProfileView} details={profileView} socket={socket} />
    {profileView &&<Profile toggleProfileView={toggleProfileView} 
    socket={socket} Profile={details} />} 
  </div>
  )
}

export default Chat_page;
