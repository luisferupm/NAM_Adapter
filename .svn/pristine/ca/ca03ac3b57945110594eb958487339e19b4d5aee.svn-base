/**
 *    File:         routes/ping_controller
 *
 *    Author:       Luis Fernando Garcia 
 *                  Polytechnic University of Madrid (UPM)
 *
 *    Date:         07/10/2014
 *
 *    Description:  XIMM-NAM Adapter - 
 *
 *    License:
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the following copyright notice,
 *       this list of conditions and the disclaimer below.
 * 
 *        Copyright (c) 2003-2008, Polytechnic University of Madrid (UPM)
 * 
 *                              All rights reserved.
 * 
 *     * Redistribution in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 * 
 *    *  Neither the name of Polytechnic University of Madrid nor the names of its 
 *       contributors may be used to endorse or promote products derived from this 
 *       software without explicit prior written permission.
 * 
 * You are under no obligation whatsoever to provide any enhancements to Polytechnic 
 * University of Madrid,or its contributors.  If you choose to provide your enhance-
 * ments, or if you choose to otherwise publish or distribute your enhancement, in 
 * source code form without contemporaneously requiring end users to enter into a 
 * separate written license agreement for such enhancements, then you thereby grant 
 * Polytechnic University of Madrid, its contributors, and its members a non-exclusive, 
 * royalty-free, perpetual license to copy, display, install, use, modify, prepare 
 * derivative works, incorporate into the software or other computer software, dis-
 * tribute, and sublicense your enhancements or derivative works thereof, in binary 
 * and source code form.
 * 
 * DISCLAIMER - THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * “AS IS” AND WITH ALL FAULTS.  THE POLYTECHNIC UNIVERSITY  OF MADRID, ITS CONTRI-
 * BUTORS, AND ITS MEMBERS DO NOT IN ANY WAY WARRANT, GUARANTEE, OR ASSUME ANY RES-
 * PONSIBILITY, LIABILITY OR OTHER UNDERTAKING WITH RESPECT TO THE SOFTWARE. ANY E-
 * XPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRAN-
 * TIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT
 * ARE HEREBY DISCLAIMED AND THE ENTIRE RISK OF SATISFACTORY QUALITY, PERFORMANCE,
 * ACCURACY, AND EFFORT IS WITH THE USER THEREOF.  IN NO EVENT SHALL THE COPYRIGHT
 * OWNER, CONTRIBUTORS, OR THE UNIVERSITY CORPORATION FOR ADVANCED INTERNET DEVELO-
 * PMENT, INC. BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTIT-
 * UTE GOODS OR SERVICES; REMOVAL OR REINSTALLATION LOSS OF USE, DATA, SAVINGS OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILIT-
 * Y, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHE-
 * RWISE) ARISING IN ANY WAY OUT OF THE USE OR DISTRUBUTION OF THIS SOFTWARE, EVEN
 * IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */

var config = require('../config/config.js');
var format_res = require('./format.js');
var testShow = require('../models/testshow.js');
var TIMEOUT = 30000;


exports.ping = function(req, res, next) {

    console.info("params:");
	console.info(req.params);
	var date = new Date();
		
	var format = req.params.format || 'json';
    format = format.toLowerCase();
	var count = req.params.count || 1;
	
	//build measurement data
	
	var testshow = new testShow({
  		idTest:				"Ping-" + Date.now(),
  		domain:				config.federation + '-' + config.domain,
  		type:				"Ping",
  		date:				date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
  		time:				date.getHours() + ":" + date.getMinutes(),
  		hostSource:			req.headers.host,
  		hostDestination:	req.params.addressHost,
  		error:				false,
  		result:				""
  
  	});
	

	//ping launch
	var comand = 'ping -c '  + count + ' ' + testshow.hostDestination;
	console.info(comand);
	
	var options = {
			encoding: 'utf8',
			timeout: TIMEOUT,
			maxBuffer: 200*1024,
			killSignal: 'SIGTERM',
			cwd: null,
			env: null };
	
	var exec = require('child_process').exec, child;
	
	child = exec(comand, options, function(error, stdout, stderr){
		if(error !== null){
			testshow.error = true;
			testshow.result = 'Host Not available';
			testshow.save(function(err) {
		  		if(!err) {
		  			console.log('Created');
		  		} else {
		  			console.log('ERROR: ' + err);
		  		}
		  	});
			res.send(format_res.parserFormat(JSON.stringify(testshow), format));
			 
			console.info("ping ERROR: "+stderr + stdout);
			child.kill('SIGTERM');
		}
		else{
			testshow.error = false;
			testshow.result = 'Available';
			
			testshow.save(function(err) {
		  		if(!err) {
		  			console.log('Created');
		  		} else {
		  			console.log('ERROR: ' + err);
		  		}
		  	});
			res.send(format_res.parserFormat(JSON.stringify(testshow), format));
		}
	});
};

