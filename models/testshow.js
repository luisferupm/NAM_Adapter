var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var testshowSchema = new Schema({
  idTest:    { type: String },
  region:  { type: String },
  type:    { type: String, enum:
	  ['bdw', 'owd', 'pl']
	        },
  timestamp:		{ type: String },
  hostSource:   { type: String },
  ipSource: { type: String },
  hostDestination:  { type: String },
  ipDestination: { type: String },
  error:  { type: Boolean },
  result:  { type: String }    
});

module.exports = mongoose.model('testshow', testshowSchema);