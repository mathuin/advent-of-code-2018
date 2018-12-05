// Day 4

const fs = require('fs');

// Repose Record

// Records in the file have a header: [yyyy-mm-dd hh:mm]
// There are three types of records: shift-begins, falls-asleep, wakes-up
// Complete sets: shift-begins [falls-asleep wakes-up]*
// Shifts can begin before midnight.
// Midnight hour is only relevant time for sleep.
// Guards are asleep the minute of falls-asleep, awake the minute of wakes-up.


// 1518 was not a leap year!
let monlen = { 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 };

function mkGuardMap(filename) {
    let input = fs.readFileSync(filename, 'utf8').split('\n');
    // build dateMap
    // key: date in month-day format
    // value: sorted list of [minute, token]
    // where token is guard number, 'asleep', or 'up'.
    let dateMap = new Map();
    for (let i = 0, len = input.length; i < len - 1; i++) {
	let pieces = input[i].split(/[\]\[: -]/);
	// [ '', '1518', '11', '01', '00', '05', '', 'falls', 'asleep' ]
	let mon = parseInt(pieces[2], 10);
	let day = parseInt(pieces[3], 10);
	let hour = parseInt(pieces[4], 10);
	let min = pieces[5];
	let token = pieces[8];
	// Handle shifts that begin before midnight.
	if (hour !== 0) {
	    hour = 0;
	    min = "0"; // sorts before "00"
	    // Handle month rollover.
	    if (day === monlen[mon]) {
		day = 1;
		mon = mon + 1;
	    } else {
		day = day + 1;
	    }
	}
	let dateKey = mon + '-' + day;
	if (!dateMap.has(dateKey)) {
	    let add = new Map();
	    dateMap.set(dateKey, add);
	}
	let value = dateMap.get(dateKey);
	if (!value.has(min)) {
	    let add = [];
	    value.set(min, add);
	}
	let old = value.get(min);
	old.push(token);
	value.set(min, old);
	let sorted = new Map([...value.entries()].sort());
	dateMap.set(dateKey, sorted);
    }

    // Transform dateMap into guardMap
    // key: guard
    // value: list of minutes asleep
    let guardMap = new Map();
    for (let date of dateMap.values()) {
	let de = date.entries()
	let guardKey = parseInt(de.next().value[1][0].substring(1), 10);
	if (!guardMap.has(guardKey)) {
	    let add = [];
	    guardMap.set(guardKey, add);
	}
	for (let r; !(r = de.next()).done; ) {
	    let mins = guardMap.get(guardKey);
	    for (let sleep = parseInt(r.value[0], 10), stop = parseInt(de.next().value[0], 10); sleep < stop; sleep++) {
		mins.push(sleep);
	    }
	    guardMap.set(guardKey, mins);
	}
    }
    return guardMap;
}

// https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
function mode(arr){
    return arr.sort((a,b) =>
		    arr.filter(v => v===a).length
		    - arr.filter(v => v===b).length
		   ).pop();
}

// Step one: return product of which guard spends the most minutes asleep and
// which minute are they asleep the most often.

function mkProductOne(guardMap) {
    let guard = 0;
    let mostmin = 0;
    for (let [key, value] of guardMap.entries()) {
	if (value.length > mostmin) {
	    mostmin = value.length;
	    guard = key;
	}
    }
    let mins = guardMap.get(guard);
    return guard * mode(mins);
}

// Step two: return product of which guard is most frequently asleep on the
// same minute with that minute.

function mkProductTwo(guardMap) {
    let guard = 0;
    let freqMin = 0;
    let freqVal = 0;
    for (let [key, value] of guardMap.entries()) {
	let minArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (let min of value) {
	    minArr[min]++;
	}
	let maxMin = minArr.indexOf(Math.max(...minArr));
	if (minArr[maxMin] > freqVal) {
	    freqVal = minArr[maxMin];
	    freqMin = maxMin;
	    guard = key;
	}
    }
    return guard * freqMin;
}

// Step one's test answer is 240 (guard 10, minute 24)

let testMap = mkGuardMap('./Day4-test.txt');
let realMap = mkGuardMap('./Day4-input.txt');

if (mkProductOne(testMap) !== 240) {
    console.log(`Test 1 failed: expected 240, got ${mkProductOne(testMap)}`);
} else {
    console.log(mkProductOne(realMap));
}

// Step two's test answer is 4455 (guard 99, minute 45)

if (mkProductTwo(testMap) !== 4455) {
    console.log(`Test 1 failed: expected 4455, got ${mkProductTwo(testMap)}`);
} else {
    console.log(mkProductTwo(realMap));
}

