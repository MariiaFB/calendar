var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123123',
  database  : 'my_db'
});

exports.end = function () {
    connection.end();
}
module.exports = connection;
