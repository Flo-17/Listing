var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'eu-cdbr-west-01.cleardb.com',
  user     : 'b7fd61537111ca',
  password : '74cd2cd7',
  database : 'heroku_e8e29ea723b7f04',
  "insecureAuth" : true
});

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
    console.log('connected as id ' + connection.threadId);
                                          // process asynchronous requests in the meantime.
    })                                    // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

module.exports = connection 