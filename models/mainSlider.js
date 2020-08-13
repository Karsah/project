const connection = require('../configs/db')
const express = require("express");


module.exports =  class MainSlider {
    static CreateSlide(){

    }
     static  GetSlides(){
        return new Promise((resolve,reject)=>{
            const sql = "select * from main_slider"
            connection.query(sql,function (err,results) {
                if(results) resolve(results)
                else if(err) reject(err)
            })

        })

    }
}