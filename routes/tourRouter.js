const express = require('express');
const tourRouter = express.Router();
tourRouter.use('/churches', function (request, response) {
    response.render('', {
        title: 'churches'
    })
});
tourRouter.use('/sightseeing', function (request, response) {
    response.render('', {
        title: 'sightseeing'
    })
});
tourRouter.use('/monuments', function (request, response) {
    response.render('', {
        title: 'monuments'
    })
});
module.exports = tourRouter;