
var shell = Josh.Instance.Shell;

shell.setCommandHandler("hello", {
    exec: function(cmd, args, callback) {
        blu_event(cmd, args);

        var arg = args[0] || '';
        var response = "who is this " + arg + " you are talking to?";
        if(arg === 'josh') {
            response = 'pleased to meet you.';
        } else if(arg === 'world') {
            response = 'world says hi.'
        } else if(!arg) {
            response = 'who are you saying hello to?';
        }
        callback(response);
    },
    completion: function(cmd, arg, line, callback) {
        callback(shell.bestMatch(arg, ['world', 'josh']))
    }
});

/**
	ps - Prints processes
*/
shell.setCommandHandler("ps", {
    exec: function(cmd, args, callback) {
        if(args[0] == "-h")
        {
            return callback(shell.templates.pre({
                items:  "SYNTAX:\n"+
                        "   ps\n\n"+
                        "DESCRIPTION\n"+
                        "  'ps' command creates a table of all processes in memory.\n"+
                        "   The columns are as follows:\n"+
                        "       id -- represents the processes unique id\n"+
                        "       parent_id -- represents the parent process or the process that created it.\n"+
                        "       name -- represents the name of the process\n"+
                        "       state -- represents the processes current State\n"

            }));
        }

        var response = Josh.Process.printChildren();
		
		response = _.map(response, function(line){
			return line.replace(/ /g, " ");
		});
		
        callback(shell.templates.list({items: response}));
    },
    completion: function(cmd, arg, line, callback) {
        callback(shell.bestMatch(arg, ['']))
    }
});

/**
 * kill [id/name] -- kills a process by id or name
 */
shell.setCommandHandler("kill", {
    exec: function(cmd, args, callback) {
		var arg = args[0] || '';
		
        if(args[0] == "-h")
        {
            return callback(shell.templates.pre({
                items:  "SYNTAX:\n"+
                        "   kill process_name\n\n"+
                        "DESCRIPTION\n"+
                        "  'kill' command is used to kill a process."+
                        "The process is terminated if possible.\n"
            }));
        }

        var response = Josh.Process.killChildBy('name', arg);
		
		if(response == 0) {
			response = "No process found.";
		}
		else if(response == 1) {
			response = "Killed "+response+" Process";
		}
		else{
			response = "Killed "+response+" Processes";
		}
		
		
        callback(response);
    },
    completion: function(cmd, arg, line, callback) {
        callback(shell.bestMatch(arg, ['']))
    }
});