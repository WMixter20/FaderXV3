const { Client, Server } = require('node-osc');
const client = new Client('10.195.127.12', 7777);

//'192.168.0.165'

function sendOSC(){
client.send('/oscAddress', 100, () => {
    client.close();
  });
}

console.log("Sent OSC")
module.exports.sendOSC = sendOSC;