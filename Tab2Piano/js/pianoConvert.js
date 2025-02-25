// Arrays
let keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let currentKeys = [];
let currentKeysFlat = [];

// Objects
let tunings = {
    standard: ["-1E", "-1A", "D", "G", "B", "E"],
    dropD: ["-1D", "-1A", "D", "G", "B", "E"],
    doubleDropD: ["-1D", "-1A", "D", "G", "B", "D"],
    openG: ["-1D", "G", "D", "G", "B", "D"],
    openD: ["-1D", "-1A", "D", "F#", "A", "D"],
    openE: ["-1E", "-1B", "E", "G#", "B", "E"],
    openA: ["-1E", "-1A", "E", "A", "C#", "E"],
    DADGAD: ["-1D", "-1A", "D", "G", "A", "D"]
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
    if(octaveIndex < -3 || octaveIndex > 3){
        console.error("Inval id index");
        return;
    }
    return currentKeys[octaveIndex + middleOctaveIndex];
}

// Returns the key of the octave at their index and the index key (-3 to 3, 1 to 7)
function getKey(octaveIndex, keyIndex){
    keyIndex--;
    return getKeys(octaveIndex)[keyIndex];
}

// Gets the starting key(of the string) and the amount of keys to move(fret) and returns the key that it moved to
function tab2piano(startingKey, moveKeys){
    let startingKeyIndex = currentKeysFlat.indexOf(startingKey.toUpperCase());
    let endKeyIndex = startingKeyIndex + Number(moveKeys);

    return currentKeysFlat[endKeyIndex];
}