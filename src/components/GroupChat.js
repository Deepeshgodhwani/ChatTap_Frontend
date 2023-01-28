import React, { useContext, useEffect, useState } from "react";
import ChatContext from "../context/chat/ChatContext";
import Loading from "./Loading";

import {  FormControl,useDisclosure } from "@chakra-ui/react";
import RenderGroupMessages from "./RenderGroupMessages";
import MessageContext from "../context/messages/MessageContext";
import {
  Popover,
  PopoverContent,
} from '@chakra-ui/react'



// const ENDPOINT = "http://localhost:4000";
// var socket;
var selectedChatCompare;
let processSend=true;
let processRecieve=true;


function GroupChat(props) {
  const context = useContext(ChatContext);
  const msgContext = useContext(MessageContext);
  const { toggleProfileView, details ,socket} = props;
  const [isTyping, setisTyping] = useState(false);
  const [TypingUser, setTypingUser] = useState([]);
  const { onOpen, onClose, isOpen } = useDisclosure()
  

  const {
    groupMessages,
    setgroupMessages,
    groupMembers,
    setgroupMembers,
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
    setloading,
  } = context;

  const {encryptData}=msgContext;
  const [newMessage, setnewMessage] = useState("");
  const [userExist, setuserExist] = useState(true);
  const [dropdown, setDropdown] = useState(false)

  // To estaiblish connection //


  useEffect(() => {
    const connectUser = () => {
      if (chatroom.users) {
        toggleProfileView(false);
        setisTyping(false);
      }

       return ()=>{ 
          socket.emit("toggleTyping",{chat:chatroom,status:false,user:logUser})  
        };
    };
    connectUser();
    document.title=`ChatTap • ${chatroom.chatname}`
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
    };
    fetchMessage();
  }, [chatroom]);
 


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
      socket.emit("toggleTyping",{chat:chatroom,status:false,user:logUser})
      let encryptedMessage= encryptData(newMessage);
      let token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7000/api/chat/message`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ content: encryptedMessage, chatId: chatroom._id }),
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
      //  checkUserExist();
         setgroupMessages([...groupMessages,message])
     }
     processRecieve=true;
    });
  } 


 const updateUserExist =(data)=>{
  if(data.chat._id===selectedChatCompare._id){
    if(data.status==='add'){
      setuserExist(true);
    }else{
      setuserExist(false);
    }  
   }
  }



  const isTypingUser =data=>{
    if(data.chat._id===chatroom._id){
      if(data.status){
        setisTyping(true)
        setTypingUser(data.user)
      }else{
          setisTyping(false);
          setTypingUser([]);
      }
    }
  }


  useEffect(() => {
   
   if(!socket)return

    socket.on("groupRemoved",updateUserExist)

      socket.on("toggleImage",(data)=>{
        console.log(data.chat._id," and ",selectedChatCompare._id);
         if(data.chat._id===selectedChatCompare._id){
           setgroupPic(data.picture);
         }
      })

    socket.on("toggleName",(data)=>{
      if(data.chat._id===selectedChatCompare._id){
        setgroupName(data.name);
      } 
    })

    socket.on('isTyping',isTypingUser);
     
    return ()=>{socket.off('isTyping')}

  }, [chatroom]);


  useEffect(() => {      
    let check=false;
       groupMembers.forEach(members=>{
             if(members.user._id===logUser._id){
                   check=true;
             }
            })
        setuserExist(check);     
     
  }, [groupMembers])
  

  const updateUsers=data=>{
    console.log(data.group._id," and ",selectedChatCompare._id)
    console.log(data.members);
    if(data.group._id===selectedChatCompare._id ){
        data.status==="add"?setgroupMembers(groupMembers.concat(data.members)):
         setgroupMembers(groupMembers.filter((member)=>{
         return member.user._id!==data.members._id;
     }));
    }
  }

  


   useEffect(() => {
    if(!socket) return ;
    socket.on("updateUsers",updateUsers);

    return ()=>{socket.off("updateUsers",updateUsers)};

     // eslint-disable-next-line
   }, [])


  const toggleDropdown= ()=>{
        if(dropdown){
         onClose();
          setDropdown(false);
        }else{
          onOpen();
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
           
           <div className="-space-y-1">
          <p
            className="cursor-pointer font-semibold"
            onClick={() => {
              props.toggleProfileView(true);
            }}
            >
            {groupName}
          </p>
          {isTyping&&<div className="flex text-sm space-x-2">
            <p className="text-[rgb(150,150,150)] font-semibold">{TypingUser.name} :</p>
             <p className="text-[rgb(36,141,97)]">Typing ...</p>
          </div>}
            </div>
        </div> 
            <Popover isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}>              
                  <i onClick={toggleDropdown}  className="border-2  cursor-pointer border-[rgb(136,136,136)] px-1  text-sm rounded-full fa-solid text-[rgb(136,136,136)] fa-ellipsis"></i>
                  <PopoverContent className='focus:outline-none' marginRight={"12"} 
                  bg={"rgb(49,49,49)"} outline="none" textAlign={"center"} borderColor={"rgb(75,75,75)"} width={"40"} >
                  <p onClick={()=>{
                    onClose()
                    props.toggleProfileView(true)}} className=' border-[rgb(75,75,75)] cursor-pointer hover:bg-[rgb(58,58,58)]  border-b-[1px] py-1 '>View details</p>
                  <p onClick={()=>{ props.toggleProfileView(false)
                    document.title="ChatTap"
                     setchatroom({})}}  className='hover:bg-[rgb(58,58,58)]  cursor-pointer py-1'>Close chat</p> 
                </PopoverContent>
           </Popover>
        
      </div>
      <div className={`chatBox py-2 px-4  h-[77vh]`}>
        {loading && <Loading></Loading>}

        {!loading && (
          <RenderGroupMessages details={details} socket={socket} messages={groupMessages} user={logUser} />
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
            socket.emit("toggleTyping",{chat:chatroom,status:e.target.value?true:false,user:logUser})
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
