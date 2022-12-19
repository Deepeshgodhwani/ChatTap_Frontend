import { useEffect } from "react";
import { useState } from "react";
import UserContext from "./user/ChatContext";


const ChatState=(props)=>{
     const [logUser, setlogUser] = useState({})
     const [chatroom, setchatroom] = useState({});
     const [recentChats, setrecentChats] = useState([])
     const [groupPic, setgroupPic] = useState("");
    //  const [userPic, setuserPic] = useState("")
     const [groupName, setgroupName] = useState("");



     const getUser=()=>{
        let userInfo=JSON.parse(localStorage.getItem('user'));
        setlogUser(userInfo);
     } 

     useEffect(() => { 
         getUser();
     }, [])


     const accessChat =async (userId)=>{
        let token =localStorage.getItem('token');
        const response=await fetch(`http://localhost:7000/api/chat/accessChat?userTwo=${userId}`,
        {
          method:'GET',
          mode:"cors" ,
          headers: {
            'Content-Type':'application/json',
             'auth-token':token
          },
        })
        
        let data =await response.json();

        setchatroom(data);
     }

     const accessGroupChat=async (chatId)=>{
        let token =localStorage.getItem('token');
        const response=await fetch(`http://localhost:7000/api/chat/accessGroupChat?chatId=${chatId}`,
        {
          method:'GET',
          mode:"cors" ,
          headers: {
            'Content-Type':'application/json',
             'auth-token':token
          },
        }) 
        
        let data =await response.json();
        setgroupPic(data.profilePic);
        setgroupName(data.chatname);
        setchatroom(data);
     }


     const fetchRecentChats= async ()=>{
      let token =localStorage.getItem('token');
      const response=await fetch('http://localhost:7000/api/chat/fetchChats',
      {
        method:'GET',
        mode:"cors" ,
        headers: {
          'Content-Type':'application/json',
           'auth-token':token
        },
      })
      
      let chat =await response.json();
      setrecentChats(chat);
     }
     

    return(
        <UserContext.Provider value={{setrecentChats,recentChats,fetchRecentChats,logUser
        ,accessChat,chatroom,accessGroupChat,setchatroom,setgroupPic,groupPic,setgroupName,groupName}} >
            {props.children}
        </UserContext.Provider>
    )
}


export default ChatState;