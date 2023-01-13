import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

function Login() {
  let history = useHistory();
  const toast = useToast();

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
    <form className="" onSubmit={formHandler}>
      <div className=" w-96 flex flex-col h-[280px] justify-between p-[20px] rounded-[5px]">
        <h2 className="text-base font-bold">Email Address *</h2>
        <input
          className="border-2 p-[5px] outline-none rounded-[5px] ml-2"
          value={credentials.email}
          name="email"
          onChange={onChange}
          type={"text"}
          placeholder={"Enter Your Email Address"}
          required
        ></input>
        <h2 className="text-base font-bold">Password *</h2>
        <input
          className="border-2 p-[5px] outline-none rounded-[5px] ml-2"
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
          value="Login"
          className="text-white bg-blue-600 p-[5px] rounded-[5px]"
        ></input>
        <button className="text-white bg-red-700 p-[5px] rounded-[5px]">
          Get Guest User Credentials
        </button>
      </div>
    </form>
  );
}

export default Login;
