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

    static create(name, email,password, cb){

        connection.query('INSERT INTO users SET name = ?, email = ?, password = ?', [name, email, password], (err, result) => {
            if(err) throw err
            cb(result) 
        })
    }

/*
    static isConnected (id, cb){

        connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id], (err, rows) => {
            if (err) throw err
            cb(new User(rows[0]))      
        })
    }
*/
    static connecting (email, password, cb){

        connection.query('SELECT * FROM users WHERE email = ? and password = ? LIMIT 1', [email, password], (err, rows) => {
            if (err) throw err
            cb(new User(rows[0]))      
        })
    }
/*
    static disconnecting (id, cb){

        connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id], (err, rows) => {
            if (err) throw err
            cb(new User(rows[0]))      
        })
    }*/

    static exist (email, cb){

        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
            if (err) throw err           
            cb(new User(rows[0])) 
        })
    }
}

module.exports = User