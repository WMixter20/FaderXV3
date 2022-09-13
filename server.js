const express = require('express')
const app = express();
const path = require('path')
const dgram = require('dgram')

const http =require('http').Server(app)
const port = process.env.PORT||4000

//Attach HTTP Server to Socket.io
const io = require('socket.io')(http)

//route
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'))
    //res.sendFile(path.join(__dirname,'public'))
})

//OSC init
const oscLogic = require('./oscLogic.js'); //Import the File
const firstFader = new oscLogic.fader('Fader One',`/wm/fader/1`) 
const secondFader = new oscLogic.fader('Fader Two',`/wm/fader/2`) 
const threeFader = new oscLogic.fader('Fader Three',`/wm/fader/3`) 
const fourFader = new oscLogic.fader('Fader Four',`/wm/fader/4`) 

//
const sliders =[
    {id: 1, name: 'faderOne',min: 100, max: 200, value: 175},
    {id: 2, name: 'faderTwo',min: 100, max: 200, value: 150},
    {id: 3, name: 'faderThree',min: 200, max: 300, value: 225},
    {id: 4, name: 'faderFour',min: 300, max: 400, value: 340},
]

//Static CSS Send
app.use(express.static("public"))

//Send HTML File
http.listen(port,()=>{
    console.log(`App Listening on ${port}`)
})

//Create a New Connections //Mangae Socket

io.on('connection',socket =>{
    console.log('A User Connected')

    socket.on('disconnect',()=>{
        console.log("A User Disconnected")
    })

    socket.on("faderOne",msg=>{
        firstFader.sendOsc(msg)
        sliders[0]['value'] = msg
    })
    socket.on("faderTwo",msg=>{
        secondFader.sendOsc(msg)
        sliders[1]['value'] = msg
    })
    socket.on("faderThree",msg=>{
        threeFader.sendOsc(msg)
        sliders[2]['value'] = msg
    })
    socket.on("faderFour",msg=>{
        fourFader.sendOsc(msg)
        sliders[3]['value'] = msg
    })

    //emit
    socket.emit('sFaders',0,sliders[0]['value'],sliders[0]['min'],sliders[0]['max'])
    socket.emit('sFaders',1,sliders[1]['value'],sliders[1]['min'],sliders[1]['max'])
    socket.emit('sFaders',2,sliders[2]['value'],sliders[2]['min'],sliders[2]['max'])
    socket.emit('sFaders',3,sliders[3]['value'],sliders[3]['min'],sliders[3]['max'])

})
