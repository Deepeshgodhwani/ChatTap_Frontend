import React from "react";
import { useContext } from "react";
import ChatContext from "../context/chat/ChatContext";
import GroupChat from "./GroupChat";
import SingleChat from "./SingleChat";
import img1 from '../images/chatting2.png'
import img2 from '../images/...png'
import logo from '../images/logo.png'


function Chat(props) {
  const context = useContext(ChatContext);
  const { toggleProfileView,details ,socket} = props;
  const { chatroom } = context;

  return (
    <>
      {chatroom.users ? (
        chatroom.isGroupChat ? (
          <GroupChat socket={socket} toggleProfileView={toggleProfileView} details={details}/>
        ) : (
          <SingleChat socket={socket} toggleProfileView={toggleProfileView} details={details} />
        )
      ) : (
        // bg-[rgb(44,44,44)] bg-[rgb(26,26,26)]
        <div className="w-[71%] flex flex-col space-y-2 bg-[rgb(46,46,46)] pt-20 items-center text-white   ">
          <div className="flex  flex-col  justify-center items-center  rounded-xl px-4  ">
             <img alt="" className="w-[30rem]" src={img2}></img> 
             <div className="flex items-center space-x-1">
              <img className="w-14 rounded-full " src={logo}></img>
             <p className="text-3xl  text-[rgb(194,194,194)] font-semibold">ChatTap</p>
             </div>
             <p className="w-[26rem]  font-semibold  leading-4 mt-3 text-center text-[rgb(170,170,170)]  ">
              Connect with friends and family in real-time,
              Chat securely with our end to end encrypted chat app.
             Protect your privacy and safeguard your messages from unwated access.
             </p>
             </div>
        </div>
      )}
    </>
  );
}

export default Chat;
