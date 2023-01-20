import React ,{useContext} from "react";
import ScrollableFeed from "react-scrollable-feed";
import ChatContext from "../context/user/ChatContext";


import "../App.css";

function RenderGroupMessages(props) {
  const { messages, user } = props;
  const context = useContext(ChatContext);
  const {logUser}=context;


  const checkUser = (User) => {
    if (User._id === user._id) {
      return "You";
    } else {
      return User.name;
    }
  };

  
  const checkSelf=(element)=>{
         if(messages.length<2){return ;}   
        let index=messages.indexOf(element);
         if(messages[index-1].sender._id!==element.sender._id){
           return true;
         }else{
             return false;
         }
  }


  const filterMessage=(message)=>{
        
        return message.replace(logUser.name,"you");
  }


 

  return (
    <ScrollableFeed className="chatBox flex flex-col py-2  px-2 overflow-y-scroll space-y-2">
      {messages &&
        messages.map((message, i) => {
          if (message.noty) {
            return (
              <div key={message._id} className="flex  justify-center">
                <span className="bg-[rgb(36,36,36)] px-4 text-[rgb(199,199,199)] py-1 rounded-lg text-sm">
                  <span className=" text-xs capitalize">
                    {checkUser(message.sender)}
                  </span>
                  &nbsp;
                  {filterMessage(message.content)}
                </span>
              </div>
            );
          } else if (message.sender._id === user._id) {
            return (
              <div
                key={message._id}
                className="flex
                        justify-end"
              >
                <span
                  className={` flex px-2  text-white py-[6px] text-sm max-w-xs  break-all   bg-[rgb(38,141,97)] rounded-lg `}>
                  {message.content}
                </span>
              </div>
            );
          } else {
            return (
              <div
                className={`flex
                         `}
                key={message._id}
              >
                <div className="flex space-x-2">
                  {checkSelf(message)&&<img
                    className="w-9 h-10 rounded-full "
                    alt=""
                    src={message.sender.avtar}
                  ></img>}
                  <div className="space-y-1 ">
                    <div className="flex space-x-3">
                      {checkSelf(message)&&<p className="text-xs font-semibold">
                        {message.sender.name}
                      </p>}
                    </div>
                    {checkSelf(message)?<div className="px-2 max-w-xs  break-all   text-white  py-[6px]   space-y-1 rounded-tr-lg  rounded-br-lg rounded-bl-lg bg-[rgb(53,55,59)] text-sm">
                        {message.content}
                        
                    </div>
                    :<div className="px-2 bg-[rgb(53,55,59)] max-w-xs  break-all    py-[6px]  text-sm rounded-lg text-white ml-10   ">
                      {message.content}
                    </div>}
                  </div>
                </div>
              </div>
            );
          }
        })}
    </ScrollableFeed>
  );
}

export default RenderGroupMessages;
