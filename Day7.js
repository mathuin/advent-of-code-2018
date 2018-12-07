// Day 7

const fs = require('fs');

// The Sum of Its Parts

// Step one: given a list of instructions, return the order in which the steps
// must be performed.  In case of ties, go alphabetically.

// Data structure:
// key: step letter
// value: list of step letters that must be done first

function parseInput(filename) {
  let rules = new Map();
  let input = fs.readFileSync(filename, 'utf8').split('\n');
  for (let line of input) {
    let chunks = line.split(/[Ss]tep /);
    if (chunks.length === 1) break;
    let prereq = chunks[1].split(' ')[0];
    let target = chunks[2].split(' ')[0];
    if (!rules.has(prereq)) rules.set(prereq, []);
    if (!rules.has(target)) rules.set(target, []);
    let value = rules.get(target);
    value.push(prereq);
    rules.set(target, value);
  }
  return rules;
}


// Choosing a node means adding it to the output list, removing it from the
// value of all other keys, and removing it from the data structure.

function orderInstructions(rules) {
  let retval = '';
  let newrules = new Map(rules);
  while (newrules.size > 0) {
    let zerolen = [];
    for (let [key, value] of newrules.entries()) {
      if (value.length === 0) zerolen.push(key);
    }
    let chosen = zerolen.sort()[0];
    retval = retval + chosen;
    newrules.delete(chosen);
    for (let [key, value] of newrules.entries()) {
      if (value.includes(chosen)) {
        let newvalue = value.filter(function(e) { return e !== chosen });
        newrules.set(key, newvalue);
      }
    }
  }
  return retval;
}

// For step two, spread the work across a team of size N.  Each step takes
// bump+(letter) seconds (i.e., with a bump of 60, A takes 61, Z take 86).
// How long will the the entire task take?

let times = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F', 6], ['G', 7], ['H', 8], ['I', 9], ['J', 10], ['K', 11], ['L', 12], ['M', 13], ['N', 14], ['O', 15], ['P', 16], ['Q', 17], ['R', 18], ['S', 19], ['T', 20], ['U', 21], ['V', 22], ['W', 23], ['X', 24], ['Y', 25], ['Z', 26]]);

function teamOrder(workers, bump, rules) {
  let retval = 0;
  let team = new Map();
  for (let i = 0; i < workers; i++) team.set(i, ['.', 0]);
  let newrules = new Map(rules);
  let doneyet = false;
  do {
    retval = retval + 1;

    let teamwork = [];
    for (let i = 0; i < workers; i++) {
      let work = team.get(i);
      if (work[1] === 0) {
        teamwork.push('.');
      } else {
        teamwork.push(work[0]);
      }
    }

    for (let i = 0; i < workers; i++) {
      if (team.get(i)[0] === '.') {
        if (newrules.size > 0) {
          let zerolen = [];
          for (let [key, value] of newrules.entries()) {
            if (value.length === 0 && !teamwork.includes(key)) {
              zerolen.push(key);
            }
          }
          if (zerolen.length > 0) {
            let chosen = zerolen.sort()[0];
            let newValue = [chosen, bump + times.get(chosen)];
            team.set(i, newValue);
            teamwork[i] = chosen;
          }
        }
      }
    }

    for (let i = 0; i < workers; i++) {
      let work = team.get(i);
      if (work[1] > 0) {
        work[1] = work[1] - 1;
        if (work[1] === 0) {
          newrules.delete(work[0]);
          for (let [key, value] of newrules.entries()) {
            if (value.includes(work[0])) {
              let newvalue = value.filter(function(e) { return e !== work[0] });
              newrules.set(key, newvalue);
            }
          }
          work[0] = '.';
        }
        team.set(i, work);
      }
    }

    if (newrules.size === 0) {
      doneyet = true;
      for (let i = 0; i < workers; i++) {
        let work = team.get(i);
        if (work[1] > 0) doneyet = false;
      }
    }
  } while (!doneyet);
  return retval;
}

let testInput = parseInput('./Day7-test.txt');
let realInput = parseInput('./Day7-input.txt');

// The test answer to step one is 'CABDFE'.

let testOrder = orderInstructions(testInput);
if (testOrder !== 'CABDFE') {
  console.log(`Test 1 failed: expected 'CABDFE', got ${testOrder}`);
} else {
  console.log(orderInstructions(realInput));
}

// The test answer to step two is 15.

let testTeam = teamOrder(2, 0, testInput);
if (testTeam !== 15) {
  console.log(`Test 2 failed: expected 15, got ${testTeam}`);
} else {
  console.log(teamOrder(5, 60, realInput));
}
