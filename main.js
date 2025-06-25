/*Main JS File for the project*/

console.log("Main JS file loaded for Road Trips.");
const gameData = {
    sessionId: null,
    states = [],
    stateCount = 0,
    amazonTrucks = 0,
    abcGamesCompleted = 0,
    abcGameInProgress = false,
    currentLetterIndex = 0,
    words = []
};
const sessionInfo = {
    id: null,
    name: null,
    date: null,
    gameData: gameData,
};
const alphabet = ["abcdefghijklmnopqrstuvwxyz"]

// Initialize the game. "Place" is an optional parameter to specify the trip location.
function init(place) {
    console.log("Initialization attempted.");
    if (sessionInfo.id === null) {
        newSession(place);
        initTripData();
        document.getElementById("stats").hidden = false;
    }
    console.log("Initialization complete.")
    return true;
}
// Creates a new session with a unique ID and date. "Place" is an optional parameter to specify the trip location.
function newSession(place) {
    console.log("New session creation attempted.");
    sessionInfo.id = Date.now();
    sessionInfo.date = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear();
    if (place === undefined) {
        place = "Somewhere";
        sessionInfo.name = "Trip on " + sessionInfo.date + ". No location specified."
    } else {
        sessionInfo.name = "Trip on " + sessionInfo.date + "to " + place
    }
    console.log(`New session created with ID: ${sessionInfo.id} on ${sessionInfo.date}`);
}
// Initializes trip data by linking the session ID to the game data.
function initTripData() {
    console.log("Trip data initialization attempted.");
    gameData.sessionId = sessionInfo.id;
}
//Clears the current session and resets all game data.
function clearSession() {
    console.log("Clearing game data.");
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
    gameData.words = []
    document.getElementById("stats").hidden = true;
    console.log("Game data cleared.");
}
//Core function for the ABC game. 
function abcGameCore(word) {
    //start new abc game if one is not in progress
    if (!gameData.abcGameInProgress) {
        console.log("Starting a new ABC game.");
        gameData.abcGameInProgress = true;
        gameData.currentLetterIndex = 0;
    }
    word.toLowerCase()
    console.log(`Processing word: ${word}`);
    quit=processOneWord(word)
    //TODO- add error handling and info later
    if (quit) {
        alert("Quitting ABC Game");
        return
    }

}
//Processes a single word input for the ABC game.
function processOneWord(word) {
    if (word = "quit") {
        console.log("Quitting ABC game.");
        gameData.abcGameInProgress = false;
        gameData.currentLetterIndex = 0;
        return true
    }
    targetLetter=alphabet[gameData.currentLetterIndex]
    firstLetter=word.charAt(0)
    err = 0
    if (firstLetter != targetLetter) {
        console.log(`Error: Word does not start with the correct letter. Expected ${targetLetter}, got ${firstLetter}`);
        return err++
    } else {
        gameData.words.push(word + ",")
        gameData.currentLetterIndex++
    }
    if (firstLetter == "z") {
        gameData.abcGamesCompleted++
        alert("Congratulations! You've completed the ABC game! Resetting things for the next game")
        gameData.abcGameInProgress = false;
        gameData.currentLetterIndex = 0;
    } return
}
//TODO: Implement a real dictionary check.
function validWord(word) {
    console.log("Determining if this is a valid word input.")
}
//Core function to log unique state license plates.
function stateListCore(state) {
    if (!isUniqueState(state)) {
        return alert(`State ${state} has already been logged.`);
    } else {
        gameData.states.push(state);
        gameData.stateCount++ ;
    }
    console.log(`Unique plates: ${gameData.stateCount}`);
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
}

function incrementAbcGamesCompleted() {
    gameData.abcGamesCompleted += 1;
    console.log(`ABC games completed: ${gameData.abcGamesCompleted}`);
}