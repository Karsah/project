const con = require('../configs/db')
const express = require("express");

module.exports = class Sights {
    static CreateSights(sights) {
        return new Promise((resolve, reject) => {
            const sql = 'insert into sight(name,image,info,type) values(?,?,?,?)'
            con.query(sql, sights)
                .then(resolve())
                .catch(err => {
                    console.log('err' , err)
                    reject(err)
                })        })
    }

    static GetSights() {
        return new Promise((resolve, reject) => {
            const sql = "select image,name from sights where type ='?'"
            con.query(sql)
                .then((result) =>{  if (result[0].length>0){
                    resolve(result[0])

                }else{
                    resolve([])
                }})
                .catch(err => {
                    console.log('err' , err)
                    reject(err)
                })

        })

    }

    // static deleteSlider(id) {
    //     return new Promise((resolve, reject) => {
    //         const sql = 'DELETE FROM main_slider where id = ?'
    //         con.query(sql, [id])
    //             .then(result => {
    //                 resolve()
    //             })
    //             .catch(err => {
    //                 console.log('err' , err)
    //                 reject(err)
    //             })
    //     })
    //
    // }

    static getSights(id) {
        return new Promise((resolve, reject) => {
            const sql = 'select * from main_slider where id = ?'
            con.execute(sql, [id])
                .then((result) => {
                    if (result[0].length > 0) resolve(result[0])
                    else (reject())
                })
                .catch(err => {
                    console.log('err' , err)
                    reject(err)
                })
        })
    }

//     static updateSlide(slide){
//         return new Promise((resolve,reject)=>{
//             let sql = `update main_slider set name =? , info = ? , bg_image = ? where id = ?`
//             con.query(sql,slide)
//                 .then(resolve())
//                 .catch((err)=> console.log(err))
//         })
//     }
//
//     static isThereSlide(id) {
//         return new Promise((resolve, reject) => {
//             const sql = "select name from main_slider where id = ?"
//             con.query(sql, [id])
//                 .then(result => {
//                     if (result[0].length > 0) {
//                         resolve(true)
//                     } else if (result[0].length == 0) {
//                         resolve(false)
//                     }
//                 })
//                 .catch(err => {
//                     console.log('err' , err)
//                     reject(err)
//                 })
//         })
//     }
 }