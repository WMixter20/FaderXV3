const express = require('express')
const app = express();
const path = require('path')

const http =require('http').Server(app)
const port = process.env.PORT||4000

//Attach HTTP Server to Socket.io
const io = require('socket.io')(http)

//route
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'))
    //res.sendFile(path.join(__dirname,'public'))
})

//OSC 
var oscLogic = require('./oscLogic.js');
//oscLogic.sendOSC();


//Create a New Connections //Mangae Socket
io.on('connection',socket =>{
    console.log('A User Connected')

    socket.on('disconnect',()=>{
        console.log("A User Disconnected")
    })

    socket.on("faderOne",msg=>{
        console.log("Fader One Value = "+msg)
        //oscLogic.sendOSC();
    })


})


//Static CSS Send
app.use(express.static("public"))

//Send HTML File
http.listen(port,()=>{
    console.log(`App Listening on ${port}`)
})