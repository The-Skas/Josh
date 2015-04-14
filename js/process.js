(function(root, _){

	var Process = function(name, parent_id)
	{
		//Gets a Unique ID for the process
		this.id = Process.getNextId();
		
		//Set name of the process
		this.name = name;
		
		//Sets the parent id of the process
		this.parent_id = parent_id;
		
		//Sets the state of the Process
		this.state = "Ready";
		
		//Add to children
		Process.children.push(this);
	}
	
	//Instance Methods:
	Process.prototype.kill = function()
	{
		var _index = Process.children.indexOf(this);

		if(_index != -1)
		{
			Process.children.splice(_index, 1);
		};
	}
	
	//Class variables / Methods
	Process.children = [];
	
	Process.next_id = 1000;
	
	//Space between row values when printing.
	Process.padding_size = 15;
	
	Process.columns = ["id","parent_id","name","state"];
	
	Process.getNextId = function()
	{
		return ++Process.next_id;
	}
	
	//Prints all child processes as a table
	Process.printChildren = function(space){
			//Default parameter as 5
		space = typeof a !== 'undefined' ? space : 5;

		space = " ".repeat(space);

		var header =["id","parent_id","name","state"];
		
		
		header = _.map(header, function(col){
			_space = " ".repeat(Process.padding_size - col.length);
			
			return col + _space;
		});
		
		header = header.join(space);
		
		//Rows stores all the relevant rows
		rows = [header];
		for(var i = 0; i < Process.children.length; i++)
		{
			var row = ""
			var proc = Process.children[i];

			//Iterate over header, defined before 'for'
			_.each(Process.columns, function(column){

				//Check if the process has the property
				if(_.has(proc, column))
				{
					//Calculate remaining space to pad 
					//(This aligns values in the same starting point.
					var padding = Process.padding_size - (proc[column]+ '').length;
					
					padding = " ".repeat(padding);
					
					row += proc[column]+ padding + space;
				}
			})
		
			//add a new row
			rows.push(row);
		}
		
		
		return rows;
	}
	
	/**
	//Kills a child process by param:
	//	context: id, parent_id, name
	//
	//	returns number of processes killed
	**/
	Process.killChildBy = function(column, value){
		count_killed = 0;
		
		for(var i = Process.children.length - 1; i >= 0 ; i--)
		{
			proc = Process.children[i];
			
			if(proc[column] == value)
			{
				proc.kill();
				++count_killed;
			}
		}
		
		return count_killed;
	}
	
	
	//Global Variable: Josh
	Josh.Process = Process;
})(this, _);