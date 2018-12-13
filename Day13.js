// Day 13

const fs = require('fs');

// Mine Cart Madness

// Puzzle input is tracks with carts.
// At intersections, carts turn: left, straight, right.
// Carts move one step at a time, starting with top row, left to right.

// Data structures:
// track: map(coords => piece)
// carts: map(location => [direction, turns])
//    NB: north = 0, east = 1, south = 2, west = 3
// crashes: list of crash locations
function parseInput(filename) {
  let track = new Map();
  let carts = new Map();
  let lines = fs.readFileSync(filename, 'utf8').split('\n');
  let y = 0;
  for (let line of lines) {
    let chars = line.split('');
    let x = 0;
    for (let char of chars) {
      switch(char) {
        case ' ':
          break;
        case '/':
        case '|':
        case '\\':
        case '-':
        case '+':
          track.set(String([x, y]), char);
          break;
        case '<':
          carts.set(String([x, y]), [3, 0]);
          track.set(String([x, y]), '-');
          break;
        case '>':
          carts.set(String([x, y]), [1, 0]);
          track.set(String([x, y]), '-');
          break;
        case '^':
          carts.set(String([x, y]), [0, 0]);
          track.set(String([x, y]), '|');
          break;
        case 'v':
          carts.set(String([x, y]), [2, 0]);
          track.set(String([x, y]), '|');
          break;
        default:
          console.log(`Unexpected value "${char}" found at ${x}, ${y}!`);
          process.exit();
      }
      x += 1;
    }
    y += 1;
  }
  return [track, carts];
}

// Two-dimensional sort for carts.
function sortCarts(a, b) {
  var ac = a[0].split(',');
  var bc = b[0].split(',');
  var ax = parseInt(ac[0], 10);
  var ay = parseInt(ac[1], 10);
  var bx = parseInt(bc[0], 10);
  var by = parseInt(bc[1], 10);
  if (ax === bx) {
    return ay - by;
  } else {
    return ax - bx;
  }
}

// At intersections, carts turn left, straight, right.
var trackTurns = [['\\', '|', '/'], ['/', '-', '\\'], ['\\', '|', '/'], ['/', '-', '\\']];
var moveDir = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// Carts move one step at a time, starting with top row, left to right.
// When one cart moves into the space of another cart, it crashes.
function processTick(input, cartCount=1) {
  var track = input[0];
  var carts = input[1];
  var crashes = [];
  while (carts.size > cartCount) {
    var sortedCarts = new Map([...carts.entries()].sort(sortCarts));
    var carts = new Map();
    for (let [key, value] of sortedCarts.entries()) {
      sortedCarts.delete(key);
      let oldCoords = key.split(',');
      let x = parseInt(oldCoords[0], 10);
      let y = parseInt(oldCoords[1], 10);
      let dir = value[0];
      let turns = value[1];

      let dirMove = moveDir[dir];
      let coords = String([x + dirMove[0], y + dirMove[1]]);

      // collision detection
      if (sortedCarts.has(coords) || carts.has(coords)) {
        sortedCarts.delete(coords);
        carts.delete(coords);
        crashes.push(coords);
        continue;
      }

      // continue processing
      let nextTrack = track.get(coords);
      let dirTurns = trackTurns[dir];
      if (dirTurns.includes(nextTrack)) {
        dir += (dirTurns.indexOf(nextTrack) - 1);
      } else { // better be an intersection!
        dir += (turns - 1);
        turns++;
      }
      carts.set(coords, [(dir + 4) % 4, (turns + 3) % 3]);
    }
  }
  let cartLocs = [];
  for (let cartLoc of carts.keys()) {
    cartLocs.push(cartLoc);
  }
  return [crashes, cartLocs];
}

// Step one: the location of the first crash.

// The test answer to step one is 7,3.
let testInput = parseInput('./Day13-test1.txt');
let testCrash = processTick(testInput, testInput[1].size-1);
if (testCrash[0][0] !== '7,3') {
  console.log(`Test 1 failed: expected '7,3', got ${testCrash[0][0]}!`);
  process.exit();
}

let realInput = parseInput('./Day13-input.txt');
let realCrash = processTick(realInput, realInput[1].size-1);
console.log(realCrash[0][0]);

// Step two: the location of the last cart.

// The test answer to step two is 6,4.
let testInput2 = parseInput('./Day13-test2.txt');
let testCrash2 = processTick(testInput2, 1);
if (testCrash2[1][0] !== '6,4') {
  console.log(`Test 2 failed: expected '6,4', got ${testCrash2[1][0]}!`);
  process.exit();
}

let realCrash2 = processTick(realInput, 1);
console.log(realCrash2[1][0]);
