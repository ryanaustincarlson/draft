
var textarea = document.getElementById("text");
console.log(textarea);

textarea.setAttribute('contenteditable', true);

textarea.innerHTML += "<ul><li><input type=\"checkbox\"></li></ul>";
// textarea.execCommand("insertUnorderedList", false, null);