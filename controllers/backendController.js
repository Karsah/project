const Admin = require("../models/admin");
const backendMenu = require('../models/backendmenu')

exports.login = function (request, response) {
    // if (request.session.admin.id) {
    //     response.redirect('/backend/adminpanel')
    // }else {
    response.render("backend/login.ejs", {
        title: "Login",
        css: ["login.css"]
    })
    // }
};
exports.verify = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    const email = request.body.email;
    const password = request.body.password;
    const session = request.session;
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
        }).catch(err => {
        response.redirect("/backend");
    });

};
exports.logout = function (request, response) {
    request.session.destroy();
    response.redirect('/backend')
};
exports.adminPanel = function (request, response) {
    if (!request.session.admin.id) {
        response.status(401).redirect('/backend')
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
exports.addAdminPage = function (request, response) {
    response.render('backend/addAdmin.ejs', {
        title: 'addAdmin',
        css: ['register.css', 'adminPanel.css'],
        admin: request.session.admin
    })
}

exports.addAdmin = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    const admin = [
        request.body.name,
        request.body.surname,
        request.body.email,
        request.body.password,
        '0'
    ];
    console.log(request.body.name,)
    Admin.addAdmin(admin).then(result=>{
    response.redirect('/backend/adminpanel')
    })

}


