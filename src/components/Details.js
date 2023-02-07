import React, { useContext, useState, useEffect, useRef } from "react";
import ChatContext from "../context/chat/ChatContext";
import GroupMembers from "./GroupMembers";
import MessageContext from "../context/messages/MessageContext";
import {
  Skeleton,
  SkeletonCircle,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
const url = process.env.REACT_APP_URL;

function Details(props) {
  const { Profile, toggleProfileView, socket } = props;
  const context = useContext(ChatContext);
  const [loading, setloading] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [isUserExist, setisUserExist] = useState(true);
  const [newChatName, setnewChatName] = useState("");
  const [enabled, setenabled] = useState(false);
  const toast = useToast();
  const [commonGroups, setcommonGroups] = useState([]);
  const contextMsg = useContext(MessageContext);
  const { encryptData } = contextMsg;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingGroup, setloadingGroup] = useState(false);
  let ref = useRef();
  const {
    logUser,
    setgroupPic,
    createNoty,
    recentChats,
    setrecentChats,
    chatroom,
    setchatroom,
    groupPic,
    setgroupName,
    groupName,
    groupMembers,
    setgroupMembers,
    groupMessages,
    setgroupMessages,
    accessGroupChat,
  } = context;

  // feching mutual groups of loguser and usetwo
  const getCommonGroups = async () => {
    try {
      setloadingGroup(true);
      let token = localStorage.getItem("token");
      const response = await fetch(
        `${url}/api/chat/getCommonGroups?userId=${Profile._id}`,
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
      setcommonGroups(data);
      setloadingGroup(false);
    } catch (error) {
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //calling getCommongroups on page rendering
  useEffect(() => {
    if (!Profile.isGroupChat) {
      getCommonGroups();
    }
    // eslint-disable-next-line
  }, []);

  //To change group profile picture
  const changeProfile = async (e) => {
    setloading(true);
    try {
      if (
        e.target.files[0] &&
        (e.target.files[0].type === "image/jpeg" ||
          e.target.files[0].type === "image/png")
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
          `${url}/api/chat/changePic?isGroupChat=${
            Profile.isGroupChat ? true : false
          }&Id=${
            Profile.isGroupChat ? Profile._id : logUser._id
          }&pic=${picture}`,
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
        if (message.success) {
          setloading(false);
          setgroupPic(picture);
          setchatroom({ ...chatroom, profilePic: picture });
          let message = "changed the group photo";
          let encryptedMessage = encryptData(message);
          let noty = await createNoty(Profile._id, encryptedMessage);
          socket.emit("new_message", noty);
          socket.emit("update_Chatlist", noty);
          let updatedChat;
          let chats = recentChats;
          chats = chats.filter((Chat) => {
            if (Chat._id === noty.chatId._id) {
              Chat.latestMessage = noty;
              Chat.profilePic = picture;
              updatedChat = Chat;
            }
            return Chat._id !== noty.chatId._id;
          });
          setrecentChats([updatedChat, ...chats]);
          Profile.isGroupChat && setgroupPic(picture);
          let data = { chat: chatroom, picture: picture, logUser: logUser };
          socket.emit("changed_groupImage", data);
          toast({
            title: "Group picture is changed successfully",
            status: "success",
            isClosable: true,
          });
        }
        e.target.value = null;
      } else {
        toast({
          description: "picture format should be jpeg or png",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
    setloading(false);
  };

  // To exit from group .
  const exitGroup = async () => {
    try {
      setgroupMembers(
        groupMembers.filter((member) => {
          return member.user._id !== logUser._id;
        })
      );
      let token = localStorage.getItem("token");
      const response = await fetch(
        `${url}/api/chat/removeUser?chatId=${Profile._id}&userId=${logUser._id}`,
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
      if (!data.success) return;
      let message = "left";
      let encryptedMessage = encryptData(message);
      let noty = await createNoty(Profile._id, encryptedMessage);
      noty.removedUserId = logUser._id;
      socket.emit("new_message", noty);
      socket.emit("update_Chatlist", noty);
      let status = {
        users: [{ user: logUser._id }],
        chat: Profile,
        status: "remove",
      };
      socket.emit("member_status", status);
      let dataSend = { group: Profile, members: logUser, status: "remove" };
      socket.emit("change_users", dataSend);
      let updatedChat;
      let chats = recentChats;
      chats = chats.filter((Chat) => {
        if (Chat._id === noty.chatId._id) {
          Chat.latestMessage = noty;
          updatedChat = Chat;
        }
        return Chat._id !== noty.chatId._id;
      });
      setrecentChats([updatedChat, ...chats]);
      setgroupMessages([...groupMessages, noty]);
      setisUserExist(false);
    } catch (error) {
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // checking user exist in group or not
  const checkUserExist = () => {
    let check = false;
    groupMembers.forEach((members) => {
      if (members.user._id === logUser._id) {
        check = true;
      }
    });
    setisUserExist(check);
  };

  //checking is user is exist in group when groupmembers are updating //
  ref.current = checkUserExist;
  useEffect(() => {
    ref.current();
  }, [groupMembers]);

  const editName = () => {
    let input = document.getElementById("inputName");
    input.style.borderBottomColor = "rgb(66,203,165)";
    input.placeholder = groupName;
    input.disabled = false;
    setenabled(true);
  };

  // To edit group name
  const changeName = async () => {
    if (newChatName === Profile.chatname) {
      toast({
        title: "Error",
        description: "it is already chatname",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      try {
        let token = localStorage.getItem("token");
        const response = await fetch(`${url}/api/chat/changeName`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            type: "group",
            Id: Profile._id,
            name: newChatName,
          }),
        });

        await response.json();
        let input = document.getElementById("inputName");
        input.value = "";
        setgroupName(newChatName);
        setchatroom({ ...chatroom, chatname: newChatName });
        let message = "named the group " + newChatName;
        let encryptedMessage = encryptData(message);
        let noty = await createNoty(Profile._id, encryptedMessage);
        socket.emit("new_message", noty);
        socket.emit("update_Chatlist", noty);
        input.disabled = false;
        setenabled(true);
        let updatedChat;
        let chats = recentChats;
        chats = chats.filter((Chat) => {
          if (Chat._id === noty.chatId._id) {
            Chat.latestMessage = noty;
            Chat.chatname = newChatName;
            updatedChat = Chat;
          }
          return Chat._id !== noty.chatId._id;
        });
        setrecentChats([updatedChat, ...chats]);
        let send = { chat: chatroom, name: newChatName, logUser: logUser };
        setnewChatName("");
        socket.emit("changed_groupName", send);
        toast({
          title: "Group name changed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Internal server error",
          status: "warning",
          isClosable: true,
          duration: 3000,
        });
      }
    }
  };

  const toggleDropdown = () => {
    if (dropdown) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const setGroupChat = (element) => {
    try {
      if (chatroom._id !== element._id) {
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
    <>
      <div className="w-[25%]  bg-[rgb(36,36,36)]  flex flex-col">
        <div className="text-[rgb(233,233,233)] pt-4  px-5 text-xl font-semibold flex justify-between ">
          <p>Details</p>
          <i
            onClick={() => {
              toggleProfileView(false);
            }}
            className="cursor-pointer mt-1 fa-solid fa-xmark"
          ></i>
        </div>
        <div className="py-2 chatBox overflow-x-hidden overflow-y-scroll  ">
          <div className="flex space-y-2  mt-3  pt-6 2xl:pt-10  py-2 flex-col items-center">
            <div className="relative group rounded-full  flex justify-center items-center ">
              <img
                alt=""
                className="w-48 cursor-pointer group rounded-full h-48"
                src={Profile.isGroupChat ? groupPic : Profile.avtar}
                onClick={onOpen}
              ></img>
              {loading && (
                <Spinner
                  size="xl"
                  color="white"
                  thickness="3px"
                  className="absolute"
                />
              )}

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent borderRadius={"20px"}>
                  <img
                    alt=""
                    className="h-[70vh] rounded-lg"
                    src={
                      Profile.isGroupChat ? Profile.profilePic : Profile.avtar
                    }
                  ></img>
                </ModalContent>
              </Modal>

              {Profile.isGroupChat && isUserExist && (
                <div
                  id="hoverImg"
                  onClick={toggleDropdown}
                  className="absolute  hidden text-white group-hover:flex text-center py-14 bg-black w-48 space-y-1 h-48 opacity-70 rounded-full 
            flex-col justify-center items-center"
                >
                  <i className="fa-solid text-lg fa-camera"></i>
                  <div className="  text-xs font-semibold ">
                    <p>UPLOAD</p>
                    <p>GROUP PHOTO</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col  items-center text-[rgb(233,233,233)]">
              {Profile.isGroupChat ? (
                <div className="relative group mt-1 mb-1">
                  <input
                    className={`bg-transparent ${
                      enabled ? "border-b-2" : "border-b-0 text-center"
                    } cursor-pointer text-[rgb(170,170,170)] px-3 font-semibold  
              placeholder:text-[rgb(211,211,211)]  text-lg pb-2 
              border-[rgb(34,134,92)] outline-none  w-60`}
                    type={"text"}
                    disabled
                    id="inputName"
                    placeholder={
                      groupName.length > 20
                        ? groupName.slice(0, 23) + ".."
                        : groupName
                    }
                    maxLength="30"
                    autoComplete="off"
                    onChange={(e) => {
                      setnewChatName(e.target.value);
                    }}
                  ></input>
                  {!enabled && isUserExist && (
                    <i
                      onClick={editName}
                      className="absolute group-hover:opacity-100 opacity-0 cursor-pointer text-[rgb(87,87,87)]  right-0 fa-solid fa-pen"
                    ></i>
                  )}
                  {enabled && newChatName && (
                    <i
                      onClick={changeName}
                      className="absolute cursor-pointer text-[rgb(87,87,87)]  right-0 fa-solid fa-circle-check"
                    ></i>
                  )}
                </div>
              ) : (
                <div className="font-semibold text-lg mt-1 w-52 pb-2 text-center">
                  {Profile.name.length > 23
                    ? Profile.name.slice(0, 23) + ".."
                    : Profile.name}
                </div>
              )}
            </div>
          </div>
          <div className="bg-[rgb(27,27,27)]  w-full h-3"></div>
          {!Profile.isGroupChat && !loadingGroup && (
            <div className="  py-3  text-white ">
              <p className="text-[rgb(167,169,171)] px-5 2xl:px-7 font-semibold">
                Groups in common
              </p>
              {commonGroups.length >= 1 ? (
                <div className="flex h-56  overflow-y-scroll  chatBox mt-3 flex-col ">
                  {commonGroups.map((group) => {
                    return (
                      <div
                        className="flex cursor-pointer hover:bg-[rgb(44,44,44)] py-[6px] px-3 2xl:px-5 items-center space-x-2"
                        key={group._id}
                        onClick={(e) => {
                          setGroupChat(group);
                        }}
                      >
                        <img
                          className="w-11 2xl:w-12 2xl:h-12  rounded-full h-11  "
                          alt=""
                          src={group.profilePic}
                        ></img>
                        <div>
                          <p className="text-base">{group.chatname}</p>
                          <p className="text-[rgb(146,145,148)] text-xs">
                            {group.users.length} member
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center items-center h-52 text-[rgb(167,169,171)] text-sm">
                  <p>No common groups</p>
                </div>
              )}
            </div>
          )}

          {loadingGroup && (
            <div className="flex  items-center flex-col pt-4 space-y-2">
              <div className="px-0  relative  flex space-x-2 items-center pt-2 ">
                <SkeletonCircle
                  size="14"
                  startColor="rgb(46,46,46)"
                  endColor="rgb(56,56,56)"
                />
                <div className="space-y-2 ">
                  <Skeleton
                    startColor="rgb(46,46,46)"
                    endColor="rgb(56,56,56)"
                    width={`${
                      window.innerWidth < 768
                        ? "15rem"
                        : window.innerWidth < 1536
                        ? "14rem"
                        : "17rem"
                    }`}
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
              <div className="px-0  relative  flex space-x-2 items-center pt-2 ">
                <SkeletonCircle
                  size="14"
                  startColor="rgb(46,46,46)"
                  endColor="rgb(56,56,56)"
                />
                <div className="space-y-2 ">
                  <Skeleton
                    startColor="rgb(46,46,46)"
                    endColor="rgb(56,56,56)"
                    width={`${
                      window.innerWidth < 768
                        ? "15rem"
                        : window.innerWidth < 1536
                        ? "14rem"
                        : "17rem"
                    }`}
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
              <div className="px-0  relative  flex space-x-2 items-center pt-2 ">
                <SkeletonCircle
                  size="14"
                  startColor="rgb(46,46,46)"
                  endColor="rgb(56,56,56)"
                />
                <div className="space-y-2 ">
                  <Skeleton
                    startColor="rgb(46,46,46)"
                    endColor="rgb(56,56,56)"
                    width={`${
                      window.innerWidth < 768
                        ? "15rem"
                        : window.innerWidth < 1536
                        ? "14rem"
                        : "17rem"
                    }`}
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
              <div className="px-0  relative  flex space-x-2 items-center pt-2 ">
                <SkeletonCircle
                  size="14"
                  startColor="rgb(46,46,46)"
                  endColor="rgb(56,56,56)"
                />
                <div className="space-y-2 ">
                  <Skeleton
                    startColor="rgb(46,46,46)"
                    endColor="rgb(56,56,56)"
                    width={`${
                      window.innerWidth < 768
                        ? "15rem"
                        : window.innerWidth < 1536
                        ? "14rem"
                        : "17rem"
                    }`}
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
              <div className="px-0  relative  flex space-x-2 items-center pt-2 ">
                <SkeletonCircle
                  size="14"
                  startColor="rgb(46,46,46)"
                  endColor="rgb(56,56,56)"
                />
                <div className="space-y-2 ">
                  <Skeleton
                    startColor="rgb(46,46,46)"
                    endColor="rgb(56,56,56)"
                    width={`${
                      window.innerWidth < 768
                        ? "15rem"
                        : window.innerWidth < 1536
                        ? "14rem"
                        : "17rem"
                    }`}
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

          {Profile.isGroupChat && (
            <GroupMembers Profile={Profile} socket={socket} />
          )}

          {Profile.isGroupChat &&
            isUserExist &&
            logUser._id !== Profile.admin._id && (
              <div
                className="bg-[rgb(27,27,27)] 
        my-3 w-full h-3"
              ></div>
            )}
          {Profile.isGroupChat &&
            isUserExist &&
            Profile.admin._id !== logUser._id && (
              <div
                onClick={exitGroup}
                className="text-[rgb(227,92,109)] items-center px-6 text-base space-x-2 flex cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <p className="">Exit group</p>
              </div>
            )}
        </div>
      </div>
      {dropdown && (
        <div className="absolute w-[100%]  h-[100vh] right-0 ">
          <div onClick={toggleDropdown} className=" h-[100vh]"></div>
          <div className="text-white  border-[1px] border-[rgb(75,75,75)] rounded-md right-7 top-32 absolute w-36  bg-[rgb(49,49,49)] ">
            {Profile.isGroupChat && isUserExist && (
              <input
                onChange={(e) => {
                  changeProfile(e);
                  toggleDropdown();
                }}
                className=" inputFile z-50  h-8 w-36 cursor-pointer border-[rgb(75,75,75)]  border-b-[1px] opacity-100 hover:bg-[rgb(58,58,58)]
                        text-white  text-center"
                type="file"
                title=""
                autoComplete="off"
              ></input>
            )}
            <p
              onClick={() => {
                onOpen();
                toggleDropdown();
              }}
              className="cursor-pointer hover:bg-[rgb(58,58,58)] py-1  px-4 "
            >
              View profile
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Details;
