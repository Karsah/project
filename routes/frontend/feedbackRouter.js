const express = require('express');
const feedbackRout = express.Router();

const feedbackController = require('../../controllers/feedbackController')

feedbackRout.post('/leavefeedback/leave', feedbackController.leaveFeedback);

feedbackRout.get('/leaveFeedback', feedbackController.getLeaveFeedbackPage);

feedbackRout.get('/othersfeedbacks', feedbackController.getOthersFeedbacksPage );

feedbackRout.get('/', feedbackController.getFeedbackPage);
module.exports = feedbackRout;

