/*
 *    File:         NAMadapter_test.js
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


var superagent = require('superagent');
var expect = require('expect.js');
var regions = require('../models/regions.js');
var config = require('../config/config.js');


describe('NAMadapter rest api server', function(){
  this.timeout(36000);
  
  
  it('check run NAM component - web server', function(done){
	    superagent.get('http://localhost:' + config.port_API)
	      .end(function(e,res){
	        //console.log(res.body);
	        expect(e).to.eql(null);
	        expect(res.statusCode).to.eql(200);
	        done();
	      });    
	  });
  
  it('check iperf probe', function(done){
	    superagent.get('http://localhost:' + config.port_API + '/monitoring/iperf')
	      .end(function(e,res){
	        //console.log(res.body);
	        expect(e).to.eql(null);
	        expect(res.statusCode).to.eql(200);
	        expect(res.body.port_iperf).to.eql(config.port_iperf_server);
	        done();
	      });    
	  });
  it('check ntp requirement', function(done){
	    superagent.get('http://localhost:' + config.port_API + '/monitoring/owdserver/1')
	      .end(function(e,res){
	        //console.log(res.body);
	        expect(e).to.eql(null);
	        expect(res.statusCode).to.eql(200);
	        expect(res.body.result).to.eql("NTP OK ");
	        done();
	      });    
	  });
  
  //Check new measure
  
  it('get new measure BDW', function(done){
	  superagent.get('http://localhost:3000/monitoring/bdw/127.0.0.1')
      .end(function(e, res){
    	//console.log(res.text);
        expect(e).to.eql(null)
         expect(res.body).to.not.be.empty();
        expect(res.body).to.be.an('object')
        //expect(res.body._id.length).to.eql(24)        
        //expect(res.body._id).to.eql(id)        
            
        done();
      });
	  
  });
  
  it('get new measure OWD', function(done){
	  superagent.get('http://localhost:3000/monitoring/owd/127.0.0.1')
      .end(function(e, res){
    	//console.log(res.result);
        expect(e).to.eql(null)
        expect(res.body).to.not.be.empty();
        expect(res.body).to.be.an('object');
        //expect(res.body._id.length).to.eql(24)        
        //expect(res.body._id).to.eql(id)        
         
        done();
      });
	  
  });
  
  it('checks test list', function(done){
	  superagent.get('http://localhost:3000/testshows/')
      .end(function(e, res){
    	//console.log(res);
        expect(e).to.eql(null)
        expect(res.body).to.not.be.empty();
        expect(res.body).to.be.an('object');        
           
        done();
      });
	  
  });

  
  it('check web service mongo DB, post region', function(done){
	    superagent.post('http://localhost:' + config.port_API +'/monitoring/regions')
	      .send({
	  				"_links": "{}",
	  				"id":   "Spain_UPM"
	  
				})
	      .end(function(e,res){
	        //console.log(res.body);
	        expect(e).to.eql(null);
	        expect(res.statusCode).to.eql(200);
	        expect(res.body).to.be.an('object');
	        done();
	      });    
	  });
	  
it('check web service mongo DB, region list', function(done){
	  superagent.get('http://localhost:3000/monitoring/regions')
    .end(function(e, res){
  	  //console.log(res.body);
      expect(e).to.eql(null)
      expect(res.body).to.not.be.empty();
      expect(res.body).to.be.an('object');        
      done();
    });
	  
}); 


// Add host 
it('check web service mongo DB, post host', function(done){
	    superagent.post('http://localhost:3000/monitoring/regions/Madrid_UPM/hosts')
	      .send({
	    	  hostId: '0001',
	    	  regionId: 'XIFI',
	    	  type: undefined,
	    	  ipAddress: {ipAddress_Local: '192.168.1.35', ipAddress_public : '138.4.47.33'},
	    	  port_API_NAM: undefined,
	    	  ping_status: true,
	    	  bdw_status: true,
	    	  owd_status: true,
	    	  BDW_endpoint_dest_schedule: 
	    	   [ { regionId: 'trento',
	    	       hostIdDestination: '1234',
	    	       frecuency: 5,
	    	     },
	    	     { regionId: 'madrid',
	    	       hostIdDestination: '123',
	    	       frecuency: 5,
	    	       } ],
	    	  OWD_endpoint_dest_schedule: 
	    	   [ { regionId: 'trento',
	    	       hostIdDestination: '1234',
	    	       frecuency: 5,
	    	     },
	    	     { regionId: 'madrid',
	    	       hostIdDestination: '123',
	    	       frecuency: 5,
	    	     } ]
	  
				})
	      .end(function(e,res){
	        //console.log(res.body)
	        expect(e).to.eql(null)
	        //expect(res.body.length).to.eql(1)
	        //expect(res.body[0]._id.length).to.eql(24)
	        //id = res.body[0]._id
	        done();
	      });    
	  });
	  
  it('check web service mongo DB, hosts list', function(done){
	  superagent.get('http://localhost:3000/monitoring/regions/Madrid_UPM/hosts')
    .end(function(e, res){
  	//console.log(res);
      expect(e).to.eql(null);
      expect(res.body).to.not.be.empty();
      expect(res.body).to.be.an('object');
      done();
    });
	  
});
    
     
});
