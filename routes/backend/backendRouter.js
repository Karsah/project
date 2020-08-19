const express = require('express');
const backendRout = express.Router();

const bodyParser = require("body-parser");

const backendController=require('../../controllers/backendController')

const urlencodedParser = bodyParser.urlencoded({extended: false})

/* Get admin panel*/


backendRout.get('/manageadmins/delete/:id', backendController.deleteadmin);
backendRout.get('/manageadmins', backendController.manageadmins);
backendRout.get('/dashboard', backendController.dashboard);
<<<<<<< HEAD
backendRout.get('/addadmin', backendController.addAdminPage)
backendRout.post('/addadmin/add',urlencodedParser,backendController.addAdmin);
=======
backendRout.get('/adminpanel', backendController.adminPanel)
>>>>>>> 2e647527f5156dda81da72a35bc2a5bc4cbb43ab
// logout from account
backendRout.get('/logout',backendController.logout);
/* Verify email and password. */
backendRout.post('/verify',urlencodedParser, backendController.verify);
/* GET login page. */
backendRout.get('/', backendController.login);
module.exports = backendRout