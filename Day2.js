// Day 2

const fs = require('fs');

// Inventory Management System

// Both puzzles may be solved using the following data structure: a map with
// keys of characters in an ID and values of the locations of those characters
// in the ID.

function charCounts(filename) {
  let input = fs.readFileSync(filename, 'utf8').split('\n');
  let countArr = [];
  for (let i = 0, len = input.length; i < len; i++) {
    let boxChars = input[i].split('');
    let charMap = new Map();
    for (let i = 0, len = boxChars.length; i < len; i++) {
      let boxChar = boxChars[i];
      if (!charMap.has(boxChar)) {
        charMap.set(boxChar, []);
      }
      let sofar = charMap.get(boxChar);
      sofar.push(i);
      charMap.set(boxChar, sofar);
    }
    countArr.push(charMap);
  }
  return countArr;
}

// The first part of the puzzle is a checksum calculation.
// The checksum is a product of the number of IDs with at least one letter
// appearing exactly twice and the number of IDs with at least one letter
// appearing three times.

function mkChecksum(countArr) {
  let twoTotal = 0, threeTotal = 0;
  for (let i = 0, len = countArr.length; i < len-1; i++) {
    let charCount = countArr[i];
    let two = 0, three = 0;
    for (let val of charCount.values()) {
      if (val.length === 2) two = 1;
      if (val.length === 3) three = 1;
    }
    twoTotal += two;
    threeTotal += three;
  }
  return twoTotal * threeTotal;
}

// The second part of the puzzle is to find two IDs that differ by exactly one
// character.  The answer to the puzzle is to return the common characters in
// order.

// First attempt: brute force it.

// Given two strings of equal length, return a string containing any letters
// found in the same place in both strings.
function commonLetters(a, b) {
  let retval = [];
  for (let i = 0, len = a.length; i < len; i++) {
    if (a[i] === b[i]) {
      retval.push(a[i]);
    }
  }
  return retval.join('');
}

// Brute force all combinations, stop when the length is one less than the ID.
function findBest(boxIDs) {
  const stopLen = boxIDs[0].length-1;
  let bestMatch = '';
  for (let i = 0, len = boxIDs.length; bestMatch === '' && i < len-1; i++) {
    for (let j = i+1; bestMatch === '' && j < len; j++) {
      let match = commonLetters(boxIDs[i], boxIDs[j]);
      if (match.length === stopLen) {
        bestMatch = match;
      }
    }
  }
  return bestMatch;
}

// "Day2-test1.txt" should generate a result of 12.

let testCounts = charCounts('./Day2-test1.txt');
if (mkChecksum(testCounts) !== 12) {
  console.log(`Test 1 failed: expected 12, got ${mkChecksum(testCounts)}`);
} else {
  let realCounts = charCounts('./Day2-input.txt');
  console.log(mkChecksum(realCounts));
}

// "Day2-test2.txt" should generate a result of "fgij".
let testIDs = fs.readFileSync('./Day2-test2.txt', 'utf8').split('\n');
if (findBest(testIDs) !== 'fgij') {
  console.log(`Test 2 failed: expected fgij, got ${findBest(testIDs)}`);
} else {
  let realIDs = fs.readFileSync('./Day2-input.txt', 'utf8').split('\n');
  console.log(findBest(realIDs));
}
