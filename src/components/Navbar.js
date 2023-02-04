import React, { useContext, useState, useEffect, useRef } from "react";
import ChatContext from "../context/chat/ChatContext";
import Profile from "./Profile";
import GroupCreation from "./GroupCreation";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Spinner,
  useToast,
} from "@chakra-ui/react";

export default function Navbar(props) {
  const context = useContext(ChatContext);
  const { accessChat } = context;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { socket, toggleSearch, settoggleSearch } = props;
  const btnRef = React.useRef();
  const [loading, setloading] = useState(false);
  const [search, setsearch] = useState("");
  const [users, setusers] = useState([]);
  const [result, setresult] = useState(true);
  const toast = useToast();
  let ref = useRef();

  //enabling drawer from chatlist //
  const enableDrawer = () => {
    if (toggleSearch) {
      onOpen();
    }
  };

  ref.current = enableDrawer;
  useEffect(() => {
    ref.current();
  }, [toggleSearch]);

  const onChange = async (e) => {
    try {
      setloading(true);
      setsearch(e.target.value);
      let token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:7000/api/chat/searchUser?search=${e.target.value}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      let userrs = await response.json();
      setloading(false);
      if (!userrs.length) {
        setresult(false);
      } else {
        setusers(userrs);
        setresult(true);
      }

      if (!e.target.value) {
        setusers([]);
      }
    } catch (error) {
      setloading(false);
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const closeTheTab = () => {
    onClose();
    setusers([]);
    setsearch("");
    setloading(false);
    setresult(true);
    settoggleSearch(false);
  };

  return (
    <nav className="flex-col  hidden md:flex  items-center justify-center  w-20  py-10 text-white  bg-[rgb(27,27,27)] ">
      <div className="bg-[rgb(36,36,36)] w-14 space-y-4 pb-5 pt-2 rounded-lg flex flex-col  items-center justify-center">
        <img
          alt=""
          className="w-10  "
          src={
            "https://res.cloudinary.com/dynjwlpl3/image/upload/v1674985284/Chat-app/logo_rmgpil.png"
          }
        ></img>
        <i
          title="Search"
          onClick={onOpen}
          className=" text-[rgb(111,111,111)]  text-xl cursor-pointer fa-solid fa-magnifying-glass"
        ></i>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={closeTheTab}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent
            overflow={"hidden"}
            bg={"rgb(27,27,27)"}
            color={"white"}
          >
            <DrawerHeader bg={"rgb(36,36,36)"}>
              <div className="flex justify-between">
                Search for user
                <i
                  onClick={closeTheTab}
                  className="fa-solid cursor-pointer text-xl mt-[1px] fa-xmark"
                ></i>
              </div>
            </DrawerHeader>
            <DrawerBody padding={"0"} overflow={"hidden"}>
              <input
                onChange={onChange}
                value={search}
                className=" mx-4 mt-6 border-[rgb(156,150,150)] px-4 outline-none w-[17rem] py-2
                    rounded-lg border-2  bg-transparent text-white"
                placeholder="Enter names or email address"
                autoComplete="off"
              ></input>
              {loading && (
                <div className="h-96  flex justify-center items-center">
                  <Spinner />
                </div>
              )}
              {!loading && result && (
                <div className="flex h-[73vh]  pb-1check overflow-y-scroll styleScroll mt-6 flex-col ">
                  {users.map((user) => {
                    return (
                      <div
                        onClick={() => {
                          accessChat(user._id);
                          onClose();
                        }}
                        className="flex cursor-pointer px-4 hover:bg-[rgb(58,58,58)]  py-[6px]  items-center space-x-2"
                        key={user._id}
                      >
                        <img
                          className="w-12 rounded-full h-12"
                          alt=""
                          src={user.avtar}
                        ></img>
                        <p>{user.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {!result && (
                <div className="text-white h-96  flex justify-center items-center">
                  No result found
                </div>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <GroupCreation socket={socket} />
        <Profile />
      </div>
    </nav>
  );
}
