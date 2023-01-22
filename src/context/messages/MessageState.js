
import React from 'react'
import { useState } from 'react';
import MessageContext from "./MessageContext";

import CryptoJS from "crypto-js"

const secretPass = "XkhZG4fW2t2W";

function MessageState(props) {

    const encryptData = (message) => {
      const data = CryptoJS.AES.encrypt(
        JSON.stringify(message),
        secretPass
      ).toString();
        return data;
    };

    const decryptData = (message) => {
        const bytes = CryptoJS.AES.decrypt(message, secretPass);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return data;
      };

     
  return (
    <MessageContext.Provider value={{encryptData,decryptData}}>
        {props.children}
    </MessageContext.Provider>
  )
}

export default MessageState;