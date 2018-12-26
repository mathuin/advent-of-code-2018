// Day 25

const fs = require('fs');

// Four Dimensional Adventure

function manhattanDistance(a, b) {
  return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]) + Math.abs(a[3]-b[3]);
}

// A constellation is a set of points such that each point is no more than
// three units from another point in the constellation.
function countConstellations(points, print = false) {
  let connies = new Map();

  for (let rawpt of points) {
    let point = rawpt.split(',').map(Number);
    if (point.length === 1) break;

    let closeKeys = [...connies.entries()].map(e => [e[0], Math.min(...e[1].map(v => manhattanDistance(point, v)))]).filter(e => e[1] < 4).map(e => e[0]);

    let newCon = closeKeys.map(k => connies.get(k)).reduce((v, e) => v.concat(e), [point]);

    closeKeys.forEach(k => connies.delete(k));

    connies.set(String(point), newCon);
  }

  return connies.size;
}

// Test inputs and expected outputs
let testInputs = [
  [
    [
      '0,0,0,0',
      '3,0,0,0',
      '0,3,0,0',
      '0,0,3,0',
      '0,0,0,3',
      '0,0,0,6',
      '9,0,0,0',
      '12,0,0,0',
    ],
    2
  ],
  [
    [
      '-1,2,2,0',
      '0,0,2,-2',
      '0,0,0,-2',
      '-1,2,0,0',
      '-2,-2,-2,2',
      '3,0,2,-1',
      '-1,3,2,2',
      '-1,0,-1,0',
      '0,2,1,-2',
      '3,0,0,0',
    ],
    4
  ],
  [
    [
      '1,-1,0,1',
      '2,0,-1,0',
      '3,2,-1,0',
      '0,0,3,1',
      '0,0,-1,-1',
      '2,3,-2,0',
      '-2,2,0,0',
      '2,-2,0,-1',
      '1,-1,0,-1',
      '3,2,0,2',
    ],
    3
  ],
  [
    [
      '1,-1,-1,-2',
      '-2,-2,0,1',
      '0,2,1,3',
      '-2,3,-2,1',
      '0,2,3,-2',
      '-1,-1,1,-2',
      '0,-2,-1,0',
      '-2,2,3,-1',
      '1,2,2,0',
      '-1,-2,0,-2',
    ],
    8
  ]
]
for (let [input, expected] of testInputs) {
  let actual = countConstellations(input);
  if (actual !== expected) {
    console.log(`test 1 failed: expected ${expected} got ${actual}`);
    process.exit();
  }
}
let realInput = fs.readFileSync('./Day25-input.txt', 'utf8').split('\n');
let realCount = countConstellations(realInput, print=true);
console.log(`Step one: ${realCount}`);
