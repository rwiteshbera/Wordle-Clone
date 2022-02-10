const guessGrid = document.getElementsByClassName("guess-grid");
const keyboard = document.getElementsByClassName("keyboard");
const offsetFromDate = new Date(2022, 0, 1);
const msOffset = Date.now() - offsetFromDate;
const dayOffset = msOffset / 1000 / 60 / 60 / 24;
const targetWord = targetWords[Math.floor(dayOffset)];

const startInteraction = () => {
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
};
const stoptInteraction = () => {
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);
};

const handleMouseClick = (e) => {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess();
    return;
  }

  if (e.target.matches("[data-delete]")) {
    pressDelete();
    return;
  }
};

const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    submitGuess();
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    pressDelete();
    return;
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key.toLowerCase());
    return;
  }
};

var x = 0;
const pressKey = (key) => {
  const activeCells = getActiveCells();
  if (activeCells.length >= 5) return;

  if (guessGrid[0].children[x].innerText == "") {
    guessGrid[0].children[x].innerText = key.toUpperCase();
    guessGrid[0].children[x].dataset.letter = key;
    guessGrid[0].children[x].dataset.state = "active";
  } else if (x + 1 < guessGrid[0].children.length) {
    guessGrid[0].children[++x].innerText = key.toUpperCase();
    guessGrid[0].children[x].dataset.letter = key;
    guessGrid[0].children[x].dataset.state = "active";
  }
};

const pressDelete = () => {
  if (x > 0) {
    delete guessGrid[0].children[x].dataset.state;
    guessGrid[0].children[x--].innerText = "";
  } else if (x === 0) {
    guessGrid[0].children[x].innerText = "";
    delete guessGrid[0].children[x].dataset.state;
  }
};

const submitGuess = () => {
  const activeCells = getActiveCells();
  if (activeCells.length < 5) {
    showAlert("Not enough letters!");
    shakeTiles(activeCells);
  }

  const guess = activeCells
    .map((cell) => cell.innerText)
    .join("")
    .toLowerCase();

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list!");
    shakeTiles(activeCells);
    return;
  }
  stoptInteraction();
  activeCells.forEach((cell) => {
    flipTile(cell, guess, activeCells);
  });
};

const getActiveCells = () => {
  const activeCells = [];
  for (let i = 0; i < guessGrid[0].children.length; i++) {
    if (guessGrid[0].children[i].dataset.state === "active") {
      activeCells.push(guessGrid[0].children[i]);
    }
  }
  return activeCells;
};

const showAlert = (message, duration = 1000) => {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  document.getElementById("alert-container").appendChild(alert);

  if (duration == null) return;

  setTimeout(() => {
    alert.classList.add("hide");
    alert.remove();
  }, duration);
};

const shakeTiles = (tiles) => {
  tiles.forEach(
    (tile) => {
      tile.classList.add("shake");
      tile.addEventListener("animationend", () => {
        tile.classList.remove("shake");
      });
    },
    { once: true }
  );
};

var timeAnimation = 1;
var idx = 0;
const flipTile = (tile, guess, tiles) => {
  const letter = tile.dataset.letter;
  setTimeout(() => {
    tile.classList.add("flip");
  }, timeAnimation++ * 200);
  tile.addEventListener(
    "transitionstart",
    () => {
      if (targetWord[idx % 5] === letter) {
        tile.dataset.state = "correct";
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "incorrect";
      } else {
        tile.dataset.state = "wrong";
      }
      idx++;

      if (
        idx === 5 ||
        idx === 10 ||
        idx === 15 ||
        idx === 20 ||
        idx == 25 ||
        idx == 30
      ) {
        if (idx == 30) {
          stoptInteraction();
        }
        setTimeout(() => {
          checkWinLose(guess, targetWord, tiles);
        }, 1000);
        startInteraction();
      }
    },
    timeAnimation++ * 200
  );
};


var dur = 1;
const  danceTiles = (tiles) => {
  tiles.forEach((tile, duration) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (2 * dur) + 1000)
  })
}



const checkWinLose = (guess, targetWord, tiles) => {
  if (guess.toLowerCase() === targetWord.toLowerCase()) {
    danceTiles(tiles);
    setTimeout(() => {
      showAlert("You win!");
    }, 2000);
    stoptInteraction();
  }
};

startInteraction();
