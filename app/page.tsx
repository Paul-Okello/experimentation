"use client";

import React from "react";
import "jspsych/css/jspsych.css";

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
