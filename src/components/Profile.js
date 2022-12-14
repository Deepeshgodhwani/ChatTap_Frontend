import React from 'react'
import { useContext } from 'react';
import ChatContext from '../context/user/ChatContext';

import grpLogo from "../images/group.png";

function Profile(props) {
  const {Profile,toggleProfileView}=props;
 const context = useContext(ChatContext);
   const {logUser}=context;
  return (
    <div className='w-96 bg-[rgb(36,36,36)] flex flex-col px-4 py-4'>
      <div className='text-[rgb(233,233,233)] text-xl font-semibold flex justify-between '>
        <p >
        Profile
        </p>
        <i onClick={()=>{toggleProfileView(false)}} class="cursor-pointer fa-solid fa-xmark"></i>
        </div>
        <div className='py-2 px-2'>
         <div className='flex space-y-2 mt-4 border-b-[1px] border-gray-600  py-4 flex-col items-center'>
          <img className='w-40 rounded-full h-40' src={Profile.isGroupChat?Profile.profilePic:Profile.avtar}></img>
          <div className='flex flex-col items-center text-[rgb(233,233,233)]'>
          <p className='font-[calibri] text-xl '>{Profile.isGroupChat?Profile.chatname:Profile.name}</p>
          {Profile.isGroupChat&&<p className='text-[rgb(97,97,97)] text-sm font-semibold'>Group • {Profile.users.length} members</p>}
          </div>
        </div>
        {Profile.isGroupChat&&
        <div>
              <div className='flex py-3 space-x-2'>
                <img className='w-5 h-5' src={grpLogo}></img>
              <p className='text-[rgb(167,169,171)] font-bold'>Members</p>
              </div>
              <div className='space-y-2 py-1 text-[rgb(240,240,240)]'>
              <div className='flex relative  space-x-2 items-center'>
                    <img className='w-10 rounded-full h-10' src={Profile.admin.avtar}></img>
                    <div className='flex  '>
                    <p className=' text-sm font-semibold'>{logUser._id===Profile.admin._id?"You":Profile.admin.name}</p>
                    <p className='text-xs absolute right-0   py-[2px]  font-bold px-1 border-[1px] text-[rgb(36,141,97)] 
                    border-[rgb(36,141,97)]'>Admin</p>
                    </div>
                  </div>
                {Profile.users.map((user)=>{
                  
                   return user._id!==Profile.admin._id?(<div className='flex space-x-2 items-center'>
                    <img className='w-10 rounded-full h-10' src={user.avtar}></img>
                    <p className=' text-sm font-semibold'>{logUser._id===user._id?"You":user.name}</p>
                  </div>):(<diV></diV>)
                })}
                </div>
            </div>}
        </div>

    </div>
  )
}

export default Profile
