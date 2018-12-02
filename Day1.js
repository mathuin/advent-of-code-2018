// Day 1

const fs = require('fs');

// Chronal Calibration

// given a list of frequencies, calculate the final frequency.
let freqs = fs.readFileSync('./Day1-input.txt', 'utf8').split('\n');

// initial frequency is zero.
let freq = 0;

// do it once, get first star
for (let i = 0, len = freqs.length; i < len-1; i++) {
  freq += parseInt(freqs[i], 10);
}

console.log(freq);

// dictionary will identify duplicate frequencies
let freqset = new Set();
let dupfreqs = [];

freq = 0;
while (dupfreqs.length == 0) {
  for (let i = 0, len = freqs.length; i < len-1; i++) {
    if (freqset.has(freq))
      dupfreqs.push(freq);
    freqset.add(freq);
    freq += parseInt(freqs[i], 10);
  }
}

console.log(dupfreqs[0]);
