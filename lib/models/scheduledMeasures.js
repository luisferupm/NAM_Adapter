var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var scheduledMeasuresSchema = new Schema({
  idSchedule:    { type: String },
  domain:  { type: String },
  host:   { type: String },
  type:  { type: String, enum:
	       ['bdw', 'owd', 'ploss']
  	     },
  startDate:  { type: String },
  endDate:  { type: String },
  frequency:  { type: String },
  regionIdSource:  { type: String },
  hostSource:  { type: String },
  regionIdDestination:  { type: String },
  hostDestination:  { type: String },
  countMeasures: { type: Number },
  measures: [ Schema.Types.ObjectId ],
  processId: { type: Number },
  active: {type: Boolean}
   
});

module.exports = mongoose.model('scheduledMeasures', scheduledMeasuresSchema);