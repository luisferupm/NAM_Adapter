/**
 * session_controller.js
 * Author: Fernando Garcia
 * Date: 14/03/14
 */

var logger = require('../logger.js');
var util = require('util');

// Middleware: Login is required:
//
exports.requiresLogin = function (req, res, next) {
	//logger.info(req.session)
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login?redir=' + req.url);
    }
};

// login Form
//
exports.new = function(req, res) {

    res.render('session/new',
        { redir: req.query.redir || '/', confirm: true
        });
};


// create session.

exports.create = function(req, res) {

	
    var redir = req.body.redir || '/';

    logger.info('REDIR = ' + redir);

    var login = req.body.login;
    var password  = req.body.password;

    logger.debug('Login    = ' + login);
    logger.debug('Password = ' + password);

    require('./user_controller').autenticar(login, password, function(error, userr) {

        if (error) {
        	
            if (util.isError(error)) {
                next(error);
            } else {
            	logger.info(error)
                //req.flash('error', ' '+error);
                //res.redirect("/login?redir="+redir);
		//res.redirect("/login?redir=" +redir + "&confirm=false");
		res.render('session/new', { redir: req.query.redir || '/', confirm: false});
		req.flash('error', "Username or Password not valid")
		
            }
	    
	    res.render('session/new', { redir: req.query.redir || '/', confirm: false});
            return;
        }
        
        //time in seconds to add it to req.session.user.time
        var timeInSeconds = new Date().getTime() / 1000;


    
        req.session.user = {login:userr.login, name:userr.name, time:timeInSeconds};
        
        res.redirect(redir);
    });
};


// Logout

exports.destroy = function(req, res) {

    delete req.session.user;
    //req.flash('success', 'Logout.');
    res.redirect("/login");
};
