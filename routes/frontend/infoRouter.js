const express = require('express');
const infoRout = express.Router();
infoRout.get('/communities', function (request, response) {
    response.render('frontend/communities', {
        title: 'communities',
        css :['style.css']
    })
});
infoRout.get('/cities', function (request, response) {
    response.render('frontend/cities', {
        title: 'cities',
        css :['style.css']
    })
});
infoRout.get('/', function (request, response) {
    let url = request.url
    console.log(url)
    response.render('frontend/information', {
        title: 'information',
        pageName:'information',
        css:['information.css','style.css']
    })
});
module.exports = infoRout;

