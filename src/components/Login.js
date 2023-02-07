import React, { useState } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
const url = process.env.REACT_APP_URL;

function Login(props) {
  const toast = useToast();
  const { togglePage } = props;
  const [credentials, setcredentials] = useState({ email: "", password: "" });
  const [loading, setloading] = useState(false);
  const [value, setvalue] = useState("Login");
  let history = useHistory();

  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  //checking credentials and rendering chat page
  const formHandler = async (e) => {
    e.preventDefault();
    setvalue("");
    let button = document.getElementById("button");
    button.disabled = true;
    setloading(true);

    try {
      const response = await fetch(`${url}/api/auth/login/`, {
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
          description: data.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setcredentials({ email: "", password: "" });
        button.value = "Login";
        button.disabled = false;
        setloading(false);
        setvalue("Login");
      } else {
        const User = await fetch(`${url}/api/auth/getUser`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "auth-token": data.authToken,
          },
        });

        let user = await User.json();
        if (user.error) {
          toast({
            description: user.error,
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          setcredentials({ email: "", password: "" });
          button.value = "Login";
          button.disabled = false;
          setloading(false);
          setvalue("Login");
        } else {
          localStorage.setItem("token", data.authToken);
          localStorage.setItem("user", JSON.stringify(user));
          history.push("/chat");
        }
      }
    } catch (error) {
      setcredentials({ email: "", password: "" });
      button.value = "Login";
      button.disabled = false;
      setloading(false);
      setvalue("Login");
      toast({
        description: "Internal server error",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const setguestCredentials = () => {
    setcredentials({
      email: "guest@gmail.com",
      password: "123456",
    });
  };

  return (
    <form
      className=" bg-[rgb(27,27,27)] justify-center items-center flex 2xl:h-[80vh]  xl:h-[85vh]  xl:w-[70%]     "
      onSubmit={formHandler}
    >
      <div className="  flex w-[23rem] relative flex-col z-10 px-9 py-6  justify-between  ">
        <p className="text-base pb-2 pl-1 text-[rgb(194,194,194)] font-bold">
          Email
        </p>
        <input
          className="border-[1px]  border-[rgb(126,126,126)] py-2 px-4 bg-transparent outline-none rounded-2xl "
          value={credentials.email}
          name="email"
          onChange={onChange}
          type={"text"}
          placeholder={"Enter Your Email Address"}
          required
          autoComplete="off"
        ></input>
        <h2 className="text-base pl-1 text-[rgb(194,194,194)] my-2 font-bold">
          Password
        </h2>
        <input
          className="border-[1px] py-2 px-4 border-[rgb(126,126,126)] bg-transparent outline-none rounded-2xl  "
          value={credentials.password}
          name="password"
          onChange={onChange}
          type={"password"}
          minLength="6"
          placeholder="Enter Password"
          autoComplete="off"
          required
        ></input>
        <div className="relative flex justify-center items-center">
          {loading && <Spinner className="absolute top-7 " />}
          <input
            type="submit"
            value={value}
            className="text-white  cursor-pointer w-full  bg-[rgb(38,141,97)] mt-5 rounded-2xl py-[10px] font-bold"
            id="button"
            autoComplete="off"
          ></input>
        </div>
        <div className="flex  my-4 justify-center items-center">
          <p className="w-32 border-b-2 h-0 border-[rgb(109,109,109)]"></p>
          <p className="text-sm border-2 border-[rgb(109,109,109)] px-1 ">OR</p>
          <p className="w-32 border-b-2  h-0 border-[rgb(109,109,109)]"> </p>
        </div>
        <div
          onClick={setguestCredentials}
          className="text-white text-center cursor-pointer bg-red-500  rounded-2xl py-2 font-bold"
        >
          Login as guest user
        </div>
        <div
          onClick={() => {
            togglePage(false);
          }}
          className="cursor-pointer text-[rgb(109,109,109)] pt-4  justify-center text-center  flex text-sm"
        >
          <p>Need an account?</p>&nbsp;
          <p className="  underline">Sign up</p>
        </div>
      </div>
    </form>
  );
}

export default Login;
