import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

function Signup(props) {
  let history = useHistory();
  const {togglePage}=props;


  const [credentials, setcredentials] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
  });

  const toast = useToast();

  const formHandler = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confPassword) {
      toast({
        title: "Error",
        description: "Password and confiom password should be same",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      setcredentials({ name: "", email: "", password: "", confPassword: "" });
    }else{

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
      
      let data = await response.json();
      setcredentials({ name: "", email: "", password: "", confPassword: "" });
      if (!data.error) {
        localStorage.setItem("token", data.authToken);
        const User = await fetch("http://localhost:7000/api/auth/getUser", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": data.authToken,
          },
        });
        
        let user = await User.json();
        localStorage.setItem("user", JSON.stringify(user));
        if (user) {
          history.push("/chat");
        }
      } else {
        toast({
          title: "Error",
          description: data.error,
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // console.log(avatar);

  return (
    <form className="bg-[rgb(27,27,27)]  justify-center items-center flex  h-[80vh]  w-[70%] " onSubmit={formHandler}>
      <div className=" w-96 flex   relative flex-col z-10 px-9 py-6  justify-between  space-y-2">
      <p className="text-base  text-[rgb(194,194,194)] font-bold">Name</p>
        <input
          onChange={onChange}
          name="name"
          value={credentials.name}
          className="border-2 py-2 px-4 bg-transparent outline-none rounded-lg "
          type="text"
          autoComplete='off'
          placeholder="Enter Your Name"
          maxLength={30}
          required
        ></input>
        <p className="text-base  text-[rgb(194,194,194)] font-bold">Email address</p>
        <input
          onChange={onChange}
          name="email"
          value={credentials.email}
          autoComplete='off'
          className="border-2 py-2 px-4 bg-transparent outline-none rounded-lg "
          type="text"
          placeholder="Enter Your Email Address"
          required
        ></input>
        <p className="text-base  text-[rgb(194,194,194)] font-bold">Password</p>
        <input
          onChange={onChange}
          name="password"
          value={credentials.password}
          className="border-2 py-2 px-4 bg-transparent outline-none rounded-lg "
          type="password"
          placeholder="Enter Password"
          autoComplete='off'
          required
        ></input>
        <p className="text-base  text-[rgb(194,194,194)] font-bold">Password confirm</p>
        <input
          onChange={onChange}
          name="confPassword"
          value={credentials.confPassword}
          className="border-2 py-2  px-4 bg-transparent outline-none rounded-lg"
          type="password"
          placeholder="Confirm Password"
          autoComplete='off'
          required
        ></input>
        <input
          type="submit"
          value="SIGN UP"
          className="text-white cursor-pointer text-sm bg-[rgb(38,141,97)]  rounded-lg py-[10px] font-bold"
        ></input>
         <div onClick={()=>{togglePage(true)}} className="cursor-pointer justify-center text-center mt-2 flex text-sm" >
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
