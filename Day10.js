// Day 10

const fs = require('fs');

// The Stars Align

// The input files are a collection of positions and velocities.

// The test input makes the message "HI".

// I think the exiting condition should be the smallest grouping of stars,
// defined as having the smallest height and smallest width.  Once they start
// getting *bigger*, display the previous array.

function parseInput(filename) {
  let stars = [];
  let input = fs.readFileSync(filename, 'utf8').split('\n');
  for (let line of input) {
    let coords = line.split(/[a-z]*=|[<>,]/);
    if (coords.length === 1) break;
    stars.push([[parseInt(coords[2]), parseInt(coords[3])], [parseInt(coords[6]), parseInt(coords[7])]]);
  }
  return stars;
}

function fieldExtremes(stars) {
  let firstPos = stars[0][0];
  let edges = [ firstPos[0], firstPos[1], firstPos[0], firstPos[1] ];
  for (let star of stars) {
    let pos = star[0];
    if (pos[0] < edges[0]) edges[0] = pos[0];
    if (pos[1] < edges[1]) edges[1] = pos[1];
    if (pos[0] > edges[2]) edges[2] = pos[0];
    if (pos[1] > edges[3]) edges[3] = pos[1];
  }
  return edges;
}

function fieldSize(stars) {
  let edges = fieldExtremes(stars);
  return (edges[2]-edges[0])*(edges[3]-edges[1]);
}

function modelStars(stars) {
  let secs = 0;
  for (let oldSize = fieldSize(stars), newSize = oldSize - 1; newSize < oldSize; oldSize = newSize, newSize = fieldSize(stars)) {
    secs++;
    for (let star of stars) {
      let pos = star[0], vel = star[1];
      pos[0] += vel[0];
      pos[1] += vel[1];
    }
  }
  // now unwind once
  secs--;
  for (let star of stars) {
    let pos = star[0], vel = star[1];
    pos[0] -= vel[0];
    pos[1] -= vel[1];
  }
  console.log(`${secs} seconds to wait.`);
  return stars;
}

function displayStars(stars) {
  let edges = fieldExtremes(stars);
  let points = [];
  for (let star of stars) {
    points.push(String(star[0]));
  }
  for (let y = edges[1]; y <= edges[3]; y++) {
    for (let x = edges[0]; x <= edges[2]; x++) {
      if (points.includes(String([x, y]))) {
        process.stdout.write("*");
      } else {
        process.stdout.write(".");
      }
    }
    process.stdout.write("\n");
  }
}

let testInput = parseInput('./Day10-test.txt');
let testStars = modelStars(testInput);
displayStars(testStars);

let realInput = parseInput('./Day10-input.txt');
let realStars = modelStars(realInput);
displayStars(realStars);
