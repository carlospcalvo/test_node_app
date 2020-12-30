const express = require('express');
const port = process.env.PORT || 3000;
const http = require('https');
const axios = require('axios').default;
const bodyParser = require('body-parser');
const XHR = require('xhr');
const cors = require('cors');
const app = express();
const USER = process.env.SAP_USER.toString();
const PASS = process.env.SAP_PASS.toString();

let datos = JSON.stringify({
    //"CompanyDB": "MACRO",
    "CompanyDB": "KING_SA",
    "UserName": USER,
    "Password": PASS
});
const corsOpts = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors(corsOpts)); // enables CORS (I guess)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // desactiva el certificado ssl

app.get('/clients', function(req, res) {
    //ConnectServiceLayer(res, 'GET', "https://172.0.1.211:50000/b1s/v1/BusinessPartners?$select=CardCode,CardName,FederalTaxID&$filter=startswith(CardCode,'ML')&$orderby=CardCode");
    ConnectServiceLayer(res, 'GET', "https://172.0.1.211:50000/b1s/v1/BusinessPartners?$select=CardCode,CardName,FederalTaxID&$orderby=CardCode");
});

app.get('/orders', function(req, res) {
    let select = "$select=";
    let values = ["DocNum", "DocDate", "CreationDate", "CardCode", "CardName", "DocTotal", "DocCurrency", "Comments", "DocumentLines"];

    for (i = 0; i < values.length; i++) {
        if (i != values.length - 1) {
            select += values[i] + ',';
        } else {
            select += values[i];
        }
    }

    ConnectServiceLayer(res, 'GET', "https://172.0.1.211:50000/b1s/v1/Orders?" + select + "&$filter=Cancelled eq 'tNO'&$top=5");
});

app.get('/', function(req, res) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ "Obi-Wan Kenobi": "This are not the droids you're looking for." }));
    /*
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
    */
});

app.post('/orders', function(req, res) {

    let info = {
        "CardCode": "C00002",
        "DocDueDate": "2020-12-31",
        "Comments": "TEST SERVICE LAYER",
        "DocumentLines": [{
            "ItemCode": "GBL-003",
            "Quantity": "1",
            "TaxCode": "IVA_21",
            "UnitPrice": "1"
        }]
    }

    ConnectServiceLayer(res, 'POST', "https://172.0.1.211:50000/b1s/v1/Orders", info);

    //res.send(JSON.stringify(info));
});

app.post('/login', function(req, res) {
    let config = {
        method: 'post',
        url: 'https://172.0.1.211:50000/b1s/v1/Login',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'B1SESSION=45e246c8-446f-11eb-8000-0ef81b3704dd; ROUTEID=.node1'
        },
        data: datos,
        timeout: 5000
    };

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Connection", "keep-alive");
    res.header("Content-Type", "application/json");
    axios(config)
        .then(function(response) {
            res.send(JSON.stringify({ headers: response.headers, data: response.data }));
        })
        .catch(function(error) {
            res.send(error);
        });
});

app.listen(port, function() {
    console.log('myapp listening on port ' + port);
});

/**
 * Connects to Service Layer
 * @param {Response} res 
 * @param {string} method [GET, POST, PUT, DELETE]
 * @param {string} url API endpoint
 * @param {JSON} data Only for POST, PUT & DELETE -  JSON with fields to be added/modified/deleted
 * 
 */
const ConnectServiceLayer = function(res, method, url, data) {
    reqData = data || {};

    let loginConfig = {
        method: 'post',
        url: 'https://172.0.1.211:50000/b1s/v1/Login',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'B1SESSION=45e246c8-446f-11eb-8000-0ef81b3704dd; ROUTEID=.node1'
        },
        data: datos,
        timeout: 5000
    };

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Connection", "keep-alive");
    res.header("Content-Type", "application/json");
    //POST Login
    axios(loginConfig)
        .then(function(response) {
            let reqConfig = {
                method: method,
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': response.headers['set-cookie']
                },
                data: reqData,
                //timeout: 5000
            };

            axios(reqConfig)
                .then(function(resp) {
                    res.send(JSON.stringify(resp.data));
                })
                .catch(function(err) {
                    res.send(err);
                });

        })
        .catch(function(error) {
            res.send(error);
        });
}