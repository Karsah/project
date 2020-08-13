const con = require('../configs/db');
const bcrypt = require('bcrypt');

module.exports = class Admin {
    constructor(name, surname, email, password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }


    static verify(email, pass) {
        return new Promise((res, rej) => {
            let sql = "select id, password from admins where email=?"
            con.query(sql, [email])
                .then(result => {

                    if (result[0].length > 0) {
                        const hash = result[0][0].password;
                        bcrypt.compare(pass, hash)
                            .then(function (r) {
                                if (r)
                                    res(result[0][0].id)
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

};