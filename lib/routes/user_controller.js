/**
 * user_controller.js
 * Author: Fernando Garcia
 * Date: 14/03/14
 */

var user = require('../models/user.js');
var crypto = require('crypto');
var logger = require('../logger.js');


/*
 *  Auto-loading con app.param
 */
exports.load = function(req, res, next, id) {
	logger.info("load");
	user.find ({login: res.user }, function (err, userr){
    		if (userr) {
            		req.user = res.user;
            		next();
        	} else {
            		req.flash('error', 'There is no user with id = '+id+'.');
            		next('There is no user with id = '+id+'.');
        	};
	});

};

// ----------------------------------
// Rutas
// ----------------------------------

// GET /users
exports.index = function(req, res, next) {
	

	user.find({}, function(err, users) {
	  		if(!err) {
	  			//logger.info(JSON.stringify(hosts))
	  			
	  			//logger.info(users)
	            res.render('users', {users: users, session: req.session});
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  	})
	  };
	

// GET /config/user
exports.user = function(req, res, next) {
	logger.info(req.session)
	logger.info(req.params)

	
	user.find({_id: req.params.id}, function(err, userid) {
	  		if(!err) {


	            res.render('users/edit2', {user: userid, session: req.session});
	  		} else {
	  			logger.info('ERROR: ' + err);
	  		}
	  })
};


// GET /config/users/new
exports.new = function(req, res, next) {
	
    var newuser = new user (
        { login: '',
            name: '',
            email: ''
        });

   res.render('users/new', {user: newuser, session: req.session});
};

exports.addUser = function(login, name, pass) {
	
	user.find({ login: login},function(err, userid) {
		logger.info("Adding user")
  		if(!err) {
  			//logger.info(userid.length);
  			if(userid.length==0){
  				
  				var hash = encriptarPassword(pass, "xifiMaster2014");
  			    logger.info(hash)
  				var usernew = new user (
  			          { login: login,
  			              name:  name,
  			              hashed_password: hash
  			          });
  			  	
  			  usernew.save(function(err) {
  					if(!err) {
  					  	logger.info('Created User');
  					} else {
  					  		logger.info('ERROR: ' + err);
  					}
  				});

  			  	//logger.info(usernew);
				

  				
  			}else{
  				logger.info("User already exists");
  			}
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});

  };


exports.newUser = function(req, res, next) {
	logger.info(req.body)

	user.find({login: req.body.login},function(err, userid) {
		logger.info("Adding user")
  		if(!err) {
  			//logger.info(userid.length);
  			if(userid.length==0){
  				
  			   var hash = encriptarPassword(req.body.password, "xifiMaster2014");
  			   logger.info(hash)
  				var usernew = new user (
  			          { login: req.body.login,
  			              name:  req.body.name,
  			              hashed_password: hash
  			          });
  			  	
  			   usernew.save(function(err) {
  				if(!err) {
  					  logger.info('Created User');
  				} else {
  					  	logger.info('ERROR: ' + err);
  				}
  			  });

			  res.render('index', {session: req.session});
  				
  			}else{
  				logger.info("User already exists");
  			}
  		} else {
  			logger.info('ERROR: ' + err);
  		}
  	});

  };


exports.updateUser = function(req, res, next) {
	logger.info(req.body)


var hash = encriptarPassword(req.body.password, "xifiMaster2014");
  			   logger.info(hash)

var userup = {  login: req.body.login,
  	    name:  req.body.login,
  	    hashed_password: hash
}

logger.info(req.body)

	user.findOneAndUpdate({_id: req.body.id}, userup, function(err, userid) {
		logger.info("Update user")
  		if(!err) {
  			

			user.find({}, function(err, users) {
	  			if(!err) {
	  			
	            			res.render('users', {users: users, session: req.session});
	  			} else {
	  				logger.info('ERROR: ' + err);
	  			}
	  		})
  				
  			
  		} else {
  			logger.info('ERROR: ' + err);
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
	
                logger.info('User Found, ' + userr[0].login);
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
        	   logger.info("no-no")
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
					logger.info('Removed BD');
					res.send('Removed');
				} else {
					logger.info('ERROR: ' + err);
					next(err);
				}
	

});
	  	
};
