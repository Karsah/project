const con = require('../configs/db');

module.exports = class feedback {
    constructor() {
    }

    static addFeedback(feedback) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO feedbacks (stars_count, name, surname, email,age,message) VALUES(?, ?, ?, ?, ?, ?)";
            con.query(sql, feedback)
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject()
                })
        })
    }

    static getAllFeedbacksForFrontend() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT stars_count,name,surname ,message, date FROM feedbacks where status = 'not-blocked' order by date desc"
            con.execute(sql)
                .then((result) => {
                    if (result[0].length > 0) resolve(result[0])
                    else if (result[0].length == 0) resolve(false)
                })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

    static getAllFeedbacksForManagement() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM feedbacks"
            con.execute(sql)
                .then(result => {
                    resolve(result[0])
                })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

    static deleteFeedback(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM feedbacks where id = ?'
            con.query(sql, [id])
                .then(result => resolve())
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

    static blockFeedback(id) {
        return new Promise((resolve, reject) => {
            const sql = 'update feedbacks set status = \'blocked\' where id = ?'
            con.query(sql, [id])
                .then(result => resolve())
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

    static unblockFeedback(id) {
        return new Promise((resolve, reject) => {
            const sql = 'update feedbacks set status = \'not-blocked\' where id = ?'
            con.query(sql, [id])
                .then(result => resolve())
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

    static isThereFeedback(id) {
        return new Promise((resolve, reject) => {
            const sql = 'select email from feedbacks where id = ?'
            con.query(sql, [id])
                .then((result) => {
                    if (result[0].length > 0) {
                        resolve(true)
                    } else if (result[0].length == 0) {
                        resolve(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

}