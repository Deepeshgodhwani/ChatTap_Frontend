import React, { useState,useContext } from 'react'
import {
    Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,
    ModalBody,ModalCloseButton,useDisclosure,FormControl,FormLabel,
    Input,Button,} from '@chakra-ui/react'
import ChatContext from '../context/user/ChatContext'



function GroupCreation() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [search, setsearch] = useState("")
    const [users, setusers] = useState([]);
    const context = useContext(ChatContext);
    const {user}=context;
    const [selectedUsers, setselectedUsers] = useState([]);
    const [seletecUsersId, setseletecUsersId] = useState([]);


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

    const collectUser =(selectedUser)=>{
        let isExist=false;
        selectedUsers.forEach(User=>{
            if(User._id===selectedUser._id) isExist=true;
        })

        if(isExist) return ;

        setselectedUsers([...selectedUsers,selectedUser]);
        setseletecUsersId([...seletecUsersId,selectedUser._id]); 
    }

    const removeUser =()=>{
          
    }

    
      
  return (
    <div>
        <p onClick={onOpen} className=' border-blue-900 cursor-pointer rounded-[5px] px-2 pt-1 font-semibold'>New Group Chat</p>
        <Modal
    initialFocusRef={initialRef}
    finalFocusRef={finalRef}
    isOpen={isOpen}
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Create your account</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Chat name</FormLabel>
          <Input ref={initialRef} placeholder='Chat name' />
        </FormControl>
        <div className='flex flex-wrap space-x-1 my-2'>{selectedUsers.map((user)=>{
          return(<div className='px-2 py-1 space-x-1 justify-between items-center flex  rounded-lg text-xs text-white 
          bg-[rgb(255,108,55)]' key={user._id}><p>{user.name}</p><i onClick={(e)=>{removeUser(user)}} className=" cursor-pointer fa-solid fa-xmark"></i></div>)
        })}</div>
        <FormControl mt={4}>
          <FormLabel>Users</FormLabel>
          <Input onChange={onChange} value={search} placeholder='Type here...' />
        </FormControl>
        <div className='flex flex-col space-y-1 my-2'>{users.map((user)=>{
          return(<div onClick={(e)=>{collectUser(user)}} className='px-2 cursor-pointer py-1 space-x-1 w-56 justify-center items-center flex  rounded-lg text-sm text-white bg-[rgb(86,160,215)]' key={user._id}><p>{user.name}</p></div>)
        })}</div>
      </ModalBody>

      <ModalFooter>
        <Button  colorScheme='blue' mr={3}>
          Create
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </ModalContent>
     </Modal>
    </div>
  )
}

export default GroupCreation