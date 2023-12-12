import Insights from "@/components/Insights";
import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div className='w-full max-w-7xl mx-auto'>
      <Insights />
    </div>
  );
}

export default page;
