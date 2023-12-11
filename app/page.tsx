import React from "react";
import "jspsych/css/jspsych.css";
import Experiment from "@/components/Experiment";
import DocExperiment from "@/components/DocExperiment";

type Props = {};

function HomePage({}: Props) {
  return (
    <div>
      {/* <Experiment /> */}
      <DocExperiment />
    </div>
  );
}

export default HomePage;
