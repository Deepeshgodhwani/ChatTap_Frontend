import React from "react";
import ScrollableFeed from "react-scrollable-feed";

import "../App.css";

function RenderGroupMessages(props) {
  const { messages, user } = props;

  const checkUser = (User) => {
    if (User._id === user._id) {
      return "You";
    } else {
      return User.name;
    }
  };
  return (
    <ScrollableFeed className="chatBox flex flex-col py-2  px-2 overflow-y-scroll space-y-3">
      {messages &&
        messages.map((message, i) => {
          if (message.noty) {
            return (
              <div key={message._id} className="flex  justify-center">
                <span className="bg-[rgb(36,36,36)] px-3 py-1 rounded-xl text-sm">
                  <span className=" text-xs capitalize">
                    {checkUser(message.sender)}
                  </span>
                  &nbsp;
                  {message.content}
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
                  className={` px-2 py-1 bg-[rgb(38,141,97)] rounded-lg 
                              `}
                >
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
                  <img
                    className="w-9 h-10 rounded-full "
                    alt=""
                    src={message.sender.avtar}
                  ></img>
                  <div className="space-y-1">
                    <div className="flex space-x-3">
                    <p className="text-xs font-semibold">{message.sender.name}</p>
                    <p className="text-xs text-[rgb(115,115,115)]">10:39 PM</p>
                    </div>
                    <p className="px-2 text-[rgb(168,170,172)] py-2  space-y-1 rounded-tr-lg rounded-br-lg rounded-bl-lg bg-[rgb(53,55,59)] text-sm">
                      {message.content}
                    </p>
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
