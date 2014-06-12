//
//  License.
//


'use strict';


// nam base parser object (to be extended by probe-specific parsers)
var baseParser = require('./common/base').parser;

var parser = Object.create(baseParser);

// NAM adapter "OWD" probe-specific parser
// References: 
//
// Context attributes to be calculated:
//     freeSpacePct = percentage of free space at given group/single partition (NO MULTIPLE PARTITIONS SUPPORTED UNLESS GROUPED!)
//
// Sample data:
//
//{
//  "idTest": "Owd-1393612954320",
//  "region": "XIFI_UPM",
//  "type": "Owd",
//  "timestamp": "28-2-2014 / 19:42",
//  "hostSource": "138.4.47.33",
//  "hostDestination": "193.1.202.133",
//  "error": false,
//  "result": "owd_sc_min:26ms, owd_sc_max:26ms, owd_cs_min:76ms, owd_cs_max:79ms, jitter_sc:0ms, jitter_cs:3ms ",
//  "_id": "5310d89a0b50d751022d9bd5"
//}
//
//
//  Data:
//	
//          result": "owd_sc_min:26ms, owd_sc_max:26ms, owd_cs_min:76ms, owd_cs_max:79ms, jitter_sc:0ms, jitter_cs:3ms ",
//                              ^                ^                ^                ^               ^              ^     
// One Way Delay   	        |	   	 |                |                |               |              |
// Source --> Destination	|		 |		  |		   |		   |		  |		   
// 	Min --------------------+                | 	          |                |               |              | 
// 	Max -------------------------------------+   		  |		   |		   |		  |
// Destination --> Source 					  |		   |		   |		  |
// 	Min ------------------------------------------------------+                |               |        	  |      	 
// 	Max -----------------------------------------------------------------------+               |        	  |      	  
// Jitter											   |		  |
// Source --> Destination -------------------------------------------------------------------------+              |
// Destination --> Source ----------------------------------------------------------------------------------------+ 
//     


parser.parseRequest = function() {
        var entityData = {};

	entityData.data = this.request.body;
	entityData.perfData += this.request.body;

        return entityData;
    };


parser.getContextAttrs = function(multilineData, multilinePerfData) {
        
	var data  = JSON.parse(multilineData);   
	var attrs = { OWD_min: NaN, OWD_max: NaN, jitter: NaN };
	var items = data.result.match(/([-0-9.]+)/gm);
    			    			        
	var i = 0;
    			    			        
	for (i in items){    			    			            
		items[i]=parseFloat(items[i].match(/[0-9.]+/)); 		    			        
	}
	    			    			        
	//attrs.timestamp = data.timestamp;
	attrs.OWD_min = items[0];
	attrs.OWD_max = items[1];
	attrs.jitter = items[4];

	    			    			   
	    			    			        
	console.info(attrs)
       
        return attrs;
    };   


exports.parser = parser;