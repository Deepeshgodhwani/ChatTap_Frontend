import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

function Login(props) {
  let history = useHistory();
  const toast = useToast();
  const {togglePage}=props;
  const renderPage = () => {
    if (localStorage.getItem("token")) {
      return history.push("/chat");
    }
  };

  useEffect(() => {
    renderPage();
    // eslint-disable-next-line
  }, []);

  const [credentials, setcredentials] = useState({ email: "", password: "" });

  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const formHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:7000/api/auth/login/`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    let data = await response.json();
    if (data.error) {
      toast({
        title: "Error",
        description: data.message,
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      setcredentials({ email: "", password: "" });
    } else {
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
      history.push("/chat");
    }
  };

  return (
    // right-28 top-32 absolute
    // 0 25px 50px -12px rgb(0 0 0 / 0.25)
    <form  className=" bg-[rgb(27,27,27)] justify-center items-center flex  h-[80vh]  w-[70%]     " onSubmit={formHandler}>
      <div className="  flex w-96  relative flex-col z-10 px-9 py-6  justify-between  ">
         <p className="text-base pb-2 text-[rgb(194,194,194)] font-bold">Email</p>
        <input
          className="border-2 py-2 px-4 bg-transparent outline-none rounded-lg "
          value={credentials.email}
          name="email"
          onChange={onChange}
          type={"text"}
          placeholder={"Enter Your Email Address"}
          required
          autoComplete="off"
          ></input>
        <h2 className="text-base text-[rgb(194,194,194)] my-2 font-bold">Password</h2>
        <input
          className="border-2 py-2 px-4  bg-transparent outline-none rounded-lg  "
          value={credentials.password}
          name="password"
          onChange={onChange}
          type={"password"}
          minLength="6"
          placeholder="Enter Password"
          required
        ></input>
        <input
          type="submit"
          value="LOGIN"
          className="text-white cursor-pointer text-sm bg-[rgb(38,141,97)] mt-5 rounded-lg py-[10px] font-bold"
        ></input>
         <div className="flex  my-4 justify-center items-center">
            <p className="w-32 border-b-2 h-0 border-[rgb(109,109,109)]"></p>
            <p className="text-sm border-2 border-[rgb(109,109,109)] px-1 ">OR</p>
            <p className="w-32 border-b-2  h-0 border-[rgb(109,109,109)]"> </p>
         </div>
        <div className="text-white text-center cursor-pointer bg-red-500  rounded-lg py-2 font-bold">
           Login as guest user
        </div>
        <div onClick={()=>{togglePage(false)}} className="cursor-pointer justify-center text-center mt-2 flex text-sm" >
          <p>
            Need an account?
            </p>&nbsp;
            <p className="underline">Sign up</p>
          </div>
      </div>
    </form>
  );
}

export default Login;
