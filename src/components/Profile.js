import React,{useContext,useEffect,useState} from 'react'
import { useHistory } from "react-router-dom";


import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
import ChatContext from '../context/user/ChatContext'

function Profile() {
    let history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const context = useContext(ChatContext);
    const {  setchatroom } = context;
    const [user, setuser] = useState("");

 

    const setUser = () => {
      let logUser = JSON.parse(localStorage.getItem("user"));
      setuser(logUser);
    };
  
    useEffect(() => {
      setUser();
      // eslint-disable-next-line
    }, []);


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setchatroom({});
        history.push("/");
    };


  return (
    <div>
      <img
        ref={btnRef}
        alt=""
        onClick={onOpen}
        src={user.avtar}
        className=" rounded-lg  cursor-pointer h-10 w-10"
        ></img>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent textColor={"white"} bg={"rgb(36,36,36)"}>
          <DrawerCloseButton />
          <DrawerHeader>Profile</DrawerHeader>
            <div className='flex h-[90vh] px-2 flex-col bg-[rgb(27,27,27)] '>
              <div className='flex  justify-center py-8'>
                 <img alt='' className='rounded-full h-48 w-48' src={user.avtar}></img>
              </div>
              <div className='flex px-2 flex-col space-y-2'>
                  <p className='text-[rgb(9,128,93)] font-semibold'>Your name</p>
                  <div className='justify-center  flex relative'>
                  <input className='bg-transparent border-b-[1px] border-[rgb(36,36,36)] py-[2x] outline-none  w-72' type={"text"} value={user.name} placeholder={user.name}></input>
                  <i class="absolute text-[rgb(87,87,87)]  right-0 fa-solid fa-pen"></i>
                  </div>
              </div>
            </div>
            <div></div>
        </DrawerContent> 
      </Drawer>
      
    </div>
  )
}

export default Profile
