const feedbacksmodel = require('../models/feedback')

module.exports.getFeedbackPage = function (request, response) {
    response.render('frontend/feedback', {
        title: 'Feedback',
        css: ['style.css', 'feedback.css']
    })
}

module.exports.getOthersFeedbacksPage = function (request, response) {
    feedbacksmodel.getAllFeedbacksForFrontend().then(allfeedbacks => {
        let feedbacksArr
        if (!allfeedbacks) feedbacksArr = [null,'SORRY but there is not any Feedbacks yet !']
        else feedbacksArr = allfeedbacks

        response.render('frontend/othersfeedbacks', {
            title: 'Others Feedbacks',
            css: ['style.css', 'othersFeedbacks.css'],
            back: 'feedback',
            feedbacks: feedbacksArr
        })
    })
}

module.exports.getLeaveFeedbackPage = function (request, response) {
    response.render('frontend/leavefeedback', {
        title: 'Leave Feedback',
        css: ['style.css', 'leaveFeedback.css'],
        back: 'feedback'
    })
}

module.exports.leaveFeedback = function (request, response) {

    let feedback = [
        request.body.starscount,
        request.body.name,
        request.body.surname,
        request.body.email,
        request.body.age,
        request.body.message
    ]
    feedbacksmodel.addFeedback(feedback)
    response.redirect('/feedback')
    console.log(admin)
}