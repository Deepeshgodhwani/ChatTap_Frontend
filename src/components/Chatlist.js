import React from 'react'
import { useContext } from 'react';
import { useEffect,useState } from 'react'
import chatContext from '../context/user/ChatContext';

import GroupCreation from './GroupCreation';

export default function Chatlist() {

  const context = useContext(chatContext);
  const {accessChat}=context; 
   const [chats, setchats] = useState([]);
   const [logUser, setlogUser] = useState("");
 
     
       const getChats=async()=>{
           let token =localStorage.getItem('token');
           let user=JSON.parse(localStorage.getItem('user'));
           setlogUser(user);
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
           setchats(chat);
       }
    
      useEffect(() => {
         getChats();
         // eslint-disable-next-line
      }, [])

      const checkUser=(user,chat)=>{
         
            if(chats){
              if(user._id===logUser._id){
                if(user._id===chat.users[0]._id){
                  return chat.users[1].name;
                }else{
                  return chat.users[0].name;
                }
              }else{
                return user.name;
              }
            }
      }


      const checkUserId =(user,chat)=>{
        if(chats){
          if(user._id===logUser._id){
            if(user._id===chat.users[0]._id){
              return chat.users[1]._id;
            }else{
              return chat.users[0]._id;
            }
          }else{
            return user._id;
          }
        }
      }

      
return (
    <div className='bg-[rgb(36,36,36)] text-white rounded-[5px] w-[25%] h-[100%] p-[10px] flex flex-col space-y-2'>
    <div className='flex justify-between '>
        <p className='text-[24px]'>My Chats</p>
        <GroupCreation />
    </div>
    <div className=' h-[78vh] py-4 px-1 flex space-y-2 flex-col'>
       {chats.map((element)=>{
            if(element.latestMessage){
                  if(element.isGroupChat){
                    return(<div key={element._id} className='flex cursor-pointer bg-[rgb(86,160,215)]  px-1 py-2 justify-center  rounded-lg text-white space-x-2'>
                            <p>{element.chatname}</p>
                    </div>)
                  }else{
                    return (
                      <div onClick={(()=>{accessChat(checkUserId(element.latestMessage.sender,element))})}   className='flex cursor-pointer bg-[rgb(86,160,215)] px-1 py-2 justify-center  rounded-lg text-white space-x-2' key={element._id}>
                          <p>
                            {checkUser(element.latestMessage.sender,element)}
                            </p>
                      </div>
                  )
              }    
          }else{
            return (<div key=""></div>)
          }
       })}
    </div>
</div> 
  )
}
