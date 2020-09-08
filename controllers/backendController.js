const Admin = require("../models/admin");
const Feedbacks = require('../models/feedback');

const bcrypt = require('bcrypt');
let saltRounds = 12
const {Validator} = require('node-input-validator');

function getErrorsFromSession(session) {
    if (!session.errors) return  ''
    else if (session.errors) {
        let errors =session.errors
        session.errors = []
        return errors
    }
}

exports.login = function (request, response) {
    if (request.session.admin) {
        response.redirect('/backend/adminpanel')
    } else {
        response.render("backend/login.ejs", {
            title: "Login",
            css: ["login.css", 'adminPanel.css'],
            errors: getErrorsFromSession(request.session)
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

            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))

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
exports.getChangePassPage = function (request, response) {
    response.render("backend/changepass.ejs", {
        title: "Change Password",
        css: ["changepass.css", 'adminPanel.css'],
        errors: changePassErrors,
        admin:getErrorsFromSession(request.session),
    })
}
exports.changePass = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    const v = new Validator(request.body, {
        currentpass: 'required',
        newpass: 'required|minLength:5',
        confirmnewpass: 'required|minLength:5'
    });
    v.check().then(matched => {
        if (matched) {
            const currentpassword = request.body.currentpass;
            const sessionemail = request.session.admin.email
            console.log(sessionemail)
            Admin.comparePass(currentpassword, sessionemail)
                .then(result => {
                    console.log('type', result, typeof result)
                    if (result) {
                        const newpassword = request.body.newpass;
                        const confirmnewpass = request.body.confirmnewpass;
                        console.log(newpassword, confirmnewpass)
                        if (newpassword != confirmnewpass) {
                            console.log('havasar chein')
                            request.session.changepasserrors = ['Confirm your new password correctly']
                            response.redirect('/backend/changepass')
                        } else if (newpassword === confirmnewpass) {
                            console.log('havasar ein')
                            console.log('new password', newpassword)
                            const salt = bcrypt.genSaltSync(saltRounds);
                            let newpass = bcrypt.hashSync(newpassword, salt);
                            console.log('new password hash', newpass)
                            Admin.setNewPass(newpass, sessionemail)
                                .then(() => {
                                    request.session.destroy();
                                    response.redirect('/backend')
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                    } else if (!result) {
                        console.log('res', result)
                        console.log('type', typeof result)
                        console.log('resolved')
                        request.session.changepasserrors = ['Insert your current password correctly']
                        response.redirect('/backend/changepass')
                    }
                })
                .catch((result) => {
                    console.log(result)
                })
        } else {
            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))
                    errors.push(v.errors[key].message)
            }
            request.session.changepasserrors = errors
            response.redirect('/backend/changepass')
        }
    })
}


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
    response.render('backend/addAdmin.ejs', {
        title: 'addAdmin',
        css: ['addAdmin.css', 'adminPanel.css'],
        admin: request.session.admin,
        errors: getErrorsFromSession(request.session)
    })
}

exports.addAdmin = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    if (request.body.password !== request.body.confirm_pass) {
        request.session.errors = ['Please confirm password correctly']
        response.redirect('/backend/addadmin')
    }

    const v = new Validator(request.body, {
        email: 'required|email',
        password: 'required',
        name: 'required',
        surname: 'required'
    });
    v.check().then((matched) => {
        if (matched) {
            Admin.isThereAdminWithThisEmail(request.body.email)
                .then(result => {
                    if (result.length > 0) {
                        request.session.errors = ['Already there is admin with email you entered']
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
        } else {
            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))
                    errors.push(v.errors[key].message)
            }
            request.session.errors = errors
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
            css: ['adminPanel.css'],
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
exports.getEditAdmin = function (request, response) {
    Admin.getAdmin(request.params.id).then(result => response.render('backend/editAdmin.ejs', {
        title: 'editAdmin',
        editingAdminInfo: result,
        css: ['addAdmin.css', 'adminPanel.css'],
        admin: request.session.admin,
        errors:getErrorsFromSession(request.session)
    }))


}

exports.editAdmin = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    const v = new Validator(request.body, {
        email: 'required|email',
        name: 'required',
        surname: 'required'
    });
    console.log(request.params.id)
    v.check().then((matched) => {
        if (matched) {
            Admin.isThereAdminWithThisEmail(request.body.email)
                .then(result => {
                    if (result.length > 0) {
                        request.session.errors = ['Already there is admin with email you entered']
                        response.redirect(`/backend/manageadmins/editadmin/${request.params.id}`)
                    }
                    let is_super = request.body.is_super
                    if (!is_super) is_super = '0'
                    if (is_super != '1' && is_super != '0') {
                        request.session.errors = ['Admin status is not correct']
                        response.redirect(`/backend/manageadmins/editadmin/${request.params.id}`)
                    }

                    const admin = [
                        request.body.name,
                        request.body.surname,
                        request.body.email,
                        is_super,
                        request.body.id
                    ];
                    Admin.editAdmin(admin).then(result => {

                        response.redirect('/backend/manageAdmins')
                    })
                })
        } else {
            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))
                    errors.push(v.errors[key].message)
            }
            request.session.errors = errors
            response.redirect(`/backend/manageadmins/editadmin/${request.params.id}`)

        }
    })
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
            css: ['adminPanel.css'],
            admin: request.session.admin,
            fields: fields,
            feedbacksArray: feedbacksArr,
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

exports.getManageSliderPage = function (request, response) {
}

