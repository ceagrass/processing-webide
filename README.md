# processing.js webIDE

Uses localStorage and processing.js to make a processing ide in the browser accessible offline.

v0.01

	- Ability to save and load a sketch from localStorage
	- Found out how to load a sketch from a string into a canvas
	- Updating the sketch requires a page reload (saves to ls, reloads & loads from ls)

Test it out with a simple server in this project's directory:

	python -m SimpleHTTPServer

TODO

	- Add favicon.ico
	- Handle invalid processing code
	- Implement short term version control for undo functionality
  - Add CodeMirror as a git submodule
