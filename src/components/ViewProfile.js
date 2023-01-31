import React, { useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    useDisclosure,
  } from "@chakra-ui/react";

function ViewProfile(props) {

     const {Profile ,view,setview}=props;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toggleView=(status)=>{
           if(view && !status){
               onOpen();
           }else{
                onClose();
                setview(false);
           }
    }

    useEffect(() => {
          toggleView();
    }, [view])
    

  return (
     <Modal isOpen={isOpen} onClose={()=>toggleView(true)}>
                <ModalOverlay />
                <ModalContent borderRadius={"20px"}>
                  <img
                    alt=""
                    className="h-[70vh] rounded-lg"
                    src={
                      Profile.isGroupChat ? Profile.profilePic : Profile.avtar
                    }
                  ></img>
                </ModalContent>
    </Modal> 
  )
}

export default ViewProfile