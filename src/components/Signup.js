import React, { useState } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

function Signup(props) {
  let history = useHistory();
  const {togglePage}=props;
  const [loading, setloading] = useState(false);
  const [value, setvalue] = useState("Login");


  const [credentials, setcredentials] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
  });

  const toast = useToast();

  const formHandler = async (e) => {
    e.preventDefault();
    setvalue("");
    let button=document.getElementById('button');
    button.disabled=true;
    setloading(true);
    if (credentials.password !== credentials.confPassword) {
      toast({
        description: "Password and confiom password should be same",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setcredentials({ name: "", email: "", password: "", confPassword: "" });
      button.disabled=false;
      setloading(false);
      setvalue("Login")
    }else{
       
       try {
        const response = await fetch("http://localhost:7000/api/auth/createUser", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
          }),
        });
        let  data = await response.json();
        setcredentials({ name: "", email: "", password: "", confPassword: "" });
            if (!data.error) {
              console.log("hey");
              localStorage.setItem("token", data.authToken);
              const User = await fetch("http://localhost:7000/api/auth/getUser", {
                method: "GET",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": data.authToken,
                },
              });


              toast({
                description: "Your account has been Created",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              
              let user = await User.json();
              localStorage.setItem("user", JSON.stringify(user));
              if (user) {
                history.push("/chat");
              }
            } else {
              toast({
                description: data.error[0].msg,
                status: "warning",
                duration: 3000,
                isClosable: true,
              });
              button.value="Login";
              button.disabled=false;
              setloading(false);
              setvalue("Login")
            }
       } catch (error) {
        toast({
          description: "Internal server error",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setcredentials({ name: "", email: "", password: "", confPassword: "" });
        button.disabled=false;
        setloading(false);
        setvalue("Login")
       }
    }
  };

  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // console.log(avatar);

  return (
    <form className="bg-[rgb(27,27,27)]  justify-center items-center flex  h-[85vh]  w-[70%] " onSubmit={formHandler}>
      <div className=" w-[23rem] flex   relative flex-col z-10 px-9 pt-6  justify-between  space-y-2">
      <p className="text-base pl-1  text-[rgb(194,194,194)] font-bold">Name</p>
        <input
          onChange={onChange}
          name="name"
          value={credentials.name}
          className="border-[1px] py-2 border-[rgb(126,126,126)] px-4 bg-transparent outline-none rounded-xl "
          type="text"
          autoComplete='off'
          placeholder="Enter Your Name"
          maxLength={30}
          required
        ></input>
        <p className="text-base  pl-1 text-[rgb(194,194,194)] font-bold">Email address</p>
        <input
          onChange={onChange}
          name="email"
          value={credentials.email}
          autoComplete='off'
          className="border-[1px] py-2 border-[rgb(126,126,126)] px-4 bg-transparent outline-none rounded-2xl "
          type="text"
          placeholder="Enter Your Email Address"
          required
        ></input>
        <p className="text-base pl-1  text-[rgb(194,194,194)] font-bold">Password</p>
        <input
          onChange={onChange}
          name="password"
          value={credentials.password}
          className="border-[1px] py-2 border-[rgb(126,126,126)] px-4 bg-transparent outline-none rounded-2xl "
          type="password"
          placeholder="Enter Password"
          autoComplete='off'
          required
        ></input>
        <p className="text-base pl-1  text-[rgb(194,194,194)] font-bold">Password confirm</p>
        <input
          onChange={onChange}
          name="confPassword"
          value={credentials.confPassword}
          className="border-[1px] py-2 border-[rgb(126,126,126)]  px-4 bg-transparent outline-none rounded-2xl"
          type="password"
          placeholder="Confirm Password"
          autoComplete='off'
          required
        ></input>
        <div className=" relative flex justify-center items-center">
         {loading&&<Spinner className="absolute top-2 "/>}
        <input
          type="submit"
          value={value}
          className="text-white w-full cursor-pointer text-sm bg-[rgb(38,141,97)]   rounded-2xl py-[10px] font-bold"
          id="button"
          ></input>
          </div>
         <div onClick={()=>{togglePage(true)}} className="cursor-pointer text-[rgb(109,109,109)]  justify-center text-center pt-3 flex text-sm" >
          <p>
            Already have an account?  
            </p>&nbsp;
            <p className="underline">Sign in</p>
          </div>
      </div>
    </form>
  );
}

export default Signup;
