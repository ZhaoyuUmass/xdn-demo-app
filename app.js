/**
 * Created by gaozy on 12/11/19.
 */

var debug = require('debug')('xdn-demo-app:app');
var fs = require('fs');

const express = require('express');

const request = require("request");


const app = express();

// The address of xdn agent running on the same host
addr = process.env.ADDR || "localhost";
const url = "http://"+addr+":12416/";

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(jsonParser);


const valFile = 'value.txt';

var val = 0;
var counter = 0;

app.get('/', function(req, res){
    res.render('index', {value:val});
});

app.post('/', function(req, res){
    console.time("test");
    console.log("POST:", req.body);
    var id = counter++;
    console.log('id:', id, 'URL:', url);

    map.set(id, res);

    request.post(url, {
        json: {
            QVAL: req.body.addValue.toString(),
            NAME: "XDNAgentApp0",
            type: 401,
            QID: id
        }
    }, function(error, response, body) {
        if (error) {
            console.error(error);
            return;
        }
        // console.log(`statusCode: ${response.statusCode}`);
        // console.log(response.body);

    });

});

let map = new Map();

// execute
app.post('/xdn', function(req, res){
    console.log("XDN:",req.body);

    val += Number(req.body.QVAL);

    res.send("OK");

    var id = req.body.QID;
    var response = map.get(id);

    // console.log('Reponse:',response, 'id:',id);
    
    if (response) {
        console.time("render");
        response.render('index', {value:val});
        console.timeEnd("render");
    }
    map.delete(id);

    console.timeEnd("test");
});

app.get('/xdnapp', function(req, res){
    res.render('index', {value:val});
});

// execute
app.post('/xdnapp', function(req, res){
    console.log(req.body);

    console.time("latency");

    if (req.body.type == "SNAPSHOT") {
        res.send({QVAL:val, NAME:req.body.NAME});
        return;
    } else if (req.body.type == "RECOVERY") {
        val = Number(req.body.QVAL);
        res.send("OK");
        return;
    }

    if (req.body.QVAL)
        val += Number(req.body.QVAL);
    else if (req.body.addValue)
        val += Number(req.body.addValue);
    else
        val = 'Not valid number'

    fs.writeFile(valFile, val, (err) => {
        if (err) throw err;
        console.log('Value',val, 'saved!');
    });

    res.render('index', {value:val});

    console.timeEnd("latency");

});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


// CMD: docker run --name nodejs-image-demo -p 80:8080 -e PORT=80 -e ADDR=1-d oversky710/nodejs-image-demo
if(!module.parent){
    var port = normalizePort(process.env.PORT || '3000');
    app.listen(port, function(){
        console.log("Listening on",port);
    });

    fs.readFile(valFile, 'utf8', function(err, content) {
        val = Number(content);
    });

}
