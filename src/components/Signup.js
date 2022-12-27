import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

function Signup() {
  let history = useHistory();

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
    }

    // if((avatar) && (avatar.type==="image/jpeg"||avatar.type==="image/png")){
    //   const formData= new FormData();
    //   console.log(avatar);
    //   formData.append("file",avatar);
    //   formData.append("upload_preset","chat_app");
    //   formData.append("cloud_name","dynjwlpl3");
    //   const response= await fetch("https://api.cloudinary.com/v1_1/dynjwlpl3/image/upload",{
    //     method:"POST",
    //     body:formData
    //   })
    //   let pic= await response.json();
    //   setavatar(pic.url.toString());
    // }

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
  };

  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // console.log(avatar);

  return (
    <form onSubmit={formHandler}>
      <div className=" w-[100%] flex flex-col h-[480px] justify-between p-[20px] rounded-[5px]">
        <h2 className="text-base font-bold">Name *</h2>
        <input
          onChange={onChange}
          name="name"
          value={credentials.name}
          className="border-2 p-[5px] outline-none rounded-[5px] ml-2"
          type="text"
          placeholder="Enter Your Name"
          required
        ></input>
        <h2 className="text-base font-bold">Email Address *</h2>
        <input
          onChange={onChange}
          name="email"
          value={credentials.email}
          className="border-2 p-[5px] outline-none rounded-[5px] ml-2"
          type="text"
          placeholder="Enter Your Email Address"
          required
        ></input>
        <h2 className="text-base font-bold">Password *</h2>
        <input
          onChange={onChange}
          name="password"
          value={credentials.password}
          className="border-2 p-[5px] outline-none rounded-[5px] ml-2"
          type="password"
          placeholder="Enter Password"
          required
        ></input>
        <h2 className="text-base font-bold">Confirm Password *</h2>
        <input
          onChange={onChange}
          name="confPassword"
          value={credentials.confPassword}
          className="border-2 p-[5px] outline-none rounded-[5px] ml-2"
          type="password"
          placeholder="Confirm Password"
          required
        ></input>
        <input
          type="submit"
          value="Login"
          className="text-white bg-blue-600 p-[5px] rounded-[5px]"
        ></input>
      </div>
    </form>
  );
}

export default Signup;
