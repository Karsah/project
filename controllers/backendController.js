const Admin = require("../models/admin");
const Feedbacks = require('../models/feedback');

const bcrypt = require('bcrypt');
let saltRounds = 12
const {Validator} = require('node-input-validator');

exports.login = function (request, response) {


    if (request.session.admin) {
        response.redirect('/backend/adminpanel')
    } else {
        let errors = (!request.session.errors) ? "" : request.session.errors;
        console.log('errors' , errors)
        response.render("backend/login.ejs", {
            title: "Login",
            css: ["login.css"],
            errors: errors
        })
    }

};
exports.verify = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    const email = request.body.email;
    const password = request.body.password;
    const session = request.session;
    const v = new Validator(request.body, {
        email: 'required|email',
        password: 'required'
    });

    v.check().then((matched) => {
        if (matched) {
            Admin.verify(email, password)
                .then((result) => {
                    const pattern = /[0-9]+/g;
                    if (!pattern.test(result.id)) {
                        response.redirect("/backend");
                    } else {
                        session.admin = result;
                        session.admin.email = email
                        response.redirect("/backend/adminpanel")
                    }
                })
                .catch(errors => {
                    session.errors = errors
                    response.redirect("/backend")
                })
        } else {

            let errors=[];
            for (let key in v.errors){
                if(v.errors.hasOwnProperty(key))
                    errors.push(v.errors[key].message)
            }
            session.errors = errors
            response.redirect('/backend')
        }
    });


};
exports.logout = function (request, response) {
    request.session.destroy();
    response.redirect('/backend')
};
exports.adminPanel = function (request, response) {
    if (!request.session.admin) {
        response.redirect('/backend')
    } else {
        response.render("backend/adminPanel.ejs", {
            title: "Admin Panel",
            css: ["adminPanel.css"],
            admin: request.session.admin,
        })
    }
};
exports.dashboard = function (request, response) {
    response.render('backend/dashboard', {
        title: 'Dashboard',
        css: ['adminPanel.css'],
        admin: request.session.admin
    })
}
exports.getAddAdminPage = function (request, response) {
    let errors = (!request.session.addAdminErrors) ? "" : request.session.addAdminErrors;

    response.render('backend/addAdmin.ejs', {
        title: 'addAdmin',
        css: ['addAdmin.css', 'adminPanel.css'],
        admin: request.session.admin,
        errors: errors
    })
    console.log(request.session.admin.email)
}

exports.addAdmin = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    if (request.body.password !== request.body.confirm_pass) {
        request.session.addAdminErrors = ['Please confirm password correctly']
        response.redirect('/backend/addadmin')
    }

    const v = new Validator(request.body, {
        email: 'required|email',
        password: 'required',
        name: 'required',
        surname: 'required'
    });
    v.check().then((matched) => {
        if(matched) {
            Admin.isThereAdminWithThisEmail(request.body.email)
                .then(result=>{
                if (result.length > 0){
                    request.session.addAdminErrors = ['Already there is admin with email you entered']
                    response.redirect('/backend/addadmin')
                }
                    const salt = bcrypt.genSaltSync(saltRounds);
                    let password = bcrypt.hashSync(request.body.password, salt);
                    let is_super = request.body.is_super
                    if (!is_super) {
                        is_super = '0'
                    }
                    const admin = [
                        request.body.name,
                        request.body.surname,
                        request.body.email,
                        password,
                        is_super
                    ];
                    Admin.addAdmin(admin).then(result => {

                        response.redirect('/backend/adminpanel')
                    })
            })
        }else{
            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))
                    errors.push(v.errors[key].message)
            }
            request.session.addAdminErrors = errors
            response.redirect('/backend/addadmin')

        }
    })
}

exports.manageadmins = function (request, response) {
    Admin.getAdmins().then(result => {
        let fields = []
        let adminsArr = result
        for (let key in adminsArr[0]) {
            fields.push(key)
        }
        response.render('backend/manageAdmins', {
            title: 'Manage Admins',
            css: ['adminPanel.css', 'manageAdmins.css'],
            admin: request.session.admin,
            fields: fields,
            adminsArray: adminsArr
        })
    })
}
exports.deleteadmin = function (request, response) {
    const id = request.params.id
    Admin.deleteAdmin(id)
    response.redirect('/backend/manageadmins')
};
exports.editAdmin = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    let is_super = request.body.is_super
    if (is_super === undefined) {
        is_super = '0'
    }
    const admin = [
        request.body.name,
        request.body.surname,
        request.body.email,
        is_super,
        request.body.id

    ];
    Admin.editAdmin(admin).then(result => {
        response.redirect('/backend/manageadmins')
    })
}
exports.getEditAdmin = function (request, response) {
    Admin.getAdmin(request.params.id).then(result => response.render('backend/editAdmin.ejs', {
        title: 'editAdmin',
        editingAdminInfo: result,
        css: ['addAdmin.css', 'adminPanel.css'],
        admin: request.session.admin
    }))


}

exports.getManageFeedbacksPage = function (request, response) {
    Feedbacks.getAllFeedbacksForManagement().then(result => {
        let fields = []
        let feedbacksArr = result
        for (let key in feedbacksArr[0]) {
            fields.push(key)
        }

        response.render('backend/manageFeedbacks', {
            title: 'Manage Feedbacks',
            css: ['adminPanel.css', 'manageFeedbacks.css'],
            admin: request.session.admin,
            fields: fields,
            feedbacksArray: feedbacksArr

        })
    })

}
exports.deleteFeedback = function (request, response) {
    const id = request.params.id
    Feedbacks.deleteFeedback(id)
    response.redirect('/backend/managefeedbacks')
}
exports.blockFeedback = function (request, response) {
    const id = request.params.id
    Feedbacks.blockFeedback(id)
    response.redirect('/backend/managefeedbacks')
}
exports.unblockFeedback = function (request, response) {
    const id = request.params.id
    Feedbacks.unblockFeedback(id)
    response.redirect('/backend/managefeedbacks')
}
