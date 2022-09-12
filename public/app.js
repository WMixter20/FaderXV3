const socket = io()

socket.on('connect',()=>{

    console.log('A Client connected')

    socket.on('disconnect',()=>{
        console.log('A Client disconnected')
    })

    socket.on('sFaderOne',(msg) =>{
        socektFaders(0,msg)
    })
    socket.on('sFaderTwo',(msg) =>{
        socektFaders(1,msg)
    })
    socket.on('sFaderThree',(msg) =>{
        socektFaders(2,msg)
    })
    socket.on('sFaderFour',(msg) =>{
        socektFaders(3,msg)
    })

})

 function socektFaders(sliderArrayNum,socketMSG){
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

    })
    

})

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