let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Coded By Sief Tamer Based On Osama Elzero`;

// Options Of Game
let numberOfTries = 6;
let numberOfLitters = 6;
let currentTry = 1;
let numberOfHints = 2;

// World List Manage
let wordToGuess = "";
let words = ["Python", "JavaScript", "Java", "Kotlin", "Ruby", "C++", "C#", "C", "Php", "ASP", "Laravel", "Bootstrap", "ReactJS", "VueJS", "AngularJs", "MongoDB"]
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase(); // To Choose Random Value

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
let hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", getHint);

function generateInput() {
    let inputContainer = document.querySelector(".inputs"); 
    for (let i = 1; i <= numberOfTries; i++){   // Create Try Div
        let tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i} </span>`;
        if (i !== 1) { tryDiv.classList.add("disableInput"); }
        for (let j = 1; j <= wordToGuess.length; j++){     // Create Inputs In Try Div
            let input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input)
        }
        inputContainer.appendChild(tryDiv)
    }

    inputContainer.children[0].children[1].focus();
    let inputsInDisabledDiv = document.querySelectorAll(".disableInput input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true)); // To Make All Inputs In Disable Div Is Disabled

    let inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase(); // Change Character In Inputs To UpperCase
            let nextBox = inputs[index + 1];       
            if (nextBox) { nextBox.focus() } // To Go To Next Box
        });

        input.addEventListener("keydown", function (event) {
            let currentIndex = Array.from(inputs).indexOf(this);
            if (event.key === "ArrowRight") {
                let nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                let prevInput = currentIndex - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }
        });
    });
}

let checkBtn = document.querySelector(".check");
checkBtn.addEventListener("click", handleGuesses);
let messageArea = document.querySelector(".message")

function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= wordToGuess.length; i++) {
        let inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`)
        let inputLetter = inputField.value.toLowerCase();
        let actualLetter = wordToGuess[i - 1];


        if (inputLetter === actualLetter) {
            inputField.classList.add("inPlace");
        } else if (wordToGuess.includes(inputLetter) && inputLetter !== "") {
            inputField.classList.add("notInPlace");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }

    if (successGuess) {
        messageArea.innerHTML = `you win the word is <span>${wordToGuess}</span>`;

        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disableInput"));
        checkBtn.disabled = true;

    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disableInput");
        let currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true)); // Make Wrong Try Disabled
        currentTry++;

        let nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false)); // Make Next Try able

        let element = document.querySelector(`.try-${currentTry}`);
        if (element) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disableInput");
            element.children[1].focus();
        } else {
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
            checkBtn.disabled = true;
        }
    }
}

function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    } 
    if (numberOfHints === 0) {
        hintButton.disabled = true;
    }

    let enabledInputs = document.querySelectorAll("input:not([disabled])");
    let emptyInput = Array.from(enabledInputs).filter((input) => input.value === "")
    if (emptyInput.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyInput.length);
        let randomInput = emptyInput[randomIndex];
        let indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handleBackSpace() {
    if (event.key === "Backspace") {
        let inputs = document.querySelectorAll("input:not([disabled])");
        let currIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currIndex > 0) {
            let currInput = inputs[currIndex];
            let previousInput = inputs[currIndex - 1]
            currInput.value = "";
            previousInput.value = "";
            previousInput.focus();
        }
    }
}




document.addEventListener("keydown", handleBackSpace)
window.onload = function () {
    generateInput();
}