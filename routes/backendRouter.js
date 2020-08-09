const express = require('express');
const backendRout = express.Router();

backendRout.get('/',function (request,response) {
    response.render('backend/adminpanelLogin',{
        title:'Login',
        css:'adminpanelLogin.css'
    })
})
backendRout.use(function (request,response) {
    response.render('error',{
        title:'Error:404'
    })
})

module.exports = backendRout