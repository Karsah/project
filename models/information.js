const con = require('../configs/db');

module.exports = class Information {

    static getInfoPage(name) {
        return new Promise((resolve,reject)=>{
            const sql = 'select id, header,bg_image from maininformationpages where name = ?'
            con.query(sql,[name])
                .then((result)=>{
                    let allObjects = {}
                    console.log(result[0])
                    if (result[0].length>0){
                        let parentid =result[0][0].id
                        delete result[0][0].id
                        allObjects.mainheader = result[0]
                        let sql = 'select header,info from maininformation where parent_id = ?'
                        con.query(sql,[parentid])
                            .then((result)=>{
                                console.log('steic' , result[0])
                                if (result[0].length>0){
                                    allObjects.information = result[0]
                                    let sql = 'select gallery_image from informationpagegallery where parent_id = ?'
                                    con.query(sql,[parentid])
                                        .then((result)=>{
                                            if (result[0].length>0){
                                                allObjects.gallery = result[0]
                                                resolve(allObjects)
                                            }else{
                                                resolve(false)
                                            }
                                            })
                                        .catch((err) => {
                                            console.log(err)
                                            reject()
                                        })
                                }else {
                                    resolve(false)
                                }
                                })
                            .catch((err) => {
                                console.log(err)
                                reject()
                            })
                    }else{
                        resolve(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        }
        )
    }

    static getInformation(name){
        return new Promise((resolve,reject)=>{
            const sql = 'select '
        })
    }
}