import React from "react";
import { useContext } from "react";
import ChatContext from "../context/user/ChatContext";
import GroupChat from "./GroupChat";
import SingleChat from "./SingleChat";
function Chat(props) {
  const context = useContext(ChatContext);
  const { toggleProfileView,details } = props;
  const { chatroom } = context;

  return (
    <>
      {chatroom.users ? (
        chatroom.isGroupChat ? (
          <GroupChat toggleProfileView={toggleProfileView} details={details}/>
        ) : (
          <SingleChat toggleProfileView={toggleProfileView} details={details} />
        )
      ) : (
        <div></div>
      )}
    </>
  );
}

export default Chat;
