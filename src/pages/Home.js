import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function Home() {
  const [loginPage, setloginPage] = useState(true);
  const [loading, setloading] = useState(true)

  const togglePage = (value) => {
    setloginPage(value);
  };

  const toggleLoading = () => {
    setloading(false);
  };

  return (
    <div 
    onLoad={toggleLoading}
    className={"flex text-white  h-[105vh]     xl:h-[100vh]"}>
      {loading && (
        <div className="absolute flex flex-col z-50 pt-44 bg-[rgb(26,26,26)] w-full h-[100vh] items-center ">
          <img
            className="w-40 xl:w-52"
            alt=""
            src={
              "https://res.cloudinary.com/dynjwlpl3/image/upload/v1674985284/Chat-app/logo_rmgpil.png"
            }
          ></img>
          <div className="text-4xl  text-[rgb(194,194,194)] flex font-semibold">
            <p className="text-[rgb(79,224,165)]">Ch</p>
            <p className="text-[rgb(126,87,194)]">at</p>
            <p className="text-[rgb(254,194,0)]">Tap</p>
          </div>
          <div className="text-[rgb(170,170,170)] pt-28 xl:pt-36 text-sm xl:text-base items-center  flex space-x-2">
            <i className="fa-solid fa-lock"></i>
            <p>End to end encrypted</p>
          </div>
        </div>
      )}
      {!loading&&<div className=" flex text-white  h-[105vh] w-full     xl:h-[100vh]">
      <div className="w-[40%] justify-end hidden   xl:flex items-center bg-[rgb(36,36,36)]"></div>
      <div className="xl:w-[60%] w-full justify-center xl:justify-start flex items-center bg-[rgb(27,27,27)]">
        <div className="flex z-20 xl:hidden  absolute sm:left-10 left-4 sm:top-6  top-4 items-center">
          <img
            className="w-9 md:w-12"
            alt=""
            src={
              "https://res.cloudinary.com/dynjwlpl3/image/upload/v1674985284/Chat-app/logo_rmgpil.png"
            }
          ></img>
          <div className=" md:text-2xl  text-xl text-[rgb(194,194,194)] flex font-semibold">
            <p className="text-[rgb(79,224,165)]">Ch</p>
            <p className="text-[rgb(126,87,194)]">at</p>
            <p className="text-[rgb(254,194,0)]">Tap</p>
          </div>
        </div>
        <div className="absolute shadow-black top-20 md:top-auto  sm:shadow-2xl flex xl:right-[17.2rem] xl:w-[60%]">
          <div className="w-72 xl:flex hidden pt-28  px-8 items-center flex-col bg-[rgb(36,36,36)] h-[85vh] ">
            <img
              className="w-40"
              alt=""
              src={
                "https://res.cloudinary.com/dynjwlpl3/image/upload/v1674985284/Chat-app/logo_rmgpil.png"
              }
            ></img>
            <div className="text-3xl  text-[rgb(194,194,194)] flex font-semibold">
              <p className="text-[rgb(79,224,165)]">Ch</p>
              <p className="text-[rgb(126,87,194)]">at</p>
              <p className="text-[rgb(254,194,0)]">Tap</p>
            </div>
            <p className="text-center text-[rgb(170,170,170)]  leading-5 mt-4">
              Connect with friends and family in real-time.
            </p>
            <div className="text-[rgb(170,170,170)] pt-32 text-sm items-center  flex space-x-2">
              <i className="fa-solid fa-lock"></i>
              <p>End to end encrypted</p>
            </div>
          </div>
          {loginPage && <Login togglePage={togglePage} />}
          {!loginPage && <Signup togglePage={togglePage} />}
        </div>
      </div>
      </div>}
    </div>
  );
}

export default Home;
