import React ,{useEffect} from 'react'
import Login from '../components/Login';
import Signup from '../components/Signup';
// import axios from "axios";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'

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
    <Container className='mt-[12vh]'>
       <Tabs size='md' variant='enclosed'>
  <TabList>
    <Tab>Login</Tab>
    <Tab>Signup</Tab>
  </TabList>
     <TabPanels>
       <TabPanel>
        <Login/>
        </TabPanel>
        <TabPanel>
       <Signup/>
       </TabPanel>
     </TabPanels>
  </Tabs>
    </Container>
  )
}

export default Home
