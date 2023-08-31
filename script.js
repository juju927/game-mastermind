// variables
//    constants
const codePegs = {
  all: "red orange yellow green blue purple".split(" "),
  current: [], // colour list for current game
};

const gameSettings = {
  totalTries: 10, // amount of tries before game lose - max 2.5*keyLength
  keyLength: 6, // how long the code is - max 6
  colours: 6, // number of colour type inputs (max 6)
  duplicates: true, // can decide later if duplicates not allowed
};

const keyBinds = {
  r: "red",
  o: "orange",
  y: "yellow",
  g: "green",
  b: "blue",
  p: "purple",
  Enter: submitGuess,
  Backspace: removeLastColourFromGuess,
};

const extraInputButtons = ["delete", "submit"];
const gameButtons = ["settings"];

//    game state
var code = [];
const gameState = {
  isWin: false,
  isPlaying: true,
};

const currentMove = {
  attemptNo: 1,
  guess: [],
  keyList: [],
};

//    dynamic elements/ query selectors
const playerInputEl = document.querySelector(".player-input");
const colourInputEl = document.querySelector(".colour-input");
const decodingBoardEl = document.querySelector(".decoding-board");

//    cached elements/ query selectors

// functions
//    game setup
function initialiseGame() {
  currentMove.attemptNo = 1;
  currentMove.guess = [];
  currentMove.keyList = [];
  code = [];
  colourInputEl.innerHTML = "";
  decodingBoardEl.innerHTML = "";
  setColours();
  setCode();
  setupPlayerInput();
  setupDecodingBoard();
  changeSelectionOutline();
  gameState.isWin = false;
  gameState.isPlaying = true;
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

function checkGuess() {
  let tempAns = [...code]; // make a copy of the answer into current move's temp
  let Rcount = 0;

  // check for correct colour, correct spot (R)
  // replace checked values with 'x'
  for (let i = 0; i < tempAns.length; i++) {
    if (tempAns[i] == currentMove.guess[i]) {
      currentMove.keyList.push("R");
      Rcount++;
      tempAns[i] = "x";
      currentMove.guess[i] = "x";
    }
  }

  if (Rcount == code.length) {
    renderKeys();
    return true;
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
  renderKeys();
  return false;
}

function submitGuess() {
  if (currentMove.guess.length != gameSettings.keyLength) {
    return;
  }

  // run check guess, if win -> returns true, else -> returns false
  // if win
  if (checkGuess()) {
    setEnd(true);
    renderWin();
    renderPlayAgain();
    return;
  }

  // if lose
  if (currentMove.attemptNo == gameSettings.totalTries) {
    setEnd(false);
    renderLose();
    renderPlayAgain();
    return;
  }

  // if not win - go to next guess
  goNextGuess();
  return;
}

//    game control
function removeLastColourFromGuess() {
  currentMove.guess.pop();
  renderGuess();
}

function addtoGuess(colour) {
  if (currentMove.guess.length != gameSettings.keyLength) {
    if (codePegs.current.includes(colour)) {
      currentMove.guess.push(colour);
    }
  }
  renderGuess();
}

function goNextGuess() {
  currentMove.attemptNo += 1;
  currentMove.guess = [];
  currentMove.keyList = [];
  changeSelectionOutline();
}

function setEnd(win) {
  gameState.isWin = win;
  gameState.isPlaying = false;
}

function showAnswer() {
  console.log(code);
}

//    ui setup/ update
function setupPlayerInput() {
  for (let colour of codePegs.current) {
    const a = document.createElement("div");
    a.setAttribute("title", colour);
    a.classList.add("button");
    a.classList.add("colour-peg");
    a.classList.add(`${colour}-peg`);
    colourInputEl.append(a);
  }

  for (let button of extraInputButtons) {
    const newButton = document.createElement("div");
    newButton.setAttribute("title", button);
    newButton.classList.add("button");
    newButton.classList.add(`${button}-button`);
    colourInputEl.append(newButton);
  }

  // for (let button of gameButtons) {
  //   const newButton = document.createElement("div");
  //   newButton.setAttribute("title", button);
  //   newButton.classList.add("button");
  //   newButton.classList.add(`${button}-button`);
  //   playerInputEl.append(newButton);
  // }
}

function setupDecodingBoard() {
  for (let i = 1; i <= gameSettings.totalTries; i++) {
    const decodeAttemptEl = document.createElement("div");
    decodeAttemptEl.classList.add("decode-attempt");
    decodeAttemptEl.classList.add(`turn-${i}`);

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
      codePegEl.classList.add(`turn-${i}`);
      codePegEl.classList.add(`pos-${j}`);
      codePegListEl.append(codePegEl);

      const keyPegEl = document.createElement("div");
      keyPegEl.classList.add("key-peg");
      keyPegEl.classList.add(`turn-${i}`);
      keyPegEl.classList.add(`pos-${j}`);
      keyPegListEl.append(keyPegEl);
    }

    decodeAttemptEl.append(turnNumberEl);
    decodeAttemptEl.append(codePegListEl);
    decodeAttemptEl.append(keyPegListEl);

    decodingBoardEl.append(decodeAttemptEl);
  }
}

function changeSelectionOutline() {
  const selected = document.querySelector(".selected");
  if (selected) {
    selected.classList.remove("selected");
  }
  const toSelect = document.querySelector(`.turn-${currentMove.attemptNo}`);
  toSelect.classList.add("selected");

  toSelect.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderGuess() {
  for (let guessColourEl of document.querySelectorAll(
    `.code-peg.turn-${currentMove.attemptNo}`
  )) {
    for (let colour of codePegs.current) {
      guessColourEl.classList.remove(`${colour}-peg`);
    }
  }

  for (let i = 0; i < currentMove.guess.length; i++) {
    const a = document.querySelector(
      `.code-peg.turn-${currentMove.attemptNo}.pos-${i}`
    );
    a.classList.remove();
    a.classList.add(`${currentMove.guess[i]}-peg`);
  }
}

function renderKeys() {
  for (let i = 0; i < currentMove.keyList.length; i++) {
    const a = document.querySelector(
      `.key-peg.turn-${currentMove.attemptNo}.pos-${i}`
    );
    a.classList.add(`${currentMove.keyList[i]}-peg`);
  }
}

function renderWin() {
  // remove all remaining moves
  for (let i = currentMove.attemptNo + 1; i <= gameSettings.totalTries; i++) {
    const a = document.querySelector(`.decode-attempt.turn-${i}`);
    a.remove();
  }
}

function renderLose() {
  // show the actual answer
  const answerEl = document.createElement("div");
  answerEl.classList.add("answer");
  const codePegListEl = document.createElement("div");
  codePegListEl.classList.add("code-peg-list");

  const tiffyFace = document.createElement("div");
  tiffyFace.classList.add("tiffyface");
  codePegListEl.append(tiffyFace);

  for (let j = 0; j < gameSettings.keyLength; j++) {
    const codePegEl = document.createElement("div");
    codePegEl.classList.add("code-peg");
    codePegEl.classList.add(`${code[j]}-peg`);
    codePegListEl.append(codePegEl);
  }

  answerEl.append(codePegListEl);
  decodingBoardEl.append(answerEl);
  answerEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderPlayAgain() {
  const messageEl = document.createElement("div");
  messageEl.classList.add("message");
  const replayButton = document.createElement("div");
  replayButton.classList.add("button");
  replayButton.classList.add("replay-button");
  messageEl.append(replayButton);
  decodingBoardEl.append(messageEl);
  messageEl.scrollIntoView({ behavior: "smooth", block: "center" });

  replayButton.addEventListener("click", function (e) {
    initialiseGame();
  });
}

//    event listeners
playerInputEl.addEventListener("click", function (e) {
  e.preventDefault();

  // clicked a user input colour
  if (e.target.classList.contains("colour-peg")) {
    // if game is not ongoing, ignore the click
    if (!gameState.isPlaying) {
      return;
    }

    // if not, add to currentMove's guess
    addtoGuess(e.target.title);
    return;
  }
  // clicked the submit button
  if (e.target.classList.contains("submit-button")) {
    // if game is not ongoing, ignore the click (a bit redundant tbh)
    if (!gameState.isPlaying) {
      return;
    }

    // if not, submit the guess
    submitGuess();
  }

  if (e.target.classList.contains("delete-button")) {
    // if game is not ongoing, ignore the click
    if (!gameState.isPlaying) {
      return;
    }

    //if not, remove the last
    removeLastColourFromGuess();
    return;
  }
});

document.addEventListener("keydown", function (e) {
  e.preventDefault();

  // is game is not ongoing, ignore the key press
  if (!gameState.isPlaying) {
    return;
  }

  // if not a keybind, ignore the key press
  if (!(e.key in keyBinds)) {
    return;
  }

  // if colour keybind, add colour to guess
  if ("roygbp".split("").includes(e.key)) {
    addtoGuess(keyBinds[e.key]);
    return;
  }

  // if enter/ backspace then carry out mapped function
  keyBinds[e.key]();
  return;
});

window.onload = initialiseGame();

// scroll into view: https://stackoverflow.com/questions/68165/javascript-to-scroll-long-page-to-div
