
// Scope Restriction, yay-e.
(function($,_)
{
    var shell = Josh.Instance.Shell;
    var _id = "shell-cli";
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

            if(shell.sudo)
            {
                response.push("light");
            }
    		
    		response = _.map(response, function(line){
    			return line.replace(/ /g, " ");
    		});
    		
            callback(shell.templates.list({items: response}));

            // Return value are used for pipes
            return response;
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

    shell.setCommandHandler("cat", {
        exec: function(cmd, args, callback) {
            var arg = args[0] || '';
            
            if(args[0] == "-h")
            {
                return callback(shell.templates.pre({
                    items:  "SYNTAX:\n"+
                            "  cat file_name\n\n"+
                            "DESCRIPTION\n"+
                            "  Prints the contents of a specific file"+
                            "\n"
                }));
            }

            var files = Josh.Instance.PathHandler.files;

            var file_name = args[0];
            if(arg.includes("/"))
            {
                arg = arg.split("/");

                file_name = arg.pop();

                arg = arg.join("/");
            }

            var current_path = Josh.Instance.PathHandler.current.path;

            var file_to_print = null;

            if(files[current_path])
            {
                file_to_print = files[current_path][file_name];
            }
            //If args[1] exists, this means we have
            //atleast 2 arguements
            else if(files[arg])
            {
                file_to_print = files[arg][file_name];
            }
            debugger;
            if(file_to_print) {
                response = file_to_print.data;
            }
            else{
                response =  "Invalid File.";
            }
            
            
            callback(shell.templates.pre({items: response}));
        },
        completion: function(cmd, arg, line, callback) {
            var files = Josh.Instance.PathHandler.files;
            
            var current_path = Josh.Instance.PathHandler.current.path;

            var list_files = [];

            //We check to see if weve created an object or not.
            //undefined means we havent other wise we have.
            if(files[current_path])
            {
                list_files = Object.keys(files[current_path]);
            }
            
            callback(shell.bestMatch(arg, list_files))
        }
    });

    shell.setCommandHandler("clear",{
        exec: function(cmd, args, callback) {
          if(args[0] == "-h")
            {
                return callback(shell.templates.pre({
                    items:  "SYNTAX:\n"+
                            "  clear \n\n"+
                            "DESCRIPTION\n"+
                            "  Clears the console screen."+
                            "\n"
                }));
            }
          $("#"+_id).parent().empty();
          callback();
        }
    });

    shell.setCommandHandler("run",{
        exec: function(cmd, args, callback) {


            if(args[0] == "-h")
            {
                return callback(shell.templates.pre({
                    items:  "SYNTAX:\n"+
                            "  run [file_name]\n\n"+
                            "DESCRIPTION\n"+
                            "  Runs a script."+
                            "\n"
                }));
            }

            if(args[0] == "checkup")
            {
                var revNum = "Running System Checkup ...".length-2;
                Josh.Instance.Shell.renderWaitOutput(["Running System Checkup .^100.^100.^100"].repeat("Running System Checkup .^100.^100.^100",3),
                    function(){}, {stop: false, stopNum: revNum, typeSpeed: 1,
                        callback: function(){
                            // Must always becalled.
                            Josh.Instance.Shell.disable_user_input = false;
                            Josh.Instance.Shell.activate();
                            initOutput = [
                    "WARNING: ^500 Malicious Process 'br2' found. ^500",
                    "<br>Unable to kill 'br2'<br><br> ^500 use the ^100'kill'^100 command to manually terminate process. ^500"]
                            Josh.Instance.Shell.renderWaitOutput([initOutput.join(" ")], function(){

                            }, {typeSpeed: -5})

                        }});
            }
          callback();
        },
        completion: function(cmd, arg, line, callback) {
            callback(shell.bestMatch(arg, ['checkup']))
        }
    });

    shell.setCommandHandler("find", {
        /**
         * Recursively earches through directories for files and directories.
         * @param  {[type]} path [description]
         * @return {[type]}      [description]
         */
        _recursivePath: function(path){
            if(path == undefined)
            {
                return [];
            }

            var output = [];
            //Not surrounding path with an array causes an error :/
            var children = Josh.Instance.PathHandler.ls("",[path], function(node){
                    return node;
            });
            var directories = _.map(children, function(child){
                //Make sure is a directory or a file
                if(child.path)
                {   
                    var file = "";

                    if(child.data)
                    {
                        output.push(child.path+"/"+child.name);
                    }
                    //Make sure is a directory and NOT a file.
                    else
                    {
                        output.push(child.path);
                        return child.path;
                    }
                }
            }).clean(undefined);

            var _this = this;
            _.each(directories, function(element,i){
                output = output.concat(_this._recursivePath(element));
            })
            return output;
        },
        exec: function(cmd, args, callback) {
            // return this._someFunc("some");
            // render one more time when shell is activated
            

            if(args[0] == "-h" || !args[0])
            {
                return callback(shell.templates.pre({
                    items:  "SYNTAX:\n"+
                            "  find [file_name]/[directory_name]\n\n"+
                            "DESCRIPTION\n"+
                            "  Searches for the file/directory name specified."+
                            "\n"
                }));
            }
            console.log(args);
            if(args.indexOf("|") != -1)
            {
                var pip_ind = args.indexOf("|");

                args.pop(pip_ind);

                //do appropriate pipe command.
            }
            var matches = this._recursivePath("");

            matches = matches.filter(function(value) {
                if(value)
                {
                    return value.includes(args[0]);
                }
            });

            //This signifies we issued a pipe command, eg:
            //      find .txt | cat 
            if(args.indexOf("|") != -1)
            {
                return matches;
            }
            else
            {
                callback(shell.templates.list({items: matches}));
                return matches;
            }
            

        },
        completion: function(cmd, arg, line, callback) {
            callback();
        }
    })

    shell.setCommandHandler("sudo", {
        exec: function(cmd, args, callback) {
           

            // It exists


            if(shell.sudo)
            {
                return callback("Administrator access granted.");
            }
            else
            {
                if(args.join(" ") == shell.password)
                {
                    // signifies password.
                    shell.sudo = true;
                    return callback("Administrator access granted.");
                }
                else if(args[0])
                {
                    return callback("Incorrect password.");
                }

                return callback("'sudo [password]' for admin priviliges.");
            }
        },
        completion: function(cmd, arg, line, callback) {
            callback();
        }
    });
})($,_);