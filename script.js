const words = ["программирование", "виселица", "алгоритм", "компьютер", "интернет", "клавиатура"];
let selectedWord = "";
let guessedWord = [];
let attemptsLeft = 7;
const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

// Элементы DOM
const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const hangmanImage = document.getElementById("hangman-image");

// Инициализация игры
function initGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedWord = Array(selectedWord.length).fill("_");
    attemptsLeft = 7;
    updateWordDisplay();
    createKeyboard();
    updateHangmanImage();
    message.textContent = "";
}

// Обновление отображения слова
function updateWordDisplay() {
    wordDisplay.textContent = guessedWord.join(" ");
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
    if (attemptsLeft === 0 || guessedWord.join("") === selectedWord) return;

    if (selectedWord.includes(letter)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter) {
                guessedWord[i] = letter;
            }
        }
    } else {
        attemptsLeft--;
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
    } else if (attemptsLeft === 0) {
        message.textContent = `Игра окончена. Загаданное слово: ${selectedWord}`;
    }
}

// Перезапуск игры
function restartGame() {
    initGame();
}

// Запуск игры при загрузке страницы
document.addEventListener("DOMContentLoaded", initGame);