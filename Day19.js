// Day 19

const fs = require('fs');
const opcodes = require('opcodes');

// Go With The Flow

// Revisiting Day 16's assembly language stuff.

// Test input is unrelated to the puzzle input.

let [ testIPR, testProgram ] = opcodes.parseFile('./Day19-test.txt');
let [ testIDX, testReg ] = opcodes.execProgram(testProgram, { ipR: testIPR });
if (testReg[0] !== 6) {
  console.log(`test 1 failed: expected 6, got ${testReg[0]}`);
  process.exit();
}

// Puzzle input has an instruction pointer setting in line one and assembly
// commands in each following line.

// News flash: the program computes the sums of the factors of a number.
// For register 0, that number is 1017, the factors are 1, 3, 9, 113, 339, and 1017, and the sums of the factors is 1482.
// For register 1, that number is 10551417, the factors are 1, 3, 3517139, and 10551417, and the sums of the factors is 14068560.

let [ realIPR, realProgram ] = opcodes.parseFile('./Day19-input.txt');
let [ oneIDX, oneReg ] = opcodes.execProgram(realProgram, { ipR: realIPR });
console.log(`Step one: ${oneReg[0]} was left in register 0`);

let [ twoIDX, twoReg ] = opcodes.execProgram(realProgram, { ipR: realIPR, reg: [1, 0, 0, 0, 0, 0] });
console.log(`Step one: ${twoReg[0]} was left in register 0`);
