import { useEffect } from "react";
import { useState } from "react";
import UserContext from "./user/ChatContext";


const ChatState=(props)=>{
     const [user, setuser] = useState({})
     const [chatroom, setchatroom] = useState({});

     const getUser=()=>{
        let userInfo=JSON.parse(localStorage.getItem('user'));
        setuser(userInfo);
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
     

    return(
        <UserContext.Provider value={{user,accessChat,chatroom}} >
            {props.children}
        </UserContext.Provider>
    )
}


export default ChatState;