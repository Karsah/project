const express = require('express');
const feedbackRout = express.Router();
feedbackRout.get('/leaveFeedback', function (request, response) {
    response.render('frontend/leaveFeedback', {
        title: 'leaveFeedback',
        css :['style.css']

    })
});
feedbackRout.get('/othersFeedback', function (request, response) {
    response.render('frontend/othersFeedback', {
        title: 'othersFeedback',
        css :['style.css']

    })
});
feedbackRout.get('/', function (request, response) {
    response.render('frontend/feedback', {
        title: 'feedback',
        css :['style.css']

    })
});
module.exports = feedbackRout;

