import React, { useEffect, useState } from 'react'
import { useContext } from 'react';


import ChatContext from '../context/user/ChatContext';
import io from "socket.io-client";
import { FormControl } from '@chakra-ui/react';
import ScrollableChat from './ScrollableChat';
const ENDPOINT="http://localhost:4000";
var socket;
var selectedChatCompare;




export default function SingleChat() {
       const [messages, setmessages] = useState([]);
       const [newMessage, setnewMessage] = useState("");
       const context = useContext(ChatContext);
       const [secondUser, setsecondUser] = useState({});
      //  const [SocketConnected, setSocketConnected] = useState(false);
       const {user,chatroom}=context;

       
        useEffect(() => {
          const connectUser=()=>{
            if(chatroom.users){ 
              socket = io(ENDPOINT);
              socket.emit("setup",user);
              chatroom.users[0]._id===user._id?setsecondUser(chatroom.users[1]):setsecondUser(chatroom.users[0]);
              // socket.on("connection",()=>setSocketConnected(true));
            }
          }
          connectUser();
        },[chatroom])

      

          useEffect(() => {
            
            const fetchMessage =async ()=>{
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
                setmessages(data);
                socket.emit('join chat',chatroom._id);
              }
             fetchMessage();
             selectedChatCompare=chatroom;
          }, [chatroom])
      

    
    

       const sendMessage =async (e)=>{
             if(e.key==="Enter"&& newMessage){
                let token =localStorage.getItem('token');
                const response=await fetch(`http://localhost:7000/api/chat/message`,
                  {
                    method:'POST',
                    mode:"cors" ,
                    headers: {
                      'Content-Type':'application/json',
                      'auth-token':token
                    },
                    body:JSON.stringify({content:newMessage,chatId:chatroom._id})
                  }) 

                  const data=await response.json();
                  socket.emit("new_message",data);
                  console.log("sending",messages.length);
                  let updatedMessages=messages;
                  updatedMessages.push(data);
                  console.log("sending",updatedMessages.length);
                  setmessages(updatedMessages);
                  setnewMessage("");
                }
        }


        useEffect(() => {
          if(!socket) return ;
          socket.on('message_recieved',(message)=>{
                if(!selectedChatCompare||selectedChatCompare._id!==chatroom._id){
                      //give notification
                }else{
                  console.log("receiving",messages.length);
                   let updatedMessages=messages;
                   updatedMessages.push(message);
                   console.log("receiving",updatedMessages.length);
                   setmessages(updatedMessages);
                }
           })
        },[chatroom]); 

       
       
  return (
    <>
   
      <div className="bg-[rgb(27,27,27)] text-white w-[70%]" >
        <div className='flex items-center py-3 space-x-4 px-4 bg-[rgb(36,36,36)] '>
          <img alt='' className='w-10 rounded-full' src={secondUser.avtar}></img>
          <p>{secondUser.name}</p>
        </div>
        <div className={`chatBox py-2 px-4  h-[77vh]`}>
           <ScrollableChat messages={messages} user={user}/> 
        </div>
        <FormControl className='bg-[rgb(36,36,36)] relative flex justify-center items-center h-[4.9rem]' onKeyDown={sendMessage}>
            <input placeholder='Your messages...' className='bg-[rgb(53,55,59)] 
             border-black w-[86%] h-12 outline-none rounded-xl py-1 px-4' type="text"
              onChange={(e)=>{setnewMessage(e.target.value)}} value={newMessage} ></input>
              
              <i class="fa-solid absolute text-xl right-20 text-[rgb(36,141,97)] fa-paper-plane"></i>
        </FormControl>
      </div>
  </>
  )

}

