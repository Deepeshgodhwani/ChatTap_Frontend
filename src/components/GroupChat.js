import React, { useContext, useEffect, useState } from "react";
import ChatContext from "../context/chat/ChatContext";
import Loading from "./Loading";
import RenderGroupMessages from "./RenderGroupMessages";
import MessageContext from "../context/messages/MessageContext";
import {
  FormControl,
  useDisclosure,
  Popover,
  PopoverContent,
  useToast,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";

var selectedChatCompare;
let processSend = true;
let processRecieve = true;
let dropdown = false;
let members = [];
const url = process.env.REACT_APP_URL;

function GroupChat(props) {
  const context = useContext(ChatContext);
  const msgContext = useContext(MessageContext);
  const [isTyping, setisTyping] = useState(false);
  const [TypingUser, setTypingUser] = useState([]);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { encryptData } = msgContext;
  const [newMessage, setnewMessage] = useState("");
  const [userExist, setuserExist] = useState(true);
  const toast = useToast();
  const {
    toggleProfileView,
    details,
    socket,
    setenableChatlist,
    setenableChat,
  } = props;
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

  //assigning chatroom in global variable /
  useEffect(() => {
    if (!chatroom.users) return;
    toggleProfileView(false);
    setisTyping(false);
    selectedChatCompare = chatroom;
    members = chatroom.users;
    window.innerWidth > 768
      ? (document.title = `ChatTap • ${chatroom.chatname}`)
      : (document.title = "ChatTap");

    return () => {
      socket.emit("toggleTyping", {
        chat: chatroom,
        status: false,
        user: logUser,
      });
    };
  }, [chatroom]);

  //  fetching previos group messages //
  useEffect(() => {
    const fetchMessage = async () => {
      setloading(true);
      try {
        if (!chatroom.users || chatroom.dummy) return;
        let token = localStorage.getItem("token");
        const response = await fetch(
          `${url}/api/chat/fetchMessages?Id=${chatroom._id}`,
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
      } catch (error) {
        toast({
          description: "Internal server error",
          status: "warning",
          isClosable: true,
          duration: 3000,
        });
      }

      setloading(false);
    };
    fetchMessage();
  }, [chatroom]);

  // To send message //
  const sendMessage = async (e) => {
    let condition = false;
    if (e === true) {
      condition = true;
    } else {
      condition = e.key === "Enter";
    }
    if (condition && newMessage && processSend) {
      processSend = false;
      socket.emit("toggleTyping", {
        chat: chatroom,
        status: false,
        user: logUser,
      });
      let encryptedMessage = encryptData(newMessage);
      try {
        let token = localStorage.getItem("token");
        const response = await fetch(`${url}/api/chat/message`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            content: encryptedMessage,
            chatId: chatroom._id,
          }),
        });

        const data = await response.json();
        setnewMessage("");
        setgroupMessages([...groupMessages, data]);
        socket.emit("new_message", data);
        socket.emit("update_Chatlist", data);
        let updatedChat;
        let chats = recentChats;
        chats = chats.filter((Chat) => {
          if (Chat._id === chatroom._id) {
            Chat.latestMessage = data;
            updatedChat = Chat;
          }
          return Chat._id !== chatroom._id;
        });
        setrecentChats([updatedChat, ...chats]);
        processSend = true;
      } catch (error) {
        toast({
          description: "Internal server error",
          status: "warning",
          isClosable: true,
          duration: 3000,
        });
      }
    }
  };

  // removing unseen message counts when chat is open (when window size is less than 768)
  const DissmissCount = async (chatId) => {
    try {
      let token = localStorage.getItem("token");
      const response = await fetch(
        `${url}/api/chat/countMssg?type=dismiss&chatId=${chatId}&userId=${logUser._id}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      await response.json();
    } catch (error) {
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // On  receiving  message //
  if (socket && processRecieve) {
    socket.on("message_recieved", (data) => {
      processRecieve = false;
      let message = data.message;
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== message.chatId._id
      ) {
      } else {
        setgroupMessages([...groupMessages, message]);
      }
      if (window.innerWidth < 768) {
        DissmissCount(message.chatId._id);
      }
      processRecieve = true;
    });
  }

  //checking is user exists in group or not
  const updateUserExist = (data) => {
    if (data.chat._id === selectedChatCompare._id) {
      if (data.status === "add") {
        setuserExist(true);
      } else {
        setuserExist(false);
      }
    }
  };

  const isTypingUser = (data) => {
    if (data.chat._id === chatroom._id) {
      if (data.status) {
        setisTyping(true);
        setTypingUser(data.user);
      } else {
        setisTyping(false);
        setTypingUser([]);
      }
    }
  };

  //socket for changing image,name,toggling typing,and
  useEffect(() => {
    if (!socket) return;

    socket.on("groupRemoved", updateUserExist);
    socket.on("toggleImage", (data) => {
      if (data.chat._id === selectedChatCompare._id) {
        setgroupPic(data.picture);
      }
    });
    socket.on("toggleName", (data) => {
      if (data.chat._id === selectedChatCompare._id) {
        setgroupName(data.name);
      }
    });
    socket.on("isTyping", isTypingUser);

    return () => {
      socket.off("isTyping");
    };
  }, [chatroom]);

  useEffect(() => {
    if (!groupMembers.length) {
      setuserExist(true);
      return;
    }

    let check = false;
    groupMembers.forEach((members) => {
      if (members.user._id === logUser._id) {
        check = true;
      }
    });
    setuserExist(check);
  }, [groupMembers]);

  // updating users while removing or adding
  const updateUsers = (data) => {
    if (data.group._id === selectedChatCompare._id) {
      if (data.status === "add") {
        members = members.concat(data.members);
        setgroupMembers(members);
      } else {
        members = members.filter((member) => {
          return member.user._id !== data.members._id;
        });
        setgroupMembers(members);
      }
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("updateUsers", updateUsers);
    return () => {
      socket.off("updateUsers", updateUsers);
    };

    // eslint-disable-next-line
  }, []);

  const toggleDropdown = () => {
    if (dropdown) {
      onClose();
      dropdown = false;
    } else {
      onOpen();
      dropdown = true;
    }
  };

  const closeChat = () => {
    if (window.innerWidth < 768) {
      setenableChatlist(true);
      setenableChat(false);
    }
    props.toggleProfileView(false);
    document.title = "ChatTap";
    setchatroom({});
  };

  return (
    <div
      className={`bg-[rgb(27,27,27)] h-[100vh]  relative overflow-hidden w-full  text-white ${
        details ? "md:w-[71.5%] xl:w-[44%]" : "md:w-[71%] xl:w-[69%] "
      }`}
    >
      <div className="flex justify-between  items-center h-[10vh] check border-[1px] border-[rgb(42,42,42)] py-3 space-x-4 px-10 bg-[rgb(36,36,36)] ">
        <div className="flex space-x-4 items-center ">
          <i
            onClick={() => {
              setenableChatlist(true);
              setenableChat(false);
              setchatroom("");
            }}
            className="fa-sharp md:hidden text-[rgb(136,136,136)] -ml-4 mr-2  fa-solid fa-arrow-left"
          ></i>

          {groupPic && (
            <img
              onClick={() => {
                props.toggleProfileView(true);
              }}
              alt=""
              className="w-10 h-10   cursor-pointer rounded-full"
              src={groupPic}
            ></img>
          )}
          {!groupPic && (
            <SkeletonCircle
              size="10"
              startColor="rgb(46,46,46)"
              endColor="rgb(56,56,56)"
            />
          )}

          <div className="-space-y-1">
            {groupName && (
              <p
                className="cursor-pointer font-semibold"
                onClick={() => {
                  props.toggleProfileView(true);
                }}
              >
                {groupName}
              </p>
            )}
            {!groupName && (
              <div className="flex flex-col space-y-1">
                <Skeleton
                  startColor="rgb(46,46,46)"
                  endColor="rgb(56,56,56)"
                  width={"12rem"}
                  height="10px"
                />
                <Skeleton
                  startColor="rgb(46,46,46)"
                  endColor="rgb(56,56,56)"
                  width={"12rem"}
                  height="10px"
                />
              </div>
            )}
            {isTyping && (
              <div className="flex text-sm space-x-2">
                <p className="text-[rgb(150,150,150)] font-semibold">
                  {TypingUser.name} :
                </p>
                <p className="text-[rgb(36,141,97)]">Typing ...</p>
              </div>
            )}
          </div>
        </div>
        <div className="relative ">
          <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <i
              onClick={toggleDropdown}
              className="border-2  cursor-pointer border-[rgb(136,136,136)] px-1  text-sm rounded-full fa-solid text-[rgb(136,136,136)] fa-ellipsis"
            ></i>
            <PopoverContent
              className="focus:outline-none"
              bg={"rgb(49,49,49)"}
              outline="none"
              top={"2rem"}
              right={"8rem"}
              textAlign={"center"}
              borderColor={"rgb(75,75,75)"}
              width={"40"}
            >
              <p
                onClick={() => {
                  onClose();
                  props.toggleProfileView(true);
                }}
                className=" border-[rgb(75,75,75)] cursor-pointer hover:bg-[rgb(58,58,58)]  border-b-[1px] py-1 "
              >
                View details
              </p>
              <p
                onClick={closeChat}
                className="hover:bg-[rgb(58,58,58)]  cursor-pointer py-1"
              >
                Close chat
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className={` h-[77vh]  relative`}>
        <div className={`chatBox py-2 px-4  max-h-[75vh] `}>
          {loading && <Loading></Loading>}
          {!loading && (
            <RenderGroupMessages
              details={details}
              socket={socket}
              messages={groupMessages}
              user={logUser}
            />
          )}
        </div>
      </div>
      {userExist ? (
        <div className="absolute bottom-[1px] w-full">
          <FormControl
            className="bg-[rgb(36,36,36)]  border-[1px] border-[rgb(42,42,42)] flex justify-center items-center h-[13vh]"
            onKeyDown={sendMessage}
          >
            <input
              placeholder="Your messages..."
              className="bg-[rgb(53,55,59)] 
         border-black w-[86%] h-10 md:h-12 pr-16 outline-none rounded-xl py-1 px-4"
              type="text"
              onChange={(e) => {
                setnewMessage(e.target.value);
                socket.emit("toggleTyping", {
                  chat: chatroom,
                  status: e.target.value ? true : false,
                  user: logUser,
                });
              }}
              value={newMessage}
              autoComplete="off"
            ></input>
            <i
              onClick={(e) => {
                sendMessage(true);
              }}
              className={`fa-solid absolute right-12 text-xl ${
                details ? "md:right-20" : "md:right-24"
              }  cursor-pointer 
         text-[rgb(36,141,97)]   fa-paper-plane`}
            ></i>
          </FormControl>
        </div>
      ) : (
        <div className="text-[rgb(146,145,148)] text-xs text-center  md:text-sm border-[1px] border-[rgb(42,42,42)] flex justify-center items-center bg-[rgb(36,36,36)] mt-[14px] h-[4rem]">
          You can't send message to this group because you're no longer a member
        </div>
      )}
    </div>
  );
}

export default GroupChat;
