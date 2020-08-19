const Admin = require("../models/admin");

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
                response.redirect("/backend/adminpanel")
            }
        }).catch(err => {
        console.log('1', err);
        response.redirect("/backend");
    });

};
exports.logout = function (request,response) {
    request.session.destroy();
    response.redirect('/backend')
}