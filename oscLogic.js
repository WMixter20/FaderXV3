const { Client, Server } = require('node-osc');
const client = new Client('192.168.0.165', 7777);

//'192.168.0.165'
//var serverCon = require('./server.js');


class fader {
    constructor(name,address){
        this.name = name
        this.address = address
    }
    sendOsc(value){
        client.send(this.address, value, () => {
            console.log(`Sent OSC for ${this.name} at ${value}`)
          });
    }
    
}

module.exports.fader = fader