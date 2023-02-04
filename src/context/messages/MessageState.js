import React from "react";
import MessageContext from "./MessageContext";
import CryptoJS from "crypto-js";

function MessageState(props) {
  const secretPass = process.env.REACT_APP_ENCRYPTION_SECRET_PASS;

  // To encryt message
  const encryptData = (message) => {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify(message),
      secretPass
    ).toString();
    return data;
  };

  // To decrypt message
  const decryptData = (message) => {
    const bytes = CryptoJS.AES.decrypt(message, secretPass);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data;
  };

  return (
    <MessageContext.Provider value={{ encryptData, decryptData }}>
      {props.children}
    </MessageContext.Provider>
  );
}

export default MessageState;
