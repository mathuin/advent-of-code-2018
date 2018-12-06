// Day 5

const fs = require('fs');

// Alchemical Reduction

// Input: a polymer with monomers represented by single letters.

// Step one: remove all pairs of lower-capital letters that are the same.
// (i.e., aaABbc -> a(aA)(Bb)c -> ac) and return the length.

function stripCommon(polymer) {
    let poly = polymer;
    let common = /aA|bB|cC|dD|eE|fF|gG|hH|iI|jJ|kK|lL|mM|nN|oO|pP|qQ|rR|sS|tT|uU|vV|wW|xX|yY|zZ|Aa|Bb|Cc|Dd|Ee|Ff|Gg|Hh|Ii|Jj|Kk|Ll|Mm|Nn|Oo|Pp|Qq|Rr|Ss|Tt|Uu|Vv|Ww|Xx|Yy|Zz/g;
    while (true) {
    	let newpoly = poly.split(common).join('');
    	if (newpoly === poly) break;
	poly = newpoly;
    }
    return poly.length;
}

// Step two: which unit's removal results in the most reducible subset?

function shortestSubset(polymer) {
    let letters = [ /a/gi, /b/gi, /c/gi, /d/gi, /e/gi, /f/gi, /g/gi, /h/gi, /i/gi, /j/gi, /k/gi, /l/gi, /m/gi, /n/gi, /o/gi, /p/gi, /q/gi, /r/gi, /s/gi, /t/gi, /u/gi, /v/gi, /w/gi, /x/gi, /y/gi, /z/gi ];
    let shortest = polymer.length;
    for (letter of letters) {
	let newpoly = polymer.split(letter).join('');
	let newlen = stripCommon(newpoly);
	if (newlen < shortest) {
	    shortest = newlen;
	}
    }
    return shortest;
}


let testPoly = fs.readFileSync('./Day5-test.txt', 'utf8').split('\n')[0];
let realPoly = fs.readFileSync('./Day5-input.txt', 'utf8').split('\n')[0];

// Test for step 1 should equal 10, for step 2 should equal 4.

if (stripCommon(testPoly) !== 10) {
    console.log(`Test 1 failed: expected 10,  got ${stripCommon(testPoly)}`);
} else {
    console.log(stripCommon(realPoly));
}

if (shortestSubset(testPoly) !== 4) {
    console.log(`Test 2 failed: expected 4,  got ${shortestSubset(testPoly)}`);
} else {
    console.log(shortestSubset(realPoly));
}

