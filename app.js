var app = {};
app.container = document.getElementById("container");
app.LS_KEY = "pide_code";
app.saveCode = function() {
  window.localStorage.setItem(app.LS_KEY, app.inputArea.get());
};
app.loadCode = function() {
  return window.localStorage.getItem(app.LS_KEY);
};
app.debug = (function() {
  var debugEl = document.getElementById("debug");

  return function(message, sendToConsole) {
    if (sendToConsole) {
      console.log(message);
    } else {
      debugEl.innerText += message;
    }
  };
}());

// Make sure that the app can be started properly
var required = {
  "processing": Processing ? true : false,
  "localStorage": window.localStorage ? true : false,
  "Worker": !!window.Worker ? true : false
};
for (var key in required) {
  if (!required[key]) {
    app.debug("[ERR]: " + key + " is unavailable. Aborting.");
    required.pass = false;
    break;
  } else {
    app.debug("[OK]: " + key + " loaded.");
    required.pass = true;
  }
}

app.inputArea = {};
app.inputArea.el = document.getElementById("fileInput");
app.inputArea.get = function() {
  return "" + app.inputArea.el.value;
};
app.inputArea.set = function(content) {
  app.inputArea.el.value = content;

  return content;
};

var saveButton = document.getElementById("saveAndLoad");
saveButton.addEventListener("click", function(e) {
  app.saveCode(app.inputArea.get());
  //Refresh the page
  window.location.href = "";
});

//Need to load the worker so that we can process the processing sketches
var processingWorker = new Worker("processingWorker.js");

//Need an outputArea; somewhere to display the processing output
app.outputArea = {};
app.outputArea.container = document.getElementById("preview");
app.outputArea.el = document.createElement("canvas");
//The output element needs an id or else processingjs doesn't work
app.outputArea.el.id = "myCanvas";
app.outputArea.get = function() {
  //TODO: Get the canvas contents as base64 image
};
app.outputArea.set = function(processingCode, cnvEl) {
  if (!cnvEl) {
    cnvEl = app.outputArea.el;
  }
  if (cnvEl.id === undefined || cnvEl.id === "") {
    //Again, processingjs needs the canvas to have an id
    cnvEl.id = "pSketch" + (Math.random() * 100).toFixed();
  }

  console.log(processingCode);
  //TODO: Send sketch compilation and instancing to web worker
  processingWorker.postMessage([processingCode]);

  //Create a sketch from the code
  var sketch = Processing.compile(processingCode);
  //TODO: Check sketch for errors
  //Add the canvas to the container before the instance is created
  app.outputArea.container.appendChild(cnvEl);
  //Start the sketch, binding it to the canvas element
  var processingInstance = new Processing(cnvEl.id, sketch);

  return processingInstance;
};

//Make sure that the localStorage[key] is not null
if (window.localStorage.getItem(app.LS_KEY) === null) {
  window.localStorage.setItem(app.LS_KEY, "");
}
if (required.pass) {
  //START THE APP by loading the last saved processing code from localStorage
  var code = app.loadCode();
  //Load the processing code from localStorage into the textArea
  app.inputArea.set(code);
  //Load the processing code from the textarea into the outputArea
  app.outputArea.set(code, app.outputArea.el);
  
  /*
  var codeMirror = CodeMirror(function(elt) {
    app.inputArea.parentNode.replaceChild(elt, app.inputArea);
  }.
  {
    value: app.inputArea.value
  });
  */
  var tempVal = app.inputArea.get();
  app.codeMirror = CodeMirror.fromTextArea(app.inputArea.el);
  app.inputArea.set(tempVal);
  app.inputArea.get = function() {
    return "" + app.codeMirror.getValue();
  };
  app.inputArea.set = function(content) {
    app.codeMirror.setValue(content);

    return content;
  };

}
