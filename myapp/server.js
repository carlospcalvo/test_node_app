const express = require('express');
const http = require('https');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
let data = JSON.stringify({
    CompanyDB: "CORESA_01_12_2020",
    UserName: "manager",
    Password: "s0p0rt3"
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.post('/login', function(req, res) {

    let options = {
        host: 'hanab1',
        port: 50000,
        path: '/b1s/v1/Login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //'Content-Length': Buffer.byteLength(data)
        }
    };

    let httpreq = http.request(options, function(response) {
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
            res.json(chunk);
            //console.log(chunk);
        });
        response.on('end', function() {
            res.send('ok');
        });

    });

    if (httpreq.write(data)) {
        res.send('Logged in!');
    };

    httpreq.on('error', error => {
        console.error(error)
    })


    httpreq.end();
    /*************************
    let dataJSON = JSON.parse(data);
    let schema = dataJSON['CompanyDB'];
    let user = dataJSON['UserName'];

    const config = {
        method: "POST",
        headers: {
            "Content-type": "application/json;charset=utf-8"
        },
        data: data
    };

    axios('https://' + options['host'] + ':' + options['port'] + options['path'], config)
        .then(res => {
            console.log(JSON.stringify(res.data));
            res.send("Logged in!");
        })
        .catch(err => {
            let mensaje = err.statusText || 'Se produjo un error.';
            console.error('Error: ' + err.status + '-' + mensaje);
        });
    */
});

app.get('/logout', function(req, res) {
    let options = {
        host: 'hanab1',
        port: 50000,
        path: '/b1s/v1/Logout',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //'Content-Length': Buffer.byteLength(data)
        }
    };

    let httpreq = http.request(options, function(response) {
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
            console.log('status: ', response.statusCode);
            console.log("body: " + JSON.stringify(chunk));
        });
        response.on('end', function() {
            res.send('ok');
        });

    });

    if (httpreq.write(data)) {
        res.send('Logged out!' + res.statusCode);
    }

    httpreq.end();

    res.send('Logged out!');
});


app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/clientes', function(req, res) {
    let optionsGet = {
        host: 'hanab1',
        port: 50000,
        path: "/b1s/v1/BusinessPartners('C00818')",
        method: 'GET'
    };
    /*
    let httpget = http.request(optionsGet, resp =>{
      console.log('status: ', resp.statusCode);

      resp.on('data', d => {
        res.json(d);
      });
    });

    httpget.on('error', err => {
      console.error(err);
    });

    httpget.end();
    */

    axios.get('https://' + optionsGet['host'] + ':' + optionsGet['port'] + optionsGet['path'])
        .then(response => {
            console.log(response.data.status);
            // console.log(response.data);
            res.send(response.data.status);
        })
        .catch(error => {
            let mensaje = err.statusText || 'Se produjo un error.';
            console.error('Error: ' + err.status + '-' + mensaje);
        });
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('myapp listening on port ' + port);
});