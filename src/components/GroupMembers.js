import React ,{ useState ,useEffect} from 'react'
import List from "../components/List";

import {
  Modal,ModalOverlay,ModalContent,
  ModalBody,useDisclosure,FormControl,useToast, Spinner} from '@chakra-ui/react'
  import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from '@chakra-ui/react'
import { useContext } from 'react';
import ChatContext from '../context/chat/ChatContext';
import MessageContext from '../context/messages/MessageContext';
let delay=true;


function GroupMembers(props) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {Profile,socket}=props;
    const initialRef = React.useRef(null)
    const context = useContext(ChatContext);
    const {logUser,createNoty,groupMessages,setgroupMessages,recentChats,
      setrecentChats,groupMembers,setgroupMembers,accessChat}=context;
    const finalRef = React.useRef(null)
    const [search, setsearch] = useState("")
    const [users, setusers] = useState([]);
    const [selectedUsers, setselectedUsers] = useState([]);
    const [selectedUsersId, setselectedUsersId] = useState([]);
    const[renderMembers, setrenderMembers] = useState([]);
    const [loading, setloading] = useState(false);
    const contextMsg=useContext(MessageContext);
    const {encryptData}=contextMsg;
    const toast = useToast(); 

       
    

    useEffect(() => {
        if(groupMembers.length>4){
          setrenderMembers(groupMembers.slice(0,4));
        }else{
           setrenderMembers(groupMembers);
        }
    }, [groupMembers])


    const onChange =async(e)=>{
        setloading(true);
        setsearch(e.target.value); 
        try {
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
          
        } catch (error) {
          toast({
            description: "Internal server error",
            status: 'warning',
            duration: 1000,
            isClosable: true,
          })  
        }
        setloading(false);
    }
   

    const collectUser =(selectedUser)=>{
    let isExist=false;
    groupMembers.forEach(members=>{
      if(members.user._id===selectedUser._id){
          isExist=true;
      } 
    })

    if(isExist){
      toast({
        description: "User is already exist in group",
        status: 'warning',
        duration: 1000,
        isClosable: true,
      })
    }else{
      selectedUsers.forEach(members=>{
        if(members.user._id===selectedUser._id) isExist=true;
      })
    }

    if(!isExist){
      setselectedUsers([...selectedUsers,{user:selectedUser,unseenMsg:0}]);
      setselectedUsersId([...selectedUsersId,{user:selectedUser._id}]); 
      setsearch("");
      setusers([]);
    }
    }

  
    const removeUser =(user)=>{
      setselectedUsers(selectedUsers.filter((members)=>{
          return members.user._id!==user._id;
      }))
    
      setselectedUsersId(selectedUsersId.filter((members)=>{
        return members.user!==user._id;
      }))
    }
    
    
    const addUsers=async()=>{
      if(!delay) return ;
      delay=false;
      onClose();

      try {
        let token =localStorage.getItem('token');
        const response=await fetch(`http://localhost:7000/api/chat/addUser`,
        {
          method:'POST',
          mode:"cors" ,
          headers: {
            'Content-Type':'application/json',
            'auth-token':token
          },
          body:JSON.stringify({chatId:Profile._id,usersId:selectedUsersId})
        })
      
        let data=await response.json();
        if(data.success){
          let message="added ";
          selectedUsers.forEach(member=>{
            message=message.concat(member.user.name);
            message= message.concat(', ');
          })
    
          message=message.slice(0,message.length-2);
          let encryptedMessage=encryptData(message);
          let noty=await createNoty(Profile._id,encryptedMessage);
          socket.emit("new_message",noty);
          socket.emit("update_Chatlist",noty);
          let status={users:selectedUsersId,chat:Profile,status:"add"};
          socket.emit("member_status",status);
          let dataSend={group:Profile,members:selectedUsers,status:"add"};
          setgroupMembers(groupMembers.concat(selectedUsers));  
          setgroupMessages([...groupMessages,noty]);
          socket.emit("change_users",dataSend);
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
          setselectedUsers([]);
          setselectedUsersId([]);
        }
      } catch (error) {
        toast({
          description: "Internal server error",
          status: 'warning',
          duration: 1000,
          isClosable: true,
        })   
      }
      delay=true;
    }
    
    
    const removeFromGroup= async(User)=>{
      try {
        
      } catch (error) {
        
      }
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
      if(data.success){
        let message="removed "+ User.name;
        let encryptedMessage=encryptData(message);
        let noty=await createNoty(Profile._id,encryptedMessage);
        noty.removedUserId=User._id;
        socket.emit("new_message",noty);
        socket.emit("update_Chatlist",noty);
        let status={users:[{user:User._id}],chat:Profile,status:"remove"};
        socket.emit("member_status",status);
        let dataSend={group:Profile,members:User,status:"remove"};
        socket.emit("change_users",dataSend);
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
        setgroupMembers(groupMembers.filter((member)=>{
              return member.user._id!==User._id;
        }))
      }
    }


    const setSingleChat=async(User)=>{
        let element=await accessChat(User._id);
          setrecentChats(recentChats.map(chat=>{
          if(chat._id===element._id){
                chat.users.map(members=>{
                    if(members.user._id===logUser._id){
                        members.unseenMsg=0;
                    }
                })

                return chat;
          }else{
              return chat;
          }
        })) 
    }


    const closeTab =()=>{
        setsearch("");
        setselectedUsers([]);
        setselectedUsersId([]);
        setusers([])
        setloading(false);
        onClose();
    }



  return (
    <div className=''>
         <div className='flex pt-4 px-8   justify-between'>
               <div className='flex   space-x-2'>
                <img alt='' className='w-5 h-5' src={"https://res.cloudinary.com/dynjwlpl3/image/upload/v1675095423/Chat-app/group_iu5tv2.png"}></img>
                <p className='text-[rgb(167,169,171)] text-sm font-semibold'>MEMBER ({groupMembers.length})</p>
               </div>
               {groupMembers.length>4&&<List groupMembers={groupMembers} socket={socket} setgroupMembers={setgroupMembers} Profile={Profile} logUser={logUser}/>}
              </div>
              <div className=' chatBox mt-4  text-[rgb(240,240,240)]'>
                {logUser._id===Profile.admin._id&&<div onClick={()=>{
                  onOpen()}} className='flex hover:bg-[rgb(44,44,44)] py-[5px] px-4 items-center cursor-pointer space-x-2'>
                 
                 <div className='bg-[rgb(34,134,92)]  py-2 px-2  rounded-full'>
                  <img className='w-6  rounded-full' alt='' src={"https://res.cloudinary.com/dynjwlpl3/image/upload/v1675014391/Chat-app/add-user_zetp43.png"}></img>
                  </div>
                  
                  <p className=' text-sm font-semibold'>Add member</p>
                </div>}
                <Modal
                  initialFocusRef={initialRef}
                  finalFocusRef={finalRef}
                  isOpen={isOpen}
                  onClose={closeTab}
                >
                  <ModalOverlay />
                  <ModalContent bg={"rgb(27,27,27)"} top={`${selectedUsers.length?"-5":"4"}`} position="relative" textColor="white" minHeight={"26rem"}  maxHeight={'35rem'}
                   width={`${window.innerWidth<768?"21rem":"26rem"}`}>
                    <div className='flex bg-[rgb(36,36,36)] py-2  text-xl px-4 items-center space-x-6 '>
                    <i onClick={closeTab} className=" cursor-pointer text-[rgb(111,111,111)] fa-solid fa-xmark"></i>
                      <p className='font-semibold'>Add members</p>
                    </div>
                    <ModalBody padding={"0"}>
                      <FormControl mt={4}>
                        <div className='flex px-6   overflow-y-scroll styleScroll  max-h-16 flex-wrap gap-y-1 gap-x-1 my-2'>{selectedUsers.map((members)=>{
                        return members.user._id!==logUser._id?(<div className='px-2 py-1  space-x-2  items-center flex  rounded-lg text-xs text-white 
                        bg-[rgb(61,61,61)]' key={members.user._id}>
                          <p>{members.user.name}</p>
                          {<i onClick={(e)=>{removeUser(members.user)}} className="cursor-pointer mt-1 fa-solid fa-xmark"></i>}
                          </div>):(<div></div>)
                      })}</div>
                   <input onChange={onChange} value={search}  className={`mx-6 border-[rgb(156,150,150)] px-4 outline-none 
                   ${window.innerWidth<768?"w-[18rem]":"w-[22.5rem]"} py-2
                    rounded-lg border-2  bg-transparent text-white`}   placeholder='Enter names or email address'></input>
                      </FormControl>
                      {loading&&<div className=' absolute top-48 left-44 '>
                        <Spinner size={'lg'}/>
                        </div>}
                      <div className='flex mt-4 flex-col overflow-y-scroll h-72 styleScroll my-2'>{users.map((user)=>{
                        return(<div  onClick={(e)=>{collectUser(user)}}  className='space-x-2 px-8 py-1 hover:bg-[rgb(58,58,58)]   cursor-pointer items-center flex ' key={user._id}>
                         <img alt='' className='w-12 rounded-full h-12' src={user.avtar}></img>
                         <p className=' text-base font-semibold'>{user.name}</p>
                          </div>)
                      })}</div>
                     {selectedUsers.length>=1&&<span onClick={addUsers} className='py-2 px-3 cursor-pointer absolute bottom-5 right-6 rounded-full bg-[rgb(38,141,97)]'><i className="fa-solid fa-check"></i></span>}
                    </ModalBody>
                  </ModalContent>
             </Modal>
              <div onClick={()=>{logUser._id!==Profile.admin._id&&setSingleChat(Profile.admin)}} className='flex cursor-pointer relative py-[5px]
              px-4  hover:bg-[rgb(44,44,44)]  space-x-2 items-center'>
                    <img alt='' className='w-11 rounded-full h-11' src={Profile.admin.avtar}></img>
                    <div className='flex'>
                    <p className=' text-base font-semibold'>{logUser._id===Profile.admin._id?"You":Profile.admin.name.length>15?Profile.admin.name.slice(0,15)+"..":Profile.admin.name}</p>
                    <p className='text-xs absolute right-2  py-[5px] font-bold px-2 rounded-md  text-white
                     bg-[rgb(53,55,59)] '>Group Admin</p>
                    </div>
               </div>
                {renderMembers.map((members)=>{
                   return !members.isRemoved&&members.user._id!==Profile.admin._id?(<div key={members.user._id} className='flex hover:bg-[rgb(44,44,44)] group cursor-pointer space-x-2 
                   relative py-[5px] px-4 items-center'>
                    <img onClick={()=>{setSingleChat(members.user)}}  alt='' className='w-11 rounded-full h-11' src={members.user.avtar}></img>
                    <p onClick={()=>{setSingleChat(members.user)}}  className=' text-sm font-semibold'>{logUser._id===members.user._id?"You":members.user.name}</p>
                    {logUser._id===Profile.admin._id&&<div className=' cursor-pointer group-hover:flex hidden right-4 absolute'>
                       <Popover>
                        <PopoverTrigger>
                        <i className=" text-white fa-solid fa-ellipsis"></i>
                        </PopoverTrigger>
                          <PopoverContent className='focus:outline-none' bg={"rgb(49,49,49)"} outline="none" textAlign={"center"} borderColor={"rgb(75,75,75)"} width={"24"} >
                            <p className='text-sm border-[rgb(75,75,75)] hover:bg-[rgb(58,58,58)]  border-b-[1px] py-1 ' onClick={()=>{removeFromGroup(members.user)}}>Remove</p>
                            <p onClick={()=>{setSingleChat(members.user)}}  className='text-sm hover:bg-[rgb(58,58,58)] py-1'>View profile</p> 
                          </PopoverContent>
                      </Popover>
                    </div>}
                  </div>):(<div key=""></div>)
                })}
                </div>
        </div>
  )
}

export default GroupMembers
