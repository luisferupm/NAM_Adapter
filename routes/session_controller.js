/**
 * session_controller.js
 * Author: Fernando Garcia
 * Date: 14/03/14
 */

var util = require('util');

// Middleware: Login is required:
//
exports.requiresLogin = function (req, res, next) {
	//console.log(req.session)
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
        { redir: req.query.redir || '/'
        });
};


// create session.

exports.create = function(req, res) {

    var redir = req.body.redir || '/';

    console.log('REDIR = ' + redir);

    var login = req.body.login;
    var password  = req.body.password;

    console.log('Login    = ' + login);
    console.log('Password = ' + password);

    require('./user_controller').autenticar(login, password, function(error, userr) {

        if (error) {
        	
            if (util.isError(error)) {
                next(error);
            } else {
            	console.log(error)
                //req.flash('error', ' '+error);
                res.redirect("/login?redir="+redir);
            }
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