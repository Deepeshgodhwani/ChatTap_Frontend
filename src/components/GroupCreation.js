import React, { useState,useContext} from 'react'
import {
    Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,
    ModalBody,ModalCloseButton,useDisclosure,FormControl,FormLabel,
    Input,Button,} from '@chakra-ui/react'
import ChatContext from '../context/user/ChatContext'
import createGroupLogo from '../images/createGroup.png';
import cameraLogo from '../images/camera.png';




function GroupCreation() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [search, setsearch] = useState("")
    const [users, setusers] = useState([]);
    const context = useContext(ChatContext);
    const {setchatroom,setrecentChats,recentChats,createNoty,socket}=context;
    const [selectedUsers, setselectedUsers] = useState([]);
    const [selectedUsersId, setselectedUsersId] = useState([]);
    const [chatName, setchatName] = useState("");


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
        setselectedUsersId([...selectedUsersId,selectedUser._id]); 
        setsearch("");
        setusers([]);
    }

    const removeUser =(user)=>{
        setselectedUsers(selectedUsers.filter((User)=>{
            return User._id!==user._id;
        }))

        setselectedUsersId(selectedUsersId.filter((User)=>{
          return User!==user._id;
        }))
    }


    

   const createGroup =async ()=>{
      let token =localStorage.getItem('token');
      const response=await fetch('http://localhost:7000/api/chat/createGroup',
      {
        method:'POST',
        mode:"cors" ,
        headers: {
          'Content-Type':'application/json',
          'auth-token':token
        },
        body:JSON.stringify({chatName,selectedUsersId})
      })

      let data=await response.json();
      let message="created group "+data.chatname;
      let latestMessage=await createNoty(data._id,message);
      data.latestMessage=latestMessage;
      setchatroom(data);
      socket.emit("group_created",data);
      setrecentChats([data,...recentChats]);
      setselectedUsers([]);
      setselectedUsersId([]);
      setchatName("");
      onClose();
   }
    
      
  return (
    <div>
        {/* <p  className=' border-blue-900 cursor-pointer rounded-[5px] px-2 pt-1 font-semibold'>New Group Chat</p> */}
        <img onClick={onOpen} alt='' className='w-20 cursor-pointer' src={createGroupLogo}></img>
        <Modal
    initialFocusRef={initialRef}
    finalFocusRef={finalRef}
    isOpen={isOpen}
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent   bg={"rgb(36,36,36)"} color={"white"}>
      <ModalHeader>New group</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <div className='flex flex-col gap-y-2 items-center'>
          <div className='relative w-40  rounded-full'>
          <img alt='' className='w-40' src='https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png'></img>
           <div className='absolute opacity-40 top-0 bg-black w-40 h-40 rounded-full'><img alt='' className='w-12 ' src={cameraLogo}></img></div>
          </div>
          <input className='w-52 outline-none bg-transparent px-1 border-[rgb(46,121,95)] border-b-2' onChange={(e)=>{setchatName(e.target.value)}} value={chatName} ref={initialRef} placeholder='Chat name' /> 
        </div>
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
        <Button onClick={createGroup}  colorScheme='blue' mr={3}>
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