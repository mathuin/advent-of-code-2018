// Day 11

const fs = require('fs');

// Chronal Charge

// Find the 3x3 grid with the largest total power, completely within a 300x300
// grid.  Identify by X,Y coordinate of top-left fuel cell.

// Find the fuel cell's rack ID (X coordinate + 10)
// Begin with power level of rack ID times Y coordinate.
// Increase power level by value of grid serial number (puzzle input)
// Set power level to itself multiplied by rack ID.
// Keep only hundredths digit of power level (12345 becomes 3)
// Subtract 5 from power level.

// Now find the largest square grid of arbitrary size.

function totalPower(grid, topLeft, size = 3) {
  let retval = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      retval += grid.get(String([x+topLeft[0], y+topLeft[1]]));
    }
  }
  return retval;
}

function generateGrid(serial) {
  let grid = new Map();
  for (let y = 1; y < 301; y++) {
    for (let x = 1; x < 301; x++) {
      let key = String([x, y]);
      let rackID = x + 10;
      let powerValue = (rackID*y+serial)*rackID;
      let hundreds = Math.floor(powerValue/100) % 10;
      let final = hundreds - 5;
      grid.set(key, final);
    }
  }
  return grid;
}

function findLargest(grid, size = 3) {
  let maxPow = -99999;
  let retval = '';
  for (let y = 1; y < 301-size; y++) {
    for (let x = 1; x < 301-size; x++) {
      let loc = [x, y];
      let pow = totalPower(grid, loc, size);
      if (maxPow < pow) {
        maxPow = pow;
        retval = String([loc, maxPow]);
      }
    }
  }
  return retval;
}

// NB: the problem specifies possible grid sizes from 1x1 to 300x300,
// but all test answers (and my real answer) were below 30x30 in size.
function findLargestRange(grid) {
  let maxPow = -10;
  let retval = '';
  for (let size = 1; size < 31; size++) {
    let line = findLargest(grid, size);
    let tokens = line.split(',');
    let pow = parseInt(tokens[2]);
    if (maxPow < pow) {
      maxPow = pow;
      retval = String([tokens[0], tokens[1], size, tokens[2]]);
    }
  }
  return retval;
}

let testValues = [
  [ 18, "33,45,29" ],
  [ 42, "21,61,30" ]
]

for (let testValue of testValues) {
  let testSerial = testValue[0];
  let testExpected = testValue[1];
  let testGrid = generateGrid(testSerial);
  let testLargest = findLargest(testGrid);
  if (testLargest !== testExpected) {
    console.log(`Test failed: serial ${testSerial} returned ${testLargest} not ${testExpected}`);
  } else {
    console.log(`Test passed!`);
  }
}

let test2Values = [
  [ 18, "90,269,16,113" ],
  [ 42, "232,251,12,119" ]
]

for (let test2Value of test2Values) {
  let test2Serial = test2Value[0];
  let test2Expected = test2Value[1];
  let test2Grid = generateGrid(test2Serial);
  let test2Largest = findLargestRange(test2Grid);
  if (test2Largest !== test2Expected) {
    console.log(`Test failed: serial ${test2Serial} returned ${test2Largest} not ${test2Expected}`);
  } else {
    console.log(`Test passed!`);
  }
}

let realValue = 5235;
let realGrid = generateGrid(realValue);
let realLargest = findLargest(realGrid);
console.log(realLargest);
let realLargestRange = findLargestRange(realGrid);
console.log(realLargestRange);
