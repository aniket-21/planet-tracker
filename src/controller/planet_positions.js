var request = require('request');
var jp = require('jsonpath');
var jsonify = require('jsonify');
var htmlParser = require('fast-html-parser');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

//This will later come from API
var planet = "Moon";
var lat = "1.38111111";
var lon = "103.89194444";

var latInDegrees = "1 22 52";
var lonInDegrees = "103 53 31";

var date = new Date().toISOString();
var y = date.split('-')[0];
var m = date.split('-')[1];
var d = date.split('-')[2].split('T')[0];
var h = date.split(':')[0].split('T')[1];
var i = date.split(':')[1];
var s = date.split(':')[2].split('.')[0];

var baseUrlCurrentPlanetPosition = 'http://api.nginov.com/shared/ws/astro/?out=json';
var urlCurrentPlanetPosition = baseUrlCurrentPlanetPosition + "&lat=" + lat + "&lon=" + lon + "&y=" + y + "&m=" + m + "&d=" + d + "&h=" + h + "&i=" + i + "&s=" + s;
console.info("URL formed: " + urlCurrentPlanetPosition);
//?lat=1.3521000&lon=103.8198000&alt=30&y=2017&m=05&d=11&h=14&i=44&s=00

/*request(urlCurrentPlanetPosition, function(error, res, body) {

    //Check for Error
    if(error != undefined) {
        console.log("Error occured while fetching planetary details");
        return;
    }
    
    try {
        var objBody = jsonify.parse(body);
        var planetDetails = jp.query(objBody, '$.astropositions.positions[?(@.name=="' + planet + '")]');
        planetDetails = planetDetails[0];

        var azimuth = planetDetails.azimuth;
        var altitude = planetDetails.height;

        if(azimuth >= 180)
            azimuth = azimuth - 180;
        else
            azimuth = azimuth + 180;

        console.log("azimuth: " + azimuth + " altitude: " + altitude);
    }
    catch(e) {
        console.error("Exception occured: " + e);
        return;
    }
    
})*/

var baseUrlJapanObservatory = "http://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/horizontal_en.cgi";
request.post({
    url: baseUrlJapanObservatory, 
    form: {
        body: 10,
        year: y,
        month: m,
        day: d,
        hour: h,
        min: i,
        sec: s,
        choice: 1,
        lat: latInDegrees,
        lon: lonInDegrees,
        hgt: 30,
        lst: 0,
        Go: 'Go',
        key: 'Specified Place',
        anywhere: 1,
        choice0: 1,
        div: 1,
        divu: 3,
        len: 1,
        lenu: 3,
        ref: 1,
        dms: 0,
        nocalc: 0
    }}, function(error, res, body) {
    //Check for Error
    if(error != undefined) {
        console.log("Error occured while fetching planetary details from Japan");
        return;
    }

    try {
        var root = htmlParser.parse(body);
        var resultTable = root.querySelector('.result');
        var text = resultTable.structuredText.split('\n');
        console.log("Altitude: " + text[8]);
        console.log("Azimuth: " + text[9]);
    }
    catch(e) {
        console.error("Error occured while fetching data from Japan Observatory website");
    }
})