const  con = require('../configs/db')

module.exports = class backendMenu {
    constructor(name,icon,parentId) {
        this.name = name;
        this.icon = icon
        if (parentId && typeof +parentId == 'number') this.parent_id = parentId
    }

    static getMenu = function () {
        return new Promise((resolve,reject)=>{
            const sql = "select  * from backendmenu"
            con.execute(sql)
                .then(result =>{
                    resolve(result[0])
                })
                .catch(err =>{
                    reject(`Error ${err}`)
                })
        })
    }
}