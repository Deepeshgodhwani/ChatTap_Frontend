import React, { useContext,useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
 
import logo from  "../images/power-off.png";
import {
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import ChatContext from "../context/user/ChatContext";

function Profile() {
  let history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const context = useContext(ChatContext);
  const { setchatroom ,logUser,setlogUser} = context;
  const [loading, setloading] = useState(false);
  const [username, setusername] = useState("")
  const [enabled, setenabled] = useState(false);
  const [currentName, setcurrentName] = useState("");
  const toast = useToast();
  
  
  const setUser = () => {
    setcurrentName(logUser.name);
  };

  const updateUser =()=>{
    setcurrentName(logUser.name);
    onOpen();
  }

  useEffect(() => {
    
    setUser();
      // eslint-disable-next-line    
  }, [])
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setchatroom({});
    history.push("/");
  };


  const editName=()=>{
       let input=document.getElementById("inputName");
       input.disabled=false;
       input.style.borderBottomColor="rgb(66,203,165)"
       setenabled(true);
  }

  const closeTheTab=()=>{
    let input=document.getElementById("inputName");
    input.disabled=true;
    setenabled(false);
    onClose();  
  }


  const changeName =async()=>{
    if(username===currentName){
      toast({
        title: "Error",
        description: "it is already your name",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }else{
      let token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7000/api/chat/changeName`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
           type:"user",
           Id:logUser._id,
           name:username
        }),
      });
  
      let data = await response.json();
      
      let input=document.getElementById("inputName");
        setlogUser({...logUser,name:data.name});
        input.style.borderBottomColor="rgb(36,36,36)";
        localStorage.setItem("user",JSON.stringify(data));
        input.value="";
        setcurrentName(data.name);
        setusername("");
        input.disabled=false;
        setenabled(false);
        toast({
          title: "Your name changed",
          status: 'success',
          isClosable: true,
        })

    }
   
  }

  const changePic = async (e) => {
    if (
      e.target.files[0] &&
      (e.target.files[0].type === "image/jpeg" ||
      e.target.files[0] === "image/png")
      ) {
      setloading(true);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("upload_preset", "chat_app");
      formData.append("cloud_name", "dynjwlpl3");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dynjwlpl3/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      let pic = await response.json();
      let picture = pic.url.toString();
      let token = localStorage.getItem("token");
      let data = await fetch(
        `http://localhost:7000/api/chat/changePic?isGroupChat=false&Id=${logUser._id}&pic=${picture}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      let message = await data.json();
      if (message.success) {
        setlogUser({...logUser,avtar:picture});
        let updatedUser=logUser;
        updatedUser.avtar=picture
        localStorage.setItem("user",JSON.stringify(updatedUser));
      }
      setloading(false);
   }
   e.target.value = null;
  }

  return (
    <div>
      <img
        ref={btnRef}
        alt=""
        onClick={updateUser}
        src={logUser.avtar}
        className=" rounded-lg  cursor-pointer h-10 w-10"
        ></img>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={closeTheTab}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent textColor={"white"} bg={"rgb(36,36,36)"}>
          <DrawerHeader>
            <div className="flex justify-between">
            Profile
             <i onClick={closeTheTab} className="fa-solid cursor-pointer text-xl mt-[1px] fa-xmark"></i>
            </div>
             </DrawerHeader>
          <div className="flex h-[90vh] px-2 flex-col bg-[rgb(27,27,27)] ">
            <div className="flex group  items-center relative justify-center py-8">
              <img
                alt=""
                className="rounded-full h-48 w-48"
                src={logUser.avtar}
              ></img>
               {loading&&<Spinner className="absolute" />}
              <input
                onChange={changePic}
                className=" flex z-50 inputFile absolute top-8 h-48 opacity-0
           text-white rounded-full justify-center items-center  bg-black w-48"
                type="file"
              ></input>
              <div className="absolute hidden group-hover:flex text-center py-14 bg-black w-48 space-y-1 h-48 opacity-70 rounded-full flex-col justify-center items-center">
                <i className="fa-solid text-lg fa-camera"></i>
                <div className="  text-xs font-semibold ">
                 <p>UPLOAD</p>
                 <p>PROFILE PHOTO</p>
                </div>

              </div>
            </div>
            <div className="flex px-2 flex-col space-y-1">
              <p className="text-[rgb(9,128,93)] font-semibold">Your name</p>
              <div className="justify-center  flex relative">
                <input
                  className="bg-transparent text-white placeholder:text-white border-b-[1px] pb-2 
                  border-[rgb(36,36,36)] outline-none  w-72"
                  type={"text"}
                  disabled
                  id="inputName"
                  placeholder={currentName}
                  maxLength="30"
                  onChange={ (e)=>{setusername(e.target.value)}}
                ></input>
                {!enabled&&<i onClick={editName} className="absolute cursor-pointer text-[rgb(87,87,87)]  right-0 fa-solid fa-pen"></i>}
                {enabled&&username&&<i onClick={changeName} className="absolute cursor-pointer text-[rgb(87,87,87)]  right-0 fa-solid fa-circle-check"></i>}
              </div>
            </div>
            <div className="mt-3 px-2">
                <p className="text-[rgb(9,128,93)] font-semibold">Your email</p>
                <p className="border-b-[1px] border-[rgb(36,36,36)] pb-2">{logUser.email}</p>
              </div>
          </div>
          
          <div onClick={logout}  className="space-x-2 justify-center items-center py-2 cursor-pointer flex">
            <img alt="" className="w-5 h-5" src={logo}></img>
            <p className="text-lg font-semibold">
              Logout
            </p>
            </div>
        
          
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Profile;
