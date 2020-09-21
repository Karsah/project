const express = require('express');
const tourRout = express.Router();
const tourController = require('../../controllers/tourismController')

tourRout.get('/churches', function (request, response) {
    response.render('frontend/churches', {
        title: 'churches',
        css :['style.css']
    })
});
tourRout.get('/sightseeing', function (request, response) {
    response.render('frontend/sightseeing', {
        title: 'sightseeing',
        css :['style.css']
    })
});
tourRout.get('/monuments', function (request, response) {
    response.render('frontend/monuments', {
        title: 'monuments',
        css :['style.css']
    })
});
tourRout.get('/',tourController.getSights);

module.exports = tourRout;