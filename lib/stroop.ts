interface Stimulus {
  stimulus: string;
  correct_response: string;
  word: string;
  color: string;
}

function generateStimuli(): Stimulus[] {
  const words = ["RED", "GREEN", "BLUE"] as const;
  const colors = ["red", "green", "blue"] as const;

  const stimuli: Stimulus[] = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      stimuli.push({
        stimulus: `<p style="color:${colors[j]}; font-size:48px;">${words[i]}</p>`,
        correct_response: words[j].charAt(0).toLowerCase(),
        word: words[i],
        color: colors[j],
      });
    }
  }

  return stimuli;
}

function generateAllStimuli(): Stimulus[] {
  const congruentStimuli: Stimulus[] = generateStimuli();

  console.log(congruentStimuli);

  return congruentStimuli;
}

export const stroopStimuli = generateAllStimuli();


export function interpretResults(accuracy: number, responseTime: number): string {
  let accuracyInterpretation: string = '';
  if (accuracy >= 80) {
    accuracyInterpretation = `You demonstrated an excellent understanding, with an accuracy of ${accuracy}%`;
  } else if (accuracy >= 60) {
    accuracyInterpretation = `Your accuracy ${accuracy}%, showcasing a good grasp of the task!`;
  } else if (accuracy >= 40) {
    accuracyInterpretation = `Your accuracy ${accuracy}%, indicating an average performance.`;
  } else if (accuracy >= 20) {
    accuracyInterpretation = `You achieved an accuracy ${accuracy}%. Consider exploring different strategies!`;
  } else {
    accuracyInterpretation = `Your accuracy ${accuracy}%. Keep practicing to enhance your performance!`;
  }

  const speedInterpretation: string = `Your average response time was ${responseTime}ms.\n This illustrates how quickly your brain processed and reacted to the color-word pairs, showcasing the agility of your cognitive processing.`;

  return `${accuracyInterpretation}\n\n${speedInterpretation}\n\nReflect: What strategies did you use?\n How did your brain react to conflicting information?\n Explore your experience and cognitive approach!`;
}

// Example usage:
const accuracy: number = 10; // Replace this with your accuracy percentage (10%, 20%, etc.)
const responseTime: number = 275; // Replace this with the average response time
const result: string = interpretResults(accuracy, responseTime);


// A helper function that cleans and sorts a string
function cleanAndSort(str: string): string {
  return str.toLowerCase().replace(/[^a-z]/g, "").split("").sort().join("");
}

// A function that checks whether two strings are anagrams
export function isAnagram(s1: string, s2: string): boolean {
  // Clean and sort both strings using the helper function
  s1 = cleanAndSort(s1);
  s2 = cleanAndSort(s2);

  // Compare the cleaned and sorted strings for equality
  return s1 === s2;
}

export const anagrams = [
  {
    sentence:
      "During the tense moments of the chess match, the players remained ______, each absorbed in deep strategic thought.",
    word: "Silent",
    original: "Listen",
  },
  // {
  //   sentence:
  //     "The _______ was very friendly and helpful, making sure we had everything we needed for our stay.",
  //   word: "Hostel",
  //   original: "Tholes",
  // },
  // {
  //   sentence:
  //     "She was a _______ writer, producing several novels and short stories every year.",
  //   word: "Prolific",
  //   original: "Frolicpi",
  // },
  // {
  //   sentence:
  //     "The _______ of the cake was moist and fluffy, while the frosting was rich and creamy.",
  //   word: "Layer",
  //   original: "Early",
  // },
  // {
  //   sentence:
  //     "He had a _______ for music and could play several instruments by ear.",
  //   word: "Flair",
  //   original: "Frail",
  // },
  // {
  //   sentence:
  //     "The _______ was a popular tourist attraction, offering a panoramic view of the city.",
  //   word: "Tower",
  //   original: "Wrote",
  // },
  // {
  //   sentence:
  //     "The _______ was a complex puzzle that required logic and creativity to solve.",
  //   word: "Enigma",
  //   original: "Gamine",
  // },
  // {
  //   sentence:
  //     "The _______ was a beautiful sight, with colorful flowers and butterflies.",
  //   word: "Garden",
  //   original: "Danger",
  // },
  // {
  //   sentence:
  //     "The _______ was a skilled craftsman, making exquisite jewelry and ornaments.",
  //   word: "Artisan",
  //   original: "Tsarina",
  // },
  // {
  //   sentence:
  //     "The _______ was a dangerous place, full of wild animals and poisonous plants.",
  //   word: "Jungle",
  //   original: "Lungej",
  // },
];


