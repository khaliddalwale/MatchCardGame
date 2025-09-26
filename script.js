// Numbers 1-8 for 8 pairs (4x4 grid)
const numbers = [1,2,3,4,5,6,7,8];

// Game state variables
let firstCard = null, secondCard = null, lockBoard = false, matchedPairs = 0;
const gridSize = 4; // 4x4 grid (8 pairs)
const board = document.getElementById('game-board');
const matchSound = document.getElementById('match-sound');
const noMatchSound = document.getElementById('nomatch-sound');
const winSound = document.getElementById('win-sound');
const winMessage = document.getElementById('win-message');
const restartBtn = document.getElementById('restart-btn');

function shuffle(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(number, idx) {
    // card structure: button.card > div.card-inner > div.card-front & div.card-back
    const card = document.createElement('button');
    card.classList.add('card');
    card.setAttribute('aria-label', "Hidden number card");
    card.setAttribute('tabindex', 0);
    card.dataset.number = number;
    card.dataset.index = idx;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    // Card Front (hidden side)
    const front = document.createElement('div');
    front.classList.add('card-front');
    front.innerHTML = "❓";

    // Card Back (number)
    const back = document.createElement('div');
    back.classList.add('card-back');
    back.textContent = number;

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);

    card.addEventListener('click', () => flipCard(card));
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            card.click();
        }
    });

    return card;
}

function setupBoard() {
    // Reset
    board.innerHTML = "";
    matchedPairs = 0;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    winMessage.classList.add('hidden');

    // Duplicate and shuffle
    const selectedNumbers = numbers.slice(0, (gridSize * gridSize) / 2); // 8 pairs
    const cardSet = shuffle([...selectedNumbers, ...selectedNumbers]);
    cardSet.forEach((number, idx) => {
        board.appendChild(createCard(number, idx));
    });
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped') || card === firstCard) return;

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;
    lockBoard = true;

    // Check for match
    if (firstCard.dataset.number === secondCard.dataset.number) {
        setTimeout(() => {
            matchSound.currentTime = 0;
            matchSound.play();
            matchedPairs++;
            firstCard = null;
            secondCard = null;
            lockBoard = false;
            if (matchedPairs === (gridSize * gridSize) / 2) {
                winGame();
            }
        }, 600);
    } else {
        setTimeout(() => {
            noMatchSound.currentTime = 0;
            noMatchSound.play();
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        }, 1100);
    }
}

function winGame() {
    winSound.currentTime = 0;
    winSound.play();
    winMessage.classList.remove('hidden');
}

restartBtn.addEventListener('click', setupBoard);

// Responsive grid
function adjustGrid() {
    if (window.innerWidth < 600) {
        board.style.gridTemplateColumns = 'repeat(4, 60px)';
    } else {
        board.style.gridTemplateColumns = 'repeat(4, 90px)';
    }
}
window.addEventListener('resize', adjustGrid);

// Start game
setupBoard();
adjustGrid();
