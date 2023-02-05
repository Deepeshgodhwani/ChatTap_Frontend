import React, { useEffect, useState, useContext } from "react";
import ChatContext from "../context/chat/ChatContext";
import ScrollableChat from "./ScrollableChat";
import Loading from "./Loading";
import MessageContext from "../context/messages/MessageContext";
import {
  Popover,
  PopoverContent,
  FormControl,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
var selectedChatCompare;
let delay = true;
let dropdown = false;

export default function SingleChat(props) {
  const {
    toggleProfileView,
    details,
    socket,
    setenableChatlist,
    setenableChat,
  } = props;
  const [messages, setmessages] = useState([]);
  const [newMessage, setnewMessage] = useState("");
  const context = useContext(ChatContext);
  const msgContext = useContext(MessageContext);
  const [secondUser, setsecondUser] = useState({});
  const [loading, setloading] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const { encryptData } = msgContext;
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toast = useToast();
  const { logUser, chatroom, setchatroom, recentChats, setrecentChats } =
    context;

  //to set second user in single chat //
  useEffect(() => {
    const connectUser = () => {
      toggleProfileView(false);
      if (chatroom.users) {
        chatroom.users[0].user._id === logUser._id
          ? setsecondUser(chatroom.users[1].user)
          : setsecondUser(chatroom.users[0].user);
      }
    };
    connectUser();
    window.innerWidth > 768
      ? (document.title = `ChatTap • ${secondUser.name}`)
      : (document.title = "ChatTap");
  }, [chatroom, logUser, secondUser]);

  //to fetch previous message for single chat
  useEffect(() => {
    try {
      setloading(true);
      const fetchMessage = async () => {
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
        setmessages(data);
        setloading(false);
      };
      fetchMessage();
      selectedChatCompare = chatroom;
    } catch (error) {
      setloading(false);
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [chatroom]);

  // To send message //
  const sendMessage = async (e) => {
    let condition = false;
    if (e === true) {
      condition = true;
    } else {
      condition = e.key === "Enter";
    }

    if (condition && newMessage && delay) {
      try {
        delay = false;
        socket.emit("toggleTyping", {
          chat: chatroom,
          status: false,
          user: logUser,
        });
        let encryptedMessage = encryptData(newMessage);
        let token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:7000/api/chat/message`, {
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
        socket.emit("new_message", data);
        socket.emit("update_Chatlist", data);
        setmessages([...messages, data]);
        let updatedChat;
        let check = true;
        let chats = recentChats;
        chats = chats.filter((Chat) => {
          if (Chat._id === chatroom._id) {
            Chat.latestMessage = data;
            updatedChat = Chat;
            check = false;
          }
          return Chat._id !== chatroom._id;
        });
        setnewMessage("");
        if (check) {
          let chat = chatroom;
          chat.latestMessage = data;
          setrecentChats([chat, ...chats]);
        } else {
          setrecentChats([updatedChat, ...chats]);
        }
        delay = true;
      } catch (error) {
        toast({
          description: "Internal server error",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // To receive message //
  useEffect(() => {
    if (!socket) return;
    socket.on("message_recieved", (data) => {
      let message = data.message;
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== message.chatId._id
      ) {
        //give notification
      } else {
        setmessages([...messages, message]);
      }
      setnewMessage("");
    });
  }, [messages, recentChats]);

  //toggling typing when usertwo typing //
  useEffect(() => {
    socket.on("isTyping", (data) => {
      if (data.chat._id === selectedChatCompare._id) {
        if (data.status) {
          setisTyping(true);
        } else {
          setisTyping(false);
        }
      }
    });
  }, [isTyping]);

  const toggleDropdown = () => {
    if (dropdown) {
      onClose();
      dropdown = false;
    } else {
      onOpen();
      dropdown = true;
    }
  };

  return (
    <>
      <div
        className={`bg-[rgb(27,27,27)] h-[100vh] w-full relative overflow-hidden text-white ${
          details ? "md:w-[71.5%] xl:w-[50%]" : "md:w-[71%] xl:w-[72%] "
        } `}
      >
        <div className="flex items-center justify-between border-[1px] border-[rgb(42,42,42)]  h-16 py-3 space-x-4 px-10 bg-[rgb(36,36,36)] ">
          <div className="flex space-x-4 items-center ">
            <i
              onClick={() => {
                setenableChatlist(true);
                setenableChat(false);
                setchatroom("");
              }}
              className="fa-sharp md:hidden text-[rgb(136,136,136)] -ml-4 mr-2  fa-solid fa-arrow-left"
            ></i>

            <img
              onClick={() => {
                props.toggleProfileView(true);
              }}
              alt=""
              className="w-10 h-10 cursor-pointer rounded-full"
              src={secondUser.avtar}
            ></img>
            <div className="-space-y-1">
              <p
                className=" font-semibold cursor-pointer"
                onClick={() => {
                  props.toggleProfileView(true);
                }}
              >
                {secondUser.name}
              </p>
              {isTyping && (
                <p className="text-sm text-[rgb(36,141,97)]">Typing ...</p>
              )}
            </div>
          </div>
          <div className="relative">
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
              <i
                onClick={toggleDropdown}
                className="border-2  cursor-pointer border-[rgb(136,136,136)] px-1  text-sm rounded-full fa-solid text-[rgb(136,136,136)] fa-ellipsis"
              ></i>
              <PopoverContent
                bg={"rgb(49,49,49)"}
                className=""
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
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setenableChatlist(true);
                      setenableChat(false);
                    }
                    props.toggleProfileView(false);
                    document.title = "ChatTap";
                    setchatroom({});
                  }}
                  className="hover:bg-[rgb(58,58,58)]  cursor-pointer py-1"
                >
                  Close chat
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="h-[77vh] relative">
          <div className={`  py-2 px-4 max-h-[75vh] `}>
            {loading && <Loading></Loading>}
            {!loading && (
              <ScrollableChat className="" messages={messages} user={logUser} />
            )}
          </div>
        </div>
        <div className="absolute bottom-[1px] w-full">
          <FormControl
            className="bg-[rgb(36,36,36)] border-[1px] border-[rgb(42,42,42)] relative flex justify-center items-center h-[13vh]"
            onKeyDown={sendMessage}
          >
            <input
              placeholder="Your messages..."
              className="bg-[rgb(53,55,59)] 
             border-black w-[86%] h-12  pr-16 outline-none rounded-xl py-1 px-4"
              type="text"
              autoComplete="off"
              onChange={(e) => {
                setnewMessage(e.target.value);
                socket.emit("toggleTyping", {
                  chat: chatroom,
                  status: e.target.value ? true : false,
                  user: logUser,
                });
              }}
              value={newMessage}
            ></input>
            <i
              onClick={(e) => {
                sendMessage(true);
              }}
              className={`fa-solid  right-12 xs:right-16 absolute text-xl ${
                details ? "md:right-20" : "md:right-24"
              }  cursor-pointer text-[rgb(36,141,97)] fa-paper-plane`}
            ></i>
          </FormControl>
        </div>
      </div>
    </>
  );
}
