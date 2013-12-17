// JavaScript Document
//
//
// Last Updated
//______________________________________________________________________________________________________________
//
// Date:				
// Time:				
// Version:			1.5.0
//______________________________________________________________________________________________________________
//
//
// Parts adapted from work of Simon Sarris:      www.simonsarris.com            sarris@acm.org
//

	// Constructor for Shape objects to hold data for all drawn objects.
	function Shape(x, y, id, mouseOver) {
		this.x = x || 0;																				// This is a very simple and unsafe constructor.
		this.y = y || 0;																				// All we're doing is checking if the values exist.
		this.w = layerTree.Sc * 180;																	// "x || 0" just means "if there is a value
		this.h = layerTree.Sc * 90;																	// for x, use that. Otherwise use 0."
		this.mouseOver = mouseOver || false;
		this.id = id;																					// Sets id of shape (To check against ary of people)
		if (this.id == 'NewFather' || this.id == 'NewMother' || this.id == 'NewChild'){
			this.z = this.id;
		} else {
			this.z = (parseFloat(this.id)) - 1;	
		}//NewNode
	}//function Shape

	
	// Constructor for ConnectorA objects to hold data for all drawn objects.
	function ConnectorA(parent, child, fam) {
		if (fam) { 		//if there are 2 parents
			var shapes = layerTree.ConnectorBs;
			for (var i = 0; i <= shapes.length-1; i++) {
				if (shapes[i] && shapes[i].id == parent) {
					this.parent = shapes[i];
				}//if
			}//for
			var shapes = layerTree.shapes;
			for (var i = 0; i <= shapes.length-1; i++) {
				if (shapes[i] && shapes[i].id == child) {
					this.child = shapes[i];
				} //if
			}//for
		} else {		//single parent
			var shapes = layerTree.shapes;
			for (var i = 0; i <= shapes.length-1; i++) {
				if (shapes[i] && shapes[i].id == parent) {
					this.parent = shapes[i];
				} else if (shapes[i] && shapes[i].id == child) {
					this.child = shapes[i];
				} //if
			}//for
		}//fam?
	}//function ConnectorA
	
	
	// Constructor for ConnectorB objects to hold data for all drawn objects.
	function ConnectorB(husb, wife, id, mouseOver) {
		var shapes = layerTree.shapes;
		this.mouseOver = mouseOver || false;
		for (var i = 0; i <= shapes.length-1; i++) {
			if (shapes[i] && shapes[i].id == husb) {
				this.husb = shapes[i];
			} else if (shapes[i] && shapes[i].id == wife) {
				this.wife = shapes[i];
			}//if
		}//for
		this.id = id;
	}//function ConnectorB
	
	
	// Draws the shape on the given context
	Shape.prototype.draw = function(ctx) {
		if (this.z == 'NewFather' || this.z == 'NewMother' || this.z == 'NewChild') { 
			this.x *= Scale;	this.y *= Scale;	this.w *= Scale;	this.h *= Scale;
			noNodeShape(ctx, this.x, this.y, this.w, this.h, this.z, this.mouseOver);
		} else {
			this.x *= Scale;	this.y *= Scale;	this.w *= Scale;	this.h *= Scale;
			var x=this.x, y=this.y, w=this.w, h=this.h;		
			var grd = ctx.createLinearGradient(x, y, x, y + h), grd2 = ctx.createLinearGradient(x, y, x, y + h);								
			var a = People[this.z];
			var fore = a.NAME.GIVN[0]; 
			if (a.NAME.GIVN[1]) { 
				fore = a.NAME.GIVN[0] + ' ' + a.NAME.GIVN[1][0] + '.'; 
			}
			
			//Get radius size
				  if (Multiplier < -8) { 	var r = 2;	}
			else if (Multiplier < -5) {	var r = 8;	}
			else if (Multiplier <  5) {	var r = 15;	}
			else { var r = 20;	}
			
			drawRoundedRectangle(ctx,x,y,w,h,r);																		// Finish the outline of the shape
			
			// Box Colour
			ctx.fillStyle = grd;																		// Fill box with Gradient
			if (a.GEND == "M") {																		// Check Gender - If male
				grd.addColorStop(0.0, "#aaffff"); 														//  dark blue
				grd.addColorStop(0.5, "#0088ff"); 														//  light blue
				grd.addColorStop(0.5, "#0066ff"); 														//  light blue
				grd.addColorStop(1.0, "#aaffff"); 														//  light blue
			} else if (a.GEND == "F") {																	// If female
				grd.addColorStop(0.0, "#ffcccc"); 														//  red
				grd.addColorStop(0.5, "#ff3333"); 														//  pink
				grd.addColorStop(0.5, "#ff0000"); 														//  red
				grd.addColorStop(1.0, "#ffcccc"); 														//  pink
			} else  {																					// If Unknown
				grd.addColorStop(0.0, "#eeeeee"); 														//  grey
				grd.addColorStop(0.5, "#cccccc"); 														//  light grey
				grd.addColorStop(0.5, "#aaaaaa"); 														//  grey
				grd.addColorStop(1.0, "#ffffff"); 														//  light grey
			}//if
			
			// Drop Shadow Settings
			if (a.ID == curSel) {	ctx.shadowColor = "#000000"; }										// Selected Node = Darker Shadow
			else {	ctx.shadowColor = "#333333";	}													// Otherwise normal shadow
				ctx.shadowBlur = 10;
				ctx.shadowOffsetX = 4;
				ctx.shadowOffsetY = 4;
	  
			ctx.fill();																					// Fill the shape
			ctx.shadowColor = "transparent";															// Change the shadow settings
			ctx.lineWidth = 2;																			// Set properties of outline
			
			if (a.ID == curSel) {	ctx.strokeStyle = "#ff0000";	}									// Selected Node = Red Border
			else if (a.ID == lastSel) {	ctx.strokeStyle = "#cc0000";	}								// Previous Person: Darker Red Border
			else { ctx.strokeStyle = "black";	}														// Otherwise border is black
			
			ctx.stroke();
			ctx.shadowColor = "#ffffff";
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			
			// Add Text
			ctx.font = pt + "pt Verdana, sans serif";													// Font size / type
			ctx.fillStyle = "#000000"; 																	// Text color
			ctx.textAlign = "center";																	// Text Alignment
			ctx.textBaseline = "middle";																// Baseline of text
			ctx.fillText(fore, x + w/2, y + h/3);														// Text and position of text in shape
			ctx.fillText(a.NAME.SURN, x + w/2, y + h*2/3);													// Text and position of text in shape				
		
			if (this.mouseOver) {
				if (a.GEND == "M") {																	// Check Gender - If male
					grd2.addColorStop(0.0, "#aaffff"); 													// 	dark blue
					grd2.addColorStop(0.3, "#00aaff"); 													// 	light blue
					grd2.addColorStop(0.3, "#aaffff"); 													// 	light blue
					grd2.addColorStop(1.0, "#00aaff"); 													// 	light blue
				} else if (a.GEND == "F") {														// If female
					grd2.addColorStop(0.0, "#ffcccc"); 													//  red
					grd2.addColorStop(0.3, "#ff0000"); 													//  red
					grd2.addColorStop(0.3, "#ffcccc"); 													//  red
					grd2.addColorStop(1.0, "#ff3333"); 													//  pink
				} else  {																				// If Unknown
					grd2.addColorStop(0.0, "#eeeeee"); 													//  grey
					grd2.addColorStop(0.3, "#cccccc"); 													//  light grey
					grd2.addColorStop(0.3, "#aaaaaa"); 													//  grey
					grd2.addColorStop(1.0, "#ffffff"); 													//  light grey
				}//if
			
				ctx.shadowColor = "transparent";
				ctx.fillStyle = grd2;
				
				if (a.ID == curSel) {	ctx.strokeStyle = "#ff0000";	}								// Selected Node = Red Border
				else if (a.ID == lastSel) {	ctx.strokeStyle = "#cc0000";	}							// Previous Person: Darker Red Border
				else { ctx.strokeStyle = "black";	}													// Otherwise border is black
			
				ctx.fill();
				ctx.stroke();
				
				if (a._PRIV == 'Y') {
					ctx.drawImage(lock, x + w/2 - 34, y + h/2 - 12);	
					ctx.drawImage(icon16,x-4,y-4);						// Draw Icon
					ctx.font = "bold " +(pt-5) + "pt Verdana, sans serif";									// Font size / type
					ctx.fillStyle = "#000000"; 																// Text color
					ctx.textAlign = "center";																// Text Alignment
					ctx.textBaseline = "middle";															// Baseline of text
					ctx.fillText(a.NAME.GIVN[0], x + w/2, y + h/7);
					ctx.font = "bold " +(pt-2) + "pt Verdana, sans serif";									// Font size / type
					ctx.fillText("LOCKED", x + w/2, y + h*6/7);
					return;
				}//if
				
				// Add Text
				ctx.font = "bold " +(pt-5) + "pt Verdana, sans serif";									// Font size / type
				ctx.fillStyle = "#000000"; 																// Text color
				ctx.textAlign = "center";																// Text Alignment
				ctx.textBaseline = "middle";															// Baseline of text
				if (a.AGE == '?') {	ctx.fillText(a.NAME.GIVN[0], x + w/2, y + h/7);	}
				else { ctx.fillText(a.NAME.GIVN[0]+" ("+a.AGE +")", x + w/2, y + h/7);	}
				
				ctx.font = (pt-5) + "pt Verdana, sans serif";											// Font size / type
				ctx.fillText("Born:", x + w/6, y + h*3/7);												// Text and position of text in shape
				if (!a.ALIVE) { ctx.fillText("Died:", x + w/6, y + h*5/7);	}							// Text and position of text in shape
				ctx.font = "italic " +(pt-5) + "pt Verdana, sans serif";
				
				if (a.BIRTH.DATE[0] == '') {	var birth = a.BIRTH.DATE[1]+' '+a.BIRTH.DATE[2]+' '+a.BIRTH.DATE[3];
				} else { var birth = '~'+a.BIRTH.DATE[1]+' '+a.BIRTH.DATE[2]+' '+a.BIRTH.DATE[3];	}
				
				ctx.fillText(birth, x + w*2/3, y + h*3/7);			
				if (!a.ALIVE) {
					if (a.DEATH.DATE[0] == '') { var death = a.DEATH.DATE[1]+' '+a.DEATH.DATE[2] +' '+a.DEATH.DATE[3];
					} else { var death = '~'+a.DEATH.DATE[1]+' '+a.DEATH.DATE[2] +' '+a.DEATH.DATE[3]; }
					ctx.fillText(death, x + w*2/3, y + h*5/7); 
				}//if
			}//if
			
			if (a.ALIVE || a._PRIV == 'Y') {																// If the person is alive
				ctx.drawImage(icon16,x-4,y-4);		// Draw Icon
			}//if
		}//else
	}//Shape.prototype.draw
	
	
	// ConnectorA is the type that connects parents to children
	ConnectorA.prototype.draw = function(ctx) {	
		var x = this.parent.x + this.parent.w /2;
		var y = this.parent.y + this.parent.h;
		var x2 = this.child.x + this.child.w /2;
		var y2 = this.child.y;
		var w = x2 - x;
		var h = y2 - y;
		
		ctx.beginPath();																				// Begin the line
		ctx.moveTo(x, y);																		// ...
		ctx.lineTo(x, y + h * 3 / 4);														// ...
		ctx.lineTo(x + w, y + h * 3 / 4);												// ...
		ctx.lineTo(x + w, y + h);													// DO NOT closePath as this connects it back to the start
	
		ctx.shadowColor = "transparent";	
		ctx.lineWidth = 2;																				// Line properties
		ctx.strokeStyle = "black";
		ctx.stroke();
	}//ConnectorA.prototype.draw

	
	// ConnectorB is the type that connects spouses
	ConnectorB.prototype.draw = function(ctx) {	
		this.x = this.husb.x + this.husb.w;			
		this.y = this.husb.y + this.husb.h /2;
		this.w = this.wife.x - this.x; 
		var x = this.x; var y = this.y; var w = this.w; var h = this.h; var mouseOver = this.mouseOver;
		
		ctx.beginPath();																					// Begin the line
		ctx.moveTo(x, y);			
		ctx.lineTo(x + w, y);																			// ...
		ctx.moveTo(x, y + 4);	
		ctx.lineTo(x + w, y + 4);
		
		ctx.shadowColor = "transparent";	
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;	
		
		
		if (mouseOver) {
			ctx.shadowColor = "#ffff00";
			ctx.shadowBlur = 10;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
		}//if MouseOver
		ctx.stroke();
		
		if (Multiplier > -8) {
			ctx.clearRect(x + w/2 - 9, y - 5, 19, 15); 
			ctx.font = "bold 12pt Verdana, sans serif";
			ctx.fillStyle = "#000000";
			ctx.fillText("M", x + w/2, y + 2);
			this.h = 10;		//Determines where ConnectorAs attach for children
		}//if
		else { this.h = 4;}	//Determines where ConnectorAs attach for children
	}//ConnectorB.prototype.draw
	
	
	// Determine if a point (mouseclick) is inside the shape's bounds
 	Shape.prototype.contains = function(mx, my) {
		return  (this.x <= mx) && (this.x + this.w >= mx) &&											// Make sure the Mouse X,Y falls in the area between ...
				(this.y <= my) && (this.y + this.h >= my);												// the shape's X and (X + Height) and its Y and (Y + Height)
	}//Shape.prototype.contains

	// Determine if a point (mouseclick) is inside the shape's bounds
 	ConnectorB.prototype.contains = function(mx, my) {
		return  (this.x <= mx) && (this.x + this.w >= mx) &&											// Make sure the Mouse X,Y falls in the area between ...
				(this.y -20 <= my) && (this.y + 20 >= my);												// the shape's X and (X + Height) and its Y and (Y + Height)
	}//Shape.prototype.contains
	
	
	//This is the main canvas on which most of the procedures occur!
	function Tree(canvas) {
		this.canvas = canvas;																			// **** First some setup! ****
			canvas.width = winW;																		// Apply Width
			canvas.height = winH;																		// Apply Height
		this.width = canvas.width;																		// 'this' is the current state
		this.height = canvas.height;
		this.ctx = canvas.getContext('2d');																// Load the context
		
		// This complicates things a little but but fixes mouse co-ordinate problems
		// when there's a border or padding. See getMouse for more detail
		var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
		if (document.defaultView && document.defaultView.getComputedStyle) {
			this.stylePaddingLeft = parseFloat(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
			this.stylePaddingTop  = parseFloat(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
			this.styleBorderLeft  = parseFloat(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
			this.styleBorderTop   = parseFloat(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
		} // if

		var html = document.body.parentNode;															// Some pages have fixed-position bars (like the 
		this.htmlTop = html.offsetTop;																	// stumbleupon bar) at the top or left of the page
		this.htmlLeft = html.offsetLeft;																// They will mess up mouse coordinates and this fixes that

		// **** Keep track of state! ****
		this.valid = false; 																			// When set to false, the canvas will redraw everything
		this.shapes = [];  																				// The array of shapes to be drawn
		this.ConnectorAs = []; 																			// The array of ConnectorAs to be drawn
		this.ConnectorBs = []; 																			// The array of ConnectorBs to be drawn
		this.dragging = false; 																			// Keep track of when we are dragging
		this.dragoffx = []; 																			// See mousedown and mousemove events for explanation
		this.dragoffy = [];
		this.conAdragoffx = []; 																		// See mousedown and mousemove events for explanation
		this.conAdragoffy = [];
		this.conBdragoffx = []; 																		// See mousedown and mousemove events for explanation
		this.conBdragoffy = [];
		this.Sc = 1;																						// Scale Coefficient
		// **** Then events! ****
	  
		// This is an example of a closure!
		// Right here "this" means the Tree. But we are making events on the Canvas itself,
		// and when the events are fired on the canvas the variable "this" is going to mean the canvas!
		// Since we still want to use this particular Tree in the events we have to save a reference to it.
		// This is our reference!
		var myState = this;
	  
		//fixes a problem where double clicking causes text to get selected on the canvas
		canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
		
		canvas.addEventListener('click', function(e) {
			var mouse = myState.getMouse(e);															// Get mouse information - see getMouse procedure
			var shapes = myState.shapes;																// Get array of shapes
			var conB = myState.ConnectorBs;
			var mx = mouse.x;																			// Get mouse x-position
			var my = mouse.y;																			// Get mouse y-position
			var l = shapes.length;																		// Number of shapes in array
			var lA = myState.ConnectorAs.length;
			var lB = myState.ConnectorBs.length;
			
			for (var i = 0; i <= l-1; i++) {
				if (shapes[i] && shapes[i].contains(mx, my) && (shapes[i].id == 'NewFather' || shapes[i].id == 'NewMother' || shapes[i].id == 'NewChild')) {									// Does shapes[i] exist?  & is the mouse inside it?
					if (shapes[i].id == 'NewFather'){
						var a = 'father';
						var b = 'NewFather';
					} else if (shapes[i].id == 'NewMother'){
						var a = 'mother';
						var b = 'NewMother';
					}//if
					smoke.confirm("Do you wish to add the " + a + " of this person", function(e){
						if (e){
							var id = addPerson(a, shapes[0].id);
						}
					}, {ok: "Yes",cancel: "No", reverseButtons:true});
					break;
				}//if
			}//for
			for (var i = 0; i <= lB-1; i++) {															// For each shape                      
				if (conB[i].contains(mx, my)) {															// Check if shape was clicked on	
					layerInfo.type = "marriage";														// Set up for Marriage
					layerInfo.ID = conB[i].id;
					layerInfo.visible = true;             												// Make it visible
				}//if
			}//for
		}, true);//Click
	
		// Dblclick is for displaying the famaily of the selected node
		canvas.addEventListener('dblclick', function(e) {												// When a button is pressed "down" do this...
			var mouse = myState.getMouse(e);															// Get mouse information - see getMouse procedure
			var shapes = myState.shapes;																// Get array of shapes
			var ConnectorAs = myState.ConnectorAs;														// Get array of ConnectorAs
			var ConnectorBs = myState.ConnectorBs;														// Get array of ConnectorBs
			var mx = mouse.x;																			// Get mouse x-position
			var my = mouse.y;																			// Get mouse y-position
			var l = shapes.length;																		// Number of shapes in array
			var lA = ConnectorAs.length;																// Number of ConnectorAs in array
			var lB = ConnectorBs.length;																// Number of ConnectorAs in array
			var Sc = myState.Sc;
			
		//	if (Multiplier == 0) 		{ myState.Sc = 1;   						}							// If Multiplier is 0 then scale is 100%
		//	else if (Multiplier > 0) 	{ myState.Sc = Math.pow(1.1, Multiplier)	}							// If it's greater than 0 then scale UP
		//	else						{ myState.Sc = Math.pow(10/11,0-Multiplier) };							// If it's smaller than 0 then scale DOWN
			
			hide(['tooltip']);
			
			//Function to draw family
			for (var i = 0; i <= l-1; i++) {
				if (shapes[i] && shapes[i].contains(mx, my)) {									// Does shapes[i] exist?  & is the mouse inside it?
					
					refreshTree(myState, i);
					
				} //if
			}//for
			
			localStorage.setItem('id', shapes[0].id);					// Store the current node
			myState.valid = false;
		}, true); //EventListener dblclick

		/**   Start Dragging - Mousemove and Touchmove    **/
		canvas.addEventListener('mousedown', function(e) {
			var input = myState.getMouse(e);										// Get mouse information - see getMouse procedure
			StartDragging(input, myState);											// Modular dragging function
			if( e.which == 2 ) {
				e.preventDefault();
			}//if
		}, true); //Eventlistener MouseDown
		
		canvas.addEventListener('touchstart', function(e) {
			if (e.targetTouches.length == 1) {									// If there is only one finger dragging
				var input = e.targetTouches[0];									// Store finger state
				StartDragging(input, myState);										// Modular dragging function
			}//if
		}, true); //Eventlistener MouseDown
		/****************************************************/
		
		/**        Dragging - Mousemove and Touchmove      **/
		canvas.addEventListener('mousemove', function(e) {							// Mouse is moved
			var input = myState.getMouse(e);										// Store Mouse state
			MouseOverCanvas(input, myState);											// Go to modular dragging function
		}, true); //Eventlistener MouseDown
		
		canvas.addEventListener('touchmove', function(e) {							// Touchscreen finger move
			if (e.targetTouches.length == 1) {									// If there is only one finger dragging
				var input = e.targetTouches[0];									// Store finger state
				MouseOverCanvas(input, myState);										// Modular dragging function
			}//if
		}, true); //Eventlistener TouchMove
		/****************************************************/

		/** Stop Dragging - Mouseup, mouseout and touchend **/
		canvas.addEventListener('mouseup', function(e) {							// Left-mouse is released
			myState.dragging = false;												// Stop dragging
		}, true); // EventListener MouseUp
		canvas.addEventListener('mouseout', function(e) {							// Mouse leaves area
			myState.dragging = false;												// Stop dragging
			hide(['tooltip']);
		}, true); // EventListener MouseOut
		canvas.addEventListener('touchend', function(e) {							// Finger removed from touchscreen
			myState.dragging = false;												// Stop dragging
		}, true); // EventListener MouseUp
		/****************************************************/
		
		
		// Right Click displays the "InfoLayer" canvas
		canvas.addEventListener('contextmenu', function(e) {
			var mouse = myState.getMouse(e);															// Get mouse properties - see getMouse
			var shapes = myState.shapes;																// Get array of shapes
			var conB = myState.ConnectorBs;
			var mx = mouse.x;																			// Get mouse x-position
			var my = mouse.y;																			// Get mouse y-position
			var l = shapes.length;																		// Number of shapes in array
			var lB = conB.length;
			
			hide(['infoBox', 'info_CLOSE']);
			layerInfo.visible = false;																	// Set infoLayer to false regardless
			
			for (var i = 0; i <= l-1; i++) {															// For each shape                      
				if (shapes[i].contains(mx, my)) {														// Check if shape was clicked on		
					layerInfo.type = "person";															// Set layerInfo up for a person
					layerInfo.ID = shapes[i].id;													// Pass the shapes ID to the infoLayer
					layerInfo.visible = true;             												// Make it visible
				}//if
			}//for
			
			for (var i = 0; i <= lB-1; i++) {															// For each shape                      
				if (conB[i].contains(mx, my)) {															// Check if shape was clicked on	
					layerInfo.type = "marriage";														// Set up for Marriage
					layerInfo.ID = conB[i].id;
					layerInfo.visible = true;             												// Make it visible
				}//if
			}//for

			layerInfo.valid = false;		layerInfo.draw();											// Redraw the infoLayer
		}, true);  // EventListener contextmenu
		
		// Scrolling the mouse changes scale of objects (Zoom)
		canvas.addEventListener('mousewheel', function (event){
			var wheel = event.wheelDelta;																// Returns +120/-120 if scroll up/down			
			if (wheel > 0 && Multiplier < 10) {															// If wheel is positive (+120) then...
				Scale *= 1.1;																			// Increase the scale of current objects
				Multiplier ++;																			// Increase the scale multiplier
				if 		(Multiplier > 0) 	{ pt += 2; }
				else if (Multiplier <= 0) 	{ pt ++; }
			}//if
			else if (wheel < 0 && Multiplier > -14){													// If wheel is negative (-120) then...
				Scale /= 1.1;																			// Decrease the scale of current objects
				Multiplier --;																			// Decrease the scale multiplier
				if 		(Multiplier < 0) 	{ pt --; }
				else if (Multiplier >= 0) 	{ pt -= 2; }
			}//if
			
			if 		(Multiplier >= 10) 	{ pt = 38;	}													// Point Size upper-cap at 38pt
			else if (Multiplier == -12)	{ pt = 6;	}
			else if (Multiplier < -12)	{ pt = 0;	}													// Point Size drops to 0 if zoomed out far
			
			if (Multiplier == 0) 		{ myState.Sc = 1;   						}							// If Multiplier is 0 then scale is 100%
			else if (Multiplier > 0) 	{ myState.Sc = Math.pow(1.1, Multiplier)	}							// If it's greater than 0 then scale UP
			else						{ myState.Sc = Math.pow(10/11,0-Multiplier) };							// If it's smaller than 0 then scale DOWN
			
			myState.valid = false;																		// Redraw the canvas
		}, true); //EventListener Mousewheel
		
		// Scrolling the mouse changes scale of objects (Zoom) --- Different Event for Firefox!
		canvas.addEventListener('DOMMouseScroll', function (event){
			var wheel = -40 * event.detail;
			if (wheel > 0 && Multiplier < 10) {															// If wheel is positive (+120) then...
				Scale *= 1.1;																			// Increase the scale of current objects
				Multiplier ++;																			// Increase the scale multiplier
				if 		(Multiplier > 0) 	{ pt += 2; }
				else if (Multiplier <= 0) 	{ pt ++; }
			}//if
			else if (wheel < 0 && Multiplier > -14){													// If wheel is negative (-120) then...
				Scale /= 1.1;																			// Decrease the scale of current objects
				Multiplier --;																			// Decrease the scale multiplier
				if 		(Multiplier < 0) 	{ pt --; }
				else if (Multiplier >= 0) 	{ pt -= 2; }
			}//if
			
			if 		(Multiplier >= 10) 	{ pt = 38;	}													// Point Size upper-cap at 38pt
			else if (Multiplier == -12)	{ pt = 6;	}
			else if (Multiplier < -12)	{ pt = 0;	}													// Point Size drops to 0 if zoomed out far
			
			if (Multiplier == 0) 		{ myState.Sc = 1;   						}							// If Multiplier is 0 then scale is 100%
			else if (Multiplier > 0) 	{ myState.Sc = Math.pow(1.1, Multiplier)	}							// If it's greater than 0 then scale UP
			else						{ myState.Sc = Math.pow(10/11,0-Multiplier) };							// If it's smaller than 0 then scale DOWN
			
			myState.valid = false;																		// Redraw the canvas
		}, true); //EventListener Mousewheel
	   
		// **** Options! ****
		this.interval = 25;																				// Sets Interval at which to redraw the canvas - ms
		setInterval(function() { myState.draw(); }, myState.interval);									// Lower interval = smoother movement, higher CPU usage
	} //Canvas State
	
	// Adds the shapes to the canvas
	Tree.prototype.addShape = function(shape) {
		this.shapes.push(shape);																		// Add shape to array of shapes
		this.valid = false;																				// Redraw canvas
	} //Tree.Prototype.addShape
	
	// Adds the ConnectorA to the canvas
	Tree.prototype.addConnectorA = function(ConnectorA) {
		this.ConnectorAs.push(ConnectorA);																// Add ConnectorA to array of ConnectorAs
		this.valid = false;																				// Redraw canvas
	}//Tree.Prototype.addConnectorA

	// Adds the ConnectorB to the canvas
	Tree.prototype.addConnectorB = function(ConnectorB) {
		this.ConnectorBs.push(ConnectorB);																// Add ConnectorB to array of ConnectorAs
		this.valid = false;																				// Redraw canvas
	}//Tree.Prototype.addConnectorB
	
	// Clears the canvas
	Tree.prototype.clear = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	} //Tree.prototype.Clear

	
	// While draw is called as often as the INTERVAL variable demands,
	// It only ever does something if the canvas gets invalidated by our code
	Tree.prototype.draw = function() {		
		getDisplaySize();																				// Check the display size for changes
		if (this.height != winH || this.width != winW) {												// If display size changed
			this.canvas.height = winH;		this.height = winH;											// Change canvas size to fit
			this.canvas.width  = winW;		this.width  = winW;
			this.valid = false;																			// Redraw the canvas
		}//if
		
		// if our state is invalid, redraw and validate!
		if (!this.valid) {
			var ctx = this.ctx;
			var shapes = this.shapes;
			var ConnectorAs = this.ConnectorAs;
			var ConnectorBs = this.ConnectorBs;
			
			this.clear();
			
			// draw all shapes
			var l = shapes.length;
			for (var i=0; i<l; i++) {
				shapes[i].draw(ctx);
			}//for
			
			var l = ConnectorBs.length;
			if (!l==0){
				for (var i=0; i<l; i++) {
					ConnectorBs[i].draw(ctx);
				} //for
			}//if
			
			var l = ConnectorAs.length;
			if (l!=0){
				for (var i=0; i<l; i++) {
					ConnectorAs[i].draw(ctx);
				} //for
			}//if		

			drawScale();																				// Draw the scale canvas with correct scale
			
			this.valid = true;
			Scale = 1;
		} //if
	} //Tree
	
	
	// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
	// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
	Tree.prototype.getMouse = function(e) {
	  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	  
	  // Compute the total offset
	  if (element.offsetParent !== undefined) {
		do {
		  offsetX += element.offsetLeft;
		  offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	  }

	  // Add padding and border style widths to offset
	  // Also add the <html> offsets in case there's a position:fixed bar
	  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

	  mx = e.pageX - offsetX;
	  my = e.pageY - offsetY;
	  
	  // We return a simple javascript object (a hash) with x and y defined
	  return {x: mx, y: my};
	}

	function MouseOverCanvas(input, myState){																// Get mouse properties - see getMouse
		var shapes = myState.shapes;																// Get array of shapes
		var ConnectorAs = myState.ConnectorAs;														// Get array of ConnectorAs
		var ConnectorBs = myState.ConnectorBs;														// Get array of ConnectorBs																			// Get mouse y-position
		var l = shapes.length;																		// Number of shapes in array
		var lA = ConnectorAs.length;																// Number of ConnectorAs in array
		var lB = ConnectorBs.length;																// Number of ConnectorBs in array

		if (myState.dragging){																		//If the user is dragging, do this...
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			for (var i = 0; i <= l-1; i++) {														// For each of the shapes...
				myState.shapes[i].x = input.x - myState.dragoffx[i];								// Move shape to position taking offset into account
				myState.shapes[i].y = input.y - myState.dragoffy[i]; 	
			}//for
			for (var i = 0; i <= lA-1; i++) {														// For each ConnectorA
				myState.ConnectorAs[i].x = input.x - myState.conAdragoffx[i];						// Move ConnectorA to position taking offset into account
				myState.ConnectorAs[i].y = input.y - myState.conAdragoffy[i]; 					
			}//for
			for (var i = 0; i <= lB-1; i++) {														// For each ConnectorA
				myState.ConnectorBs[i].x = input.x - myState.conBdragoffx[i];						// Move ConnectorB to position taking offset into account
				myState.ConnectorBs[i].y = input.y - myState.conBdragoffy[i]; 					
			}//for
			myState.valid = false; 																	// Redraw canvas
			
			//Function to AutoHide the infolayer
			if (AutoHideOn == 1){
				var info1 = document.getElementById("infoCanvas");
				var info2 = document.getElementById("infoBox");
				var info3 = document.getElementById("info_CLOSE");
				if (info1.className=="show") { info1.className="autohide"; info2.className="autohide"; info3.className="autohide"; }
			}//If AutohideOn == 1
			
			if (document.getElementById('Hover_2').className == "show"){
				hide(['Hover_2','Hover_1','Hover_MENU']);																//Hide Menu icon if shown
			}//if

			hide(['tooltip']);
		} //if myState.dragging
		else {
			for (var i = 0; i <= l-1; i++) {
				if (shapes[i] && shapes[i].contains(input.x, input.y)) {
					for (var j = 0; j <= l-1; j++) {	shapes[j].mouseOver = false;	}			//MouseOver of all shapes = false
					shapes[i].mouseOver = true;															//Mouseover of this shape = true
					showTooltip(28);																			//Show tooltip for mouseover
					displayHoverIcons(i);																	//Displays icons for person
					if (document.getElementById('Hover_MENU').className == "show"){
						hide(['Hover_MENU']);
					}//if
					break;																						// End for loop
				} else {
					shapes[i].mouseOver = false;															//Mouseover of this shape = false
					if (document.getElementById('Hover_2').className == "show"){
						hide(['Hover_2','Hover_1','Hover_MENU']);																//Hide Menu icon if shown
					}//if
					hide(['tooltip']);																				//Hide Mouseover tooltip
				}//if..else..
			}//for
			
			for (var i = 0; i <= lB-1; i++) {
				if (ConnectorBs[i] && ConnectorBs[i].contains(input.x, input.y)) {
					for (var j = 0; j <= lB-1; j++) {	ConnectorBs[j].mouseOver = false;	}
					ConnectorBs[i].mouseOver = true;
					showTooltip(29);
					break;
				} else {
					ConnectorBs[i].mouseOver = false;
				}//if..else..
			}//for
			myState.valid = false;
		}//else
	}//DraggingCanvas
	
	function StartDragging(input, myState){
		var shapes = myState.shapes;																// Get updated array
		var ConnectorAs = myState.ConnectorAs;														// Get updated array
		var ConnectorBs = myState.ConnectorBs;														// Get updated array
		var l = shapes.length;																		// Get number of shapes in array
		var lA = ConnectorAs.length;																// Get number of ConnectorAs in array
		var lB = ConnectorBs.length;																// Get number of ConnectorAs in array
		//Shapes				
		for (var i = 0; i <= l-1; i++) {															// For all of the shapes...
			myState.dragoffx[i] = input.x - shapes[i].x;											// ...Keep track of where in the object we clicked
			myState.dragoffy[i] = input.y - shapes[i].y;											// ...so we can move it smoothly (see mousemove)
		}//for
		//DRAGGING function: ConnectorAs		
		for (var i = 0; i <= lA-1; i++) {															// For all of the ConnectorAs...
			myState.conAdragoffx[i] = input.x - ConnectorAs[i].x;									// ...Keep track of where in the object we clicked
			myState.conAdragoffy[i] = input.y - ConnectorAs[i].y;									// ...so we can move it smoothly (see mousemove)
		}//for
		//DRAGGING function: ConnectorBs		
		for (var i = 0; i <= lB-1; i++) {															// For all of the ConnectorAs...
			myState.conBdragoffx[i] = input.x - ConnectorBs[i].x;									// ...Keep track of where in the object we clicked
			myState.conBdragoffy[i] = input.y - ConnectorBs[i].y;									// ...so we can move it smoothly (see mousemove)
		}//for
		myState.dragging = true;																	// Set Dragging to true
		myState.valid = false;																		// Redraw canvas
	}//StartDragging
	
	function ZoomIn(){
		if (Multiplier < 10) {																	// If wheel is positive (+120) then...
			Scale *= 1.1;																			// Increase the scale of current objects
			Multiplier ++;																			// Increase the scale multiplier
			if 		(Multiplier > 0) 	{ pt += 2; }
			else if (Multiplier <= 0) 	{ pt ++; }
		}//if
		
		if 		(Multiplier >= 10) 	{ pt = 38;	}													// Point Size upper-cap at 38pt
		else if (Multiplier == -12)	{ pt = 6;	}
		else if (Multiplier < -12)	{ pt = 0;	}													// Point Size drops to 0 if zoomed out far
		
		layerTree.valid = false;																		// Redraw the canvas
	}//ZoomIn
	
	function ZoomOut(){
		if (Multiplier > -14){																	// If wheel is negative (-120) then...
			Scale /= 1.1;																			// Decrease the scale of current objects
			Multiplier --;																			// Decrease the scale multiplier
			if 		(Multiplier < 0) 	{ pt --; }
			else if (Multiplier >= 0) 	{ pt -= 2; }
		}//if
		
		if 		(Multiplier >= 10) 	{ pt = 38;	}													// Point Size upper-cap at 38pt
		else if (Multiplier == -12)	{ pt = 6;	}
		else if (Multiplier < -12)	{ pt = 0;	}													// Point Size drops to 0 if zoomed out far
		
		layerTree.valid = false;																		// Redraw the canvas
	}//ZoomIn
	
// Function to draw the spouse of the root node
	function drawSpouse(spouse, children, myState, root, FamID) {
		var Sc = myState.Sc;
		var spouseX;

		if (People[parseFloat(root.id)-1].GEND == "M") { 															// If clicked male, position female on right
			var husbID = root.id;
			var wifeID = spouse;
			spouseX = root.x + Sc*250;															//  Position of Spouse (Right)
		} else { 																				// If clicked female, position male on left
			var husbID = spouse;
			var wifeID = root.id;
			spouseX = root.x - Sc*250; 															//  Position of Spouse (Left)
		}//else
		
		if (!spouse) {																		// If there is no known spouse	
			drawChildren(children, myState, root.x, root.y, root.x, root, FamID, false);					// Draw the Children
		} else {
			myState.addShape(new Shape(spouseX, root.y, spouse));			//  Draw spouse
			
			myState.addConnectorB(new ConnectorB(husbID, wifeID, FamID));			// Draw a connector
			
			drawChildren(children, myState, root.x, root.y, spouseX, root, FamID, false);				// Draw the Children
		}//if..else..
	}//drawSpouse
	
	
// Function to draw the children of the root node
	function drawChildren(children, myState, rootX, rootY, spouseX, root, FamID, siblings) {
		var createID, childID, childX, childY, startX, startY, endX, endY;
		var shapes = myState.shapes;
		var Sc = myState.Sc;
		
		if (rootX == spouseX) { 	//i.e. only one parent
			var parentID = root.id;
			var B_Type = false;
		} else {
			var parentID = FamID;
			var B_Type = true;
		}//rootX == spouseX
		
		if (!siblings) {																						// If not drawing siblings
			childX = (rootX + spouseX)/2 - (children-1)*Sc*200/2;									// Center children
			childY = rootY + Sc*140;																		// Move below root node
			for (var c=0; c<children; c++) {															
				createID = 'Family[FamID].CHIL[' + (c) + ']';										// Creates reference i.e .child1 .child2 etc
				childID = eval(createID);																	// Uses the string as a variable to find the ID
				myState.addShape(new Shape(childX, childY, childID));								// Draw one child at a time
				myState.addConnectorA(new ConnectorA(parentID, childID, B_Type));				// Draw ConnectorA

				childX += Sc*200;																				// Change x-position for next child
				myState.valid = false;																		// Redraw canvas
			}//for
		} else {
			var childPos;									
			
			for (var i=0; i<Family[FamID].CHIL.length; i++) {
				if (Family[FamID].CHIL[i] == shapes[0].id) {
					childPos = i;
				}//if
			}//for
			
			if (People[parseFloat(shapes[0].id)-1].GEND == 'M') {
				childX = (rootX + spouseX)/2 - Sc*200;												// Center children
			} else {
				childX = (rootX + spouseX)/2 - Sc*450;
			}
				
			childY = rootY + Sc*140;															// Move below root node
			if (childPos > 0){
				for (var c=childPos - 1; c>=0; c--) {											// Get number of children and count up
					createID = 'Family[FamID].CHIL[' + (c) + ']';									// Creates reference i.e .child1 .child2 etc
					childID = eval(createID);													// Uses the string as a variable to find the ID

					myState.addShape(new Shape(childX, childY, childID));		// Draw one child at a time
					myState.addConnectorA(new ConnectorA(parentID, childID, B_Type));			// Draw ConnectorA
				
					childX -= Sc*200;															// Change x-position for next child
					myState.valid = false;														// Redraw canvas
				}//for
			}//if
			
			if (People[parseFloat(shapes[0].id)-1].GEND == 'M') {
				childX = (rootX + spouseX)/2 + Sc*450;												// Center children
			} else {
				childX = (rootX + spouseX)/2 + Sc*200;
			}
			
			for (var c=childPos + 1; c<children; c++) {											// Get number of children and count up
				createID = 'Family[FamID].CHIL[' + (c) + ']';										// Creates reference i.e .child1 .child2 etc
				childID = eval(createID);														// Uses the string as a variable to find the ID

				myState.addShape(new Shape(childX, childY, childID));			// Draw one child at a time
				myState.addConnectorA(new ConnectorA(parentID, childID, B_Type));				// Draw ConnectorA
			
				childX += Sc*200;																// Change x-position for next child
				myState.valid = false;															// Redraw canvas
			}//for
		}//if..else..
	}//drawChildren

	// Function to draw the parents of the root node (repeats for great/grandparents)
	function drawParents(myState, childID, GenCnt) {
		var father, mother, child, z;
		var Sc = myState.Sc;
		
		for (var j in myState.shapes) {
			if (childID == myState.shapes[j].id) {
				child = myState.shapes[j];	
			}//if
		}//for
		if (!child) { return; }		// Stop if no child found
		
		var FamID = parseFloat(People[parseFloat(childID)-1].FAMC)-1;
		
		if (FamID || FamID == 0){			
			father = Family[FamID].HUSB || null;
			mother = Family[FamID].WIFE || null;
		}//FamID exists
		
		if (!father && !mother) {	
			if (GenCnt == 2) {
				noFather(myState, child);	
				noMother(myState, child);				
			}//if
		} else if (!father && mother) {
			if (GenCnt == 2) {
				noFather(myState, child);
			}//if
			var motherX = child.x + Sc * 130; 																		//  Position of Mother
			var motherY = child.y - Sc * 140;
				myState.addShape(new Shape(motherX, motherY, mother));					// Draw one child at a time
				myState.addConnectorA(new ConnectorA(mother, childID, false));		// Draw a connector
		} else if (!mother && father) {
			if (GenCnt == 2) {
				noMother(myState, child); 
			}//if
			var fatherX = child.x - Sc * 130; 																		//  Position of Mother
			var fatherY = child.y - Sc * 140;
				myState.addShape(new Shape(fatherX, fatherY, father));					// Draw one child at a time
				myState.addConnectorA(new ConnectorA(father, childID, false));		// Draw a connector
		}  else {
			GenCnt ++;
			var val = getPosValues(GenCnt);
			var rel_x = val[0], rel_y = val[1], con_rel_x = val[2], con_rel_y = val[3], con_w = val[4];
			
			// Does the root node have grandparents?  Set to false and test
			var g_1 = false, g_2 = false;
			
			if (People[parseFloat(father)-1].FAMC != "") { g_1 = true; }
			if (People[parseFloat(mother)-1].FAMC != "") { g_2 = true; }
			
		//	smoke.alert(g_1 + ' ' + g_2);
		//	if (!g_1 || !g_2) {
		//		rel_x = 130;	rel_y = 140;	con_rel_x = 50;		con_rel_y = 95;		con_w = 80;	
		//	}//if
			
			var startX = child.x + Sc * con_rel_x;
			var startY = child.y - Sc * con_rel_y;													// Y-Start of ConnectorB
			
			var fatherX = child.x - Sc * rel_x;														//  Position of Father
			var fatherY = child.y - Sc * rel_y;
			myState.addShape(new Shape(fatherX, fatherY, father));					// Draw father
			
			var motherX = child.x + Sc * rel_x; 														//  Position of Mother
			var motherY = child.y - Sc * rel_y;
			myState.addShape(new Shape(motherX, motherY, mother));					// Draw mother

			startX = (fatherX + motherX + Sc*180) /2;
			
			myState.addConnectorB(new ConnectorB(father, mother, FamID));			// Draw a connector
			myState.addConnectorA(new ConnectorA(FamID, childID, true));
			
			//Draw Brothers and Sisters of root node
			if (GenCnt == 3) {
				drawChildren(Family[FamID].CHIL.length, myState, fatherX, fatherY, motherX, z, FamID, true);
			}//if
			
			//Continue drawing ancestors
			if (GenCnt < NoGens) {
				drawParents(myState, father, GenCnt);
				drawParents(myState, mother, GenCnt);
			} else {
				GenCnt --;
			}//if..else.. 
			
		}//if..else.. 
		
	}//drawParents
	
	
	function getPosValues(GenCnt){
		var rel_x, rel_y, con_rel_x, con_rel_y, con_w;													// Relative position of parent to child
		switch (NoGens) {
			case 4:	
				switch (GenCnt) {
					case 3:		rel_x = 240;	rel_y = 140;	con_rel_x = -60;	con_rel_y = 95;		con_w = 300;	break;
					case 4:		rel_x = 130;	rel_y = 140;	con_rel_x = 50;	con_rel_y = 95;		con_w = 80;		break;
				}//switch GenCnt
			break;
			case 5: 
				switch (GenCnt) {
					case 3:		rel_x = 500;	rel_y = 140;	con_rel_x = -320;	con_rel_y = 95;		con_w = 820;	break;
					case 4:		rel_x = 240;	rel_y = 140;	con_rel_x = -60;	con_rel_y = 95;		con_w = 300;	break;
					case 5:		rel_x = 130;	rel_y = 140;	con_rel_x = 50;	con_rel_y = 95;		con_w = 80;		break;
				}//switch GenCnt
			break; 
			case 6: 
				switch (GenCnt) {
					case 3:		rel_x = 1000;	rel_y = 140;	con_rel_x = -820;	con_rel_y = 95;		con_w = 1820;	break;
					case 4:		rel_x = 500;	rel_y = 140;	con_rel_x = -320;	con_rel_y = 95;		con_w = 820;	break;
					case 5:		rel_x = 240;	rel_y = 140;	con_rel_x = -60;	con_rel_y = 95;		con_w = 300;	break;
					case 6:		rel_x = 130;	rel_y = 140;	con_rel_x = 50;	con_rel_y = 95;		con_w = 80;		break;
				}//switch GenCnt
			break;
			case 7: 
				switch (GenCnt) {
					case 3:		rel_x = 2000;	rel_y = 140;	con_rel_x = -1820;con_rel_y = 95;		con_w = 3820;	break;
					case 4:		rel_x = 1000;	rel_y = 140;	con_rel_x = -820;	con_rel_y = 95;		con_w = 1820;	break;
					case 5:		rel_x = 500;	rel_y = 140;	con_rel_x = -320;	con_rel_y = 95;		con_w = 820;	break;
					case 6:		rel_x = 240;	rel_y = 140;	con_rel_x = -60;	con_rel_y = 95;		con_w = 300;	break;
					case 7:		rel_x = 130;	rel_y = 140;	con_rel_x = 50;	con_rel_y = 95;		con_w = 80;		break;
				}//switch GenCnt
			break;
			case 8:
				switch (GenCnt) {
					case 3:		rel_x = 4000;	rel_y = 140;	con_rel_x = -3820;con_rel_y = 95;		con_w = 7820;	break;
					case 4:		rel_x = 2000;	rel_y = 140;	con_rel_x = -1820;con_rel_y = 95;		con_w = 3820;	break;
					case 5:		rel_x = 1000;	rel_y = 140;	con_rel_x = -820;	con_rel_y = 95;		con_w = 1820;	break;
					case 6:		rel_x = 500;	rel_y = 140;	con_rel_x = -320;	con_rel_y = 95;		con_w = 820;	break;
					case 7:		rel_x = 240;	rel_y = 140;	con_rel_x = -60;	con_rel_y = 95;		con_w = 300;	break;
					case 8:		rel_x = 130;	rel_y = 140;	con_rel_x = 50;	con_rel_y = 95;		con_w = 80;		break;
				}//switch GenCnt
			break;
		}//Switch NoGens
		
		return [rel_x, rel_y, con_rel_x, con_rel_y, con_w];
	}//getPosValues


	
	/** Functions for Adding New Individuals **/
	
	function noFather(myState, child){
		var Sc = myState.Sc;
		var fatherX = child.x - Sc * 130; 																		//  Position of Mother
		var fatherY = child.y - Sc * 140;
		
		myState.addShape(new Shape(fatherX, fatherY, 'NewFather'));					// Draw one child at a time
		myState.addConnectorA(new ConnectorA('NewFather', child.id, false));		// Draw a connector
	}//noParents
	
	function noMother(myState, child){
		var Sc = myState.Sc;
		var motherX = child.x + Sc * 130; 																		//  Position of Mother
		var motherY = child.y - Sc * 140;
		
		myState.addShape(new Shape(motherX, motherY, 'NewMother'));					// Draw one child at a time
		myState.addConnectorA(new ConnectorA('NewMother', child.id, false));		// Draw a connector
	}//noParents
	
	function noNodeShape(ctx,x,y,w,h,z,mouseOver) {
		var grd = ctx.createLinearGradient(x, y, x, y + h), grd2 = ctx.createLinearGradient(x, y, x, y + h);								

		drawRoundedRectangle(ctx,x,y,w,h,15);																		// Finish the outline of the shape
		
		// Box Colour
		ctx.fillStyle = grd;
		ctx.lineWidth = 2;																			// Set properties of outline
		ctx.strokeStyle = "rgba(0,0,0,0.6)";													// Otherwise border is black
		ctx.shadowColor = "transparent";
		ctx.stroke();
		
		// Add Text
		ctx.font = pt + "pt Verdana, sans serif";													// Font size / type
		ctx.textAlign = "center";																	// Text Alignment
		ctx.textBaseline = "middle";							// Baseline of text
		
		if (z == 'NewFather') {
			grd.addColorStop(1, "rgba(0,102,255,0.3)"); 														//  light blue
			grd.addColorStop(0, "rgba(0,0,0,0)"); 
			ctx.fill();	
			ctx.fillStyle = "rgba(0,0,0,0.6)";
			ctx.fillText('Add', x + w/2, y + h/3);														// Text and position of text in shape
			ctx.fillText('Father', x + w/2, y + h*2/3);													// Text and position of text in shape				
		} else if (z == 'NewMother') {
			grd.addColorStop(1, "rgba(255,51,51,0.3)"); 														//  light blue
			grd.addColorStop(0, "rgba(0,0,0,0)"); 
			ctx.fill();	
			ctx.fillStyle = "rgba(0,0,0,0.6)";
			ctx.fillText('Add', x + w/2, y + h/3);														// Text and position of text in shape
			ctx.fillText('Mother', x + w/2, y + h*2/3);
		} else {
			grd.addColorStop(1, "rgba(255,255,0,0.3)"); 														//  light blue
			grd.addColorStop(0, "rgba(0,0,0,0)"); 
			ctx.fill();	
			ctx.fillStyle = "rgba(0,0,0,0.6)";
			ctx.fillText('Add', x + w/2, y + h/3);														// Text and position of text in shape
			ctx.fillText('Child', x + w/2, y + h*2/3);
		}
	}//noNodeShape
	
	
	function addPerson(type, ID) {
		var a = BlankPerson();																				//Create a new blank person
		//Create ID
		var n = (People.length + 1) + '';																//Gets the next ID number
		a.ID = n.length >= 5 ? n : new Array(5 - n.length + 1).join('0') + n;				//Creates a 5-digit ID
			
			
		if (type == 'child'){
			var b = Family[parseFloat(ID)-1];																//Get relative
			a.FAMC = b.ID;
			b.CHIL.push(a.ID);
		}//if Child
		else if (type == 'spouse'){}
		else {
			var b = People[parseFloat(ID)-1];																//Get child
		
			//Determine gender
				  if (type == 'mother') { a.GEND = 'F'; }
			else if (type == 'father') { a.GEND = 'M'; };
			
			//Find or Create family
			if (b.FAMC){ 
				a.FAMS.push(b.FAMC); 																				//If a family already exists, add this person
				if (a.GEND == 'M') {Family[parseFloat(a.FAMS)-1].HUSB = a.ID;	}							//Edit Family Entry
				else {Family[parseFloat(a.FAMS)-1].WIFE = a.ID;}
			} else {
				var c = BlankFamily();
				//Create ID
				var n = (Family.length + 1) + '';																//Gets the next ID number
				c.ID = n.length >= 5 ? n : new Array(5 - n.length + 1).join('0') + n;				//Creates a 5-digit ID
				
				if (a.GEND == 'M'){ c.HUSB = a.ID }
				else { c.WIFE = a.ID }
				
				a.FAMS.push(c.ID);
				b.FAMC = c.ID;
				c.CHIL.push(b.ID);
				Family.push(c);
			}//Find or Create family
		}// if
			People.push(a);																						//Add person to array
			refreshTree(layerTree, 0);
			editPerson(a.ID);
	}//addPerson
	
	
	//Function to create a blank person and return it to be filled and added to the array
	function BlankPerson(){
		var obj = new Object();
		var obj_name = new Object();
		var obj_birt = new Object();
		var obj_deat = new Object();
		var obj_buri = new Object();
		
		obj_name = {GIVN:[""], SURN:"", NICK:"", NPFX:"", NSFX:"", SPFX:""};
		obj_birt = {DATE:["","","","","","",""],PLAC:"",NOTE:"",SRC:""};
		obj_deat = {DATE:["","","","","","",""],PLAC:"",CAUS:"",NOTE:"",SRC:"",};
		obj_buri = {DATE:["","","","","","",""],PLAC:"",SRC:""};
		
		obj = {ID:"", GEND:"U", NAME:obj_name, BIRTH:obj_birt , DEATH:obj_deat , BURI:obj_buri, OCCU:[], EDUC:"", RELI:"", FAMS:[], FAMC:"", _PRIV:"", NOTE:""};
		
		return obj;
	}//BlankPerson
	
	//Function to create a blank family and return it to be filled and added to the array
	function BlankFamily(){
		var obj = new Object();
		var obj_marr = new Object();
		var obj_marb = new Object();
		var obj_anul = new Object();
		var obj_enga = new Object();
		var obj_div = new Object();
		
		obj_marr = {DATE:["","","","","","",""], PLAC:"", NOTE:"", SRC:""};
		obj_marb = {DATE:["","","","","","",""], PLAC:"", NOTE:"", SRC:""};
		obj_anul = {DATE:["","","","","","",""], PLAC:"", NOTE:"", SRC:""};
		obj_enga = {DATE:["","","","","","",""], PLAC:"", NOTE:"", SRC:""};
		obj_div = {DATE:["","","","","","",""], PLAC:"", NOTE:"", SRC:""};
		
		obj = {ID:"", HUSB:"", WIFE:"", MARR:obj_marr, MARB:obj_marb, ANUL:obj_anul, ENGA:obj_enga, DIV:obj_div, CHIL:[]};
		
		return obj;
	}//BlankPerson
	
	
	function refreshTree(myState, i){														// Get mouse information - see getMouse procedure
		var shapes = myState.shapes;															// Get array of shapes
		var ConnectorAs = myState.ConnectorAs;
		var ConnectorBs = myState.ConnectorBs;
		var lA = ConnectorAs.length;
		var lB = ConnectorBs.length;
		var z = parseFloat(shapes[i].id) - 1;
		var Sc = myState.Sc;
		
		//Find Family Entry - where node is parent
		if (People[z].FAMS != '') { 
			var FamID = parseFloat(People[z].FAMS[0])-1;											// Get the ID of the node's Family
			var children = Family[FamID].CHIL.length;												// Determine the number of children the selected node has
			if (People[z].ID == Family[FamID].HUSB) { var spouse = Family[FamID].WIFE || null; }		// Is the node the husband or wife?
			else { var spouse = Family[FamID].HUSB; } 										// Spouse is the opposite
		} else { var children = null; var spouse = null; }
		
		
		// Used to set border of previously clicked nodes
		lastSel = curSel; 																	// Set the last node
		curSel = People[z].ID;																// Set the current node
		
		//Remove all nodes except clicked node
		shapes.splice(0,i);																	// Remove shapes up to the clicked node
			l = shapes.length;																// Update l
		if (l != 1) {	shapes.splice(1,l);	 }												// Remove shapes after clicked node
			l = shapes.length;																// Update l
		
		if (!spouse) { shapes[0].x = Math.round(winW/2+0.5) - Sc*100; }
		else if (People[z].GEND == 'M') {	shapes[0].x = Math.round(winW/2+0.5) - Sc*200; }
		else{	shapes[0].x = Math.round(winW/2+0.5) + Sc*50; }
		shapes[0].y = Math.round(winH/2+0.5) + Sc*100;
		
		ConnectorAs.splice(0, lA);	
		ConnectorBs.splice(0, lB);															// Remove all Connectors
		lA = ConnectorAs.length;
		lB = ConnectorBs.length;
		
		drawSpouse(spouse, children, myState, shapes[0], FamID);					//  Draw the spouse
		var GenCnt = 2;
		drawParents(myState, shapes[0].id, GenCnt);
	}//refreshTree
	
	//Display a menu icon on mouseover of person
	function displayHoverIcons(i){
		if (Multiplier < -7){ return; }										//Exit function if zoomed out too far
		var Sc = layerTree.Sc;
		var shape = layerTree.shapes[i];
		
		show(["Hover_1","Hover_2"]);
		
		var icon = document.getElementById('Hover_2');
			icon.setAttribute('style','left:'+(shape.x+shape.w-24)+'px; top:'+(shape.y+shape.h-12)+'px;');
			icon.onclick = function() { 
				if (document.getElementById('Hover_MENU').className == "show"){	hide(["Hover_MENU"]);
				} else { displayMenu(i); };
			};//icon.onclick
		var icon2 = document.getElementById('Hover_1');
			icon2.setAttribute('style','left:'+(shape.x+shape.w-50)+'px; top:'+(shape.y+shape.h-12)+'px;');
			icon2.onclick = function() { layerInfo.type="person";layerInfo.ID=shape.id;layerInfo.visible=true;layerInfo.valid=false;layerInfo.draw(); };
	}//Display Hover Icons
	
	//Display a Menu to Navigate the person's information
	function displayMenu(i){
		var shape = layerTree.shapes[i];
		var a = People[parseFloat(shape.id)-1];
		var b = Family[parseFloat(a.FAMS[0])-1];
		var menu = document.getElementById('Hover_MENU');
		var items = menu.getElementsByTagName('li');
		
		/* Code for 'View Photos' button */
		var photoExists = false;
		for (var i=0, p=photos.length; i<p-1; i++){
			for (var j=0; j<photos[i].WHO.length; j++) {
				if (a.ID == photos[i].WHO[j]) {
					photoExists = true;
					break;
				}//if
			}//for
		}//for
		if (photoExists) {																		//If there are photos of the person
			items[0].onclick = function() { photoGallery(a.ID); };
		} else { items[0].setAttribute('style','display:none'); }					//Otherwise, remove the button
		
		
		/* Code for 'Show Info' button */
		items[1].onclick = function() { 
			layerInfo.type="person";
			layerInfo.ID=shape.id;
			layerInfo.visible=true;
			layerInfo.valid=false;
			layerInfo.draw(); 
		};
		
		
		/* Code for 'Edit Person' Button */
		items[2].onclick = function(){ editPerson(a.ID); }
		
		
		/*Code for 'Add Parent' button */
		items[3].onclick = function() {
			smoke.quiz("Do you wish to add the Mother or Father of this person?", function(e){
				if ("Mother"){ addPerson('mother', a.ID); }//if
				else if ("Father"){ addPerson('father', a.ID); }//if
			}, {button_1: "Mother",button_2: "Father",button_cancel: "Cancel"});
		}//items[2].onclick
		
		
		/* Code for 'Add Spouse' Button */		
		items[4].onclick = function(){ addPerson("spouse",b.ID); };
		
		
		/* Code for 'Add Child' Button */	
		items[5].onclick = function(){ addPerson("child",b.ID); };
				
		menu.setAttribute('style','left:'+(shape.x+shape.w-24)+'px; top:'+(shape.y+shape.h)+'px;');
		show(["Hover_MENU"]);
	}//displayMenu