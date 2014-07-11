/**
 *    File:         routes/bdw_controller.js
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



var config = require('../config/config.json');
var format_res = require('./format.js');
var testShow = require('../models/testshow.js');
var scheduledMeasuare = require('../models/scheduledMeasures.js');
var nodes = require('../models/nodes.js');
var c_console = require('./command_controller.js');
var logger = require('../logger.js');
var superagent = require('superagent');
var dateformat = require('dateformat');
var cronJob = require('cron').CronJob;


var TIMEOUT = 30000;


exports.testbw = function(req, res) {
	//try {   


	logger.debug("params testbdw:");
	logger.debug(req.params);
	//logger.info(req.headers)
	logger.info(req.query)
	
	var hostDestination = "";
	var portDestination = "";
	var ipDestination = "";
	var ipSource = "";
	
	if (req.params.hostD.match(/.*:/mg) === null){
		hostDestination = req.params.hostD;
		portDestination = 3000;
		
	}else {
		hostDestination = req.params.hostD.match(/.*:/mg)[0];
		portDestination = req.params.hostD.match(/:(.*)/mg)[0] || 3000;
	}
	
	hostDestination = hostDestination.replace(/:/g,"");
	portDestination = portDestination.toString().replace(/:/g,"");
	
	if(req.query.private){
		ipDestination = req.query.private_ip_destination;
		ipSource = req.query.private_ip_source;
		logger.info("private federation ip: " + req.query.private_ip_destination);
		
	}else if(req.query.local){
		ipDestination = req.query.local_ip_destination;
		ipSource = req.query.local_ip_source;
		logger.info("local ip: " + req.query.local_ip_destination)
		
	} else {
		ipDestination = hostDestination;
	}
	
	var date = new Date();
	
	var format = req.query.format || 'json';
	format = format.toLowerCase();
	
	//build measurement data
	
	var testbwtcl = new testShow({
  		idTest:				"BDW-" + Date.now(),
  		type:				"bdw",
  		timestamp:			dateformat(new Date(), 'yyyy-mm-dd H:MM:ss'),
  		hostSource:			req.params.hostS || config.regionId + "-" + req.headers.host.match(/.*:/mg)[0].replace(/:/g,""),
  		ipSource:			ipSource,
  		hostDestination:	req.params.regionD + "-" + hostDestination,
  		ipDestination:		ipDestination,
  		error:				false,
  		result:				""
  
  	});
	
	
	var optionsget = {
		    host : ipDestination, // here only the domain name
		    port : portDestination || 3000,
		    path : "/monitoring/iperf/" // the rest of the url with parameters if needed
		};
		
    // Options prepared
    var path_call_iperf = 'http://'+optionsget.host+':'+optionsget.port+optionsget.path;
    
    logger.debug("GET: " + path_call_iperf);
    superagent.get(path_call_iperf)
      .end(function(error, resp){
    	if(error){
    		res.send("error_iperf is not found on target host");
    	}else{
    		
    		//logger.info("iperf available host destination, port :" + resp.body.port_iperf);
    		if (resp.statusCode==200){
            
            
    			//var time = 15;
    			var interval = 2 || req.query.interval;
    			//var window = '18M';
        	
    			var command = 'iperf -f m -i  2 -c '+ ipDestination + ' -p ' + resp.body.port_iperf;
        	       		
    			logger.info ("Executing command: " +command);
        			
    			var options = 
        		{	encoding: 'utf8',
        			timeout: TIMEOUT,
        			maxBuffer: 200*1024,
        			killSignal: 'SIGTERM',
        			cwd: null,
        			env: null };
        			
    			var exec = require('child_process').exec, child;
        		
    			child = exec(command, options, function(error, stdout, stderr){
    				if(error !== null){
    					testbwtcl.error = true;
    					testbwtcl.result = "BDW ERROR: _ 1"+ stderr;
    					res.send(format_res.parserFormat(JSON.stringify(testbwtcl), format)); 
    					logger.info("BDW ERROR _ 1: "+stderr);
    					child.kill('SIGTERM');
    				}else{
    					//logger.info(stdout);
    					testbwtcl.result = stdout;
    					if(testbwtcl.result !== ""){
    						testbwtcl.save(function(err) {
    							if(!err) {
    								//logger.info('Created');
    							} else {
    								logger.info('ERROR: ' + err);
    							}
    						});
    						
    						res.send(format_res.parserFormat(JSON.stringify(testbwtcl), format));
    						
    						
    						// Send result NGSI_adapter
	    					var path_call_NGSI = config.NGSIAdapter_url + 'bdw?id=' + testbwtcl.hostSource +";"+ testbwtcl.hostDestination + '&type=host2host'
	    					superagent.post(path_call_NGSI)
	    				      .send(testbwtcl)
	    				      .end(function(e,res){
	    				        if (e){
	    				        	logger.info("Error sending NGSI_adapter " + path_call_NGSI, e)
	    				        }else {
	    				        	logger.info("Test sent to NGSI_adapter : POST " + path_call_NGSI);
	    				        }
	    				        
	    				      });
    						
    					} else {
    						testbwtcl.error = false;
    						logger.info("BDW ERROR: _ 3"+stderr);
    						testbwtcl.result = "BDW ERROR: "+ stderr;
    						//logger.info(testbwtcl.result);
    						testbwtcl.save(function(err) {
    							if(!err) {
    								//logger.info('Created');
    							} else {
    								logger.info('ERROR: ' + err);
    							}
    						});
    						
    						res.send(format_res.parserFormat(JSON.stringify(testbwtcl), format)); 
    					}
    				}
    			});
        	
    		}else {
    			res.send("not found iperf destination");
    		}
    	} 
      }
       
    	  );
      

 
    		   		

};

exports.iperf_server = function(req, res) {
	//logger.info("params:");  
	//logger.info(req.params);
	
	//logger.info("params:");  
	//logger.info(req.params);
	
	var hostSource = req.params.ipS;
	
	
	if(config.bdw_status == 'true'){
		
		logger.info("Iperf available, port: " + config.port_iperf_server);
    	res.json({port_iperf : config.port_iperf_server});

    	
    }else{
		logger.info(config.bdw_status);
    	res.json('packetLoss no found');
    	logger.info('packetLoss no found');
    }
};


exports.testbwSource = function(req, res) {
	
	//logger.info("params:");
	//logger.info(req.params);
	//logger.info("format:");
	//logger.info(req.query.format);
	
	var optionsget = {
			
		hostS : req.params.hostS, // here the host source name
		hostD : req.params.hostD, // here the host destination name
		port : req.params.portS || 3000,
		path : "/monitoring/bdw/", // the rest of the url with parameters if needed
		format: "?format=" + (req.query.format || "json")
	};
	
	
	
    //Options prepared
    var path_call_BDW = 'http://'+optionsget.hostS+':' + optionsget.port + optionsget.path + optionsget.hostD + optionsget.format;

    superagent.get(path_call_BDW)
      .end(function(error, resp){
    	if(error){
      		res.send({error: "is not found on source host"});
      	}else{
      		
      		
      		if(optionsget.format=="json"){
      			logger.info("format: json");
      			res.json(resp.body);
      					//resp.body);
      		}else{
      			
      			res.send(JSON.parse(resp.text));      			
      		}
      		
      	}
      });
};

