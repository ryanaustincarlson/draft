
function Analyzer()
{
	console.log("Analyzer created");
	this.update = function() {
		console.log("update")
	}
}

var a = new Analyzer()

var editor = new wysihtml5.Editor("wysihtml5-textarea", { // id of textarea element
  parserRules:  wysihtml5ParserRules // defined in parser rules set 
});
var log = document.getElementById("log")

editor
.on("load", function() {
	log.innerHTML += "<div>load</div>"
})
.on("blur", function() {
  log.innerHTML += "<div>blur</div>";
})
.on("change", function() {
  log.innerHTML += "<div>change</div>";
})
.on("newword:composer", function() {
	log.innerHTML += "<div>new word</div>";
	log.innerHTML += "<div>" + document.getElementById("wysihtml5-textarea").value + "</div>"
})

var outlineEditor = new wysihtml5.Editor("wysihtml5-outline", { // id of textarea element
  parserRules:  wysihtml5ParserRules // defined in parser rules set 
});
var log = document.getElementById("log")

outlineEditor
.on("load", function() {
	log.innerHTML += "<div>outline:load</div>"
})
.on("blur", function() {
  log.innerHTML += "<div>outline:blur</div>";
})
.on("change", function() {
  log.innerHTML += "<div>outline:change</div>";
})
.on("newword:composer", function() {
	log.innerHTML += "<div>outline:new word -> " + document.getElementById("wysihtml5-outline").value + "</div>"	
	a.update()
})