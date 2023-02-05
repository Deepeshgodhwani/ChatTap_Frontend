import React, { useContext, useEffect, useState } from "react";
import chatContext from "../context/chat/ChatContext";
import MessageContext from "../context/messages/MessageContext";
import { Skeleton, SkeletonCircle, useToast } from "@chakra-ui/react";
import Profile from "./Profile";
import GroupCreation from "./GroupCreation";
let currentChat;

export default function Chatlist(props) {
  const context = useContext(chatContext);
  const contextMsg = useContext(MessageContext);
  const { socket, settoggleSearch, setenableChat, setenableChatlist } = props;
  const [groupsView, setgroupsView] = useState(false);
  const { decryptData } = contextMsg;
  const toast = useToast();
  const {
    chatroom,
    accessChat,
    accessGroupChat,
    setrecentChats,
    recentChats,
    fetchRecentChats,
    logUser,
    chatlistLoading,
  } = context;

  useEffect(() => {
    fetchRecentChats();
    // eslint-disable-next-line
  }, []);

  // removing unseen message counts when chat is open
  const DissmissCount = async (chatId) => {
    try {
      let token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:7000/api/chat/countMssg?type=dismiss&chatId=${chatId}&userId=${logUser._id}`,
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

  //updating latest message in recent chat list //
  const updateLatestMessage = async (data) => {
    try {
      let message = data.message;
      let updatedUsers;
      //checking is there chat is open and if it is equal to message chat
      if (currentChat && currentChat._id === message.chatId._id) {
        DissmissCount(message.chatId._id);
      } else {
        updatedUsers = data.users;
      }

      //updating latest message in chatlist//
      let updatedChat;
      let chats = recentChats;
      let check = true;
      chats = chats.filter((Chat) => {
        //finding  chat in chatlist
        if (Chat._id === message.chatId._id) {
          //updating latest message
          Chat.latestMessage = message;
          if (updatedUsers) {
            // if there is updated users updating in chat
            Chat.users = updatedUsers;
          }
          updatedChat = Chat;
          check = false;
        }
        return Chat._id !== message.chatId._id;
      });
      //if there is no chat is chatlist
      if (check) {
        //adding message chat in chatlist
        let chat = message.chatId;
        chat.latestMessage = message;
        if (updatedUsers) {
          chat.users = updatedUsers;
        }
        setrecentChats([chat, ...chats]);
      } else {
        setrecentChats([updatedChat, ...chats]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    currentChat = chatroom;
    if (!socket) return;
    socket.once("latest_message", updateLatestMessage);

    //updating group image of chat in recent chatlist //
    socket.on("toggleImage", (data) => {
      let updatedChat;
      let chats = recentChats;
      chats = chats.filter((Chat) => {
        if (Chat._id === data.chat._id) {
          Chat.profilePic = data.picture;
          updatedChat = Chat;
        }
        return Chat._id !== data.chat._id;
      });
      setrecentChats([updatedChat, ...chats]);
    });

    //updating group name of chat in recent chatlist .
    socket.on("toggleName", (data) => {
      let updatedChat;
      let chats = recentChats;
      chats = chats.filter((Chat) => {
        if (Chat._id === data.chat._id) {
          Chat.chatname = data.name;
          updatedChat = Chat;
        }
        return Chat._id !== data.chat._id;
      });
      setrecentChats([updatedChat, ...chats]);
    });

    return () => socket.off("latest_message", updateLatestMessage);
  }, [chatroom, recentChats]);

  //updating new group in chatlist .
  useEffect(() => {
    if (!socket) return;
    socket.on("created_group", (group) => {
      setrecentChats([group, ...recentChats]);
    });
  }, [recentChats]);

  //finding  user two and returning name of userTwo (singlechat)
  const checkUser = (user, chat) => {
    try {
      if (recentChats.length) {
        if (user._id === logUser._id) {
          if (user._id === chat.users[0].user._id) {
            let string = chat.users[1].user.name;
            if (string.length > 23) {
              return string.slice(0, 23) + "..";
            }
            return string;
          } else {
            let string = chat.users[0].user.name;
            if (string.length > 23) {
              return string.slice(0, 23) + "..";
            }
            return string;
          }
        } else {
          let string = user.name;
          if (string.length > 23) {
            return string.slice(0, 23) + "..";
          }
          return string;
        }
      }
    } catch (error) {}
  };

  //finding  user two and returning userId of userTwo (singlechat)
  const checkUserId = (user, chat) => {
    try {
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
    } catch (error) {}
  };

  //finding  user two and returning avtar of userTwo (singlechat)

  const checkUserAvtar = (user, chat) => {
    if (recentChats.length) {
      if (user._id === logUser._id) {
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

  //counting unseen messages //
  const countMsgs = (members) => {
    let mssgCount = 0;
    members.forEach((member) => {
      let memberId = member.user._id.toString();
      if (memberId === logUser._id) {
        mssgCount = member.unseenMsg;
      }
    });
    return mssgCount;
  };

  //  fetching group chat //
  const setGroupChat = (element) => {
    if (chatroom._id !== element._id) {
      if (window.innerWidth < 768) {
        setenableChatlist(false);
        setenableChat(true);
      }

      accessGroupChat(element._id);
      setrecentChats(
        recentChats.map((chat) => {
          if (chat._id === element._id) {
            chat.users = chat.users.map((members) => {
              if (members.user._id === logUser._id) {
                members.unseenMsg = 0;
                return members;
              } else {
                return members;
              }
            });

            return chat;
          } else {
            return chat;
          }
        })
      );
    }
  };

  //fetching single chat //
  const setSingleChat = (element) => {
    if (element._id !== chatroom._id) {
      if (window.innerWidth < 768) {
        setenableChatlist(false);
        setenableChat(true);
      }
      accessChat(checkUserId(element.latestMessage.sender, element));
      setrecentChats(
        recentChats.map((chat) => {
          if (chat._id === element._id) {
            chat.users = chat.users.map((members) => {
              if (members.user._id === logUser._id) {
                members.unseenMsg = 0;
                return members;
              } else {
                return members;
              }
            });

            return chat;
          } else {
            return chat;
          }
        })
      );
    }
  };

  const changeListView = (value) => {
    setgroupsView(value);
  };

  // decrypting latestMessage of chats in recentchatlist //
  const filterMessage = (encryptedMessage, isGroup, user) => {
    let message = decryptData(encryptedMessage);
    let compressedMessage;
    if (isGroup) {
      let name = user._id === logUser._id ? "you" : user.name;
      compressedMessage = message.replace(logUser.name, "you");
      let finalmessage = name + " : " + compressedMessage;
      return finalmessage.length > 23
        ? finalmessage.slice(0, 26) + ".."
        : finalmessage;
    } else {
      compressedMessage =
        message.length > 23 ? message.slice(0, 25) + ".." : message;
    }
    return compressedMessage;
  };

  return (
    <div className="bg-[rgb(36,36,36)]   text-white w-full xs:w-96  md:w-80 h-[100%] flex flex-col space-y-2">
      <div className="flex justify-between pb-[11px] pt-4  items-center  px-10 ">
        <div className="flex space-x-2 items-center">
          <p className="font-semibold hidden md:flex font-[calibri] text-3xl ">
            Messages
          </p>
          <div className="flex md:hidden">
            <Profile />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex md:hidden">
            <GroupCreation socket={socket} />
          </div>
          <i
            onClick={() => {
              settoggleSearch(true);
            }}
            className="text-[rgb(111,111,111)]  md:text-[rgb(53,139,103)]  text-xl cursor-pointer fa-regular fa-pen-to-square"
          ></i>
        </div>
      </div>
      <div className="bg-[rgb(26,26,26)] relative justify-between py-1 px-1  mx-10 md:mx-6 rounded-lg flex">
        <p
          onClick={() => {
            changeListView(false);
          }}
          className={`${
            !groupsView ? "bg-[rgb(36,36,36)]" : ""
          }  cursor-pointer  text-center rounded-md font-semibold py-1 w-[49%] `}
        >
          All
        </p>
        <p
          onClick={() => {
            changeListView(true);
          }}
          className={`${
            groupsView ? "bg-[rgb(36,36,36)]" : ""
          } font-semibold font-[calibri] cursor-pointer text-center rounded-md py-1 w-[49%] `}
        >
          {" "}
          Groups
        </p>
      </div>
      {!chatlistLoading && (
        <div className=" h-[78vh] pt-4  items-center md:py-3 py-0 overflow-y-scroll chatBox  flex  flex-col">
          {recentChats.length > 0 &&
            recentChats.map((element) => {
              if (element.isGroupChat) {
                return (
                  <div
                    key={element._id}
                    onClick={(e) => {
                      setGroupChat(element);
                    }}
                    className={`flex hover:bg-[rgb(44,44,44)] cursor-pointer ${
                      element._id === chatroom._id
                        ? "bg-[rgb(27,27,27)] border-l-2  border-[rgb(36,141,97)]"
                        : "bg-[rgb(36,36,36)] "
                    } 
                      px-4   text-white `}
                  >
                    <div
                      key={element._id}
                      className="flex space-x-2  md:px-0 py-2 w-72 relative border-b-[1px] border-[rgb(42,42,42)]"
                    >
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
                          <p
                            className={`${
                              countMsgs(element.users) > 0
                                ? "text-[rgb(223,223,223)]"
                                : "text-[rgb(146,145,148)]"
                            } text-sm`}
                          >
                            {filterMessage(
                              element.latestMessage.content,
                              true,
                              element.latestMessage.sender
                            )}
                          </p>
                        </div>
                      </div>
                      {countMsgs(element.users) > 0 && (
                        <p
                          className="bg-[rgb(197,73,69)] absolute right-2 top-6 rounded-full font-bold flex justify-center 
                    items-center text-[0.7rem] h-5 w-5"
                        >
                          {countMsgs(element.users) > 99
                            ? "99+"
                            : countMsgs(element.users)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              } else if (!groupsView) {
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
                      <div className="flex space-x-2 py-2  w-72  relative  border-b-[1px] border-[rgb(42,42,42)]">
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
                            <p
                              className={`${
                                countMsgs(element.users) > 0
                                  ? "text-white"
                                  : "text-[rgb(146,145,148)]"
                              } text-sm`}
                            >
                              {filterMessage(element.latestMessage.content)}
                            </p>
                          </div>
                        </div>
                        {countMsgs(element.users) > 0 && (
                          <p
                            className="bg-[rgb(197,73,69)] absolute right-2 top-6 rounded-full font-bold flex justify-center 
                       items-center text-[0.7rem] h-5 w-5"
                          >
                            {countMsgs(element.users) > 99
                              ? "99+"
                              : countMsgs(element.users)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  return <div key={""}></div>;
                }
              } else {
                return <div></div>;
              }
            })}
          {recentChats.length === 0 && (
            <div className="h-96 text-[rgb(111,111,111)] flex items-center text-lg">
              No recent chats
            </div>
          )}
        </div>
      )}
      {chatlistLoading && (
        <div className="flex  items-center flex-col space-y-2">
          <div className="px-4 relative  flex space-x-2 items-center pt-4 ">
            <SkeletonCircle
              size="14"
              startColor="rgb(46,46,46)"
              endColor="rgb(56,56,56)"
            />
            <div className="space-y-2 ">
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                width={`${window.innerWidth < 768 ? "15rem" : "13rem"}`}
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
            </div>
          </div>
          <div className="px-4 relative  flex space-x-2 items-center pt-4 ">
            <SkeletonCircle
              size="14"
              startColor="rgb(46,46,46)"
              endColor="rgb(56,56,56)"
            />
            <div className="space-y-2 ">
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                width={`${window.innerWidth < 768 ? "15rem" : "13rem"}`}
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
            </div>
          </div>
          <div className="px-4 relative  flex space-x-2 items-center pt-4 ">
            <SkeletonCircle
              size="14"
              startColor="rgb(46,46,46)"
              endColor="rgb(56,56,56)"
            />
            <div className="space-y-2 ">
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                width={`${window.innerWidth < 768 ? "15rem" : "13rem"}`}
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
            </div>
          </div>
          <div className="px-4 relative  flex space-x-2 items-center pt-4 ">
            <SkeletonCircle
              size="14"
              startColor="rgb(46,46,46)"
              endColor="rgb(56,56,56)"
            />
            <div className="space-y-2 ">
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                width={`${window.innerWidth < 768 ? "15rem" : "13rem"}`}
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
            </div>
          </div>
          <div className="px-4 relative  flex space-x-2 items-center pt-4 ">
            <SkeletonCircle
              size="14"
              startColor="rgb(46,46,46)"
              endColor="rgb(56,56,56)"
            />
            <div className="space-y-2 ">
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                width={`${window.innerWidth < 768 ? "15rem" : "13rem"}`}
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
            </div>
          </div>
          <div className="px-4 relative  flex space-x-2 items-center pt-4 ">
            <SkeletonCircle
              size="14"
              startColor="rgb(46,46,46)"
              endColor="rgb(56,56,56)"
            />
            <div className="space-y-2 ">
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                width={`${window.innerWidth < 768 ? "15rem" : "13rem"}`}
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
              <Skeleton
                startColor="rgb(46,46,46)"
                endColor="rgb(56,56,56)"
                height="10px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
