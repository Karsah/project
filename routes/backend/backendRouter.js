const express = require('express');
const backendController=require('../../controllers/backendController')
const backendRout = express.Router();
backendRout.get('/adminPanel', backendController.adminPanel);
/* GET login page. */
backendRout.post('/verify', backendController.verify);
/* GET login page. */
backendRout.get('/', backendController.login);
module.exports = backendRout