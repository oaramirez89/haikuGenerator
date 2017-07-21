var fs = require("fs");
var random = require("./randomNumGenerator");

function readCmudictFile(file){
  return fs.readFileSync(file).toString();
}

function WordDef(word){
  this.word = word;
  this.phonemes = [];
  this.nbrOfSyllables = 0;
}

/*
  Construct a map with its key being the number of
  syllables in a word, and the value being an array
  of those words containing that number of syllables.

  Based on existing file we end up with the following
  set of keys:
  MapIterator { 1, 6, 3, 2, 4, 5, 7, 12, 8, 9, 0, 14 }
*/
function formatData(data){
  let wordDefs = new Map();

   let lines = data.toString().split("\n"),
       lineSplit

   lines.forEach(function(line){
    // This condition is necessary in case file
    // contains an empty line.
    if (line.length > 0){
      lineSplit = line.split("  ");
      // strip out the parenthesis in some of these
      // words. Fine to do as we are not using the
      // word as a key.
      let parenthesisIndex = lineSplit[0].indexOf('(');
      let word = lineSplit[0];
      if (parenthesisIndex >= 0){
        word = word.substring(0, parenthesisIndex);
      }
      let wordInstance = new WordDef(word);
      wordInstance.phonemes = lineSplit[1].split(' ');

      // Determine number of syllables for word.
      wordInstance.phonemes.forEach(function(phoneme){
        if (phoneme.match(/\d/)){
          wordInstance.nbrOfSyllables++;
        }
      })

      // Do we have an entry for these number of syllables
      // in the map?
      let arrayOfWords = wordDefs.get(wordInstance.nbrOfSyllables);
      // If we do not create an entry.
      if (arrayOfWords === undefined){
        let newArray = [wordInstance];
        wordDefs.set(wordInstance.nbrOfSyllables, newArray);
      }else {
        // If we do update the existing array for that key.
        arrayOfWords.push(wordInstance);
      }
    }
  });

  return wordDefs;
}

/*
  Haiku structure is three phrases of n syllables each.
  Expected format of the structure is [n1, n2, n3] where
  each element of the array is the number of syllables
  required in each phrase.
*/
function createHaiku(structure){
  let wordMap = formatData(readCmudictFile('./cmudict.txt'));

  // Randomize number of words in each phrase by
  // taking syllables required and breaking them into
  // parts.
  let syllableBreakdown = [];
  structure.forEach(function(element){
    syllableBreakdown.push(random.generateSentenceStruct(element));
  })

  /*
    Armed with the syllable breakdown go to the word map
    and select a word at random with that number of syllables.
  */
  syllableBreakdown.forEach(function(phraseArray){
    let phrase = "";
    phraseArray.forEach(function(nbrOfSyllables){
      let wordArray = wordMap.get(nbrOfSyllables);
      let wordToChose = random.generateRandomInt(wordArray.length);
      phrase = phrase + " " + wordArray[wordToChose].word;
    })
    console.log(phrase);
  })
}

module.exports = {
  createHaiku: createHaiku
};

