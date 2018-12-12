// Day 12

const fs = require('fs');

// Subterranean Sustainability

function parseInput(filename) {
  let lines = fs.readFileSync(filename, 'utf8').split('\n');
  let rawInitial = lines.shift().split(' ').pop();
  let initial = new Map();
  initial.set(-2, '.');
  initial.set(-1, '.');
  for (let i = 0; i < rawInitial.length; i++) {
    initial.set(i, rawInitial[i]);
  }
  initial.set(rawInitial.length, '.');
  initial.set(rawInitial.length+1, '.');
    let rules = new Map();
  for (let line of lines) {
    let words = line.split(' => ');
    if (words.length !== 2) continue;
    let key = words[0];
    let value = words[1];
    rules.set(key, value);
  }
  return [initial, rules];
}

function printRow(row) {
  let retval = '';
  for (let value of row.values()) {
    retval += value;
  }
  return retval;
}

function applyRules(initial, rules, generations) {
  let row = initial;
  for (let i = 0; i < generations; i++) {
    let nextRow = new Map();
    for (let key of row.keys()) {
      let ruleKey = '';
      for (let i = key-2; i < key+3; i++) {
        ruleKey += (row.has(i) ? row.get(i) : '.');
      }
      let nextElem = (rules.has(ruleKey) ? rules.get(ruleKey) : '.');
      nextRow.set(key, nextElem);
    }
    // strip excess dots
    let trimFront = new Map([...nextRow.entries()].sort((a, b) => a[0] - b[0]));
    for (let [key, value] of trimFront.entries()) {
      if (value === '#') break;
      trimFront.delete(key);
    }
    let trimBack = new Map([...trimFront.entries()].sort((a, b) => b[0] - a[0]));
    for (let [key, value] of trimBack.entries()) {
      if (value === '#') break;
      trimBack.delete(key);
    }
    // pad ends
    let padRow = new Map([...trimBack.entries()].sort((a, b) => a[0] - b[0]));
    let smallKey = Math.min(...padRow.keys());
    if (padRow.get(smallKey) === '#') {
      padRow.set(smallKey-1, '.');
      padRow.set(smallKey-2, '.');
    } else {
      console.log(`WARNING: trimFront code fail on iteration ${i}`);
      console.log(`nextRow:   ${printRow(nextRow)}`);
      console.log(`trimFront: ${printRow(trimFront)}`);
      console.log(`trimBack:  ${printRow(trimBack)}`);
      console.log(`padRow:    ${printRow(padRow)}`);
      process.exit();
    }
    let largeKey = Math.max(...padRow.keys());
    if (padRow.get(largeKey) === '#') {
      padRow.set(largeKey+1, '.');
      padRow.set(largeKey+2, '.');
    } else {
      console.log(`WARNING: trimBack code fail on iteration ${i}`);
      console.log(`nextRow:   ${printRow(nextRow)}`);
      console.log(`trimFront: ${printRow(trimFront)}`);
      console.log(`trimBack:  ${printRow(trimBack)}`);
      console.log(`padRow:    ${printRow(padRow)}`);
      process.exit();
    }
    row = new Map([...padRow.entries()].sort((a, b) => a[0] - b[0]));
  }
  return row;
}

function sumPots(row) {
  let retval = 0;
  for (let [key, value] of row.entries()) {
    if (value === '#') {
      retval += key;
    }
  }
  return retval;
}

let testInput = parseInput('./Day12-test.txt');
let testInitial = testInput[0];
let testRules = testInput[1];
let testRow = applyRules(testInitial, testRules, 20);
let testCount = sumPots(testRow);
if (testCount !== 325) {
  console.log(`Test 1 failed: expected 325, got ${testCount}`);
} else {
  let realInput = parseInput('./Day12-input.txt');
  let realInitial = realInput[0];
  let realRules = realInput[1];
  let realRow = applyRules(realInitial, realRules, 20);
  let realCount = sumPots(realRow);
  console.log(realCount);
  let realRow2 = applyRules(realInitial, realRules, 50000000000);
  let realCount2 = sumPots(realRow2);
  console.log(realCount2);
}
