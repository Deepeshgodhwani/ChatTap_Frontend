import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import chatContext from "../context/user/ChatContext";

export default function Chatlist() {
  const context = useContext(chatContext);
  const {
    chatroom,
    accessChat,
    accessGroupChat,
    logUser,
    setrecentChats,
    recentChats,
    fetchRecentChats,
    socket,
  } = context;

  useEffect(() => {
    fetchRecentChats();
    // eslint-disable-next-line
  }, []);




  const hitCount =async(message,userId)=>{
    let token = localStorage.getItem("token");
    let data = await fetch(
      `http://localhost:7000/api/chat/countMssg?type=addCount&chatId=${message.chatId._id}&userId=${userId}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );

    let users = await data.json();
    console.log(users);
    return users;
  }



  useEffect(() => {
    if (!socket) return;
    socket.on("message_recieved", async (data) => {
      let message=data.message;
       let updatedUsers=[];
      if(chatroom){
        if(chatroom._id!=message.chatId._id){
          updatedUsers=await hitCount(message,data.receiverId);
          console.log(updatedUsers);
        }
      }

      let updatedChat;
      let chats = recentChats;
      let check=true;
      chats = chats.filter((Chat) => {
        if (Chat._id === message.chatId._id) {
          Chat.latestMessage = message;
          updatedChat = Chat;
          check=false;
          Chat.users=updatedUsers
        }
        return Chat._id !== message.chatId._id;
      });

      if(check){
        setrecentChats([message.chatId,...recentChats]);
      }else{
        setrecentChats([updatedChat, ...chats]);
      }
    });
  }, [recentChats]);

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
         members.map(member=>{
              let memberId=member.user._id.toString();
             if(memberId===logUser._id){
                  mssgCount=member.unseenMsg;
             }
         })

         return mssgCount;
  }


  return (
    <div className="bg-[rgb(36,36,36)]  pt-9 text-white w-[25%] h-[100%] flex flex-col space-y-2">
      <p className="font-semibold mb-4 font-[calibri] text-3xl ml-3">
        Messages
      </p>
      <div className="relative  ml-2 mr-4 text-[rgb(124,126,128)]">
        <i className="fa-solid absolute top-3 left-2   fa-magnifying-glass"></i>
        <input
          className="border-none w-full outline-none text-white rounded-md px-4 pl-8 py-2 bg-[rgb(53,55,59)]"
          placeholder="Search.."
          type="text"
          name="search"
        ></input>
      </div>
      <div className=" h-[78vh] py-4 overflow-y-scroll chatBox  flex space-y-2 flex-col">
        {recentChats.length > 0 &&
          recentChats.map((element) => {
            if (element.isGroupChat) {
              return (
                <div
                  key={element._id}
                  onClick={() => {
                    chatroom._id !== element._id &&
                      accessGroupChat(element._id);
                  }}
                  className={`flex hover:bg-[rgb(44,44,44)]  cursor-pointer ${
                    element._id === chatroom._id
                      ? "bg-[rgb(27,27,27)] border-l-2  border-[rgb(36,141,97)]"
                      : "bg-[rgb(36,36,36)] "
                  } 
                      px-4 py-2   text-white space-x-2`}
                >
                  <img
                    alt=""
                    className="w-12 h-12 rounded-[50%]"
                    src={element.profilePic}
                  ></img>
                  <div>
                    <div className="flex  w-60 justify-between">
                      <p className="text-base font-semibold">
                        {element.chatname.length > 21
                          ? element.chatname.slice(0, 21) + "..."
                          : element.chatname}
                      </p>
                      <p className="text-xs text-[rgb(146,145,148)]">
                        Thursday
                      </p>
                    </div>
                    <div className="flex justify-between">
                    <p className="text-[rgb(146,145,148)] text-sm">
                      {element.latestMessage.noty
                        ? checkUserName(element.latestMessage.sender)
                        : ""}{" "}
                      {element.latestMessage.content.length > 10
                        ? element.latestMessage.content.slice(0, 10) + "..."
                        : element.latestMessage.content}
                    </p>
                   {(<p className="bg-[rgb(197,73,69)] rounded-full font-bold flex justify-center 
                    items-center text-[0.7rem] h-5 w-5">
                        {countMsgs(element.users)}
                      </p>)}
                    </div>
                  </div>
                </div>
              );
            } else {
              if (element.latestMessage) {
                return (
                  <div
                    onClick={() => {
                      accessChat(
                        checkUserId(element.latestMessage.sender, element)
                      );
                    }}
                    className={`flex ${
                      element._id === chatroom._id
                        ? "bg-[rgb(27,27,27)] border-l-2  border-[rgb(36,141,97)]"
                        : "bg-[rgb(36,36,36)] "
                    } 
                          cursor-pointer hover:bg-[rgb(44,44,44)]   px-4 py-2  text-white space-x-2`}
                    key={element._id}
                  >
                    <img
                      alt=""
                      className="w-12 h-12 rounded-[50%]"
                      src={checkUserAvtar(
                        element.latestMessage.sender,
                        element
                      )}
                    ></img>
                    <div>
                      <div className="flex font-semibold w-60 justify-between">
                        <p className="text-base">
                          {checkUser(element.latestMessage.sender, element)}
                        </p>
                        <p className="text-xs text-[rgb(146,145,148)]">
                          09:38 AM
                        </p>
                      </div>
                      <div className="flex justify-between">
                      <p className="text-[rgb(146,145,148)] text-sm">
                        {element.latestMessage.content}
                      </p>
                      <p className="bg-[rgb(197,73,69)] rounded-full font-bold flex justify-center 
                       items-center text-[0.7rem] h-5 w-5">
                        {countMsgs(element.users)}
                      </p>
                      </div>
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
