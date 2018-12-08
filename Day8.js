// Day 8

const fs = require('fs');
const util = require('util');

// Memory Maneuver

// License file is a list of numbers which define a data structure which
// produces a tree to calculate the license number.
// Tree is made of up of nodes: a root, and the others.
// Node has header (two numbers, quantity of child nodes and quantity of
// metadata entries), zero or more child nodes, one or more metadata entries.

// Recursion!

function buildTree(listNum, idx, parent) {
  let retval = {parent: parent, children: [], metadata: []};
  let numChild = listNum[idx++];
  let numMeta = listNum[idx++];
  for (let i = 0; i < numChild; i++) {
    let ci = buildTree(listNum, idx, retval);
    retval.children.push(ci[0]);
    idx = ci[1];
  }
  for (let i = 0; i < numMeta; i++) {
    let meta = parseInt(listNum[idx++]);
    retval.metadata.push(meta);
  }
  return [retval, idx];
}

// What is the sum of all metadata entries?

function sumMetadata(tree) {
  let retval = 0;
  for (let child of tree.children) {
    retval = retval + sumMetadata(child);
  }
  for (let meta of tree.metadata) {
    retval = retval + meta;
  }
  return retval;
}

// What is the value of the root node?
// Node value is defined for no-child nodes as the sum of its metadata.
// For nodes with children, it's the sum of the child nodes referenced by the
// metadata.  Metadata values of 0 or which reference nonexistent nodes are
// skipped.  Duplicate references are okay.

function nodeValue(tree) {
  let retval = 0;
  let children = tree.children;
  let metadata = tree.metadata;

  if (tree.children.length === 0) {
    retval = sumMetadata(tree);
  } else {
    for (let meta of metadata) {
      if (meta > children.length || meta === 0) continue;
      let step = children[meta-1];
      retval = retval + nodeValue(step);
    }
  }
  return retval;
}

let testInput = fs.readFileSync('./Day8-test.txt', 'utf8').split('\n')[0].split(' ');
let testTreeOut = buildTree(testInput, 0, '');
let testTree = testTreeOut[0];

let realInput = fs.readFileSync('./Day8-input.txt', 'utf8').split('\n')[0].split(' ');
let realTreeOut = buildTree(realInput, 0, '');
let realTree = realTreeOut[0];

// The test answer to step one is 138.

let testMetaSum = sumMetadata(testTree);
if (testMetaSum !== 138) {
  console.log(`Test 1 failed: expected 138, got ${testMetaSum}`);
} else {
  console.log(sumMetadata(realTree));
}

// The test answer to step two is 66.

let testNodeValue = nodeValue(testTree);
if (testNodeValue !== 66) {
  console.log(`Test 2 failed: expected 66, got ${testNodeValue}`);
} else {
  console.log(nodeValue(realTree));
}
