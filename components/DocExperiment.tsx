"use client";

import React, { useEffect, useState } from "react";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import { interpretResults, stroopStimuli } from "@/lib/stroop";
import { addToDb } from "@/actions/load-data";
import Insights from "./Insights";
import Link from "next/link";
import { Button } from "./ui/button";

const DocExperiment = () => {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const jsPsych = initJsPsych({
      on_finish: () => {},
      default_iti: 250,
      display_element: "doc-experiment",
    });

    const initializeExperiment = () => {
      const welcome = {
        type: htmlKeyboardResponse,
        stimulus: `
        <div style="padding:20px;">
            <h1>Mind Games: Unveiling Your Brain's Colorful Dilemma</h1>
            <p>This experiment dives into a fascinating puzzle that explores how our brains process information.<br /> By playing with colors and words, it unravels the intricate balance between what we see and what we perceive.<br /> Understanding this experiment can offer insights into how our minds handle conflicting information, shedding light on the complexities of our thought processes.<br /> It's a peek into the magic of our brains and the way they navigate through everyday challenges!
            </p>
            <p style="margin:20px;font-size:20px;">Ready to uncover your brain's secret? Press any key on your keyboard to step into the next phase!</p>
        </div>          
        `,
      };

      const instructions = {
        type: htmlKeyboardResponse,
        stimulus: `
          <div style="padding:20px;">
            <p>In this task you will see a word in a color</p>
            <p style="color:red;font-size:48px;">BLUE</p>
            <p>Press r, g, b or y to identify the color, not the word</p>
            <p>E.g, press r for red in this example</p>
            <p>Make your responses as quickly and accurately as possible</p>
            <p>Press any key to begin</p>
          </div>
        `,
        post_trial_gap: 2000,
      };

      const stroopStimuliFormatted = stroopStimuli.map((stimulus) => ({
        stimulus: stimulus.stimulus,
        correct_response: stimulus.correct_response,
        word: stimulus.word,
        color: stimulus.color,
      }));

      const fixation = {
        type: htmlKeyboardResponse,
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: () => {
          return jsPsych.randomization.sampleWithoutReplacement(
            [1000, 2000, 250, 300, 400, 500, 600, 700, 800, 900],
            1
          )[0];
        },
        data: {
          task: "fixation",
        },
      };

      const displayStroopItem = {
        type: htmlKeyboardResponse,
        stimulus: jsPsych.timelineVariable("stimulus"),
        choices: ["r", "g", "b"],
        data: {
          task: "stroop",
          correct_response: jsPsych.timelineVariable("correct_response"),
          word: jsPsych.timelineVariable("word"),
          color: jsPsych.timelineVariable("color"),
        },
        on_finish: (data: any) => {
          data.correct = jsPsych.pluginAPI.compareKeys(
            data.response,
            data.correct_response
          );
        },
      };

      const stroopProcedure = {
        timeline: [fixation, displayStroopItem],
        timeline_variables: stroopStimuliFormatted,
        repetitions: 1,
        randomize_order: true,
      };

      const debriefBlock = {
        type: htmlKeyboardResponse,
        stimulus: () => {
          const trials = jsPsych.data.get().filter({ task: "stroop" });
          console.log(jsPsych.data.get());

          const correctTrials = trials.filter({ correct: true });
          const accuracy = Math.round(
            (correctTrials.count() / trials.count()) * 100
          );

          const rt = Math.round(correctTrials.select("rt").mean());
          const result: string = interpretResults(accuracy, rt);
          addToDb({
            accuracy,
            reactionTime: rt,
          });

          return `
            <p>Thank you for participating in this experiment!</p>
            <p>${result}</p>
            <p>Press any key to complete the experiment or refresh the page to do another experiment. Thank you!</p>`;
        },
      };

      jsPsych.run([welcome, instructions, stroopProcedure, debriefBlock]);
    };

    if (typeof window !== "undefined") {
      initializeExperiment();
    }
  }, []);

  function handleRestart() {
    setDone(false);
    window.location.reload();
  }

  console.log(done);

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div className='h-[50vh] mt-5' id='doc-experiment' />
      <div className='flex justify-between max-w-lg gap-2'>
        <Link href='/insights'>
          <Button variant='outline' size='lg'>
            Go to Insights
          </Button>
        </Link>

        {done === true && (
          <Button onClick={() => handleRestart()}>Restart Experiement</Button>
        )}
      </div>
    </div>
  );
};

export default DocExperiment;
