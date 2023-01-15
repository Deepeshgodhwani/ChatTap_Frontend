import React from "react";
import { useContext, useState, useEffect } from "react";
import ChatContext from "../context/user/ChatContext";
import GroupMembers from "./GroupMembers";
import { Spinner } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

function Details(props) {
  const { Profile, toggleProfileView } = props;
  const context = useContext(ChatContext);
  const [groupMembers, setgroupMembers] = useState([]);
  const [loading, setloading] = useState(false);
  const { logUser, setgroupPic,createNoty , recentChats ,setrecentChats,
    socket,chatroom,setchatroom,groupPic,setgroupName,groupName} = context;
  const [newChatName, setnewChatName] = useState("");
  const [enabled, setenabled] = useState(false);
  const toast = useToast();

  



  useEffect(() => {
       socket.on("updateUsers",members=>{
        console.log(members);
           setgroupMembers(groupMembers.concat(members));
       })
  }, [groupMembers])
  

  const changeProfile = async (e) => {
    setloading(true);
    if (
      e.target.files[0] &&
      (e.target.files[0].type === "image/jpeg" ||
        e.target.files[0] === "image/png")
    ) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("upload_preset", "chat_app");
      formData.append("cloud_name", "dynjwlpl3");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dynjwlpl3/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      let pic = await response.json();
      let picture = pic.url.toString();
      let token = localStorage.getItem("token");
      let data = await fetch(
        `http://localhost:7000/api/chat/changePic?isGroupChat=${
          Profile.isGroupChat ? true : false
        }&Id=${Profile.isGroupChat ? Profile._id : logUser._id}&pic=${picture}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      let message = await data.json();
      console.log(message);
      if (message.success) {
        setloading(false);
        setgroupPic(picture);
        setchatroom({...chatroom,profilePic:picture});
        let message="changed this group's icon";
        let noty=await createNoty(Profile._id,message);
        socket.emit("new_message",noty);
        let updatedChat;
        let chats=recentChats;
        chats=chats.filter((Chat)=>{
        if(Chat._id===noty.chatId._id){
            Chat.latestMessage=noty;
            Chat.profilePic=picture
            updatedChat=Chat;
        }
        return Chat._id!==noty.chatId._id;
      }); 
        setrecentChats([updatedChat,...chats]);
        Profile.isGroupChat && setgroupPic(picture);
        let data={chat:chatroom,picture:picture}
        socket.emit("changed_groupImage",data);
      }
      e.target.value = null;
    }
  };
  




  const exitGroup=async()=>{
    let token =localStorage.getItem('token');
    const response=await fetch(`http://localhost:7000/api/chat/removeUser?chatId=${Profile._id}&userId=${logUser._id}`,
    {
      method:'GET',
      mode:"cors" ,
      headers: {
        'Content-Type':'application/json',
        'auth-token':token
      },
    })
  
    let data=await response.json();
    let status={users:[{user:logUser._id}],status:"remove"};
    socket.emit("member_status",status);
  }


  const checkUserExist =()=>{
    let check=false;
     Profile.users.forEach(members=>{
           if(members.user._id===logUser._id){
                 check=true;
           }
          })
    return check;      
  }


  const editName=()=>{
    let input=document.getElementById("inputName");
    input.disabled=false;
    setenabled(true);
  } 


  const changeName =async ()=>{
    if(newChatName===Profile.chatname){
      toast({
        title: "Error",
        description: "it is already chatname",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }else{
      let token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7000/api/chat/changeName`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
           type:"group",
           Id:Profile._id,
           name:newChatName
        }),
      });
  
      let data = await response.json();
      let input=document.getElementById("inputName");
      input.value="";
       setgroupName(newChatName);
       setchatroom({...chatroom,chatname:newChatName});
      let message="changed the subject to "+`${newChatName}`;
      let noty=await createNoty(Profile._id,message);
      socket.emit("new_message",noty);
      // input.placeholder=newChatName;
      input.disabled=false;
      setenabled(true);
      let updatedChat;
      let chats=recentChats;
      chats=chats.filter((Chat)=>{
      if(Chat._id===noty.chatId._id){
           Chat.latestMessage=noty;
           Chat.chatname=newChatName
           updatedChat=Chat;
      }
       return Chat._id!==noty.chatId._id;
     }); 
     setrecentChats([updatedChat,...chats]);
     let send={chat:chatroom,name:newChatName};
     setnewChatName("");
     socket.emit("changed_groupName",send);
    }
  }


  return (

    
    <div className="w-96 bg-[rgb(36,36,36)] overflow-y-scroll chatBox  flex flex-col px-4 py-4">
      <div className="text-[rgb(233,233,233)] text-xl font-semibold flex justify-between ">
        <p>Profile</p>
        <i
          onClick={() => {
            toggleProfileView(false);
          }}
          className="cursor-pointer fa-solid fa-xmark"
        ></i>
      </div>
      <div className="py-2 px-2">
        <div className="flex space-y-2 mt-4 border-b-[1px] border-gray-600  py-4 flex-col items-center">
          <div className="relative flex justify-center items-center group">
            <img
              alt=""
              className="w-40 rounded-full h-40"
              src={Profile.isGroupChat?groupPic:Profile.avtar}
            ></img>
            {loading && <Spinner className="absolute" />}
            {Profile.isGroupChat&& checkUserExist()&& (
              <input
                onChange={changeProfile}
                className=" group-hover:flex hidden inputFile absolute top-0 h-40 opacity-70
           text-white rounded-full justify-center items-center  bg-black w-40"
                type="file"
              ></input>
            )}
          </div>
          <div className="flex flex-col items-center text-[rgb(233,233,233)]">
            {/* <p className="font-[calibri] text-xl "> */}
              {Profile.isGroupChat ? 
              <div className="relative">
              <input
              className="bg-transparent text-white  border-b-[1px] border-[white] py-[2x] outline-none"
              type={"text"}
              disabled
              id="inputName"
              placeholder={groupName}
              onChange={ (e)=>{setnewChatName(e.target.value)}}
              ></input> 
              {!enabled&&checkUserExist()&&<i onClick={editName} className="absolute cursor-pointer text-[rgb(87,87,87)]  right-0 fa-solid fa-pen"></i>}
                {enabled&&newChatName&&<i onClick={changeName} className="absolute cursor-pointer text-[rgb(87,87,87)]  right-0 fa-solid fa-circle-check"></i>}
              </div>
            : Profile.name}
           
            {Profile.isGroupChat && (
              <p className="text-[rgb(97,97,97)] text-sm font-semibold">
                Group • {groupMembers.length} members
              </p>
            )}
          </div>
        </div>
        {Profile.isGroupChat && (
          <GroupMembers
            Profile={Profile}
            groupMembers={groupMembers}
            setgroupMembers={setgroupMembers}
          />
        )}
        {Profile.isGroupChat&&checkUserExist()&&Profile.admin._id!==logUser._id&&<p onClick={exitGroup} className="text-white cursor-pointer">exit group</p>}
      </div>
    </div>
  );
}

export default Details;
