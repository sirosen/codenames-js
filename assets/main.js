// js doesn't have a seedable PRNG, so roll our own
// use mulberry32 because it's the simplest one
//
// original C: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
// CC License 1.0, Copyright Tommy Ettinger, 2017
function mulberry32(state) {
  return function() {
    state |= 0;
    state = state + 0x6D2B79F5 | 0;
    var z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z = z + (z ^ Math.imul(z ^ (z >>> 7), z | 61));
    return ((z ^ z >>> 14) >>> 0) / 4294967296;
  }
}

const LIMIT = 25;
const WORDS = ["AFRICA", "AGENT", "AIR", "ALIEN", "ALPS", "AMAZON", "AMBULANCE",
"AMERICA", "ANGEL", "ANTARCTICA", "APPLE", "ARM", "ATLANTIS", "AUSTRALIA", "AZTEC",
"BACK", "BALL", "BAND", "BANK", "BAR", "BARK", "BAT", "BATTERY", "BEACH", "BEAR",
"BEAT", "BED", "BEIJING", "BELL", "BELT", "BERLIN", "BERMUDA", "BERRY", "BILL", "BLOCK",
"BOARD", "BOLT", "BOMB", "BOND", "BOOM", "BOOT", "BOTTLE", "BOW", "BOX", "BRIDGE",
"BRUSH", "BUCK", "BUFFALO", "BUG", "BUGLE", "BUTTON", "CALF", "CANADA", "CAP", "CAPITAL",
"CAR", "CARD", "CARROT", "CASINO", "CAST", "CAT", "CELL", "CENTAUR", "CENTER", "CHAIR",
"CHANGE", "CHARGE", "CHECK", "CHEST", "CHICK", "CHINA", "CHOCOLATE", "CHURCH", "CIRCLE",
"CLIFF", "CLOAK", "CLUB", "CODE", "COLD", "COMIC", "COMPOUND", "CONCERT", "CONDUCTOR",
"CONTRACT", "COOK", "COPPER", "COTTON", "COURT", "COVER", "CRANE", "CRASH", "CRICKET",
"CROSS", "CROWN", "CYCLE", "CZECH", "DANCE", "DATE", "DAY", "DEATH", "DECK", "DEGREE",
"DIAMOND", "DICE", "DINOSAUR", "DISEASE", "DOCTOR", "DOG", "DRAFT", "DRAGON", "DRESS",
"DRILL", "DROP", "DUCK", "DWARF", "EAGLE", "EGYPT", "EMBASSY", "ENGINE", "ENGLAND",
"EUROPE", "EYE", "FACE", "FAIR", "FALL", "FAN", "FENCE", "FIELD", "FIGHTER", "FIGURE",
"FILE", "FILM", "FIRE", "FISH", "FLUTE", "FLY", "FOOT", "FORCE", "FOREST", "FORK",
"FRANCE", "GAME", "GAS", "GENIUS", "GERMANY", "GHOST", "GIANT", "GLASS", "GLOVE", "GOLD",
"GRACE", "GRASS", "GREECE", "GREEN", "GROUND", "HAM", "HAND", "HAWK", "HEAD", "HEART",
"HELICOPTER", "HIMALAYAS", "HOLE", "HOLLYWOOD", "HONEY", "HOOD", "HOOK", "HORN", "HORSE",
"HORSESHOE", "HOSPITAL", "HOTEL", "ICE", "ICE CREAM", "INDIA", "IRON", "IVORY", "JACK",
"JAM", "JET", "JUPITER", "KANGAROO", "KETCHUP", "KEY", "KID", "KING", "KIWI", "KNIFE",
"KNIGHT", "LAB", "LAP", "LASER", "LAWYER", "LEAD", "LEMON", "LEPRECHAUN", "LIFE", "LIGHT",
"LIMOUSINE", "LINE", "LINK", "LION", "LITTER", "LOCH NESS", "LOCK", "LOG", "LONDON",
"LUCK", "MAIL", "MAMMOTH", "MAPLE", "MARBLE", "MARCH", "MASS", "MATCH", "MERCURY",
"MEXICO", "MICROSCOPE", "MILLIONAIRE", "MINE", "MINT", "MISSILE", "MODEL", "MOLE", "MOON",
"MOSCOW", "MOUNT", "MOUSE", "MOUTH", "MUG", "NAIL", "NEEDLE", "NET", "NEW YORK", "NIGHT",
"NINJA", "NOTE", "NOVEL", "NURSE", "NUT", "OCTOPUS", "OIL", "OLIVE", "OLYMPUS", "OPERA",
"ORANGE", "ORGAN", "PALM", "PAN", "PANTS", "PAPER", "PARACHUTE", "PARK", "PART", "PASS",
"PASTE", "PENGUIN", "PHOENIX", "PIANO", "PIE", "PILOT", "PIN", "PIPE", "PIRATE", "PISTOL",
"PIT", "PITCH", "PLANE", "PLASTIC", "PLATE", "PLATYPUS", "PLAY", "PLOT", "POINT",
"POISON", "POLE", "POLICE", "POOL", "PORT", "POST", "POUND", "PRESS", "PRINCESS",
"PUMPKIN", "PUPIL", "PYRAMID", "QUEEN", "RABBIT", "RACKET", "RAY", "REVOLUTION", "RING",
"ROBIN", "ROBOT", "ROCK", "ROME", "ROOT", "ROSE", "ROULETTE", "ROUND", "ROW", "RULER",
"SATELLITE", "SATURN", "SCALE", "SCHOOL", "SCIENTIST", "SCORPION", "SCREEN",
"SCUBA DIVER", "SEAL", "SERVER", "SHADOW", "SHAKESPEARE", "SHARK", "SHIP", "SHOE", "SHOP",
"SHOT", "SINK", "SKYSCRAPER", "SLIP", "SLUG", "SMUGGLER", "SNOW", "SNOWMAN", "SOCK",
"SOLDIER", "SOUL", "SOUND", "SPACE", "SPELL", "SPIDER", "SPIKE", "SPINE", "SPOT",
"SPRING", "SPY", "SQUARE", "STADIUM", "STAFF", "STAR", "STATE", "STICK", "STOCK", "STRAW",
"STREAM", "STRIKE", "STRING", "SUB", "SUIT", "SUPERHERO", "SWING", "SWITCH", "TABLE",
"TABLET", "TAG", "TAIL", "TAP", "TEACHER", "TELESCOPE", "TEMPLE", "THEATER", "THIEF",
"THUMB", "TICK", "TIE", "TIME", "TOKYO", "TOOTH", "TORCH", "TOWER", "TRACK", "TRAIN",
"TRIANGLE", "TRIP", "TRUNK", "TUBE", "TURKEY", "UNDERTAKER", "UNICORN", "VACUUM", "VAN",
"VET", "WAKE", "WALL", "WAR", "WASHER", "WASHINGTON", "WATCH", "WATER", "WAVE", "WEB",
"WELL", "WHALE", "WHIP", "WIND", "WITCH", "WORM", "YARD"];

function shuffle(prng, arr) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    var rand_index = Math.floor((i + 1) * prng());
    var tmp = arr[rand_index];
    arr[rand_index] = arr[i];
    arr[i] = tmp;
  }
  return arr;
}

function loadWords(prng) {
  // shuffle + slice to guarantee non-repetition
  var wordlist = shuffle(prng, WORDS.slice(0));
  return wordlist.slice(0, LIMIT);
}

function determineFirstPlayer(prng) {
  if (prng() < 0.5) {
    return "blue";
  } else {
    return "red";
  }
}

function wordDistribution(prng) {
  var word_indices = shuffle(prng, [...Array(25).keys()]);
  return [word_indices.slice(0, 8), word_indices.slice(8, 17), word_indices[17]];
}

function newSeed() { return Math.floor(Math.random() * 10000); }
function getSeed() {
  var params = (new URL(window.location)).searchParams;
  return params.get("gameID") || newSeed();
}

function updateRemainingIndicators() {
  var countBlue = document.querySelectorAll(".blueword").length;
  var countRed = document.querySelectorAll(".redword").length;
  var countBlueSelected = document.querySelectorAll(".blueword.activated").length;
  var countRedSelected = document.querySelectorAll(".redword.activated").length;

  var target = document.getElementById("blueRemaining");
  target.innerHTML = (countBlue - countBlueSelected).toString();

  target = document.getElementById("redRemaining");
  target.innerHTML = (countRed - countRedSelected).toString();
}

function clickActivates(node) {
  node.addEventListener("click", function(evt) {
    evt.stopPropagation();

    if (window.confirm("Are you sure you want to select " + node.innerHTML + "?")) {
      node.classList.add("activated");
      updateRemainingIndicators()
    }
  });
}

function renderBoard(prng, firstPlayer) {
  var wordlist = loadWords(prng);
  var dist = wordDistribution(prng);

  if (firstPlayer == "red") {
    var bluewords = dist[0], redwords = dist[1];
  } else {
    var redwords = dist[0], bluewords = dist[1];
  }
  var poisonword = dist[2];

  var target = document.getElementById("wordList");
  // clear all children
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
  // render the board
  var table = document.createElement("TABLE");
  for (var i = 0; i < 5; i++) {
    var tr = document.createElement("TR");
    for (var j = 0; j < 5; j++) {
      var idx = 5 * i + j;
      var td = document.createElement("TD");
      td.appendChild(document.createTextNode(wordlist[idx]));
      td.classList.add("gameword");
      if (idx == poisonword) {
        td.classList.add("poisonword")
      } else if (redwords.includes(idx)) {
        td.classList.add("redword")
      } else if (bluewords.includes(idx)) {
        td.classList.add("blueword")
      } else {
        td.classList.add("neutralword")
      }
      clickActivates(td);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  target.appendChild(table);
}

function renderGameLink(gameID) {
  var href = window.location.protocol + '//' + window.location.host + window.location.pathname + '?gameID=' + gameID.toString();

  var target = document.getElementById("gameLink");
  target.href = href;

  target = document.getElementById("gameLinkRaw");
  target.innerHTML = href;

  var params = (new URL(window.location)).searchParams;
  if (params.get("gameID") != gameID) {
    history.pushState({"gameID": gameID}, "Codenames", href);
  }
}

function renderFirstPlayerIndicator(firstPlayer) {
  var target = document.getElementById("firstPlayerIndicator");
  if (firstPlayer == "red") {
    target.innerHTML = 'The first player is red! <span class="dot red-dot"></span>';
  } else {
    target.innerHTML = 'The first player is blue! <span class="dot blue-dot"></span>';
  }
}

function renderAll(seed) {
  var prng = mulberry32(seed);
  var firstPlayer = determineFirstPlayer(prng);
  renderBoard(prng, firstPlayer);
  renderGameLink(seed);
  renderFirstPlayerIndicator(firstPlayer);
  updateRemainingIndicators();
}

document.addEventListener('DOMContentLoaded', function() {
  renderAll(getSeed());

  // setup Spymaster Button
  document.getElementById("spymasterButton").addEventListener("click", function(evt) {
    evt.stopPropagation();
    document.querySelectorAll(".gameword").forEach(function(elem) {
      elem.classList.add("spymaster");
    });
  });
  // setup New Game Button
  document.getElementById("newGameButton").addEventListener("click", function(evt) {
    evt.stopPropagation();
    renderAll(newSeed());
  });
  // setup popstate handler
  window.onpopstate = function(evt) {
    renderAll(evt.state.gameID);
  };
});
