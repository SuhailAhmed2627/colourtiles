// DOM Variables
var targetBoardDOM = document.getElementById("target-board");
var gameBoardDOM = document.getElementById("game-board");
var resultDOM = document.getElementById("result");
var infoDOM = document.getElementById("info");
var restartDOM = document.getElementById("restart");
var menuDOM = document.getElementById("menu");
var heading = document.getElementById("heading");
var playersSelectDOM = document.getElementById("players-select");
var difficultySelectDOM = document.getElementById("difficulty-select");
var nameSelectionDOM = document.getElementById("name-selection");
var resetButtonDOM = document.getElementById("reset");
var highScoresContainerDOM = document.getElementById("high-scores-container");
var highScoresListDOM = document.getElementById("high-scores");
var viewScoresDOM = document.getElementById("view-scores");

var tile;
var tempGAME = {}; // To store the GAME temporarily
var initGAME = {}; // To store the GAME's 1st Version

var [t0, t1, t2] = [0, 0, 0]; // Time Stamps

const colors = ["#E5E5E5", "#F60000", "#FF8C00", "#FFEE00", "#4DE94C", "#3783FF", "#4815AA"];
const winningAudio = new Audio("Media/victory_theme.mp3");

// Class Player
class player {
   constructor() {
      this.moves = 0;
      this.score = 0;
      this.name = "";
   }
}
var [player1, player2] = [new player(), new player()]; // 2-Players Created from Class Player

// Class Game
class game {
   constructor(board, players) {
      this.played = 0;
      this.players = players;
      this.board = board;
      this.moves = 0;
      this.targetArray = [];
      this.gameArray = [];
   }

   // Function to create Target Array: An Array that represents the Target Board
   createTargetArray() {
      const dim = this.board === 5 ? 3 : 4;
      let targetArray = new Array(dim);
      for (let i = 0; i < targetArray.length; i++) {
         targetArray[i] = new Array(dim);
         for (let j = 0; j < targetArray[i].length; j++) {
            targetArray[i][j] = Math.floor(Math.random() * 6 + 1);
         }
      }
      this.targetArray = targetArray;
   }

   // Function to create Game Array: An Array that represents the Game Board
   createGameArray() {
      // Creation
      let dim = this.board;
      let gameArray = new Array(dim);
      for (let i = 0; i < gameArray.length; i++) {
         gameArray[i] = new Array(dim);
         for (let j = 0; j < gameArray[i].length; j++) {
            if (i >= 1 && i < dim - 1 && j >= 1 && j < dim - 1) {
               gameArray[i][j] = this.targetArray[i - 1][j - 1];
            } else {
               gameArray[i][j] = Math.floor(Math.random() * 6 + 1);
            }
         }
      }

      // Creating Empty tile
      gameArray[0][0] = 0;

      // Shuffling the Array
      for (let i = 0; i < gameArray.length; i++) {
         for (let j = 0; j < gameArray[i].length; j++) {
            var i1 = Math.floor(Math.random() * gameArray.length);
            var j1 = Math.floor(Math.random() * gameArray.length);
            var temp = gameArray[i][j];
            gameArray[i][j] = gameArray[i1][j1];
            gameArray[i1][j1] = temp;
         }
      }
      this.gameArray = gameArray;
   }

   //When a tile is clicked, this Fucntion comes into Play
   moveTile(x, y) {
      var [i, j] = [x, y];
      var selectedTile = document.getElementById(`g-tile-${i},${j}`);
      if (this.gameArray[i + 1] !== undefined && this.gameArray[i + 1][j] === 0) {
         this.switchTile(i, j, 1, 0, selectedTile);
      } else if (this.gameArray[i - 1] !== undefined && this.gameArray[i - 1][j] === 0) {
         this.switchTile(i, j, -1, 0, selectedTile);
      } else if (this.gameArray[i][j + 1] !== undefined && this.gameArray[i][j + 1] === 0) {
         this.switchTile(i, j, 0, 1, selectedTile);
      } else if (this.gameArray[i][j - 1] !== undefined && this.gameArray[i][j - 1] === 0) {
         this.switchTile(i, j, 0, -1, selectedTile);
      }
   }

   //A simple fuction to switch tile
   switchTile(i, j, a, b, selectedTile) {
      document.getElementById(`g-tile-${i + a},${j + b}`).style.backgroundColor = colors[this.gameArray[i][j]];
      document.getElementById(`g-tile-${i + a},${j + b}`).classList.add("on-hover");
      selectedTile.style.backgroundColor = colors[0];
      selectedTile.classList.remove("on-hover");
      this.gameArray[i + a][j + b] = this.gameArray[i][j];
      this.gameArray[i][j] = 0;
      this.moves++;
   }

   // Function to check if the game is over
   isGameFinished() {
      if (this.board === 5) {
         if (
            JSON.stringify(this.gameArray.slice(1, 4)[0].slice(1, 4)) === JSON.stringify(this.targetArray[0]) &&
            JSON.stringify(this.gameArray.slice(1, 4)[1].slice(1, 4)) === JSON.stringify(this.targetArray[1]) &&
            JSON.stringify(this.gameArray.slice(1, 4)[2].slice(1, 4)) === JSON.stringify(this.targetArray[2])
         ) {
            return true;
         }
         return false;
      } else {
         if (
            JSON.stringify(this.gameArray.slice(1, 5)[0].slice(1, 5)) === JSON.stringify(this.targetArray[0]) &&
            JSON.stringify(this.gameArray.slice(1, 5)[1].slice(1, 5)) === JSON.stringify(this.targetArray[1]) &&
            JSON.stringify(this.gameArray.slice(1, 5)[2].slice(1, 5)) === JSON.stringify(this.targetArray[2]) &&
            JSON.stringify(this.gameArray.slice(1, 5)[3].slice(1, 5)) === JSON.stringify(this.targetArray[3])
         ) {
            return true;
         }
         return false;
      }
   }

   // Resets the Game to play Again
   reset(initGAME) {
      this.gameArray = initGAME.gameArray;
      this.targetArray = initGAME.targetArray;
      this.moves = 0;
   }
}

// Function to get names from the user, erases the start menu
function getNames() {
   menuDOM.style.display = "none";
   nameSelectionDOM.style.display = "flex";
   var players = playersSelectDOM.options[playersSelectDOM.selectedIndex].text === "Single Player" ? 1 : 2;

   for (let i = 1; i <= players; i++) {
      var input = document.createElement("input");
      var label = document.createElement("label");
      label.htmlFor = `player-${i}-name`;
      label.innerText = `Enter Player-${i}'s Name:`;
      input.type = "text";
      input.id = `player-${i}-name`;
      input.setAttribute("autocomplete", "off");
      nameSelectionDOM.appendChild(label);
      nameSelectionDOM.appendChild(input);
   }
   var button = document.createElement("button");
   button.onclick = init;
   button.innerText = "Start";
   nameSelectionDOM.appendChild(button);
}

// Enters the users into the Game
const init = () => {
   nameSelectionDOM.style.display = "none";
   players = 1;
   player1.name = document.getElementById("player-1-name").value;
   if (playersSelectDOM.options[playersSelectDOM.selectedIndex].text === "2 Player") {
      players = 2;
      player2.name = document.getElementById("player-2-name").value;
   }
   var board = difficultySelectDOM.options[difficultySelectDOM.selectedIndex].text === "Medium" ? 5 : 6;
   var GAME = new game(board, players);
   t0 = performance.now();

   document.getElementById("game").style.display = "flex";

   GAME.createTargetArray();
   GAME.createGameArray();
   tempGAME = GAME;
   initGAME = JSON.parse(JSON.stringify(GAME));
   setGame(GAME, board);
};

// Function that sets the game
const setGame = (GAME, board) => {
   const add = board === 5 ? 0 : 1;
   while (targetBoardDOM.firstChild) targetBoardDOM.removeChild(targetBoardDOM.firstChild);
   while (gameBoardDOM.firstChild) gameBoardDOM.removeChild(gameBoardDOM.firstChild);
   targetBoardDOM.style.display = "grid";

   if (board === 6) {
      targetBoardDOM.style.width = "225px";
      targetBoardDOM.style.height = "225px";
      targetBoardDOM.style.gridTemplateRows = "50px 50px 50px 50px";
      targetBoardDOM.style.gridTemplateColumns = "50px 50px 50px 50px";
   }
   for (let i = 0; i < GAME.targetArray.length; i++) {
      for (let j = 0; j < GAME.targetArray[i].length; j++) {
         tile = document.createElement("div");
         tile.classList.add("tile");
         tile.id = `t-tile-${i},${j}`;
         tile.style.backgroundColor = colors[GAME.targetArray[i][j]];
         targetBoardDOM.appendChild(tile);
      }
   }

   gameBoardDOM.style.display = "grid";
   if (board === 6) {
      gameBoardDOM.style.width = "335px";
      gameBoardDOM.style.height = "335px";
      gameBoardDOM.style.gridTemplateRows = "50px 50px 50px 50px 50px 50px";
      gameBoardDOM.style.gridTemplateColumns = "50px 50px 50px 50px 50px 50px";
   }

   for (let i = 0; i < GAME.gameArray.length; i++) {
      for (let j = 0; j < GAME.gameArray[i].length; j++) {
         tile = document.createElement("div");
         tile.classList.add("tile");
         if (GAME.gameArray[i][j] !== 0) {
            tile.classList.add("on-hover");
         }
         tile.id = `g-tile-${i},${j}`;
         if (i >= 1 && i <= 3 + add && j >= 1 && j <= 3 + add) {
            tile.classList.add("add-border");
         }
         tile.setAttribute("onclick", `playGame(${i},${j})`);
         tile.style.backgroundColor = colors[GAME.gameArray[i][j]];
         gameBoardDOM.appendChild(tile);
      }
   }
};

// Function to reset the board to play from the begining
function reset() {
   tempGAME.gameArray = JSON.parse(JSON.stringify(initGAME.gameArray));
   tempGAME.moves = 0;
   info.innerText = `Moves: ${tempGAME.moves}`;
   setGame(GAME, GAME.board);
}

// Function that is called eveytime one clicks a time
const playGame = (x, y) => {
   GAME = tempGAME;
   GAME.moveTile(x, y);
   info.innerText = `Moves: ${GAME.moves}`;
   if (GAME.isGameFinished()) {
      if (GAME.players == 2 && GAME.played == 0) {
         t1 = performance.now();
         GAME.played++;
         player1.moves = JSON.parse(JSON.stringify(GAME.moves));
         GAME.reset(initGAME);
         setGame(initGAME, GAME.board);
         info.innerText = `${player1.name} finished with ${player1.moves} Moves`;
      } else if (GAME.players == 1 || GAME.played == 1) {
         t2 = performance.now();
         player1.score = JSON.parse(JSON.stringify(GAME.moves));
         player2.moves = JSON.parse(JSON.stringify(GAME.moves));
         if (GAME.players == 2) {
            player1.score = Math.ceil(1000000000 / ((t1 - t0) * player1.moves));
            player2.score = Math.ceil(1000000000 / ((t2 - t1) * player2.moves));
         } else {
            player1.score = Math.ceil(1000000000 / ((t2 - t0) * GAME.moves));
         }
         showResults();
         restartDOM.style.display = "flex";
         winningAudio.play();
      }
   }
};

const showResults = () => {
   resetButtonDOM.style.display = "none";
   gameBoardDOM.style.display = "none";
   info.style.display = "none";
   targetBoardDOM.style.display = "none";
   heading.style.display = "none";
   if (GAME.players == 1) {
      resultDOM.innerText = `You finised! Score = ${player1.score}`;
   } else {
      if (player2.score > player1.score) {
         resultDOM.innerText = `${player1.name}'s Score: ${player1.score} and ${player2.name}'s Score: ${player2.score}, ${player2.name} Wins`;
      } else if (player1.score === player2.score) {
         resultDOM.innerText = `${player1.name}'s Score: ${player1.score} and ${player2.name}'s Score: ${player2.score}, its a Tie`;
      } else {
         resultDOM.innerText = `${player1.name}'s Score: ${player1.score} and ${player2.name}'s Score: ${player2.score}, ${player1.name} Wins`;
      }
   }
   restartDOM.style.display = "flex";
   viewScoresDOM.style.display = "flex";
   setScores();
};

function setScores() {
   checkHighScore(player1.score, GAME.players, player1);
   if (GAME.players === 2) {
      checkHighScore(player2.score, GAME.players, player2);
   }
}

function checkHighScore(score, players, player) {
   var highScores = [];
   var lowestScore;
   if (!JSON.parse(localStorage.getItem("TWO_PLAYER_HS") === null) && players === 2) {
      highScores = JSON.parse(localStorage.getItem("TWO_PLAYER_HS"));
   } else if (!JSON.parse(localStorage.getItem("ONE_PLAYER_HS") === null) && players === 1) {
      highScores = JSON.parse(localStorage.getItem("ONE_PLAYER_HS"));
   }
   if (highScores == null) {
      lowestScore = 0;
   } else {
      lowestScore = highScores[9] ? highScores[9].score : 0;
   }

   if (score > lowestScore) {
      saveHighScore(player, highScores, players);
   }
}

function saveHighScore(player, highScores, players) {
   newScore = {
      score: player.score,
      name: player.name,
   };
   if (highScores == null) {
      highScores = [newScore];
   } else {
      highScores.push(newScore);
   }

   highScores.sort((a, b) => b.score - a.score);

   highScores.splice(10);

   if (players === 2) {
      localStorage.setItem("TWO_PLAYER_HS", JSON.stringify(highScores));
   } else {
      localStorage.setItem("ONE_PLAYER_HS", JSON.stringify(highScores));
   }
}

function viewHighScores() {
   players = GAME.players;
   viewScoresDOM.style.display = "none";
   resultDOM.style.display = "none";
   highScoresContainerDOM.style.display = "flex";
   if (players === 2) {
      var highScores = JSON.parse(localStorage.getItem("TWO_PLAYER_HS")) ?? [];
   } else {
      var highScores = JSON.parse(localStorage.getItem("ONE_PLAYER_HS")) ?? [];
   }

   highScoresListDOM.innerHTML = highScores.map((score) => `<li>${score.score} - ${score.name}`).join("");
}
