const con = require('../configs/db');

module.exports = class Information {

    static getInfoPage(name) {
        return new Promise((resolve, reject) => {
                this.isThereInfoPage(name)
                    .then((result) => {
                        if (result) {
                            let allInfo = {
                                maininfo: [],
                                beifinfo: [],
                                paragraphs: [],
                                gallery: [],
                            }
                            const sql = 'select id, header,bg_image from info_header_back where name = ?'
                            new Promise((res) => {
                                con.query(sql, [name])
                                    .then((result)=>{
                                        if (result[0].length > 0) {
                                            let parentid = result[0][0].id
                                            delete result[0][0].id
                                            allInfo.mainheader = result[0]
                                            res(parentid)
                                        }
                                    })
                            }).then((id) => {
                                let sqlPar = 'select header,info from info_paragraphs where parent_id = ?'
                                let sqlBeif = 'select title,info from info_beif where parent_id = ?'
                                let sqlGall = 'select gallery_image from informationpagegallery where parent_id = ?'
                                con.query(sqlBeif, [id])
                                    .then((result) => {
                                        if (result[0].length > 0) {
                                            allInfo.beifinfo = result[0]
                                        }
                                        con.query(sqlPar, [id])
                                            .then((result) => {
                                                if (result[0].length > 0) {
                                                    allInfo.paragraphs = result[0]
                                                }
                                                con.query(sqlGall, [id])
                                                    .then((result) => {
                                                        if (result[0].length > 0) {
                                                            allInfo.gallery = result[0]
                                                        }
                                                        resolve(allInfo)
                                                    })
                                                    .catch((err) => {
                                                        console.log(err)
                                                        reject()
                                                    })
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                                reject()
                                            })
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                        reject()
                                    })
                            })

                        } else {
                            reject()
                        }
                    })
            }
        )
    }

    static getPagenames() {
        return new Promise((resolve, reject) => {
            let sql = 'select id ,name, header from info_header_back'
            con.execute(sql)
                .then((result) => {
                    if (result[0].length > 0) resolve(result[0])
                    else if (result[0].length == 0) resolve([])
                })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

    static isThereInfoPage(name) {
        return new Promise((resolve, reject) => {
            let sql = "select id from info_header_back where name =?"
            con.query(sql, [name])
                .then((result) => {
                    if (result[0].length > 0) resolve(true)
                    else if (result[0].length == 0) resolve(false)
                })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

    static getAllPageInformation(name) {
        return new Promise((resolve, reject) => {
            let allInformatin = {
                maininfo: [],
                beifinfo: [],
                paragraphs: [],
                gallery: [],
            }
            let sql = `select * from info_header_back where name =?`
            con.query(sql, [name])
                .then((result) => {
                    new Promise((res) => {
                        //get main info without checking length because isThere function already checks
                        allInformatin.maininfo = result[0]
                        console.log(result[0][0].id)
                        res(result[0][0].id)
                    })
                        .then((id) => {
                            new Promise((res) => {
                                let sql = `select * from info_beif where parent_id = ?`
                                con.query(sql, [id])
                                    .then((result) => {
                                        if (result[0].length > 0) {
                                            allInformatin.beifinfo = result[0]
                                        } else {
                                            allInformatin.beifinfo = []
                                        }
                                        res(id)
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                        reject()
                                    })
                            })
                                .then((id) => {
                                    new Promise((res) => {
                                        let sql = 'select * from info_paragraphs where parent_id = ?'
                                        con.query(sql, [id])
                                            .then((result) => {
                                                if (result[0].length > 0) {
                                                    allInformatin.paragraphs = result[0]
                                                } else {
                                                    allInformatin.paragraphs = []
                                                }
                                                res(id)
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                                reject()
                                            })
                                    })
                                        .then((id) => {
                                            new Promise((res) => {
                                                let sql = 'select * from informationpagegallery where parent_id = ?'
                                                con.query(sql, [id])
                                                    .then((result) => {
                                                        if (result[0].length > 0) {
                                                            allInformatin.gallery = result[0]
                                                        } else allInformatin.gallery = []
                                                        resolve(allInformatin)
                                                    })
                                                    .catch((err) => {
                                                        console.log(err)
                                                        reject()
                                                    })
                                            })
                                        })
                                })
                        })

                })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })

    }
}