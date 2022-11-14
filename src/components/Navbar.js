import React from 'react'

export default function Navbar() {
  return (
    <div className=' bg-white h-[45px] p-[4px]'>
    <nav className='flex flex-row space-x-[500px] px-3'>
        <ul className='flex space-x-2 w-[130px] text-[18px]'>
            <li>Ŝ</li>
            <input type="text" placeholder='Search User' className='text-black outline-none'></input>
        </ul>
        <ul className='flex text-[20px]'>
            <li>Talk-A-Tive</li>
        </ul>
        <ul className='flex w-[90px] space-x-5 h-[30px]'>
            <li>⪚</li>
            <img src='https://images.unsplash.com/photo-1599032909736-0155c1d43a6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80' className='object-cover rounded-[50%]  h-[100%] w-[30px]'></img>
        </ul>
    </nav>
</div>
  )
}
