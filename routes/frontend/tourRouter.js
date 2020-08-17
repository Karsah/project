const express = require('express');
const tourRout = express.Router();

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
tourRout.get('/', function (request, response) {
    response.render('frontend/tourism', {
        title: 'tourism',
        css :['style.css']

    })
});

module.exports = tourRout;