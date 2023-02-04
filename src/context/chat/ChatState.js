import { useToast } from "@chakra-ui/react";
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
  const [chatlistLoading, setchatlistLoading] = useState(false);
  const toast = useToast();



  
  //  To fetch single chat
  const accessChat = async (userId) => {
    try {
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
    } catch (error) {
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //To fetch group chat
  const accessGroupChat = async (chatId) => {
    try {
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
    } catch (error) {
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // to fetch recent chat list
  const fetchRecentChats = async () => {
    try {
      setchatlistLoading(true);
      let token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:7000/api/chat/fetchChats",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      let chat = await response.json();
      setrecentChats(chat);
      setchatlistLoading(false);
    } catch (error) {
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // To create noty (annoucements) for the group //
  const createNoty = async (Id, message) => {
    try {
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
    } catch (error) {
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
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
        chatlistLoading,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatState;
