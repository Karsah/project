const mainSlider = require('../models/mainSlider')

module.exports.getSlides = function () {
    mainSlider.GetSlides()
        .then(results=>{
            return new Promise(resolve => {
                resolve(results)
            })
        })
        .catch(err =>{
            return ['Error:',err]
        })

}