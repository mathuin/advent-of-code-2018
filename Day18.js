// Day 18

const fs = require('fs');

// Settlers of the North Pole

// Puzzle input is a grid:
// - open ground (.)
// - trees (|)
// - lumberyard (#)

function buildGrid(filename) {
  let lines = fs.readFileSync(filename, 'utf8').split('\n');
  let grid = new Map();

  lines.forEach(function (line, y) {
    line.split('').forEach(function (char, x) {
      grid.set(String([x, y]), char);
    });
  });
  return grid;
}

function printGrid(grid) {
  let [maxx, maxy] = Array.from(grid)[grid.size-1][0].split(',').map(Number);

  for (let y = 0; y <= maxy; y++) {
    for (let x = 0; x <= maxx; x++) {
      process.stdout.write(grid.get(String([x, y])));
    }
    process.stdout.write('\n');
  }
}

// Step one: after ten iterations of "the rules", what is the product of the
// number of wooded acres and the number of lumberyards?
function afterTen(grid) {
  for (let i = 0; i < 10; i++) {
    let newGrid = new Map();
    grid.forEach((value, key, map) => {
      let [x, y] = key.split(',').map(Number);
      let neighbors = [[x+1, y+1], [x, y+1], [x-1, y+1], [x+1, y], [x-1, y], [x+1, y-1], [x, y-1], [x-1, y-1], ].map(String);
      let counts = {};
      [...grid.entries()].filter(e => (-1 !== neighbors.indexOf(e[0]))).map(v => counts[v[1]] = counts[v[1]] ? counts[v[1]] + 1 : 1);
      switch(value) {
        case '.':
          newGrid.set(key, (counts['|']>2) ? '|' : '.');
          break;
        case '|':
          newGrid.set(key, (counts['#']>2) ? '#' : '|');
          break;
        case '#':
          newGrid.set(key, (counts['#'] && counts['|']) ? '#' : '.');
          break;
      }
    });
    grid = new Map(newGrid);
  }
  let counts = {};
  [...grid.values()].map(v => counts[v] = counts[v] ? counts[v] + 1 : 1);
  return counts['|']*counts['#'];
}

// Step two: what about 1000000000?
function afterMany(grid) {
  let results = [];
  let top = 1000000000;
  for (let i = 0; i < top; i++) {
    let newGrid = new Map();
    grid.forEach((value, key, map) => {
      let [x, y] = key.split(',').map(Number);
      let neighbors = [[x+1, y+1], [x, y+1], [x-1, y+1], [x+1, y], [x-1, y], [x+1, y-1], [x, y-1], [x-1, y-1], ].map(String);
      let counts = {};
      [...grid.entries()].filter(e => (-1 !== neighbors.indexOf(e[0]))).map(v => counts[v[1]] = counts[v[1]] ? counts[v[1]] + 1 : 1);
      switch(value) {
        case '.':
          newGrid.set(key, (counts['|']>2) ? '|' : '.');
          break;
        case '|':
          newGrid.set(key, (counts['#']>2) ? '#' : '|');
          break;
        case '#':
          newGrid.set(key, (counts['#'] && counts['|']) ? '#' : '.');
          break;
      }
    });
    grid = new Map(newGrid);
    let counts = {};
    [...grid.values()].map(v => counts[v] = counts[v] ? counts[v] + 1 : 1);
    let result = counts['|']*counts['#'];
    console.log(`Iteration ${i+1}: ${result}`);
    let previous = results.indexOf(result);
    if (previous !== -1) {
      // first dupe
      let cycle = i - previous;
      console.log(`Result ${results} at iteration ${i+1} seen at iteration ${previous+1} - cycle of ${i-previous}`)
      return results[previous + ((top - previous) % cycle)];
    } else {
      results.push[result];
    }
  }
}



let testGrid = buildGrid('Day18-test.txt');
let testResult = afterTen(testGrid);
if (testResult !== 1147) {
  console.log(`test 1 failed: expected 1147, got ${testResult}`);
  process.exit();
}
let realGrid = buildGrid('Day18-input.txt');
console.log(afterTen(realGrid));
console.log(afterMany(realGrid));
