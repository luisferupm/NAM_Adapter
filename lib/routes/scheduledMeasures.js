/**
 *    File:         routes/scheduledMeasures.js
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

var logger = require('../logger.js');

module.exports = function(app) {
	

  var scheduledMeasure = require('../models/scheduledMeasures.js');
  //GET - Return all test in the DB
  
  findAllscheduledMeasures = function(req, res) {
	  
	  scheduledMeasure.find(function(err, scheduledMeasures) {
  		if(!err) {
  			logger.info('GET /scheduledMeasures')
  			logger.info(scheduledMeasures.length);
  			//logger.info(JSON.stringify(scheduledMeasures))
        	
  			res.json(scheduledMeasures);
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});
  };
  
  findAllActivescheduledMeasures = function(req, res) {
	  
	scheduledMeasure.find({ active: 'true'},function(err, scheduledMeasures) {
  		if(!err) {
  			logger.info('GET /Active scheduled Measures')
  			logger.info(scheduledMeasures.length);
  			//logger.info(JSON.stringify(scheduledMeasures))
        	
  			res.json(scheduledMeasures);
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Test with specified ID
  findById = function(req, res) {
	  scheduledMeasure.findById(req.params.id, function(err, scheduledMeasure) {
  		if(!err) {
        logger.info('GET /scheduledMeasure/' + req.params.id);
  			res.send(scheduledMeasure);
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new Scheduled Test in the DB
  addscheduledMeasure = function(req, res) {
  	logger.info('POST');
  	logger.info(req.body);

  	var scheduledMeasure = new scheduledMeasure({
  	   	  
  	  idSchedule:			req.body.idhost,
  	  domain:				req.body.domain,
  	  host:					req.body.host,
  	  type:					req.body.type,
  	  startDate:			req.body.startDate,
  	  EndDate:				req.body.EndDate,
  	  interval:				req.body.interval,
  	  regionIdSource: 		req.body.regionIdSource,
  	  hostSource:			req.body.hostSource,
  	  regionIdDestination: 	req.body.regionIdDestination,
  	  hostDestination:		req.body.hostDestination,
  	  saveMeasures:			0
  
  	});
  	scheduledMeasure.save(function(err) {
  		if(!err) {
  			logger.info('Created');
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});

  	res.send(scheduledMeasure);
  };

  
  //POST - Insert a new Test in the DB
  updatescheduledMeasure = function(req, res) {
  	logger.debug('PUT');
  	logger.info(req.body);

  	scheduledMeasure.findById(req.params.id, function(err, scheduled) {
  	
  		if(!err) {
  	        logger.info('PUT /scheduledMeasure/' + req.params.id);
  	      

  	      scheduled.regionIdDestination  = req.body.regionIdDestination;	
  	      scheduled.hostDestination = req.body.hostDestination;	
  	      scheduled.frequency  = req.body.frequency;	  
  	      scheduled.save(function(err) {
  	        	if(!err) {
  	  	  			logger.info('Updated');
  	  	  			//logger.info(scheduled);
  	  	  		} else {
  	  	  			logger.info('ERROR: ' + err);
  	  	  		}
  	  		
  	        });

  	  	res.json(scheduled);
  	  	} else {
  	  		logger.info('ERROR: ' + err);
  	  	}
  		
  	  
  
  	});
  	
  };

  //DELETE - Delete a test with specified ID
  deletesch = function(req, res) {
	  	logger.info('delete');
	  	scheduledMeasure.findById(req.params.id, function(err, schedulemeasuare) {
  			if(schedulemeasuare!=null){
  				schedulemeasuare.remove(function(err) {
  				if(!err) {
  					logger.info('Removed');
  					res.send('Removed');
	  				try {
	  					
	  					process.kill(schedulemeasuare.processId, 'SIGHUP');
	  					logger.info("process " + schedulemeasuare.processId + " kill")
	  					
	  				} catch(err){
	  					logger.error(err)
	  					logger.error("process " + schedulemeasuare.processId + " no kill")
	  					
	  				}
  				} else {
  					logger.info('ERROR: ' + err);
  					next(err);
  				}
  			});
  			}else{
  				res.send('Id not found');
  			}
  		
  	});

  }

  //DELETE - Delete active schedules
  deleteAllActivescheduledMeasures = function(req, res) {
		  
			scheduledMeasure.find({ active: 'true'}, function(err, scheduledMeasures) {
		  		if(!err) {
		  			//logger.info('GET /scheduledMeasures')
		  			//logger.info(scheduledMeasures.length);
		  			
		  			for (i in scheduledMeasures){
		  				//logger.info(scheduledMeasures[i].processId)
		  				try {
		  					
		  					process.kill(scheduledMeasures[i].processId, 'SIGHUP');
		  					//logger.info("process " + scheduledMeasures[i].processId + " kill")
		  					
		  				} catch(err){
		  					logger.error(err)
		  					//logger.error("process " + scheduledMeasures[i].processId + " no kill")
		  					
		  				}
		  				
		  				scheduledMeasure.update({_id: scheduledMeasures[i]._id},{ active: 'false'},{ multi: 'false'},function(err, scheduled) {
					  		if(!err) {
					  			//logger.info(scheduledMeasures[i].processId)
					  			//process.kill(scheduled.processId, 'SIGHUP');
					  		} else {
					  			logger.info('ERROR: ' + err);
					  			
					  		}
			  			});		  			
		  			}

		  			/*for(i in scheduledMeasures){
		  				scheduledMeasures[i].active = false;
		  	  	        scheduledMeasure[i].save();
		  			}*/
		  			
		  			//logger.info(JSON.stringify(scheduledMeasures))
		        	
		  			res.json(scheduledMeasures);
		  		} else {
		  			logger.info('ERROR: ' + err);
		  		}
		  	});
		  
  };
  
  
  //DELETE - Delete all test 
  deleteScheduledAll = function(req, res) {
	  	scheduledMeasure.remove(function(err) {
  				if(!err) {
  					logger.info('Removed BD');
  					res.send('Removed');
  				} else {
  					
  					logger.info('ERROR: ' + err);
  					next(err);
  				}
  	
	  	});
	  	
  };
  
  
  
  
  
  //DELETE - Delete active schedules
  deleteAllActiveScheduled = function() {
		  
			scheduledMeasure.find({ active: 'true'}, function(err, scheduledMeasures) {
		  		if(!err) {
		  			logger.info('GET / Active Scheduled Measuares')
		  			//logger.info(scheduledMeasures.length);
		  			
		  			for (i in scheduledMeasures){
		  				//logger.info(scheduledMeasures[i].processId)
		  				try {
		  					logger.debug("killing the process " + scheduledMeasures[i].processId)
		  					process.kill(scheduledMeasures[i].processId, 'SIGHUP');
		  					
		  					
		  				} catch(err){
		  					logger.debug(err)
		  					
		  				}
		  				
		  				scheduledMeasure.update({_id: scheduledMeasures[i]._id},{ active: 'false'},{ multi: 'false'},function(err, scheduled) {
					  		if(!err) {
					  			//logger.info(scheduledMeasures[i].processId)
					  			//process.kill(scheduled.processId, 'SIGHUP');
					  		} else {
					  			logger.info('ERROR: ' + err);
					  			
					  		}
			  			});		  			
		  			}

		  			/*for(i in scheduledMeasures){
		  				scheduledMeasures[i].active = false;
		  	  	        scheduledMeasure[i].save();
		  			}*/
		  			
		  			//logger.info(JSON.stringify(scheduledMeasures))
		        	
		  			//res.json(scheduledMeasures);
		  		} else {
		  			logger.info('ERROR: ' + err);
		  		}
		  	});
		  
  };
  
		 
		 

  //Link routes and functions
  app.get('/monitoring/nam/scheduled', findAllscheduledMeasures);
  app.get('/monitoring/nam/active_scheduled', findAllActivescheduledMeasures);
  app.get('/monitoring/nam/scheduled/:id', findById);
  app.put('/monitoring/nam/scheduled/:id', updatescheduledMeasure);
  app.post('/monitoring/nam/addscheduled', addscheduledMeasure);
  app.post('/monitoring/nam/activescheduled', deleteAllActivescheduledMeasures);
  app.delete('/monitoring/nam/scheduled/:id', deletesch);
  app.delete('/monitoring/nam/scheduledall', deleteScheduledAll);

}
