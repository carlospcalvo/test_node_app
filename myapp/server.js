const express = require('express');
const http = require('https');
const axios = require('axios');
const bodyParser = require('body-parser');
const XHR = require('xhr');
const cors = require('cors');
const app = express();
let datos = JSON.stringify({
    "CompanyDB": "CORESA_01_12_2020",
    "UserName": "manager",
    "Password": "s0p0rt3"
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
//supuestamente desactiva el certificado ssl
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.post('/login', function(req, res) {
    /*
    let options = {
        host: 'hanab1',
        port: 50000,
        path: '/b1s/v1/Login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //'Content-Length': Buffer.byteLength(datos)
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

    if(httpreq.write(datos)) {
        res.send('Logged in! ' + res.data);
    };

    httpreq.on('error', error => {
        console.error(error)
    })

    //httpreq.end();
    **************************/
    //res.send(req.body);
    /*
    const config = {
        method: "POST",
        headers: {
            "Content-type": "application/json;charset=utf-8"
        },
        body: datos
    };

    axios.post('https://hanab1:50000/b1s/v1/Login', config)
        .then(res => {
            console.log(JSON.stringify(res.data));
            res.send("Logged in!");
        })
        .catch(err => {
            let mensaje = err.statusText || 'Se produjo un error.';
            console.error('Error: ' + err.status + '-' + mensaje);
        });

    /*
    
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(JSON.parse(xhr.responseText));
            } else {
                let mensaje = xhr.statusText || 'Se produjo un error.';
                console.error('Error: ' + xhr.status + '-' + mensaje);
            }
        }
    })

    xhr.open('POST', 'https://hanab1:50000/b1s/v1/Login');
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    xhr.send(datos);

    *

    let XHRConfig = {
        url: 'https://hanab1:50000/b1s/v1/Login',
        method: 'POST',
        timeout: 15000,
        body: datos,
        json: true
    }

    Xhr(XHRConfig, function(err, resp, body) {
        if (resp.statusCode >= 200 && xhr.statusCode < 300) {
            console.log(JSON.parse(resp.body));
        } else {
            let mensaje = resp.statusText || 'Se produjo un error.';
            console.error('Error: ' + resp.statusCode + '-' + mensaje);
        }
    })
    */

    //Connect();

    var config = {
        method: 'post',
        url: 'https://172.0.1.211:50000/b1s/v1/Login',
        headers: {},
        data: datos
    };

    axios(config)
        .then(function(response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function(error) {
            console.log(error);
        });

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

    if (httpreq.write(datos)) {
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






//Connect to Service Layer
let Connect = function() {
    return new Promise(function(resolve, reject) {
        const options = {
            method: "POST",
            baseURL: "hanab1",
            port: 50000,
            url: '/b1s/v1/Login',
            data: {
                UserName: 'manager',
                Password: 's0p0rt3',
                CompanyDB: 'CORESA_01_12_2020'
            }
        }

        axios.request(options).then((response) => {
                console.log(`SL Response: is ${response.status} - ${response.statusText}`)
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    return reject(
                        new Error(`${response.statusCode}: ${response.req.getHeader("host")} ${response.req.path}`)
                    );
                } else {
                    resolve({
                        cookie: response.headers['set-cookie'],
                        SessionId: response.data.SessionId
                    })
                }
            })
            .catch((err) => {
                console.error("Error calling B1 -" + err)
                reject(new Error(err));
            })
    })
}