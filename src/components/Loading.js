import React from "react";
import { Spinner } from "@chakra-ui/react";

function Loading() {
  return (
    <div className="flex justify-center pt-44 2xl:pt-60 items-center">
      <Spinner thickness="5px" speed="0.65s" color="rgb(53,55,59)" size="xl" />
    </div>
  );
}

export default Loading;
