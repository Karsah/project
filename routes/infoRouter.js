const express = require('express');
const infoRouter = express.Router();
infoRouter.use('/communities', function (request, response) {
    response.render('', {
        title: 'communities'
    })

});
infoRouter.use('/cities', function (request, response) {
    response.render('', {
        title: 'cities'
    })
});
module.exports = infoRouter;

