// Day 21

const fs = require('fs');
const opcodes = require('opcodes');
const readline = require('readline');

// Chronal Conversion

// Puzzle input is a program.

let [ realIPR, realProgram ] = opcodes.parseFile('./Day21-input.txt');

// I ran the program starting from 0 and looked for the first occurrence of
// ip=28 to see what was in register 2.

function callbackOne(ipR, reg, idx) {
  if (reg[ipR] === 28) {
    return [idx, reg[2]];
  }
  return false;
}

let [ oneIDX, oneReg ] = opcodes.execProgram(realProgram, { ipR: realIPR, callback:  callbackOne });
console.log(`Step one: ${oneReg} after ${oneIDX} instructions`);

// I ran the program saving each register 2 value at ip=28, and returned the
// one *before* the first repeat.

var idxs = [];
var results = [];

function callbackTwo(ipR, reg, idx) {
  if (reg[ipR] === 28) {
    if (results.includes(reg[2])) {
      return [idxs[idxs.length-1], results[results.length-1]];
    } else {
      idxs.push(idx);
      results.push(reg[2]);
    }
  }
}

let [ twoIDX, twoReg ] = opcodes.execProgram(realProgram, { ipR: realIPR, callback: callbackTwo });
console.log(`Step two: ${twoReg} after ${twoIDX} instructions`);
