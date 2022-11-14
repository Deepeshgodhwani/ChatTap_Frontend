
import React,{useState} from 'react';

const formHandler= ()=>{
       
}


function Login() {
 
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  return (
  <div className=' w-[100%] flex flex-col h-[280px] justify-between p-[20px] rounded-[5px]'>
    <h2 className='text-base font-bold'>Email Address *</h2>
    <input className='border-2 p-[5px] outline-none rounded-[5px] ml-2' onChange={(e)=>{setemail(e.target.value)}}  type={"text"} placeholder={"Enter Your Email Address"}required></input>
    <h2 className='text-base font-bold'>Password *</h2>
    <input className='border-2 p-[5px] outline-none rounded-[5px] ml-2' onChange={(e)=>{setpassword(e.target.value)}} type={"password"} minLength='8' placeholder="Enter Password" required></input>
    <input type="submit" value="Login" className='text-white bg-blue-600 p-[5px] rounded-[5px]'></input>
    <button onSubmit={formHandler} className='text-white bg-red-700 p-[5px] rounded-[5px]'>Get Guest User Credentials</button>
 </div>
  )
}

export default Login
