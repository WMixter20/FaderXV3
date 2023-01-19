const socket = io();

socket.on("connect", () => {
  console.log("A Client connected");

  socket.on("disconnect", () => {
    console.log("A Client disconnected");
  });

  //Recive Data From Server
  // this *should* work but i haven't tested with a server
  socket.on("sFaders", (faderNum, faderVal, min, max) => {
    updateMinMax(faderNum, min, max);
    updateSliderValue(faderNum, faderVal);
  });
  socket.on("sFaderVal", (faderNum, faderVal) => {
    updateSliderValue(faderNum, faderVal);
  });
  ``;
});

//=================================================================Button Logic

let buttonL = document.querySelector(`#buttonL`);

buttonL.addEventListener("click", () => {
  socket.emit("buttonL", "");
});

let buttonR = document.querySelector(`#buttonR`);

buttonR.addEventListener("click", () => {
  socket.emit("buttonR", "");
});

document.addEventListener("keydown", (e) => {
  e = e || window.event;
  if (e.key === "ArrowLeft") {
    socket.emit("buttonL", "");
  } else if (e.key === "ArrowRight") {
    socket.emit("buttonR", "");
  }
});
//=================================================================

// dummy entry since no slider number 0
const SLIDER_MIN = [-100, -100, -100, -100];
const SLIDER_MAX = [10, 10, 10, 10];

function clamp(x, min, max) {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
}

function updateMinMax(sliderNum, newMin, newMax) {
  SLIDER_MIN[sliderNum] = newMin;
  SLIDER_MAX[sliderNum] = newMax;
  const newVal = clamp(
    document.getElementById("slider" + sliderNum).value,
    newMin,
    newMax
  );
  document.getElementById("slider" + sliderNum).setAttribute("min", newMin);
  document.getElementById("slider" + sliderNum).setAttribute("max", newMax);
  updateSliderValue(sliderNum, newVal);
}

function updateSliderValue(sliderNum, newValue) {
  document.getElementById("slider" + sliderNum).value = newValue;
  updateSliderRealtime(sliderNum, newValue);
}

function updateSliderRealtime(sliderNum, newValue) {
  const shift = -1 * SLIDER_MIN[sliderNum];
  const shifted_max = SLIDER_MAX[sliderNum] + shift;
  const shifted_new = newValue + shift;
  const percentage = clamp(shifted_new / shifted_max, 0, 100);
  document.getElementById("fill" + sliderNum).style =
    "height: " + 100 * percentage + "%";
  document.getElementById("value" + sliderNum).innerHTML = newValue;
  // TODO: socket emit goes here (I don't know the protocol)
  socket.emit(sliderNum,newValue)
  console.log("updateSliderRealtime " + newValue)
}

function registerSliders() {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    const id = slider.getAttribute("id").split("slider")[1];
    slider.addEventListener("input", (e) => {
      updateSliderRealtime(id, parseInt(e.target.value));
    });
  });
}

registerSliders();
