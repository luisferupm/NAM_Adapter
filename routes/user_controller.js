/**
 * user_controller.js
 * Author: Fernando Garcia
 * Date: 14/03/14
 */

var user = require('../models/user.js');
var crypto = require('crypto');


/*
 *  Auto-loading con app.param
 */
exports.load = function(req, res, next, id) {
	console.log("load");
	user.find ({login: res.user }, function (err, userr){
    if (userr) {
            req.user = res.user;
            next();
        } else {
            req.flash('error', 'There is no user with id = '+id+'.');
            next('There is no user with id = '+id+'.');
        };
	});
	//.error(function(error) {
      //  next(error);
    //});
};

// ----------------------------------
// Rutas
// ----------------------------------

// GET /users
exports.index = function(req, res, next) {
	

	user.find({}, function(err, users) {
	  		if(!err) {
	  			//console.log(JSON.stringify(hosts))
	  			
	  			console.log(users)
	            res.render('users', {users: users, session: req.session});
	  		} else {
	  			console.log('ERROR: ' + err);
	  		}
	  	}).error(function(error) {
            next(error);
        });
	  };
	


// GET /users/new
exports.new = function(req, res, next) {

    var user = new user (
        { login: '',
            name:  '',
            email: ''
        });

    res.render('users/new', {user: user, session: req.session});
};

exports.addUser = function(login, name, pass) {

	user.find({ login: login},function(err, userid) {
  		if(!err) {
  			//console.log(userid.length);
  			if(userid.length==0){
  				
  				var hash = encriptarPassword(pass, "xifiMaster2014");
  			    console.log(hash)
  				var usernew = new user (
  			          { login: login,
  			              name:  name,
  			              hashed_password: hash
  			          });
  			  	
  			  usernew.save(function(err) {
  					if(!err) {
  					  	console.log('Created User');
  					} else {
  					  		console.log('ERROR: ' + err);
  					}
  				});

  			  	console.log(usernew);
  				
  			}else{
  				console.log("User already exists");
  			}
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});

  };



// ----------------------------------
// Authentication
// ----------------------------------

function createNewSalt() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
};

function encriptarPassword(password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
};

exports.autenticar = function(login, password, callback) {
	
	user.find ({login: login}, function (err, userr){
            if (userr) {
	
                console.log('User Found, ' + userr[0].login);
               if (userr.hashed_password == "" && password == "") {
            	   
                    callback(null,userr[0]);
                    return;
                }

                var hash = encriptarPassword(password, "xifiMaster2014");
                
                if (login== userr[0].login  && hash == userr[0].hashed_password) {
                    callback(null,userr[0]);
                } else {
                	callback('Wrong password.');
                };
           } else {
        	   console.log("no-no")
               callback('Username does not exit.');
           }
        })
//        .error(function(err) {
  //          callback(err);
    //    });
};

//  ----------------------------------


//DELETE - Delete all hosts 
exports.delUsersAll = function(req, res, next) {
	  user.remove(function(err) {
				if(!err) {
					console.log('Removed BD');
					res.send('Removed');
				} else {
					console.log('ERROR: ' + err);
					next(err);
				}
	

});
	  	
};