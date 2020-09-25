const express = require('express');
const feedbackRout = express.Router();

feedbackRout.get('/', function (request,response) {
    response.render('frontend/team.ejs',{
        title:'Our Team',
        css:['team.css', 'style.css']
    })
});
module.exports = feedbackRout;

