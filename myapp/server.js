const express = require('express');
const http = require('https');
const app = express();
let data = JSON.stringify({
  CompanyDB: "CORESA_01_12_2020",
  UserName: "manager",
  Password: "s0p0rt3"
}); 

app.get('/login', function (req, res) {
  
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

  let httpreq = http.request(options, function(response){
    response.setEncoding('utf8');
    response.on('data', function(chunk){
      res.send("body: " + JSON.stringify(chunk));
      process.stdout.write(JSON.stringify(chunk));
    });
    response.on('end', function() {
      res.send('ok');
    });

  });

  if(httpreq.write(data)){
    res.send('Logged in!');
    res.send('Data: ' + JSON.stringify(data));
  };

  httpreq.on('error', error => {
    console.error(error)
  })
  

  httpreq.end(); 
});

app.get('/logout', function (req, res) {
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

  let httpreq = http.request(options, function(response){
    response.setEncoding('utf8');
    response.on('data', function(chunk){
      console.log("body: " + JSON.stringify(chunk));
    });
    response.on('end', function() {
      res.send('ok');
    });

  });

  if(httpreq.write(JSON.stringify(data))){
    res.send('Logged in!');
  }

  httpreq.end(); 
  
  res.send('Logged out!');
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/clientes', function (req, res) {
  
  let optionsGet = {
    host: 'hanab1',
    port: 50000,
    path: '/b1s/v1/BusinessPartners',
    method: 'GET'
  };

  let httpget = http.request(optionsGet, resp =>{
    console.log('status: ', resp.statusCode);

    resp.on('data', d => {
      res.send(d);
    });
  });

  httpget.on('error', err => {
    console.error(err);
  });

  httpget.end();

});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});