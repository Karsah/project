const express = require('express');
const menuRouter = express.Router();


menuRouter.use("/information", function (request, response) {
    response.render("", {
        title: "info"
    });
});
menuRouter.use("/tourizm", function (request, response) {
    response.render("", {
        title: "tour"
    });
});
menuRouter.use("/team", function (request, response) {
    response.render("", {
        title: "partners"
    });
});
menuRouter.use("/feedback", function (request, response) {
    response.render("", {
        title: "Feedback"
    });
});
menuRouter.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
module.exports = menuRouter;