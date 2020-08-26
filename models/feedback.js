const con = require('../configs/db');

module.exports = class feedback {
    constructor() {
    }

    static addFeedback(feedback){
     return new Promise((resolve,reject)=>{
            const sql = "INSERT INTO feedbacks (stars_count, name, surname, email,age,message) VALUES(?, ?, ?, ?, ?, ?)";
            con.query(sql,feedback)
                .then((result)=>{
                    resolve(result)
                })
        })
    }

    static getAllFeedbacksForFrontend(){
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT stars_count,name,surname ,message, date FROM feedbacks'
            con.execute(sql)
                .then((result)=>{
                    if(result[0].length >0) resolve(result[0])
                    else if (result[0].length == 0 ) resolve(false)
                })
        })
    }
}