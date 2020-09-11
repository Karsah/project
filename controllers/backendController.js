const Admin = require("../models/admin");
const Feedbacks = require('../models/feedback');
const Slider = require('../models/mainSlider');

let fs = require('fs')

const bcrypt = require('bcrypt');
let saltRounds = 12
const {Validator} = require('node-input-validator');

function getErrorsFromSession(session) {
    if (!session.errors) return ''
    else if (session.errors) {
        let errors = session.errors
        session.errors = []
        return errors
    }
}

//login

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

// logout and change password
exports.logout = function (request, response) {
    request.session.destroy();
    response.redirect('/backend')
};
exports.getChangePassPage = function (request, response) {
    response.render("backend/changepass.ejs", {
        title: "Change Password",
        css: ["changepass.css", 'adminPanel.css'],
        errors: getErrorsFromSession(request.session),
        admin: request.session.admin
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
            Admin.comparePass(currentpassword, sessionemail)
                .then(result => {
                    if (result) {
                        const newpassword = request.body.newpass;
                        const confirmnewpass = request.body.confirmnewpass;
                        if (newpassword != confirmnewpass) {
                            request.session.errors = ['Confirm your new password correctly']
                            response.redirect('/backend/changepass')
                        } else if (newpassword === confirmnewpass) {
                            const salt = bcrypt.genSaltSync(saltRounds);
                            let newpass = bcrypt.hashSync(newpassword, salt);
                            Admin.setNewPass(newpass, sessionemail)
                                .then(() => {
                                    request.session.destroy();
                                    response.redirect('/backend')
                                })
                                .catch((err) => {
                                })
                        }
                    } else if (!result) {
                        request.session.errors = ['Insert your current password correctly']
                        response.redirect('/backend/changepass')
                    }
                })
                .catch((result) => {
                })
        } else {
            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))
                    errors.push(v.errors[key].message)
            }
            request.session.errors = errors
            response.redirect('/backend/changepass')
        }
    })
}

// admin panel welcome
exports.adminPanel = function (request, response) {
    if (!request.session.admin) {
        response.redirect('/backend')
    } else {
        response.render("backend/adminPanel.ejs", {
            title: "Admin Panel",
            css: ["adminPanel.css"],
            admin: request.session.admin
        })
    }
};

// add admin
exports.getAddAdminPage = function (request, response) {
    response.render('backend/addAdmin.ejs', {
        title: 'addAdmin',
        css: ['addandEditForm.css', 'adminPanel.css'],
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
                    if (!is_super) is_super = '0'
                    if (is_super != '1' && is_super != '0') {
                        request.session.errors = ['Admin status is not correct']
                        response.redirect('/backend/addadmin')
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
}// manage admins
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
exports.getEditAdminPage = function (request, response) {
    Admin.getAdmin(request.params.id).then(result => response.render('backend/editAdmin.ejs', {
        title: 'editAdmin',
        editingAdminInfo: result,
        css: ['addandEditForm.css', 'adminPanel.css'],
        admin: request.session.admin,
        errors: getErrorsFromSession(request.session)
    }))


}
exports.editAdmin = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    const v = new Validator(request.body, {
        email: 'required|email',
        name: 'required',
        surname: 'required'
    });
    v.check().then((matched) => {
        if (matched) {
            Admin.isThereAdminWithThisEmail(request.body.email)
                .then((result) => {
                    if (result.length > 0 && result[0].id != request.params.id) {
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
                        request.params.id
                    ];
                    Admin.editAdmin(admin).then(()=>{
                        response.redirect('/backend/manageAdmins')
                    })
                        .catch(err=>{
                        })
                })
                .catch(()=>{
                    response.redirect('/backend/manageAdmins')
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

//manage feedbacks
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

//manage slider
exports.getManageSliderPage = function (request, response) {
    Slider.GetSlides().then((result) => {
        let fields = []
        let slidesArr = result
        for (let key in slidesArr[0]) {
            fields.push(key)
        }

        response.render('backend/manageMainSlider', {
            title: 'Manage Main SLider',
            css: ['adminPanel.css'],
            admin: request.session.admin,
            fields: fields,
            slidesArray: slidesArr,
        })
    })


}
exports.deleteslider = function (request, response) {
    const id = request.params.id
    Slider.deleteSlider(id)
    response.redirect('/backend/manageslider')
};
exports.getEditSlidePage = function (request, response) {
    Slider.getSlide(request.params.id)
        .then(result => {
            response.render('backend/editSlide.ejs', {
                title: 'Edit Slide',
                editingSlideInfo: result,
                css: ['addandEditForm.css', 'adminPanel.css'],
                admin: request.session.admin,
                errors: getErrorsFromSession(request.session)
            })
        })
        .catch(err=>{
            response.redirect(`/backend/manageslider`)
        })
}
exports.editSlide = function(request,response){
    if (!request.body) return response.sendStatus(400);
    const v = new Validator(request.body, {
        name: 'required|minLength:2',
        bg_image: 'required',
        info: 'required|minLength:20'
    });
    Slider.isThereSlideWithThisId(request.params.id).then(()=>{
            v.check().then((matched) => {
                if (matched) {
                    // image name validation
                    new Promise((resolve, reject) => {
                        const fileExtensionArr = ['.png', '.jpg', '.jpeg']
                        let fileNameArr = request.body.bg_image.split('.')
                        let extension = '.' + fileNameArr[fileNameArr.length - 1]
                        if (fileExtensionArr.includes(extension)) {
                            fs.exists(`public/frontend/images/${request.body.bg_image}`, function (exists) {
                                if (exists) resolve()
                                else reject(['There is not  Image with this name'])
                            });
                        } else if (!(fileExtensionArr.includes(extension))) reject(['wrong image extension'])
                    })
                        .then(() => {
                            const slide = [
                                request.body.name,
                                request.body.info,
                                request.body.bg_image,
                                request.params.id
                            ]
                            Slider.updateSlide(slide)
                                .then(() => response.redirect('/backend/manageslider'))
                                .catch(() => {
                                })
                        })
                        .catch((prError) => {
                            request.session.errors = prError
                            response.redirect('/backend/addslide')
                        })

                } else if (!matched) {
                    let errors = [];
                    for (let key in v.errors) {
                        if (v.errors.hasOwnProperty(key))
                            errors.push(v.errors[key].message)
                    }

                    request.session.errors = errors
                    response.redirect('/backend/addslide')
                }
            })

        })
        .catch(()=>{
            response.redirect('/backend/manageslider')
        })


}

exports.getAddSlidePage = function (request, response) {
    response.render('backend/addSlide', {
        title: 'Add SLide',
        css: ['adminPanel.css', 'addandEditForm.css'],
        admin: request.session.admin,
        errors: getErrorsFromSession(request.session)
    })
}
exports.addSlide = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    const v = new Validator(request.body, {
        name: 'required|minLength:2',
        bg_image: 'required',
        info: 'required|minLength:20'
    });

    v.check().then((matched) => {
        if (matched) {
            // image name validation
            new Promise((resolve, reject) => {
                const fileExtensionArr = ['.png', '.jpg', '.jpeg']
                let fileNameArr = request.body.bg_image.split('.')
                let extension = '.' + fileNameArr[fileNameArr.length - 1]
                if (fileExtensionArr.includes(extension)) {
                    fs.exists(`public/frontend/images/${request.body.bg_image}`, function (exists) {
                        if (exists) resolve()
                        else reject(['There is not  Image with this name'])
                    });
                } else if (!(fileExtensionArr.includes(extension))) reject(['wrong image extension'])
            })
                .then(() => {
                    const slide = [
                        request.body.name,
                        request.body.info,
                        request.body.bg_image
                    ]
                    Slider.CreateSlide(slide)
                        .then(() => response.redirect('/backend/manageslider'))
                        .catch(() => {
                        })
                })
                .catch((prError) => {
                    request.session.errors = prError
                    response.redirect('/backend/addslide')
                })

        } else if (!matched) {
            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))
                    errors.push(v.errors[key].message)
            }

            request.session.errors = errors
            response.redirect('/backend/addslide')
        }
    })
}

//upload image
exports.getUploadImagePage = function (request, response) {

    response.render('backend/uploadImage', {
        title: 'Upload Image',
        css: ['adminPanel.css', 'addandEditForm.css'],
        admin: request.session.admin,
        errors: getErrorsFromSession(request.session)
    })
}
exports.uploadimage = function (request, response) {
    let filedata = request.file;
    if (!filedata) {
        request.session.errors = ['No file selected']
        response.redirect('/backend/uploadimage')
    }

    const v = new Validator(request.body, {
        storage: 'required',
        name: 'required',
    });
    v.check().then((matched) => {
        if (matched) {
            new Promise((resolve, reject) => {
                //    storage checking
                let storageArr = ['backend', 'frontend']
                if (storageArr.includes(request.body.storage)) {
                    // file name validation
                    const fileExtensionArr = ['.png', '.jpg', '.jpeg']
                    let fileNameArr = request.body.name.split('.')
                    let extension = '.' + fileNameArr[fileNameArr.length - 1]
                    if (fileExtensionArr.includes(extension)) resolve()
                    else if (!(fileExtensionArr.includes(extension))) reject(['wrong file extension'])
                } else if (!(storageArr.includes(request.body.storage))) reject(['wrong storage selected'])
            })
                .then(() => {
                    function callback(err) {
                        if (err) {
                            request.session.errors = prError
                            response.redirect('/backend/uploadimage');
                        }
                    }

                    fs.copyFile(`public/uploads/${filedata.originalname}`, `public/${request.body.storage}/images/${request.body.name}`, callback);
                    fs.unlink(`public/uploads/${filedata.originalname}`, (err) => {
                        if (err) throw err;
                    });
                    response.redirect('/backend/uploadimage')
                })
                .catch((prError) => {
                    fs.unlink(`public/uploads/${filedata.originalname}`, (err) => {
                        if (err) throw err;
                    });
                    request.session.errors = prError
                    response.redirect('/backend/uploadimage')
                })
        } else if (!matched) {
            let errors = [];
            for (let key in v.errors) {
                if (v.errors.hasOwnProperty(key))
                    errors.push(v.errors[key].message)
            }

            fs.unlink(`public/uploads/${filedata.originalname}`, (err) => {
                if (err) throw err;
            });
            request.session.errors = errors
            response.redirect('/backend/uploadimage')
        }
    })
}


