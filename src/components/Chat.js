import React, { useContext } from "react";
import ChatContext from "../context/chat/ChatContext";
import GroupChat from "./GroupChat";
import SingleChat from "./SingleChat";

function Chat(props) {
  const context = useContext(ChatContext);
  const {
    toggleProfileView,
    details,
    socket,
    setenableChatlist,
    setenableChat,
  } = props;
  const { chatroom } = context;

  return (
    <>
      {chatroom.users ? (
        chatroom.isGroupChat ? (
          <GroupChat
            socket={socket}
            toggleProfileView={toggleProfileView}
            details={details}
            setenableChatlist={setenableChatlist}
            setenableChat={setenableChat}
          />
        ) : (
          <SingleChat
            socket={socket}
            toggleProfileView={toggleProfileView}
            details={details}
            setenableChatlist={setenableChatlist}
            setenableChat={setenableChat}
          />
        )
      ) : (
        <div className="w-[71%] hidden  md:flex flex-col space-y-2 bg-[rgb(46,46,46)] pt-11 xl:pt-16 items-center text-white   ">
          <div className="flex  flex-col  justify-center items-center  rounded-xl px-4  ">
            <img
              alt=""
              className=" w-[22rem]  xl:w-[30rem]"
              src={
                "https://res.cloudinary.com/dynjwlpl3/image/upload/v1674985395/Chat-app/.._hqgjqe.png"
              }
            ></img>
            <div className="flex items-center space-x-1">
              <img
                alt=""
                className="w-14 rounded-full "
                src={
                  "https://res.cloudinary.com/dynjwlpl3/image/upload/v1674985284/Chat-app/logo_rmgpil.png"
                }
              ></img>
              <div className="text-3xl flex pr-4 text-[rgb(194,194,194)] font-semibold">
                <p className="text-[rgb(79,224,165)]">Ch</p>
                <p className="text-[rgb(126,87,194)]">at</p>
                <p className="text-[rgb(254,194,0)]">Tap</p>
              </div>
            </div>
            <p className=" w-[20rem] xl:w-[26rem]  text-sm   leading-5 mt-3 text-center text-[rgb(170,170,170)]  ">
              Stay conneted with loved ones and colleagues through instant
              messaging. Enjoy the convenience and freedom of real-time
              communication anytime, anywhere.
            </p>
          </div>
          <div className="text-[rgb(170,170,170)] text-sm pt-8 xl:pt-12 items-center  flex space-x-2">
            <i className="fa-solid fa-lock"></i>
            <p>End to end encrypted</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
