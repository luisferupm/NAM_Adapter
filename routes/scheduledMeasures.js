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
module.exports = function(app) {
	

  var scheduledMeasuare = require('../models/scheduledMeasures.js');
  //GET - Return all test in the DB
  
  findAllScheduledMeasuares = function(req, res) {
	  
	  scheduledMeasuare.find(function(err, scheduledmeasuares) {
  		if(!err) {
  			console.log('GET /scheduledMeasuares')
  			console.log(scheduledmeasuares.length);
  			//console.log(JSON.stringify(scheduledmeasuares))
        	
  			res.json(scheduledmeasuares);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };
  
  findAllActiveScheduledMeasuares = function(req, res) {
	  
	scheduledMeasuare.find({ active: 'true'},function(err, scheduledmeasuares) {
  		if(!err) {
  			console.log('GET /scheduledMeasuares')
  			console.log(scheduledmeasuares.length);
  			//console.log(JSON.stringify(scheduledmeasuares))
        	
  			res.json(scheduledmeasuares);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Test with specified ID
  findById = function(req, res) {
	  scheduledMeasuare.findById(req.params.id, function(err, scheduledmeasuare) {
  		if(!err) {
        console.log('GET /scheduledmeasuare/' + req.params.id);
  			res.send(scheduledmeasuare);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new Scheduled Test in the DB
  addScheduledmeasuare = function(req, res) {
  	console.log('POST');
  	console.log(req.body);

  	var scheduledmeasuare = new scheduledMeasuare({
  	   	  
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
  	scheduledmeasuare.save(function(err) {
  		if(!err) {
  			console.log('Created');
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});

  	res.send(scheduledmeasuare);
  };

  
  //POST - Insert a new Test in the DB
  updateScheduledmeasuare = function(req, res) {
  	console.log('PUT');
  	console.log(req.body);

  	scheduledMeasuare.findById(req.params.id, function(err, scheduledmeasuare) {
  	
  		if(!err) {
  	        console.log('PUT /scheduledmeasuare/' + req.params.id);
  	      
  	    //scheduled.processId
  	  		scheduledmeasuare.active  = false;	  
  	  		scheduledmeasuare.EndDate =	new Date();
  	        
  	        scheduledmeasuare.save(function(err) {
  	        	if(!err) {
  	  	  			console.log('Updated');
  	  	  		} else {
  	  	  			console.log('ERROR: ' + err);
  	  	  		}
  	  		
  	        });

  	  	res.send(scheduledmeasuare);
  	  	} else {
  	  		console.log('ERROR: ' + err);
  	  	}
  		
  	  
  
  	});
  	
  };

  //DELETE - Delete a test with specified ID
  deleteScheduledMeasuare = function(req, res) {
	  	console.log('delete');
	  	scheduledMeasuare.findById(req.params.id, function(err, schedulemeasuare) {
  			if(schedulemeasuare!=null){
  				schedulemeasuare.remove(function(err) {
  				if(!err) {
  					console.log('Removed');
  					res.send('Removed');
  				} else {
  					console.log('ERROR: ' + err);
  					next(err);
  				}
  			});
  			}else{
  				res.send('Id not found');
  			}
  		
  	});

  }

  //DELETE - Delete active schedules
  deleteAllActiveScheduledMeasuares = function(req, res) {
		  
			scheduledMeasuare.find({ active: 'true'}, function(err, scheduledmeasuares) {
		  		if(!err) {
		  			//console.log('GET /scheduledMeasuares')
		  			//console.log(scheduledmeasuares.length);
		  			
		  			for (i in scheduledmeasuares){
		  				//console.log(scheduledmeasuares[i].processId)
		  				try {
		  					
		  					process.kill(scheduledmeasuares[i].processId, 'SIGHUP');
		  					
		  					
		  				} catch(err){
		  					console.info(err)
		  					
		  				}
		  				
		  				scheduledMeasuare.update({_id: scheduledmeasuares[i]._id},{ active: 'false'},{ multi: 'false'},function(err, scheduled) {
					  		if(!err) {
					  			//console.log(scheduledmeasuares[i].processId)
					  			//process.kill(scheduled.processId, 'SIGHUP');
					  		} else {
					  			console.log('ERROR: ' + err);
					  			
					  		}
			  			});		  			
		  			}

		  			/*for(i in scheduledmeasuares){
		  				scheduledmeasuares[i].active = false;
		  	  	        scheduledmeasuare[i].save();
		  			}*/
		  			
		  			//console.log(JSON.stringify(scheduledmeasuares))
		        	
		  			res.json(scheduledmeasuares);
		  		} else {
		  			console.log('ERROR: ' + err);
		  		}
		  	});
		  
  };
  
  
  //DELETE - Delete active schedules
  deleteAllActiveScheduled = function() {
		  
			scheduledMeasuare.find({ active: 'true'}, function(err, scheduledmeasuares) {
		  		if(!err) {
		  			console.log('GET /ActiveScheduledMeasuares')
		  			//console.log(scheduledmeasuares.length);
		  			
		  			for (i in scheduledmeasuares){
		  				//console.log(scheduledmeasuares[i].processId)
		  				try {
		  					
		  					process.kill(scheduledmeasuares[i].processId, 'SIGHUP');
		  					
		  					
		  				} catch(err){
		  					console.info(err)
		  					
		  				}
		  				
		  				scheduledMeasuare.update({_id: scheduledmeasuares[i]._id},{ active: 'false'},{ multi: 'false'},function(err, scheduled) {
					  		if(!err) {
					  			//console.log(scheduledmeasuares[i].processId)
					  			//process.kill(scheduled.processId, 'SIGHUP');
					  		} else {
					  			console.log('ERROR: ' + err);
					  			
					  		}
			  			});		  			
		  			}

		  			/*for(i in scheduledmeasuares){
		  				scheduledmeasuares[i].active = false;
		  	  	        scheduledmeasuare[i].save();
		  			}*/
		  			
		  			//console.log(JSON.stringify(scheduledmeasuares))
		        	
		  			//res.json(scheduledmeasuares);
		  		} else {
		  			console.log('ERROR: ' + err);
		  		}
		  	});
		  
  };
  
		 
		  
  //DELETE - Delete all test 
  deleteScheduledAll = function(req, res) {
	  	scheduledMeasuare.remove(function(err) {
  				if(!err) {
  					console.log('Removed BD');
  					res.send('Removed');
  				} else {
  					
  					console.log('ERROR: ' + err);
  					next(err);
  				}
  	
	  	});
	  	
  };

  //Link routes and functions
  app.get('/monitoring/nam/scheduled', findAllScheduledMeasuares);
  app.get('/monitoring/nam/active_scheduled', findAllActiveScheduledMeasuares);
  app.get('/monitoring/nam/scheduled/:id', findById);
  app.put('/monitoring/nam/scheduled/:id', updateScheduledmeasuare);
  app.post('/monitoring/nam/addscheduled', addScheduledmeasuare);
  app.post('/monitoring/nam/activescheduled', deleteAllActiveScheduledMeasuares);
  app.delete('/monitoring/nam/scheduled/:id', deleteScheduledMeasuare);
  app.delete('/monitoring/nam/scheduledall', deleteScheduledAll);

}