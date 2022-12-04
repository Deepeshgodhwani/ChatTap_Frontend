import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'

const ScrollableChat = (props) => {
    const {messages,user}=props;
      console.log(messages);
  return (
    <ScrollableFeed className=''>
         {/* {messages && messages.map((message,i)=>{
                return (
                    <div className={`flex`}  key={message._id}>
                       <span className={` px-2 py-1 text-white rounded-lg ${message.sender._id===user._id?"bg-green-500":"bg-blue-500"}
                         ${message.sender._id===user._id?"ml-[80%]":"bg-blue-500"}  `}>
                        {message.content}
                        </span>     
                    </div>
                )
            })} */
        }
    </ScrollableFeed>
  )
}

export default ScrollableChat
