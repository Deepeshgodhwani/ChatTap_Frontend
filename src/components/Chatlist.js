import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react'
import chatContext from '../context/user/ChatContext';



export default function Chatlist() {

  const context = useContext(chatContext);
  const {chatroom,accessChat,accessGroupChat,logUser,recentChats,fetchRecentChats}=context; 

  
      useEffect(() => {
        fetchRecentChats();
         // eslint-disable-next-line
      }, [])

      // const capitalize = (string) => {
      //   return string.charAt().toUpperCase() + string.slice(1);
      // };

      const checkUser=(user,chat)=>{
            if(recentChats.length){
              if(user._id===logUser._id){
                if(user._id===chat.users[0]._id){
                  let string=chat.users[1].name;
                  if(string.length>21){
                    return string.slice(0,21)+".."
                  }
                  return string;
                }else{
                    let string=chat.users[0].name
                    if(string.length>21){
                      return string.slice(0,21)+".."
                    }
                    return string;
                }
              }else{
                  let string=user.name;
                  if(string.length>21){
                    return string.slice(0,21)+".."
                  }
                  return string; 
              }
            }
      }


      const checkUserId =(user,chat)=>{
        if(recentChats.length){
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

      const checkUserAvtar =(user,chat)=>{
        if(recentChats.length){
          if(user._id===logUser._id){
            if(user._id===chat.users[0]._id){
              return chat.users[1].avtar;
            }else{
              return chat.users[0].avtar;
            }
          }else{
            return user.avtar;
          }
        }
      }


   

  

      
return (
    <div className='bg-[rgb(36,36,36)] px-4 pt-9 text-white w-[25%] h-[100%] flex flex-col space-y-2'>
    <p className='font-semibold mb-4 font-[calibri] text-3xl ml-3'>Messages</p>
    <div className='relative  ml-2 mr-4 text-[rgb(124,126,128)]'>
    <i className="fa-solid absolute top-3 left-2   fa-magnifying-glass"></i>
    <input className='border-none w-full outline-none text-white rounded-md px-4 pl-8 py-2 bg-[rgb(53,55,59)]' placeholder='Search..' type="text" name="search"></input>
    </div>
    <div className=' h-[78vh] py-4  flex space-y-2 flex-col'>
       {recentChats && recentChats.map((element)=>{
                  if(element.isGroupChat){
                    return(<div key={element._id} onClick={()=>{chatroom._id!==element._id&&accessGroupChat(element._id)}} 
                    className='flex cursor-pointer border-b-[1px] border-[rgb(42,42,42)]   px-1 py-2   rounded-lg text-white space-x-2'>
                          <img alt='' className='w-12 h-12 rounded-[50%]' src={element.profilePic}></img>
                            
                          <div>
                            <div className='flex  w-60 justify-between'>
                            <p className='text-base font-semibold'>
                            {element.chatname.length>21?element.chatname.slice(0,21)+"...":element.chatname}
                            </p>
                            <p className='text-xs text-[rgb(146,145,148)]'>Thursday</p>
                              </div>
                            <p className='text-[rgb(146,145,148)] text-sm'>{element.latestMessage.content.length>21?element.
                            latestMessage.content.slice(0,21)+"...":element.latestMessage.content}</p>
                          </div>
                            
                    </div>)
                  }else{
                    if(element.latestMessage){
                      return (
                        <div onClick={(()=>{accessChat(checkUserId(element.latestMessage.sender,element))})} 
                          className='flex cursor-pointer border-b-[1px] border-[rgb(42,42,42)]  px-1 py-2   rounded-lg text-white space-x-2' key={element._id}>
                          <img alt='' className='w-12 h-12 rounded-[50%]' src={checkUserAvtar(element.latestMessage.sender,element)}></img>
                          <div>
                            <div className='flex font-semibold w-60 justify-between'>
                            <p className='text-base'>
                            {checkUser(element.latestMessage.sender,element)}
                            </p>
                            <p className='text-xs text-[rgb(146,145,148)]'>09:38 AM</p>
                              </div>
                            <p className='text-[rgb(146,145,148)] text-sm'>{element.latestMessage.content}</p>
                          </div>
                      </div>
                  )
                }else{
                  return (<div></div>)
                }
              }    
          
       })}
    </div>
</div> 
  )
}
