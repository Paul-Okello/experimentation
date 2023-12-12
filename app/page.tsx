import React from "react";

import dynamic from "next/dynamic";
import Insights from "@/components/Insights";
const DocExperiment = dynamic(() => import("@/components/DocExperiment"), {
  ssr: false,
});

function HomePage({}) {
  return (
    <div className='w-full max-w-7xl mx-auto'>
      <DocExperiment />
    </div>
  );
}

export default HomePage;
