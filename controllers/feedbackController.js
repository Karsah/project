const feedbacksmodel = require('../models/feedback')
const {Validator} = require('node-input-validator');

function getErrorsFromFeedback(session) {
    if (!session.errors) return ''
    else if (session.errors) {
        let errors = session.errors
        session.errors = []
        return errors
    }
}

module.exports.getFeedbackPage = function (request, response) {
    response.render('frontend/feedback', {
        title: 'Feedback',
        css: ['style.css', 'feedback.css'],
        errors:getErrorsFromFeedback(request.session)
    })
}

module.exports.getOthersFeedbacksPage = function (request, response) {
    feedbacksmodel.getAllFeedbacksForFrontend()
        .then((allfeedbacks)=> {
        let feedbacksArr
        if (!allfeedbacks) feedbacksArr = [null,'SORRY but there is not any Feedbacks yet !']
        else feedbacksArr = allfeedbacks

        response.render('frontend/othersfeedbacks', {
            title: 'Others Feedbacks',
            css: ['style.css', 'othersFeedbacks.css'],
            back: 'feedback',
            errors:getErrorsFromFeedback(request.session),
            feedbacks: feedbacksArr
        })
    })
        .catch(()=>internalServerError(response))

}

module.exports.getLeaveFeedbackPage = function (request, response) {
    response.render('frontend/leavefeedback', {
        title: 'Leave Feedback',
        css: ['style.css', 'leaveFeedback.css'],
        back: 'feedback',
        errors:getErrorsFromFeedback(request.session)

    })
}

module.exports.leaveFeedback = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    const v = new Validator(request.body, {
        name: 'required',
        surname: 'required',
        email: 'required|email',
        age: 'required',
        message: 'required'
    });
    v.check().then((matched) => {
        if (matched) {

            let feedback = [
                request.body.starscount,
                request.body.name,
                request.body.surname,
                request.body.email,
                request.body.age,
                request.body.message
            ]
            feedbacksmodel.addFeedback(feedback).then(()=>{
                response.redirect('/feedback')
            })
                .catch(()=>internalServerError(response))

        }else {
            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))
                    console.log(key)
                    errors.push(v.errors[key].message)
            }
            request.session.errors = v.errors;
            response.redirect('/feedback/leavefeedback')
        }
    })
}