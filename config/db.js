var mysql      = require('mysql');
var connection = mysql.createConnection({
  //host     : 'localhost',
  user     : 'b7fd61537111ca',
  password : '74cd2cd7',
  database : 'TutoNodeJS',
  "insecureAuth" : true
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection 