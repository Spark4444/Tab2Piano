// Dom elements
let selectInstrument = document.querySelector(".selectInstrument");
let selectTuning = document.querySelector(".selectTuning");
let strings = document.querySelector(".strings");
let frets = document.querySelector(".frets");
let piano = document.querySelector(".piano");
let stringInputs;
let fretInputs;

// Arrays
let instruments = ["g6", "g7", "b4", "b5"];

// Function to generate options for the instrument select
function generateInstrumentOptions() {
    instruments.forEach(element => {
        let instrument = "";
        switch(element[0]){
            case "g":
                instrument = "Guitar";
                break;
            case "b":
                instrument = "Bass";
                break;
        }
        selectInstrument.innerHTML += `<option value="${element}">${instrument} with ${element[1]} strings</option>`;
    });
}

generateInstrumentOptions();

// Function to generate options for the tuning select
function generateTuningSelect() {
    Object.keys(tunings).forEach(element => {
        selectTuning.innerHTML += `<option value="${element}">${element[0].toUpperCase()}${element.slice(1)}</option>`;
    });
}

generateTuningSelect();

// Function to generate the inputs for the strings and frets
function generateInputs(amount) {
    strings.innerHTML = "";
    frets.innerHTML = "";
    for(let i = 0;i < amount;i++){
        strings.innerHTML += `<input type="text" class="stringInput" placeholder="${getRandomKey()}" maxlength="4">`;
        frets.innerHTML += `<input type="text" class="fretInput" placeholder="${getRandomNumber(0,22)}" maxlength="2">`;
    }
}

// Initial call
generateInputs(Number(selectInstrument.value[1]));

// If user changes the select input it regenrate the inputs
selectInstrument.addEventListener("input", function () {
    generateInputs(Number(selectInstrument.value[1]));
    changeInputs(selectTuning.value);
});

// Function to set tuning for an input from a tuning
function changeInputs(tuning){
    if(selectInstrument.value[0] == "b"){
        let newTunings = tunings[tuning].reverse();
        document.querySelectorAll(".stringInput").forEach((element, index) => {
            element.value = newTunings[index + 2];
        });
    }
    else if(selectInstrument.value[0] == "g"){
        let newTunings = tunings[tuning].reverse();
        document.querySelectorAll(".stringInput").forEach((element, index) => {
            element.value = newTunings[index];
        });
    }
}

// Initial call
changeInputs("standard");

// If the user changes the value tuning input it will change the inputs with selected tuning
selectTuning.addEventListener("input", function () {
    changeInputs(selectTuning.value);
});

// Function to generate the html of the piano
function generatePiano() {

}

generatePiano();

// Function to visualize the piano depending on the value of inputs
function visualizePiano() {
    let keys = [];
    stringInputs = document.querySelectorAll(".stringInput");
    fretInputs = document.querySelectorAll(".fretInput");
    stringInputs.forEach((element, index) => {
        // ADD REGEX
        if(element.value != "" && fretInputs[index].value !== ""){
            keys.push(tab2piano(stringInputs[index].value, fretInputs[index].value));
        }
    });
    piano.innerHTML = keys;
}

visualizePiano();

setTimeout(() => {
    stringInputs.forEach((element, index) => {
        element.addEventListener("input", visualizePiano);
        fretInputs[index].addEventListener("input", visualizePiano);
    });
}, 10);