function generateRandomInt(input){
  return Math.floor(Math.random() * input);
}

function generateSentenceStruct(nbrOfSyllables){
  let syllableArray = [];
  let remainingSyllables = nbrOfSyllables;

  while (remainingSyllables > 1){
    let randomNbr = generateRandomInt(remainingSyllables);
    if (randomNbr > 0){
      syllableArray.push(randomNbr);
    }
    remainingSyllables -= randomNbr;
  }

  if (remainingSyllables > 0){
    syllableArray.push(remainingSyllables);
  }

  return syllableArray;
}

module.exports = {
  generateRandomInt: generateRandomInt,
  generateSentenceStruct: generateSentenceStruct
};
