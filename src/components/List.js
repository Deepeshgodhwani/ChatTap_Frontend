import React, {useContext} from 'react'


import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
  } from '@chakra-ui/react'
import ChatContext from '../context/user/ChatContext';


function List(props) {

    const {Profile,groupMembers,setgroupMembers}=props;
    const context = useContext(ChatContext);
        const {logUser,createNoty,groupMessages,setgroupMessages,recentChats,
            setrecentChats,socket }=context;
        const { isOpen, onOpen, onClose } = useDisclosure()
    const removeFromGroup= async(User)=>{
        let token =localStorage.getItem('token');
        const response=await fetch(`http://localhost:7000/api/chat/removeUser?chatId=${Profile._id}&userId=${User._id}`,
        {
          method:'GET',
          mode:"cors" ,
          headers: {
            'Content-Type':'application/json',
            'auth-token':token
          },
        })
      
        let data=await response.json();
        let message="removed "+ User.name;
        let noty=await createNoty(Profile._id,message);
        socket.emit("new_message",noty);
         let status={users:[{user:User._id}],status:"remove"};
        socket.emit("member_status",status);
        let updatedChat;
              let chats=recentChats;
              chats=chats.filter((Chat)=>{
              if(Chat._id===noty.chatId._id){
                   Chat.latestMessage=noty;
                   updatedChat=Chat;
              }
               return Chat._id!==noty.chatId._id;
             });
        setrecentChats([updatedChat,...chats]);
        setgroupMessages([...groupMessages,noty]);
        
        if(data.success){
             setgroupMembers(groupMembers.filter((member)=>{
                 return member.user._id!==User._id;
             }))
        }
      }
         
    
  return (
    <div>

         <p onClick={onOpen} className='text-[rgb(36,141,97)] cursor-pointer font-semibold text-sm underline '>Show all</p>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width={"96"}  bg="rgb(36,36,36)">
            <ModalHeader textColor={"white"}>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <div className='space-y-2  max-h-60 chatBox mt-2   py-1 text-[rgb(240,240,240)]'>


     <div className='flex relative   space-x-2 items-center'>
            <img alt='' className='w-11 rounded-full h-11' src={Profile.admin.avtar}></img>
            <div className='flex'>
            <p className=' text-base font-semibold'>{logUser._id===Profile.admin._id?"You":Profile.admin.name}</p>
            <p className='text-xs absolute right-0  py-[5px] font-bold px-2 rounded-md  text-white
            bg-[rgb(53,55,59)] '>Group Admin</p>
            </div>
        </div>
        {groupMembers.map((members)=>{
  
         return !members.isRemoved&&members.user._id!==Profile.admin._id?(<div key={members.user._id} className='flex cursor-pointer space-x-2 relative items-center'>
            <img alt='' className='w-10 rounded-full h-10' src={members.user.avtar}></img>
            <p className=' text-sm font-semibold'>{logUser._id===members.user._id?"You":members.user.name}</p>

            {logUser._id===Profile.admin._id&&<div className=' cursor-pointer right-0 absolute'>
            <i onClick={()=>{removeFromGroup(members.user)}} className=" text-white fa-solid fa-ellipsis"></i>
            </div>}
        </div>):(<div key=""></div>)
        })}
        </div>
            </ModalBody>
                 
        </ModalContent>
        </Modal>
    </div>
  )
}

export default List;
