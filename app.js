var app = function() {
  var container;
  container = document.getElementById("container");
	var localStorage_key = "pide_code";

	/*sendToConsole is an optional boolean argument; if true then send message to console instead*/
	var debug = function() {
    var debugEl;
    debugEl = document.getElementById("debug");
		return function(message, sendToConsole) {
			if (sendToConsole) {
				console.log(message);
			}
			else {
				//Add message to debug history
				//TODO
				//Display message in debugEl
				debugEl.innerText += message;	
			}
		};
	}();
	return {
		container: container,
		debug: debug,
		LS_KEY: localStorage_key
	};
}();

/*Make sure that the app can be started properly*/
var errorOccured = false;
if (Processing) {
	app.debug("Processing.js loaded.");
} else {
	errorOccured = true;
}
if (window.localStorage) {
	app.debug("localStorage is available.");
} else {
	errorOccured = true;
}
//Handle error
if (errorOccured) {
	app.debug("Error initializing the app. Your browser may be unsupported.");
}


//Need an inputArea; somewhere to type processing code
app.inputArea = function(inputEl) {
	function get() {
		var content = "";
		content += inputEl.value;
		return content;
	}
	function set(content) {
		inputEl.value = content;
		return content;
	}
	var saveButton = function(el) {
		el.innerText = "Save & Load sketch";
		el.addEventListener("click", function(e) {
			app.saveCode(get());
			window.location.href = window.location.href;
			app.loadCode();
		});

		app.container.appendChild(el);
		return el;
	}(document.getElementById("saveAndLoad"));

	return {
		el: inputEl,
		get: function() {
			var content = "";
			content += inputEl.value;
			return content;
		},
		set: function(content) {
			inputEl.value = content;
			return content;
		}
	}
}(document.getElementById("fileInput"));
//Need an outputArea; somewhere to display the processing output
app.outputArea = function(outputEl) {
  var outputContainer;
  outputContainer = document.getElementById("preview");
	outputContainer.appendChild(outputEl);

	outputEl.id = "myCanvas";

	return {
		el: outputEl,
		get: function() {
			//Get the canvas contents as base64 image
			//TODO
		},
		set: function(processingCode, cnvEl) {
			if (!cnvEl) {
				var cnvEl = outputEl;
			}
			if (cnvEl.id == undefined || cnvEl.id == "") {
				cnvEl.id = "pSketch" + (Math.random()*100).toFixed();

			}
			//Load the processingCode string into the canvas el
			console.log(processingCode);
			//Create a sketch from the code
			var sketch = Processing.compile(processingCode);
			//Start the sketch, binding it to the canvas element
			var processingInstance = new Processing(cnvEl.id, sketch);
			return processingInstance;
		}
	};
}(document.createElement("canvas"));

app.saveCode = function() {
	return function() {
		window.localStorage.setItem(app.LS_KEY, app.inputArea.get());
	}
}();
app.loadCode = function() {
	if (window.localStorage.getItem(app.LS_KEY) == null) {
		window.localStorage.setItem(app.LS_KEY, "");
	}
	return function() {
		return window.localStorage.getItem(app.LS_KEY);
	}
}();

//START THE APP by loading the last saved processing code from localStorage
var code = app.loadCode();
//Load the processing code from localStorage into the textArea
app.inputArea.set(code);
//Load the processing code from the textarea into the outputArea
app.outputArea.set(code, app.outputArea.el);
