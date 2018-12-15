// Day 14

const fs = require('fs');

// Chocolate Charts

// There are two elves, with current recipes of [3, 7].
// New recipes are created from the digits of the sum of the two current
// recipes.  [3, 7] becomes [3, 7, 1, 0] as 3+7=10. [2, 3] becomes [2, 3, 5].
// Each elf picks a new recipe, which is (1+current) steps ahead.  For
// [3, 7, 1, 0], the first elf chooses 4 step ahead (so back at 3), and the
// second elf chooses 8 steps ahead (so back at 7).

function printRecipes(recipes, elves) {
  let recipeList = recipes;
  let header = '    ';
  if (recipes.length > 20) {
    recipeList = recipes.slice(-20);
    header = '... ';
  }
  process.stdout.write(header);
  for (var i = 0; i < recipeList.length; i++) {
    var chars = '  ';
    if (i === elves[0]) {
      chars = '()';
    } else if (i === elves[1]) {
      chars = '[]';
    }
    process.stdout.write(chars[0] + recipeList[i] + chars[1]);
  }
  process.stdout.write('\n');
}

function stepRecipes(recipes, elves, count=1) {
  for (var c = 0; c < count; c++) {
    var sum = elves.reduce((a, b) => a + recipes[b], 0);
    recipes.push(...String(sum).split('').map(Number));
    for (var i = 0; i < elves.length; i++) {
      var forward = (elves[i] + 1 + recipes[elves[i]]) % recipes.length
      elves[i] = forward;
    }
  }
  return [recipes, elves];
}

// Step one: what are the scores of the ten recipes immediately following the input recipe.
function topTenFollowing(numRecipes) {
  var recipes = [3, 7];
  var elves = [0, 1];
  var scored = 10;
  while (recipes.length < numRecipes+scored) {
    [recipes, elves] = stepRecipes(recipes, elves);
  }
  let retval = '';
  for (let i = 0; i < scored; i++) {
    retval += String(recipes[numRecipes+i]);
  }
  return retval;
}

// Step two: how many recipes are on the scoreboard to the left of the first
// recipes whose scores are the digits from your puzzle input.
function indexOfMatch(pattern) {
  var recipes = [3, 7];
  var elves = [0, 1];
  var expected = pattern.split('').join(',');
  for (var i = -1; i === -1; i = recipes.toString().indexOf(expected)) {
    [recipes, elves] = stepRecipes(recipes, elves, 100000);
  }
  return recipes.toString().indexOf(expected)/2;
}

let testInput = fs.readFileSync('./Day14-test1.txt', 'utf8').split('\n');
for (let line of testInput) {
  let [recipes, expected] = line.split(' ');
  if (!recipes) break;
  let actual = topTenFollowing(parseInt(recipes, 10));
  if (actual !== expected) {
    console.log(`Test 1 failed: expected ${expected}, actual ${actual}`);
    process.exit();
  }
}

let realInput = 323081;
console.log(topTenFollowing(realInput));

let testInput2 = fs.readFileSync('./Day14-test2.txt', 'utf8').split('\n');
for (let line of testInput2) {
  let [pattern, expected] = line.split(' ');
  if (!pattern) break;
  let actual = indexOfMatch(pattern);
  if (actual !== parseInt(expected, 10)) {
    console.log(`Test 2 failed: expected ${expected}, actual ${actual}`);
    process.exit();
  }
}

let realInput2 = '323081';
console.log(indexOfMatch(realInput2));
