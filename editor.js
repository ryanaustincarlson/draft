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

	this.makeEditorArea = function (placeholder, autofocus) {
		var p = this.document.createElement("p");
		p.setAttribute("contenteditable", "true");
		p.setAttribute("id", this.id);
		
		return p;
	}

	this.initialize = function()
	{
		var div = this.document.getElementById(this.divID);
		var p = this.makeEditorArea(null, false);
		div.appendChild(p);

		// this.createEditor()
	}
}

DraftEditor.prototype = new Editor();

function DraftOutlineEditor(id, divID)
{
	this.id = id;
	this.divID = divID;
	this.document = document;
	this.listItemIndex = 0;

	this.createListItem = function()
	{
		li = this.document.createElement("li");
		li.setAttribute("id", "list" + this.listItemIndex);
		// checkbox = this.document.createElement("input");
		// checkbox.setAttribute("id", "checkbox" + this.listItemIndex);
		// checkbox.setAttribute("type", "checkbox");
		// li.appendChild(checkbox);

		this.listItemIndex++;

		return li;
	}

	this.addCheckboxes = function()
	{
		for (var i=0; i<this.list.children.length; i++)
		{
			var child = this.list.children[i];
			child.setAttribute("id", "list" + i);
			for (var j=0; j<child.children.length; j++)
			{
				var baby = child.children[j];
				if (baby.tagName != "INPUT")
				{
					child.removeChild(baby);
				}
			}
			if (child.children.length == 0 || child.children[0].tagName != "INPUT")
			{
				checkbox = this.document.createElement("input");
				checkbox.setAttribute("id", "checkbox" + i);
				checkbox.setAttribute("type", "checkbox");
				child.appendChild(checkbox);
			}
		}
	}

	this.superInitialize = this.initialize
	this.initialize = function()
	{
		this.superInitialize()

		var textarea = this.document.getElementById(this.id);
		
		this.list = this.document.createElement("ul");
		this.list.setAttribute("id", "outline-ul");
		var listItem = this.createListItem();
		this.list.appendChild(listItem);
		textarea.appendChild(this.list);

		this.addCheckboxes();
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
