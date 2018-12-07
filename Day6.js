// Day 6

const fs = require('fs');

// Chronal Coordinates

// Using Manhattan distance, determine area around each coordinate
// that is closest to that coordinate and no other (no ties either).

function manhattanDistance(a, b) {
  return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
}

function parseInput(filename) {
  let input = fs.readFileSync(filename, 'utf8').split('\n');
  let xmin = 999, ymin = 999, xmax = 0, ymax = 0;
  let points = [];
  for (let row of input) {
    let raw = row.split(', ');
    let coords = [parseInt(raw[0], 10), parseInt(raw[1], 10)];
    if (isNaN(coords[0])) break;
    if (coords[0] < xmin) xmin = coords[0];
    if (coords[0] > xmax) xmax = coords[0];
    if (coords[1] < ymin) ymin = coords[1];
    if (coords[1] > ymax) ymax = coords[1];
    points.push(coords);
  }

  let grid = new Map();
  for (let i = xmin; i <= xmax; i++) {
    for (let j = ymin; j <= ymax; j++) {
	    let gridKey = [i, j];
	    let gridVal = new Map();
	    for (let point of points) {
        let dist = manhattanDistance(gridKey, point);
        gridVal.set(point, dist);
	    }
	    grid.set(String(gridKey), gridVal);
    }
  }

  return [ points, xmin, xmax, ymin, ymax, grid ];
}

// Return the point which is closest to the current map element.

function closestPoint(gridValue) {
  let shortestDistance = 99999;
  let closestPt = '';
  for (let [key, value] of gridValue.entries()) {
    if (shortestDistance === value) {
      closestPt = '.';
    } else if (shortestDistance > value) {
	    shortestDistance = value;
	    closestPt = key;
	  }
  }
  return String(closestPt);
}

function largestArea(input) {
  let points = input[0];
  let xmin = input[1];
  let xmax = input[2];
  let ymin = input[3];
  let ymax = input[4];
  let grid = input[5];

  let skipList = [];
  for (let i = xmin; i <= xmax; i++) {
    for (let j = ymin; j <= ymax; j++) {
      if (i === xmin || i === xmax || j === ymin || j === ymax) {
        let edgeKey = String([i, j]);
        let gridValue = grid.get(edgeKey);
        let edgePoint = closestPoint(gridValue);
        if (edgePoint !== '.' && !skipList.includes(edgePoint)) {
          skipList.push(edgePoint);
        }
	    }
    }
  }

  let area = new Map();
  for (let [key, value] of grid.entries()) {
    let closestPt = closestPoint(value);
    if (closestPt !== '.' && !skipList.includes(closestPt)) {
      if (!area.has(closestPt)) {
        area.set(closestPt, 0);
      }
      let currArea = area.get(closestPt);
      currArea++;
      area.set(closestPt, currArea);
    }
  }

  let largest = 0;
  for (let value of area.values()) {
    if (largest < value) {
      largest = value;
    }
  }
  return largest;
}

// What is the size of the region containing all locations which have a total
// distance to all given coordinates of less than N?

function regionSize(input, maxDist) {
  let points = input[0];
  let xmin = input[1];
  let xmax = input[2];
  let ymin = input[3];
  let ymax = input[4];
  let grid = input[5];

  let size = 0;
  for (let gridValue of grid.values()) {
    let totDist = 0;
    for (let ptDist of gridValue.values()) {
      totDist = totDist + ptDist;
    }
    if (totDist < maxDist) {
      size++;
    }
  }
  return size;
}

let testInput = parseInput('./Day6-test.txt');
let realInput = parseInput('./Day6-input.txt');

if (largestArea(testInput) !== 17) {
  console.log(`Test 1 failed: expected 17, got ${largestArea(testInput)}`);
} else {
  console.log(largestArea(realInput));
}

if (regionSize(testInput, 32) !== 16) {
  console.log(`Test 2 failed: expected 16, got ${regionSize(testInput, 32)}`);
} else {
  console.log(regionSize(realInput, 10000));
}
