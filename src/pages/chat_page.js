import React,{ useEffect } from 'react'
import Chatlist from '../components/Chatlist'
import Chat from '../components/Chat';
import Navbar from '../components/Navbar';
import { useHistory } from 'react-router-dom';





function Chat_page() {
 
 
    let history= useHistory();

    const redirectPage=()=>{
      if(!localStorage.getItem('token')){
        history.push('/');
      }
    }

    useEffect(() => {
        redirectPage();
        // eslint-disable-next-line
    }, [])


  return (
    <div className='flex h-[100vh] space bg-[rgb(53,53,72)] '>
    <Navbar/>
    <Chatlist/>
    <Chat/>   
  </div>
  )
}

export default Chat_page;
