import React ,{useEffect} from 'react'
import { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';

// import axios from "axios";
function Home() {

    const [loginPage, setloginPage] = useState(true)
    const togglePage=(value)=>{
          setloginPage(value)
    }

  return (
      <div  className={'flex    text-white h-[100vh]'}>
        <div className='w-[40%] justify-end flex items-center bg-[rgb(36,36,36)]'>
        </div>
        <div className='w-[60%] justify-start flex items-center    bg-[rgb(27,27,27)]'>
        <div className='absolute shadow-black  shadow-2xl flex right-60 w-[60%]'>
          <div className='w-60  bg-[rgb(36,36,36)] h-[80vh] '></div>
        {loginPage&&<Login togglePage={togglePage}/>}
        {!loginPage&&<Signup togglePage={togglePage} />}
        </div>
        </div>
      </div>
  )
}

export default Home
