import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Navbar() {
     
     let history=useHistory();
     let user=JSON.parse(localStorage.getItem('user'));
     const {name, avtar,} =user;
     
     const logout=()=>{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            history.push('/');
     }

  return (
    
    <nav className='flex px-6 py-2  justify-between bg-white '>
         <p className='font-semibold'>{name} </p>
         <p className='font-semibold text-2xl'>Talk-A-Tive</p>
         <img alt='' onClick={logout}   src={avtar}
             className='object-cover rounded-[50%]  cursor-pointer h-[100%] w-[30px]'></img>
    </nav>
  )
}
