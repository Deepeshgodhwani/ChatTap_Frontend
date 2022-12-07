import React from 'react'
import { useContext } from 'react';
import ChatContext from '../context/user/ChatContext';
import GroupChat from './GroupChat';
import SingleChat from './SingleChat';
function Chat() {
    const context = useContext(ChatContext);
    const {chatroom}=context;


  return (
   <>{chatroom.users?chatroom.isGroupChat?<GroupChat/>:<SingleChat/>:<div></div>
    }
   </>
  )
}

export default Chat
