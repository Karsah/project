const Information = require('../models/information');

function internalServerError(response) {
    response.render('serverError.ejs', {
        title: 'Server Error',
        end:'front',
        logined: ''
    })
}

exports.getAragatsotnInfoPage = function(request, response) {
    Information.getInfoPage('aragatsotn')
        .then((result)=>{
            let mainheader = result.mainheader[0]
            let information = result.information
            let gallery = result.gallery
            let beifinfo = result.beifinfo

            response.render('frontend/information', {
                title: 'Information',
                pageName:'information',
                css:['information.css','style.css'],
                mainheader:mainheader,
                information:information,
                gallery:gallery,
                beifinfo:beifinfo
            })
        })
        .catch(()=>internalServerError(response))
}