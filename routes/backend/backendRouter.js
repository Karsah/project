const express = require('express');
const backendRout = express.Router();

const multer  = require("multer");


const bodyParser = require("body-parser");

const backendController=require('../../controllers/backendController')

const urlencodedParser = bodyParser.urlencoded({extended: false})

/* Get */

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {

    if(file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"||
        file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const uploads = (multer({storage:storageConfig, fileFilter: fileFilter}))
backendRout.post('/uploadimage/upload',uploads.single("file"),backendController.uploadimage)
backendRout.get('/uploadimage',backendController.getUploadImagePage)

backendRout.post('/changepass/change',backendController.changePass)
backendRout.get('/changepass',backendController.getChangePassPage)

backendRout.get('/manageslider',backendController.getManageSliderPage)
backendRout.get('/manageslider/delete/:id', backendController.deleteslider)

backendRout.get('/managefeedbacks/unblock/:id',backendController.unblockFeedback)
backendRout.get('/managefeedbacks/block/:id',backendController.blockFeedback)
backendRout.get('/managefeedbacks/delete/:id', backendController.deleteFeedback);
backendRout.get('/managefeedbacks',backendController.getManageFeedbacksPage)

backendRout.get('/manageadmins/delete/:id', backendController.deleteadmin);
backendRout.get('/manageadmins', backendController.manageadmins);

backendRout.get('/addadmin', backendController.getAddAdminPage)
backendRout.post('/addadmin/add',urlencodedParser,backendController.addAdmin);

backendRout.get('/manageadmins/editadmin/:id',backendController.getEditAdmin);
backendRout.post('/manageadmins/editadmin/edit/:id',urlencodedParser,backendController.editAdmin);

backendRout.get('/adminpanel', backendController.adminPanel)

// logout from account
backendRout.get('/logout',backendController.logout);
/* Verify email and password. */
backendRout.post('/verify',urlencodedParser, backendController.verify);
/* GET login page. */
backendRout.get('/', backendController.login);
module.exports = backendRout