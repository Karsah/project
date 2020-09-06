let seeBtn = document.getElementsByClassName('see')
let seeBtnArray = Array.from(seeBtn)
console.log(seeBtnArray)
seeBtnArray.forEach(function (item,index) {
    seeBtnArray[index].addEventListener('click',function () {
        let wrapper = Array.from(item.parentNode.childNodes)

        if (item.classList.contains('fa-eye')){
            wrapper[0].type = 'text'
            wrapper[1].classList.replace('fa-eye','fa-eye-slash')
        }else if(item.classList.contains('fa-eye-slash')){
            wrapper[0].type = 'password'
            wrapper[1].classList.replace('fa-eye-slash','fa-eye')
        }

    })
})
