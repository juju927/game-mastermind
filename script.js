// constants
const codePegs = "red orange yellow green blue purple".split(" ");
const gameSettings = {
  totalTries: 10, // amount of tries before game lose
  keyLength: 4, // how long the code is
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
  for (let i = 0; i < gameSettings.keyLength; i++) {
    code.push(codePegs[Math.floor(Math.random() * codePegs.length)]);
  }
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

// game.answer = setAnswer();
setCode();
console.log("code", code);
console.log("guess", currentMove.guess);
checkAnswer();
console.log(currentMove.keyList);

// event listeners
