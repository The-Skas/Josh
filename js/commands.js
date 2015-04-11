
var shell = Josh.Instance.Shell;

shell.setCommandHandler("hello", {
    exec: function(cmd, args, callback) {
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

shell.setCommandHandler("kill", {
    exec: function(cmd, args, callback) {
		var arg = args[0] || '';
		
        var response = Josh.Process.killChildBy('id', arg);
		
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