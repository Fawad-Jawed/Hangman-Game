// 🌟 Start Screen Logic
document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.querySelector(".start-screen");
  const startBtn = document.querySelector(".start-btn");
  const container = document.querySelector(".container");
  const clickSound = new Audio("Assets/clickSound.mp3");

  container.style.display = "none";

  startBtn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
    startScreen.style.opacity = "0";
    setTimeout(() => {
      startScreen.style.display = "none";
      container.style.display = "flex";
    }, 500);
  });
});

// 🎮 Hangman Game Logic
document.addEventListener("DOMContentLoaded", () => {
  const keyboard = document.querySelector(".keyboard");
  const wordDisplay = document.querySelector(".word-display");
  const guessesText = document.querySelector(".guesses-text b");
  const hangmanImage = document.querySelector(".hangman-box img");
  const gameModal = document.querySelector(".game-modal");
  const playAgainBtn = document.querySelector(".play-again");
  const hintText = document.querySelector(".hint-text b");
  const clickSound = new Audio("Assets/clickSound.mp3");

  let currentWord, correctLetters, wrongGuessCount;
  const maxWrongGuess = 6;

  const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `Assets/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxWrongGuess}`;

    keyboard
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));

    wordDisplay.innerHTML = currentWord
      .split("")
      .map(() => `<li class="letter"></li>`)
      .join("");

    gameModal.classList.remove("show");
  };

  const RandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const { word, hint } = wordList[randomIndex];
    currentWord = word.toLowerCase();
    hintText.innerText = hint;
    resetGame();
  };

  const gameOver = (isWin) => {
    setTimeout(() => {
      const msg = isWin ? "You found the word:" : "The correct word was:";
      gameModal.querySelector("img").src = `Assets/${
        isWin ? "victory" : "lost"
      }.gif`;
      gameModal.querySelector("h4").innerText = isWin
        ? "Congratulations!"
        : "You Lost!!";
      gameModal.querySelector("p").innerHTML = `${msg} <b>${currentWord}</b>`;
      gameModal.classList.add("show");
    }, 300);
  };

  const initGame = (button, letter) => {
    clickSound.currentTime = 0;
    clickSound.play();

    if (currentWord.includes(letter)) {
      [...currentWord].forEach((ch, i) => {
        if (ch === letter) {
          correctLetters.push(letter);
          const li = wordDisplay.querySelectorAll("li")[i];
          li.innerText = ch;
          li.classList.add("guessed");
        }
      });
    } else {
      wrongGuessCount++;
      hangmanImage.src = `Assets/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxWrongGuess}`;

    if (wrongGuessCount === maxWrongGuess) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
  };

  for (let i = 97; i <= 122; i++) {
    const btn = document.createElement("button");
    const letter = String.fromCharCode(i);
    btn.innerText = letter;
    btn.addEventListener("click", (e) => initGame(e.target, letter));
    keyboard.appendChild(btn);
  }

  RandomWord();

  // 🔊 Play sound when Play Again is clicked
  playAgainBtn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
    RandomWord();
  });

  // 🧠 Keyboard support
  document.addEventListener("keydown", (e) => {
    const letter = e.key.toLowerCase();
    if (letter < "a" || letter > "z") return;

    const btn = [...keyboard.querySelectorAll("button")].find(
      (b) => b.innerText.toLowerCase() === letter
    );

    if (!btn || btn.disabled) return;
    btn.click();
  });
});
