#!/usr/bin/env node
'use strict';

const wol = require('wol');
var Telnet = require('telnet-client');

const tvMAC = 'XX:XX:XX:XX:XX:XX'; // LG TV's MAC address needed for the Power On command which uses wake-on-lan
const tvIP = '192.168.1.XXX'; // LG TV's IP address used by the webOS TV API commands; websocket unable to resolve LGwebOSTV hostname (seems to convert to lowercase)
const tvHostname = 'LGwebOSTV'; // Used by the telnet commands; 2017 models use LGwebOSTV; this may be different for 2015 and 2016 models

var screenOff = false;


function sendCmd (command) {
	var connection = new Telnet();
	var params = {
	  host: tvHostname,
	  port: 9761,
	  timeout: 1500
	};

	connection.connect(params);
	connection.on('connect', function () {
		connection.send(command);
		console.log('Sent ' + command);
		connection.end();
	});
}

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 * NOTE: there are no multiple devices support for this example, so only the button name is passed
 */
module.exports.onButtonPressed = function onButtonPressed(name) {
  	console.log(`[CONTROLLER] ${name} button pressed`);
	var lgtv = require("lgtv2")({
    	url: 'ws://' + tvIP + ':3000'
//    	url: 'ws://' + tvHostname + ':3000'
	});

 	var keyCmd;

/*
//		Get API list
		lgtv.on('connect', function () {
    		console.log('connected');
	    	lgtv.request('ssap://api/getServiceList', function (err, res) {
        		console.log(res);
    		});
    	});

//		Get list of TV inputs and labels
		lgtv.on('connect', function () {
    		console.log('connected');
	    	lgtv.request('ssap://tv/getExternalInputList', function (err, res) {
        		console.log(res);
    		});
    	});
*/

	if (name == 'POWER ON') {
		wol.wake(tvMAC, function(err, res){
    		console.log(res);
		});

		lgtv.on('error', function (err) {
    		console.log(err);
		});

		lgtv.on('connect', function () {
    		console.log('connected');
	    	lgtv.subscribe('ssap://audio/getVolume', function (err, res) {
        		if (res.changed.indexOf('volume') !== -1) console.log('volume changed', res.volume);
        		if (res.changed.indexOf('muted') !== -1) console.log('mute changed', res.muted);
    		});
    	});

	};
/*
	if (name == 'POWER OFF') {
		lgtv.on('error', function (err) {
    		console.log(err);
		});

		lgtv.on('connect', function () {
    		console.log('connected');
    		lgtv.request('ssap://system/turnOff', function (err, res) {
        		lgtv.disconnect();
   		 	});
    
		});

		connection.on('close', function() {
  			console.log('telnet connection closed')
		})
	};

	if (name == 'MUTE TOGGLE') {
		lgtv.on('error', function (err) {
    		console.log(err);
		});

		lgtv.on('connect', function () {
    		lgtv.request('ssap://audio/getStatus', function (err, res) {
    			//console.log(res.mute);
    			if (res.mute == false) lgtv.request('ssap://audio/setMute', {mute: true});
    			if (res.mute == true) lgtv.request('ssap://audio/setMute', {mute: false});
    		});
		});
	};


	if (name == 'HDMI_1' || name == 'HDMI_2' || name == 'HDMI_3' || name == 'HDMI_4' || name == 'AV_1') {
		console.log('Input button pressed');
		lgtv.on('error', function (err) {
    		console.log(err);
		});

		lgtv.on('connect', function () {
    		lgtv.request('ssap://tv/switchInput', {inputId: name}, function (err, res) {
    			console.log(res);
    		});
		});
	};
*/
	if (name == "NETFLIX" || name == "AMAZON") {
		lgtv.on('error', function (err) {
    		console.log(err);
		});

		lgtv.on('connect', function () {
    		lgtv.request('ssap://system.launcher/launch', {id: name.toLowerCase()});
		});
	};

/* Controls using telnet commands documented in 2016 and 2017 LG OLED display manuals
 * http://www.lg.com/us/support-product/lg-OLED65W7P#
 */
 	if (name == 'POWER OFF') {
        lgtv.disconnect();
		sendCmd('POWER off');
	};

	if (name == 'VOLUME UP' || name == 'VOLUME DOWN') {
		keyCmd = name.replace(/\s+/g, '').toLowerCase();
		sendCmd('KEY_ACTION ' + keyCmd);
	};

	if (name == 'MUTE TOGGLE') {
		sendCmd('KEY_ACTION volumemute');
	};

	if (name == 'CHANNEL UP' || name == 'CHANNEL DOWN') {
		keyCmd = name.replace(/\s+/g, '').toLowerCase();
		sendCmd('KEY_ACTION ' + keyCmd);
	};

	if (name.indexOf("CURSOR") != -1) {
		switch(name) {
			case 'CURSOR ENTER':
				keyCmd = 'ok';
				break;
			case 'CURSOR UP':
				keyCmd = 'arrowup';
				break;
			case 'CURSOR DOWN':
				keyCmd = 'arrowdown';
				break;
			case 'CURSOR LEFT':
				keyCmd = 'arrowleft';
				break;
			case 'CURSOR RIGHT':
				keyCmd = 'arrowright';
				break;
		}
		sendCmd('KEY_ACTION ' + keyCmd);
	};

	if (name.indexOf("input") != -1) {
		keyCmd = name.substring(6);
		sendCmd('INPUT_SELECT ' + keyCmd);
	};

	if (name.indexOf("DIGIT") != -1) {
		keyCmd = 'number' + name.charAt(6);
		sendCmd('KEY_ACTION ' + keyCmd);
	};

	if (name == "PICTURE MODE") {
		sendCmd('KEY_ACTION videomode');
	};

	if (name == "MENU") {
		sendCmd('KEY_ACTION myapp');
	};

	if (name == "BACK") {
		sendCmd('KEY_ACTION returnback');
	};

	if (name == "EXIT") {
		sendCmd('KEY_ACTION exit');
	};

	if (name == "PLAY" || name == "PAUSE") {
		sendCmd('KEY_ACTION play');
	};

	if (name == "STOP") {
		sendCmd('KEY_ACTION returnback');
	};

	if (name == "REVERSE") {
		sendCmd('KEY_ACTION rewind');
	};

	if (name == "FORWARD") {
		sendCmd('KEY_ACTION fastforward');
	};

	if (name == "SETTINGS") {
		sendCmd('KEY_ACTION settingmenu');
	};

	if (name == "INPUTS") {
		sendCmd('KEY_ACTION deviceinput');
	};

	if (name == "3D") {
		sendCmd('KEY_ACTION 3d');
	};

	if (name == "LIVE TV") {
		sendCmd('KEY_ACTION livetv');
	};

	if (name == "ASPECT RATIO") {
		sendCmd('KEY_ACTION aspectratio');
	};

	if (name == "USER GUIDE") {
		sendCmd('KEY_ACTION userguide');
	};

	if (name == "SCREEN OFF") {
		if (screenOff) {
			sendCmd('SCREEN_MUTE allmuteoff');
			screenOff = false;
		} else {
			sendCmd('SCREEN_MUTE screenmuteon');
			screenOff = true;
		}
	};
};

