const express = require('express');
const http = require('http');
const app = express();
let data = {
  CompanyDB: "CORESA_01_12_2020",
  UserName: "manager",
  Password: "s0p0rt3"
}

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
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
    });

    response.on('end', function() {
      res.send('ok');
    });
    
  });

  if(httpreq.write(data)){
    res.send('Logged in!');
  }

 

  
  
  httpreq.end(); 
});

app.get('/logout', function (req, res) {
  
  
  res.send('Logged out!');
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});