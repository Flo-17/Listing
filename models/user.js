let connection = require('../config/db')


class User{

    constructor (row) {
        this.row = row
    }

    get id() {
        return this.row.id
    }


    get user() {
        return this.row.email
    }

    static create(username,password, cb){

        connection.query('INSERT INTO users SET email = ?, password = ?', [username, password], (err, result) => {
            if(err) throw err
            cb(result) 
        })
    }

    static connected (id, cb){

        connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id], (err, rows) => {
            if (err) throw err
            cb(new User(rows[0]))      
        })
    }

    static exist (email, cb){

        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
            if (err) throw err
            cb(new User(rows[0]))      
        })
    }

}

module.exports = User