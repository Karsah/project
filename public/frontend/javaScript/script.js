window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("sticky", window.scrollY > 0);
});

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

// menu
const open = document.querySelector("#open_menu"),
    menu = document.querySelector("#menu"),
    close = document.querySelector("#close_menu");
open.addEventListener("click", function () {
    menu.style.left = '0';
});
close.addEventListener("click", function () {
    menu.style.left = "-100%";
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 952) {
        menu.style.left = '0';
    }
    else if(window.innerWidth <=952){
        menu.style.left = '-100%'
    }
});
