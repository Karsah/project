const Admin = require("../models/admin");
const backendMenu = require('../models/backendmenu')


exports.login = function (request, response) {
    if (request.session.adminId) {
        response.redirect('/backend/adminpanel')
    } else {
        response.render("backend/login.ejs", {
            title: "Login",
            css: ["login.css"]
        })
    }
};
exports.adminPanel = function (request, response) {
    if (!request.session.adminId) {
        response.status(401).redirect('/backend')
    } else {
        Admin.getAdminInfo(request.session.adminId).then((admin) => {
            backendMenu.getMenu().then(menu=>{
                const Menu = menu
                const currentadmin = admin
                console.log(currentadmin)
                console.log(Menu)
                response.render("backend/adminPanel.ejs", {
                    title: "Admin Panel",
                    css: ["adminPanel.css"],
                    admin:currentadmin,
                    menu:Menu
                })
            })
        })
    }
};
exports.verify = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    const email = request.body.email;
    const password = request.body.password;
    const session = request.session;
    Admin.verify(email, password)
        .then((result) => {
            const pattern = /[0-9]+/g;
            if (!pattern.test(result)) {
                response.redirect("/backend");
                console.log('p');
            } else {
                session.adminId = result;
                request.params.q = "ddd";

                // localStorage.setItem('adminId',result);
                response.redirect("/backend/adminPanel")
            }
        }).catch(err => {
        console.log('1', err);
        response.redirect("/backend");
    });

};