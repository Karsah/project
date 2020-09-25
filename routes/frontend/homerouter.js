const express = require('express');
const homeRout = express.Router();

// routes connection
const infoRout = require('./infoRouter');
const tourRout = require('./tourRouter');
const feedbackRout = require('./feedbackRouter');
const teamRout = require('./teamRouter');

// routes
homeRout.use('/tourism', tourRout);
homeRout.use('/feedback', feedbackRout);
homeRout.use('/information', infoRout)
homeRout.use('/team', teamRout)

const slider = require('../../models/mainSlider')


homeRout.get('/', function(req, res) {
    slider.GetSlides().then(results=>{
        res.render('frontend/index',{
            title: 'Discover Aragatsotn',
            slider: results,
            css:['index.css', 'style.css']
        });
    })
});

module.exports = homeRout