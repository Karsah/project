const starsList = document.querySelectorAll('.stars i')
const starsCount = document.querySelector('#starscount')
   
const min = 1
const max = 5

starsCount.value = min

let count
starsList.forEach((item,index)=>{
    item.addEventListener('click',(e)=>{
        if(e.target.classList[0] ==='fas'){
            for(let i = index+1 ; i<starsList.length;i++) starsList[i].classList.replace('fas','far')
        }else{
            for(let i = 0 ; i<=index;i++) starsList[i].classList.replace('far','fas')
        }

        count = index+1

        if(count >= min && count <=max) {
            starsCount.value = count
        }
    })
})