const express = require('express');
const tourRout = express.Router();

tourRout.get('/churches', function (request, response) {
    response.render('frontend/churches', {
        title: 'churches'
    })
});
tourRout.get('/sightseeing', function (request, response) {
    response.render('frontend/sightseeing', {
        title: 'sightseeing'
    })
});
tourRout.get('/monuments', function (request, response) {
    response.render('frontend/monuments', {
        title: 'monuments'
    })
});
tourRout.get('/', function (request, response) {
    response.render('frontend/tourism', {
        title: 'tourism'
    })
});
// catch 404 and forward to error handler
tourRout.get(function(req, res) {
    res.render('error.ejs')
});

module.exports = tourRout;