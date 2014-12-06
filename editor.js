function Editor(divID, document)
{
	if (!!divID)
	{
		this.divID = divID;
		this.rawText = "";
		this.document = document;
	}

	this.html = function()
	{	
		return this.document.getElementById(this.divID).innerHTML
	}
}

function DraftEditorSentence(editor, text, start, end)
{
	if (!!editor)
	{
		this.editor = editor;
		this.editorNode = this.editor.document.getElementById(this.editor.id);
		this.text = text;
		this.start = start;
		this.end = end;
	}
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
	if (!!id)
	{
		this.id = id;
		this.divID = divID;
		this.document = document;
	}

	this.sentenceClass = DraftEditorSentence;

	this.initialize = function()
	{
		var div = this.document.getElementById(this.divID);
		var p = this.document.createElement("p");
		p.setAttribute("contenteditable", "true");
		p.setAttribute("id", this.id);
		p.setAttribute("style", "min-height:80%;");
		div.appendChild(p);
	}

	this.prepareForProcessing = function()
	{
		var sentences = []
		var text = this.getText();
		var start = 0;

		var ignoring = false;
		var iOffset = 0;

		currentSentenceText = ''

		// split on '.', '!', '?'
		for (var i=0; i<text.length; i++)
		{
			var letter = text[i];
			// console.log(letter); // TODO remove me

			if (letter == '<' || letter == '&')
			{
				ignoring = true;
			}

			if (ignoring)
			{
				if (letter == ">" || letter == ';')
				{
					ignoring = false;
				}
				else
				{
					iOffset += 1
				}
				continue;
			}

			currentSentenceText += letter

			var adjustedIndex = i-iOffset;
			if (letter == '.' || letter == '!' || letter == '?')
			{
				var sentence = new this.sentenceClass(this, currentSentenceText, start, adjustedIndex)
				console.log(sentence)
				currentSentenceText = ''
				
				sentences.push(sentence);
				start = adjustedIndex+1;
			}
			
		}
		return sentences;
	}

	this.getText = function()
	{
		return this.document.getElementById(this.id).textContent;
	}
}

DraftEditor.prototype = new Editor();

function MediumDraftEditorSentence(editor, text, start, end)
{
	if (!!editor)
	{
		this.editor = editor;
		this.editorNode = this.editor.medium.element;
		this.text = text;
		this.start = start;
		this.end = end;
		this.applier = null;
		this.range = null;
	}
}

MediumDraftEditorSentence.prototype = new DraftEditorSentence();

function MediumDraftEditor(id, divID)
{
	if (!!id)
	{
		this.id = id;
		this.divID = divID;
		this.document = document;
		this.medium = null;

		this.sentenceClass = MediumDraftEditorSentence;
	}

	this.initialize = function()
	{
		this.medium = new Medium({
			element: document.getElementById(this.divID),
			mode: Medium.richMode,
			placeholder: 'Write your essay....'
		});
	}

	this.getText = function()
	{
		// return this.medium.element.textContent;
		return this.medium.element.innerHTML;
	}
}

MediumDraftEditor.prototype = new DraftEditor();

function DraftOutlineEditor(id, divID)
{
	if (!!id)
	{
		this.id = id;
		this.divID = divID;
		this.document = document;
		this.listItemIndex = 0;
	}

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
	if (!!node)
	{
		this.node = node;
		this.text = node.title;
	}

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
	if (!!id)
	{
		this.id = id;
		this.divID = divID;
		this.document = document;
		this.listItemIndex = 0;
	}

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

