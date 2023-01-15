import React, { useState,useContext,} from 'react'
import { useToast } from "@chakra-ui/react";

import {
    useDisclosure,FormControl,
    Input,Spinner} from '@chakra-ui/react'

    import {
      Drawer,
      DrawerBody,
      DrawerHeader,
      DrawerOverlay,
      DrawerContent,
      
    } from '@chakra-ui/react'
import createGroupLogo from '../images/createGroup.png';



import ChatContext from '../context/user/ChatContext'





function GroupCreation() {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const [search, setsearch] = useState("")
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(false);
  const [result, setresult] = useState(true);
  const context = useContext(ChatContext);
  const {setchatroom,setrecentChats,recentChats,createNoty,socket,setgroupPic,setgroupName}=context;
    const [groupPicture, setgroupPicture] = useState("https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png");
    const [chatName, setchatName] = useState("");
    const [phase, setphase] = useState(1);
    const [isPicture, setisPicture] = useState(false);
    const toast = useToast();
   

    
    const [selectedUsers, setselectedUsers] = useState([]);
    const [selectedUsersId, setselectedUsersId] = useState([]);


    const onChange =async(e)=>{
      setloading(true);
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
       
       setloading(false);
       let userrs= await response.json();
       if(!userrs.length){
         setresult(false);
       }else{
         setusers(userrs);
         setresult(true);
       }
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
      setloading(true);
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
         setisPicture(true);
         e.target.value = null;
         setloading(false);

        }
      } 
      
      
      const createGroup =async ()=>{
         if(!chatName){
          toast({
            title: "Error",
            description: "it is already your name",
            status: "warning",
            duration: 9000,
            isClosable: true,
          });
         }
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
          setphase(1);
          onClose();
       }


       const changePhase=()=>{
            if(phase===1){
              setphase(2);
              setloading(false);
              setresult(true);
              setsearch("");
            }else{
               createGroup();
            }
       }


       const changePage =()=>{
           if(phase===2){
            setphase(1);
            setchatName("");
            setisPicture(false);
            setgroupPicture("https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png");
           }else{
             setselectedUsers([]);
             setselectedUsersId([]);
             setsearch("");
             onClose();
             setloading(false);
             setresult(true);
             setusers([]);  
             setchatName("");
             setgroupPicture("https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png");
           }  
       } 


    
      
  return (
    <div>
        <img onClick={onOpen} alt='' className='w-20 cursor-pointer' src={createGroupLogo}></img>
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={phase===1?changePage:""}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent  bg={"rgb(27,27,27)"}  color={"white"}>
          <DrawerHeader bg={"rgb(36,36,36)"}>
            <div className="flex space-x-4 text-lg items-center font-semibold pt-2 ">
          <i onClick={changePage} className="fa-solid cursor-pointer fa-arrow-left"></i>
            {phase===1&&<p>Add group members</p>}
            {phase===2&&<p>New group</p>}
            </div></DrawerHeader>

          <DrawerBody overflow={"hidden"} position={"relative"} paddingTop={"5"}>
           
           {phase===1&&<div className='overflow-y-scroll  chatBox'>

          <div className='flex flex-wrap max-h-20 overflow-y-scroll chatBox gap-y-1 gap-x-1'>{selectedUsers.map((user)=>{
            return(<div className='px-2 py-1   space-x-2  items-center flex  rounded-lg text-xs text-white 
            bg-[rgb(61,61,61)]' key={user._id}><p>{user.name}</p><i onClick={(e)=>{removeUser(user)}} className=" mt-1 cursor-pointer fa-solid fa-xmark"></i></div>)
          })}</div>
        <FormControl mt={4}>
          {/* <FormLabel>Add members</FormLabel> */}
          <Input onChange={onChange} value={search} placeholder='Enter names or email address...' />
        </FormControl>
        {loading&&<div className="h-[50vh] absolute mx-28 flex justify-center items-center">
              <Spinner />
            </div>}
            {!loading&&result&&<div className="flex   h-[50vh] overflow-y-scroll chatBox mt-6 flex-col space-y-3">
              {users.map((user) => {
                return (
                  <div
                  onClick={(e)=>{collectUser(user)}} className="flex cursor-pointer  items-center space-x-2"
                  key={user._id}
                  >
                    <img className="w-12 rounded-full h-12" alt="" src={user.avtar}></img>
                    <p>{user.name}</p>
                  </div>
                );
              })}
            </div>}
            {!result&&<div className="text-white h-[52vh] mx-20 absolute flex justify-center items-center">No result found</div>}
           </div>}
            {(selectedUsers.length>0||chatName)&&<div onClick={changePhase} className={`bg-[rgb(34,134,92)] cursor-pointer mx-28 my-3 absolute ${phase==1?"bottom-6":"bottom-20"} z-20 rounded-full w-10 h-10 flex justify-center items-center`}>

            <i className="fa-sharp fa-solid fa-arrow-right"></i>
            </div>}
             {phase===2&&<div className='flex flex-col  gap-y-2 items-center'>
                <div className='flex group w-52 h-52 cursor-pointer items-center relative justify-center py-8 rounded-full'>
                <img alt='' className='w-52 h-52 rounded-full ' src={groupPicture}></img>
                <input
                      onChange={UploadPic}
                      className="  inputFile absolute top-2 h-48
                text-white rounded-full z-10 justify-center cursor-pointer items-center opacity-0 w-48"
                      type="file"
                    ></input>
                     {loading&&<Spinner className="absolute" />}
 
                    {!isPicture&&<div className="absolute top-2  flex text-center cursor-pointer py-14 bg-black w-48 space-y-1 h-48 opacity-70 rounded-full flex-col justify-center items-center">
                      <i className="fa-solid text-lg fa-camera"></i>
                      <div className="  text-xs font-semibold ">
                      <p>ADD</p>
                      <p>GROUP PHOTO</p>
                    </div>
              </div>}
                </div>
                <input className='w-64 outline-none bg-transparent px-1 my-2  border-[rgb(9,128,93)] border-b-2' onChange={(e)=>{setchatName(e.target.value)}} value={chatName} placeholder='Chat name' /> 
              </div>}
     </DrawerBody>
      
        </DrawerContent>
      </Drawer>
      
     
    </div>
  )
}

export default GroupCreation