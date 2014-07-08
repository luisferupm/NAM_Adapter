var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var regionsSchema = new Schema({
  id:    { type: String },
  _link:  { self: { href: {type: String }}}
      
});


module.exports = mongoose.model('regions', regionsSchema);