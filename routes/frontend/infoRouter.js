const express = require('express');
const infoRout = express.Router();
const infoController = require('../../controllers/informationController')

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
infoRout.get('/', infoController.getAragatsotnInfoPage);
module.exports = infoRout;


