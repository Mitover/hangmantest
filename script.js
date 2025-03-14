let listWords = [];
let selectedWord = "";
let guessedWord = [];
let attemptsLeft = 7;
let isWin = false
const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
let wordsJson = {};
let choiceWord = "";
let hint2 = "";


let divElements = document.querySelectorAll('.container');
let divContainer = document.querySelector(".container")

let divThemes = document.querySelectorAll('.themes');
let divTheme = document.querySelector(".themes")

let buttonRestart = document.getElementById("restart-button")
buttonRestart.style.display = "none";


HideContainter();

// Элементы DOM
const wordDisplay = document.getElementById("word-display");
const prompt_P = document.getElementById("prompt")
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const hangmanImage = document.getElementById("hangman-image");

function HideContainter() {
    divElements.forEach(e => e.style.display = 'none');
}

function ShowContainter() {
    divElements.forEach(e => e.style.display = 'block');
}

function HideThemes() {
    divThemes.forEach(e => e.style.display = 'none');
}

function ShowThemes() {
    divThemes.forEach(e => e.style.display = 'block');
}


fetch('words.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Ой, ошибка в fetch: ' + response.statusText);
    }
    return response.json();
  })
  .then(jsonData => {
    wordsJson = jsonData;
    CreateButtonsTheme();
    initGame();
  })
//   .catch(error => console.error('Ошибка при исполнении запроса: ', error));


// console.log(key + " " +  wordsJson[key]);
// Инициализация игры
function initGame() {

    HideContainter();
    ShowThemes();
   
    message.textContent = "";
    attemptsLeft = 7;
    guessedWord = []
    selectedWord = "";
}

// Обновление отображения слова
function updateWordDisplay() {
    wordDisplay.textContent = guessedWord.join(" ");
    console.log(guessedWord.join("  "));
}

// guessedWord = Array(selectedWord.length).fill("_");
function choiceTheme(theme){
    
    listWords = Object.keys(wordsJson[theme]) ;
    selectedWord =  listWords[Math.floor(Math.random() * listWords.length)].toLowerCase();

    for (let i = 0; i < selectedWord.length; i++) 
    {
        if (!(selectedWord[i] == ' ' ||  selectedWord[i] == '-'))
            guessedWord.push("_")
        else
            guessedWord.push(selectedWord[i]);
    }
    console.log(listWords);
    console.log(selectedWord);
    console.log(guessedWord);
    
    prompt_P.textContent = wordsJson[theme][capitalizeFirstLetter(selectedWord)]["hint1"];
    hint2 = wordsJson[theme][capitalizeFirstLetter(selectedWord)]["hint2"];

    
    // console.log(wordsJson[theme]);
    // console.log(wordsJson[theme][capitalizeFirstLetter(selectedWord)]);
    // console.log(wordsJson[theme][capitalizeFirstLetter(selectedWord)]["hint1"]);

    HideThemes();
    createKeyboard();
    ShowContainter();
    updateWordDisplay();
    updateHangmanImage();
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// Создание клавиатуры
function createKeyboard() {
    keyboard.innerHTML = "";
    for (let letter of alphabet) {
        const button = document.createElement("button");
        button.textContent = letter;
        button.classList.add("key");
        button.addEventListener("click", () => handleGuess(letter));
        keyboard.appendChild(button);
    }
}


// Обработка угадывания буквы
function handleGuess(letter) {
    if (attemptsLeft === 0 || guessedWord.join("") === selectedWord ) return;

    if (selectedWord.includes(letter)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter) {
                guessedWord[i] = letter;
            }
        }
    } else {
        attemptsLeft--;
        if (attemptsLeft == 2)
            prompt_P.textContent = hint2;
    }

    // Обновляем состояние кнопок
    const buttons = document.querySelectorAll('.key');
    buttons.forEach(button => {
        if (button.textContent === letter) {
            if (selectedWord.includes(letter)) {
                button.classList.add("correct");
            } else {
                button.classList.add("incorrect");
            }
        }
    });

    updateWordDisplay();
    updateHangmanImage();
    checkGameStatus();
}

// Обновление картинки виселицы
function updateHangmanImage() {
    hangmanImage.innerHTML = `<img src="images/hangman-${7 - attemptsLeft}.svg" alt="Виселица">`;
}

// Проверка статуса игры
function checkGameStatus() {
    if (guessedWord.join("") === selectedWord) {
        message.textContent = "Поздравляем! Вы выиграли!";
        buttonRestart.style.display = "inline-block";

        SendDataToTelegram();
        // Telegram.WebApp.ready();
        // Telegram.WebApp.sendData('Привет из веб-приложения!');

    } else if (attemptsLeft === 0) {
        message.textContent = `Игра окончена. Загаданное слово: ${selectedWord}`;
        buttonRestart.style.display = "inline-block";
        SendDataToTelegram();
        
    }
}

// Перезапуск игры
function restartGame() {
    initGame();
}

function CreateButtonsTheme(){
    Object.keys(wordsJson).forEach((key) => {
        //console.log(key + " " +  wordsJson.);
        const button = document.createElement("button");
        button.textContent = key
        button.classList.add("theme");
        button.addEventListener("click", () => choiceTheme(key));
        divTheme.appendChild(button);
      });
}
//Запуск игры при загрузке страницы

//document.addEventListener("DOMContentLoaded", initGame);

// Telegram.WebApp.ready();
// Telegram.WebApp.MainButton.setText('слово').show().onClick(function () {
    
// });

function SendDataToTelegram(){
    Telegram.WebApp.ready();
    const data = JSON.stringify({"word": selectedWord, "isWin":isWin, "attempt": attempt});
    Telegram.WebApp.sendData(data);
    Telegram.WebApp.close();
}