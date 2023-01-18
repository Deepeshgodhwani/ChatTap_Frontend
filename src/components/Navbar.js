import React from "react";
import { useContext } from "react";
import logo from "../images/meetme.png";
import GroupCreation from './GroupCreation';
import {  Spinner } from '@chakra-ui/react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
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
  const [loading, setloading] = useState(false);
  const [search, setsearch] = useState("");
  const [users, setusers] = useState([]);
  const [result, setresult] = useState(true);
 

  const onChange = async (e) => {
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
     if(!userrs.length){
        setresult(false);
     }else{
       setusers(userrs);
       setresult(true);
     }

    if (!e.target.value) {
      setusers([]);
    }  
  };

  const closeTheTab =()=>{
     setusers([]);
     setsearch("");
     setloading(false);
     setresult(true);
     onClose();
  }


  return (
    <nav className="flex flex-col items-center justify-between  w-20 px-6 py-10 text-white  bg-[rgb(27,27,27)] ">
      <img alt="" className="w-20" src={logo}></img>
      <div className="space-y-4">
      <i onClick={onOpen}  className=" text-[rgb(111,111,111)] ml-2 text-lg cursor-pointer fa-solid fa-pen-to-square"></i>
      
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={closeTheTab}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent overflow={"hidden"} bg={"rgb(27,27,27)"} color={"white"}>
          <DrawerHeader bg={"rgb(36,36,36)"}>
          <div className="flex justify-between">
            Search for chat
             <i onClick={closeTheTab} className="fa-solid cursor-pointer text-xl mt-[1px] fa-xmark"></i>
            </div>
          </DrawerHeader>
          <DrawerBody paddingTop={"7"} overflow={"hidden"}>
            <Input
              onChange={onChange}
              value={search}
              placeholder="Type here..."
            />
           { loading&&<div className="h-96  flex justify-center items-center">
              <Spinner />
            </div>}
            {!loading&&result&&<div className="flex h-[77vh] overflow-y-scroll chatBox mt-6 flex-col space-y-3">
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
            </div>}
            {!result&&<div className="text-white h-96  flex justify-center items-center">No result found</div>}
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
