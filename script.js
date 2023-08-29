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

//    cached elements/ query selectors
const playerInputEl = document.querySelector(".player-input");
const colourInputEl = document.querySelector(".colour-input");
const decodingBoardEl = document.querySelector(".decoding-board");

// functions
//    game setup
function initialiseGame() {
  setColours();
  setCode();
  setupPlayerInput();
  setupDecodingBoard();
}

function setColours() {
  codePegs.current = codePegs.all.slice(0, gameSettings.colours);
}

function setCode() {
  let temp = [...codePegs.current];
  for (let i = 0; i < gameSettings.keyLength; i++) {
    let index = Math.floor(Math.random() * temp.length);
    code.push(temp[index]);

    if (!gameSettings.duplicates) {
      temp.splice(index, 1);
    }
  }
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

function setupDecodingBoard() {
  for (let i = 1; i <= gameSettings.totalTries; i++) {
    const decodeAttemptEl = document.createElement("div");
    decodeAttemptEl.classList.add("decode-attempt");
    decodeAttemptEl.classList.add(`turn-${i}`);
    if (i == 1) {
      decodeAttemptEl.classList.add("selected");
    }

    const turnNumberEl = document.createElement("div");
    turnNumberEl.innerText = i;
    turnNumberEl.classList.add("turn-number");

    const codePegListEl = document.createElement("div");
    codePegListEl.classList.add("code-peg-list");

    const keyPegListEl = document.createElement("div");
    keyPegListEl.classList.add("key-peg-list");

    for (let j = 0; j < gameSettings.keyLength; j++) {
      const codePegEl = document.createElement("div");
      codePegEl.classList.add("code-peg");
      codePegEl.classList.add(`pos-${j}`);
      codePegListEl.append(codePegEl);

      const keyPegEl = document.createElement("div");
      keyPegEl.classList.add("key-peg");
      keyPegEl.classList.add(`pos-${j}`);
      keyPegListEl.append(keyPegEl);
    }

    decodeAttemptEl.append(turnNumberEl);
    decodeAttemptEl.append(codePegListEl);
    decodeAttemptEl.append(keyPegListEl);

    decodingBoardEl.append(decodeAttemptEl);
  }
}

function applySelection(element) {
  element.classList.add("selected");
}

function removeSelection(element) {
  element.classList.remove("selected");
}

// event listeners

initialiseGame();
