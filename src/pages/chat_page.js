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
    <div className='flex flex-col space-y-4 h-[100vh] p-1 bg-[url(https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2ltcGxlJTIwZGVzaWdufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60)] bg-no-repeat bg-cover'>
    <Navbar/>
    <div className='flex space-x-8 h-[90vh]'>
    <Chatlist/>
    <Chat/>   
    </div>
  </div>
  )
}

export default Chat_page;
