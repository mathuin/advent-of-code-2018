// Day 16

const fs = require('fs');

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

  for (let line of lines) {
    let tokens = line.split(' ').map(Number);
    if (tokens.length === 4) {
      program.push(tokens);
    }
  }

  return [samples, program];
}

let [samples, program] = parseInput('./Day16-input.txt');

// There are many possible opcodes.

// addr: add register (stores in register C sum of registers A and B)
function addr(a, b, c, regin) {
  let registers = regin.slice();
  // console.log(`addr: registers[${a}] (${registers[a]}) + registers[${b}] (${registers[b]}) = ${registers[a]+registers[b]} -> registers[${c}]`);
  registers[c] = registers[a] + registers[b];
  return registers;
}

// addi: add immediate (stores in register C sum of register A and value B)
function addi(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`addi: registers[${a}] (${registers[a]}) + ${b} = ${registers[a]+b} -> registers[${c}]`);
  registers[c] = registers[a] + b;
  return registers;
}

// mulr: multiply register (stores in register C product of registers A and B)
function mulr(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`mulr: registers[${a}] (${registers[a]}) * registers[${b}] (${registers[b]}) = ${registers[a]*registers[b]} -> registers[${c}]`);
  registers[c] = registers[a] * registers[b];
  return registers;
}

// muli: multiply immediate (stores in register C product of register A and value B)
function muli(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`muli: registers[${a}] (${registers[a]}) * ${b} = ${registers[a]*b} -> registers[${c}]`);
  registers[c] = registers[a] * b;
  return registers;
}

// banr: bitwise AND register
function banr(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`banr: registers[${a}] (${registers[a]}) & registers[${b}] (${registers[b]}) = ${registers[a] & registers[b]} -> registers[${c}]`)
  registers[c] = registers[a] & registers[b];
  return registers;
}

// bani: bitwise AND immediate
function bani(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`bani: registers[${a}] (${registers[a]}) & ${b} = ${registers[a] & b} -> registers[${c}]`)
  registers[c] = registers[a] & b;
  return registers;
}

// borr: bitwise OR register
function borr(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`borr: registers[${a}] (${registers[a]}) | registers[${b}] (${registers[b]}) = ${registers[a] | registers[b]} -> registers[${c}]`)
  registers[c] = registers[a] | registers[b];
  return registers;
}

// bori: bitwise OR immediate
function bori(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`bori: registers[${a}] (${registers[a]}) | ${b} = ${registers[a] | b} -> registers[${c}]`)
  registers[c] = registers[a] | b;
  return registers;
}

// setr: set register
function setr(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`setr: registers[${a}] (${registers[a]}) -> registers[${c}]`)
  registers[c] = registers[a];
  return registers;
}

// seti: set immediate
function seti(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`seti: ${a} -> registers[${c}]`)
  registers[c] = a;
  return registers;
}

// gtir: greater-than immediate/register
function gtir(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`gtir: ${a} > registers[${b}] (${registers[b]}) = ${(a>registers[b]) ? 1 : 0} -> registers[${c}]`)
  registers[c] = (a>registers[b]) ? 1 : 0;
  return registers;
}

// gtri: greater-than register/immediate
function gtri(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`gtri: registers[${a}] (${registers[a]}) > ${b} = ${(registers[a]>b) ? 1 : 0} -> registers[${c}]`)
  registers[c] = (registers[a]>b) ? 1 : 0;
  return registers;
}

// gtrr: greater-than register/register
function gtrr(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`gtrr: registers[${a}] (${registers[a]}) > registers[${b}] (${registers[b]}) = ${(registers[a]>registers[b]) ? 1 : 0} -> registers[${c}]`)
  registers[c] = (registers[a]>registers[b]) ? 1 : 0;
  return registers;
}

// eqir: equal immediate/register
function eqir(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`eqir: ${a} === registers[${b}] (${registers[b]}) = ${(a===registers[b]) ? 1 : 0} -> registers[${c}]`)
  registers[c] = (a===registers[b]) ? 1 : 0;
  return registers;
}

// eqri: equal register/immediate
function eqri(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`eqri: registers[${a}] (${registers[a]}) === ${b} = ${(registers[a]===b) ? 1 : 0} -> registers[${c}]`)
  registers[c] = (registers[a]===b) ? 1 : 0;
  return registers;
}

// eqrr: equal register/register
function eqrr(a, b, c, regin) {
  let registers = regin.slice();
  // console.log`eqrr: registers[${a}] (${registers[a]}) === registers[${b}] (${registers[b]}) = ${(registers[a]===registers[b]) ? 1 : 0} -> registers[${c}]`)
  registers[c] = (registers[a]===registers[b]) ? 1 : 0;
  return registers;
}

function regEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// Step one: how many samples behave like three or more opcodes?
function testSamples(samples) {
  let threeMore = 0;
  let opValues = new Map();
  for (let i = 0; i < samples.length; i++) {
    let [before, [op, a, b, c], after] = samples[i];
    let matches = [];
    if (regEqual(addr(a, b, c, before), after)) { matches.push('addr'); }
    if (regEqual(addi(a, b, c, before), after)) { matches.push('addi'); }
    if (regEqual(mulr(a, b, c, before), after)) { matches.push('mulr'); }
    if (regEqual(muli(a, b, c, before), after)) { matches.push('muli'); }
    if (regEqual(banr(a, b, c, before), after)) { matches.push('banr'); }
    if (regEqual(bani(a, b, c, before), after)) { matches.push('bani'); }
    if (regEqual(borr(a, b, c, before), after)) { matches.push('borr'); }
    if (regEqual(bori(a, b, c, before), after)) { matches.push('bori'); }
    if (regEqual(setr(a, b, c, before), after)) { matches.push('setr'); }
    if (regEqual(seti(a, b, c, before), after)) { matches.push('seti'); }
    if (regEqual(gtir(a, b, c, before), after)) { matches.push('gtir'); }
    if (regEqual(gtri(a, b, c, before), after)) { matches.push('gtri'); }
    if (regEqual(gtrr(a, b, c, before), after)) { matches.push('gtrr'); }
    if (regEqual(eqir(a, b, c, before), after)) { matches.push('eqir'); }
    if (regEqual(eqri(a, b, c, before), after)) { matches.push('eqri'); }
    if (regEqual(eqrr(a, b, c, before), after)) { matches.push('eqrr'); }
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
  while (opValues.size > 0) {
    let sortedOps = new Map([...opValues.entries()].sort((a, b) => a[1].length - b[1].length));
    for (let [key, value] of sortedOps.entries()) {
      if (value.length === 1) {
        console.log(`${key}: ${value[0]}`);
        opValues.delete(key);
        for (let [ok, ov] of opValues.entries()) {
          opValues.set(ok, ov.filter(v => v != value[0]));
        }
        break;
      }
    }
  }
}

testSamples(samples);

// Step two, use output from previous code to identify which opcodes are which,
// and run the sample program.

function runProgram(program) {
  // by hand, because making it all one thing is unnecessarily elegant.
  // I would have to rewire the opcode functions to a map.
  // key: string, value: function
  let opArray = [
    bori,
    muli,
    banr,
    bani,
    gtir,
    setr,
    addr,
    eqir,
    seti,
    addi,
    eqrr,
    eqri,
    borr,
    gtrr,
    mulr,
    gtri
  ]

  registers = [0, 0, 0, 0]
  for (let [op, a, b, c] of program) {
    console.log(`Registers: ${registers} Op: ${op} A: ${a} B: ${b} C: ${c}`);
    registers = opArray[op](a, b, c, registers);
  }
  console.log(registers[0]);
}

runProgram(program);
