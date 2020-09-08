const con = require('../configs/db')
const express = require("express");


module.exports =  class MainSlider {
    static CreateSlide(){

    }
     static  GetSlides(){
        return new Promise((resolve,reject)=>{
            const sql = "select * from main_slider"
            con.query(sql)
                .then((result)=> resolve(result[0]))
                .catch((err)=> reject(err))

        })

    }
    static deleteSlider(id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM main_slider where id = ?'
            con.query(sql, [id])
                .then(result => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })

    }
}