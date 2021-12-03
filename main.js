const GAME_FIELD = document.getElementById("field");
const TIME_FIELD = document.getElementById("curTime");
const LEVEL_FIELD = document.getElementById("curLevel");
const GF_WIDTH = GAME_FIELD.clientWidth;
const GF_HEIGHT = GAME_FIELD.clientHeight;
const GF_GAP = 2;
const GAME_TIME = 10;

let gameState = {}; //состояние игры
let isGameStarted = false;
let time;
let isUnitSquareClick = false;

//Начальное состояние игры
const INITIAL_STATE = {
    level: 1,
    opacity: 50 //непрозрачность (для "особенного" квадратика)
}

//выгрузка из LocalStorage
let loadFromLocalStorage = function () {
    gameState = JSON.parse(localStorage.getItem("gameState")) || {...INITIAL_STATE};
}

//сохранить в LocalStorage
let saveToLocalStorage = function () {
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

let initGameTimer = function () {
    TIME_FIELD.innerHTML = getTimerString(GAME_TIME);
}

let initLevel = function () {
    LEVEL_FIELD.innerHTML = gameState.level;
}


let getRandomColor = function () {
    //https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
    return '#' + Math.floor(Math.random()* (256 * 256 * 256)).toString(16).padStart(6, '0');
}

//Представление в строковом формате 
let getTimerString = function (time) {
    let minutes = String(Math.floor(time / 60));
    let seconds = String(time % 60);
    return `${minutes}:${seconds.length === 1 ? '0'+seconds : seconds}`;
}

//Очистить поле 
let clearGameField = function () {
    while (GAME_FIELD.firstChild) {
        GAME_FIELD.firstChild.remove();
    }
}

let squareArea = function (squareCount) {
    let gameFieldArea = (GF_HEIGHT - (GF_GAP * Math.sqrt(squareCount) - 1)) ** 2;
    return gameFieldArea / squareCount;
}

let renderGameField = function () {
    clearGameField();
    let squareCount = (gameState.level + 1) ** 2;
    let oneSquareSize = Math.sqrt(squareArea(squareCount));

    let squareBackground = getRandomColor();

    let goalSquare = Math.floor(Math.random() * squareCount + 1);

    for (let i = 0; i < squareCount; i++) {
        let square = document.createElement("div");
        square.style.width = `${oneSquareSize}px`;
        square.style.height = `${oneSquareSize}px`;
        square.style.background = squareBackground;
        if (goalSquare === i + 1 && isGameStarted) {
            square.id = 'goal';
            square.style.opacity = `${gameState.opacity}%`;
            square.addEventListener("click", onGoalSquareClick);
        }
        else {
            square.id = 'unit';
            square.addEventListener("click", onUnitSquareClick);
        }
        GAME_FIELD.appendChild(square);
    }
}

let onUnitSquareClick = function() {
    isUnitSquareClick = true;
    time = 0;
    saveToLocalStorage();
    TIME_FIELD.innerHTML = getTimerString(time);
    isGameStarted = false;
}

let onGoalSquareClick = function () {
    gameState.level++;
    initLevel();
    if (gameState.opacity < 80) {
        gameState.opacity += 3;
    }
    saveToLocalStorage();
    renderGameField();
}

let start = function(){
    gameState = {...INITIAL_STATE};
    initLevel();
    isGameStarted = true;
    isUnitSquareClick = false;
    renderGameField();
    initGameTimer();
    time = GAME_TIME;
    let id = setInterval(()=>{
        if (time > 0) {
            time--;
            TIME_FIELD.innerHTML = getTimerString(time);
        } else {
            document.getElementById("goal")?.removeEventListener("click", onGoalSquareClick);
            isGameStarted = false;
            if (isUnitSquareClick)
                window.alert("Вы проиграли");
            else
                window.alert("Время вышло");
            clearInterval(id);
        }

    }, 1000);
}

window.onload = function () {
    loadFromLocalStorage();
    initLevel();
    initGameTimer();
    renderGameField();
}
