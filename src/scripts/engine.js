const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

const types = ["Paper", "Rock", "Scissors"];

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: types[0],
        img: `${pathImages}dragon.png`,
        WinOf: types[1],
        LoseOf: types[2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: types[1],
        img: `${pathImages}magician.png`,
        WinOf: types[2],
        LoseOf: types[0],
    },
    {
        id: 2,
        name: "Exodia",
        type: types[2],
        img: `${pathImages}exodia.png`,
        WinOf: types[0],
        LoseOf: types[1],
    },
    {
        id: 3,
        name: "Gaia The Fierce Knight",
        type: types[0],
        img: `${pathImages}gaia.png`,
        WinOf: types[1],
        LoseOf: types[2],
    },
    {
        id: 4,
        name: "Flame Swordsman",
        type: types[1],
        img: `${pathImages}flame.png`,
        WinOf: types[2],
        LoseOf: types[0],
    },
    {
        id: 5,
        name: "Summoned Skull",
        type: types[2],
        img: `${pathImages}skull.png`,
        WinOf: types[0],
        LoseOf: types[1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id
}

async function createCardImage(randomIdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(randomIdCard);
        });

        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true)

    await hiddenCardDetails();

    await drawCardsInFields(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInFields(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
    if (value == true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value == false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    const playerCard = cardData[playerCardId];
    const computerCard = cardData[computerCardId];

    let duelResults = "draw";

    if (playerCard.WinOf.includes(computerCard.type)){
        duelResults = "win";
        state.score.playerScore++;
    }else if (playerCard.LoseOf.includes(computerCard.type)) {
        duelResults = "lose";
        state.score.computerScore++;
    }else {
        duelResults = "draw";
    }

    await playAudio(duelResults)

    return duelResults;
}

async function removeAllCardImages() {
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try {
        audio.play();
    } catch {
        
    }
}


function init() {
    showHiddenCardFieldsImages(false)

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();