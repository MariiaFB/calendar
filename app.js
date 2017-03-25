var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var json_events = 'public/json/events.json';
var json_groups = 'public/json/groups.json';

var index = require('./routes/index');

var app = express();
var mustacheExpress = require('mustache-express');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index');
});

// MYSQL connection
var connection = require('./model/connection');

// socket.io
var express = require('express');

var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');


var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

io.sockets.on('connection', function (socket) {

    socket.on('create_event', function (data) {
        connection.query('insert into events values(null, ?, ?, ?, ?, ?)',
            [data.group, data.start, data.end, data.description, data.color],
            function (error, results, fields) {
                if (error) throw error;
            });
        connection.query('SELECT * from events', function (err, results, rows) {
            if (err) throw err;
            fs.writeFile(json_events, JSON.stringify(results), function (err) {
                if (err) throw err;
            });
        });

        io.sockets.emit('new_event_from_server', data);
   });

  socket.on('require_events', function () {
       var obj = JSON.parse(fs.readFileSync(json_events, 'utf8'));
       if(obj.length > 0){
            socket.emit('events_from_server', obj);
         }
    });

    socket.on('require_groups', function () { 
    connection.query('SELECT id_group, group_name FROM groups where is_active = 1;', function (err, results, rows) {
            if (err) throw err;
            fs.writeFile(json_groups, JSON.stringify(results), function (err) {
                if (err) throw err;
           });
        });
        var obj = JSON.parse(fs.readFileSync(json_groups, 'utf8'));
        //var obj = { 1: { id_group: 1, group_name: 'Python' }, 2: { id_group: 2, group_name: 'JavaScript' } };
        socket.emit('groups_from_server', obj);
        
    });



});




