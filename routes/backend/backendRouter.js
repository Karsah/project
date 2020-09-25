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
/* Verify email and password. */
backendRout.post('/verify',urlencodedParser, backendController.verify);
/* GET login page. */
backendRout.get('/', backendController.login);

backendRout.use(function (request,response,next) {
    if (!request.session.admin ){
        request.session.destroy();
        response.redirect('/backend')
        next()
    }
    next()
})

const uploads = (multer({storage:storageConfig, fileFilter: fileFilter}))

backendRout.get('/informationpages/:name',backendController.getInformationPage)
backendRout.get('/informationpages',backendController.getInformationPages)

backendRout.post('/uploadimage/upload',uploads.single("file"),backendController.uploadimage)
backendRout.get('/uploadimage',backendController.getUploadImagePage)

backendRout.post('/changepass/change',backendController.changePass)
backendRout.get('/changepass',backendController.getChangePassPage)

backendRout.get('/manageslider',backendController.getManageSliderPage)
backendRout.get('/addslide',backendController.getAddSlidePage)
backendRout.post('/addslide/add',backendController.addSlide)
backendRout.get('/manageslider/delete/:id', backendController.deleteslider)
backendRout.get('/manageslider/editslide/:id', backendController.getEditSlidePage)
backendRout.post('/manageslider/editslide/edit/:id', backendController.editSlide)


backendRout.get('/managefeedbacks/unblock/:id',backendController.unblockFeedback)
backendRout.get('/managefeedbacks/block/:id',backendController.blockFeedback)
backendRout.get('/managefeedbacks/delete/:id', backendController.deleteFeedback);
backendRout.get('/managefeedbacks',backendController.getManageFeedbacksPage)

backendRout.get('/manageadmins/delete/:id', backendController.deleteadmin);
backendRout.get('/deletequestion/:item&:id',backendController.sendDeleteQuestion)
backendRout.get('/manageadmins', backendController.manageadmins);

backendRout.get('/addadmin', backendController.getAddAdminPage)
backendRout.post('/addadmin/add',urlencodedParser,backendController.addAdmin);

backendRout.get('/manageadmins/editadmin/:id',backendController.getEditAdminPage);
backendRout.post('/manageadmins/editadmin/edit/:id',urlencodedParser,backendController.editAdmin);

backendRout.get('/adminpanel', backendController.adminPanel)

// logout from account
backendRout.get('/logout',backendController.logout);



module.exports = backendRout