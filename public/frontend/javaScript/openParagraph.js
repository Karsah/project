
let headers = document.querySelectorAll('.paragraph-header i')
headers.forEach(function (item) {
    item.addEventListener('click',function () {
        if(item.classList.contains('fa-sort-amount-down-alt')){
            item.classList.replace('fa-sort-amount-down-alt','fa-sort-amount-up-alt')
        }else{
            item.classList.replace('fa-sort-amount-up-alt','fa-sort-amount-down-alt')
        }
        item.parentNode.parentNode.classList.toggle('opened')
    })
})