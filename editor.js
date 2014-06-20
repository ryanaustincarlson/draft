function Editor(divID, document)
{
	console.log("Editor created");
	this.divID = divID;
	this.rawText = "";
	this.document = document;

	this.html = function()
	{	
		return this.document.getElementById(this.divID).innerHTML
	}
}

function DraftEditor(id, divID)
{
	this.id = id;
	this.divID = divID;
	this.document = document;

	this.makeHtml = function (placeholder, autofocus) {
		var html = "<p contenteditable=\"true\" id=\"" + this.id + "\" ";
		// if (placeholder != null && placeholder.length > 0)
		// {
		// 	html += "placeholder=\"" + placeholder + "\" ";
		// }
		// if (autofocus)
		// {
		// 	html += "autofocus ";
		// }
		html += "></p>";
		return html;
	}

	this.initialize = function()
	{
		var div = this.document.getElementById(this.divID);
		div.innerHTML += this.makeHtml(null, false);

		// this.createEditor()
	}
}

DraftEditor.prototype = new Editor();

function DraftOutlineEditor(id, divID)
{
	this.id = id;
	this.divID = divID;
	this.document = document;

	this.superInitialize = this.initialize
	this.initialize = function()
	{
		this.superInitialize()
		// wysihtml5.commands.insertUnorderedList.exec(this.editor.composer, 'insertUnorderedList')
		// this.editor.composer.commands.exec("insertUnorderedList");

		var textarea = this.document.getElementById(this.id);
		// textarea.value += "<ul><li></li></ul>";
		// textarea.value += "<b>Hi</b>";
		// var list = this.document.createElement("ul");
		// var item = this.document.createElement("li");
		// list.appendChild(item);
		// html.appendChild(list);
		textarea.innerHTML += '<ul><li><input type="checkbox"></li></ul>'

		textarea.addEventListener("keydown", 
			function (e)
			{
				if (e.keyCode == 13)
				{
					alert("Enter");
				}
			}, false);
	}	
}

DraftOutlineEditor.prototype = new DraftEditor();

// var editor = new Editor("aName");

// function WysihtmlEditor(id, divID)
// {
// 	this.id = id;
// 	this.divID = divID;
// 	this.document = document;

// 	this.makeHtml = function (placeholder, autofocus) {
// 		var html = "<textarea id=\"" + this.id + "\" ";
// 		if (placeholder != null && placeholder.length > 0)
// 		{
// 			html += "placeholder=\"" + placeholder + "\" ";
// 		}
// 		if (autofocus)
// 		{
// 			html += "autofocus ";
// 		}
// 		html += "></textarea>";
// 		return html;
// 	}

// 	this.createEditor = function()
// 	{
// 		var rules = {
// 			tags: {
// 				"ul": 1,
// 				"li": 1
// 			}
// 		};

// 		this.editor = new wysihtml5.Editor(this.id, { // id of textarea element
// 			toolbar:      this.id + "-toolbar", // id of toolbar element
//   			parserRules:  rules // defined in parser rules set 
// 		});
// 	}
	
// 	this.initialize = function()
// 	{
// 		var div = this.document.getElementById(this.divID);
// 		div.innerHTML += this.makeHtml(null, false);

// 		this.createEditor()
// 	}
// }

// WysihtmlEditor.prototype = new Editor()

// function WysihtmlOutlineEditor(id, divID)
// {
// 	this.id = id;
// 	this.divID = divID;
// 	this.document = document;

// 	this.superInitialize = this.initialize
// 	this.initialize = function()
// 	{
// 		this.superInitialize()
// 		// wysihtml5.commands.insertUnorderedList.exec(this.editor.composer, 'insertUnorderedList')
// 		// this.editor.composer.commands.exec("insertUnorderedList");

// 		var ul = "<a data-wysihtml5-command=\"insertUnorderedList\">insert unordered list</a>";
// 		var toolbar = this.document.getElementById("wysihtml5-outline-toolbar");
// 		toolbar.innerHTML = ul;
// 	}
// 	// this.composer.commands.exec("insertUnorderedList");
// }

// WysihtmlOutlineEditor.prototype = new WysihtmlEditor()
