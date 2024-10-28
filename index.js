document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const resetButton = document.getElementById('reset');
    const heartsContainer = document.getElementById('hearts');
    const mistakeSound = document.getElementById('mistakeSound');
    const gameOverSound = document.getElementById('gameOverSound');
    const failedScreen = document.getElementById('failedScreen'); // Failed screen div
    const playAgainButton = document.getElementById('playAgain'); // Play Again button

    let firstCard = null;
    let secondCard = null;
    let score = 0;
    let matches = 0;
    let mistakes = 0;
    let isFlipping = false;
    let startTime;
    let timerInterval;
    let firstCardTimeout;

    const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    function startGame() {
        resetGame();
        initializeBoard();
        startTimer();
    }

    function resetGame() {
        clearInterval(timerInterval);
        clearTimeout(firstCardTimeout); 
        gameBoard.innerHTML = ''; 
        score = 0;
        matches = 0;
        mistakes = 0;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = '00:00';
        firstCard = null;
        secondCard = null;
        isFlipping = false;
        updateHearts();
        failedScreen.classList.remove("show"); // Hide failed screen
    }

    function initializeBoard() {
        const shuffledValues = shuffle([...cardValues, ...cardValues]);

        shuffledValues.forEach(value => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = value;
            card.innerHTML = `<span class="card-value">${value}</span>`;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function flipCard() {
        if (isFlipping || this === firstCard || this.classList.contains('matched')) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;

            firstCardTimeout = setTimeout(() => {
                unflipFirstCard();
            }, 1500); 
        } else {
            clearTimeout(firstCardTimeout); 
            secondCard = this;
            checkMatch();
        }
    }

    function unflipFirstCard() {
        if (firstCard) {
            firstCard.classList.remove('flipped');
            resetFlip();
        }
    }

    function checkMatch() {
        isFlipping = true;
        const match = firstCard.dataset.value === secondCard.dataset.value;

        if (match) {
            disableCards();
            score += 10;
            matches++;

            if (matches === cardValues.length) {
                stopTimer();
                alert(`Congratulations! Your final score is ${score}`);
            }
        } else {
            mistakes++;
            updateHearts();
            mistakeSound.play();

            if (mistakes >= 3) {
                gameOver();
            } else {
                unflipCards();
            }
        }

        scoreDisplay.textContent = score;
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetFlip();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetFlip();
        }, 1000);
    }

    function resetFlip() {
        firstCard = null;
        secondCard = null;
        isFlipping = false;
    }

    function updateHearts() {
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            if (index < mistakes) {
                heart.classList.remove('red-heart');
                heart.classList.add('grey-heart');
            } else {
                heart.classList.remove('grey-heart');
                heart.classList.add('red-heart');
            }
        });
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsedTime = Date.now() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;
    }

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function gameOver() {
        gameOverSound.play();
        stopTimer();
        failedScreen.classList.add("show"); // Show failed screen
    }

    playAgainButton.addEventListener("click", () => {
        failedScreen.classList.remove("show"); // Hide failed screen
        startGame(); // Restart game
    });

    resetButton.addEventListener('click', startGame);

    function createHearts() {
        heartsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('span');
            heart.classList.add('heart', 'red-heart');
            heartsContainer.appendChild(heart);
        }
    }

    createHearts();
    startGame();
});
