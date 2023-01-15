import React ,{useEffect} from 'react'
import Login from '../components/Login';
import Signup from '../components/Signup';

// import axios from "axios";
function Home() {

    const fetchData=async ()=>{

        // const data= await axios.get("/createSession");
        // let string =data.data;
        // console.log(string);
          
    }

    useEffect(() => {      
         fetchData();
    }, [])
    


  return (
      <div  className={'flex bg-fixed bg-center bg-cover bg-[url(https://res.cloudinary.com/dynjwlpl3/image/upload/v1673769542/skills%20logo/havechat_hhbkts.jpg)] justify-center  text-white items-center h-[100vh]'}>
        <div>
          
        </div>
        <Login/>
        {/* <Signup/> */}
      </div>
  )
}

export default Home
