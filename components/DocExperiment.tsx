"use client";

import React, { useEffect, useState } from "react";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import jsPsychPreload from "@jspsych/plugin-preload";
import blueImage from "./blue.png";
import orangeImage from "./orange.png";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";

type Props = {};

function DocExperiment({}: Props) {
  const [timeline, setTimeline] = useState();

  const jsPsych = initJsPsych({
    on_finish: function () {
      console.log(jsPsych.data.get().values());
    },
    show_progress_bar: true,
    default_iti: 250,
  });

  useEffect(() => {
    const preload = {
      type: jsPsychPreload,
      images: ["blue.png", "orange.png"],
      show_detailed_errors: true,
    };

    const welcome = {
      type: htmlKeyboardResponse,
      stimulus: "Welcome to the experiment. Press any key to begin.",
    };

    const instructions = {
      type: htmlKeyboardResponse,
      stimulus: ExperimentInstructions,
      post_trial_gap: 2000,
      css_classes: ["custom-circle", "custom-container", "custom-flex"],
    };

    const test_stimuli = [
      { stimulus: "blue.png", correct_response: "f" },
      { stimulus: "orange.png", correct_response: "j" },
    ];

    const fixation = {
      type: htmlKeyboardResponse,
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: "NO_KEYS",
      trial_duration: function () {
        return jsPsych.randomization.sampleWithoutReplacement(
          [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
          1
        )[0];
      },
      data: {
        task: "fixation",
      },
    };

    const test = {
      type: imageKeyboardResponse,
      stimulus: jsPsych.timelineVariable("stimulus"),
      choices: ["f", "j"],
      data: {
        task: "response",
        correct_response: jsPsych.timelineVariable("correct_response"),
      },
      on_finish: function (data: any) {
        data.correct = jsPsych.pluginAPI.compareKeys(
          data.response,
          data.correct_response
        );
      },
    };

    const test_procedure = {
      timeline: [fixation, test],
      timeline_variables: test_stimuli,
      repetitions: 5,
      randomize_order: true,
    };
    var debrief_block = {
      type: htmlKeyboardResponse,
      stimulus: function () {
        var trials = jsPsych.data.get().filter({ task: "response" });
        var correct_trials = trials.filter({ correct: true });
        var accuracy = Math.round(
          (correct_trials.count() / trials.count()) * 100
        );
        var rt = Math.round(correct_trials.select("rt").mean());

        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time was ${rt}ms.</p>
          <p>Press any key to complete the experiment or refresh the page to do another experiment. Thank you!</p>`;
      },
    };

    //   setTimeline([preload, welcome]);

    jsPsych.run([
      preload,
      welcome,
      instructions,
      test_procedure,
      debrief_block,
    ]);
  }, []);
  return <div>DocExperiment</div>;
}

export default DocExperiment;

const ExperimentInstructions = `
 <div className="custom-container">
        <div className="custom-text">
          <p className="custom-text-lg">
            In this experiment, a circle will appear in the center of the screen.
          </p>
          <p className="custom-text-lg">
            If the circle is
            <span className="custom-bold custom-text-blue">blue</span>, press the
            letter <span className="custom-bold">F</span> on the keyboard as
            fast as you can.
          </p>
          <p className="custom-text-lg">
            If the circle is
            <span className="custom-bold custom-text-orange">orange</span>,
            press the letter <span className="custom-bold">J</span> as fast as
            you can.
          </p>
        </div>
        <div className="custom-flex">
          <div className="custom-circle mx-4">
            <img
              src="blue.png"
              alt="Blue Circle"
              className="custom-img"
            />
            <p className="custom-text-xs custom-text-blue">
              Press the <strong>F</strong> key
            </p>
          </div>
          <div className="custom-circle mx-4">
            <img
              src="orange.png"
              alt="Orange Circle"
              className="custom-img"
            />
            <p className="custom-text-xs custom-text-orange">
              Press the <strong>J</strong> key
            </p>
          </div>
        </div>
        <p className="custom-text-lg">Press any key to begin.</p>
      </div>`;
