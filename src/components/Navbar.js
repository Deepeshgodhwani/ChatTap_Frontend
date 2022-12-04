import React from 'react'
import { useContext } from 'react';
import { useHistory } from 'react-router-dom'
import UserContext from '../context/user/ChatContext';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
} from '@chakra-ui/react'
import { useState } from 'react';
import { useEffect } from 'react';

export default function Navbar() {
     let history=useHistory();
     const context = useContext(UserContext);
     const {accessChat}=context; 
     const { isOpen, onOpen, onClose } = useDisclosure()
     const btnRef = React.useRef()
     const [search, setsearch] = useState("")
     const [users, setusers] = useState([]);
     const [user, setuser] = useState("")

     
     const logout=()=>{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            history.push('/');
     }
   
     const setUser=()=>{
        let logUser=JSON.parse(localStorage.getItem('user')); 
        setuser(logUser);
     }

     useEffect(() => {
     
        setUser();
        // eslint-disable-next-line
       
     }, [])
     

     const onChange =async(e)=>{
         setsearch(e.target.value); 
        let token =localStorage.getItem('token');
        const response=await fetch(`http://localhost:7000/api/chat/searchUser?search=${e.target.value}`,
        {
          method:'GET',
          mode:"cors" ,
          headers: {
            'Content-Type':'application/json',
            'auth-token':token
          },
        })

        let userrs= await response.json();
        setusers(userrs);
        if(!e.target.value){
          setusers([]);
        }
       
     }


  return (
    
    <nav className='flex px-6 py-2  justify-between bg-white '>
         <p className='font-semibold'>{user.name} </p>
         <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Search
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search for Chat</DrawerHeader>

          <DrawerBody>
            <Input onChange={onChange} value={search} placeholder='Type here...' />
            <div className='flex mt-6 flex-col space-y-3'>
              {users.map((user)=>{
                return (<div onClick={()=>{accessChat(user._id)}} className='flex cursor-pointer  items-center space-x-2' key={user._id}>
                    <img className='w-10' alt='' src={user.avtar}></img>
                    <p>{user.name}</p>
                </div>)
              })}
            </div>
          </DrawerBody>

        </DrawerContent>
       </Drawer>
 
         <p className='font-semibold text-2xl'>Talk-A-Tive</p>
         <img alt='' onClick={logout}   src={user.avtar}
             className='object-cover rounded-[50%]  cursor-pointer h-[100%] w-[30px]'></img>
    </nav>
  )
}
