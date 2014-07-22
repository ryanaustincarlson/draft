
function Analyzer(editor, outline)
{
	this.editor = editor;
	this.outline = outline;

	this.matcher = new CosineMatcher();

	this.analyze = function()
	{
		var sentences = editor.prepareForProcessing();
		var bullets = outline.prepareForProcessing();

		var highlighter = new Highlighter(this.editor.document);

		for (var sentenceIdx = 0; sentenceIdx < sentences.length; sentenceIdx++)
		{
			var sentence = sentences[sentenceIdx];
			for (var bulletIdx = 0; bulletIdx < bullets.length; bulletIdx++)
			{
				var bullet = bullets[bulletIdx];
				// if (sentence.text == bullet.text)
				var match = this.matcher.matches(sentence.text, bullet.text);
				console.log("sentence: " + sentence.text + ", bullet: " + bullet.text + ", match: " + match)
				if (match > .6)
				// if (this.matcher.matches(sentence.text, bullet.text) > .9)
				{
					highlighter.highlight(sentence, bullet);
				}
			}
		}
		this.editor.document.getElementById(editor.id).innerHTML = highlighter.textHtml
	}
}


function Matcher()
{
	this.sentenceFeatureMapping = {'a':'b'};

	this.matches = function(s1, s2)
	{
		return 1;
	}
}

function CosineMatcher()
{
	this.matches = function(s1, s2)
	{
		var features1 = this.sentenceFeatureMapping[s1];
		if (!features1)
		{
			features1 = this.features(s1);
			this.sentenceFeatureMapping[s1] = features1
		}

		var features2 = this.sentenceFeatureMapping[s2];
		if (!features2)
		{
			features2 = this.features(s2)
			this.sentenceFeatureMapping[s2] = features2
		}

		// TODO: be smarter about this!
		var overlapping_words_map = {}
		for (var key in features1)
		{
			if (features1.hasOwnProperty(key))
			{
				overlapping_words_map[key] = true;
			}
		}
		for (var key in features2)
		{
			if (features2.hasOwnProperty(key))
			{
				overlapping_words_map[key] = true;
			}
		}
		var overlapping_words = []
		for (var key in overlapping_words_map)
		{
			if (overlapping_words_map.hasOwnProperty(key))
			{
				overlapping_words.push(key)
			}
		}
		// console.log(overlapping_words);

		var vector1 = []
		var vector2 = []
		for (var i=0; i<overlapping_words.length; i++)
		{
			var word = overlapping_words[i];
			var ftr1 = features1[word];
			vector1.push(ftr1 ? ftr1 : 0);

			var ftr2 = features2[word];
			vector2.push(ftr2 ? ftr2 : 0);
		}

		console.log(features1)
		console.log(features2)

		if (features1 == features2)
		{
			return 1.0;
		}

		// console.log("vector1: " + vector1);
		// console.log("vector2: " + vector2);

		var dot_product = 0;
		var squared_sum1 = 0;
		var squared_sum2 = 0;
		for (var i=0; i<vector1.length; i++)
		{
			dot_product += (vector1[i] * vector2[i]);
			squared_sum1 += vector1[i] * vector1[i];
			squared_sum2 += vector2[i] * vector2[i];
		}
		// console.log("dot product: " + dot_product);
		// console.log("squared sum1: " + squared_sum1);
		// console.log("squared sum2: " + squared_sum2);

		var sqrt1 = Math.sqrt(squared_sum1);
		var sqrt2 = Math.sqrt(squared_sum2);

		// console.log("sqrt1: " + sqrt1);
		// console.log("sqrt2: " + sqrt2);

		// console.log("sqrts eq? " + (sqrt1 == sqrt2))
		// console.log("sqrt1 * sqrt2: " + (sqrt1 * sqrt2));

		var cosine = dot_product / (sqrt1 * sqrt2);

		return cosine;
	}

	this.features = function(s)
	{
		s = s.toLowerCase()
		s = s.replace(/[\.,-\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
		s = s.replace(/\s{2,}/g," ");
		s = s.replace(/^[ ]+/g, "");
		s = s.replace(/[ ]+$/g, "");
		var words = s.split(" ");
		var counts = {}
		for (var w=0; w < words.length; w++)
		{
			var word = words[w];
			if (!counts[word])
			{
				counts[word] = 0;
			}
			counts[word]++;
		}
		return counts
	}
}

CosineMatcher.prototype = new Matcher();

function Highlighter(document)
{
	this.document = document;

	this.textHtml = this.document.getElementById(editor.id).textContent;
	this.offset = 0;

	this.highlight = function(sentence, bullet)
	{
		console.log(sentence.text);
		var colorize = '<tag style="background-color:' + this.getNextColor() + ';"">';

		// outline text
		var bulletText = [colorize, bullet.text, '</tag>'].join('');
		var bulletHTML = this.document.getElementById(bullet.id);
		bulletHTML.innerHTML = bulletHTML.innerHTML.replace(bullet.text, bulletText);

		// checkbox
		var checkbox = this.document.getElementById(bullet.checkboxID)
		checkbox.checked = true;

		// essay text
		var beforeLength = this.textHtml.length;

		var beforeSlice = this.textHtml.slice(0, sentence.start + this.offset);
		var middleSlice = this.textHtml.slice(sentence.start + this.offset, sentence.end + this.offset);
		var endSlice = this.textHtml.slice(sentence.end + this.offset);

		this.textHtml = [beforeSlice, colorize, middleSlice, '</tag>', endSlice].join('');
		console.log(">>textHTML: " + this.textHtml);

		this.offset += this.textHtml.length - beforeLength;
	}

	this.colors = ['#33CCFF', '#66FF00', '#33FF99', '#CC6699', '#0066FF']
	this.currentColorIdx = 0;
	this.getNextColor = function()
	{
		return this.colors[this.currentColorIdx++];
	}
}