import React from 'react'
import { useContext } from 'react';
import ChatContext from '../context/user/ChatContext';
import GroupChat from './GroupChat';
import SingleChat from './SingleChat';
function Chat(props) {
    const context = useContext(ChatContext);
    const {toggleProfileView}=props;
    const {chatroom}=context;


  return (
   <>{chatroom.users?chatroom.isGroupChat?<GroupChat  toggleProfileView={toggleProfileView} />:
   <SingleChat toggleProfileView={toggleProfileView}/>:<div></div>
    }
   </>
  )
}

export default Chat
