import React  from 'react'
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
        <div className='w-[60%] justify-start flex items-center bg-[rgb(27,27,27)]'>
        <div className='absolute shadow-black  shadow-2xl flex right-[17.2rem] w-[60%]'>
          <div className='w-72 flex pt-28  px-8 items-center flex-col bg-[rgb(36,36,36)] h-[85vh] '>
              <img className='w-40' alt='' src={"https://res.cloudinary.com/dynjwlpl3/image/upload/v1674985284/Chat-app/logo_rmgpil.png"}></img>
              <div className='text-3xl  text-[rgb(194,194,194)] flex font-semibold'>
                <p className='text-[rgb(79,224,165)]'>Ch</p>
                <p className='text-[rgb(126,87,194)]'>at</p>
                <p className='text-[rgb(254,194,0)]'>Tap</p> 
                </div>
                <p className='text-center text-[rgb(170,170,170)]  leading-5 mt-4'>Connect with friends and family in real-time.</p>
                <div className='text-[rgb(170,170,170)] pt-32 text-sm items-center  flex space-x-2'> 
                <i className="fa-solid fa-lock"></i>
                <p>
                End to end encrypted
                </p>
                </div>
          </div>
        {loginPage&&<Login togglePage={togglePage}/>}
        {!loginPage&&<Signup togglePage={togglePage} />}
        </div>
        </div>
      </div>
  )
}

export default Home
