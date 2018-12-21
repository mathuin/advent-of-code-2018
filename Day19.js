// Day 19

const fs = require('fs');
const opcodes = require('opcodes');

// Go With The Flow

// Revisiting Day 16's assembly language stuff.

// Puzzle input has an instruction pointer setting in line one and assembly
// commands in each following line.

let [ testIPR, testProgram ] = opcodes.parseFile('./Day19-test.txt');
let [ testIDX, testReg ] = opcodes.execProgram(testProgram, { ipR: testIPR });
if (testReg[0] !== 6) {
  console.log(`test 1 failed: expected 6, got ${testReg[0]}`);
  process.exit();
}
let [ realIPR, realProgram ] = opcodes.parseFile('./Day19-input.txt');
let [ oneIDX, oneReg ] = opcodes.execProgram(realProgram, { ipR: realIPR });
console.log(`Step one: ${oneReg[0]} was left in register 0`);
//
// let [ twoIDX, twoReg ] = opcodes.execProgram(realIPR, realProgram, { reg: [1, 0, 0, 0, 0, 0] });
