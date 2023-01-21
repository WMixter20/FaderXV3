const express = require("express");
const app = express();
const path = require("path");
const dgram = require("dgram");

const http = require("http").Server(app);
const port = process.env.PORT || 4000;
const myIp = "10.0.0.159"; //==========Check for each lan

const clientIDs = {};

const io = require("socket.io")(http);

//OSC init
const oscLogic = require("./oscLogic.js"); //Import the File
const firstFader = new oscLogic.fader("Fader One", `/wf/1/`);
const secondFader = new oscLogic.fader("Fader Two", `/wf/2/`);
const threeFader = new oscLogic.fader("Fader Three", `/wf/3/`);
const fourFader = new oscLogic.fader("Fader Four", `/wf/4/`);
const leftButton = new oscLogic.button("leftButton", `/wfR/`);
const rightButton = new oscLogic.button("rightButton", `/wfL/`);

//OSC Rx
const { Server } = require("node-osc");
var oscServer = new Server(4444, "10.0.0.1", () => {
  console.log("OSC Server is Listening");
});

//
const sliders = [
  { id: 1, name: "faderOne", min: 0, max: 127, value: 50 },
  { id: 2, name: "faderTwo", min: 0, max: 127, value: 10 },
  { id: 3, name: "faderThree", min: 0, max: 127, value: 60 },
  { id: 4, name: "faderFour", min: 0, max: 127, value: 40 }, //>>>>>>
];
module.exports.sliders = sliders;

//route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
  //res.sendFile(path.join(__dirname,'public'))
});
http.listen(4000, myIp, () => {
  console.log("http");
});

//Static CSS Send
app.use(express.static("public"));

//Send HTML File
http.listen(port, () => {
  console.log(`App Listening on ${port}`);
});

//Create a New Connections //Mangae Socket
io.on("connection", (socket) => {
  console.log("A User Connected");

  socket.on("disconnect", () => {
    console.log("A User Disconnected");
  });
/*
  socket.on("initLoad", () => {
    socket.emit(
      "sFaders",
      0,
      sliders[0]["value"],
      sliders[0]["min"],
      sliders[0]["max"]
    );
  })
*/

  socket.on(0, (msg) => {
    firstFader.sendOsc(msg);
    sliders[0]["value"] = msg;
    console.log("This is msg: " + msg)
    socket.broadcast.emit("sFaderVal", 0, msg);
  });
  socket.on(1, (msg) => {
    secondFader.sendOsc(msg);
    sliders[1]["value"] = msg;
    socket.broadcast.emit("sFaderVal", 1, msg);
  });
  socket.on(2, (msg) => {
    threeFader.sendOsc(msg);
    sliders[2]["value"] = msg;
    socket.broadcast.emit("sFaderVal", 2, msg);
  });
  socket.on(3, (msg) => {
    fourFader.sendOsc(msg);
    sliders[3]["value"] = msg;
    socket.broadcast.emit("sFaderVal", 3, msg);
  });
  //===================================Button
  socket.on("buttonL", (msg) => {
    leftButton.sendLB();
  });
  socket.on("buttonR", (msg) => {
    leftButton.sendRB();
  });
  
  //emit (Send to Client)
  socket.emit(
    "sFaders",
    0,
    sliders[0]["value"],
    sliders[0]["min"],
    sliders[0]["max"]
  );
  socket.emit(
    "sFaders",
    1,
    sliders[1]["value"],
    sliders[1]["min"],
    sliders[1]["max"]
  );
  socket.emit(
    "sFaders",
    2,
    sliders[2]["value"],
    sliders[2]["min"],
    sliders[2]["max"]
  );
  socket.emit(
    "sFaders",
    3,
    sliders[3]["value"],
    sliders[3]["min"],
    sliders[3]["max"]
  );
  
  //OSC RX Faders
  oscServer.on("message", function (OSCmsg) {
    if (OSCmsg.includes("/wf/1/")) {
      sliders[0]["value"] = OSCmsg[1];
      socket.emit("sFaderVal", 0, OSCmsg[1].toString());
    }
    if (OSCmsg.includes("/wf/2/")) {
      sliders[1]["value"] = OSCmsg[1];
      socket.emit("sFaderVal", 1, OSCmsg[1].toString());
    }
    if (OSCmsg.includes("/wf/3/")) {
      sliders[2]["value"] = OSCmsg[1];
      socket.emit("sFaderVal", 2, OSCmsg[1].toString());
    }
    if (OSCmsg.includes("/wf/4/")) {
      sliders[3]["value"] = OSCmsg[1];
      socket.emit("sFaderVal", 3, OSCmsg[1].toString());
    }
  });
});
