/**
 *    File:         routes/nodes.js
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
	

  var node = require('../models/nodes.js');
  var js2xmlparser = require("js2xmlparser");
  var format_res = require('./format.js');
  var logger = require('../logger.js');
  
  //GET - Return all test in the DB
  findAllnode = function(req, res) {
	  node.find(function(err, nodes) {
  		if(!err) {
  			logger.info('GET /nodes')
  			logger.info(JSON.stringify(nodes))
        	
  			res.json(nodes);
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Test with specified ID
  findById = function(req, res) {
	  node.findById(req.params.id, function(err, node) {
  		if(!err) {
        logger.info('GET /testshow/' + req.params.id);
  			res.send(node);
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new Test in the DB
  addNode = function(req, res) {
  	logger.info('POST');
  	logger.info(req.body);

	node.find({ name: req.body.name},function(err, nodeid) {
  		if(!err) {
  			logger.info(nodeid.length);
  			if(nodeid.length==0){
  				var nodenew = new node({
  			  		regionId:			req.body.regionId,
  			  		name:			req.body.name,
  			  		location:				req.body.location,
  			  		country:			req.body.country,
  			  
  			  	});
  			  	
  				nodenew.save(function(err) {
  					if(!err) {
  					  	logger.info('Created Node');
  					} else {
  					  		logger.info('ERROR: ' + err);
  					}
  				});

  			  	res.send(nodenew);
  				
  			}else{
  				res.send("ERROR: Node already exists");
  			}
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});

  };

  //PUT - Update a register already exists
  updatenode = function(req, res) {
	  node.findById(req.params.id, function(err, node) {
		  //logger.info(name);
		  node.name 			=	req.body.name;
	  	  /*domain 			=	req.body.domain;
	  	  type				=	req.body.type;
	  	  nodeName			=	req.body.nodeName;
	  	  port_API_NAM		=	req.body.port_API_NAM;
	  	  available_ping	=	req.body.available_ping;
	  	  available_bwctl	=	req.body.available_bwctl;
	  	  available_owdctl	=	req.body.available_owdctl;*/
	  	logger.info(node.name);
	  	node.save(function(err) {
  			if(!err) {
  				logger.info('Updated');
  			} else {
  				logger.info('ERROR: ' + err);
  			}
  			logger.info(node.name);
  			res.send(node);
  		});
  	});
  }

  //DELETE - Delete a test with specified ID
  deletenode = function(req, res) {
	  	logger.info('delete');
	  	node.findById(req.params.id, function(err, node) {
  			if(node!=null){
  				node.remove(function(err) {
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

  //Link routes and functions
  app.get('/nodes', findAllnode);
  app.get('/node/:id', findById);
  app.post('/addnode', addNode);
  app.put('/updatenode/:id', updatenode);
  app.delete('/delnode/:id', deletenode);

};