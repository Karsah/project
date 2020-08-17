const express = require('express');
const infoRout = express.Router();
infoRout.get('/communities', function (request, response) {
    response.render('frontend/communities', {
        title: 'communities'
    })
});
infoRout.get('/cities', function (request, response) {
    response.render('frontend/cities', {
        title: 'cities'
    })
});
infoRout.get('/', function (request, response) {
    let url = request.url
    console.log(url)
    response.render('frontend/information', {
        title: 'information',
        pageName:'information',
        css:['information.css']
    })
});
module.exports = infoRout;

