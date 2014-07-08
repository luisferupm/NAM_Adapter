var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var hostsSchema = new Schema({
  regionId:  { type: String },
  hostId:    { type: String },
  ip_address: {local_ip: { type: String }, 
	           public_ip : { type: String },
	           private_federation_ip : { type: String }},

  hostname:		{ type: String },
  
  
  type:    { type: String, enum:
	  ['phy', 'vm']
	        },
  
  description:	{ type: String },
  port_NAM:	{ type: String },
  port_iperf:	{ type: String },
  ping_status:  { type: Boolean },
  bdw_status:  	{ type: Boolean },
  owd_status:  	{ type: Boolean },
  lossp_status:  	{ type: Boolean },
  ntp_server : { type: String },
  NGSIAdapter_url : { type: String },	
  limit_scheduledTest : { type: String },
  ls_global : { type: String },
  
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

module.exports = mongoose.model('hosts_data', hostsSchema);