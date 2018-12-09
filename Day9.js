// Day 9

const fs = require('fs');

// Marble Mania

// This puzzle includes the expected results in the test file.

function parseInput(filename) {
  let retval = [];
  let rows = fs.readFileSync(filename, 'utf8').split('\n');
  for (let row of rows) {
    let elem = [];
    let words = row.split(' ');
    if (words.length === 8) {
      elem = [words[0], words[6]];
    } else if (words.length === 12) {
      elem = [words[0], words[6], words[11]];
    } else {
      break;
    }
    retval.push(elem);
  }
  return retval;
}

// Notes on the puzzle:
// A "current marble" must be tracked, as must scores for players.
// Marbles can be added, but only between marbles that are 1 and 2 marbles
// cw of the current marble.  The placed marble becomes the current
// marble.
// Marbles can be removed, but only the marble 7 marbles ccw from
// the current marble.  When this happens, the marble immediately cw
// from the removed marble becomes the new current marble.

const Marble = function(ccw) {
  const marble = {};
  if (ccw === 0) {
    marble.cw = marble;
    marble.ccw = marble;
  } else {
    let cw = ccw.cw;
    marble.ccw = ccw;
    marble.cw = cw;
    ccw.cw = marble;
    cw.ccw = marble;
  }
  marble.player = -1;
  marble.score = function(player) {
    let cw = marble.cw;
    let ccw = marble.ccw;
    cw.ccw = marble.ccw;
    ccw.cw = marble.cw;
    marble.cw = marble;
    marble.ccw = marble;
    marble.player = player;
  }
  return marble;
}

const Circle = function(numPlayers) {
  const circle = {};
  circle.numPlayers = numPlayers;
  circle.currentPlayer = -1;
  circle.marbles = [Marble(0)];
  circle.currentMarble = circle.marbles[0];

  circle.marbleIdx = function(marble) {
    let idx = circle.marbles.indexOf(marble);
    if (idx === -1) {
      console.log('oh no');
    }
    return idx;
  }

  circle.appendMarble = function(marble) {
    let idx = circle.marbleIdx(marble);
    if (marble === circle.currentMarble) {
      return `(${idx}) `;
    } else {
      return ` ${idx}  `;
    }
  }

  circle.print = function() {
    let firstMarble = circle.marbles[0];
    let retval = `[${circle.currentPlayer+1}] ${circle.appendMarble(firstMarble)}`;
    for (let marble = firstMarble.cw; marble != firstMarble; marble = marble.cw) {
      retval += circle.appendMarble(marble);
    }
    console.log(retval);
  }

  circle.addMarble = function() {
    circle.currentPlayer = (circle.currentPlayer + 1) % circle.numPlayers;
    let nextMarble = circle.marbles.length;
    if (nextMarble % 23 === 0) {
      let newMarble = Marble(0);
      newMarble.score(circle.currentPlayer);
      circle.marbles.push(newMarble);
      let sevenMarble = circle.currentMarble.ccw.ccw.ccw.ccw.ccw.ccw.ccw;
      circle.currentMarble = sevenMarble.cw;
      sevenMarble.score(circle.currentPlayer);
    } else {
      let ccw = circle.currentMarble.cw;
      let newMarble = Marble(ccw);
      circle.marbles.push(newMarble);
      circle.currentMarble = circle.marbles[circle.marbles.length-1];
    }
  }

  circle.score = function() {
    let scores = []
    for (let i = 0; i < circle.numPlayers; i++) {
      scores.push(0);
    }
    for (let i = 0; i < circle.marbles.length; i++) {
      let player = circle.marbles[i].player;
      if (player !== -1) {
        scores[player] = scores[player] + i;
      }
    }
    return Math.max.apply(null, scores);
  }

  return circle;
}

// For games without expected results, return the final score.
// For games with expected results, return true only if all games have final
// scores equal to expected results.

function winningScore(listGames) {
  for (let game of listGames) {
    let numPlayers = game[0];
    let lastMarble = game[1];

    let circle = Circle(numPlayers);
    for (let m = 1; m <= lastMarble; m++) {
      circle.addMarble();
    }

    let finalScore = circle.score();

    if (game.length === 3) {
      if (finalScore !== parseInt(game[2], 10)) {
        console.log(`expected ${game[2]}, got ${finalScore}`);
        return false;
      }
    } else {
      return finalScore;
    }
  }
  return true;
}

// The puzzle had a few test runs with expected outputs.

let testInput = parseInput('./Day9-test.txt');
let realInput = parseInput('./Day9-input.txt');

if (!winningScore(testInput)) {
  console.log(`Tests failed!`);
} else {
  console.log(winningScore(realInput))
}

// Part two had no tests.  It's the same input, but with the number of marbles
// multiplied by 100.

let realInput2 = realInput.slice();
let oldLastMarble = realInput2[0][1];
realInput2[0][1] = oldLastMarble * 100;
console.log(winningScore(realInput2));
