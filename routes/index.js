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
var cerrojo = true;
var host = require('../models/host_data.js');
var config = require('../config/config.js');

var FS   = require('fs');
var http = require('http');
var datareq = '';

var configFile = "./config/config.js"

var MODEL = {
   find: function (question, action) {
	   //console.log(question)
     FS.readFile('./config/config.js', 'utf-8', function(err, bbdd) {
       //console.log(bbdd)
       var question_var = new RegExp(question+'.*$','m')
       //console.log(question_var)
       action(err, bbdd.match(question_var))
       
     });
   },

   all_data: function (action) {
    FS.readFile('./config/config.js', 'utf-8', function(err, bbdd){
    	console.log(typeof(bbdd))
    	var question_var = new RegExp('(.*):.*$','gm');
    	var bbdd_data = bbdd.match(question_var);
    	console.log(bbdd_data)
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
   
   findAndUpdate: function (params, action) {
	   //console.log(question)

	   var question_var = "";
	   var new_quest_var = "";
	     FS.readFile('./config/config.js', 'utf-8', function(err, bbdd) {
	       //console.log(bbdd)
	       var bbdd_var = bbdd;
	       //console.log(question_var)
	       
		   for (i in params){
			    var params_old = (params[i]).match(/[_a-z]+/mgi)[0] + ' :'
			    //console.log("buscando: ")
			    //console.log(params_old)
			    
			    params[i]=params[i].replace(/[{}]/g,"")
			    params[i]=params[i].replace(/["]/,"")
			    params[i]=params[i].replace(/["]/,"")
			    params[i]=//params[i].replace(/:/g," : ")
			    //var a = new RegExp(params[i].replace(/(.*):(.*)/g,"$2"))
			   // params[i]=params[i].replace(a, "$1");
			   // console.log(params[i])
			    question_var = new RegExp(params_old+'.*$','m')
			    //console.log(question_var)
			    new_quest_var = params[i];
			    var bbdd_question = bbdd_var.match(question_var)
 
			    console.log(bbdd_question[0])
				console.log(new_quest_var)
			    bbdd_var = bbdd_var.replace(new RegExp(bbdd_question[0]), new_quest_var+',');
				
					 
				 

			    
			}
	       
	       
			    FS.writeFileSync('./config/config.js', bbdd_var, 'utf-8', function (err) {
			    	 console.log("Config file saved")
					 action(err);
					 
				 });
	       
			 
		// } else { action(err); };
     
	   });
   
   }
};
 



exports.index = function(req, res){
  res.render('index', { title: 'NAM Adapter' });
};

exports.config = function(req, res){

	
	host.find({regionId: config.regionId}, function(err, hosts) {
  		if(!err) {
  			//console.log(JSON.stringify(hosts))
  			
  			res.render('config', { session: req.session, host: hosts[0] });
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});

		
	
	
};

exports.configChange = function(req, res){
	//console.log(req.body);
	//console.log("body");
	console.log(JSON.stringify(req.body).split(','));
	
	var params = JSON.stringify(req.body).split(',');
	
	MODEL.findAndUpdate(params, function(err, data_r){
	  	    	
	  			//console.log("config_2");
	  			//console.log(data_r)
 		
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
  			
  			//console.log(JSON.stringify(hosts))
  			//console.log(hosts)
  			res.render('config', { session: req.session, host: hosts });
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
	 
	
	
};


exports.bdw = function(req, res){
		  res.render('bdw', { session: req.session });		
	};
				
exports.owd = function(req, res){
			  res.render('owd', { session: req.session });			
	};

exports.packetsLoss = function(req, res){
	  res.render('packetsloss', { session: req.session });
	};
		
var wrap =	function (callback) {
		  callback();
		};
