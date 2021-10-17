var express = require('express');
var mysql = require('mysql');

const config = require('./db_config.json')
var pool = mysql.createPool(config);

var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const cors = require('cors')
app.use(cors());

app.use(express.static('public'));

app.post('/recentSensor', function (request, response) {
    var yaxis = [];

    pool.getConnection(function(err, conn) {
        if(!err) {
            conn.query('SELECT * FROM sensorData WHERE ch = '+ `${request.body.ch}` + ' ORDER BY seq_num DESC limit 500', function(error, results, fileds) {
                if(error) {
                    console.log(error);
                }
        
                results.forEach(function(row) {
                    yaxis.push(row.value);
                });
        
                response.send(yaxis);
            });
        }

        conn.release();
        console.log("channel " + `${request.body.ch}` + " recentSensor response SUCCESS!")
    });
});

app.listen(3000, function() {
    console.log('Server Running at http://127.0.0.1:3000');
});