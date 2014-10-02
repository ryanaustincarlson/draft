
function Analyzer(editor, outline)
{
	this.editor = editor;
	this.outline = outline;

	this.matcher = new CosineMatcher();
	this.sorter = new MatchSorter(this.matcher);

	this.matches = [];
	this.sentences = null;
	this.bullets = null;

	this.highlighter = new Highlighter(this.editor.document);

	this.analyze = function()
	{
		this.sentences = editor.prepareForProcessing();
		this.bullets = outline.prepareForProcessing();

		var autoMatches = this.sorter.sort(this.sentences, this.bullets, this.matches);

		for (var i=0; i<autoMatches.length; i++)
		{
			var sentence = autoMatches[i].sentence;
			var bullet = autoMatches[i].bullet;

			this.highlighter.highlight(sentence, bullet);
		}

		this.matches = this.matches.concat(autoMatches);

	}

	this.clearHighlights = function()
	{
		if (!this.matches)
		{
			return;
		}

		var highlighter = new Highlighter(this.editor.document);
		
		for (var i=0; i<this.matches.length; i++)
		{
			var sentence = this.matches[i].sentence;
			var bullet = this.matches[i].bullet;

			highlighter.clearHighlights(sentence, bullet);
		}

		this.matches = [];
	}

	this.addMatch = function(sentence, bullet)
	{
		this.matches.push(new Match(1, sentence, bullet));
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

		// console.log(features1)
		// console.log(features2)

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

	this.offset = 0;

	this.highlight = function(sentence, bullet)
	{
		var color = this.getNextColor();

		// outline text
		bullet.highlight(color);

		// outline checkbox
		bullet.markCheckbox(true);

		// essay text
		sentence.highlight(color);
	}

	this.clearHighlights = function(sentence, bullet)
	{
		sentence.clearHighlights();
		bullet.clearHighlights();
	}

	this.colors = ['darkSeaGreen','cornflowerBlue','chartreuse','orange','red','purple'];
	this.currentColorIdx = 0;
	this.getNextColor = function()
	{
		this.currentColorIdx = (this.currentColorIdx + 1) % this.colors.length;
		return this.colors[this.currentColorIdx];
	}
}

function Match(score, sentence, bullet)
{
	this.score = score;
	this.sentence = sentence;
	this.bullet = bullet;
}

function MatchSorter(matcher)
{
	this.matcher = matcher;

	this.sort = function(sentences, bullets, existingMatches)
	{
		var usedBullets = []
		var usedSentences = []

		if (!!existingMatches)
		{
			for (var matchIdx = 0; matchIdx < existingMatches.length; matchIdx++)
			{
				var bullet = existingMatches[matchIdx].bullet;
				var sentence = existingMatches[matchIdx].sentence;
				usedBullets.push(bullet)
				usedSentences.push(sentence)
			}
		}
		
		var matches = [];
		for (var sentenceIdx = 0; sentenceIdx < sentences.length; sentenceIdx++)
		{
			var sentence = sentences[sentenceIdx];
			for (var bulletIdx = 0; bulletIdx < bullets.length; bulletIdx++)
			{
				var bullet = bullets[bulletIdx];

				var score = this.matcher.matches(sentence.text, bullet.text);
				if (score > .25) // FIXME: .6 or something
				{
					// implement the var matches thing
					matches.push(new Match(score, sentence, bullet))
				}
			}
		}

		matches.sort(function(a, b) {
			return b.score - a.score;
		})

		var culledMatches = []

		var containsWithEqual = function(list, item)
		{
			for (var idx=0; idx<list.length; idx++)
			{
				if (list[idx].equals(item))
				{
					return true;
				}
			}
			return false;
		}

		var containsWithOverlap = function(list, item)
		{
			for (var idx=0; idx<list.length; idx++)
			{
				if (list[idx].overlaps(item))
				{
					return true;
				}
			}
			return false;
		}

		for (var i=0; i<matches.length; i++)
		{
			var bullet = matches[i].bullet;
			var sentence = matches[i].sentence;

			var alreadyUsed = containsWithEqual(usedBullets, bullet) || 
							  containsWithOverlap(usedSentences, sentence)

			// if we haven't claimed this bullet index and sentence index yet
			// if (usedBullets.indexOf(bulletIdx) == -1 && usedSentences.indexOf(sentenceIdx) == -1)
			if (!alreadyUsed)
			{
				culledMatches.push(matches[i]);
				usedBullets.push(bullet);
				usedSentences.push(sentence);
			}
		}

		console.log("matches...");
		for (var i=0; i<matches.length; i++)
		{
			console.log(matches[i]);
		}

		culledMatches.sort(function(a, b) {
			return a.sentence.start - b.sentence.start
		})				

		console.log("culled matches...");
		for (var i=0; i<culledMatches.length; i++)
		{
			console.log(culledMatches[i]);
		}
		return culledMatches;
	}
}

// TODO: remove me!
// var matcher = new CosineMatcher();
// console.log(matcher.matches("My second point is really important, too", "Here's the second point, which is also really important!"))