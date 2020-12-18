const XMLHttpRequest = require('xhr2');
const xhr = new XMLHttpRequest();
const user = "manager";
const pass = "s0p0rt3";
const schema = "CORESA_01_12_2020"; //"KING_SA";
const loginJson = {
    "CompanyDB": schema,
    "UserName": user,
    "Password": pass
}

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