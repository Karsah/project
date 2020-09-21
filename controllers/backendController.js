const Admin = require("../models/admin");
const Feedbacks = require('../models/feedback');
const Slider = require('../models/mainSlider');

let fs = require('fs')


const bcrypt = require('bcrypt');
let saltRounds = 12
const {Validator} = require('node-input-validator');

// functons

// Internal server error
function internalServerError(request, response) {
    let logined = request.session.admin ? true : false
    response.render('serverError.ejs', {
        title: 'Server Error',
        end:'back',
        logined: logined
    })
}

// function to set Errors in session
function setErrorsInSession(request, response, errors, redirect, category = 'written') {
    if (Array.isArray(errors) && category === 'written') {
        request.session.errors = errors
        response.redirect(redirect)
    } else if (typeof errors == 'object' && category == 'validator') {
        let errorsArr = [];
        for (let key in errors) {
            if (errors.hasOwnProperty(key))
                errorsArr.push(errors[key].message)
        }
        request.session.errors = errorsArr
        response.redirect(redirect)
    }
}

// function to get Errors from session
function getErrorsFromSession(session) {
    if (!session.errors || session.errors.length === 0) {
        return ''
    } else if (session.errors.length > 0) {
        let errors = session.errors
        session.errors = []
        return errors
    }
}

// function to set message in session
function setMessageInSession(request, response, messageCategory, messageContent, redirectTo) {
    request.session.message = {
        category: messageCategory,
        message: messageContent,
    }
    if (redirectTo) response.redirect(redirectTo)
}

//function to get message from session

function getMessageFromSession(session) {
    if (!session.message) return ''
    else if (session.message) {
        let message = session.message
        session.message = 0
        return message
    }
}


//login
exports.login = function (request, response) {
    if (request.session.admin) {
        response.redirect('/backend/adminpanel')
    } else {
        console.log(request.session.message)
        console.log(request.session.errors)
        response.render("backend/login.ejs", {
            title: "Login",
            css: ["login.css", 'adminPanel.css'],
            errors: getErrorsFromSession(request.session),
            message: getMessageFromSession(request.session)
        })
    }

};
exports.verify = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    const email = request.body.email;
    const password = request.body.password;
    let session = request.session
    const v = new Validator(request.body, {
        email: 'required|email',
        password: 'required'
    });

    v.check().then((matched) => {
        if (matched) {
            Admin.verify(email, password).then((result) => {
                if (result == 'incorrect') {
                    let Writtenerror = ['The password you entered is incorrect']
                    setErrorsInSession(request, response, Writtenerror, '/backend',)
                    return
                } else if (result == 'no admin') {
                    let Writtenerror = ['There is no admin with the email you wrote']
                    setErrorsInSession(request, response, Writtenerror, '/backend',)
                    return
                } else if (typeof result === 'object') {
                    const pattern = /[0-9]+/g;
                    if (!pattern.test(result.id)) {
                        response.redirect("/backend");
                    } else {
                        session.admin = result;
                        session.admin.email = email
                        response.redirect("/backend/adminpanel")
                    }
                }

            })
                .catch(() => {
                    internalServerError(request, response)
                })

        } else {
            setErrorsInSession(request, response, v.errors, '/backend', 'validator')
        }
    })
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
    v.check()
        .then(matched => {
            if (matched) {
                const currentpassword = request.body.currentpass;
                const sessionemail = request.session.admin.email
                Admin.comparePass(currentpassword, sessionemail)
                    .then(result => {
                        if (result) {
                            const newpassword = request.body.newpass;
                            const confirmnewpass = request.body.confirmnewpass;
                            if (newpassword != confirmnewpass) {
                                let Writtenerror = ['Confirm your new password correctly']
                                setErrorsInSession(request, response, Writtenerror, '/backend/changepass', 'written')
                            } else if (newpassword === confirmnewpass) {
                                const salt = bcrypt.genSaltSync(saltRounds);
                                let newpass = bcrypt.hashSync(newpassword, salt);
                                Admin.setNewPass(newpass, sessionemail)
                                    .then(() => {
                                        request.session.destroy();
                                        response.redirect('/backend')
                                    })
                                    .catch(() => {
                                        internalServerError(request, response)
                                    })

                            }
                        } else if (!result) {

                            let Writtenerror = ['Insert your current password correctly']
                            setErrorsInSession(request, response, Writtenerror, '/backend/changepass', 'written')

                        }
                    })
                    .catch(() => {
                        internalServerError(request, response)
                    })

            } else {
                setErrorsInSession(request, response, v.errors, '/backend/changepass', 'validator')
            }
        })
}

// admin panel welcome
exports.adminPanel = function (request, response) {
    response.render("backend/adminPanel.ejs", {
        title: "Admin Panel",
        css: ["adminPanel.css"],
        admin: request.session.admin,
        message: getMessageFromSession(request.session)

    })
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
        let Writtenerror = ['Please confirm password correctly']
        setErrorsInSession(request, response, Writtenerror, '/backend/addadmin', 'written')
    }
    const v = new Validator(request.body, {
        email: 'required|email',
        password: 'required|minLength:5',
        name: 'required',
        surname: 'required'
    });
    v.check()
        .then((matched) => {
            if (matched) {
                Admin.isThereAdminWith('email', request.body.email)
                    .then(result => {
                        if (result.length > 0) {
                            let Writtenerror = ['Already there is admin with email you entered']
                            setErrorsInSession(request, response, Writtenerror, '/backend/addadmin', 'written')
                        }
                        const salt = bcrypt.genSaltSync(saltRounds);
                        let password = bcrypt.hashSync(request.body.password, salt);
                        const admin = [
                            request.body.name,
                            request.body.surname,
                            request.body.email,
                            password
                        ];
                        Admin.addAdmin(admin)
                            .then(() => {
                                setMessageInSession(request, response, 'success', 'Admin was added successfuly', '/backend/manageadmins')
                            })
                            .catch(() => {
                                internalServerError(request, response)
                            })

                    })
                    .catch(() => {
                        internalServerError(request, response)
                    })

            } else {
                setErrorsInSession(request, response, v.errors, '/backend/addadmin', 'validator')
            }
        })
}
// manage admins
exports.manageadmins = function (request, response) {
    Admin.getAdmins()
        .then(result => {
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
                adminsArray: adminsArr,
                message: getMessageFromSession(request.session)
            })
        })
        .catch(() => {
            internalServerError(request, response)
        })
}
exports.deleteadmin = function (request, response) {
    if (request.session.admin.is_super != '1') {
        setMessageInSession(request, response,
            'warning', 'You have no right to perform such an action', '/backend/adminpanel')

    } else {
        let id = request.params.id
        Admin.isThereAdminWith('id', id)
            .then((result) => {
                if (result.length > 0) {
                    Admin.deleteAdmin(id)
                        .then(() => {
                            setMessageInSession(request, response, 'success',
                                `Admin with id ${id} was deleted`, '/backend/manageadmins')
                        })
                        .catch(() => {
                            internalServerError(request, response)
                        })
                } else {
                    setMessageInSession(request, response, 'unsuccess', 'There is not admin with this ID', '/backend/manageadmins')
                }
            }).catch(() => {
            internalServerError(request, response)
        })


    }
};
exports.sendDeleteQuestion = function (request, response) {
    console.log('request url',)
    console.log('params', request.params)
    setMessageInSession(request, response, 'question', {
        cont: `Do you want to delete ${request.params.item} with id`,
        param: `${request.params.id}`,
        deletebtn: `${request.headers.referer}/delete/${request.params.id}`
    }, request.headers.referer)
}
exports.getEditAdminPage = function (request, response) {
    Admin.getAdmin(request.params.id)
        .then(result => response.render('backend/editAdmin.ejs', {
            title: 'Edit Admin',
            editingAdminInfo: result,
            css: ['addandEditForm.css', 'adminPanel.css'],
            admin: request.session.admin,
            errors: getErrorsFromSession(request.session)
        }))
        .catch(() => {
            internalServerError(request, response)
        })

}
exports.editAdmin = function (request, response) {
    let id = request.params.id
    // check is there this editing admin
    Admin.isThereAdminWith('id', id)
        .then((result) => {
            if (result.length > 0) {
                if (!request.body) return response.sendStatus(400);
                const v = new Validator(request.body, {
                    email: 'required|email',
                    name: 'required',
                    surname: 'required'
                });
                v.check()
                    .then((matched) => {
                        if (matched) {
                            Admin.isThereAdminWith('email', request.body.email)
                                .then((result) => {
                                    if (result.length > 0 && result[0].id != id) {
                                        response.redirect(`/backend`)
                                        let Writtenerror = ['Already there is admin with email you entered']
                                        setErrorsInSession(request, response, Writtenerror, `/backend/manageadmins/editadmin/${id}`, 'written')
                                    } else {
                                        const admin = [
                                            request.body.name,
                                            request.body.surname,
                                            request.body.email,
                                            id
                                        ];
                                        Admin.editAdmin(admin).then(() => {
                                            setMessageInSession(request, response, 'success', `Admin with id ${id} was edited`, '/backend/manageAdmins')
                                        })
                                            .catch(() => {
                                                internalServerError(request, response)
                                            })
                                    }


                                })
                                .catch(() => {
                                    internalServerError(request, response)
                                })

                        } else {
                            setErrorsInSession(request, response, v.errors, `/backend/manageadmins/editadmin/${id}`, 'validator')
                        }
                    })
            } else {
                setMessageInSession(request, response, 'unsuccess', 'there is no admin you chose', '/backend/manageadmins')
            }
        })

}

//manage feedbacks
exports.getManageFeedbacksPage = function (request, response) {
    Feedbacks.getAllFeedbacksForManagement()
        .then(result => {
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
                message: getMessageFromSession(request.session)
            })
        })
        .catch(() => {
            internalServerError(request, response)
        })
}
exports.deleteFeedback = function (request, response) {
    let id = request.params.id
    Feedbacks.isThereFeedback(id)
        .then((result) => {
            if (result) {
                Feedbacks.deleteFeedback(id)
                    .then(() => {
                        setMessageInSession(request, response, 'success', `feedback with id ${id} was deleted`, '/backend/managefeedbacks')
                    })
                    .catch(() => {
                        internalServerError(request, response)
                    })
            } else if (!result) {
                setMessageInSession(request, response, 'unsuccess', `there is not feedback with id ${id}`, '/backend/managefeedbacks')
            }
        })
        .catch(() => {
            internalServerError(request, response)
        })
}
exports.blockFeedback = function (request, response) {
    let id = request.params.id
    Feedbacks.isThereFeedback(id)
        .then((result) => {
            if (result) {
                Feedbacks.blockFeedback(id)
                    .then(() => {
                        setMessageInSession(request, response, 'success', `feedback with id ${id} was blocked`, '/backend/managefeedbacks')
                    })
                    .catch(() => {
                        internalServerError(request, response)
                    })
            } else if (!result) {
                setMessageInSession(request, response, 'unsuccess', `there is not feedback with id ${id}`, '/backend/managefeedbacks')
            }
        })
        .catch(() => {
            internalServerError(request, response)
        })
}
exports.unblockFeedback = function (request, response) {
    let id = request.params.id
    Feedbacks.isThereFeedback(id)
        .then((result) => {
            if (result) {
                Feedbacks.unblockFeedback(id)
                    .then(() => {
                        setMessageInSession(request, response, 'success', `feedback with id ${id} was unblocked`, '/backend/managefeedbacks')
                    })
                    .catch(() => {
                        internalServerError(request, response)
                    })
            } else if (!result) {
                setMessageInSession(request, response, 'unsuccess', `there is not feedback with id ${id}`, '/backend/managefeedbacks')
            }
        })
        .catch(() => {
            internalServerError(request, response)
        })

}

//manage slider
exports.getManageSliderPage = function (request, response) {
    Slider.GetSlides()
        .then((result) => {
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
                message:getMessageFromSession(request.session)
            })
        })
        .catch(() => {
            internalServerError(request, response)
        })

}
exports.deleteslider = function (request, response) {
    const id = request.params.id
    Slider.isThereSlide(id)
        .then((result)=>{
            if(result){
                Slider.deleteSlider(id)
                    .then(() => {
                        setMessageInSession(request, response, 'success', `Slide with id ${id} was deleted`, '/backend/manageslider')
                    })
                    .catch(() => {
                        internalServerError(request, response)
                    })
            }else if (!result){
                setMessageInSession(request,response,'unsuccess',`there is not slide with id ${id}`,'/backend/manageslider')

            }
        })
        .catch(()=>{
            internalServerError(request,response)
        })

};
exports.getEditSlidePage = function (request, response) {
    Slider.getSlide(request.params.id)
        .then(result => {
            fs.readdir('public/frontend/images', (err, files) => {
                if (err) internalServerError(request, response)
                else {
                    response.render('backend/editSlide.ejs', {
                        title: 'Edit Slide',
                        editingSlideInfo: result,
                        css: ['addandEditForm.css', 'adminPanel.css'],
                        admin: request.session.admin,
                        errors: getErrorsFromSession(request.session),
                        filesArr: files
                    })
                }
            })
        })
        .catch(() => {
            internalServerError(request, response)
        })

}
exports.editSlide = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    let id = request.params.id
    Slider.isThereSlide(id)
        .then((result) => {
            if (result){
                const v = new Validator(request.body, {
                    name: 'required|minLength:2',
                    bg_image: 'required',
                    info: 'required|minLength:20'
                });
                v.check()
                    .then((matched) => {
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
                                        id
                                    ]
                                    Slider.updateSlide(slide)
                                        .then(() =>setMessageInSession(request,response,'success',`slide with id ${id} was edited`,'/backend/manageslider'))
                                        .catch(() => {
                                            internalServerError(request, response)
                                        })
                                })
                                .catch((prError) => {
                                    let Writtenerror = prError
                                    setErrorsInSession(request, response, Writtenerror, `/backend/manageslider/editslide/${id}`, 'written')
                                })

                        } else if (!matched) {
                            setErrorsInSession(request, response, v.errors, `/backend/manageslider/editslide/${id}`, 'validator')
                        }
                    })
            }else if(!result){
                setMessageInSession(request,response,'unsuccess',`there is not slide with id ${id}`,'/backend/manageslider')
            }

        })
        .catch(() => {
            internalServerError(request, response)
        })

}

exports.getAddSlidePage = function (request, response) {
    fs.readdir('public/frontend/images', (err, files) => {
        if (err) {
            internalServerError(request, response)
        } else {
            response.render('backend/addSlide', {
                title: 'Add SLide',
                css: ['adminPanel.css', 'addandEditForm.css'],
                admin: request.session.admin,
                errors: getErrorsFromSession(request.session),
                filesArr: files
            })
        }
    })
}
exports.addSlide = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    const v = new Validator(request.body, {
        name: 'required|minLength:2',
        bg_image: 'required',
        info: 'required|minLength:20'
    });

    v.check()
        .then((matched) => {
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
                            .then(() => setMessageInSession(request, response, 'success', 'Slide was added', '/backend/manageslider'))
                            .catch(() => {
                                internalServerError(request, response)
                            })

                    })
                    .catch((prError) => {
                        let Writtenerror = prError
                        setErrorsInSession(request, response, Writtenerror, '/backend/addslide', 'written')
                    })

            } else if (!matched) {
                setErrorsInSession(request, response, v.errors, '/backend/addslide', 'validator')
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
        let Writtenerror = ['No file selected']
        setErrorsInSession(request, response, Writtenerror, '/backend/uploadimage', 'written')
    }

    const v = new Validator(request.body, {
        storage: 'required',
        name: 'required',
    });
    v.check()
        .then((matched) => {
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
                                let Writtenerror = prError
                                setErrorsInSession(request, response, Writtenerror, '/backend/uploadimage', 'written')
                            }
                        }

                        fs.copyFile(`public/uploads/${filedata.originalname}`, `public/${request.body.storage}/images/${request.body.name}`, callback);
                        fs.unlink(`public/uploads/${filedata.originalname}`, (err) => {
                            if (err) throw err;
                        });
                        setMessageInSession(request,response,'success',`Image with name ${request.body.name} was uploaded to ${request.body.storage} storage`,'/backend/adminpanel')
                    })
                    .catch((prError) => {
                        fs.unlink(`public/uploads/${filedata.originalname}`, (err) => {
                            if (err) throw err;
                        });
                        let Writtenerror = prError
                        setErrorsInSession(request, response, Writtenerror, '/backend/uploadimage', 'written')

                    })
            } else if (!matched) {

                fs.unlink(`public/uploads/${filedata.originalname}`, (err) => {
                    if (err) throw err;
                });
                setErrorsInSession(request, response, v.errors, '/backend/uploadimage', 'validator')
            }
        })
}