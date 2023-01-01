//OSC TX
const { Client, Server } = require('node-osc');
const client = new Client('10.0.0.119', 7777);


class fader {
    constructor(name,address){
        this.name = name
        this.address = address
    }
    sendOsc(value){
        client.send(this.address, parseInt(value), () => {
            //console.log(`Sent OSC for ${this.name} at ${value}`)
          });
    }
    
}

module.exports.fader = fader