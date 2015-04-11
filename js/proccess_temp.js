

Process.prototype.kill = function()
{
	var _index = Process.children.indexOf(this);

	if(_index != -1)
	{
		Process.children.splice(_index, 1);
	};
}

//Prints all child processes as a table
Process.printChildren = function(space){
	space = typeof a !== 'undefined' ? space : 5;

	space = " ".repeat(space);

	var header =["id","parent_id","name","state"];

	//Rows stores all the relevant rows
	rows = "";
	for(var i = 0; i < Process.children.length; i++)
	{
		var proc = Process.children[i];

		//Iterate over header, defined before 'for'
		_.each(header, function(column){

			//Check if the process has the property
			if(_.has(proc, column))
			{
				rows += proc[column] + space;
			}
		})

		//add a new row
		rows += "\n";
	}
	
	console.log(rows);

	return rows;
}