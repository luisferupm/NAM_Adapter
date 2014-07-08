var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var nodesSchema = new Schema({
  regionId:    { type: String },
  name:  { type: String },
  location:		{ type: String},
  country:		{ type: String },
  hosts:		[ Schema.Types.ObjectId ]
  
});


module.exports = mongoose.model('nodes', nodesSchema);