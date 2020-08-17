const Admin = require("../models/admin");
exports.login = function (request, response) {
    response.render("backend/login.ejs",{
        title: "Login",
        css:"login.css"
    })
};
exports.adminPanel = function (request, response) {
    response.render("backend/adminPanel.ejs",{
        title: "adminPanel",
        css:"adminPanel.css"
    })
};
exports.verify = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    const email = request.body.email;
    const password = request.body.password;
    const session = request.session;
    console.log(email)
    Admin.verify(email, password)
        .then((result) => {
            const pattern = /[0-9]+/g;
            if (!pattern.test(result)) {
                response.redirect("/backend");
            } else {
                session.adminId = result;
                console.log('ooooo')
                // localStorage.setItem('adminId',result);
                response.redirect("/backend/adminPanel")
            }
        }).catch(err => {
        response.redirect("/backend");
    });

};