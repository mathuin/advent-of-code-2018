// Day 3

const fs = require('fs');

// No Matter How You Slice It

// Input: a set of claims in the following format:
// #123 @ 3,2: 5x4
// (claim id, from left, from top, width, tall)

// Parse claims from file.

function parseClaims(filename) {
  let lines = fs.readFileSync(filename, 'utf8').split('\n');
  let grid = new Map();
  for (let i = 0, len = lines.length; i < len - 1; i++) {
    let words = lines[i].split(' ');
    let coords = words[2].split(',');
    let dims = words[3].split('x');
    let claim = [words[0], parseInt(coords[0], 10), parseInt(coords[1], 10), parseInt(dims[0], 10), parseInt(dims[1], 10)];
    for (let j = 0; j < claim[3]; j++) {
      for (let k = 0; k < claim[4]; k++) {
        let point = String([j + claim[1], k + claim[2]]);
        if (!grid.has(point)) {
          grid.set(point, []);
        }
        let old = grid.get(point);
        old.push(claim[0]);
        grid.set(point, old);
      }
    }
  }
  return grid;
}

// How many square inches of fabric are within two or more claims?

function countOverlap(grid) {
  let overlap = 0;
  for (let elem of grid.values()) {
    if (elem.length > 1) overlap++;
  }
  return overlap;
}

// Which claim does not overlap?

function findClearClaim(grid) {
  let candidates = new Set();
  for (let value of grid.values()) {
    if (value.length === 1) {
      candidates.add(String(value));
    }
  }
  for (let value of grid.values()) {
    if (value.length !== 1) {
      for (let candidate of value) {
        candidates.delete(String(candidate));
      }
    }
  }
  // This *should* have only one entry!
  return candidates.values().next().value;
}

// The test file has only 4 square inches of overlap.

let testGrid = parseClaims('./Day3-test.txt');
let realGrid = parseClaims('./Day3-input.txt');
if (countOverlap(testGrid) !== 4) {
  console.log(`Test 1 failed: expected 4, got ${countOverlap(testGrid)}`);
} else {
  console.log(countOverlap(realGrid));
}

// The test file only has one non-overlapping claim.

if (findClearClaim(testGrid) !== "#3") {
  console.log(`Test 2 failed: expected "#3", got ${findClearClaim(testGrid)}`)
} else {
  console.log(findClearClaim(realGrid));
}
