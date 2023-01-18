import React, { useEffect, useState } from 'react'
import { useContext } from 'react';


import ChatContext from '../context/user/ChatContext';

import { FormControl } from '@chakra-ui/react';
import ScrollableChat from './ScrollableChat';
import Loading from './Loading';
var selectedChatCompare;
let delay=true;


export default function SingleChat(props) {
     const {toggleProfileView}=props;
       const [messages, setmessages] = useState([]);
       const [newMessage, setnewMessage] = useState("");
       const context = useContext(ChatContext);
       const [secondUser, setsecondUser] = useState({});
       const [loading, setloading] = useState(false);
       const {logUser,chatroom,setchatroom,recentChats,setrecentChats,socket}=context;
       const [dropdown, setDropdown] = useState(false)



  // To estaiblish connection //

        useEffect(() => {
          const connectUser=()=>{
            toggleProfileView(false);
            if(chatroom.users){ 
              chatroom.users[0].user._id===logUser._id?setsecondUser(chatroom.users[1].user):setsecondUser(chatroom.users[0].user);
            }
            
          }
          connectUser();
        },[chatroom,logUser])

  //To join room //

          useEffect(() => {
            setloading(true);
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
                setloading(false);
                socket.emit('join chat',chatroom._id);
              }
             fetchMessage();
             selectedChatCompare=chatroom;
          }, [chatroom])

    
  // To send message //
       const sendMessage =async (e)=>{
         if(e.key==="Enter" && newMessage && delay){
                delay=false;
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
                  setmessages([...messages,data]);
                  let updatedChat;
                  let check=true;
                  let chats=recentChats;
                  chats=chats.filter((Chat)=>{
                  if(Chat._id===chatroom._id){
                         Chat.latestMessage=data;
                         updatedChat=Chat;
                         check=false;
                  }
                      return Chat._id!==chatroom._id;
                  });
                  setnewMessage("");
                  if(check){
                      let chat=chatroom;
                      chat.latestMessage=data;
                      setrecentChats([chat,...chats]);
                  }else{
                    setrecentChats([updatedChat,...chats]);
                  }
               }
               delay=true;
              }
                  

  // To receive message //
        useEffect(() => {
          if(!socket) return ;
          socket.on('message_recieved',(data)=>{
               let message=data.message;
                if(!selectedChatCompare||selectedChatCompare._id!==message.chatId._id){
                      //give notification
                      
                }else{
                  setmessages([...messages,message]); 
                }
                setnewMessage("");
           })
        },[chatroom,messages,recentChats]); 

        const toggleDropdown= ()=>{
          if(dropdown){
            setDropdown(false);
          }else{
              setDropdown(true);
          }
    }

       
  return (
    <>
    
      <div className="bg-[rgb(27,27,27)]  text-white w-[70%]" >
        <div className='flex items-center justify-between border-[1px] border-[rgb(42,42,42)]  h-16 py-3 space-x-4 px-10 bg-[rgb(36,36,36)] '>
          <div className='flex space-x-4 items-center ' >
          <img onClick={()=>{props.toggleProfileView(true)}} alt='' className='w-10 h-10 cursor-pointer rounded-full' src={secondUser.avtar}></img>
          <p className=' font-semibold cursor-pointer' onClick={()=>{props.toggleProfileView(true)}}>{secondUser.name}</p>
          </div>
          <div className="relative ">
              <i onClick={toggleDropdown} className="border-2  cursor-pointer border-[rgb(136,136,136)] px-1  text-sm rounded-full fa-solid text-[rgb(136,136,136)] fa-ellipsis"></i>
              {dropdown&&<div className="text-white py-2 border-[1px] border-[] right-2 w-44 top-9 bg-[rgb(36,36,36)] absolute px-4">
                   <p onClick={()=>{ setDropdown(false)
                     props.toggleProfileView(true);}} className="cursor-pointer">View details</p>
                   <p onClick={()=>{ props.toggleProfileView(false)
                     setchatroom({})}} className="cursor-pointer">Close chat</p>
              </div>}
            </div>
        </div>
        <div className={`chatBox  py-2 px-4  h-[77vh]`}>
        {loading&&<Loading></Loading>}
           {!loading&&<ScrollableChat className="" messages={messages} user={logUser}/> }
        </div>
        <FormControl className='bg-[rgb(36,36,36)] border-[1px] border-[rgb(42,42,42)] relative flex justify-center items-center h-[4.9rem]' onKeyDown={sendMessage}>
            <input placeholder='Your messages...' className='bg-[rgb(53,55,59)] 
             border-black w-[86%] h-12 outline-none rounded-xl py-1 px-4' type="text"
              onChange={(e)=>{setnewMessage(e.target.value)}} value={newMessage} ></input>
              <i className="fa-solid absolute text-xl right-20 text-[rgb(36,141,97)] fa-paper-plane"></i>
        </FormControl>
      </div>
  </>
  )

}

