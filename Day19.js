// Day 19

const fs = require('fs');

// Go With The Flow

// Revisiting Day 16's assembly language stuff.

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

let opMap = new Map([
  [ "addr", addr ],
  [ "addi", addi ],
  [ "mulr", mulr ],
  [ "muli", muli ],
  [ "banr", banr ],
  [ "bani", bani ],
  [ "borr", borr ],
  [ "bori", bori ],
  [ "setr", setr ],
  [ "seti", seti ],
  [ "gtir", gtir ],
  [ "gtri", gtri ],
  [ "gtrr", gtrr ],
  [ "eqir", eqir ],
  [ "eqri", eqri ],
  [ "eqrr", eqrr ]
])

// Puzzle input has an instruction pointer setting in line one and assembly
// commands in each following line.

function parseInput(filename) {
  let lines = fs.readFileSync(filename, 'utf8').split('\n');
  let program = [];

  let ipR = lines.shift().split(' ').map(Number)[1];

  for (let line of lines) {
    let [addr, a, b, c] = line.split(' ');
    if (!a) break;
    program.push([addr, parseInt(a, 10), parseInt(b, 10), parseInt(c, 10)]);
  }

  return [ ipR, program ];
}

function execProgram(ipR, program, registers=[0, 0, 0, 0, 0, 0]) {
  let ip = 0;
  let idx = 0;

  while (ip >= 0 && ip < program.length) {
    idx++;
    registers[ipR] = ip;
    let [opcode, a, b, c] = program[ip];
    let newRegisters = opMap.get(opcode)(a, b, c, registers);
    if (idx % 10000000 === 0) {
      console.log(`idx ${idx}: ip=${ip} [${registers}] ${opcode} ${a} ${b} ${c} [${newRegisters}]`);
    }
    registers = newRegisters;
    ip = registers[ipR];
    ip++;
  }
  return registers[0];
}


// let [ testIPR, testProgram ] = parseInput('./Day19-test.txt');
// let testResult = execProgram(testIPR, testProgram);
// if (testResult !== 6) {
//   console.log(`test 1 failed: expected 6, got ${testResult}`);
//   process.exit();
// }
let [ realIPR, realProgram ] = parseInput('./Day19-input.txt');
// console.log(execProgram(realIPR, realProgram));
console.log(execProgram(realIPR, realProgram, [1, 0, 0, 0, 0, 0]));
// console.log(execProgram(realIPR, realProgram, [0,4671164,3,4671164,1,10551417]));
