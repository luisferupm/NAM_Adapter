/**
 *    File:         routes/command_controller.js
 *
 *    Author:       Luis Fernando Garcia 
 *                  Polytechnic University of Madrid (UPM)
 *
 *    Date:         07/10/2014
 *
 *    Description:  XIMM-NAM Adapter
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



var logger = require('../logger.js');

var TIMEOUT = 30000;
var MAXBUFFER = 200*1024;

exports.command_console = function(command, timeout,  error) {

	var result = {
			error : false,
			result: ""
			};
		
		var options = 
		{	encoding: 'utf8',
			timeout: timeout,
			maxBuffer: MAXBUFFER,
			killSignal: 'SIGTERM',
			cwd: null,
			env: null };
			
		var exec = require('child_process').exec, child;
		
		child = exec(command, options, function(err, stdout, stderr){
			logger.debug("out")
			logger.debug(stdout)
			logger.debug("error")
			logger.debug(stderr)
			
			if(err !== null){
				result.error = true;
				result.result = "Command ERROR: _ 1 "+ stderr;
				logger.error("Command ERROR _ 1 : "+stderr);
				return result;
				child.kill('SIGTERM');
				
				
			}else{
				//console.log(stdout);
				result.result = stdout;
				if(result.result !== ""){
					return result;
					
				} else {
					result.error = true;
					logger.error("Command ERROR: _ 2 "+stderr);
					result.result = "Command ERROR: "+ stderr;
					//console.log(result.result);
					return result;
				};
			};
		});
		
		while(result.result==""){
			return result;
			
		}
    
};

exports.command_console_call = function(command, timeout,  error, callback) {

	var result = {
			error : false,
			result: ""
			};
		
		var options = 
		{	encoding: 'utf8',
			timeout: timeout,
			maxBuffer: MAXBUFFER,
			killSignal: 'SIGTERM',
			cwd: null,
			env: null };
			
		var exec = require('child_process').exec, child;
		
		child = exec(command, options, function(err, stdout, stderr){
			//console.log("out")
			//console.log(stdout)
			//console.log("eror")
			//console.log(stderr)
			
			if(err !== null){
				result.error = true;
				result.result = "Command ERROR: _ 1 "+ stderr;
				console.log("Command ERROR _ 1 : "+stderr);
				return result;
				child.kill('SIGTERM');
				
				
			}else{
				//console.log(stdout);
				result.result = stdout;
				if(result.result !== ""){
					return result;
					
				} else {
					result.error = true;
					console.log("Command ERROR: _ 2 "+stderr);
					result.result = "Command ERROR: "+ stderr;
					//console.log(result.result);
					return result;
				};
			};
		});
		
		while(result.result==""){
			return result;
			
		}
    
};