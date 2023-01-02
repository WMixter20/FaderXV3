//OSC TX
const { Client, Server } = require('node-osc');
const ipadClient = new Client('10.0.0.119', 7777);


class fader {
    constructor(name,address){
        this.name = name
        this.address = address
    }
    sendOsc(value){
        ipadClient.send(this.address, parseInt(value), () => {
            //console.log(`Sent OSC for ${this.name} at ${value}`)
          });
    }
}

class button {
    constructor(name,address){
        this.name = name
        this.address = address
    }
    sendRB(){
        ipadClient.send(this.address, (`/right`));
        console.log("OSC  Right Click")

    }
    sendLB(){
        ipadClient.send(this.address, (`/left`));
        console.log("OSC Left Click")

    }
}

module.exports.fader = fader
module.exports.button = button