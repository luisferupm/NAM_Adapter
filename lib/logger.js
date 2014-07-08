
var  dateformat = require('dateformat')
	, winston = require('winston');

var logger = new (winston.Logger)({
    exitOnError: false,
    transports: [
        new (winston.transports.Console)({
            
            timestamp:  function() { return dateformat(new Date(), 'HH:MM:ss yyyy/mm/dd'); },
            colorize:   true,
            
        }),

    ]
});

var help = [
            'usage: forever [action] [options] SCRIPT [script-options]',
            '',
            'Monitors the script specified in the current process or as a daemon',
            '',
            'actions:',
            '  start               Start nam adapter module',
            '  stop                Stop nam adapter module',
            '  restart             Restart nam adapter module',
            '  logs                Lists log files for all forever processes',
            '  cleanlogs           [CAREFUL] Deletes all historical forever log files',
            '',
            'options:',
            
            '  -l  LOGFILE      Logs the forever output to LOGFILE',
            '  -o  OUTFILE      Logs stdout from child script to OUTFILE',
            '  -e  ERRFILE      Logs stderr from child script to ERRFILE',
            '  -p  PATH         Base path for all forever related files (pid files, etc.)',
            '  -n, --number     Number of log lines to print',
            '  -d, --daemon     Start SCRIPT as a daemon',
            '  -v, --verbose    Turns on the verbose messages from Forever',
            '  -s, --silent     Run the child script silencing stdout and stderr',
            ''
          ];

//### function help ()
//Shows help
/*
app.cmd('help', cli.help = function () {
	util.puts(help.join('\n'));
});
*/

module.exports = logger;