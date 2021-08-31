var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'eu-cdbr-west-01.cleardb.com',
  user     : 'b7fd61537111ca',
  password : '74cd2cd7',
  database : 'heroku_e8e29ea723b7f04',
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