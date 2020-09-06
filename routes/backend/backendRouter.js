const express = require('express');
const backendRout = express.Router();

const bodyParser = require("body-parser");

const backendController=require('../../controllers/backendController')

const urlencodedParser = bodyParser.urlencoded({extended: false})

/* Get */

backendRout.post('/changepass/change',backendController.changePass)
backendRout.get('/changepass',backendController.getChangePassPage)

backendRout.get('/manageslider',backendController.getManageSliderPage)

backendRout.get('/managefeedbacks/unblock/:id',backendController.unblockFeedback)
backendRout.get('/managefeedbacks/block/:id',backendController.blockFeedback)
backendRout.get('/managefeedbacks/delete/:id', backendController.deleteFeedback);
backendRout.get('/managefeedbacks',backendController.getManageFeedbacksPage)

backendRout.get('/manageadmins/delete/:id', backendController.deleteadmin);
backendRout.get('/manageadmins', backendController.manageadmins);
backendRout.get('/dashboard', backendController.dashboard);

backendRout.get('/addadmin', backendController.getAddAdminPage)
backendRout.post('/addadmin/add',urlencodedParser,backendController.addAdmin);

backendRout.get('/manageadmins/editadmin/:id',backendController.getEditAdmin);
backendRout.post('/manageadmins/editadmin/:id/',urlencodedParser,backendController.editAdmin);

backendRout.get('/adminpanel', backendController.adminPanel)

// logout from account
backendRout.get('/logout',backendController.logout);
/* Verify email and password. */
backendRout.post('/verify',urlencodedParser, backendController.verify);
/* GET login page. */
backendRout.get('/', backendController.login);
module.exports = backendRout