const Admin = require("../models/admin");
const bcrypt = require('bcrypt');
let saltRounds = 12

exports.login = function (request, response) {


    if (request.session.admin) {
        response.redirect('/backend/adminpanel')
    }else {
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
exports.GetAddAdminPage = function (request, response) {
    response.render('backend/addAdmin.ejs', {
        title: 'addAdmin',
        css: ['addAdmin.css', 'adminPanel.css'],
        admin: request.session.admin
    })
}
exports.addAdmin = function (request, response) {
    if (!request.body) return response.sendStatus(400);
    if(request.body.password !== request.body.confirm_pass) {
        response.redirect('/backend/addadmin')
        return
    }
    const salt = bcrypt.genSaltSync(saltRounds);
     let password = bcrypt.hashSync(request.body.password, salt);
    let is_super = request.body.is_super
    if (is_super === undefined) {is_super = '0'}
    const admin = [
        request.body.name,
        request.body.surname,
        request.body.email,
        password,
        is_super
    ];
    console.log(request.body)
    console.log('admin-',admin)
    Admin.addAdmin(admin).then(result=>{
    response.redirect('/backend/adminpanel')
    })
}

exports.manageadmins = function (request,response) {
        Admin.getAdmins().then(result=> {
            let fields = []
            let adminsArr = result
                for (let key in adminsArr[0]){
                    fields.push(key)
                }
            response.render('backend/manageAdmins',{
                title:'Manage Admins',
                css:['adminPanel.css' , 'manageAdmins.css'],
                admin:request.session.admin,
                fields:fields,
                adminsArray:adminsArr
            })
        })
}
exports.deleteadmin = function (request,response) {
    const id = request.params.id
    Admin.deleteAdmin(id)
    response.redirect('/backend/manageadmins')
}

