import React, { useContext, useEffect, useState } from "react";
import ChatContext from "../context/chat/ChatContext";
import io from "socket.io-client";
import Loading from "./Loading";

import { FormControl } from "@chakra-ui/react";
import RenderGroupMessages from "./RenderGroupMessages";



const ENDPOINT = "http://localhost:4000";
var socket;
var selectedChatCompare;
let processSend=true;
let processRecieve=true;

function GroupChat(props) {
  const context = useContext(ChatContext);
  const { toggleProfileView, details } = props;
  const {
    groupMessages,
    setgroupMessages,
    chatroom,
    setchatroom,
    groupPic,
    setgroupPic,
    logUser,
    setgroupName,
    groupName,
    loading,
    recentChats,
    setrecentChats,
    setloading
  } = context;
  const [newMessage, setnewMessage] = useState("");
  const [userExist, setuserExist] = useState(true);
  const [dropdown, setDropdown] = useState(false)

  // To estaiblish connection //

  useEffect(() => {
    const connectUser = () => {
      if (chatroom.users) {
        checkUserExist();
        toggleProfileView(false);
        socket = io(ENDPOINT);
        socket.emit("setup", logUser);
      }
    };
    connectUser();
  }, [chatroom]);

  //To join room //

  useEffect(() => {
    selectedChatCompare = chatroom;
  }, [chatroom]);

  useEffect(() => {
    const fetchMessage = async () => {
      setloading(true);
      if (!chatroom.users) return;
      let token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:7000/api/chat/fetchMessages?Id=${chatroom._id}`,
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
      setgroupMessages(data);
      setloading(false);
      socket.emit("join chat", chatroom._id);
    };
    fetchMessage();
  }, [chatroom]);
 
  // console.log(groupMessages);

  // To send message //
  const sendMessage = async (e) => {
    let condition=false;
    if(e===true){
        condition=true;
    }else{
        condition=e.key==="Enter"
    }
    if (  condition && newMessage && processSend) {
      processSend=false;
      let token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7000/api/chat/message`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ content: newMessage, chatId: chatroom._id }),
      });

      const data = await response.json();
      socket.emit("new_message", data);
      socket.emit("update_Chatlist",data);
      setgroupMessages([...groupMessages, data]);
      let updatedChat;
      let chats = recentChats;
      chats = chats.filter((Chat) => {
        if (Chat._id === chatroom._id) {
          Chat.latestMessage = data;
          updatedChat = Chat;
        }
        return Chat._id !== chatroom._id;
      });
      setnewMessage("");
      setrecentChats([updatedChat, ...chats]);
      processSend=true;
    }
  };

  // To receive message //
  if ( socket &&  processRecieve){
    socket.on("message_recieved", (data) => {
      processRecieve=false; 
      let message=data.message
     if (
       !selectedChatCompare ||
       selectedChatCompare._id !== message.chatId._id
     ) {
       //give notification
        
     } else {
       checkUserExist();
       // let ind=groupMessages.length-1;
       // if(!groupMessages||message._id!==groupMessages[ind]._id){
         setgroupMessages([...groupMessages,message])
       // }
       // console.log(message._id , " and ",groupMessages[ind]._id);
     }
     processRecieve=true;
    });
  } 




  useEffect(() => {
   
   if(!socket)return

    socket.on("groupRemoved",(status)=>{
       if(status==='add'){
          setuserExist(true);
       }else{
         setuserExist(false);
       }  
    })

      socket.on("toggleImage",(data)=>{
          setgroupPic(data.picture);
      })

    socket.on("toggleName",(data)=>{
      setgroupName(data.name);
    })
    // eslint-disable-next-line
  }, []);

  const checkUserExist =()=>{
      let check=false;
       chatroom.users.forEach(members=>{
             if(members.user._id===logUser._id){
                   check=true;
             }
            })
        setuserExist(check);     
  }


  const toggleDropdown= ()=>{
        if(dropdown){
          setDropdown(false);
        }else{
            setDropdown(true);
        }
  }



  return (
    <div className={`bg-[rgb(27,27,27)] text-white ${details?"w-[47.5%]":"w-[71%]"}`}>
      <div className="flex justify-between  items-center h-16 border-[1px] border-[rgb(42,42,42)] py-3 space-x-4 px-10 bg-[rgb(36,36,36)] ">
        <div className="flex space-x-4 items-center ">
          <img
            onClick={() => {
              props.toggleProfileView(true);
            }}
            alt=""
            className="w-10 h-10   cursor-pointer rounded-full"
            src={groupPic}
          ></img>
          <p
            className="cursor-pointer font-semibold"
            onClick={() => {
              props.toggleProfileView(true);
            }}
          >
            {groupName}
          </p>
        </div> 
            <div className="relative ">
              <i onClick={toggleDropdown} className="border-2  cursor-pointer border-[rgb(136,136,136)] px-1  text-sm rounded-full fa-solid text-[rgb(136,136,136)] fa-ellipsis"></i>
              {dropdown&&<div className="text-white  border-[1px] border-[rgb(44,44,44)] right-2 w-44 top-9 bg-[rgb(36,36,36)] absolute">
                   <p onClick={()=>{ setDropdown(false)
                     props.toggleProfileView(true);}} className="cursor-pointer hover:bg-[rgb(44,44,44)]  py-1 px-4 ">View details</p>
                   <p onClick={()=>{ props.toggleProfileView(false)
                     setchatroom({})}} className="cursor-pointer hover:bg-[rgb(44,44,44)] py-1  px-4 ">Close chat</p>
              </div>}
            </div>
        
      </div>
      <div className={`chatBox py-2 px-4  h-[77vh]`}>
        {loading && <Loading></Loading>}

        {!loading && (
          <RenderGroupMessages messages={groupMessages} user={logUser} />
        )}
      </div>
      {userExist?<FormControl
        className="bg-[rgb(36,36,36)] border-[1px] border-[rgb(42,42,42)] relative flex justify-center items-center h-[4.9rem]"
        onKeyDown={sendMessage}
      >
        <input
          placeholder="Your messages..."
          className="bg-[rgb(53,55,59)] 
         border-black w-[86%] h-12 pr-16 outline-none rounded-xl py-1 px-4"
          type="text"
          onChange={(e) => {
            setnewMessage(e.target.value);
          }}
          value={newMessage}
        ></input>
        <i onClick={(e)=>{sendMessage(true)}} className={`fa-solid absolute text-xl ${details?"right-20":"right-24"}  cursor-pointer 
         text-[rgb(36,141,97)]   fa-paper-plane`}></i>
      </FormControl>:<div className="text-[rgb(146,145,148)] text-sm border-[1px] border-[rgb(42,42,42)] flex justify-center items-center bg-[rgb(36,36,36)] mt-[14px] h-[4rem]">You can't send message to this group because you're no longer a member</div>}
    </div>
  );
}

export default GroupChat;
