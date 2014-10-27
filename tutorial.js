function Tutorial(document)
{
	this.closeTutorial = function()
	{
		$("#tutorial").slideToggle();
	}

	this.nextStep_startOutline = function()
	{
		this.jTutorialText.text("Let's start with the outline. Select this first bullet point, press Enter to rename, and write your first point. Then click Next.")
	}

	this.nextStep_addToOutline = function()
	{
		this.jTutorialText.text("Great! Now use the '+' button to add more points to your outline, and fill them in, too! When you're ready, hit Next.")
	}

	this.nextStep_startEssay = function()
	{
		this.jTutorialText.text("Okay - now it's time to start your essay. Write a few sentences expanding on your outline.");
	}

	this.nextStep_analyze = function()
	{
		this.jTutorialText.text("Matching your outline to your essay is important! Draft lets you automatically analyze your essay. Hit the analyze tool!");
	}

	this.nextStep_analyzeExplained = function()
	{
		this.jTutorialText.text("If you didn't see some highlighting, try to make your sentnces more closely match the outline (this is a beta, after all)");
	}

	this.nextStep_manualHighlights = function()
	{
		this.jTutorialText.text("For any outline points that we missed, you can also manually highlight. First select the checkbox of the bullet point...");
	}

	this.nextStep_manualHighlights2 = function()
	{
		this.jTutorialText.text("...then select some text in your essay and hit 'Manual Highlight'");
	}

	this.nextStep_done = function()
	{
		this.jTutorialText.text("And you're done! Happy writing! I hope this helps!")
		this.jTutorialButtonNext.text("Done");
		this.jTutorialButtonNext.click(this.closeTutorial);
	}


	// this is how we know what the stages are
	this.tutorialStep = null;

	this.nextStep = function(event)
	{
		var tutorial = event.data.obj;

		switch (tutorial.tutorialStep)
		{
			case null:
				tutorial.tutorialStep = tutorial.nextStep_startOutline;
				break;

			case tutorial.nextStep_startOutline:
				tutorial.tutorialStep = tutorial.nextStep_addToOutline;
				break;

			case tutorial.nextStep_addToOutline:
				tutorial.tutorialStep = tutorial.nextStep_startEssay;
				break;

			case tutorial.nextStep_startEssay:
				tutorial.tutorialStep = tutorial.nextStep_analyze;
				break;

			case tutorial.nextStep_analyze:
				tutorial.tutorialStep = tutorial.nextStep_analyzeExplained;
				break;

			case tutorial.nextStep_analyzeExplained:
				tutorial.tutorialStep = tutorial.nextStep_manualHighlights;
				break;

			case tutorial.nextStep_manualHighlights:
				tutorial.tutorialStep = tutorial.nextStep_manualHighlights2;
				break;

			case tutorial.nextStep_manualHighlights2:
				tutorial.tutorialStep = tutorial.nextStep_done;
				break;

		}

		tutorial.tutorialStep();
	}

	// create the necessary elements in the dom
	// this should only get called once.
	this.initialize = function()
	{
		if (this.initialized)
		{
			return;
		}

		$("#tutorial").css({
			'width' : '100%',
			height : '4em',
			// 'min-height' : '4em',
			// 'max-height' : '4em',
			'background-color' : 'rgba(80,80,80,0.7)',
			'font-size': '2.5em',
			'display' : 'none',
			'position' : 'fixed',
			'bottom' : '0',
			'padding-right' : '20px',
			'padding-left' : '20px',
		});

		jQuery('<div/>', {
			id : 'tutorial-text'
		}).appendTo('#tutorial');

		this.jTutorialText = $("#tutorial-text");

		this.jTutorialText.css({
			'width' : '90%',
			'height' : '100%',
			'color' : 'white'
		})

		jQuery('<button/>', {
			id : 'tutorial-button-next',
			text : 'Next',
		}).appendTo('#tutorial');

		$("#tutorial-button-next").css({
			'position' : 'absolute',
			'bottom' : '1em',
			'right' : '10',
			'font-size' : '0.5em',
		});

		this.jTutorialButtonNext = $("#tutorial-button-next");

		jQuery('<button/>', {
			id : 'tutorial-button-close',
			text : 'x'
		}).appendTo('#tutorial');

		$("#tutorial-button-close").css({
			'position' : 'absolute',
			'bottom' : '5.5em',
			'right' : '10',
			'font-size' : '0.5em'
		});

		$("#tutorial-button-close").click(this.closeTutorial);
		$("#tutorial-button-next").click({ obj:this }, this.nextStep);
		this.initialized = true;
	}

	this.start = function()
	{
		$("#tutorial-text").text("Welcome to the Tutorial. Click Next to begin.")
		$("#tutorial").slideToggle();
	}

	if (document)
	{
		this.document = document;
		this.initialized = false;
		this.initialize();
	}
}