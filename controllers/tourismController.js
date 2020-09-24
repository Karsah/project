const sights = require('../models/tourism')

module.exports.getSights = function (request,response) {
    sights.GetSights()
        .then(results => {
            console.log('kfkfkfk', results)
            response.render('frontend/tourism', {
                title: 'tourism',
                css: ['style.css', 'tourism.css'],
                topSights: results
            })
        })
        .catch(err => {
            return ['Error:', err]
        })
}