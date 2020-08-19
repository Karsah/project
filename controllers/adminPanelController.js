const Admin = require("../models/admin");
const backendMenu = require('../models/backendmenu')


exports.adminPanel = function (request, response) {
    if (!request.session.adminId) {
        response.status(401).redirect('/backend')
    } else {
        Admin.getAdminInfo(request.session.adminId).then((admin) => {
            backendMenu.getMenu().then(menu=>{
                const Menu = menu
                const currentadmin = admin
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
exports.dashboard = function (request,response) {
    console.log('ekav bayc de che')
    response.render('backend/dashboard',{
        title:'Dashboard',
        css:["adminPanel.css"]
    })
}
