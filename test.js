const http = require('http');
const net = require('net');
const URL  = require('url');
const port = 50000;
const host = "hanab1";
const user = "manager";
const pass = "s0p0rt3";
const schema = "CORESA_01_12_2020"; //"KING_SA";
/*
const loginJson = {
    "CompanyDB": schema,
    "UserName": user,
    "Password": pass
}
*/
const hana = require('@sap/hana-client');
var connOpts =
{
    host: host,
    port: port,
    user: user,
    password: pass,
    schema: schema
}

let client = hana.createConnection();
let conn = client.connect(connOpts);
if(conn){
    console.log("Conexión realizada con éxito a la base " + schema);
} else {
    console.log("Error en la conexión...");
}

if(conn.disconnect()){
    console.log('Disconnected');
}


/*
SAPB1Login();


function SAPB1Login(){
    let serviceLayerResponse;

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                serviceLayerResponse = JSON.parse(xhr.responseText);
                console.log("Login exitoso!");
                console.log(serviceLayerResponse);
            } else {
                let mensaje = xhr.statusText || 'Se produjo un error.';
                console.error('Error: ' + xhr.status + '-' + mensaje);
            }
        }
    });
    
    xhr.open('POST', 'https://hanab1:50000/b1s/v1/Login');
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    //todo lo del send va en el body de la request
    xhr.send(JSON.stringify(loginJson));
}

*/