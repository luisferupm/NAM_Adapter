/**
 *    File:         routes/index.js
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

/*
 * GET home page.
 */

var host = require('../models/host_data.js')
, config = require('../config/config.json')
//, pack = require('../package.json')
, pack = {version : "1.0.19.6"}
, logger = require('../logger.js')
, scheduledMeasure = require('../models/scheduledMeasures.js')
, scheduler = require('./schedule_controller.js')
, nconf = require('nconf')
, FS   = require('fs')
, superagent = require('superagent')
, os = require("os");

//
//Setup nconf to use (in-order):
//1. Environment variables
//2. A file located at './config/config.json'
//
nconf.env()
  .file({ file: __dirname +'/config/config.json' });

var datareq = '';

var configFile = "./config/config.json"

var MODEL = {
   find: function (question, action) {
	   //logger.info(question)
     FS.readFile('./config/config.json', 'utf-8', function(err, bbdd) {
       //logger.info(bbdd)
       var question_var = new RegExp(question+'.*$','m')
       //logger.info(question_var)
       action(err, bbdd.match(question_var))
       
     });
   },

   all_data: function (action) {
    FS.readFile('./config/config.json', 'utf-8', function(err, bbdd){
    	logger.info(typeof(bbdd))
    	var question_var = new RegExp('(.*):.*$','gm');
    	var bbdd_data = bbdd.match(question_var);
    	logger.info(bbdd_data)
     action(err, bbdd_data);
    });
   },

   create: function (question, action) {
     FS.appendFile(configFile, question+'\n', 'utf-8', function(err){
       action(err);
     });
   },

 
   update: function (question, new_quest, action) {

     FS.readFileSync(configFile,'utf-8', function(err, bbdd) {
       if (!err) {
         bbdd = bbdd.replace(new RegExp(question), new_quest);
         FS.writeFileSync(configFile, bbdd, 'utf-8', function (err) {
           action(err);
         });
       } else { action(err); };
     });
   },
   
   findAndUpdate: function (params, restart, action) {

	   var question_var = "";
	   var new_quest_var = "";
	     FS.readFile(__dirname.replace(/routes/,"") +'config/config.json', 'utf-8', function(err, bbdd) {
	       if(!err){
	 
	    	 //logger.info(bbdd)
	       var bbdd_var = bbdd;
	       //logger.info(question_var)
	       
		   for (i in params){
			 
			    var params_old = (params[i]).match(/[_a-z ]+/mgi)[0]
			    //logger.info("find: ")
			    //logger.info(params_old)
			    
			    params[i]=params[i].replace(/[{}]/g,"")
			    //params[i]=params[i].replace(/["]/,"")
			    params[i]=params[i].replace(/["]/,"")
			    //params[i]=params[i].replace(/:/g," : ")
			    //var a = new RegExp(params[i].replace(/(.*):(.*)/g,"$2"))
			   // params[i]=params[i].replace(a, "$1");
			   // logger.info(params[i])
			    question_var = new RegExp(params_old+'.*$','m')
			    //logger.info(question_var)
			    new_quest = params[i];
			    
			    var bbdd_question = bbdd_var.match(question_var)
			    logger.info("new config data: " + new_quest)
			    if (bbdd_question[0] && new_quest != {restart:"on"} ){
			    	
			    	logger.info("old config data: " + bbdd_question[0])
				
			    	bbdd_var = bbdd_var.replace(new RegExp(bbdd_question[0]), new_quest+',');
			    }
			    
			}
		   
		   FS.writeFileSync(__dirname.replace(/routes/,"") +'config/config.json', bbdd_var, 'utf-8', function (err) {
		    	 logger.info("Config file saved")
				 action(err);
				 
			 });
		    
		    logger.info(__dirname.replace(/routes/,"") + 'NAMadapter.js');
		    
		    if(restart){
 				logger.info("restarting NAM Adapter " + nconf.get('pid'))
 				process.kill(nconf.get('pid'), 'SIGHUP');
 				//require('forever').stopAll(__dirname.replace(/routes/,"") + 'NAMadapter.js');
 			}
			   
	          // } else { action(err); };
			  
	       }else{
	    	   logger.error("Error: " + err);
	       }
	       
	     });
   
   }
};
 



exports.index = function(req, res, next){
  res.render('index', { title: 'NAM Adapter', version: pack.version, session: req.session });
};

exports.config = function(req, res){

	
	host.find({regionId: config.regionId}, function(err, hosts) {
  		if(!err) {
  			//logger.info(JSON.stringify(hosts))
  			
  			res.render('config', { session: req.session, host: hosts[0], os: os });
  		} else {
  			logger.error('ERROR: ' + err);
  		}
  	});

};

exports.configChange = function(req, res){
	//logger.info(req.body);
	//logger.info("body");

	logger.debug(JSON.stringify(req.body).split(','));
	
	var param = req.body;
	var restart = '';
	if(param['restart']){
		restart = param['restart'];
		delete param.restart;
		
	}
	var params = JSON.stringify(param).split(',');
	
	
	MODEL.findAndUpdate(params, restart, function(err, data_r){
	  	    	
	  			//logger.info("config_2");
	  			//logger.info(data_r)
 		
	});	
	
	var host_data = {
		   	  
			  regionId:		req.body.regionId,
		   	  hostId:		req.body.hostId,
		   	  type:			req.body.type,
		   	  ip_address: {
		   		  private_federation_ip:	req.body.private_federation_ip,
		   		  public_ip:	req.body.public_ip,
		   		  local_ip:	req.body.local_ip
		   		  },
		   	  port_NAM:		req.body.port_NAM_Adapter,
		   	  port_iperf:	req.body.port_iperf_server,
		   	  ping_status:	req.body.ping_status,
		   	  bdw_status:	req.body.bdw_status,
		   	  owd_status:	req.body.owd_status,
		   	  //ntp_server : 	req.body.ntp_server,
		   	  //NGSIAdapter_url : req.body.NGSIAdapter_url,	
		   	  //limit_scheduledTest : req.body.limit_scheduledTest,
		   	  ls_global : req.body.ls_global,
		   	  
		   	};
	
	host.findOneAndUpdate({regionId: config.regionId}, host_data, function(err, hosts) {
  		if(!err) {
  			
  			//logger.info(JSON.stringify(hosts))
  			//logger.info(hosts)
  			

  			res.render('config', { session: req.session, host: hosts });
  		} else {
  			logger.error('ERROR: ' + err);
  		}
  	});
	 
	
	
};


exports.bdw = function(req, res, next){
	var path_call = "http://localhost:" + config.port_NAM_Adapter + "nam/active_scheduled"
	
	scheduledMeasure.find({ active: 'true', type: 'bdw'},function(err, scheduledMeasures) {
  		if(!err) {
  			logger.info('GET /Active scheduled Measures')
  			logger.info(scheduledMeasures.length);
  			//logger.info(JSON.stringify(scheduledMeasures))
  			res.render('bdw', { session: req.session , scheduled: scheduledMeasures });
  			
  		} else {
  			logger.error('ERROR: ' + err);
  			res.send('error'+ err);
  		}
  	});
	
	
		  		
	};
				
exports.owd = function(req, res, next){
	
	scheduledMeasure.find({ active: 'true', type: 'owd'},function(err, scheduledMeasures) {
  		if(!err) {
  			logger.info('GET /Active scheduled Measures')
  			logger.info(scheduledMeasures.length);
  			//logger.info(JSON.stringify(scheduledMeasures))
  			res.render('owd', { session: req.session , scheduled: scheduledMeasures });
  			
  		} else {
  			logger.error('ERROR: ' + err);
  			res.send('error'+ err);
  		}
  	});
	
	};

exports.schedule_new = function(req, res, next){
	logger.info("body");
	logger.info(req.body);
	

	var path_call = "http://localhost:" + config.port_NAM_Adapter + "/monitoring/schedule"
	
	var scheduledData = { regionId: req.body.regionId,	   						
		hostId: req.body.hostId, 			
		frequency: req.body.frequency,	   						
		type: req.body.type
	}
	logger.info(scheduledData);
	//Check minimal parameters 
	if (req.body.type && req.body.regionId && req.body.hostId && req.body.frequency){

		scheduler.scheduleTest_Local(scheduledData);
		next();
/*
	superagent.post(path_call)
	.send(scheduledData)
	.send(req.session)
  	.end(function(error,resp){
  				
  	if(!error && resp.statusCode==200 ){
  			   			
  			   			
  			   			
  	scheduledMeasure.find({ active: 'true', type: req.body.type},function(err, scheduledMeasures) {
  		if(!err) {
  			logger.info('GET /Active scheduled Measures')
  			logger.info(scheduledMeasures.length);
  			//logger.info(JSON.stringify(scheduledMeasures))
  			res.render(req.body.type, { session: req.session , scheduled: scheduledMeasures,  version: pack.version});
  			
  		} else {
  			logger.error('ERROR: ' + err);
  			res.send('error'+ err);
  		}
  	});

  			   		}else {
  			   			logger.error("Error: scheduled default Test OWD fail: Destination host not found");
  			   			
  			   		}
  			  
  			   	});
*/
	}else {
		res.send('Error: invalid parameters');
	}
	

	
	};
	
exports.editScheduled = function(req, res){
	scheduledMeasure.findById(req.params.id, function(err, scheduledMeasure) {
	  		if(!err) {
  			logger.debug('GET /Active scheduled Measure')
  			//logger.info(scheduledMeasure.length);
  			//logger.info(JSON.stringify(scheduledMeasures))
  			logger.debug(scheduledMeasure.type);
  			res.render('editSchedule', { session: req.session , scheduled: scheduledMeasure });
  			
  		} else {
  			logger.error('ERROR: ' + err);
  			res.send('error'+ err);
  		}
  	});


	
};

exports.changeScheduled = function(req, res){
	var path_call = "http://localhost:"+ config.port_NAM_Adapter + '/monitoring/nam/scheduled/' + req.params.id;
	logger.debug(req.body['type'] + '_endpoint_default:frequency');

	
	nconf.set(req.body['type'] + '_endpoint_default:regionId', req.body['regionIdDestination']);
	nconf.set(req.body['type'] + '_endpoint_default:hostId', req.body['hostDestination']);
	nconf.set(req.body['type'] + '_endpoint_default:frequency', req.body['frequency']);
	nconf.save();
	
	superagent.put(path_call)
	.send(req.body)
    .end(function(error, resp){
  	  if(error){
      		logger.info("Id not found _ error");
      		res.send("ID no found");
      		
      		
      	}else{
      		
      		if(req.body['restart']){
      			
     				logger.info("restarting NAM Adapter " + nconf.get('pid'))
     				process.kill(nconf.get('pid'), 'SIGHUP');
     				
      			
      		}else{
      			scheduledMeasure.find({ active: 'true', type: req.body['type']},function(err, scheduledMeasures) {
      		  		if(!err) {
      		  			
      		  			
      		  			res.render(req.body['type'], { session: req.session , scheduled: scheduledMeasures });
      		  			
      		  		} else {
      		  			logger.error('ERROR: ' + err);
      		  			res.send('error'+ err);
      		  		}
      		  	});
      		}
      	}
    });
	
};
	
exports.delScheduled = function(req, res){
	 res.render('packetsloss', { session: req.session });
};

exports.packetsLoss = function(req, res){
	  res.render('packetsloss', { session: req.session });
	};
		
var wrap =	function (callback) {
		  callback();
		};
