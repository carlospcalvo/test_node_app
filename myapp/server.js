const express = require('express');
const port = process.env.PORT || 3000;
const http = require('https');
const axios = require('axios').default;
const bodyParser = require('body-parser');
const XHR = require('xhr');
const cors = require('cors');
const app = express();
let datos = JSON.stringify({
    "CompanyDB": "CORESA_01_12_2020",
    "UserName": "manager",
    "Password": "s0p0rt3"
});
const corsOpts = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
const cookie = 'B1SESSION=45e246c8-446f-11eb-8000-0ef81b3704dd; ROUTEID=.node1';


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors(corsOpts));
//desactiva el certificado ssl
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.listen(port, function() {
    console.log('myapp listening on port ' + port);
});



app.post('/login', function(req, res) {

    var config = {
        method: 'post',
        url: 'https://172.0.1.211:50000/b1s/v1/Login',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        },
        data: datos,
        timeout: 5000
    };

    res.header("Access-Control-Allow-Origin", "*");
    //res.send(JSON.stringify(req.headers));
    axios(config)
        .then(function(response) {
            cookie = response.getHeader('Cookie');
            res.send(JSON.stringify(response.data));
            res.send('Cookie: ' + cookie);
        })
        .catch(function(error) {
            res.send(error);
        });


    //console.log(JSON.stringify(req.body));
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
    //    res.send('Hello World!');
    let options = {
        method: 'GET',
        url: 'https://restcountries-v1.p.rapidapi.com/all',
        headers: {
            'x-rapidapi-key': '4578739f95mshef09d2dc0a2cf84p10747cjsn85b8e9b42f6c',
            'x-rapidapi-host': 'restcountries-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function(response) {
        res.send(response.data);
    }).catch(function(error) {
        res.send(error);
    });
});

app.get('/clientes', function(req, res) {
    var config = {
        method: 'get',
        url: "https://172.0.1.211:50000/b1s/v1/BusinessPartners('C00818')",
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        },
        //data: datos,
        timeout: 5000
    };

    res.header("Access-Control-Allow-Origin", "*");

    axios(config)
        .then(function(response) {
            res.send(JSON.stringify(response.data));
        })
        .catch(function(error) {
            res.send(error);
        });

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