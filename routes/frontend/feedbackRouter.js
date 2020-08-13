const express = require('express');
const feedbackRout = express.Router();
feedbackRout.get('/leaveFeedback', function (request, response) {
    response.render('frontend/leaveFeedback', {
        title: 'leaveFeedback'
    })
});
feedbackRout.get('/othersFeedback', function (request, response) {
    response.render('frontend/othersFeedback', {
        title: 'othersFeedback'
    })
});
feedbackRout.get('/', function (request, response) {
    response.render('frontend/feedback', {
        title: 'feedback'
    })
});
module.exports = feedbackRout;

