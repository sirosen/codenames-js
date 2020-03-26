// js doesn't have a seedable PRNG, so roll our own
// use mulberry32 because it's the simplest one
//
// original C: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
// CC License 1.0, Copyright Tommy Ettinger, 2017
function mulberry32(state) {
  return function() {
    var z = state += 0x6D2B79F5;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ z >>> 14) >>> 0);
  }
}

const LIMIT = 25;

function loadAllNouns(callback) {
    var parsed;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/assets/nouns.txt", true);
    req.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
          parsed = xhr.responseText.split("\n");
        }
        else {
          parsed = ["ERROR"];
        }
      }
      callback(parsed);
    }
    xhr.send();
}
function loadNouns(seed, callback) {
  loadNouns(function(nounlist) {
    var prng = mulberry32(seed);
    // Fisher-Yates shuffle + slice to guarantee non-repetition
    var arr = nounlist.slice(0);
    var len = nounlist.length;
    for (var i = 0; i < LIMIT; i++) {
      var rand_index = ((i + 1) * prng()) % len;
      var tmp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = tmp;
    }
    callback(shuffled.slice(0, LIMIT));
  });
}
function populatePage() {
  var default_seed = Math.floor(Math.random() * 10000);
  var params = (new URL(window.location)).searchParams;
  var seed = params.get("gameID") || default_seed;

  function renderCallback(wordlist) {
    var wordlist_elem = document.getElementById("#wordlist");
    var table = document.createElement("TABLE");
    for (var i = 0; i < LIMIT; i++) {
      var tr = document.createElement("TR");
      var td = document.createElement("TD");
      td.appendChild(document.createTextNode(wordlist[i]));
      tr.appendChild(td);
      table.appendChild(tr);
    }
    wordlist_elem.appendChild(table);
  }

  loadNouns(seed, renderCallback);
}
document.addEventListener('DOMContentLoaded', function() {
  populatePage();
});
