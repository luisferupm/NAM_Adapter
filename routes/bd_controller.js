/**
 *    File:         routes/bd_controller.js
 *
 *    Author:       Luis Fernando Garcia 
 *                  Polytechnic University of Madrid (UPM)
 *
 *    Date:         07/10/2014
 *
 *    Description:    
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

  //GET - Return all test in the DB
  exports.findAll = function(db, req, res) {
	  db.find(function(err, scheduledMeasuares) {
  		if(!err) {
  			console.log('GET /scheduledMeasuares')
  			console.log(JSON.stringify(scheduledMeasuares))
        	
  			res.json(scheduledMeasuares);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Test with specified ID
  findById = function(req, res) {
	  hostRegister.findById(req.params.id, function(err, hostregister) {
  		if(!err) {
        console.log('GET /testshow/' + req.params.id);
  			res.send(hostregister);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new Test in the DB
  addHostRegister = function(req, res) {
  	console.log('POST');
  	console.log(req.body);

  	var hostregister = new hostRegister({
  	  
  	  idhost:			req.body.idhost,
  	  domain:			req.body.domain,
  	  type:				req.body.type,
  	  hostName:			req.body.hostName,
  	  port_API_NAM:		req.body.port_API_NAM,
  	  available_ping:	req.body.available_ping,
  	  available_bwctl:	req.body.available_bwctl,
  	  available_owdctl:	req.body.available_owdctl
  
  	});
  	console.log('Esto es una prueba');
  	hostRegister.save(function(err) {
  		if(!err) {
  			console.log('Created');
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});

  	res.send(hostregister);
  };

  //PUT - Update a register already exists
  updateHostRegister = function(req, res) {
	  hostRegister.findById(req.params.id, function(err, hostregister) {
  		
		  idhost 			=	req.body.idhost;
	  	  domain 			=	req.body.domain;
	  	  type				=	req.body.type;
	  	  hostName			=	req.body.hostName;
	  	  port_API_NAM		=	req.body.port_API_NAM;
	  	  available_ping	=	req.body.available_ping;
	  	  available_bwctl	=	req.body.available_bwctl;
	  	  available_owdctl	=	req.body.available_owdctl;

	  	hostRegister.save(function(err) {
  			if(!err) {
  				console.log('Updated');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  			res.send(hostregister);
  		});
  	});
  }

  //DELETE - Delete a test with specified ID
  deleteHostRegister = function(req, res) {
	  	console.log('delete');
	  	hostRegister.findById(req.params.id, function(err, hostregister) {
  			if(hostregister!=null){
  				hostregister.remove(function(err) {
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

