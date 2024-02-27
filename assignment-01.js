var pyramidVersion = 0;

//upper rda limits for each layer, 0 for child, 1 for 5+
const rdaUpper = [
  [0, 1, 4, 3, 5, 6],
  [1, 1, 2, 5, 5, 7],
];
//lower rda limits for each layer, 0 for child, 1 for 5+
const rdaLower = [
  [0, 0, 2, 3, 2, 3],
  [0, 0, 2, 3, 3, 5],
];

//selects which version of the pyramid you want to use
function setVersion(pyramidVersion) {
  this.pyramidVersion = pyramidVersion;
  if (pyramidVersion == 0) {
    document.getElementById("btn1").style.backgroundColor = "green";
    document.getElementById("btn2").style.backgroundColor = "gray";
  } else {
    document.getElementById("btn1").style.backgroundColor = "gray";
    document.getElementById("btn2").style.backgroundColor = "green";
  }
  updateColor();
}

function updateColor() {
  //cycle through the layers and update the colors based on what age is selected
  for (var i = 1; i <= 6; i++) {
    var display = document.getElementById("display" + i);
    var currentVal = parseInt(display.textContent);

    if (currentVal > rdaUpper[pyramidVersion][i - 1]) {
      display.style.backgroundColor = "red";
    } else if (
      currentVal <= rdaUpper[pyramidVersion][i - 1] &&
      currentVal >= rdaLower[pyramidVersion][i - 1]
    ) {
      display.style.backgroundColor = "green";
    } else {
      display.style.backgroundColor = "goldenrod";
    }
  }
}

function isValidDate(date) {
  var display = document.getElementById("record");
  if (validate(date)) {
    display.textContent = "Recorded on " + date;
  } else {
    display.textContent = "Try Again, Enter a valid date";
  }
}

function validate(date) {
  let today = new Date();
  const arr = date.split("/");

  for (var i = 0; i < 3; i++) {
    if (isNaN(arr[i])) {
      return false;
    }
  }
  var leap = false;
  //makes sure we not in the future
  if (arr[2] > today.getFullYear()) {
    return false;
  } else if (arr[2] == today.getFullYear() && arr[1] > today.getMonth() + 1) {
    return false;
  } else if (
    arr[2] == today.getFullYear() &&
    arr[1] == today.getMonth() + 1 &&
    arr[0] > today.getDate()
  ) {
    return false;
  } else {
    //if is valid date in the past
    if ((arr[2] % 4 == 0 && arr[2] % 100 != 0) || arr[2] % 400 == 0) {
      leap = true;
    }
    if (arr[1] == 2 && ((leap && arr[0] > 29) || (!leap && arr[0] > 28))) {
      return false;
    }
    //1 3 5 7 8 10 12
    else if (
      (arr[1] == 1 ||
        arr[1] == 3 ||
        arr[1] == 5 ||
        arr[1] == 7 ||
        arr[1] == 8 ||
        arr[1] == 10 ||
        arr[1] == 12) &&
      arr[0] > 31
    ) {
      return false;
    } else if (arr[0] > 30) {
      return false;
    }
    return true;
  }
}

function increment(layer) {
  // grabs the needed displayid
  //handles the text
  var layerClass = "layer-" + layer;
  var display = document.getElementById("display" + layer);
  var currentVal = parseInt(display.textContent);
  currentVal++;

  display.textContent = currentVal;

  updateColor();

  var element = document.getElementById(layerClass);
  var style = window.getComputedStyle(element);
  var increase = parseInt(style.borderBottom) + 10;

  element.style.borderRightWidth = increase + "px";
  element.style.borderBottomWidth = increase + "px";
  element.style.borderLeftWidth = increase + "px";

  var currentWidth = parseInt(style.width);

  var nextWidth = increase * 2 + currentWidth;
  updateSize(nextWidth, layer);
}

function decrement(layer) {
  //handles the text
  var layerClass = "layer-" + layer;
  var display = document.getElementById("display" + layer);
  var currentVal = parseInt(display.textContent);
  currentVal--;

  //cant have negative number of meals
  if (currentVal < 0) {
    currentVal = 0;
    return;
  }
  display.textContent = currentVal;

  updateColor();

  //handles the height adjustment
  var element = document.getElementById(layerClass);
  var style = window.getComputedStyle(element);
  var decrease = parseInt(style.borderBottom) - 10;

  element.style.borderRightWidth = decrease + "px";
  element.style.borderBottomWidth = decrease + "px";
  element.style.borderLeftWidth = decrease + "px";

  //grabs the width of current layer
  var currentWidth = parseInt(style.width);

  //calculates the width of next layer and calls update from this layer onwards
  var nextWidth = decrease * 2 + currentWidth;
  updateSize(nextWidth, layer);
}

function updateSize(nextWidth, layer) {
  //iterates from next layer and adjusts the width to keep pyramid shape
  //width = previous layer width + sides*2
  for (var i = layer + 1; i <= 6; i++) {
    var layerClass = "layer-" + i;
    var element = document.getElementById(layerClass);
    var style = window.getComputedStyle(element);

    if (i == 2) {
      nextWidth = nextWidth + 20;
      element.style.width = nextWidth + "px";
    } else if (i == 3) {
      nextWidth = nextWidth + 20;
      element.style.width = nextWidth + "px";
    } else {
      element.style.width = nextWidth + "px";
    }
    nextWidth = nextWidth + parseInt(style.borderBottom) * 2;
  }
}
