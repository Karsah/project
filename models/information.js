const con = require('../configs/db');

module.exports = class Information {

    static getInfoPage(name) {
        return new Promise((resolve, reject) => {
                const sql = 'select id, header,bg_image from info_header_back where name = ?'
                con.query(sql, [name])
                    .then((result) => {
                        let allObjects = {}
                        if (result[0].length > 0) {
                            let parentid = result[0][0].id
                            delete result[0][0].id
                            allObjects.mainheader = result[0]
                            let sql = 'select header,info from info_paragraphs where parent_id = ?'
                            con.query(sql, [parentid])
                                .then((result) => {
                                    if (result[0].length > 0) {
                                        allObjects.information = result[0]
                                        let sql = 'select gallery_image from informationpagegallery where parent_id = ?'
                                        con.query(sql, [parentid])
                                            .then((result) => {
                                                if (result[0].length > 0) {
                                                    allObjects.gallery = result[0]
                                                    let sql = 'select title,info from info_beif where parent_id = ?'
                                                    con.query(sql, [parentid])
                                                        .then((result) => {
                                                            if (result[0].length > 0) {
                                                                allObjects.beifinfo = result[0]
                                                                resolve(allObjects)
                                                            } else {
                                                                resolve([])
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            console.log(err)
                                                            reject()
                                                        })
                                                } else {
                                                    resolve([])
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                                reject()
                                            })
                                    } else {
                                        resolve([])
                                    }
                                })
                                .catch((err) => {
                                    console.log(err)
                                    reject()
                                })
                        } else {
                            resolve([])
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        reject()
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