/**
 *    File:         NAMadapter.js
 *
 *    Authors:      Luis Fernando Garcia 
 *    				Jose Gonzalez
 *                  Universidad Politéctica de Madrid (UPM)
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
 *        Copyright (c) 2003-2008, Universidad Politécnica de Madrid (UPM)
 * 
 *                              All rights reserved.
 * 
 *     * Redistribution in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 * 
 *    *  Neither the name of Universidad Politécnica de Madrid nor the names of its 
 *       contributors may be used to endorse or promote products derived from this 
 *       software without explicit prior written permission.
 * 
 * You are under no obligation whatsoever to provide any enhancements to Universidad 
 * Politécnica de Madrid,or its contributors.  If you choose to provide your enhance-
 * ments, or if you choose to otherwise publish or distribute your enhancement, in 
 * source code form without contemporaneously requiring end users to enter into a 
 * separate written license agreement for such enhancements, then you thereby grant 
 * Universidad Politécnica de Madrid, its contributors, and its members a non-exclusive, 
 * royalty-free, perpetual license to copy, display, install, use, modify, prepare 
 * derivative works, incorporate into the software or other computer software, dis-
 * tribute, and sublicense your enhancements or derivative works thereof, in binary 
 * and source code form.
 * 
 * DISCLAIMER - THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * “AS IS” AND WITH ALL FAULTS.  THE UNIVERSIDAD POLITECNICA DE MADRID, ITS CONTRI-
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

/**
 * NAM-XIFI
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , sessionController = require('./routes/session_controller.js') 
  , userController = require('./routes/user_controller.js')
  , partials = require ('express-partials')
  , config = require('./config/config.js')
  , pingctl = require('./routes/ping_controller.js')
  , bdwControler = require('./routes/bdw_controller.js')
  , owdctl = require('./routes/owd_controller.js')
  , onDemandControler = require('./routes/onDemand_controller.js')
  , schedule = require('./routes/schedule_controller.js')
  , atob = require('atob')
  , proxy = require('./lib/HTTPClient.js')
  , XMLHttpRequest = require("./lib/xmlhttprequest").XMLHttpRequest
  , auth = require('./routes/authToken_controller.js')
  , mongoose = require('mongoose')
  , superagent = require('superagent');

process.on('uncaughtException', function (err) {
	  console.log('Caught exception: ' + err);
	});


var app = express();
var util = require('util');

// all environments

app.set('port', process.env.PORT || config.port_NAM_Adapter);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('perfsonarPASS'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
	if (util.isError(err)) {
		next(err);
		} else {
			console.log(err);
			res.redirect('/');
		} 
	});

//development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
} else {
    app.use(express.errorHandler());
}

// Helper:
app.use(function(req, res, next) {
    //req.flash() 
    //res.locals.flash = function() { return req.flash()};
    res.locals.session = req.session;
    next();
});

//connection database mongodb
mongoose.connect('mongodb://localhost/NAM_adapter', function(err, res) {
	  if(err) {
	    console.log('ERROR: connecting to Database. ' + err);
	  } else {
	    console.log('Connected to Database');
	  }
	  
});

var myToken = undefined;

/**
 * DB Modules 
 *
**/

routeTest = require('./routes/testshows')(app);
routeHostRegister = require('./routes/hosts')(app);
routeHostData = require('./routes/host_data')(app);
routeRegionRegister = require('./routes/regions')(app);
routeScheduledTest = require('./routes/scheduledMeasures')(app);


/**
 * 
 * Routes
 *
**/


// Config Routes


app.get('/login',  sessionController.new);
app.post('/login', sessionController.create);
app.get('/logout', sessionController.destroy);

userController.addUser("userxifi", "userxifi", "xifiMaster2014")
app.get('/users', userController.index);
app.delete('/users', userController.delUsersAll);

app.get('/', routes.index);

app.get('/config', 
		sessionController.requiresLogin, 
		routes.config);

app.post('/config', 
		sessionController.requiresLogin, 
		routes.configChange);

app.get('/config/owd', 
		sessionController.requiresLogin, 
		routes.owd);
app.get('/config/bdw', 
		sessionController.requiresLogin, 
		routes.bdw);
app.get('/config/packetsloss', 
		sessionController.requiresLogin, 
		routes.packetsLoss);




//Webservices - Routes  

	//WS-Route - Ping
app.get('/monitoring/ping/:addressHost/:format?/:count?', pingctl.ping);

	

//WS-Route - On-Demand Test
app.get('/monitoring/host2host/:typeTest/:regionIdS-:hostIdS;:regionIdD-:hostIdD',

	onDemandControler.requiresAvailableRegions, 
	onDemandControler.requiresAvailableHosts,
	onDemandControler.runTest
);


//WS-Route - BDW
app.get('/monitoring/bdw/:regionD-:hostD', 
		//auth.authToken, 
		bdwControler.testbw);
app.get('/monitoring/bdw/:regionD:hostD/:regionS:hostS', 
		//auth.authToken, 
		bdwControler.testbwSource);
app.get('/monitoring/iperf/:ipS?', bdwControler.iperf_server);



//WS-Route - OWD
app.get('/monitoring/owd/:regionD-:hostD', auth.authToken, owdctl.testowd);
app.get('/monitoring/owd/:regionD-:hostD/:regionS-:hostS', auth.authToken, owdctl.testOwdSource);
app.get('/monitoring/owdserver/:time', owdctl.owd_server);

//WS-Route - Schedule test

app.post('/monitoring/schedule/:regionIdS-:hostIdS',
		 
		schedule.requiresAvailableHosts,
	//	auth.authToken,
		schedule.schedule
	);


app.post('/monitoring/schedule', schedule.scheduleTest);
app.get('/monitoring/schedule/bdw/:regionD-:hostD', bdwControler.testbw);
app.get('/monitoring/schedule/owd/:regionD-:hostD', owdctl.testowd);

app.put('/monitoring/schedule/scheduleId', auth.authToken, schedule.killSchedule);


//save host data

var host_data = {
	  	  hostId: config.hostId,
	  	  regionId: config.regionId,
	  	  type: "vm",
	  	  ipAddress: config.ip_address.public_ip,
	  	  ip_address: config.ip_address,

	  	  port_NAM: config.port_NAM_Adapter,
	  	  ping_status: true,
	  	  bdw_status: config.bdw_status,
	  	  owd_status: config.owd_status,
	  	  BDW_endpoint_dest_schedule: [ config.bdw_endpoint_default ],

	  	  OWD_endpoint_dest_schedule: [ config.owd_endpoint_default ]
	  		
	  };
deleteAllActiveScheduled();
findAndUpdateHostData()

//Authentication IDM


console.log(host_data)

auth.authenticate (function (status, resp) {

    myToken = JSON.parse(resp).access.token;

    console.log('Success authenticating NAM. NAM Auth-token: ', myToken);
    
  //Auto-Register Host

    auth.authenticate_user (function (status, resp) {

        var token = JSON.parse(resp).access.token.id;

        console.log('Success authenticating user. Auth-token: ', token);
        
        superagent.post(config.ls_global + '/regions/')
        .set('X-Auth-Token', token)
        .send({
        	"link": "http://138.4.47.33:3000/monitoring",
        	"id":   config.regionId
        			
        		
        })   
        .end(function(error,res){
        	if(!error){
        		//console.log("Autoregister OK");
        	}else {
        		console.log("Error: Autoregister fail, " + error);
        	}
          
        });
        

        console.log(config.ls_global + '/nam/hosts')
        superagent.post(config.ls_global + '/nam/hosts')
        .set('X-Auth-Token', token)
        .send(host_data)   
        .end(function(error,res){
        	
        	if(!error && res.statusCode==200){
        		
        		if(res.body.hostId){
        			console.log("Autoregister OK");}
        		else {
        			console.log(res.body);
        			console.log("Host already exists in NAM DB")
        		}
        	}else {
        		
        		console.log("Error: Autoregister fail, " + error);
        	}
          
        });  
        
        
    }, function (status, err) {
        console.log('Error in keystone communication', err);
    });
      

    

}, function (status, e) {
    console.log('Error in keystone communication', e);
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});