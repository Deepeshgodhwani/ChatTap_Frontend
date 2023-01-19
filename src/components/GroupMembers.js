import React ,{ useState ,useEffect} from 'react'
import createGroupLogo from '../images/add-user.png';
import grpLogo from "../images/group.png";
import List from "../components/List";

import {
  Modal,ModalOverlay,ModalContent,
  ModalBody,useDisclosure,FormControl,
  Input,useToast} from '@chakra-ui/react'
import { useContext } from 'react';
import ChatContext from '../context/user/ChatContext';




function GroupMembers(props) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {Profile,groupMembers, setgroupMembers}=props;
    const initialRef = React.useRef(null)
    const context = useContext(ChatContext);
    const {logUser,createNoty,groupMessages,setgroupMessages,recentChats,
      setrecentChats,socket }=context;
    const finalRef = React.useRef(null)
    const [search, setsearch] = useState("")
    const [users, setusers] = useState([]);
    const [selectedUsers, setselectedUsers] = useState([]);
    const [selectedUsersId, setselectedUsersId] = useState([]);
    const[renderMembers, setrenderMembers] = useState([]);
    const toast = useToast(); 


    useEffect(() => {
    
        if(Profile.isGroupChat){
           setgroupMembers(Profile.users);
        }
       // eslint-disable-next-line 
     }, [])


     useEffect(() => {
        if(groupMembers.length>4){
          setrenderMembers(groupMembers.slice(0,4));
        }else{
           setrenderMembers(groupMembers);
        }

     }, [groupMembers])
     

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
       
    groupMembers.forEach(members=>{
       console.log(members.user ,"and",selectedUser._id);
      if(members.user._id===selectedUser._id){
          isExist=true;
      } 
    })
  
    selectedUsers.forEach(User=>{
      if(User._id===selectedUser._id) isExist=true;
    })
  
    if(isExist){
      
      toast({
        description: "User is already exist in group",
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
  
      return ;
    }
  
    setselectedUsers([...selectedUsers,{user:selectedUser,unseenMsg:0}]);
    setselectedUsersId([...selectedUsersId,{user:selectedUser._id}]); 
    setsearch("");
    setusers([]);
  }
  
  const removeUser =(user)=>{
    setselectedUsers(selectedUsers.filter((members)=>{
        return members.user._id!==user._id;
    }))
  
    setselectedUsersId(selectedUsersId.filter((User)=>{
      return User!==user._id;
    }))
  }
  

  
  
  const addUsers=async()=>{
    
    let token =localStorage.getItem('token');
    console.log("checking at add user");
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
       let noty=await createNoty(Profile._id,message);
       socket.emit("new_message",noty);
       let status={users:selectedUsersId,status:"add"};
       socket.emit("member_status",status);
       let dataSend={group:Profile,newMembers:selectedUsers};
       setgroupMembers(groupMembers.concat(selectedUsers));  
       setgroupMessages([...groupMessages,noty]);
       socket.emit("added_users",dataSend);
       setselectedUsers([]);
       setselectedUsersId([]);
       onClose();
    }
  }
   
  
  const removeFromGroup= async(User)=>{
    console.log("checking at remove user");
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
         <div className='flex pt-4 px-8 justify-between'>
               <div className='flex  space-x-2'>
                <img alt='' className='w-5 h-5' src={grpLogo}></img>
                <p className='text-[rgb(167,169,171)] text-sm font-semibold'>MEMBER ({groupMembers.length})</p>
               </div>
               {groupMembers.length>4&&<List groupMembers={groupMembers} setgroupMembers={setgroupMembers} Profile={Profile} logUser={logUser}/>}
              </div>
              <div className='  max-h-60   chatBox mt-4  text-[rgb(240,240,240)]'>
                {logUser._id===Profile.admin._id&&<div onClick={()=>{
                  onOpen()}} className='flex hover:bg-[rgb(44,44,44)] py-[5px] px-4 items-center cursor-pointer space-x-2'>
                 
                 <div className='bg-[rgb(34,134,92)]  py-2 px-2  rounded-full'>
                  <img className='w-6  rounded-full' alt='' src={createGroupLogo}></img>
                  </div>
                  
                  <p className=' text-sm font-semibold'>Add member</p>
                </div>}
                <Modal
                  initialFocusRef={initialRef}
                  finalFocusRef={finalRef}
                  isOpen={isOpen}
                  onClose={onClose}
                >
                  <ModalOverlay />
                  <ModalContent bg={"rgb(27,27,27)"} position="relative" textColor="white" width={'80'}>
                    <div className='flex bg-[rgb(36,36,36)] py-2  text-xl px-4 items-center space-x-6 '>
                    <i onClick={()=>{onClose()}} className=" cursor-pointer text-[rgb(111,111,111)] fa-solid fa-xmark"></i>
                      <p className='font-semibold'>Add members</p>
                    </div>
                    <ModalBody pb={5}>
                      <FormControl mt={4}>
                        <div className='flex flex-wrap gap-y-1 gap-x-1 my-2'>{selectedUsers.map((members)=>{
                        return members.user._id!==logUser._id?(<div className='px-2 py-1  space-x-1 justify-between items-center flex  rounded-lg text-xs text-white 
                        bg-[rgb(255,108,55)]' key={members.user._id}>
                          <p>{members.user.name}</p>
                          {<i onClick={(e)=>{removeUser(members.user)}} className="cursor-pointer fa-solid fa-xmark"></i>}
                          
                          </div>):(<div></div>)

                      })}</div>
                        <Input onChange={onChange} value={search}   placeholder='Search...' />
                      </FormControl>
                      <div className='flex flex-col space-y-2 py-2 my-2'>{users.map((user)=>{
                        return(<div  onClick={(e)=>{collectUser(user)}}  className='space-x-2 w-56  cursor-pointer items-center flex ' key={user._id}>
                         <img alt='' className='w-11 rounded-full h-11' src={user.avtar}></img>
                         <p className=' text-base font-semibold'>{user.name}</p>
                          </div>)
                      })}</div>
                     {selectedUsers.length>=1&&<span onClick={addUsers} className='py-1 px-2 absolute bottom-0 right-0 rounded-full bg-[rgb(38,141,97)]'><i className="fa-solid fa-check"></i></span>}
                    </ModalBody>
                  </ModalContent>
             </Modal>
              <div className='flex relative py-[5px] px-4 hover:bg-[rgb(44,44,44)]  space-x-2 items-center'>
                    <img alt='' className='w-11 rounded-full h-11' src={Profile.admin.avtar}></img>
                    <div className='flex'>
                    <p className=' text-base font-semibold'>{logUser._id===Profile.admin._id?"You":Profile.admin.name}</p>
                    <p className='text-xs absolute right-2  py-[5px] font-bold px-2 rounded-md  text-white
                     bg-[rgb(53,55,59)] '>Group Admin</p>
                    </div>
               </div>
                {renderMembers.map((members)=>{
                   return !members.isRemoved&&members.user._id!==Profile.admin._id?(<div key={members.user._id} className='flex hover:bg-[rgb(44,44,44)] group cursor-pointer space-x-2 
                   relative py-[5px] px-4 items-center'>
                    <img alt='' className='w-11 rounded-full h-11' src={members.user.avtar}></img>
                    <p className=' text-sm font-semibold'>{logUser._id===members.user._id?"You":members.user.name}</p>

                    {logUser._id===Profile.admin._id&&<div className=' cursor-pointer group-hover:flex hidden right-4 absolute'>
                       <i onClick={()=>{removeFromGroup(members.user)}} className=" text-white fa-solid fa-ellipsis"></i>
                    </div>}

                   {/* <div  className=' dropdown bg-[rgb(53,55,59)] hidden   right-1 -bottom-3 absolute px-7  py-1 '>
                    <p className='text-sm font-semibold'>Remove</p>
                    </div> */}
                  </div>):(<div key=""></div>)
                })}
                </div>
        </div>
  )
}

export default GroupMembers
