"use client";

import { useEffect, useState } from "react";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import surveyLikert from "@jspsych/plugin-survey-likert";
import visualSearchCircle from "@jspsych/plugin-visual-search-circle";
import webgazer from "@jspsych/extension-webgazer";
import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import {
  anagrams,
  interpretResults,
  isAnagram,
  stroopStimuli,
} from "@/lib/stroop";
import { addToDb } from "@/actions/load-data";
import Link from "next/link";
import { Button } from "./ui/button";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import surveyMultiChoice from "@jspsych/plugin-survey-multi-choice";
import surveyText from "@jspsych/plugin-survey-text";
import { time } from "console";
import toast from "react-hot-toast";
import _ from "lodash";

const DocExperiment = () => {
  const [done, setDone] = useState(false);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [accurateResponses, setAccurateResponses] = useState(0);

  function handleRestart() {
    setDone(false);
    window.location.reload();
  }
  useEffect(() => {
    // Define the anagram trials

    // Define the instruction trial
    const instruction_trial = {
      type: htmlKeyboardResponse,
      stimulus: `<div style="padding:20px;">
      <h1>An exciting journey into our own minds</h1>
      <p>This experiment explores how humans respond to anagrams – a puzzle where the positioning of letters creates a totally different set of words. The main question of this inquiry is whether you can crack these anagrams without paying attention to the meanings of the words.</p>
      <p>Your goal is to play with scrambled puzzles without any clues. You will be shown a number of anagrams on a digital screen and you should type the original word using your keyboard. Every trial begins with a short fixation cross.</p>
      <p style="margin:20px;font-size:20px;">Ready to start the experiment? Hit any key to begin!</p>
  </div>`,
      choices: "ALL_KEYS",
      trial_duration: 9000,
    };

    // Define the fixation trial
    const fixation_trial = {
      type: htmlKeyboardResponse,
      stimulus: "+",
      choices: "NO_KEYS",
      trial_duration: 500,
    };

    // Define the anagram trial
    const anagram_trial = {
      type: surveyText,
      post_trial_gap: 1000,
      questions: [
        {
          prompt: () => {
            try {
              // Get the anagram sentence and word from the previous trial
              const previousTrialData = jsPsych.data.get().last(1).values()[0];
              const sentence = previousTrialData.sentence;
              const word = previousTrialData.word;
              // Display the anagram sentence with the word in bold
              console.log("-->", previousTrialData);

              console.log(
                "sentence",
                sentence,
                "word",
                word,
                "previousTrialData",
                previousTrialData
              );
              return sentence.replace(
                "______",
                "<strong>" + word + "</strong>"
              );
            } catch (error) {
              // Handle the error and display a message
              console.error(error);
              return "An error occurred. Please try again.";
            }
          },
        },
      ],
    };

    // Timeline for the experiment
    const timeline = [];
    timeline.push(instruction_trial);

    // Loop through each anagram and add trials to the timeline

    console.log("anagrams", anagrams);
    for (let i = 0; i < anagrams.length; i++) {
      // Add the fixation trial
      timeline.push(fixation_trial);

      // Add the anagram trial with the sentence and word data
      timeline.push({
        on_start: function (trial: any) {
          const sentence =
            anagrams[i].sentence +
            ".  HINT: ANAGRAM:" +
            anagrams[i].original.toUpperCase();
          // Set the prompt dynamically with the updated sentence
          trial.questions[0].prompt = sentence;
        },
        on_finish: function (data: any) {
          // Get the response and the original word from the data
          const response = jsPsych.data.get().last(1).values()[0].response.Q0;

          console.log("response", response);
          const original = anagrams[i].original;
          console.log("original", original);
          // Check the accuracy of the response
          const accuracy = response.toUpperCase() === original.toUpperCase();
          // Add the accuracy to the data
          data.accuracy = accuracy;
          console.log("data", data);
          console.log("accuracy", accuracy);

          data.correct = isAnagram(response, original);

          console.log("data.correct", data.correct);
        },
        ...anagram_trial,
      });

      // Add the feedback trial
      timeline.push({
        type: htmlKeyboardResponse,
        stimulus: function () {
          // Get the response and the original word from the previous trial
          const response = jsPsych.data.get().last(1).values()[0].response.Q0;
          const answer = anagrams[i].word;
          // Check the accuracy
          const accuracy = jsPsych.data.get().last(1).values()[0];
          console.log("accuracy", accuracy);
          // Display the feedback
          let html = "<p>The correct answer was: " + answer + "</p>";
          html += "<p>Your answer was: " + response + "</p>";

          html += "<p>Press any key to continue</p>";
          return html;
        },
        choices: "ALL_KEYS",
      });
    }

    const debriefBlock = {
      type: htmlKeyboardResponse,
      stimulus: () => {
        const trials = jsPsych.data.get().filter({ trial_type: "survey-text" });
        console.log("Debrief-->", trials);

        const correctTrials = trials.filter({ correct: true });
        const accuracy = Math.round(
          (correctTrials.count() / trials.count()) * 100
        );

        correctTrials.select("rt");

        const rt = Math.round(correctTrials.select("rt").mean());

        console.log("correctTrials", correctTrials);
        console.log("accuracy", accuracy);
        console.log("rt", rt);
        const result: string = interpretResults(accuracy, rt);
        addToDb({
          accuracy,
          reactionTime: rt,
        });

        toast(
          `
            Thank you for participating in this experiment!\n
            ${result}\n
            Press any key to complete the experiment or refresh the page to do another experiment. Thank you!`,
          {
            duration: 3000,
            position: "bottom-center",
          }
        );

        return `
            <p>Thank you for participating in this experiment!</p>
            <p>${result}</p>
            <p>Press any key to complete the experiment or refresh the page to do another experiment. Thank you!</p>`;
      },
    };

    timeline.push(debriefBlock);

    // Initialize jsPsych
    const jsPsych = initJsPsych({
      timeline: timeline,
      on_finish: () => {
        jsPsych.data.get().localSave("csv", "data-labelled-cognitive.csv");
      },
      display_element: "doc-experiment",
    });

    // Run jsPsych
    jsPsych.run(timeline);
  }, []);

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div className=' mt-5' id='jspsych-survey-likert-0' />
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
