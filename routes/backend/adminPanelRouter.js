const  express = require('express')
const adminPanelRout = express.Router()

const adminPanelController=require('../../controllers/adminPanelController')

adminPanelRout.use('/',adminPanelController.adminPanel)
module.exports = adminPanelRout