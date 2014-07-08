var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var endpointSchema = new Schema({
  idendpoint:    { type: String },
  node:  { type: String },
  type:    { type: String, enum:
	  ['phy', 'vm']
	        },
  ipAddress:     { type: String },
  port_API_NAM:		{ type: String },
  ping_status:  { type: Boolean },
  bdw_status:  { type: Boolean },
  owd_status:  { type: Boolean },
});

module.exports = mongoose.model('hosts', hostsSchema);