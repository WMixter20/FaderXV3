const socket = io()

socket.on('connect',()=>{

    console.log('A Client connected')

    socket.on('disconnect',()=>{
        console.log('A Client disconnected')
    })
})


var output = document.querySelector("#value");

const sliders = document.querySelectorAll(".slider-container")


sliders.forEach(slider=>{

    slider.addEventListener('input',()=>{

        var perValue = (slider.querySelector("#slider").value-slider.querySelector("#slider").min)/(slider.querySelector("#slider").max-slider.querySelector("#slider").min)*100
        var value = slider.querySelector("#slider").value
        

        slider.querySelector("#value").innerHTML = value
        slider.querySelector("#slider").setAttribute("value",value)
        slider.querySelector(".slider-container .fill").style.height = perValue + "%"

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