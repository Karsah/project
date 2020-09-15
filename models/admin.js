const con = require('../configs/db');
const bcrypt = require('bcrypt');

module.exports = class Admin {
    constructor(name, surname, email, password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }

    static getAdmin(id) {
        return new Promise((resolve, reject) => {
            const sql = "select id,name,surname,email,is_super from admins WHERE id=? "
            con.execute(sql, [id])
                .then((result) => resolve(result[0][0]))
                .catch(()=>{reject()})
        })
    }

    static getAdmins(id) {
        return new Promise((resolve, reject) => {
            const sql = "select id,name,surname,email,is_super from admins "
            con.execute(sql)
                .then((result) => resolve(result[0]))
                .catch(()=>{reject()})
        })
    }

    static verify(email, pass) {
        return new Promise((resolve, reject) => {
            let sql = "select id,name,surname,is_super, password from admins where email=?"
            con.query(sql, [email])
                .then((result) => {
                    if (result[0].length > 0) {
                        const hash = result[0][0].password;
                        bcrypt.compare(pass, hash)
                            .then(function (compareResult) {
                                if (compareResult) {
                                    resolve(result[0][0])
                                } else {
                                    resolve('incorrect')
                                }
                            })
                            .catch(()=> reject())
                    } else if (result[0].length == 0) {
                        resolve('no admin')
                    }
                })
                //.catch(()=>{reject()})
        });
    }

    static addAdmin(admin) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO admins (name, surname, email,password) VALUES(?, ?, ?, ?)";
            con.query(sql, admin)
                .then( resolve())
                .catch(()=>{reject()})
        })
    }

    static editAdmin(admin) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE admins SET name=?, surname=?, email=? WHERE id=?'
            con.query(sql, admin)
                .then(resolve())
                .catch(()=>{reject()})
        })
    }

    static deleteAdmin(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM admins where id = ?'
            con.query(sql, [id])
                .then(resolve())
                .catch(()=>{reject()})
        })
    }

    static comparePass(pass, email) {
        return new Promise((resolve, reject) => {
            const sql = 'select password from admins where email = ?'
            con.query(sql, [email])
                .then(result => {
                    if (result[0].length > 0) {
                        if (result[0].length > 0) {
                            const hash = result[0][0].password;
                            bcrypt.compare(pass, hash)
                                .then(function (compareResult) {
                                    if (compareResult) {
                                        resolve(true)
                                    } else if (!compareResult) {
                                        resolve(false)
                                    }
                                })
                                .catch(()=>{reject()})
                        }
                    }
                })
                .catch(()=>{reject()})
        })
    }

    static setNewPass(newPass, email){
        return new Promise((resolve, reject) => {
            const sql = 'update admins set password = ? where email = ?'
            con.query(sql, [newPass, email])
                .then(resolve())
                .catch(()=>{reject()})
        })
    }

    static isThereAdminWith(searchBy,value) {
        return new Promise((resolve, reject) => {
            let sql
            if(searchBy === 'email'){
                sql = "select id from admins where email = ?"
            }else if (searchBy === 'id'){
                sql = "select email from admins where id = ?"
            }
            con.query(sql, [value])
                .then(result => {
                    resolve(result[0])
                })
                .catch(()=>{reject()})
        })
    }
    }

