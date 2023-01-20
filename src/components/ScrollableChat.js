import React from "react";

import "../App.css";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = (props) => {
  const { messages, user } = props;
  return (
    // 
    <ScrollableFeed  className=" chatBox flex  flex-col py-2    px-8  overflow-y-scroll space-y-2  ">
      {messages &&
        messages.map((message, i) => {
          return (
            <div
              className={`flex
                      ${
                        message.sender._id === user._id ? "justify-end" : ""
                      }   `}
              key={message._id}
            >
              <span
                className={`px-2 py-[6px] space-x-2 flex  max-w-xs  break-all  text-white  pt-1 text-sm    rounded-lg ${message.sender._id === user._id ? "bg-[rgb(38,141,97)]": "bg-[rgb(53,55,59)]"}`}>
                     {message.content}
                                </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
