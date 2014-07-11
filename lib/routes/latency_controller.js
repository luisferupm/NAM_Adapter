/**
 *    File:         routes/latency_controller.js
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





var config = require('../config/config.json');
var format_res = require('./format.js');
var testShow = require('../models/testshow.js');
var TIMEOUT = 30000;
var superagent = require('superagent');
var logger = require('../logger.js');

exports.testowd = function(req, res) {
	//try {   

	logger.info("params:");
	logger.info(req.params);
	var date = new Date();
	
	var format = req.query.format || 'json';
	format = format.toLowerCase();
	
	//build measurement data
	
	var testow = new testShow({
  		idTest:				"OWD-" + Date.now(),
  		domain:				config.federation + '-' + config.domain,
  		type:				"OWD",
  		date:				date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
  		time:				date.getHours() + ":" + date.getMinutes(),
  		hostSource:			req.params.hostS || req.headers.host,
  		hostDestination:	req.params.hostD,
  		error:				false,
  		result:				""
  
  	});
	
	var optionsget = {
		    host : testow.hostDestination, // here only the domain name
		    port : req.params.portD || 3000,
		    path : "/xifi/api/iperf", // the rest of the url with parameters if needed
		};
	
	
	
    logger.info('Options prepared:');
    var path_call_owampd = 'http://'+optionsget.host+':'+optionsget.port+optionsget.path;
    logger.info(path_call_owampd);
    logger.info('Do the GET call');
   
    

    superagent.get(path_call_owampd)
      .end(function(error, resp){
    	if(error){
    		res.send("error_iperf is not found on target host");
    	}else{
    		logger.info(resp.body.port_owd);
    		if (resp.statusCode==200){
            
            
    			var iteration = 3;
				var comand = 'nmap '+ hostDestination
        	
    			
    			logger.info (comand);
        			
    			var options = 
        		{	encoding: 'utf8',
        			timeout: TIMEOUT,
        			maxBuffer: 200*1024,
        			killSignal: 'SIGTERM',
        			cwd: null,
        			env: null };
    			
    			var resul =[];	    			
    			var jitter =0;
    			var j=0;
    			var i=0;
    			
    			for (i=1;i<=iteration; i++){
    				logger.info (comand);  
    				var exec = require('child_process').exec, child;
    				child = exec(comand, options, function(error, stdout, stderr){
    					if(error !== null){
    						logger.info('error detectado en exec');
    						testow.error = 1;
    						testow.result = "OWAMP ERROR: "+ stderr;
    						res.send(format_res.parserFormat(JSON.stringify(testow), format)); 
    						logger.info(testow);

    					}
    					else{
    						testow.result =testow.result+' '+stdout;
    							logger.info (str.result);
    							resul[j]= stdout;
    							resul[j]= (parseFloat((resul[j].match(/([0-9.]+)/)))*1000).toPrecision(4);
    							jitter = jitter + Math.abs((resul[0])-(resul[j]))
    							logger.info('jitter= ' + jitter);
    							resul.sort();
    							logger.info(resul[j]);
    							j++;
    							
    							logger.info(resul);
    							if(((resul.length==3) && str.error!=1 )){
    								jitter = (jitter/3).toPrecision(4);
    								text = text.replace(new RegExp('ipD', 'gm'), hostDestination);
    								text = text.replace(new RegExp('ipD', 'gm'), hostDestination);
    								text = text.replace(new RegExp('m1', 'gm'), resul[0] );
    								text = text.replace(new RegExp('m2', 'gm'), resul[1] );
    								text = text.replace(new RegExp('m3', 'gm'), resul[2] );
    								text = text.replace(new RegExp('m5', 'gm'), jitter );
    								str.result = text;
    								logger.info('resultado es:\n'+testow.result);
    								if ((testow.result.match(/NaN/gm))){
    									
    									logger.info('error detectado en nmap');
    									testow.error = 1;
    									testow.result = "OWAMP ERROR:  Host seems down";
    									res.jsonp(testow); 
    									logger.info(testow);
    									
    								} else {
    								res.jsonp(testow);
    								//}, 30);
    								} 
    							}	
    							
    							
    							
    							//}
    						
    					}
    				});
    				
    				
    				
    				
    			}
    		
        	
    		}else {
    			res.send("not found iperf destination");
    		}
    	} 
      }
       
    	  );
      

 
    		   		
    		
  /*  		
  throw new Error("detect error!");
	}
	catch(e){
		logger.info(e.message); //"display error!"
		res.jsonp('error bwctl');
		next(e);
	}*/

};

exports.owd_server = function(req, res) {
	//try {   
	logger.info(req.params);
	var hostSource = req.params.ipS;
	var comand = 'owampd -p + config.port_iperf_server + ';
	logger.info (comand);
    
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
    	res.json('error');
    	logger.info("owampd ERROR: "+stderr);
    	child.kill('SIGTERM');
    }else{
    	logger.info("owampd OK: "+stdout);
    	res.json({port_owampd : config.port_owampd_server});
    } 
  });
};


exports.testbwSource = function(req, res) {
	
	logger.info("params:");
	logger.info(req.params);
	logger.info("format:");
	logger.info(req.query.format);
	var optionsget = {
		    hostS : req.params.hostS, // here the host source name
		    hostD : req.params.hostD, // here the host destination name
		    port : req.params.portS || 3000,
		    path : "/xifi/api/bwctl/", // the rest of the url with parameters if needed
		    format: "?format=" + req.query.format
		};
	
	
	
    logger.info('Options prepared:');
    var path_call_bwctl = 'http://'+optionsget.hostS+':' + optionsget.port + optionsget.path + optionsget.hostD + optionsget.format;
    logger.info(path_call_bwctl);
    logger.info('Do the GET call');
   
    

    superagent.get(path_call_bwctl)
      .end(function(error, resp){
    	if(error){
      		res.send("error_bwctl is not found on source host");
      	}else{
      		logger.info(resp);
      		if(optionsget.format=="json"){
      			res.send(resp.body);
      		}else{
      			res.send(resp.text);      			
      		}
      		
      	}
      });
};
