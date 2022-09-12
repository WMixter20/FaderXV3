const { Client, Server } = require('node-osc');
const client = new Client('192.168.0.165', 4444);

//'192.168.0.165'
var serverCon = require('./server.js');



function sendOSC(){
client.send('/oscAddress', 100, () => {
    //client.close();
    console.log("Sent OSC")

  });
}
class faderOutput {
    constructor(faderOne){
        this.fader = faderOne
    }
    fader(value){
        client.send('/oscAddress', value, () => {
            console.log("Sent Fader 1")
          });
    }

}

module.exports.sendOSC = sendOSC;
