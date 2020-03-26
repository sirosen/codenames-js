// js doesn't have a seedable PRNG, so roll our own
// use mulberry32 because it's the simplest one
//
// original C: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
// CC License 1.0, Copyright Tommy Ettinger, 2017
function mulberry32(state) {
  return function() {
    state = state + 0x6D2B79F5 | 0;
    var z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z = z ^ (z + Math.imul(z ^ (z >>> 7), z | 61));
    return ((z ^ z >>> 14) >>> 0) / 4294967296;
  }
}

const LIMIT = 25;

function loadAllNouns(callback) {
    var parsed;
    var url = window.location.protocol + "//" + window.location.host  + window.location.pathname + "assets/nouns.txt";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 0 || xhr.status == 200) {
          parsed = xhr.responseText.split("\n");
        }
        else {
          parsed = ["ERROR"];
        }
        callback(parsed);
      }
    }
    xhr.send();
}
function loadNouns(seed, callback) {
  loadAllNouns(function(nounlist) {
    var prng = mulberry32(seed);
    // shuffle + slice to guarantee non-repetition
    var len = nounlist.length;
    for (var i = 0; i < len; i++) {
      var rand_index = Math.floor((i + 1) * prng());
      var tmp = nounlist[rand_index];
      nounlist[rand_index] = nounlist[i];
      nounlist[i] = tmp;
    }
    var result = nounlist.slice(0, LIMIT);
    console.log("result: " + result.toString());
    callback(result);
  });
}
function populatePage() {
  var default_seed = Math.floor(Math.random() * 10000);
  var params = (new URL(window.location)).searchParams;
  var seed = params.get("gameID") || default_seed;

  function renderCallback(wordlist) {
    var target = document.getElementById("wordList");
    var table = document.createElement("TABLE");
    for (var i = 0; i < 5; i++) {
      var tr = document.createElement("TR");
      for (var j = 0; j < 5; j++) {
        var idx = 5 * i + j;
        var td = document.createElement("TD");
        td.appendChild(document.createTextNode(wordlist[idx]));
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    target.appendChild(table);
  }

  loadNouns(seed, renderCallback);
}
document.addEventListener('DOMContentLoaded', function() {
  populatePage();
});
