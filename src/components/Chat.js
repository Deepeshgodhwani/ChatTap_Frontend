import React, { useEffect, useState } from 'react'
import { useContext } from 'react';


import ChatContext from '../context/user/ChatContext';
import io from "socket.io-client";
import { FormControl } from '@chakra-ui/react';
import ScrollableChat from './ScrollableChat';
const ENDPOINT="http://localhost:4000";
var socket;
var selectedChatCompare;



export default function Chat() {
       const [messages, setmessages] = useState([]);
       const [newMessage, setnewMessage] = useState("");
       const context = useContext(ChatContext);
       const [SocketConnected, setSocketConnected] = useState(false);
       const {user,chatroom}=context;

       
        useEffect(() => {
          const connectUser=()=>{
            if(chatroom.users){ 
              socket = io(ENDPOINT);
              socket.emit("setup",user);
              socket.on("connection",()=>setSocketConnected(true));
            }
          }
          connectUser();
        },[chatroom])



          useEffect(() => {
            
            const fetchMessage =async ()=>{
              if(!chatroom.users) return ;
               console.log(chatroom);  
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
    {chatroom.users?
      <div className="bg-white py-2  px-2 w-[70%]" >
        <div className='flex  flex-col  h-[77vh] space-y-2 overflow-y-scroll '>
           <ScrollableChat messages={messages} user={user}/> 
        </div>
            <FormControl onKeyDown={sendMessage}>
               <input className='border-[1px] border-black w-[90%] rounded-md py-1 px-2' type="text" onChange={(e)=>{setnewMessage(e.target.value)}} value={newMessage} ></input>
            </FormControl>
      </div>:<div className='w-[60%] bg-white text-xl font-bold flex justify-center items-center'>
         <p>Do chats</p>
        </div>}
  </>
  )
  
}
