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
    selectTuning.value = getFromLocalStorage("tuning");
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
    stringIndexes[index].style.color = "red";
    stringInputs[index].style.color = "red";
    fretInputs[index].style.color = "red";
}

// Function to unhighlight the strings
function unhighlightStrings(){
    stringInputs.forEach((element, index) => {
        element.style.color = "";
        stringIndexes[index].style.color = "";
        fretInputs[index].style.color = "";
    });
}

// Function to visualize the piano depending on the value of inputs
function visualizePiano() {
    resetPiano();
    let keys = [];
    updateSelectors();
    unhighlightStrings();
    stringInputs.forEach((element, index) => {
        let stringValue = stringInputs[index].value.trim();
        let fretValue = fretInputs[index].value.trim();
        let result = tab2piano(stringValue, fretValue);
        if(stringValue == "" || fretValue == ""){
            
        }
        else if (result != null) {
            keys.push(result);
        }
        else{
            highlightString(index);
        }
    });
    keys.forEach(element => {
        let key = document.querySelector(`#${CSS.escape(element)}`);
        key.style.backgroundColor = "yellow";
    });
}

// Initial call
visualizePiano();

function updateSelectors() {
    stringIndexes = document.querySelectorAll(".stringIndex");
    stringInputs = document.querySelectorAll(".stringInput");
    fretInputs = document.querySelectorAll(".fretInput");
}

// Function to set input listeners
function setInputListeners() {
    setTimeout(() => {
    updateSelectors();
    stringInputs.forEach((element, index) => {
        element.addEventListener("input", visualizePiano);
        fretInputs[index].addEventListener("input", visualizePiano);
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