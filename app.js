/**
 * Created by gaozy on 12/11/19.
 */

var xdn = require('./xdn');
var debug = require('debug')('xdn-demo-app:app');

const express = require('express');

const request = require("request");

const app = express();

// The address of xdn agent running on the same host
addr = process.env.ADDR || "localhost";
const url = "http://"+addr+":12416/";

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

//FIXME: Nothing in public dir yet
app.use(express.static(__dirname + '/public'));

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);
app.use(jsonParser);


var val = 0;

app.get('/', function(req, res){
    res.render('index', {value:val});
});

app.post('/', function(req, res){

    console.log("POST:", req.body);

    request.post(url, {
        json: {
            value: req.body.addValue.toString(),
            serviceName: "XDNAgentApp0"
        }
    }, (error, response, body) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(`statusCode: ${response.statusCode}`);
        console.log(response.body);

        // val += Number(req.body.addValue);
        res.render('index', {value:val});
    });
    /*
    var v = req.body.addValue;
    val += Number(v);
    res.render('index', {value:val});
    */
});

// execute
app.post('/xdn', function(req, res){
    console.log("XDN:",req.body);
    val += Number(req.body.value);
    res.send("OK");

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
}
