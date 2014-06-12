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

var config = require('../config/config.js');




module.exports = function(app) {
	

  var host = require('../models/host_data.js');

  //GET - Return all test in the DB
  findAllhost = function(req, res) {
	  host.find({}, function(err, hosts) {
  		if(!err) {
  			//console.log(JSON.stringify(hosts))
	
  			res.json(hosts);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Test with specified ID
  findById = function(req, res) {
	  host.find({regionId: req.params.regionId, hostId : req.params.hostId}, function(err, host) {
  		if(!err) {
  			
  			res.send(host);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  
  ///////////////////////////////////////
  
//POST - Find and Update one host in the DB, creates the host if it doesn't exist.
  findAndUpdateHostData = function(host_data) {
	  
	  console.log('UpdateHostData');

	//  console.log('Token - addhost');
	//  console.log(auth_token);
	  

	  
	  var host_dataNew = {
			   	  
			   	  hostId:		config.hostId,
			   	  regionId:		config.regionId,
			   	  type:			config.type,
			   	  ipAddress:	config.ipAddress,
			   	  ip_address:	config.ip_address,
			   	  port_NAM:		config.port_NAM_Adapter,
			   	  port_iperf:	config.port_iperf_server,
			   	  ping_status:	config.ping_status,
			   	  bdw_status:	config.bdw_status,
			   	  owd_status:	config.owd_status,
			   	  ntp_server : 	config.ntp_server,
			   	  NGSIAdapter_url : config.NGSIAdapter_url,	
			   	  limit_scheduledTest : config.limit_scheduledTest,
			   	  ls_global : config.ls_global,
			   	  BDW_endpoint_dest_schedule: config.bdw_endpoint_default,
			   	  OWD_endpoint_dest_schedule: config.owd_endpoint_default

			   	};
	  
	  
	  host.findOneAndUpdate({}, host_dataNew, {upsert: true}, function(err, hostid) {
	  		if(!err) {
	  			
	  			//console.log(hostid);

	  			var path_serverNAM = 'http://localhost:' + hostid.port_NAM + '/monitoring';
	  			   	
	  			var path_bdw = path_serverNAM + '/schedule/' + hostid.regionId +'-' +hostid.hostId
	  			    //console.log(path_bdw)
	  			    
	  			   	superagent.post(path_bdw)
	  			   	//.set('X-Auth-Token', auth_token)
	  			   	.send(hostid.BDW_endpoint_dest_schedule[0])
	  			   	.end(function(error,res){
	  				
	  			   		if(!error && res.statusCode==200){
	  			   			console.log("scheduled default Test BDW OK");
	  			   		//console.log(res.body);
  			   			//console.log(res.text);
	  				
	  			   		}else {
	  			   			console.log("Error: scheduled default Test BDW fail, " + error + ' statusCode: ' + res.statusCode);
	  			   			console.log(res.body);
	  			   			//console.log(res.text);
	  			   		}
	  			  
	  			   	});
	  			   	
	  			   	var path_owd = path_serverNAM + '/schedule/' + hostid.regionId +'-' +hostid.hostId
	  			    
	  			   	//console.log(path_owd)
	  			   		   	
	  			  	superagent.post(path_owd)
	  			  	
		  			//.set('X-Auth-Token', auth_token)
	  			   	.send(hostid.OWD_endpoint_dest_schedule[0])   		   	
	  			   	.end(function(error,res){
	  				
	  			   		if(!error && res.statusCode==200){
	  			   			console.log("scheduled default Test OWD OK");
	  			   			//console.log(res.body);
	  			   		}else {
	  			   			console.log("Error: scheduled default Test OWD fail, " + error + ' statusCode: ' + res.statusCode);
	  			   			console.log(res.body);
	  			   		}
	  			  
	  			   	});
	  			
	  			  //console.log(hostid);	
	  			
	  		} else {
	  			console.log('ERROR: ' + err);
	  		}
	  	});

  };

  
  
  /////////////////////////////
  

  app.get('/monitoring/nam/hosts_data', findAllhost);
  app.get('/monitoring/host_data/:hostIp', findByIp);
  
}