import { useEffect } from "react";
import { useState } from "react";
import UserContext from "./user/ChatContext";

import io from "socket.io-client";
const ENDPOINT="http://localhost:4000";
var socket;
const ChatState=(props)=>{
     const [logUser, setlogUser] = useState({})
     const [chatroom, setchatroom] = useState({});
     const [recentChats, setrecentChats] = useState([])
     const [groupPic, setgroupPic] = useState("");
    //  const [userPic, setuserPic] = useState("")
     const [groupName, setgroupName] = useState("");
     const [groupMessages, setgroupMessages] = useState([]);
  const [loading, setloading] = useState(false);



     useEffect(() => {
      let userInfo=JSON.parse(localStorage.getItem('user'));
      socket = io(ENDPOINT);
      socket.emit("setup",userInfo);
      // eslint-disable-next-line 
     }, [])


     useEffect(() => {
      const fetchMessage =async ()=>{
        setloading(true);
        if(!chatroom.users) return ;
        let token =localStorage.getItem('token');
        const response=await fetch(`http://localhost:7000/api/chat/fetchMessages?Id=${chatroom._id}`,
        {
          method:'GET',
          mode:"cors" ,
          headers: {
            'Content-Type':'application/json',
            'auth-token':token
          },
        }) 
          let data=await response.json();
          setgroupMessages(data);
          setloading(false);
          socket.emit('join chat',chatroom._id);
        }
        fetchMessage();
     }, [chatroom])
     
     


     const getUser=()=>{
        let userInfo=JSON.parse(localStorage.getItem('user'));
        setlogUser(userInfo);
     } 

     useEffect(() => { 
         getUser();
     }, [])


     const accessChat =async (userId)=>{
        let token =localStorage.getItem('token');
        const response=await fetch(`http://localhost:7000/api/chat/accessChat?userTwo=${userId}`,
        {
          method:'GET',
          mode:"cors" ,
          headers: {
            'Content-Type':'application/json',
             'auth-token':token
          },
        })
        
        let data =await response.json();

        setchatroom(data);
     }

     const accessGroupChat=async (chatId)=>{
        let token =localStorage.getItem('token');
        const response=await fetch(`http://localhost:7000/api/chat/accessGroupChat?chatId=${chatId}`,
        {
          method:'GET',
          mode:"cors" ,
          headers: {
            'Content-Type':'application/json',
             'auth-token':token
          },
        }) 
        
        let data =await response.json();
        setgroupPic(data.profilePic);
        setgroupName(data.chatname);
        setchatroom(data);
     }


     const fetchRecentChats= async ()=>{
      let token =localStorage.getItem('token');
      const response=await fetch('http://localhost:7000/api/chat/fetchChats',
      {
        method:'GET',
        mode:"cors" ,
        headers: {
          'Content-Type':'application/json',
           'auth-token':token
        },
      })
      
      let chat =await response.json();
      setrecentChats(chat);
     }

     const createNoty =async (Id,message)=>{
      let token =localStorage.getItem('token');
      const response=await fetch(`http://localhost:7000/api/chat/message`,
      {
                 method:'POST',
                 mode:"cors" ,
                 headers: {
                   'Content-Type':'application/json',
                   'auth-token':token
                 },
                 body:JSON.stringify({noty:true,content:message,chatId:Id})
       }) 
       
       const data=await response.json();
       return data;
    }
     

    return(
        <UserContext.Provider value={{groupMessages,setgroupMessages,loading,setloading,setrecentChats,recentChats,fetchRecentChats,logUser
        ,accessChat,socket,chatroom,accessGroupChat,setchatroom,createNoty,setgroupPic
        ,groupPic,setgroupName,groupName}} >
            {props.children}
        </UserContext.Provider>
    )
}


export default ChatState;