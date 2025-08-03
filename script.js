const game = (function () {
  let board = [];
  //start with x
  let is_player_x_turn = true;
  let is_player_x_starter = false;
  let winLine = "";
  let turnCount = 0;
  let winner = "";
  function initGame() {
    board = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    winner = undefined;
    turnCount = 0;
    is_player_x_starter = !is_player_x_starter;
    is_player_x_turn = is_player_x_starter;
    winLine = [];
  }

  function showBoard() {
    return board;
  }

  function playTurn(spot) {
    if (winner) {
      console.log("Game is Over");
      return;
    }
    if (spot != parseInt(spot)) {
      console.log("Invalid Input Choose Number From 1 to 9!");
      return;
    }
    spot--;
    if (!(spot <= 8 && spot >= 0)) {
      console.log("Invalid Input Choose Number From 1 to 9");
    } else if (typeof board[parseInt(spot / 3)][spot % 3] == "string") {
      console.log("Spot Is Taken");
    } else {
      if (is_player_x_turn) {
        board[parseInt(spot / 3)][spot % 3] = "x";
      } else {
        board[parseInt(spot / 3)][spot % 3] = "o";
      }
      is_player_x_turn = !is_player_x_turn;
      turnCount++;
      winner = checkBoard();
      if (winner) {
        clearUnused();
        if (winner == "draw") {
          console.log("Draw");
        } else {
          console.log("Player " + winner + " Has Won The Game");
        }
      }
    }
  }

  function getTurn() {
    if (is_player_x_turn) {
      return "x";
    } else {
      return "o";
    }
  }

  function checkBoard() {
    for (let i = 0; i < 3; i++) {
      // Rows Check
      if (board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
        for (let j = 0; j < 3; j++) {
          winLine.push(i * 3 + j);
        }
        return board[i][0];
      } // Columns Check
      else if (board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
        for (let j = 0; j < 3; j++) {
          winLine.push(j * 3 + i);
        }
        return board[0][i];
      }
    }
    // Diagonals Check
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
      winLine = [0, 4, 8];
      return board[1][1];
    }
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
      winLine = "diag " + 2;
      winLine = [2, 4, 6];

      return board[1][1];
    }
    if (turnCount == 9) {
      // Draw Check
      return "draw";
    }
  }

  function getSpot(spot) {
    return board[parseInt(spot / 3)][spot % 3];
  }

  function getWinner() {
    return winner;
  }
  function clearUnused() {
    for (let i = 0; i < 9; i++) {
      if (!(typeof board[parseInt(i / 3)][i % 3] == "string")) {
        board[parseInt(i / 3)][i % 3] = "";
      }
    }
  }
  function getWinLine() {
    return winLine;
  }
  initGame();

  return {
    initGame,
    showBoard,
    playTurn,
    getTurn,
    getSpot,
    getWinner,
    getWinLine,
  };
})();

const gameRenderer = (function () {
  const spots = document.querySelectorAll(".spot");
  const stateElement = document.getElementById("CurrentPlayer");
  const currentPlayerNameElement = document.querySelector(
    "#CurrentPlayer > span"
  );
  const winnerElement = document.getElementById("winner");
  const historyLog = document.getElementById("historyLog");
  const newRoundButton = document.getElementById("newRound");
  let isThereWinner = false;
  let winnerName = game.getWinner();
  let currentPlayerName = game.getTurn();

  function initGame() {
    updateDisplay();
    for (let i = 0; i < 9; i++) {
      spots[i].addEventListener("click", () => {
        game.playTurn(i + 1);
        updateDisplay();
      });
    }

    newRoundButton.addEventListener("click", resetGame);
  }

  function updateDisplay() {
    //update board
    for (let i = 0; i < 9; i++) {
      spots[i].textContent = game.getSpot(i);
    }
    //update status
    winnerName = game.getWinner();
    currentPlayerName = game.getTurn();
    const winLine = game.getWinLine();
    currentPlayerNameElement.textContent = currentPlayerName;
    if (winnerName) {
      stateElement.style.visibility = "hidden";
      winnerElement.style.visibility = "visible";
      if (!isThereWinner) {
        CurrentWinnerElement = document.createElement("li");
        if (winnerName == "draw") {
          CurrentWinnerElement.textContent = "Draw";
        } else {
          CurrentWinnerElement.textContent = winnerName + ", Won!";
        }
        historyLog.appendChild(CurrentWinnerElement);
      }

      isThereWinner = true;
      if (winnerName == "draw") {
        winnerElement.textContent = "Draw";
      } else {
        winnerElement.textContent = winnerName + " Has Won The Game!!";
        for (const spot of winLine) {
          spots[spot].style["background-color"] = "red";
        }
      }
    } else {
      winnerElement.style.visibility = "hidden";
      stateElement.style.visibility = "visible";
    }
  }
  function resetGame() {
    isThereWinner = false;
    winnerName = game.getWinner();
    currentPlayerName = game.getTurn();
    game.initGame();
    updateDisplay();
    for (let i = 0; i < 9; i++) {
      spots[i].style["background-color"] = "var(--spotColor)";
    }
  }
  initGame();
  return {};
})();
