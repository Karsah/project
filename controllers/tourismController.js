const sights = require('../models/tourism')

module.exports.getSights = function (request,response) {
    sights.GetSights()
        .then(results => {
            response.render('frontend/tourism', {
                title: 'Tourism',
                css: ['style.css', 'tourism.css'],
                topSights: results
            })
        })
        .catch(err => {
            return ['Error:', err]
        })
}