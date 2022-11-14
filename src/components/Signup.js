import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react'






function Signup() {

const [name, setname] = useState("");
const [email, setemail] = useState("");
const [password, setpassword] = useState("");
const [confpassword, setconfpassword] = useState("");
const [avtar, setavtar] = useState("");
const toast = useToast();
const formHandler= ()=>{
   if(!name||!email||!password||!confpassword){

     toast({
       title: 'form is not filled.',
       description: "We've created your account for you.",
       status: 'success',
       duration: 9000,
       isClosable: true,
      })
    }
}
  return (
    <div>
    <div className=' w-[100%] flex flex-col h-[480px] justify-between p-[20px] rounded-[5px]'>
    <h2 className='text-base font-bold'>Name *</h2>
      <input onChange={(e)=>{setname(e.target.value)}} className='border-2 p-[5px] outline-none rounded-[5px] ml-2' type="text" placeholder="Enter Your Name"></input>
      <h2 className='text-base font-bold'>Email Address *</h2>
      <input onChange={(e)=>{setemail(e.target.value)}} className='border-2 p-[5px] outline-none rounded-[5px] ml-2' type="text" placeholder="Enter Your Email Address"></input>
      <h2 className='text-base font-bold'>Password *</h2>
      <input onChange={(e)=>{setpassword(e.target.value)}} className='border-2 p-[5px] outline-none rounded-[5px] ml-2' type="password" placeholder="Enter Password"></input>
      <h2 className='text-base font-bold'>Confirm Password *</h2>
      <input onChange={(e)=>{setconfpassword(e.target.value)}} className='border-2 p-[5px] outline-none rounded-[5px] ml-2' type= "password" placeholder="Confirm Password"></input>
      <h2 className='text-base font-bold'>Upload your Picture *</h2>
      <input onChange={(e)=>{setavtar(e.target.value)}} className='border-2 p-[5px] outline-none rounded-[5px] ml-2' type="file" placeholder="No file chosen"></input>
      <input onSubmit={formHandler()}  type="submit" value="Login" className='text-white bg-blue-600 p-[5px] rounded-[5px]'></input>
   </div>
 </div>
  )
}

export default Signup
