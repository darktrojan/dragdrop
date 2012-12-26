function DraggableObject(domNode, fixed) {
	if (!!domNode) {
		this.init(domNode, fixed);
	}
}

DraggableObject.fixEvent = function(event) {
	if (typeof event == 'undefined') { // guess who
		var dde = document.documentElement;
		var db = document.body;
		event = window.event;
		event.pageX = event.clientX + dde.scrollLeft - db.clientLeft;
		event.pageY = event.clientY + dde.scrollTop - db.clientTop;
		event.target = event.srcElement;
	} else if (typeof event.pageX == 'undefined') { // IE9
		var dde = document.documentElement;
		var db = document.body;
		event.pageX = event.clientX + dde.scrollLeft - db.clientLeft;
		event.pageY = event.clientY + dde.scrollTop - db.clientTop;
	}
	return event;
};

DraggableObject.fixBCR = function(tag, fixed) {
	// see also calendar.js
	var bcr = tag.getBoundingClientRect();
	if (/MSIE [67]\.0/.test(navigator.userAgent)) {
		bcr.left -= 2;
		bcr.right -= 2;
		bcr.top -= 2;
		bcr.bottom -= 2;
	}
	var dde = document.documentElement;
	var db = document.body;
	var sl = fixed ? 0 : dde.scrollLeft + db.scrollLeft;
	var st = fixed ? 0 : dde.scrollTop + db.scrollTop;
	return {
		left: bcr.left + sl,
		right: bcr.right + sl,
		top: bcr.top + st,
		bottom: bcr.bottom + st,
		width: bcr.right - bcr.left,
		height: bcr.bottom - bcr.top
	};
};

DraggableObject.prototype = {
	lastMove: 0,
	threshold: 5,
	enabled: true,

	init: function(domNode, fixed) {
		this.domNode = domNode;
		this.fixed = !!fixed;
		this.domNode.draggableObject = this;
		var self = this;
		this.domNode.onmousedown = function(event) { if (self.enabled) { self.mouseDown(event); } };
	},

	mouseDown: function(event) {
		event = DraggableObject.fixEvent(event);

		if (this.explicitTarget && event.target != this.domNode) {
			return;
		}

		if (event.preventDefault) {
			event.preventDefault();
		}

		document.ondrag = function() { return false; };
		document.onselectstart = function() { return false; };

		var bcr = DraggableObject.fixBCR(this.domNode, this.fixed);
		this.dragStartX = event.pageX - bcr.left;
		this.dragStartY = event.pageY - bcr.top;
		this.dragging = false;
		this.pageStartX = event.pageX;
		this.pageStartY = event.pageY;

		if (this.customDblClick && event.detail == 2) {
			this.customDblClick(event);
			return;
		}

		var self = this;
		document.onmousemove = function(event) {
			self.mouseMove(event);
		};
		document.onmouseup = function(event) {
			self.mouseUp(event, false);
		};
		document.onkeypress = function(event) {
			event = DraggableObject.fixEvent(event);
			if (event.keyCode == 27) {
				self.mouseUp(event, true);
			}
		}
	},

	mouseMove: function(event) {
		var now = new Date().valueOf();
		if (now - this.lastMove < 25) {
			return;
		}

		event = DraggableObject.fixEvent(event);
		if (!this.dragging) {
			if (Math.abs(event.pageX - this.pageStartX) > this.threshold ||
					Math.abs(event.pageY - this.pageStartY) > this.threshold) {
				this.dragging = true;
			} else {
				return;
			}
		}

		this.lastMove = 0;
		if (this.customMouseMove) {
			this.customMouseMove(event);
		}
		this.lastMove = new Date().valueOf();
	},

	mouseUp: function(event, cancel) {
		document.onmousemove = null;
		document.onmouseup = null;
		document.onkeypress = null;

		if (document.ondrag) {
			document.ondrag = null;
			document.onselectstart = null;
		}

		if (!this.dragging) {
			return;
		}

		if (this.customMouseUp) {
			event = DraggableObject.fixEvent(event);
			this.customMouseUp(event, cancel);
		}
	}
};
