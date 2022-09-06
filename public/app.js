var output = document.querySelector("#value");

const sliders = document.querySelectorAll(".slider-container")

sliders.forEach(slider=>{

    slider.addEventListener('input',()=>{

        var perValue = (slider.querySelector("#slider").value-slider.querySelector("#slider").min)/(slider.querySelector("#slider").max-slider.querySelector("#slider").min)*100
        var value = slider.querySelector("#slider").value
        

        slider.querySelector("#value").innerHTML = value
        slider.querySelector("#slider").setAttribute("value",value)
        slider.querySelector(".slider-container .fill").style.height = perValue + "%"
    })
    

})