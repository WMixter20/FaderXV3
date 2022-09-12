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
    {id: 1, name: 'faderOne',min: 100, max: 200, value: 0},
    {id: 2, name: 'faderTwo',min: 100, max: 200, value: 0},
    {id: 3, name: 'faderThree',min: 200, max: 300, value: 0},
    {id: 4, name: 'faderFour',min: 300, max: 400, value: 0},
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
    socket.emit('sFaderOne',sliders[0]['value'])
    socket.emit('sFaderTwo',sliders[1]['value'])
    socket.emit('sFaderThree',sliders[2]['value'])
    socket.emit('sFaderFour',sliders[3]['value'])
    


})
