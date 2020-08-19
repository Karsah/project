const con = require('../configs/db');
const bcrypt = require('bcrypt');

module.exports = class Admin {
    constructor(name, surname, email, password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }

    static getAdminInfo(id){
        return new Promise((resolve,reject) =>{
            const  sql = "select name,surname,email,is_super from admins where id = ?"
            con.query(sql,[id])
                .then((result)=> resolve(result[0][0]))
                .catch((err)=>reject(err))
        })
    }

    static verify(email, pass) {
        return new Promise((res, rej) => {
            let sql = "select id,name,surname,is_super, password from admins where email=?"
            con.query(sql, [email])
                .then(result => {
                    if (result[0].length > 0) {
                        const hash = result[0][0].password;
                        bcrypt.compare(pass, hash)
                            .then(function (r) {
                                if (r)
                                    res(result[0][0])
                            })
                            .catch(err => {
                                rej(err)
                            });
                    } else {
                        rej(false)
                    }
                })
                .catch(err => {
                    rej(err);
                })
        });
    }
    static addAdmin(admin){
        return new Promise((resolve,reject)=>{
            const sql = "INSERT INTO admins (name, surname, email,password,is_super) VALUES(?, ?, ?, ?,?)";
            con.query(sql,admin)
                .then(result=>resolve(result))
                .catch(err => reject(err))
        })

    }
};