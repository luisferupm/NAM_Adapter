/**
 *    File:         routes/hosts.js
 *
 *    Author:       Luis Fernando Garcia 
 *                  Polytechnic University of Madrid (UPM)
 *
 *    Date:         07/10/2014
 *
 *    Description:  XIMM-NAM Adapter - Provisional host model.
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


var superagent = require('superagent');


var auth = require('../routes/authToken_controller.js');
var config = require('../config/config.json');
var c_console = require('./command_controller.js');
var logger = require('../logger.js');


var myToken = undefined;


module.exports = function(app) {
	

  var host = require('../models/hosts.js');

  //GET - Return all test in the DB
  findAllhost = function(req, res) {
	  host.find({}, function(err, hosts) {
  		if(!err) {
  			//logger.info(JSON.stringify(hosts))
	
  			res.json(hosts);
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Test with specified ID
  findById = function(req, res) {
	  host.find({regionId: req.params.regionId, hostId : req.params.hostId}, function(err, host) {
  		if(!err) {
  			
  			res.send(host);
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Test with specified IP
  findByIp = function(req, res) {
	  logger.info(req.params);
	  host.find({ipAddress: req.params.hostIp}, function(err, host) {
	  		if(!err) {
	  			
	  			res.send(host);
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  	});
	  
  };
  
  //POST - Insert a new Test in the DB
  addhost = function(req, res, next) {
  	
	  var auth_token = req.headers['x-auth-token'];
	  
	  //logger.info('POST');
	  //logger.info(req.body)
	//  logger.info('Token - addhost');
	//  logger.info(auth_token);
	  
	  host.find({regionId: req.body.regionId, hostId : req.body.hostId},function(err, hostid) {
	  		if(!err) {

	  			if(hostid.length==0){ 
	  				
	  			  	 var hostnew = new host({
	  			   	  
	  			   	  hostId:		req.body.hostId,
	  			   	  regionId:		req.body.regionId,
	  			   	  type:			req.body.type,
	  			   	  ipAddress:	req.body.ipAddress,
	  			   	  ip_address:	req.body.ip_address,
	  			   	  port_NAM:		req.body.port_NAM,
	  			   	  packetLoss_status:	req.body.packetLoss_status,
	  			   	  
	  			   	  bdw_status:	req.body.bdw_status,
	  			   	  owd_status:	req.body.owd_status,
	  			   	  BDW_endpoint_dest_schedule: [],
	  			   	  OWD_endpoint_dest_schedule: []

	  			   	});
	  			                
	  			   	
	  			   	
	  			 	for (i in req.body.BDW_endpoint_dest_schedule){
	  			 		//logger.info(req.body.BDW_endpoint_dest_schedule[i]);
	  			 		//logger.info(hostnew.BDW_endpoint_dest_schedule[i]);
	  			 		hostnew.BDW_endpoint_dest_schedule.push(req.body.BDW_endpoint_dest_schedule[i]);
	  			 		//logger.info(hostnew.BDW_endpoint_dest_schedule[i]);
	  			 		hostnew.OWD_endpoint_dest_schedule.push(req.body.OWD_endpoint_dest_schedule[i]);
	  			 		
	  			 	}

	  			   	
	  			   	hostnew.save(function(err) {
	  			   		
	  			   	if(!err) {
  			   			logger.info('Created');
  			   			
  			   		} else {
  			   			logger.info('ERROR: ' + err);	
  			   		}
	  			   		
	  			   		
	  			   	});
	  			   	
	  			   	logger.debug(hostnew);
	  			   	
	  			   	/*
	  			   	// calls API scheduled 
	  			   	var path_serverNAM = 'http://' +hostnew.ipAddress + ':' + hostnew.port_NAM + '/monitoring';
	  			   	
	  			   	var path_bdw = path_serverNAM + '/schedule/' + hostnew.regionId +'-' +hostnew.hostId
	  			    logger.debug(path_bdw)
	  			    
	  			   	superagent.post(path_bdw)
	  			   	.set('X-Auth-Token', auth_token)
	  			   	.send(hostnew.BDW_endpoint_dest_schedule[0])
	  			   	.end(function(error,res){
	  				
	  			   		if(!error && res.statusCode==200){
	  			   			logger.info("scheduled default Test BDW OK");
	  			   		//logger.info(res.body);
  			   			//logger.info(res.text);
	  				
	  			   		}else {
	  			   			logger.info("Error: scheduled default Test BDW fail, " + error + ' statusCode: ' + res.statusCode);
	  			   			logger.info(res.body);
	  			   			//logger.info(res.text);
	  			   		}
	  			  
	  			   	});
	  			   	
	  			   	var path_owd = path_serverNAM + '/schedule/' + hostnew.regionId +'-' +hostnew.hostId
	  			    
	  			   	//logger.info(path_owd)
	  			   		  			   	
	  			  	superagent.post(path_owd)
	  			  	
		  			.set('X-Auth-Token', auth_token)
	  			   	.send(hostnew.OWD_endpoint_dest_schedule[0])   		   	
	  			   	.end(function(error,res){
	  				
	  			   		if(!error && res.statusCode==200){
	  			   			logger.info("scheduled default Test OWD OK");
	  			   			//logger.info(res.body);
	  			   		}else {
	  			   			logger.info("Error: scheduled default Test OWD fail, " + error + ' statusCode: ' + res.statusCode);
	  			   			logger.info(res.body);
	  			   		}
	  			  
	  			   	});
	  			
	  			  */
	  			   	
	  			   	res.send(hostnew);
	  				
	  				
	  				
	  				
	  			}else{
	  				res.send("ERROR: Host already exists in NAM DB");
	  			}
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  	});
	 
	 

  };

  ///////////////////////////////////////
  
//POST - Find and Update one host in the DB, creates the host if it doesn't exist.
  findAndUpdate = function(req, res, next) {
  	
	  var auth_token = req.headers['x-auth-token'];
	  
	  //logger.info('POST');
	  //logger.info(req.body)
	//  logger.info('Token - addhost');
	//  logger.info(auth_token);
	  
	  var host_data = {
			   	  
			   	  hostId:		req.body.hostId,
			   	  regionId:		req.body.regionId,
			   	  type:			req.body.type,
			   	  ipAddress:	req.body.ipAddress,
			   	  ip_address:	req.body.ip_address,
			   	  port_NAM:		req.body.port_NAM,
			   	  packetLoss_status:	req.body.packetLoss_status,
			   	  bdw_status:	req.body.bdw_status,
			   	  owd_status:	req.body.owd_status,
			   	  BDW_endpoint_dest_schedule: req.body.BDW_endpoint_dest_schedule,
			   	  OWD_endpoint_dest_schedule: req.body.OWD_endpoint_dest_schedule

			   	};
	  
	  host.findOneAndUpdate({regionId: req.body.regionId, hostId : req.body.hostId}, host_data, {upsert: true}, function(err, hostid) {
	  		if(!err) {
	  			
	  			//logger.info(hostid);

	  			var path_serverNAM = 'http://' +hostid.ipAddress + ':' + hostid.port_NAM + '/monitoring';
	  			   	
	  			var path_bdw = path_serverNAM + '/schedule/' + hostid.regionId +'-' +hostid.hostId
	  			    //logger.info(path_bdw)
	  			    
	  			   	superagent.post(path_bdw)
	  			   	.set('X-Auth-Token', auth_token)
	  			   	.send(hostid.BDW_endpoint_dest_schedule[0])
	  			   	.end(function(error,res){
	  				
	  			   		if(!error && res.statusCode==200){
	  			   			logger.info("scheduled default Test BDW OK");
	  			   		//logger.info(res.body);
  			   			//logger.info(res.text);
	  				
	  			   		}else {
	  			   			logger.info("Error: scheduled default Test BDW fail, " + error + ' statusCode: ' + res.statusCode);
	  			   			logger.info(res.body);
	  			   			//logger.info(res.text);
	  			   		}
	  			  
	  			   	});
	  			   	
	  			   	var path_owd = path_serverNAM + '/schedule/' + hostid.regionId +'-' +hostid.hostId
	  			    
	  			   	logger.info(path_owd)
	  			   		   	
	  			  	superagent.post(path_owd)
	  			  	
		  			.set('X-Auth-Token', auth_token)
	  			   	.send(hostid.OWD_endpoint_dest_schedule[0])   		   	
	  			   	.end(function(error,res){
	  				
	  			   		if(!error && res.statusCode==200){
	  			   			logger.info("scheduled default Test OWD OK");
	  			   			//logger.info(res.body);
	  			   		}else {
	  			   			logger.info("Error: scheduled default Test OWD fail, " + error + ' statusCode: ' + res.statusCode);
	  			   			logger.info(res.body);
	  			   		}
	  			  
	  			   	});
	  			
	  			   	res.send(hostid);	
	  			
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  	});

  };

  
  
  /////////////////////////////
  
  
  
  
  
  //PUT - Update a register already exists
  
  requiresId = function(req, res, next ) {
	  logger.info(req.params);
	  var hosti = {
			  body :req.body,
			  hostId: ""
	  };
	  
	  host.find({regionId: req.params.regionId, hostId : req.params.hostId},function(err, host) {
	  		if(!err) {
	  			if(host.length!=0){ 
	  				hosti.hostId = host[0].id;
		  			req.post=hosti;
		  			next();
	  			}else{
	  				res.send("ERROR: Host does not exists");
	  			}
	  			
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  
	  });
	  
  };
  
  update = function(req, res) {
	  logger.info(req.post);
	  host.findById(req.post.hostId , function(err, host) {
			  //{regionId: req.params.regionId, hostId : req.params.hostId}, function(err, host) {
		  if(!err) {
			  
			  if(host!=0){ 
				  host.hostId 		=	req.body.hostId || host.hostId;
				  host.regionId		=	req.body.regionId || host.regionId;
				  host.type			=	req.body.type  || host.type;	
				  host.ipAddress	=   req.body.ipAddress  ||host.ipAddress;
				  host.port_NAM		=	req.body.port_NAM  ||  host.port_NAM;
				  host.packetLoss_status	=	req.body.packetLoss_status  ||  host.packetLoss_status;
				  host.bdw_status	=	req.body.bdw_status  ||  host.bdw_status;
				  host.owd_status	=	req.body.owd_status  ||  host.owd_status;
				  host.save(function(err) {
					  if(!err) {
						  logger.info('Updated');
					  } else {
						  logger.info('ERROR: ' + err);
					  }
					  logger.info(host);
					  res.send(host);
				  });
			  
			  }else{
	  				res.send("ERROR: Host does not exists");
	  			
			  }  
	  	
		  } else {
	  			logger.info('ERROR: ' + err);
	  		}
  	});
  };
  
  updatehost = function(req, res) {
	  logger.info(req.params);
	  host.findById(req.params.id , function(err, host) {
			  //{regionId: req.params.regionId, hostId : req.params.hostId}, function(err, host) {
		  if(!err) {
			  logger.info(host);
			  if(host!=0){ 
				  host.hostId 		=	req.body.hostId;
				  host.regionId		=	req.body.regionId;
				  host.type			=	req.body.type;
				  host.ipAddress	=   req.body.ipAddress;
				  host.port_NAM		=	req.body.port_NAM;
				  host.packetLoss_status	=	req.body.packetLoss_status;
  			   	  
				  host.bdw_status	=	req.body.bdw_status;
				  host.owd_status	=	req.body.owd_status;
				  
				  logger.info(host);
				  host.save(function(err) {
					  if(!err) {
						  logger.info('Updated');
					  } else {
						  logger.info('ERROR: ' + err);
					  }
					  //logger.info(host.name);
					  res.send(host);
				  });
			  
			  }else{
	  				res.send("ERROR: Host not exists");
	  			
			  }  
	  	
		  } else {
	  			logger.info('ERROR: ' + err);
	  			next(err);
	  		}
  	});
  };

  //DELETE - Delete a test with specified ID
  deletehost = function(req, res) {
	  logger.info(req.params);
	  	logger.info('delete');
	  	host.findById(req.params.id, function(err, hosts) {
	  		logger.info(hosts)
  			if(hosts!=null){
  				hosts.remove(function(err) {
  				if(!err) {
  					logger.info('Removed');
  					res.send('Removed');
  				} else {
  					logger.info('ERROR: ' + err);
  					next(err);
  				}
  				});
  			}else{
  				res.send('Id not found');
  			}
  		
  	});

  };
  
  //DELETE - Delete all hosts 
  delHostAll = function(req, res) {
	  host.remove(function(err) {
  				if(!err) {
  					logger.info('Removed BD');
  					res.send('Removed');
  				} else {
  					logger.info('ERROR: ' + err);
  					next(err);
  				}
  	

  });
	  	
  };
  
  //PUT - Update a register already exists
  
  requiresId = function(req, res, next ) {
	  logger.info(req.params);
	  var hosti = {
			  body :req.body,
			  hostId: ""
	  };
	  
	  host.find({regionId: req.params.regionId, hostId : req.params.hostId},function(err, host) {
	  		if(!err) {
	  			if(host.length!=0){ 
	  				hosti.hostId = host[0].id;
		  			req.post=hosti;
		  			next();
	  			}else{
	  				res.send("ERROR: Host does not exists");
	  			}
	  			
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  
	  });
	  
  };
  
  //GET - NAM services status
  
  status = function(req, res, next ) {
	  
	  logger.info("ejecutando");
	  logger.info(c_console.command_console("date"));
	  //logger.info(req.params);
	  
	  host.find({regionId: req.params.regionId, hostId : req.params.hostId},function(err, hosti) {
	  		if(!err) {
	  			if(hosti.length!=0){ 
	  				logger.info(hosti);
	  				res.send({"bdw_status": hosti[0].bdw_status,
	  					      "odw_status": hosti[0].owd_status});
	  			}else{
	  				res.send("ERROR: Host does not exists");
	  			}
	  			
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  
	  });
	  
  };
  //GET - NAM services status
  
  bdwstatus = function(req, res, next ) {
	  logger.info(req.params);
	  
	  host.find({regionId: req.params.regionId, hostId : req.params.hostId, bdw_status: "true"},function(err, hosti) {
	  		if(!err) {
	  			if(hosti.length!=0){ 
	  				logger.info(hosti);
	  				res.send({"bdw_status": hosti[0].bdw_status});
	  			}else{
	  				res.send("ERROR: Host does not exists");
	  			}
	  			
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  
	  });
	  
  };

  
  //PUT - Update a register already exists
  
  owdstatus = function(req, res, next ) {
	  logger.info(req.params);
	  
	  host.find({regionId: req.params.regionId, hostId : req.params.hostId, owd_status: "true"},function(err, hosti) {
	  		if(!err) {
	  			if(hosti.length!=0){ 
	  				logger.info(hosti);
	  				res.send({"odw_status": hosti[0].owd_status});
	  			}else{
	  				res.send("ERROR: Host does not exists");
	  			}
	  			
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  
	  });
	  
  };
	  

  ///////////////////////////////////////
  

  status = function(req, res, next ) {
	  
		res.send({"bdw_status": config.bdw_status,
	  		      "odw_status": config.owd_status});
	  			
	  
  };
  //GET - NAM services status
  
  bdwstatus = function(req, res, next ) {

	  res.send({"bdw_status": config.bdw_status});	  

  };
  
  //PUT - Update a register already exists
  
  owdstatus = function(req, res, next ) {
		
	  res.send({"odw_status": config.owd_status});
			
  };

  
  
  //Link routes and functions
  app.get('/monitoring/regions/'+ config.regionId+ '/hosts', findAllhost);
  app.get('/monitoring/nam/hosts_all', findAllhost);
  app.get('/monitoring/hostip/:hostIp', findByIp);
 // app.get('/monitoring/regions/'+ config.regionId+ '/hosts/:hostId', findById);
  app.get('/monitoring/regions/:regionId/hosts/:hostId', findById);
  app.get('/monitoring/regions/'+ config.regionId + '/hosts/:hostId', findById);
  app.post('/monitoring/nam/hosts', addhost);
  app.put('/monitoring/nam/hosts/:id', updatehost);
  app.post('/monitoring/nam/host_data', findAndUpdate);
  app.put('/monitoring/regions/:regionId/hosts/:hostId', requiresId, update);
  app.delete('/monitoring/regions/:regionId/hosts/:hostId', deletehost);
  app.delete('/monitoring/nam/hosts/:id', deletehost);
  app.delete('/monitoring/nam/hosts__all', delHostAll);
  app.get('/monitoring/regions/:regionId/hosts/:hostId/namservices', requiresId, status);
  app.get('/monitoring/regions/:regionId/hosts/:hostId/owdstatus', requiresId, owdstatus);
  app.get('/monitoring/regions/:regionId/hosts/:hostId/bdwstatus', requiresId, bdwstatus);
  
//WS-Route - available

  app.get('/monitoring/regions/:regionId/hosts/:hostId/nam_status', requiresId, status);
  app.get('/monitoring/regions/:regionId/hosts/:hostId/bdw', requiresId, bdwstatus);
  app.get('/monitoring/regions/:regionId/hosts/:hostId/owd', requiresId, owdstatus);

  app.get('/monitoring/namstatus', status);
  app.get('/monitoring/nam/bdwstatus', bdwstatus);
  app.get('/monitoring/nam/owdstatus', owdstatus);

}
