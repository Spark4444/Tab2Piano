// Arrays
let keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let currentKeys = [];
let currentKeysFlat = [];

// Objects
let tunings = {
    "Standard": ["-2E", "-2A", "-1D", "-1G", "-1B", "E"],
    "Half step down": ["-2D#", "-2G#", "-1C#", "-1F#", "-1A#", "D#"],
    "drop D": ["-2D", "-2A", "-1D", "-1G", "-1B", "E"],
    "Double drop D": ["-2D", "-2A", "-1D", "-1G", "-1B", "D"],
    "open G": ["-2D", "-2G", "-1D", "-1G", "-1B", "D"],
    "open D": ["-2D", "-2A", "-1D", "-1F#", "-1A", "D"],
    "open E": ["-2E", "-2B", "-1E", "-1G#", "-1B", "E"],
    "open A": ["-2E", "-2A", "-1E", "-1A", "-1C#", "E"],
    "DADGAD": ["-2D", "-2A", "-1D", "-1G", "-1A", "D"]
};

// Integers
let octaves = 6;
let middleOctaveIndex = 3;

// It will generate the currentKeys array with keys of each octave from negative octaves to middle octave to positive octaves values
let currentOctave = 0;
while(currentOctave < octaves + 1){
    if(middleOctaveIndex == currentOctave){
        currentKeys.push(keys);
    }
    else{
        currentKeys.push(keys.map(key => (currentOctave - middleOctaveIndex) + key));
    }
    currentOctave++;
}
currentKeysFlat = currentKeys.flat();

// Returns the keys of the octave at index (-3 to 3)
function getKeys(octaveIndex){
    return currentKeys[octaveIndex + middleOctaveIndex];
}

// Returns the key of the octave at their index and the index key (-3 to 3, 1 to 7)
function getKey(octaveIndex, keyIndex){
    keyIndex--;
    return getKeys(octaveIndex)[keyIndex];
}

// Gets the starting key(of the string) and the amount of keys to move(fret) and returns the key that it moved to
function tab2piano(startingKey, moveKeys, index){
    let date = new Date();
    date = date.toString().slice(0, date.toString().indexOf("GMT") - 1).toLowerCase();
    let startingKeyIndex = currentKeysFlat.indexOf(startingKey.toUpperCase());
    if(startingKeyIndex == -1){
        console.error(`Error:\n Invalid key value or non-existent key on input ${index} with value ${startingKey}\n On ${date}`);
        return null;
    }
    let endKeyIndex = startingKeyIndex + Number(moveKeys);

    let result = currentKeysFlat[endKeyIndex];
    if(result == undefined){
        console.error(`Error:\n Invalid fret value or non-existent key on input ${index} with value ${moveKeys}\n On ${date}`);
        return null;
    }

    return currentKeysFlat[endKeyIndex];
}