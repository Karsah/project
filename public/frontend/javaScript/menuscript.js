// menu
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("sticky", window.scrollY > 0);
});


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
