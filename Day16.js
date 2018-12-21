// Day 16

const fs = require('fs');
const opcodes = require('opcodes');

// Chronal Classification

// Puzzle input has two parts:
// - many samples (before/instruction/after sets)
// - several blank lines
// - a bunch of program lines with four numbers separated by spaces

function parseInput(filename) {
  let lines = fs.readFileSync(filename, 'utf8').split('\n');
  let samples = [];
  let program = [];

  while (true) {
    let line = lines.shift();
    if (line.includes('Before')) {
      let justNums = new RegExp('[^0-9]+');
      let beforeTokens = line.split(justNums).slice(1,5).map(Number);
      let instrTokens = lines.shift().split(' ').map(Number);
      let afterTokens = lines.shift().split(justNums).slice(1,5).map(Number);
      let blank = lines.shift();
      samples.push([beforeTokens, instrTokens, afterTokens]);
    } else {
      break;
    }
  }

  let _ = 0;
  [ _, program ] = opcodes.parseLines(lines);

  return [samples, program];
}

let [samples, program] = parseInput('./Day16-input.txt');

function regEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// Step one: how many samples behave like three or more opcodes?
// As a bonus, this function also generates the map required for part two!
function testSamples(samples) {
  let threeMore = 0;
  let opValues = new Map();
  for (let i = 0; i < samples.length; i++) {
    let [before, [op, a, b, c], after] = samples[i];
    let matches = [];
    for (let [tag, func] of opcodes.opMap.entries()) {
      if (regEqual(func(a, b, c, before), after)) {
        matches.push(tag);
      }
    }
    if (matches.length > 2) { threeMore++; }
    if (matches.length === 0) {
      console.log(`WARNING Before: ${before} | Op: ${op} A: ${a} B: ${b} C: ${c} | After: ${after}`);
    } else {
      if (opValues.has(op)) {
        let oldValues = opValues.get(op);
        let newValues = oldValues.filter(v => -1 !== matches.indexOf(v));
        opValues.set(op, newValues);
      } else {
        opValues.set(op, matches);
      }
    }
  }
  console.log(`Step one: ${threeMore}`);

  // match number to function
  let opNum = new Map();
  while (opValues.size > 0) {
    let sortedOps = new Map([...opValues.entries()].sort((a, b) => a[1].length - b[1].length));
    for (let [key, value] of sortedOps.entries()) {
      if (value.length === 1) {
        // console.log(`${key}: ${value[0]}`);
        opNum.set(String(key), opcodes.opMap.get(value[0]));
        opValues.delete(key);
        for (let [ok, ov] of opValues.entries()) {
          opValues.set(ok, ov.filter(v => v != value[0]));
        }
        break;
      }
    }
  }
  return opNum;
}

let opNum = testSamples(samples);

// Step two, use output from previous code to identify which opcodes are which,
// and run the sample program.
// NB: as this program is ignorant of instruction pointer registers, the ipR is
// set to an unused register.
let [ twoIDX, twoReg ] = opcodes.execProgram(program, { ipR: 4, opmap: opNum });
console.log(`Step two: ${twoReg[0]}`);
