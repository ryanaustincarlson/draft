function Editor(divID, document)
{
	console.log("Editor created");
	this.divID = divID;
	this.rawText = "rawTest";

	this.html = function(document)
	{	
		return document.getElementById(this.divID).innerHTML
	}
}

// var editor = new Editor("aName");

function WysihtmlEditor(id, divID)
{
	this.id = id;
	this.divID = divID;

	this.makeHtml = function (id, placeholder, autofocus) {
		var html = "<textarea id=\"" + this.id + "\" ";
		if (placeholder != null && placeholder.length > 0)
		{
			html += "placeholder=\"" + placeholder + "\" ";
		}
		if (autofocus)
		{
			html += "autofocus ";
		}
		html += "></textarea>";
		return html;
	}

	var div = document.getElementById(divID);
	div.innerHTML += this.makeHtml(this.id, null, false);
}

WysihtmlEditor.prototype = new Editor()