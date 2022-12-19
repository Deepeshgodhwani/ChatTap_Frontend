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
        className="object-cover rounded-full  cursor-pointer h-9  w-14"
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
          <DrawerBody bg={"rgb(27,27,27)"}>
            <div className='flex justify-center py-8'>
            <img alt='' className='rounded-full h-48 w-48' src={user.avtar}></img>
            </div>
            <div></div>
          </DrawerBody>
        </DrawerContent> 
      </Drawer>
      
    </div>
  )
}

export default Profile
