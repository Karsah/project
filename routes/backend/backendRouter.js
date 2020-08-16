const express = require('express');
const bodyParser = require("body-parser");
const backendController=require('../../controllers/backendController')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const backendRout = express.Router();
const auth = function(req,res,next){
    if (!req.session.adminId){
        res.status(401).redirect('/backend')
    }
    next()
};
backendRout.get('/adminPanel',auth, function (request, response) {

        response.render("backend/adminPanel.ejs", {
            title: "adminPanel",
            css: "adminPanel.css"
        })
   // }else{
     //   response.redirect('/verify')
   // }

});
/* GET login page. */
backendRout.post('/verify',urlencodedParser, backendController.verify);
/* GET login page. */
backendRout.get('/', backendController.login);
module.exports = backendRout