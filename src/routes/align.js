'use strict';

var express = require('express');
var alignRouter = express.Router();

var pp = require('../controller/planet_positions.js');

module.exports = function () {
    alignRouter.route('/')
		.post(function(req, res) {
            var obj = req.body.obj;
            var lat = decimalToDegrees(req.body.lat);
            var lon = decimalToDegrees(req.body.lon);
            var alpha = parseFloat(req.body.alpha);
            var beta = parseFloat(req.body.beta);

            pp(obj, lat, lon, function(az,al) {

                if(az == -1 && al == -1) {
                    res.set(400);
                    res.send("Error while fetching position of the " + obj);
                    res.end();
                    return;
                }

                az = degreeToDecimalDegrees(az)
                al = degreeToDecimalDegrees(al)
                console.log("Al: " + al);
                console.log("Az: " + az);
            
                //Move Motors
                if (isAboveHorizon(al)) {
                    var expBeta = 90.0 + parseFloat(al);
                    var movementInDegrees = beta - parseFloat(expBeta)
                    console.log("Degrees to move: " + movementInDegrees)
                    var stepsToMove = degreeToSteps(movementInDegrees)
                    console.log("steps to move: " + parseInt(stepsToMove));
                }

                res.set(200);
                res.end();
            });
		});

    return alignRouter;
}

function isAboveHorizon(al) {
    return parseInt(al) >= 0
}

function degreeToDecimalDegrees(degrees) {
    var d = String(degrees).split(" ");
    var dd = Math.abs(parseInt(d[0])) + parseInt(d[1])/60 + parseInt(d[2])/3600;
    if (parseInt(d[0]) < 0) return dd * -1 ;
    return dd
}

function degreeToSteps(degrees) {
    const steps = 2048
    return degrees * (steps / 360)
}

function decimalToDegrees(latlon) {
    var intDegree = parseInt(latlon);
    var minutes = (latlon - intDegree) * 60;
    var intMinutes = parseInt(minutes);
    var seconds = (minutes - intMinutes) * 60;
    var intSecs = parseInt(seconds);

    return intDegree + ' ' + intMinutes + ' ' + intSecs;
}