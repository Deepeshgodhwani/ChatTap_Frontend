import { useState } from "react";
import ChatContext from "./ChatContext";





const ChatState = (props) => {
  const [logUser, setlogUser] = useState({});
  const [chatroom, setchatroom] = useState({});
  const [recentChats, setrecentChats] = useState([]);
  const [groupPic, setgroupPic] = useState("");
  const [groupName, setgroupName] = useState("");
  const [groupMessages, setgroupMessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [groupMembers, setgroupMembers] = useState([]);


  const accessChat = async (userId) => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:7000/api/chat/accessChat?userTwo=${userId}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );

    let data = await response.json();
    setchatroom(data);
    return data;
  };

  const accessGroupChat = async (chatId) => {
    let token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:7000/api/chat/accessGroupChat?chatId=${chatId}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );

    let data = await response.json();
    setgroupPic(data.profilePic);
    setgroupName(data.chatname);
    setchatroom(data);
    setgroupMembers(data.users);
  };

  const fetchRecentChats = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch("http://localhost:7000/api/chat/fetchChats", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    let chat = await response.json();
    setrecentChats(chat);
  };

  const createNoty = async (Id, message) => {
    let token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:7000/api/chat/message`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ noty: true, content: message, chatId: Id }),
    });

    const data = await response.json();
    return data;
  };

  return (
    <ChatContext.Provider
      value={{
        groupMessages,
        setgroupMessages,
        groupMembers,
        setgroupMembers,
        loading,
        setloading,
        setrecentChats,
        recentChats,
        fetchRecentChats,
        logUser,
        setlogUser,
        accessChat,
        chatroom,
        accessGroupChat,
        setchatroom,
        createNoty,
        setgroupPic,
        groupPic,
        setgroupName,
        groupName,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatState;
