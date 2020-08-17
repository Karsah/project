

const slider = document.querySelector(".slider");
let left = 0;
const maxleft = slider.children.length * -100;
setInterval(() => {
    slider.style.transition = "0.8s";
    left -= 100;
    slider.style.left = left + "%";
    if (left <= maxleft) {
        left = 0;
        slider.style.transition = "none";
        slider.style.left = '0';
    }
}, 8000);

