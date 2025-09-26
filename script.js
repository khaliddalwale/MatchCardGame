// Animal image URLs (public domain or free to use)
const animalImages = [
    { name: "Lion", img: "https://cdn.pixabay.com/photo/2017/01/06/19/15/lion-1959955_1280.png", alt: "Lion" },
    { name: "Elephant", img: "https://cdn.pixabay.com/photo/2014/04/03/10/32/elephant-312166_1280.png", alt: "Elephant" },
    { name: "Monkey", img: "https://cdn.pixabay.com/photo/2013/07/12/13/49/monkey-147720_1280.png", alt: "Monkey" },
    { name: "Panda", img: "https://cdn.pixabay.com/photo/2016/03/31/19/58/panda-1295162_1280.png", alt: "Panda" },
    { name: "Tiger", img: "https://cdn.pixabay.com/photo/2014/12/21/23/28/tiger-578447_1280.png", alt: "Tiger" },
    { name: "Zebra", img: "https://cdn.pixabay.com/photo/2017/01/31/19/15/zebra-2020999_1280.png", alt: "Zebra" },
    { name: "Frog", img: "https://cdn.pixabay.com/photo/2012/04/01/17/33/frog-24173_1280.png", alt: "Frog" },
    { name: "Penguin", img: "https://cdn.pixabay.com/photo/2013/07/12/17/00/penguin-149510_1280.png", alt: "Penguin" }
];

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

function createCard(animal, idx) {
    // card structure: button.card > div.card-inner > div.card-front & div.card-back
    const card = document.createElement('button');
    card.classList.add('card');
    card.setAttribute('aria-label', "Hidden animal card");
    card.setAttribute('tabindex', 0);
    card.dataset.animal = animal.name;
    card.dataset.index = idx;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    // Card Front (hidden side)
    const front = document.createElement('div');
    front.classList.add('card-front');
    front.innerHTML = "❓";

    // Card Back (animal)
    const back = document.createElement('div');
    back.classList.add('card-back');
    const img = document.createElement('img');
    img.src = animal.img;
    img.alt = animal.alt;
    img.width = 60;
    img.height = 60;
    back.appendChild(img);

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
    const selectedAnimals = animalImages.slice(0, (gridSize * gridSize) / 2); // 8 pairs
    const cardSet = shuffle([...selectedAnimals, ...selectedAnimals]);
    cardSet.forEach((animal, idx) => {
        board.appendChild(createCard(animal, idx));
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
    if (firstCard.dataset.animal === secondCard.dataset.animal) {
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
