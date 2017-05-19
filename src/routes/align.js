'use strict';

var express = require('express');
var alignRouter = express.Router();

var pp = require('../controller/planet_positions.js');

module.exports = function () {
    alignRouter.route('/')
		.post(function(req, res) {
            //check for resetFlag
            if(req.body.reset === "true") {
                var obj = req.body.obj;
                var lat = decimalToDegrees(req.body.lat);
                var lon = decimalToDegrees(req.body.lon);

                pp(obj, lat, lon, function(az,al) {
                    console.log("Az: " + az + " Al: " + al);
                    res.cookie('azimuth', az);
                    res.cookie('altitude', al);
                    res.cookie('lat', lat);
                    res.cookie('lon', lon);

                    res.set(200);
			        res.end();
                });
            }
            else {
                //read from cookies
                var lat = req.cookies.lat;
                var lon = req.cookies.lon;
                var az = req.cookies.azimuth;
                var al = req.cookies.altitude;

                console.log('lat:' + lat + ' lon:' + lon + ' az:' + az + ' al:' + al);

                res.set(200);
                res.end();
            }
		});

    return alignRouter;
}

function decimalToDegrees(latlon) {
    var intDegree = parseInt(latlon);
    var minutes = (latlon - intDegree) * 60;
    var intMinutes = parseInt(minutes);
    var seconds = (minutes - intMinutes) * 60;
    var intSecs = parseInt(seconds);

    return intDegree + ' ' + intMinutes + ' ' + intSecs;
}