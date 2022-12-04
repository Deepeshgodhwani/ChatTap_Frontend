import React from 'react'
import { useEffect,useState } from 'react'

export default function Chatlist() {

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
           console.log(chat);
           setchats(chat);
       }
    
      useEffect(() => {
         getChats();
         // eslint-disable-next-line
      }, [])
      
      
  return (
    <div className='bg-white rounded-[5px] w-[33%] h-[100%] p-[10px] flex flex-col space-y-2'>
    <div className='flex justify-between '>
        <p className='text-[24px]'>My Chats</p>
        <p className=' border-blue-900 bg-slate-200 rounded-[5px] px-2 pt-1 font-semibold'>New Group Chat</p>
    </div>
    <div className=' h-[78vh] bg-slate-100'>
       {chats.map((element)=>{
            if(element.latestMessage){
              return (
                <div className='flex space-x-2' key={element._id}>
                <img alt='' className='w-20' src={element.latestMessage.sender.avtar}></img>
                <div className='flex flex-col space-y-1'>
                  <p>{element.latestMessage.sender.name}</p>
                  <p>{element.latestMessage}</p>
                </div>
              </div>
            )
          }else{
            return (<div></div>)
          }
       })}
    </div>
</div> 
  )
}
