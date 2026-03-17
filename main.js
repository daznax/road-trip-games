/*Main JS File for the project*/

console.log("Main JS file loaded for Road Trips.");
const gameData = {
  sessionId: null,
  states: [],
  stateCount: 0,
  amazonTrucks: 0,
  abcGamesCompleted: 0,
  abcGameInProgress: false,
  currentLetterIndex: 0,
  words: [],
  useDictionary: false,
};
const sessionInfo = {
  id: null,
  name: null,
  date: null,
  gameData: gameData,
};
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const prompts = [
  "You're looking for a word that starts with... ",
  "The next word you need should begin with... ",
  "Find something beginning with the letter... ",
  "Ah geez, you just need a word with... ",
];
const apiKey = "6bebddb1-cff2-49b1-9d4f-f5f62631ae66";
const dictToggle = document.getElementById("useDictionary");

document.getElementById("useDictionary").addEventListener("click", (e) => {
  if (!gameData.useDictionary) {
    gameData.useDictionary = true;
    dictToggle.setAttribute("disabled", "disabled");
  } else {
    //realistically we will never hit this block, but just in case we do.
    gameData.useDictionary = false;
    dictToggle.removeAttribute("disabled");
    dictToggle.checked = !dictToggle.checked;
  }
});

// Initialize the game. "Place" is an optional parameter to specify the trip location.
function init() {
  place = document.getElementById("placeInput").value.trim();

  console.log("Initialization attempted.");
  if (sessionInfo.id === null) {
    newSession(place);
    initTripData();
    document.getElementById("stats").hidden = false;
  }
  console.log("Initialization complete.");
  return true;
}
// Creates a new session with a unique ID and date. "Place" is an optional parameter to specify the trip location.
function newSession(place) {
  console.log("New session creation attempted.");
  sessionInfo.id = Date.now();
  sessionInfo.date =
    new Date().getDate() +
    "-" +
    (new Date().getMonth() + 1) +
    "-" +
    new Date().getFullYear();
  if (place === undefined) {
    place = "Somewhere";
    sessionInfo.name =
      "Trip on " + sessionInfo.date + ". No location specified.";
  } else {
    sessionInfo.name = "Trip on " + sessionInfo.date + "to " + place;
  }
  console.log(
    `New session created with ID: ${sessionInfo.id} on ${sessionInfo.date}`,
  );
}
// Initializes trip data by linking the session ID to the game data.
function initTripData() {
  console.log("Trip data initialization attempted.");
  gameData.sessionId = sessionInfo.id;
}
//Clears the current session and resets all game data.
function clearSession() {
  console.log("Clearing game data.");
  let result = confirm("Are you sure you want to clear session data?");
  if (result) {
    sessionInfo.id = null;
    sessionInfo.name = null;
    sessionInfo.date = null;
    gameData.sessionId = null;
    gameData.states = [];
    gameData.stateCount = 0;
    gameData.amazonTrucks = 0;
    gameData.abcGamesCompleted = 0;
    gameData.abcGameInProgress = false;
    gameData.currentLetterIndex = 0;
    gameData.words = [];
    document.getElementById("truckCount").innerText = "0";
    document.getElementById("plateList").innerText = "No plates yet!";
    document.getElementById("wordList").innerText = "No words yet!";
    gameData.useDictionary = false;
    dictToggle.removeAttribute("disabled");
    dictToggle.checked = !dictToggle.checked;
    console.log("Game data cleared.");
  } else {
    console.log("User canceled clear. Game data not cleared.");
  }
}
//Core function for the ABC game.
async function abcGameCore() {
  word = document.getElementById("abcInput").value.trim();
  if (word == "") {
    console.log("No word specified. Will not process.");
    return alert("You did not type in a word!");
  }

  //start new abc game if one is not in progress
  if (!gameData.abcGameInProgress) {
    console.log("Starting a new ABC game.");
    gameData.abcGameInProgress = true;
    gameData.currentLetterIndex = 0;
  }
  word.toLowerCase();
  console.log(`Processing word: ${word}`);
  quit = await processOneWord(word);
  //TODO- add error handling and info later
  if (quit) {
    alert("Quitting ABC Game");
    return;
  }
}
//Processes a single word input for the ABC game.
async function processOneWord(word) {
  if (word == "quit") {
    console.log("Word = quit. Quitting ABC game.");
    gameData.abcGameInProgress = false;
    gameData.currentLetterIndex = 0;
    if (gameData.useDictionary === true) {
      gameData.useDictionary = false;
      dictToggle.removeAttribute("disabled");
      dictToggle.checked = !dictToggle.checked;
    }
    return true;
  }
  index = gameData.currentLetterIndex;
  console.log("Current letter index:", index);
  targetLetter = alphabet.charAt(index);
  console.log("Current letter:", targetLetter);
  firstLetter = word.charAt(0).toLowerCase();
  error = 0;
  if (firstLetter != targetLetter) {
    console.log(
      `Error: Word does not start with the correct letter. Expected ${targetLetter}, got ${firstLetter}`,
    );
    error++;
    alert("Wrong letter!!");
    console.log(`Error count: ${error}`);
    return false;
  }
  if ((await validWord(word)) === false) {
    alert("Invalid word!");
    error++;
    console.log(`Error count: ${error}`);
    return false;
  } else {
    gameData.words.push(word);
    gameData.currentLetterIndex++;
    randPrompt();
    console.log(`Word accepted: ${word}. Moving to next letter.`);
    console.log(gameData.words);
  }
  if (firstLetter == "z") {
    gameData.abcGamesCompleted++;
    alert(
      "Congratulations! You've completed the ABC game! Resetting things for the next game",
    );
    gameData.abcGameInProgress = false;
    gameData.currentLetterIndex = 0;
    if (gameData.useDictionary === true) {
      gameData.useDictionary = false;
      dictToggle.removeAttribute("disabled");
      dictToggle.checked = !dictToggle.checked;
    }
    return false;
  }
  displayList("words");
}
//displays word list for the stats section
function displayList(context) {
  let list = "";
  if (context == "words") {
    for (let x in gameData.words) {
      list += gameData.words[x] + "<br/>";
    }
    document.getElementById("wordList").innerHTML = list;
  } else if (context == "states") {
    for (let x in gameData.states) {
      list += gameData.states[x] + "<br/>";
    }
    document.getElementById("plateList").innerHTML = list;
  }
  return;
}

//returns true if word is valid according to MW API or the API is not in use, false otherwise
async function validWord(word) {
  console.log("Determining if this is a valid word input.");
  let result = false;
  //if not using the API, always set result = true
  if (gameData.useDictionary === false) {
    result = true;
  } else {
    result = await getData(word);
  }
  console.log(result);
  return result;
}

// calls the Merriam Webster API to check for word validity
// returns true is word is valid, false otherwise
async function getData(word) {
  let ret = false;
  const url =
    "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
  try {
    const response = await fetch(`${url}${word}?key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    if (!result[0]?.meta) {
      console.log("Invalid word");
    } else {
      ret = true;
    }
  } catch (error) {
    console.error(error.message);
  }
  return ret;
}

//used for ABC game to set a random prompt for the next letter!
function randPrompt() {
  let x = randInt();
  console.log(x, prompts[x]);
  document.getElementById("letter").innerText =
    prompts[x] + alphabet.charAt(gameData.currentLetterIndex).toUpperCase();
}

function randInt() {
  const min = Math.ceil(1);
  const max = Math.floor(4);
  return Math.floor(Math.random() * (max - min) + min);
}

//Core function to log unique state license plates.
function stateListCore() {
  state = document
    .getElementById("stateProvinceInput")
    .value.trim()
    .toUpperCase();
  if (state == "") {
    console.log("State is blank. Will not process.");
    return alert("No state specified. Select a state from the list.");
  } else if (!isUniqueState(state)) {
    return alert(`State ${state} has already been logged.`);
  } else {
    gameData.states.push(state);
    gameData.stateCount++;
  }
  console.log(`Unique states: ${gameData.stateCount}`);
  displayList("states");
}

function isUniqueState(state) {
  if (gameData.states.includes(state)) {
    console.log(`State ${state} has already been logged.`);
    return false;
  } else {
    console.log(`State ${state} is unique and will be logged.`);
    return true;
  }
}

function incrementAmazonTrucks() {
  gameData.amazonTrucks += 1;
  console.log(`Amazon trucks counted: ${gameData.amazonTrucks}`);
  console.log("Updating live stats tracker");
  document.getElementById("truckCount").innerText = gameData.amazonTrucks;
}

function incrementAbcGamesCompleted() {
  gameData.abcGamesCompleted += 1;
  console.log(`ABC games completed: ${gameData.abcGamesCompleted}`);
}
