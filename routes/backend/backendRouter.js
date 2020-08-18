const express = require('express');
const bodyParser = require("body-parser");
const backendController=require('../../controllers/backendController')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const backendRout = express.Router();
backendRout.get('/logout', function (request, response) {
        request.session.destroy();
    response.redirect('/backend')

});

backendRout.get('/adminpanel', backendController.adminPanel)

/* GET login page. */
backendRout.post('/verify',urlencodedParser, backendController.verify);
/* GET login page. */
backendRout.get('/', backendController.login);
module.exports = backendRout