import React from 'react'
import { useContext,useState,useEffect } from 'react';
import ChatContext from '../context/user/ChatContext';
import GroupMembers from './GroupMembers';
import { Spinner } from '@chakra-ui/react'


function Details(props) {
  const {Profile,toggleProfileView}=props;
 const context = useContext(ChatContext);
 const [groupMembers, setgroupMembers] = useState([]);
 const [profilePic, setprofilePic] = useState()
 const [loading, setloading] = useState(false);
 const {logUser,setgroupPic}=context;


      useEffect(() => {
          
        if(Profile.isGroupChat){
          setprofilePic(Profile.profilePic);
        }else{
           setprofilePic(Profile.avtar);
        }
      // eslint-disable-next-line 
      }, [])

     const changeProfile= async(e)=>{
      setloading(true);
        if((e.target.files[0]) && (e.target.files[0].type==="image/jpeg"||e.target.files[0]==="image/png")){
              const formData= new FormData();
              formData.append("file",e.target.files[0]);
              formData.append("upload_preset","chat_app");
              formData.append("cloud_name","dynjwlpl3");   
              const response= await fetch("https://api.cloudinary.com/v1_1/dynjwlpl3/image/upload",{
                method:"POST",
                body:formData
              })
              let pic= await response.json();
              let picture=pic.url.toString()
              let token =localStorage.getItem('token');
              let data=await fetch(`http://localhost:7000/api/chat/changePic?isGroupChat=${Profile.isGroupChat?true:false
               }&Id=${Profile.isGroupChat?Profile._id:logUser._id}&pic=${picture}`,{
                method:'GET', 
                mode:"cors",
                headers:{
                  'Content-Type':'application/json',
                  'auth-token':token
                }
              })

              let message=await data.json();
              console.log(message);
              if(message.success){
                setloading(false);
                console.log(picture);
                setprofilePic(picture);
                Profile.isGroupChat&&setgroupPic(picture);
              }
           e.target.value=null;   
        }      
     }

  return (
    <div className='w-96 bg-[rgb(36,36,36)] overflow-y-scroll chatBox  flex flex-col px-4 py-4'>
      <div className='text-[rgb(233,233,233)] text-xl font-semibold flex justify-between '>
        <p>
           Profile
        </p>
        <i onClick={()=>{toggleProfileView(false)}} className="cursor-pointer fa-solid fa-xmark"></i>
        </div>
        <div className='py-2 px-2'>
         <div className='flex space-y-2 mt-4 border-b-[1px] border-gray-600  py-4 flex-col items-center'>
          <div className='relative flex justify-center items-center group'>
          <img alt='' className='w-40 rounded-full h-40' src={profilePic}></img>
          {loading&&<Spinner className='absolute' />}
       {Profile.isGroupChat&&<input onChange={changeProfile} className=' group-hover:flex hidden inputFile absolute top-0 h-40 opacity-70
         text-white rounded-full justify-center items-center  bg-black w-40' type="file"></input>}</div>
          <div className='flex flex-col items-center text-[rgb(233,233,233)]'>
          <p className='font-[calibri] text-xl '>{Profile.isGroupChat?Profile.chatname:Profile.name}</p>
          {Profile.isGroupChat&&<p className='text-[rgb(97,97,97)] text-sm font-semibold'>Group • {groupMembers.length} members</p>}
          </div>
        </div>
        {Profile.isGroupChat&& <GroupMembers Profile={Profile} groupMembers={groupMembers} setgroupMembers={setgroupMembers}/>
        }
        </div>
    </div>
  )
}

export default Details
