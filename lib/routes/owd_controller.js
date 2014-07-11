/**
 *    File:         routes/owd_controller.js
 *
 *    Author:       Luis Fernando Garcia 
 *    				Jose Gonzalez
 *                  Universidad Politéctica de Madrid (UPM)
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
 *        Copyright (c) 2003-2008, Universidad Politécnica de Madrid (UPM)
 * 
 *                              All rights reserved.
 * 
 *     * Redistribution in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 * 
 *    *  Neither the name of Universidad Politécnica de Madrid nor the names of its 
 *       contributors may be used to endorse or promote products derived from this 
 *       software without explicit prior written permission.
 * 
 * You are under no obligation whatsoever to provide any enhancements to Universidad 
 * Politécnica de Madrid,or its contributors.  If you choose to provide your enhance-
 * ments, or if you choose to otherwise publish or distribute your enhancement, in 
 * source code form without contemporaneously requiring end users to enter into a 
 * separate written license agreement for such enhancements, then you thereby grant 
 * Universidad Politécnica de Madrid, its contributors, and its members a non-exclusive, 
 * royalty-free, perpetual license to copy, display, install, use, modify, prepare 
 * derivative works, incorporate into the software or other computer software, dis-
 * tribute, and sublicense your enhancements or derivative works thereof, in binary 
 * and source code form.
 * 
 * DISCLAIMER - THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * “AS IS” AND WITH ALL FAULTS.  THE UNIVERSIDAD POLITECNICA DE MADRID, ITS CONTRI-
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
var logger = require('../logger.js');
var superagent = require('superagent');
var dateformat = require('dateformat');


var TIMEOUT = 30000;


exports.testowd = function(req, res) {
	//try {   

	//logger.info("params:");
	//logger.info(req.params);
	
	var hostDestination = "";
	var portDestination = "";
	
	if (req.params.hostD.match(/.*:/mg) === null){
		hostDestination = req.params.hostD;
		portDestination = 3000;
		
	}else {
		hostDestination = req.params.hostD.match(/.*:/mg)[0];
		portDestination = req.params.hostD.match(/:(.*)/mg)[0] || 3000;
	}
	
	hostDestination = hostDestination.replace(/:/g,"");
	portDestination = portDestination.toString().replace(/:/g,"");
	
	logger.debug(hostDestination + "-" +portDestination);
	
	
	
	var date = new Date();
	var time = 1;
	
	var format = req.query.format || 'json';
	format = format.toLowerCase();
	
	
	//build measurement data
	
	var testOwdCtl = new testShow({
  		idTest:				"OWD-" + Date.now(),
  		type:				"owd",
  		timestamp:			dateformat(new Date(), 'yyyy-mm-dd H:MM:ss'),
  		hostSource:			req.params.hostS || config.regionId + "-" + req.headers.host.match(/.*:/mg)[0].replace(/:/g,""),
		hostDestination:	req.params.regionD + "-" + hostDestination,
  		error:				false,
  		result:				""
  
  	});
	
	
	
	
	
	var optionsget = {
			host : hostDestination, // here only the domain name
		    port : portDestination || 3000,
		    path : "/monitoring/owdserver/" 
		};
	
	
	
    // Options prepared
    var path_call_owdctl = 'http://'+optionsget.host+':'+optionsget.port+optionsget.path;
       
    logger.debug("GET: " + path_call_owdctl);
    superagent.get(path_call_owdctl + time)
      .end(function(error, resp){
    	if(error){
    		res.send({error: "Owd not found on target host" + error});
    	}else{
    		if (resp.statusCode==200){

    			var comand = 'ntpdate -u ' + config.ntp_server;
               		
    			//logger.info (comand);
        			
    			var options = 
        		{	encoding: 'utf8',
        			timeout: TIMEOUT,
        			maxBuffer: 200*1024,
        			killSignal: 'SIGTERM',
        			cwd: null,
        			env: null };
        			
    			var exec = require('child_process').exec, child;
        		
    			child = exec(comand, options, function(error, stdout, stderr){
    				if(error){
    					testOwdCtl.error = true;
    					testOwdCtl.result = "OWDCTL ERROR: "+ stderr;
    					res.send(format_res.parserFormat(JSON.stringify(testOwdCtl), format)); 
    					logger.info("OWD ERROR : "+stderr);
    					child.kill('SIGTERM');
    				}else{
    					
    					
    					var owdi =[];
    					var owdv =[];
    					var jitteri=0;
    					var jitterv=0;
    					var  i=0;
    					var  j=0;
    					
    					testOwdCtl.error = false;
    					//logger.info("OWD: "+stdout);
    									
    					for (i=0;i<3; i++){
    						
    						// sending timestamp
    						time = Date.now();
    						
    					    superagent.get(path_call_owdctl + time)
    					      .end(function(error, response){
    					    	if(error){
    					    		res.send({error: "Owd not found on target host" + error});
    					    	}else{
    					    		if (resp.statusCode==200){
    					    			owdi[j]= Date.now()-response.body.time;
    					    			owdv[j]= response.body.result;
    					    			
    					    			if(j==2){
	    					    			owdi.sort();
	    					    			//logger.info(owdi);
	    					    			owdv.sort();
	    					    			//logger.info(owdi);
	    					    			jitteri=owdi[2]-owdi[0];
	    					    			jitterv=owdv[2]-owdv[0];
	    			    					
	    			    					testOwdCtl.result = "owd_sc_min:" + owdi[0] +"ms, " + 
					    										"owd_sc_max:" + owdi[2] + "ms, " + 
					    										"owd_cs_min:" + owdv[0] + "ms, " + 
					    										"owd_cs_max:" + owdv[2] + "ms, " + 
					    										"jitter_sc:" + jitteri  + "ms, " + 
					    										"jitter_cs:" + jitterv  + "ms " ;
	    			    										
	    			    					
	    			    					//logger.info(testOwdCtl.result);
	    			    					
	    			    					testOwdCtl.save(function(err){
	    			    						if(!err){
	    			    							//logger.info('Created');
	    			    						} else {
	    			    							logger.info('ERROR: ' + err);
	    			    						}
	    			    					});	    			    					
	    			    					
	    			    					res.send(format_res.parserFormat(JSON.stringify(testOwdCtl), format));
	    			    					
	    			    					
	    			    					// Send result NGSI_adapter
	    			    					//req.timeout(30);
	    			    					
	    			    					
	    			    					var path_call_NGSI = config.NGSIadapterurl + 'owd?id=' + testOwdCtl.hostSource +";"+ testOwdCtl.hostDestination + '&type=host2host'
	    			    					superagent.post(path_call_NGSI)
	    			    				      .send(testOwdCtl)
	    			    				      .end(function(e,res){
	    			    				    	  
	    			    				    	  if (e){
	    			    				    		  logger.info("Error sending NGSI_adapter " + path_call_NGSI , e)
	    				    				        
	    			    				    	  }else {
	    				    				        	logger.info("Test sent to NGSI_adapter : POST " + path_call_NGSI);
	    			    				    	  }
	    			    				        
	    			    				      });
	    			    					
	    					    		}
    					    			j++;
    					    		}else {
    					    			res.send({error: "Error _ Owd " });
    					    		}
    					    		
    					    	}
    					    	
    					      });
    			   					
    					}
    					 
    				}
    				
    			});
        	
    		}else {
    			res.send("not found ntp destination");
    		}
    	} 
      }
       
    	  );

};

exports.owd_server = function(req, res) {
	  
	
	if (req.params.time==1){

		var comand = 'ntpdate -u ' + config.ntp_server;
		//logger.info (comand);
		
		var options = 
	    	{	encoding: 'utf8',
				timeout: TIMEOUT,
	    		maxBuffer: 200*1024,
	    		killSignal: 'SIGTERM',
	    		cwd: null,
	    		env: null };
	    
		var exec = require('child_process').exec, child;
	    child = exec(comand, options, function(error, stdout, stderr){
	    
	    	if(error){
	    		logger.info("NTP ERROR: "+stderr);
	    		res.json({error: error});
		    	child.kill('SIGTERM');
		    }else{
		    	//logger.info("NTP OK: "+stdout);
		    	res.json({seqNum: 1, result: "NTP OK "});
		    } 
	    });
	}
	else{
		var time = Date.now()-req.params.time;
		if (Date.now()< req.params.time){
			res.json({seqNum: 2, error: 'time not valid, be sure ntp synchronized'});
		}else{
			res.json({seqNum: 2, time: Date.now(), result: time});
		}
	}
	
};


exports.testOwdSource = function(req, res) {
	
	//logger.info("params:");
	//logger.info(req.params);
	//logger.info("format prueba:");
	//logger.info(req.query.format);
	
	var optionsget = {
		    hostS : req.params.hostS, // here the host source name
		    hostD : req.params.hostD, // here the host destination name
		    port : req.params.portS || 3000,
		    path : "/monitoring/owd/", // the rest of the url with parameters needed
		    format: "?format=" + (req.query.format || 'json')
		};
	
    // Options prepared 
    var path_call_owdctl = 'http://'+optionsget.hostS+':' + optionsget.port + optionsget.path + optionsget.hostD + optionsget.format;
        

    superagent.get(path_call_owdctl)
      .end(function(error, resp){
    	if(error){
      		res.send({error: "Owd not found on target host" + error});
      	}else{
      		
      		if(optionsget.format=="json"){
      			logger.info("json");
      			res.json(resp.body);
      					//resp.body);
      		}else{
      			logger.info("text");
      			res.send(JSON.parse(resp.text));      			
      		}
      		
      	}
      });
};

var clockSynchronization = function (server, error){
	var comand = 'ntpdate -u ' + config.ntp_server;
	//logger.info (comand);
	
	var options = 
    	{	encoding: 'utf8',
			timeout: TIMEOUT,
    		maxBuffer: 200*1024,
    		killSignal: 'SIGTERM',
    		cwd: null,
    		env: null };
    
	var exec = require('child_process').exec, child;
    child = exec(comand, options, function(error, stdout, stderr){
    
    	if(error !== null){
    		logger.info("NTP ERROR: "+stderr);
	    	child.kill('SIGTERM');
	    }else{
	    	logger.info("NTP OK: "+stdout);
	    	res.json({interaction: 1, reult: "NTP OK"});
	    } 
    });
};	
