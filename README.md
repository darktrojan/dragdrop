Drag and Drop
=============

This is a multi-purpose HTML drag and drop tool. To use it, call `new DraggableObject(element)`, then implement `customMouseMove` and `customMouseUp` functions on the returned object.

Example: drag an element around the screen
------------------------------------------

This code allows you to place things at any point on the screen. In most cases the tag in question should be a child of document.body, with absolute positioning. If you want to use fixed positioning (ie. the tag stays put if the user scrolls), set `d.fixed = true`.

	var tag = document.getElementById("tag");
	var d = new DraggableObject(tag);
	d.customMouseMove = function(event) {
		// dragStart[XY] is position relative to tag at the start of dragging
		// event.page[XY] is current position, relative to the top left corner of the page
		var left = event.pageX - this.dragStartX;
		var top = event.pageY - this.dragStartY;

		// this.domNode is a reference to tag
		// this code assumes tag has absolute positioning
		this.domNode.style.left = left + "px";
		this.domNode.style.top = top + "px";
	};
	d.customMouseUp = function(event) {
		// this will tell you exactly where the mouse was when you released the button
		alert([event.pageX, event.pageY]);
	};
