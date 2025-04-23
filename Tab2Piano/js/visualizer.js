// Dom elements
let selectTuning = document.querySelector(".selectTuning");
let stringsIndex = document.querySelector(".stringsIndex");
let strings = document.querySelector(".strings");
let frets = document.querySelector(".frets");
let piano = document.querySelector(".piano");
let stringIndexes;
let stringInputs;
let fretInputs;

// Function to save current values to local storage
function saveValuesToLocalStorage() {
    let stringValues = [];
    let fretValues = [];
    stringInputs.forEach((element, index) => {
        stringValues.push(element.value);
        fretValues.push(fretInputs[index].value);
    });
    saveToLocalStorage("stringValues", JSON.stringify(stringValues));
    saveToLocalStorage("fretValues", JSON.stringify(fretValues));
    saveToLocalStorage("tuning", selectTuning.value);
}

// Function to load values from local storage
function loadValuesFromLocalStorage() {
    let stringValues = JSON.parse(getFromLocalStorage("stringValues"));
    let fretValues = JSON.parse(getFromLocalStorage("fretValues"));
    selectTuning.value = getFromLocalStorage("tuning") || "Standard";
    if (stringValues && fretValues) {
        stringInputs.forEach((element, index) => {
            element.value = stringValues[index];
            fretInputs[index].value = fretValues[index];
        });
        visualizePiano();
    }
}

// Attach saveValuesToLocalStorage to beforeunload event
window.addEventListener("beforeunload", saveValuesToLocalStorage);

// Load values from local storage on page load
window.addEventListener("load", loadValuesFromLocalStorage);

// Function to generate options for the tuning select
function generateTuningSelect() {
    Object.keys(tunings).forEach(element => {
        selectTuning.innerHTML += `<option value="${element}">${element[0].toUpperCase()}${element.slice(1)} tuning</option>`;
    });
}

// Initial call
generateTuningSelect();

// Function to generate the inputs for the strings and frets
function generateInputs(amount) {
    stringsIndex.innerHTML = "";
    strings.innerHTML = "";
    frets.innerHTML = "";
    for(let i = 0;i < amount;i++){
        stringsIndex.innerHTML += `<div class="stringIndex">${i + 1}</div>`;
        strings.innerHTML += `<input type="text" class="stringInput" placeholder="C" maxlength="4">`;
        frets.innerHTML += `<input type="text" class="fretInput" placeholder="0" maxlength="3">`;
    }
}

// Initial call
generateInputs(6);

// Function to set tuning for an input from a tuning
function changeInputs(tuning){
    resetPiano();
    let newTunings = tunings[tuning].slice().reverse();
    document.querySelectorAll(".stringInput").forEach((element, index) => {
        element.value = newTunings[index];
    });
}

function adjustTuning(upORDown) {
    document.querySelectorAll(".stringInput").forEach((element, index) => {
        if(upORDown){
            element.value = tab2piano(element.value, 1, index + 1);
        }
        else{
            element.value = tab2piano(element.value, -1, index + 1);
        }
    });
    visualizePiano();
}

// Initial call
changeInputs("Standard");

// If the user changes the value tuning input it will change the inputs with selected tuning
selectTuning.addEventListener("input", function () {
    changeInputs(selectTuning.value);
    setTimeout(() => {
        visualizePiano();
    }, 10);
});

// Function to generate the html of the piano
function generatePiano(keysArray) {
    piano.innerHTML = "";
    let newPianoHtml = "";
    let previousWasBlackKey = false;
    keysArray.forEach((element, index) => {
        if(element.includes("C") && !element.includes("#")){
            newPianoHtml += `<div class="octave">`;
        }
        
        if(element.includes("#")){
            previousWasBlackKey = true;
            newPianoHtml += `<div class="key blackKey" id="${element}"></div>`;
        }
        else if(previousWasBlackKey){
            previousWasBlackKey = false;
            newPianoHtml += `<div class="key whiteKey toTheLeftOfBlackKey" id="${element}">${element}</div>`;
        }
        else{
            newPianoHtml += `<div class="key whiteKey" id="${element}">${element}</div>`;
        }

        if(element.includes("B")){
            newPianoHtml += `</div>`;
        }
    });
    piano.innerHTML = newPianoHtml;
}

// Initial call
generatePiano(currentKeysFlat);

// Function to reset the piano
function resetPiano() {
    let keys = document.querySelectorAll(".key");
    keys.forEach(element => {
        element.style.backgroundColor = "";
    });
}

// Function to highlight the strings that are invalid
function highlightString(index){
    stringIndexes[index].style.color = "var(--error-color)";
    stringInputs[index].style.color = "var(--error-color)";
    fretInputs[index].style.color = "var(--error-color)";
}

// Function to unhighlight the strings
function unhighlightStrings(){
    stringInputs.forEach((element, index) => {
        element.style.color = `var(--key-higlight-color${index})`;
        stringIndexes[index].style.color = `var(--key-higlight-color${index})`;
        fretInputs[index].style.color = `var(--key-higlight-color${index})`;
    });
}

// Function to visualize the piano depending on the value of inputs
function visualizePiano() {
    resetPiano();
    let resultIndexes = [];
    let keys = [];
    updateSelectors();
    unhighlightStrings();
    stringInputs.forEach((element, index) => {
        let stringValue = stringInputs[index].value.trim();
        let fretValue = fretInputs[index].value.trim();
        let result = tab2piano(stringValue, fretValue, index + 1);
        if(stringValue == "" || fretValue == "" && result != null){
            
        }
        else if (result != null) {
            resultIndexes.push(index);
            keys.push(result);
        }
        else{
            highlightString(index);
        }
    });
    keys.forEach((element, index) => {
        let key = document.querySelector(`#${CSS.escape(element)}`);
        if(key){
            key.style.backgroundColor = `var(--key-higlight-color${resultIndexes[index]})`;
        }
    });
}

// Initial call
visualizePiano();

// Function to update the selectors and set the colors of the inputs
function updateSelectors() {
    stringIndexes = document.querySelectorAll(".stringIndex");
    stringInputs = document.querySelectorAll(".stringInput");
    fretInputs = document.querySelectorAll(".fretInput");
}

// Function to set the colors of the inputs and the indexes
function setColors(){
    setTimeout(() => {
        updateSelectors();
        stringIndexes.forEach((element, index) => {
            element.style.color = `var(--key-higlight-color${index})`;
            stringInputs[index].style.color = `var(--key-higlight-color${index})`;
            fretInputs[index].style.color = `var(--key-higlight-color${index})`;
        });
    }, 10);
}

// Initial call
setColors();

// Function to set input listeners
function setInputListeners() {
    setTimeout(() => {
    updateSelectors();
    stringInputs.forEach((element, index) => {
        element.addEventListener("input", visualizePiano);
        fretInputs[index].addEventListener("input", visualizePiano);

        // Add keydown event listener for arrow keys to change to the next/previous input if it exists
        element.addEventListener("keydown", function (event) {
            console.log(event.code);
            let cursorPosition = element.selectionStart;
            if (event.code === "ArrowDown") {
                event.preventDefault();
                if (index + 1 < stringInputs.length) {
                    stringInputs[index + 1].focus();
                    stringInputs[index + 1].setSelectionRange(cursorPosition, cursorPosition);
                }
            }
            else if(event.code === "ArrowUp"){
                event.preventDefault();
                if(index - 1 >= 0){
                    stringInputs[index - 1].focus();
                    stringInputs[index - 1].setSelectionRange(cursorPosition, cursorPosition);
                }
            }
            else if(event.code === "Minus" || event.code === "NumpadSubtract"){
                event.preventDefault();
                if(tab2piano(element.value, -1, index + 1) != null){
                    element.value = tab2piano(element.value, -1, index + 1);
                    visualizePiano();
                }
            }
            else if(event.code === "Equal" || event.shiftKey && event.code === "Equal" || event.code === "NumpadAdd"){
                event.preventDefault();
                if(tab2piano(element.value, 1, index + 1) != null){
                    element.value = tab2piano(element.value, 1, index + 1);
                    visualizePiano();
                }
            }
            else if(event.code === "ArrowRight" && cursorPosition == stringInputs[index].value.length){
                setTimeout(() => {
                    fretInputs[index].focus();
                    fretInputs[index].setSelectionRange(0, 0);
                }, 10);
            }
        });
        
        fretInputs[index].addEventListener("keydown", function (event) {
            let cursorPosition = fretInputs[index].selectionStart;
            if (event.code === "ArrowDown") {
                event.preventDefault();
                if (index + 1 < fretInputs.length) {
                    fretInputs[index + 1].focus();
                    fretInputs[index + 1].setSelectionRange(cursorPosition, cursorPosition);
                }
            }
            else if(event.code === "ArrowUp"){
                event.preventDefault();
                if(index - 1 >= 0){
                    fretInputs[index - 1].focus();
                    fretInputs[index - 1].setSelectionRange(cursorPosition, cursorPosition);
                }
            }
            else if(event.code === "Minus" || event.code === "NumpadSubtract"){
                event.preventDefault();
                fretInputs[index].value = Number(fretInputs[index].value) - 1;
                visualizePiano();
            }
            else if(event.code === "Equal" || event.shiftKey && event.code === "Equal" || event.code === "NumpadAdd"){
                event.preventDefault();
                fretInputs[index].value = Number(fretInputs[index].value) + 1;
                visualizePiano();
            }
            else if(event.code === "ArrowLeft" && cursorPosition == 0){
                setTimeout(() => {
                    stringInputs[index].focus();
                    stringInputs[index].setSelectionRange(stringInputs[index].value.length, stringInputs[index].value.length);
                }, 10);
            }
        });
    });
    }, 10);
}

// Initial call
setInputListeners();

function resetFrets() {
    fretInputs.forEach(element => {
        element.value = "";
    });
    visualizePiano();
}

// Keybinds
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.code === "KeyR") {
        event.preventDefault();
        resetFrets();
    }

    else if(event.ctrlKey && event.code === "KeyU"){
        event.preventDefault();
        adjustTuning(true);
    }

    else if(event.ctrlKey && event.code === "KeyJ"){
        event.preventDefault();
        adjustTuning(false);
    }
});