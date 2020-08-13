const express = require('express');
const backendRout = express.Router();

backendRout.get('/',function (request,response) {
    response.render('backend/adminpanelLogin',{
        title:'Login',
        css:'adminpanelLogin.css'
    })
})

module.exports = backendRout