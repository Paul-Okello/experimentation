"use client";

import React, { useEffect } from "react";
import { initJsPsych } from "jspsych";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import preload from "@jspsych/plugin-preload";

type Props = {};

const Experiment = () => {
  useEffect(() => {
    const jsPsych = initJsPsych();

    const preloadVariable = {
      type: preload,
      images: ["img/blue.png", "img/orange.png"],
    };

    const welcome = {
      type: htmlKeyboardResponse,
      stimulus: "Welcome to the experiment. Press any key to begin.",
    };

    const instructions = {
      type: htmlKeyboardResponse,
      stimulus: `
        <p>In this experiment, a circle will appear in the center 
        of the screen.</p><p>If the circle is <strong>blue</strong>, 
        press the letter F on the keyboard as fast as you can.</p>
        <p>If the circle is <strong>orange</strong>, press the letter J 
        as fast as you can.</p>
        <div style='width: 700px;'>
        <div style='float: left;'><img src='img/blue.png'></img>
        <p class='small'><strong>Press the F key</strong></p></div>
        <div style='float: right;'><img src='img/orange.png'></img>
        <p class='small'><strong>Press the J key</strong></p></div>
        </div>
        <p>Press any key to begin.</p>
      `,
      post_trial_gap: 2000,
    };

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
      timeline_variables: [
        { stimulus: "img/blue.png", correct_response: "f" },
        { stimulus: "img/orange.png", correct_response: "j" },
      ],
      repetitions: 5,
      randomize_order: true,
    };

    const debrief_block = {
      type: htmlKeyboardResponse,
      stimulus: function () {
        const trials = jsPsych.data.get().filter({ task: "response" });
        const correct_trials = trials.filter({ correct: true });
        const accuracy = Math.round(
          (correct_trials.count() / trials.count()) * 100
        );
        const rt = Math.round(correct_trials.select("rt").mean());

        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time was ${rt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
      },
    };

    const timeline = [
      preload,
      welcome,
      instructions,
      test_procedure,
      debrief_block,
    ];

    jsPsych.run(timeline);

    return () => {
      // Clean up or stop jsPsych if necessary
    };
  }, []);

  return <div>This is your jsPsych experiment!</div>;
};

export default Experiment;
