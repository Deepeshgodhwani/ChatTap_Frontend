import React, { useContext } from 'react'
import ChatContext from '../context/user/ChatContext';

function GroupChat() {
  const context = useContext(ChatContext);
  const {chatroom}=context;
  console.log(chatroom);
  return (
    <div className='text-white'>
        its a group chat;
    </div>
  )
}

export default GroupChat
