


var superagent = require('superagent');
var expect = require('expect.js');
var regions = require('../models/regions.js');
var config = require('../config/config.js');


describe('express rest api server', function(){
  var id;
  
  
  it('post region', function(done){
	    superagent.post('http://192.168.1.35:3000/monitoring/regions')
	      .send({
	  				"_links": "{}",
	  				"id":   "Spain_UPM"
	  
				})
	      .end(function(e,res){
	        console.log(res.body)
	        expect(e).to.eql(null)
	        //expect(res.body.length).to.eql(1)
	        //expect(res.body[0]._id.length).to.eql(24)
	        //id = res.body[0]._id
	        done();
	      });    
	  });
	  
  it('checks region object', function(done){
	  superagent.get('http://localhost:3000/monitoring/regions')
      .end(function(e, res){
    	//console.log(res);
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        //expect(res.body._id.length).to.eql(24)        
        //expect(res.body._id).to.eql(id)        
        //expect(res.body.name).to.eql('Peter')        
        done();
      });
	  
  }); 
  
  
  // Add host 
  it('post host', function(done){
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
	        console.log(res.body)
	        expect(e).to.eql(null)
	        //expect(res.body.length).to.eql(1)
	        //expect(res.body[0]._id.length).to.eql(24)
	        //id = res.body[0]._id
	        done();
	      });    
	  });
	  
    it('checks hosts list', function(done){
	  superagent.get('http://localhost:3000/monitoring/regions/Madrid_UPM/hosts')
      .end(function(e, res){
    	//console.log(res);
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        //expect(res.body._id.length).to.eql(24)        
        //expect(res.body._id).to.eql(id)        
        //expect(res.body.name).to.eql('Peter')      
        done();
      });
	  
  });

  /*
  //Check new measure
  
  it('get new measure', function(done){
	  superagent.get('http://192.168.0.40:3000/monitoring/bdw/192.168.0.40')
      .end(function(e, res){
    	console.log(res.result);
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        //expect(res.body._id.length).to.eql(24)        
        //expect(res.body._id).to.eql(id)        
        //expect(res.body.name).to.eql('Peter')       
        done();
      });
	  
  });
  
  it('get new measure', function(done){
	  superagent.get('http://192.168.0.40:3000/monitoring/owd/192.168.0.40')
      .end(function(e, res){
    	console.log(res.result);
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        //expect(res.body._id.length).to.eql(24)        
        //expect(res.body._id).to.eql(id)        
        //expect(res.body.name).to.eql('Peter')      
        done();
      });
	  
  });
  
  it('checks test list', function(done){
	  superagent.get('http://192.168.0.40:3000/testshows/')
      .end(function(e, res){
    	//console.log(res);
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        //expect(res.body._id.length).to.eql(24)        
        //expect(res.body._id).to.eql(id)        
        //expect(res.body.name).to.eql('Peter')      
        done();
      });
	  
  });

  */

    
     
});
console.log('ok');