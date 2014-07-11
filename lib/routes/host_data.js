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

var config = require('../config/config.json');

var logger = require('../logger.js');

var scheduler = require('./schedule_controller.js');


module.exports = function(app) {
	

  var host = require('../models/host_data.js');

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

  
  ///////////////////////////////////////
  
//POST - Find and Update one host in the DB, creates the host if it doesn't exist.
  findAndUpdateHostData = function(host_data) {
	  
	 

	//  logger.info('Token - addhost');
	//  logger.info(auth_token);
	  

	  
	  var host_dataNew = {
			   	  
			   	  hostId:		config.hostId,
			   	  regionId:		config.regionId,
			   	  type:			config.type,
			   	  ipAddress:	config.ipAddress,
			   	  ip_address:	config.ip_address,
			   	  port_NAM:		config.port_NAM_Adapter,
			   	  port_iperf:	config.port_iperf_server,
			   	  packetLoss_status:	config.packetLoss_status,
			   	  bdw_status:	config.bdw_status,
			   	  owd_status:	config.owd_status,
			   	  ntp_server : 	config.ntp_server,
			   	  NGSIAdapter_url : config.NGSIAdapter_url,	
			   	  limit_scheduledTest : config.limit_scheduledTest,
			   	  ls_global : config.ls_global,
			   	  BDW_endpoint_dest_schedule: config.bdw_endpoint_default,
			   	  OWD_endpoint_dest_schedule: config.owd_endpoint_default

			   	};
	  
	  
	  host.findOneAndUpdate({Anything:1}, host_dataNew, {upsert: true}, function(err, hostid) {
	  		if(!err) {
	  			logger.info('Update Host Data');
	  			
	  			logger.info("Scheduler-BDW - Check host: " + hostid.BDW_endpoint_dest_schedule[0].regionId + "-" + hostid.BDW_endpoint_dest_schedule[0].hostId)
	  			 
	  			var path_check_hostDestination = config.ls_global + '/regions/' + hostid.BDW_endpoint_dest_schedule[0].regionId +'/hosts/' + hostid.BDW_endpoint_dest_schedule[0].hostId
	  			 
	  			logger.info(path_check_hostDestination)
	  			 
	  			superagent.get(path_check_hostDestination)
	  			.end(function(error,res){
	  				
	  			   		if(!error && res.statusCode==200 && res.body[0] ){
	  			   			
	  			   			var scheduledDataBDW = { regionId: hostid.BDW_endpoint_dest_schedule[0].regionId,
	  			   						hostId: hostid.BDW_endpoint_dest_schedule[0].hostId,
	  			   						frequency: hostid.BDW_endpoint_dest_schedule[0].frequency,
	  			   						type: hostid.BDW_endpoint_dest_schedule[0].type}
	  			   			
	  			   			scheduler.scheduleTest_Local(scheduledDataBDW);
	  			   			
	  			   		}else {
	  			   			logger.error("Error: scheduled default Test BDW fail: Destination host not found");
	  			   			
	  			   		}
	  			  
	  			   	});
	  			   	
	  			
	  			logger.info("Scheduler-OWD - Check host: " + hostid.OWD_endpoint_dest_schedule[0].regionId + "-" + hostid.OWD_endpoint_dest_schedule[0].hostId)
	  			 
	  			var path_check_hostDestination_OWD = config.ls_global + '/regions/' + hostid.OWD_endpoint_dest_schedule[0].regionId +'/hosts/' + hostid.OWD_endpoint_dest_schedule[0].hostId
	  			 
	  			logger.info(path_check_hostDestination_OWD)
	  			    
	  			superagent.get(path_check_hostDestination_OWD)
  			   	.end(function(error,res){
  				
  			   		if(!error && res.statusCode==200 && res.body[0] ){
  			   			
  			   			var scheduledDataOWD = { regionId: hostid.OWD_endpoint_dest_schedule[0].regionId,
  			   						hostId: hostid.OWD_endpoint_dest_schedule[0].hostId,
  			   						frequency: hostid.OWD_endpoint_dest_schedule[0].frequency,
  			   						type: hostid.OWD_endpoint_dest_schedule[0].type}
  			   			
  			   			scheduler.scheduleTest_Local(scheduledDataOWD);

  			   		}else {
  			   			logger.error("Error: scheduled default Test OWD fail: Destination host not found");
  			   			
  			   		}
  			  
  			   	});
	  			   	
	  			   	
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  	});

  };

  
  
  /////////////////////////////
  

  app.get('/monitoring/nam/hosts_data', findAllhost);
  app.get('/monitoring/host_data/:hostIp', findByIp);
  
}
