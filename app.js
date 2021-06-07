var targetBoard = document.getElementById("target-board");
var gameBoard = document.getElementById("game-board");
var result = document.getElementById("result");
var info = document.getElementById("info");
var restart = document.getElementById("restart");
var menu = document.getElementById("menu");
var heading = document.getElementById("heading");
var playersSelect = document.getElementById("players-select");
var difficultySelect = document.getElementById("difficulty-select");
var nameSelection = document.getElementById("name-selection");
var resetButton = document.getElementById("reset");
var highScoresContainer = document.getElementById("high-scores-container");
var highScoresList = document.getElementById("high-scores");
var viewScoresDOM = document.getElementById("view-scores");
var tile;
var tempGAME = {};
var initGAME = {};
var [t0, t1, t2] = [0, 0, 0];
const colors = ["#E5E5E5", "#F60000", "#FF8C00", "#FFEE00", "#4DE94C", "#3783FF", "#4815AA"];
const winningAudio = new Audio("C:/Users/suhai/Documents/DEV/Colour Tiles/Media/victory_theme.mp3");

class player {
   constructor() {
      this.moves = 0;
      this.score = 0;
      this.name = "";
   }
}
var [player1, player2] = [new player(), new player()];

class game {
   constructor(board, players) {
      this.played = 0;
      this.players = players;
      this.board = board;
      this.moves = 0;
      this.targetArray = [];
      this.gameArray = [];
   }

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

   createGameArray() {
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
      gameArray[0][0] = 0;
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

   switchTile(i, j, a, b, selectedTile) {
      document.getElementById(`g-tile-${i + a},${j + b}`).style.backgroundColor = colors[this.gameArray[i][j]];
      document.getElementById(`g-tile-${i + a},${j + b}`).classList.add("on-hover");
      selectedTile.style.backgroundColor = colors[0];
      selectedTile.classList.remove("on-hover");
      this.gameArray[i + a][j + b] = this.gameArray[i][j];
      this.gameArray[i][j] = 0;
      this.moves++;
   }

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
            JSON.stringify(this.gameArray.slice(1, 5)[2].slice(1, 5)) === JSON.stringify(this.targetArray[3])
         ) {
            return true;
         }
         return false;
      }
   }

   reset(initGAME) {
      this.gameArray = initGAME.gameArray;
      this.targetArray = initGAME.targetArray;
      this.moves = 0;
   }
}

function getNames() {
   menu.style.display = "none";
   nameSelection.style.display = "flex";
   var players = playersSelect.options[playersSelect.selectedIndex].text === "Single Player" ? 1 : 2;

   for (let i = 1; i <= players; i++) {
      var input = document.createElement("input");
      var label = document.createElement("label");
      label.htmlFor = `player-${i}-name`;
      label.innerText = `Enter Player-${i}'s Name:`;
      input.type = "text";
      input.id = `player-${i}-name`;
      input.setAttribute("autocomplete", "off");
      nameSelection.appendChild(label);
      nameSelection.appendChild(input);
   }
   var button = document.createElement("button");
   button.onclick = init;
   button.innerText = "Start";
   nameSelection.appendChild(button);
}

const init = () => {
   nameSelection.style.display = "none";
   players = 1;
   player1.name = document.getElementById("player-1-name").value;
   if (playersSelect.options[playersSelect.selectedIndex].text === "2 Player") {
      players = 2;
      player2.name = document.getElementById("player-2-name").value;
   }
   var board = difficultySelect.options[difficultySelect.selectedIndex].text === "Medium" ? 5 : 6;
   var GAME = new game(board, players);
   t0 = performance.now();

   document.getElementById("game").style.display = "flex";

   GAME.createTargetArray();
   GAME.createGameArray();
   tempGAME = GAME;
   initGAME = JSON.parse(JSON.stringify(GAME));
   setGame(GAME, board);
};

const setGame = (GAME, board) => {
   const add = board === 5 ? 0 : 1;
   while (targetBoard.firstChild) targetBoard.removeChild(targetBoard.firstChild);
   while (gameBoard.firstChild) gameBoard.removeChild(gameBoard.firstChild);
   targetBoard.style.display = "grid";

   if (board === 6) {
      targetBoard.style.width = "225px";
      targetBoard.style.height = "225px";
      targetBoard.style.gridTemplateRows = "50px 50px 50px 50px";
      targetBoard.style.gridTemplateColumns = "50px 50px 50px 50px";
   }
   for (let i = 0; i < GAME.targetArray.length; i++) {
      for (let j = 0; j < GAME.targetArray[i].length; j++) {
         tile = document.createElement("div");
         tile.classList.add("tile");
         tile.id = `t-tile-${i},${j}`;
         tile.style.backgroundColor = colors[GAME.targetArray[i][j]];
         targetBoard.appendChild(tile);
      }
   }

   gameBoard.style.display = "grid";
   if (board === 6) {
      gameBoard.style.width = "335px";
      gameBoard.style.height = "335px";
      gameBoard.style.gridTemplateRows = "50px 50px 50px 50px 50px 50px";
      gameBoard.style.gridTemplateColumns = "50px 50px 50px 50px 50px 50px";
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
         gameBoard.appendChild(tile);
      }
   }
};

const showResults = () => {
   resetButton.style.display = "none";
   gameBoard.style.display = "none";
   info.style.display = "none";
   targetBoard.style.display = "none";
   heading.style.display = "none";
   if (GAME.players == 1) {
      result.innerText = `You finised! Score = ${player1.score}`;
   } else {
      if (player2.score > player1.score) {
         result.innerText = `${player1.name}'s Score: ${player1.score} and ${player2.name}'s Score: ${player2.score}, ${player2.name} Wins`;
      } else if (player1.score === player2.score) {
         result.innerText = `${player1.name}'s Score: ${player1.score} and ${player2.name}'s Score: ${player2.score}, its a Tie`;
      } else {
         result.innerText = `${player1.name}'s Score: ${player1.score} and ${player2.name}'s Score: ${player2.score}, ${player1.name} Wins`;
      }
   }
   restart.style.display = "flex";
   viewScoresDOM.style.display = "flex";
   setScores();
};

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
         restart.style.display = "flex";
         winningAudio.play();
      }
   }
};

function reset() {
   tempGAME.gameArray = JSON.parse(JSON.stringify(initGAME.gameArray));
   tempGAME.moves = 0;
   info.innerText = `Moves: ${tempGAME.moves}`;
   setGame(GAME, GAME.board);
}

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

function viewHighScores(players) {
   viewScoresDOM.style.display = "none";
   result.style.display = "none";
   highScoresContainer.style.display = "flex";
   if (players === 2) {
      var highScores = JSON.parse(localStorage.getItem("TWO_PLAYER_HS")) ?? [];
   } else {
      var highScores = JSON.parse(localStorage.getItem("ONE_PLAYER_HS")) ?? [];
   }

   highScoresList.innerHTML = highScores.map((score) => `<li>${score.score} - ${score.name}`).join("");
}
