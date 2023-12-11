import React from "react";

import dynamic from "next/dynamic";
const DocExperiment = dynamic(() => import("@/components/DocExperiment"), {
  ssr: false,
});

function HomePage({}) {
  return (
    <div>
      <DocExperiment />
    </div>
  );
}

export default HomePage;
