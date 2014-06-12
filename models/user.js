/**
 * user.js
 * Author: Fernando Garcia
 * Date: 14/03/14
 */

var mongoose = require ("mongoose"),
	Schema   = mongoose.Schema; 

var userSchema = new Schema (
        { login: {
            	type: String
          },
        name: {
                type: String,
           
            },
        email: {
                type: String,
        },
     
        hashed_password: {
                type: String
        },
        
        salt: {
                type: String
        },
        
        time:{
                type: Date,
                defaultValue: 0
        }
        
       
  });

module.exports = mongoose.model('user', userSchema);