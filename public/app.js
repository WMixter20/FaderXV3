const socket = io()

socket.on('connect',()=>{

    console.log('A Client connected')

    socket.on('disconnect',()=>{
        console.log('A Client disconnected')
    })

    //Recive Data From Server
    socket.on('sFaders',(faderNum,faderVal,min,max) =>{
        socketFadersMinMax(faderNum,min,max)
        socektFadersVal(faderNum,faderVal)
    })
    socket.on('sFaderVal',(faderNum,faderVal)=>{
        socektFadersVal(faderNum,faderVal)
    })

})
function  socketFadersMinMax(sliderArrayNum,socketMin,socketMax){
    let slider1 = document.getElementsByClassName(`slider`)[sliderArrayNum]
    slider1.setAttribute('min',socketMin)
    slider1.setAttribute('max',socketMax)
}

function socektFadersVal(sliderArrayNum,socketMSG){
    let slider1 = document.getElementsByClassName(`slider`)[sliderArrayNum]
    let slidercontainer1 = document.querySelectorAll(".slider-container")[sliderArrayNum]

    slider1.setAttribute('value',socketMSG)
    let perValue = (slider1.getAttribute('value')-slider1.getAttribute('min'))/(slider1.getAttribute('max')-slider1.getAttribute('min'))*100
    slidercontainer1.querySelector(".slider-container .fill").style.height = perValue + "%"
    slidercontainer1.querySelector("#value").innerHTML = socketMSG
 }


var output = document.querySelector("#value");

const sliders = document.querySelectorAll(".slider-container")

sliders.forEach(slider=>{

    slider.addEventListener('input',()=>{

        var value = slider.querySelector("#slider").value

        slider.querySelector("#value").innerHTML = value
        slider.querySelector("#slider").setAttribute("value",value)
        setFaderCSS(slider)
        socket.emit(getFaderName(slider),value)
        /*
        setTimeout(()=>{
            window.location.reload()
        },5000);
        */

    })
    slider.addEventListener('change',()=>{
        setTimeout(()=>{
            window.location.reload()
        },500);
    })

})

//=================================================================Button Logic

let buttonL = document.querySelector(`#buttonL`)

buttonL.addEventListener('click',()=>{
    socket.emit("buttonL",(""))
})

let buttonR = document.querySelector(`#buttonR`)

buttonR.addEventListener('click',()=>{
    socket.emit("buttonR",(""))
})

document.addEventListener('keydown', (e) => {
  e = e || window.event;
    if(e.key === 'ArrowLeft'){
        socket.emit("buttonL",(""))
    }
    else if(e.key === 'ArrowRight'){
        socket.emit("buttonR",(""))
    }

})

//=================================================================Button Logic


function getFaderName(slider){
    let faderName = "none"
    if(slider.classList.contains("one")){return faderName ="faderOne"}
    if(slider.classList.contains("two")){return faderName ="faderTwo"}
    if(slider.classList.contains("three")){return faderName ="faderThree"}
    if(slider.classList.contains("four")){return faderName ="faderFour"}
}

function setFaderCSS(slider){
    var perValue = (slider.querySelector("#slider").value-slider.querySelector("#slider").min)/(slider.querySelector("#slider").max-slider.querySelector("#slider").min)*100
    slider.querySelector(".slider-container .fill").style.height = perValue + "%"
}