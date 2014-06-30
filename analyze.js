
function Analyzer(editor, outline)
{
	this.editor = editor;
	this.outline = outline;

	this.analyze = function()
	{
		var sentences = editor.prepareForProcessing();
		var bullets = outline.prepareForProcessing();

		var textHtml = editor.document.getElementById(editor.id).textContent;
		var offset = 0;

		for (var sentenceIdx = 0; sentenceIdx < sentences.length; sentenceIdx++)
		{
			var sentence = sentences[sentenceIdx];
			for (var bulletIdx = 0; bulletIdx < bullets.length; bulletIdx++)
			{
				var bullet = bullets[bulletIdx];
				if (sentence.text == bullet.text)
				{
					console.log(sentence.text);
					var colorize = '<tag style="background-color:' + this.getNextColor() + ';"">';

					// outline text
					var bulletText = [colorize, sentence.text, '</tag>'].join('');
					var bulletHTML = this.outline.document.getElementById(bullet.id);
					bulletHTML.innerHTML = bulletHTML.innerHTML.replace(bullet.text, bulletText);

					// checkbox
					var checkbox = this.outline.document.getElementById(bullet.checkboxID)
					checkbox.checked = true;

					// essay text
					var beforeLength = textHtml.length;

					var beforeSlice = textHtml.slice(0, sentence.start + offset);
					var middleSlice = textHtml.slice(sentence.start + offset, sentence.end + offset);
					var endSlice = textHtml.slice(sentence.end + offset);

					

					textHtml = [beforeSlice, colorize, middleSlice, '</tag>', endSlice].join('');
					console.log(">>textHTML: " + textHtml);

					offset += textHtml.length - beforeLength;
				}
			}
		}
		editor.document.getElementById(editor.id).innerHTML = textHtml;
	}

	this.colors = ['#0066FF', '#33CCFF', '#66FF00', '#33FF99', '#CC6699']
	this.currentColorIdx = 0;
	this.getNextColor = function()
	{
		return this.colors[this.currentColorIdx++];
	}
}
