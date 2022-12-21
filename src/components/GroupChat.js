import React, { useContext,useEffect ,useState} from 'react'
import ChatContext from '../context/user/ChatContext'
import io from "socket.io-client";
import Loading from './Loading';

import { FormControl } from '@chakra-ui/react';
import RenderGroupMessages from './RenderGroupMessages';



const ENDPOINT="http://localhost:4000";
var socket;
var selectedChatCompare;

function GroupChat(props) {
  const context = useContext(ChatContext);
  const {toggleProfileView}=props;
  const {groupMessages,setgroupMessages,chatroom,logUser,groupPic,
    loading,recentChats,setrecentChats}=context;
  const [newMessage, setnewMessage] = useState("");
  

 
  // To estaiblish connection //

  useEffect(() => {
    const connectUser=()=>{
      if(chatroom.users){ 
        toggleProfileView(false);
        socket = io(ENDPOINT);
        socket.emit("setup",logUser);
        // socket.on("connection",()=>setSocketConnected(true));
      }
    }
    connectUser();
  },[chatroom,logUser])

  //To join room //

  useEffect(() => {
    
     selectedChatCompare=chatroom;
  }, [chatroom])


  // To send message //
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
         setgroupMessages([...groupMessages,data]);
                  let updatedChat;
                  let chats=recentChats;
                  chats=chats.filter((Chat)=>{
                       if(Chat._id===chatroom._id){
                         Chat.latestMessage=data;
                         updatedChat=Chat;
                        }
                      return Chat._id!==chatroom._id;
                  });
          setnewMessage("");
         setrecentChats([updatedChat,...chats]);
       }
  }

  // To receive message //
  useEffect(() => {
    if(!socket) return ;
    socket.on('message_recieved',(message)=>{
    
          if(!selectedChatCompare||selectedChatCompare._id!==message.chatId._id){
                //give notification
          }else{
             let updatedMessages=groupMessages;
             updatedMessages.push(message);
             setgroupMessages(updatedMessages);
          }
     })
  },[chatroom,groupMessages]); 

  return (
    <div className="bg-[rgb(27,27,27)] text-white w-[70%]" >
    <div className='flex justify-between items-center h-16 border-[1px] border-[rgb(42,42,42)] py-3 space-x-4 px-10 bg-[rgb(36,36,36)] '>
      <div className='flex space-x-4 items-center '>
      <img onClick={()=>{props.toggleProfileView(true)}} alt='' className='w-10 h-10   cursor-pointer rounded-full' src={groupPic}></img>
      <p className="cursor-pointer font-semibold" onClick={()=>{props.toggleProfileView(true)}}>{chatroom.chatname}</p>
      </div>
      <i class="border-2  cursor-pointer border-[rgb(136,136,136)] px-1  text-sm rounded-full fa-solid text-[rgb(136,136,136)] fa-ellipsis"></i>

    </div>
    <div className={`chatBox py-2 px-4  h-[77vh]`}>
    {loading&&<Loading></Loading>}
      
       {!loading&&<RenderGroupMessages messages={groupMessages} user={logUser}/>}
    </div>
    <FormControl className='bg-[rgb(36,36,36)] border-[1px] border-[rgb(42,42,42)] relative flex justify-center items-center h-[4.9rem]' onKeyDown={sendMessage}>
        <input placeholder='Your messages...' className='bg-[rgb(53,55,59)] 
         border-black w-[86%] h-12 outline-none rounded-xl py-1 px-4' type="text"
          onChange={(e)=>{setnewMessage(e.target.value)}} value={newMessage} ></input>
          <i className="fa-solid absolute text-xl right-20 text-[rgb(36,141,97)] fa-paper-plane"></i>
    </FormControl>
  </div>
  )
}

export default GroupChat
