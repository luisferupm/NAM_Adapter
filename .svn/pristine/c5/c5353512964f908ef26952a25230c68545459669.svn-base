/**
 *    File:         routes/OnDemand_controller.js
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
var superagent = require('superagent');
var proxy = require('../lib/HTTPClient.js');
var auth = require('./authToken_controller.js');
var myToken = undefined;


exports.requiresAvailableRegions = function (req, res, next) {
	
	console.info("Check Regions ");
	//console.info(req.headers);
	
	// Check Source region is available
	if (req.params.regionIdS){
		
		var base_url = config.ls_global + '/regions/' ;
		
		var regions_url ={
				
				regionIdS : req.params.regionIdS,
				regionIdD : req.params.regionIdD,					
				source :"",
				destination :"",
				typeTest: req.params.typeTest
		
		};
		
		superagent.get(base_url + req.params.regionIdS)
	      .end(function(error, resp){
	    	  if(error){
	        		console.info("Region Source not found");
	        		res.send("Region Source no found");
	        	}else{
	        		
	        		if(resp.body!= null && typeof(resp.body) == 'object'&& resp.body.length > 0 ){
	        			
	        			if("href" in resp.body[0]._link.self){
	        				
	        				regions_url.source = resp.body[0]._link.self.href;	
	        				
		        			// Check destination region is available
	        				
		        			superagent.get(base_url + req.params.regionIdD)
		        		      .end(function(error, resp){
		        		    	  if(error){
		        		        		console.info("Region Destination not found");
		        		        		res.send("Region Destination no found");
		        		        	}else{
		        		        		
		        		        		if(resp.body!= null && typeof(resp.body) == 'object'&& resp.body.length > 0 ){
		        		        			
		        		        			
		        		        			
		        		        			if("href" in resp.body[0]._link.self){
		        		        				
		        		        				
		        		        				regions_url.destination = resp.body[0]._link.self.href;		        			        			
		        			        			
		        		        				req.post = regions_url;
		        			                    next();
		        			        			
		        			        		}else{
		        			        			console.info("Region Destination not found _ Prueba aqui");
		        			        			res.send("Region Destination no found");
		        			        			
		        			        		}
		        		        		}else{
		        		        			console.info("Region Destination not found");
		        		        			res.send("Region Destination no found");
		        		        			
		        		        		}
		        		        		
		        		        		
		        		        		
		        		        		
		        		        		
		        		        		
		        		        	}
		        		        });
		        			
		        		}else{
		        			console.log("Region Source not foun");
		        			res.send("Region Source no found");
		        			
		        		}
	        		}else{
	        			console.log("Region Source not found");
	        			res.send("Region Source no found");
	        			
	        		}
	        		        		
	        	}
	        });	
		
	}else{
		res.send("Region Source no found");
	}	
		
		
	};

exports.requiresAvailableHosts = function (req, res, next) {
	
	console.info("Check hosts Link");
	console.info(req.post);
	
	// Check Source Host is available
	if (req.params.regionIdS){
		
		var base_url = config.ls_global + '/regions/'+ req.params.regionIdS + '/hosts/' ;
		
		var hosts_ip ={
				regionS: req.params.regionIdS,
				source :"",
				port_source:"",
				ip_address_source:"",
				regionD: req.params.regionIdD,
				destination :"",
				port_destination:"",
				ip_address_destination:"",
				typeTest: req.post.typeTest
		
		};
		console.log(base_url + req.params.hostIdS);
		superagent.get(base_url + req.params.hostIdS)
	      .end(function(error, resp){
	    	  if(error){
	        		console.info({error: 'Source Host not found .' + error});
	        		res.send({error: 'Source Host not found'});
	        	}else{
	        			        		
	        		if(resp.body!= null && typeof(resp.body) == 'object'&& resp.body.length > 0 ){
	        			
	        			if("ipAddress" in resp.body[0]){
	        				
	        				base_url = config.ls_global + '/regions/' + req.params.regionIdD + '/hosts/';
	        				//console.log(resp.body[0]);
	        				hosts_ip.source = resp.body[0].ipAddress;
	        				hosts_ip.port_source = resp.body[0].port_NAM;
	        				hosts_ip.ip_address_source = resp.body[0].ip_address;
	        				//console.log(hosts_ip.port_source);
	        				
		        			// Check destination host is available
	        				console.log(base_url + req.params.hostIdS);
		        			superagent.get(base_url + req.params.hostIdD)
		        		      .end(function(error, resp){
		        		    	  if(error){
		        		        		console.info({error: 'Destination Host not found'});
		        		        		res.send({error: 'Destination Host not found'});
		        		        	}else{
		        		        		
		        		        		if(resp.body!= null && typeof(resp.body) == 'object'&& resp.body.length > 0 ){
		        		        			
		        		        			if("ipAddress" in resp.body[0]){
		        		        				hosts_ip.destination = resp.body[0].ipAddress;	
		        		        				hosts_ip.port_destination = resp.body[0].port_NAM;
		        		        				hosts_ip.ip_address_destination = resp.body[0].ip_address;
		        		        				//console.log(hosts_ip.port_destination);
		        			        			req.post = hosts_ip;
		        			        			
		  
		        			                    next();
		        			        			
		        			        		}else{
		        			        			console.info({error: 'Destination Host not found'});
		        			        			res.send({error: 'Destination Host not found'});
		        			        			
		        			        		}
		        		        		}else{
		        		        			console.info({error: 'Destination Host not found'});
		        		        			res.send({error: 'Destination Host not found'});
		        		        			
		        		        		}
		        		        		
		        		        		
		        		        		
		        		        		
		        		        		
		        		        		
		        		        	}
		        		        });
		        			
		        		}else{
		        			console.log({error: 'Source Host not found  _ 1'});
		        			res.send({error: 'Source Host not found'});
		        			
		        		}
	        		}else{
	        			console.log({error: 'Source Host not found _ 2'});
	        			res.send({error: 'Source Host not found'});
	        			
	        		}
	        		
	        		
	        		
	        		
	        		
	        		
	        	}
	        });
	      
    	
		
		
	}else{
		res.send("Source Region no found");
	}
};

exports.runTest = function (req, res, next) {
	console.info("Run Test");
	
	var auth_token = req.headers['x-auth-token'];
	console.info("Token: " + auth_token);
	console.info(req.post);
	console.info(req.query);
	var query = "";
	if(req.query.local){
		query = "?local="+ req.query.local +"&local_ip_source=" + req.post.ip_address_source.local_ip + "&local_ip_destination=" + req.post.ip_address_destination.local_ip;
	}else {
		if(req.query.private){
			query = "?private="+ req.query.private +"&private_ip_source=" + req.post.ip_address_source.private_federation_ip + "&private_ip_destination=" + req.post.ip_address_destination.private_federation_ip;
		}
	}
	var path_call = 'http://' + req.post.source + ':' + req.post.port_source + '/monitoring/' + req.post.typeTest + '/' + req.post.regionD + "-" + req.post.destination + ':' + req.post.port_destination;
	
	console.info("GET: " + path_call + query);
	
	superagent.get(path_call + query)
//	.set('req.post',req.post)
	.set('X-Auth-Token', auth_token)
    .end(function(error, resp){
  	if(error){
  		console.log ("error");
    		res.send({error: 'not found on source host'});
    	}else{
    		
    		if(resp.body.length > 0){
    			
    			res.send(resp.body);
    		}else{
    			try{
    				res.send(JSON.parse(resp.text));
    			} catch (e)
    			{
    				res.send(resp.text);
    				
    			};

    		}
    		
    	}
    });
    
};

/*exports.schedule = function (req, res, next) {
	
	var path_call = 'http://localhost:3000/monitoring/schedule'; 
		

	// Creating instance schedule
	
	superagent.post(path_call)
      .send({
    	  type: req.post.typeTest,
    	  hostSource: req.post.source,
    	  hostDestination: req.post.destination,
    	  frecuency: req.body.frecuency
    	  
      })
      .end(function(e,res){
        if (e){
        	console.info("Error Creating instance schedule " , e)
        }else {
        	console.info("Created instance schedule ")
        }
        
      });
    
};*/



