function Editor(divID, document)
{
	this.divID = divID;
	this.rawText = "";
	this.document = document;

	this.html = function()
	{	
		return this.document.getElementById(this.divID).innerHTML
	}
}

function DraftEditorSentence(editor, text, start, end)
{
	this.editor = editor;
	this.editorNode = editor.document.getElementById(editor.id);
	this.text = text;
	this.start = start;
	this.end = end;
	this.applier = null;
	this.range = null;

	this.highlight = function(color)
	{
		this.applier = rangy.createCssClassApplier(color);

		this.range = rangy.createRange(this.editorNode);

		this.range.selectCharacters(this.editorNode, this.start, this.end);
		this.applier.applyToRange(this.range);
	}

	this.clearHighlights = function()
	{
		if (this.range)
		{
			this.applier.undoToRange(this.range);
		}
	}

	this.equals = function(other)
	{
		return this.text == other.text && this.start == other.start && this.end == other.end;
	}

	this.overlaps = function(other)
	{
		return this.start <= other.end && other.start <= this.end;
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
		// split on '.'
		for (var i=0; i<text.length; i++)
		{
			var letter = text[i];
			if (letter == '.' || letter == '!' || letter == '?')
			{
				var sentence = new DraftEditorSentence(this, text.substring(start, i), start, i)
				// var sentence = {
				// 	text : text.substring(start, i),
				// 	start : start,
				// 	end : i
				// };
				sentences.push(sentence);
				start = i+1;
			}
			
		}
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
				if (child.innerHTML == null)
				{
					child.appendChild(checkbox);
				}
				else
				{
					// FIXME: this is almost certainly the wrong way to deal
					// with text that already exists
					html = child.innerHTML;
					child.innerHTML = "";
					child.appendChild(checkbox)
					child.innerHTML += html
				}
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

function DraftOutlineBulletPoint(node)
{
	this.node = node;
	this.text = node.title;

	this.applier = null;
	this.range = null;

	this.highlight = function(color)
	{
		// highlight with color
		this.applier = rangy.createCssClassApplier(color);
		this.range = rangy.createRange();

		this.range.selectNode(this.node.span);
		this.applier.applyToRange(this.range);
	}

	this.clearHighlights = function()
	{
		if (this.range)
		{
			this.applier.undoToRange(this.range);
			this.markCheckbox(false);
		}
	}

	this.markCheckbox = function(marked)
	{
		// console.log("marking checkbox (" + this.text + ") with " + marked)
		this.node.setSelected(marked);
	}

	this.equals = function(other)
	{
		return this.node == other.node && this.text == other.text;
	}
}

function DraftTreeOutlineEditor(id, divID)
{
	this.id = id;
	this.divID = divID;
	this.document = document;
	this.listItemIndex;

	this.initialize = function()
	{
		// extract the code that's currently in index.html...
	}

	this.prepareForProcessing = function()
	{
		var flattenTree = function(node)
		{
			var fullList = node.isRoot() ? [] : [node];
			var children = node.getChildren();
			if (children)
			{
				for (var i=0; i<children.length; i++)
				{
					var child = children[i];
					var grandchildren = flattenTree(child);
					fullList = fullList.concat(grandchildren);
				}
			}
			return fullList;
		}

		var root = $("#tree").fancytree("getRootNode");
		var children = flattenTree(root);

		var bullets = []
		for (var i=0; i<children.length; i++)
		{
			var child = children[i];
			bullets.push(new DraftOutlineBulletPoint(child));
		}

		return bullets;
	}
}

DraftTreeOutlineEditor.prototype = new DraftEditor();








