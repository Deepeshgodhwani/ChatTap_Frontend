import React from "react";
import { useContext } from "react";
import logo from "../images/meetme.png";
import GroupCreation from './GroupCreation';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";

import { useState } from "react";

import ChatContext from "../context/user/ChatContext";
import Profile from "./Profile";

export default function Navbar() {
  const context = useContext(ChatContext);
  const { accessChat } = context;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [search, setsearch] = useState("");
  const [users, setusers] = useState([]);
 

  const onChange = async (e) => {
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
    setusers(userrs);
    if (!e.target.value) {
      setusers([]);
    }
  };

  return (
    <nav className="flex flex-col items-center justify-between  w-20 px-6 py-10 text-white  bg-[rgb(27,27,27)] ">
      <img alt="" className="w-20" src={logo}></img>
      <div className="space-y-4">
      <i onClick={onOpen} className="text-[rgb(111,111,111)] ml-2 text-lg cursor-pointer fa-solid fa-magnifying-glass"></i>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg={"rgb(36,36,36)"} color={"white"}>
          <DrawerCloseButton />
          <DrawerHeader>Search for Chat</DrawerHeader>
          <DrawerBody>
            <Input
              onChange={onChange}
              value={search}
              placeholder="Type here..."
            />
            <div className="flex mt-6 flex-col space-y-3">
              {users.map((user) => {
                return (
                  <div
                    onClick={() => {
                      accessChat(user._id);
                      onClose();
                    }}
                    className="flex cursor-pointer  items-center space-x-2"
                    key={user._id}
                  >
                    <img className="w-12 rounded-full h-12" alt="" src={user.avtar}></img>
                    <p>{user.name}</p>
                  </div>
                );
              })}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <GroupCreation />
      </div>
      <div className="flex flex-col space-y-3">
      <i className=" text-[rgb(111,111,111)] ml-2 text-xl cursor-pointer fa-regular fa-bell"></i>
      <p className="font-semibold text-2xl"></p>
        <Profile />
        </div>
    </nav>
  );
}
