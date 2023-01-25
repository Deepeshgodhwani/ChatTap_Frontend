import React ,{ useContext,useEffect,useState }from "react";
import chatContext from "../context/chat/ChatContext";

let currentChat;
let delay=true;

export default function Chatlist(props) {
  const context = useContext(chatContext);
  const {socket}=props;
  const [groupsView, setgroupsView] = useState(false);
  

  const {
    chatroom,
    accessChat,
    accessGroupChat,
    setrecentChats,
    recentChats,
    fetchRecentChats,
    logUser,
  } = context;



  useEffect(() => {
    fetchRecentChats();
    // eslint-disable-next-line
  }, []);

 

  const hitCount = async(chatId,userId)=>{
    if( chatroom && chatId===currentChat._id) return ; 
    let token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:7000/api/chat/countMssg?type=add&chatId=${chatId}&userId=${userId}`,
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
    return data;
  }



  const updateLatestMessage=async (data) => {
    delay=false;
    let message=data.message;
    let updatedUsers=await hitCount(message.chatId._id,data.receiverId); 
    let updatedChat;
    let chats = recentChats;
    let check=true;
    chats = chats.filter((Chat) => {
      if (Chat._id === message.chatId._id) {
        Chat.latestMessage = message;
        if(updatedUsers){
          Chat.users=updatedUsers
        }
        updatedChat = Chat;
        check=false;
      }
      return Chat._id !== message.chatId._id;
    });

    if(check){
          let chat=message.chatId;
          chat.latestMessage=message;
          setrecentChats([chat,...recentChats]);
    }else{
          setrecentChats([updatedChat, ...chats]);
    }

     delay=true;
  };


  useEffect(() => {
    currentChat=chatroom;
    if (!socket ) return;
    socket.once("latest_message",updateLatestMessage) 
    
    socket.on("toggleImage",(data)=>{
      let updatedChat;
      let chats=recentChats;
      chats=chats.filter((Chat)=>{
      if(Chat._id===data.chat._id){
          Chat.profilePic=data.picture
          updatedChat=Chat;
      }
      return Chat._id!==data.chat._id;
     }); 
      setrecentChats([updatedChat,...chats])    
   });

    socket.on("toggleName",(data)=>{
      let updatedChat;
      let chats=recentChats;
      chats=chats.filter((Chat)=>{
      if(Chat._id===data.chat._id){
          Chat.chatname=data.name;
          updatedChat=Chat;
      }
      return Chat._id!==data.chat._id;
     }); 
      setrecentChats([updatedChat,...chats]);
    })
       

    return () => socket.off('latest_message',updateLatestMessage);     

  }, [chatroom,recentChats]);


  

  useEffect(() => {
    if (!socket) return;
    socket.on("created_group", (group) => {
      setrecentChats([group, ...recentChats]);
    });
  }, [recentChats]);


  const checkUser = (user, chat) => {
    if (recentChats.length) {
      if (user._id === logUser._id) {
        if (user._id === chat.users[0].user._id) {
          let string = chat.users[1].user.name;
          if (string.length > 21) {
            return string.slice(0, 21) + "..";
          }
          return string;
        } else {
          let string = chat.users[0].user.name;
          if (string.length > 21) {
            return string.slice(0, 21) + "..";
          }
          return string;
        }
      } else {
        let string = user.name;
        if (string.length > 21) {
          return string.slice(0, 21) + "..";
        }
        return string;
      }
    }
  };

  const checkUserId = (user, chat) => {
    if (recentChats.length) {
      if (user._id === logUser._id) {
        if (user._id === chat.users[0].user._id) {
          return chat.users[1].user._id;
        } else {
          return chat.users[0].user._id;
        }
      } else {
        return user._id;
      }
    }
  };

  const checkUserAvtar = (user, chat) => {
    if (recentChats.length) {
      if (user._id === logUser._id){
        if (user._id === chat.users[0].user._id) {
          return chat.users[1].user.avtar;
        } else {
          return chat.users[0].user.avtar;
        }
      } else {
        return user.avtar;
      }
    }
  };
  
  
  const checkUserName = (User) => {
    if (User._id === logUser._id) {
      return "You";
    } else {
      return User.name;
    }
  };


  const countMsgs =(members)=>{
        let mssgCount=0;
         members.forEach(member=>{
              let memberId=member.user._id.toString();
             if(memberId===logUser._id){
                  mssgCount=member.unseenMsg;
             }
         })
           

             return mssgCount;
           
  }


  const setGroupChat=(element)=>{
    if(chatroom._id !== element._id){
      accessGroupChat(element._id);
  
     setrecentChats(recentChats.map(chat=>{
           if(chat._id===element._id){
                 chat.users.map(members=>{
                     if(members.user._id===logUser._id){
                        members.unseenMsg=0;
                     }
                 })

                 return chat;
           }else{
              return chat;
           }
     }))  
     
    }
  }


  const setSingleChat=(element)=>{
     if(element._id!==chatroom._id){
       accessChat(checkUserId(element.latestMessage.sender, element));
       setrecentChats(recentChats.map(chat=>{
        if(chat._id===element._id){
              chat.users.map(members=>{
                  if(members.user._id===logUser._id){
                     members.unseenMsg=0;
                  }
              })

              return chat;
        }else{
           return chat;
        }
  })) 
     } 
  }


  const changeListView=(value)=>{
      setgroupsView(value);       
  } 


  return (
    <div className="bg-[rgb(36,36,36)]   text-white w-80 h-[100%] flex flex-col space-y-2">
      <div className="flex justify-between pb-[11px] pt-4  items-center  px-7 ">
        <div className="flex space-x-2 items-center">
      <p className="font-semibold  font-[calibri] text-3xl ">
        Messages
      </p>
        </div>
      <i  className=" text-[rgb(39,102,76)]  text-lg cursor-pointer fa-regular fa-pen-to-square"></i>
      </div>
      <div className="bg-[rgb(26,26,26)] relative justify-between py-1 px-1 mx-4 rounded-lg flex">
        <p onClick={()=>{changeListView(false)}} className={`${!groupsView?"bg-[rgb(36,36,36)]":""}  cursor-pointer  text-center rounded-md font-semibold py-1 w-[49%] `}>All</p>
        <p onClick={()=>{changeListView(true)}} className={`${groupsView?"bg-[rgb(36,36,36)]":""} font-semibold font-[calibri] cursor-pointer text-center rounded-md py-1 w-[49%] `}> Groups</p>
       </div>
      <div className=" h-[78vh] py-3 overflow-y-scroll chatBox  flex  flex-col">
        {recentChats.length > 0 && 
          recentChats.map((element) => {
            if (element.isGroupChat) {
              return (
                <div
                  key={element._id}
                  onClick={(e)=>{setGroupChat(element)}}
                  className={`flex hover:bg-[rgb(44,44,44)] cursor-pointer ${
                    element._id === chatroom._id
                      ? "bg-[rgb(27,27,27)] border-l-2  border-[rgb(36,141,97)]"
                      : "bg-[rgb(36,36,36)] "
                  } 
                      px-4   text-white `}
                >
                   <div className="flex space-x-2 py-2 w-72 relative border-b-[1px] border-[rgb(42,42,42)]">
                  <img
                    alt=""
                    className="w-12 h-12 rounded-[50%]"
                    src={element.profilePic}
                  ></img>
                  <div>
                    <div className="flex   justify-between">
                      <p className="text-base font-semibold">
                        {element.chatname.length > 25
                          ? element.chatname.slice(0, 25) + "..."
                          : element.chatname}
                      </p>
                    </div>
                    <div className="flex justify-between">
                    <p className={`${countMsgs(element.users)>0?"text-[rgb(223,223,223)]":"text-[rgb(146,145,148)]"} text-sm`}>
                      {checkUserName(element.latestMessage.sender)} {": "}
                      {element.latestMessage.content.length > 10
                        ? element.latestMessage.content.slice(0, 10) + "..."
                        : element.latestMessage.content}
                    </p>
                    </div>
                   
                  </div>
                  {countMsgs(element.users)>0&&(<p className="bg-[rgb(197,73,69)] absolute right-2 top-6 rounded-full font-bold flex justify-center 
                    items-center text-[0.7rem] h-5 w-5">
                        {countMsgs(element.users)}
                      </p>)}
                  </div>
                </div>
              );
            } else if(!groupsView) {
              if (element.latestMessage) {
                return (
                  <div
                    onClick={() => {
                       setSingleChat(element); 
                    }}
                    className={`flex ${
                      element._id === chatroom._id
                        ? "bg-[rgb(27,27,27)] border-l-2  border-[rgb(36,141,97)]"
                        : "bg-[rgb(36,36,36)] "
                    } 
                          cursor-pointer hover:bg-[rgb(44,44,44)]   px-4   text-white `}
                    key={element._id}
                  >
                     <div className="flex space-x-2 py-2 relative w-72  border-b-[1px] border-[rgb(42,42,42)]">
                    <img
                      alt=""
                      className="w-12 h-12 rounded-[50%]"
                      src={checkUserAvtar(
                        element.latestMessage.sender,
                        element
                      )}
                    ></img>
                    <div>
                      <div className="flex font-semibold  justify-between">
                        <p className="text-base">
                          {checkUser(element.latestMessage.sender, element)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                      <p className={`${countMsgs(element.users)>0?"text-white":"text-[rgb(146,145,148)]"} text-sm`}>
                      {element.latestMessage.content.length > 33
                        ? element.latestMessage.content.slice(0, 33) + "..."
                        : element.latestMessage.content}
                      </p>
                      
                      </div>
                    </div>
                    {countMsgs(element.users)>0&&<p className="bg-[rgb(197,73,69)] absolute right-2 top-6 rounded-full font-bold flex justify-center 
                       items-center text-[0.7rem] h-5 w-5">
                        {countMsgs(element.users)}
                      </p>}
                    </div>
                  </div>
                );
              } else {
                return <div key={""}></div>;
              }
            }
          })}
      </div>
    </div>
  );
}
