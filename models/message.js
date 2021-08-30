let connection = require('../config/db.js')

class Message{

    static create(content, cb){

        connection.query('INSERT INTO messages SET content = ?, created_at = ?', [content, new Date()], (err, result) => {

            if(err) throw err
            cb(result) 

        })
    }

    static all (cb){

        connection.query('SELECT * FROM messages', (err, rows) => {

            if (err) throw err
            cb(rows)

        })
    }
}
module.exports = Message