"use strict"

var celestialBodies = {
    Moon: 10,
    Mercury: 1,
    Venus: 2,
    Mars: 4,
    Jupiters: 5,
    Saturn: 6,
    Uranus: 7,
    Neptune: 8,
    Pluto: 9,
    Sun: 0
}

module.exports = function(planet, latInDegrees, lonInDegrees, callback) {

    var request = require('request');
    var htmlParser = require('fast-html-parser');

    const baseUrlJapanObservatory = "http://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/horizontal_en.cgi";

    var date = new Date().toISOString();
    var y = date.split('-')[0];
    var m = date.split('-')[1];
    var d = date.split('-')[2].split('T')[0];
    var h = date.split(':')[0].split('T')[1];
    var i = date.split(':')[1];
    var s = date.split(':')[2].split('.')[0];

    request.post({
        url: baseUrlJapanObservatory, 
        form: {
            body: celestialBodies[planet],
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
        }}, 
        function(error, res, body) {
            //Check for Error
            if(error != undefined) {
                console.log("Error occured while fetching planetary details from Japan");
                callback(-1, -1);
                return;
            }

            try {
                var root = htmlParser.parse(body);
                var resultTable = root.querySelector('.result');
                var text = resultTable.structuredText.split('\n');
                console.log("Altitude: " + text[8]);
                console.log("Azimuth: " + text[9]);
                callback(text[9], text[8]);
            }
            catch(e) {
                console.error("Error " + e + " occured ");
                callback(-1, -1);
            }
        }
    )
}







