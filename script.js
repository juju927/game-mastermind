// variables
//    constants
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

//    game state
const code = [];
const gameState = {
  isWin: false,
  isGame: false,
  // points: 0,
};

const currentMove = {
  attemptNo: 0,
  guess: ["red", "blue", "yellow", "green"],
  keyList: [],
};

//    query selectors
const playerInputEl = document.querySelector(".player-input");
const colourInputEl = document.querySelector(".colour-input");

// functions
//    game setup
function setCode() {
  let temp = [...codePegs.all];
  console.log(temp);
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
  let tempAns = [...code]; // make a copy of the answer into current move's temp

  // check for correct colour, correct spot (R)
  // replace checked values with 'x'
  for (let i = 0; i < temp.length; i++) {
    if (tempAns[i] == currentMove.guess[i]) {
      currentMove.keyList.push("R");
      tempAns[i] = "x";
      currentMove.guess[i] = "x";
    }
  }

  // check for correct colour, wrong spot (W)
  for (col of currentMove.guess) {
    // if 'x', ignore
    if (col == "x") {
      continue;
    }

    if (tempAns.includes(col)) {
      tempAns[tempAns.indexOf(col)] = "x";
      currentMove.keyList.push("W");
    }
  }
}

//    ui setup
function setupPlayerInput() {
  for (let colour of codePegs.current) {
    const a = document.createElement("div");
    a.innerText = colour;
    a.classList.add("colour-peg");
    a.classList.add(`${colour}-peg`);
    colourInputEl.append(a);
  }
}

// game.answer = setAnswer();

// event listeners
