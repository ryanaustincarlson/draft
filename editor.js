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

	this.prepareForProcessing = function()
	{
		var sentences = []
		var text = this.document.getElementById(this.id).textContent;
		var start = 0;
		for (var i=0; i<text.length; i++)
		{
			var letter = text[i];
			if (letter == '.')
			{
				var sentence = {
					text : text.substring(start, i),
					start : start,
					end : i
				};
				sentences.push(sentence);
				start = i+1;
			}
			
		}
		// var splits = text.split('.');
		return sentences;
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

	this.prepareForProcessing = function()
	{
		var bullets = []
		for (var i=0; i<this.list.children.length; i++)
		{
			var child = this.list.children[i];

			var checkboxID = null;
			for (var c=0; c<child.children.length; c++)
			{
				var possibleCheckbox = child.children[c];
				if (possibleCheckbox.getAttribute("type") == "checkbox")
				{
					checkboxID = possibleCheckbox.getAttribute("id");
				}
			}

			var bullet = {
				id : child.getAttribute("id"),
				text : child.textContent,
				checkboxID : checkboxID
			};
			bullets.push(bullet);
		}
		return bullets;
	}	

}

DraftOutlineEditor.prototype = new DraftEditor();

