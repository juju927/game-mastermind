// constants
const codePegs = {
  all: "red orange yellow green blue purple".split(" "),
  current: [], // colour list for current game
};

const gameSettings = {
  totalTries: 10, // amount of tries before game lose
  keyLength: 4, // how long the code is
  colours: 6, // number of colour type inputs (max 6)
  duplicates: true, // can decide later if duplicates not allowed
};

// variables
const code = [];
const gameState = {
  isWin: false,
  isGame: false,
  // points: 0,
};

const currentMove = {
  attemptNo: 0,
  temp: [],
  guess: ["red", "blue", "yellow", "green"],
  keyList: [],
};

// functions
function setCode() {
  let temp = [...codePegs.all];
  console.log(temp)
  for (let i = 0; i < gameSettings.keyLength; i++) {
    let index = Math.floor(Math.random() * temp.length);
    code.push(temp[index]);

    if (!gameSettings.duplicates) {
      temp.splice(index, 1);
    }
  }
}

function setColours() {
  codePegs.current = codePegs.all.slice(0, gameSettings.colours);
}

function checkAnswer() {
  currentMove.temp = [...code]; // make a copy of the answer into current move's temp

  // check for correct colour, correct spot (R)
  for (let i = 0; i < currentMove.temp.length; i++) {
    if (currentMove.temp[i] == currentMove.guess[i]) {
      currentMove.keyList.push("R");
      currentMove.temp[i] = "x";
      currentMove.guess[i] = "x";
    }
  }

  // check for correct colour, wrong spot (W)
  for (col of currentMove.guess) {
    if (col == "x") {
      continue;
    }

    if (currentMove.temp.includes(col)) {
      currentMove.temp[currentMove.temp.indexOf(col)] = "x";
      currentMove.keyList.push("W");
    }
  }
}

// function setupPlayerInput() {}


// game.answer = setAnswer();

// event listeners
