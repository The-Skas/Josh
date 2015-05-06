
var LevelState = function(name , text, condition, state)
{
	this.name = name;

	this.text = text;

	this.condition = condition;

	this.nextState = state;

}

LevelState.prototype.enter = function()
{
		$("#chat_text").empty();

	$("#chat_text").append(this.text);
}

LevelState.prototype.exit = function()
{
	$("#chat_text").empty();
}

LevelState.prototype.exec = function(command) {
	if(this.condition(command))
	{
		this.transition();
	}
}

LevelState.prototype.transition = function()
{
	this.exit();
	LevelState.current = this.nextState;
	LevelState.current.enter();
}

var checkup = function(command){
	if(_.isEqual(command,
		["run checkup"]))
	{
		return true;
	}
}

var kill = function(command){
	if(_.isEqual(command,
		["kill br2"]))
	{
		return true;
	}
}

var find = function(command){
	if(_.isEqual(command,
		["cat see.txt"]))
	{
		return true;
	}
}

// Change this pronto.
LevelState.current = new LevelState("checkup", " -- Run Checkup <br><p> run checkup", checkup,
	new LevelState("kill", " -- Kill Process <br>* ps -- to view process <br>* kill [process name]", kill,
		new LevelState("find", "Hmm.. The Process is strange. It seems to be in an unkillable state because of waiting for a txt file. <br> -- find [file] <br> -- cat [file]", find,
			new LevelState("find pipe", "Okay. So perhaps I can use pipes to combine commands together. <br> -- find [file] | cat", function(){return false}))));

