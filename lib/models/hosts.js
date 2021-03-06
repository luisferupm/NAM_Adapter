var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var hostsSchema = new Schema({
  regionId:  { type: String },
  hostId:    { type: String },
  ipAddress:     { type: String },
  ip_address: {local_ip: { type: String }, 
	           public_ip : { type: String },
	           private_federation_ip : { type: String }},

  hostname:		{ type: String },
  
  
  type:    { type: String, enum:
	  ['phy', 'vm']
	        },
  
  description:	{ type: String },
  port_NAM:	{ type: String },
  ping_status:  { type: Boolean },
  bdw_status:  	{ type: Boolean },
  owd_status:  	{ type: Boolean },
  packetLoss_status:  	{ type: Boolean },
  
  OWD_endpoint_dest_schedule: [{ regionId: { type: String },
	  hostId : { type: String },
	  frequency: { type: Number },
	  type:    { type: String, enum:
		  ['owd']
		        }	  
  }],
  
  BDW_endpoint_dest_schedule: [{ regionId: { type: String },
	  hostId : { type: String },
	  frequency: { type: Number },
	  type:    { type: String, enum:
		  ['bdw']
		        }
	  
  }]
  
  
});

module.exports = mongoose.model('hosts', hostsSchema);