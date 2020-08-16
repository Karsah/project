const Admin = require("../models/admin");
exports.login = function (request, response) {
    response.render("backend/login.ejs",{
        title: "Login",
        css:"login.css"
    })
};
exports.adminPanel = function (request, response) {
    console.log('mtaaa')
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
        console.log('1',err);
        response.redirect("/backend");
    });

};