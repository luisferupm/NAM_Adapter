/**
 *    File:         routes/testshows.js
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
module.exports = function(app) {

  var testShow = require('../models/testshow.js');
  var js2xmlparser = require("js2xmlparser");
  var format_res = require('./format.js');
  var host = require('../models/hosts.js');
  var superagent = require('superagent');
  var logger = require('../logger.js');
  
  //GET - Return all test in the DB
  findAllTestShows = function(req, res) {
  	testShow.find(function(err, testshows) {
  		if(!err) {
  			logger.info('GET /history')
  			//logger.info(JSON.stringify(testshows))
        	
  			res.json(testshows);
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Test with specified ID
  findById = function(req, res) {
  	testShow.findById(req.params.id, function(err, testshow) {
  		if(!err) {
        logger.info('GET /history/' + req.params.id);
  			res.send(testshow);
  		} else {
  			logger.info('ERROR: ' + err);
  			res.send('ERROR: ' + err);
  		}
  	});
  };
  
  //GET - Return Tests with specified IDs
  
  findByIds2 = function(req, res) {
	  logger.info(req.params);
	  var path = "http://138.4.47.33:3000/monitoring/regions/"+req.params.regionIdS + "/hosts/"+ req.params.hostIdS
	  logger.info(path);
	  superagent.get(path)
      .end(function(error, resp){
    	  if(error){
        		logger.info("error");
        		//res.send("Source Host no found");
        	}else{
        		logger.info("IP Source");
        		logger.info(resp.body[0].ipAddress);
        		
        		path = "http://138.4.47.33:3000/monitoring/regions/"+req.params.regionIdD + "/hosts/"+ req.params.hostIdD
        		  logger.info(path);
        		  superagent.get(path)
        	      .end(function(error, respo){
        	    	  if(error){
        	        		logger.info("error");
        	        		//res.send("Source Host no found");
        	        	}else{
        	        		logger.info("IP Destination");
        	        		logger.info(respo.body[0].ipAddress);
        		
        		
        		  			
        		  		  testShow.find({type: req.params.typeTest, hostSource: resp.body[0].ipAddress, hostDestination: respo.body[0].ipAddress, error: false})
        		  		  .sort({timestamp: -1})
        		  		  .limit(req.params.number || "")
        		  		  
        		  		  .exec(function(err, test) {
        			  	  		if(!err) {
        			  	  			
        			  	  			res.send(test);
        			  	  		} else {
        			  	  			logger.info('ERROR: ' + err);
        			  	  		}
        			  	  		
        			  		  });
   		  		  
        		
        	}
    	  
      });
        	
    	  
        	}
    	  
      });
	  
	  
	  
  };
  

  findByIds = function(req, res) {
	  //logger.info(req.params);
	  //logger.info(req.query);
	  var numberTest = req.params.number || req.query.number;
	  
	  testShow.find({type: req.params.typeTest, hostSource: req.params.hostSource, hostDestination: req.params.hostDestination, error: false})
		  //.sort({timestamp: -1})
		  //.limit(req.params.number)
		  
		  .exec(function(err, test) {
  	  		if(!err) {
  	  			if(numberTest ){
  	  				
  	  				res.send(test.slice(-numberTest));
  	  			}else {
  	  				res.send(test);
  	  			}
  	  			
  	  		} else {
  	  			logger.info('ERROR: ' + err);
  	  		}
  	  		
  		  });
	  };
        		

  
  //POST - Insert a new Test in the DB
  addTestShow = function(req, res) {
  	//logger.info('POST');
  	//logger.info(req.body);

  	var testshow = new testShow({
  		idTest:				req.body.idTest,
  		domain:				req.body.domain,
  		type:				req.body.type,
  		date:				req.body.date,
  		time:				req.body.time,
  		hostSource:			req.body.hostSource,
  		hostDestination:	req.body.hostDestination,
  		result:				req.body.result
  
  	});
  	
  	testshow.save(function(err) {
  		if(!err) {
  			logger.info('Created');
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});

  	res.send(testshow);
  };

  //PUT - Update a register already exists
  updateTestShow = function(req, res) {
  	testShow.findById(req.params.id, function(err, testshow) {
  		
  		testshow.idTest		=	req.body.idTest;
  		testshow.domain		=	req.body.domain;
  		testshow.type		=	req.body.type;
  		testshow.date		=	req.body.date;
  		testshow.time		=	req.body.time;
  		testshow.hostSource	=	req.body.hostSource;
  		testshow.hostDestination=req.body.hostDestination;
  		testshow.result		=	req.body.result;

  		tetshow.save(function(err) {
  			if(!err) {
  				logger.info('Updated');
  			} else {
  				logger.info('ERROR: ' + err);
  			}
  			res.send(testshow);
  		});
  	});
  }

  //DELETE - Delete a test with specified ID
  deleteTestShow = function(req, res) {
	  	logger.info('delete test');
  		testShow.findById(req.params.id, function(err, testshow) {
  			if(testshow!=null){
  			testshow.remove(function(err) {
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
  
  //DELETE - Delete all test 
  delTestAll = function(req, res) {
	  testShow.remove(function(err) {
  				if(!err) {
  					logger.info('Removed BD');
  					res.send('Removed');
  				} else {
  					logger.info('ERROR: ' + err);
  					next(err);
  				}
  	

	  });
  };

  //Link routes and functions
  app.get('/monitoring/history', findAllTestShows);
  app.get('/monitoring/history/:id', findById);
  app.get('/monitoring/history/:typeTest/:hostSource;:hostDestination/:number?', findByIds);
  app.get('/monitoring/history_old/:typeTest/:hostSource;:hostDestination/:number?', findByIds2);
  app.post('/monitoring/testadd', addTestShow);
  app.put('/monitoring/history/:id', updateTestShow);
  app.delete('/monitoring/history/:id', deleteTestShow);
  app.delete('/monitoring/deltestall', delTestAll);

}