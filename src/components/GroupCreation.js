import React, { useState,useContext} from 'react'
import {
    Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,
    ModalBody,ModalCloseButton,useDisclosure,FormControl,FormLabel,
    Input,Button,} from '@chakra-ui/react'
import ChatContext from '../context/user/ChatContext'
import createGroupLogo from '../images/createGroup.png';





function GroupCreation() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [search, setsearch] = useState("")
    const [users, setusers] = useState([]);
    const context = useContext(ChatContext);
    const {setchatroom,setrecentChats,recentChats,createNoty,socket,setgroupPic,setgroupName}=context;
    const [selectedUsers, setselectedUsers] = useState([]);
    const [selectedUsersId, setselectedUsersId] = useState([]);
    const [groupPicture, setgroupPicture] = useState("https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png");
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
        let userObj={user:selectedUser._id};
        setselectedUsersId([...selectedUsersId,userObj]); 
        setsearch("");
        setusers([]);
      }
      
     
    const removeUser =(user)=>{
        setselectedUsers(selectedUsers.filter((User)=>{
            return User._id!==user._id;
        }))

        setselectedUsersId(selectedUsersId.filter((User)=>{
          return User.user!==user._id;
        }))
    }

    const UploadPic = async (e) => {
      // setloading(true);
      if (
        e.target.files[0] &&
        (e.target.files[0].type === "image/jpeg" ||
          e.target.files[0] === "image/png")
      ) {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("upload_preset", "chat_app");
        formData.append("cloud_name", "dynjwlpl3");
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dynjwlpl3/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
         let pic = await response.json();
         let picture = pic.url.toString();
         setgroupPicture(picture);

        }
      }   
    
     console.log(groupPicture)
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
        body:JSON.stringify({chatName,selectedUsersId,groupPicture})
      })

      let data=await response.json();
      let message="created group "+data.chatname;
      let latestMessage=await createNoty(data._id,message);
      data.latestMessage=latestMessage;
      setchatroom(data);
      setgroupPic(data.profilePic);
      setgroupName(data.chatname);
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
          <div className='flex group  items-center relative justify-center py-8 rounded-full'>
          <img alt='' className='w-40 rounded-full' src={groupPicture}></img>
          <input
                onChange={UploadPic}
                className="  inputFile absolute top-10 h-36 opacity-70
           text-white rounded-full justify-center items-center  bg-black w-36"
                type="file"
              ></input>
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