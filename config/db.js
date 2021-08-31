var mysql      = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 1,
  host     : 'eu-cdbr-west-01.cleardb.com',
  user     : 'b7fd61537111ca',
  password : '74cd2cd7',
  database : 'heroku_e8e29ea723b7f04',
  "insecureAuth" : true
});

pool.getConnection(function(err, connection) {
  if (err) throw err; // not connected!

    console.log('connected as id ' + connection.threadId);
    // When done with the connection, release it.
    connection.release();
});

module.exports = pool 