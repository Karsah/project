const Information = require('../models/information');

function internalServerError(response) {
    response.render('serverError.ejs', {
        title: 'Server Error',
        end:'front',
        logined: ''
    })
}

exports.getInfoPage = function(request, response) {
    let name = request.params.name ? request.params.name:'aragatsotn'
    Information.getInfoPage(name)
        .then((result)=>{
            let mainheader = result.mainheader[0]
            let information = result.paragraphs
            let gallery = result.gallery
            let beifinfo = result.beifinfo
            console.log('mainnn',mainheader)
            let renderObj = {
                title: `${mainheader.header}`,
                pageName:'information',
                css:['information.css','style.css'],
                mainheader:mainheader,
                information:information,
                gallery:gallery,
                beifinfo:beifinfo
            }
            if (name == 'aragatsotn')
            response.render('frontend/information',renderObj )
            else             response.render('frontend/cities',renderObj )

        })
        .catch(()=>internalServerError(response))
}