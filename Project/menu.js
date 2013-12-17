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

// This code controls the functions of the overlay canvas, containing the Menu

	// Constructor for Item objects to hold data for all drawn objects.
	function Item(y, type) {
		this.hover = false;
		this.y = y || 0;																				// All we're doing is checking if the values exist.
		this.type = type;																				// Which button is it?
	}//function Item
	
	// Draws the Item on the given context
	Item.prototype.draw = function(ctx) {
		var grd = ctx.createLinearGradient(0, this.y, 0, this.y + 30);									// Create a gradient to fill the shape
		ctx.shadowBlur = 15;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
			
		if (this.hover){
			grd.addColorStop(0.0, "#ffff00");															
			grd.addColorStop(1.0, "#ffbb00");
			ctx.shadowColor = "#ffffff";
			
		} else {
			ctx.shadowColor = "transparent";
			grd.addColorStop(0.0, "#ffffff"); 															 															
			grd.addColorStop(1.0, "#bbbbbb"); 															
		}//if..else..
		
		drawRoundedRectangle(ctx,5,this.y,110,30,10);

		// Box Colour
		ctx.fillStyle = grd;																			// Fill box with Gradient
		ctx.fill();
		
		ctx.shadowColor = "transparent";
		ctx.lineWidth = 2;																				// Set properties of outline
		ctx.strokeStyle = "black";
		ctx.stroke();
		
		// Add Text
		ctx.font = "18pt 'Lilita One', cursive;";																		// Font size / type
		ctx.fillStyle = "#000000"; 																		// Text color
		ctx.textAlign = "center";																		// Text Alignment
		ctx.textBaseline = "top";																	// Baseline of text
		ctx.fillText(this.type, 60, this.y + 2);															// Text and position of text in shape
	}//Item.prototype.draw
	
	// Determine if a point (mouseclick) is inside the Item's bounds
 	Item.prototype.contains = function(mx, my) {
		return  (5 <= mx) && (115 >= mx) &&															// Make sure the Mouse X,Y falls in the area between ...
				(this.y <= my) && (this.y + 30 >= my);													// the Item's X and (X + Height) and its Y and (Y + Height)
	}//Item.prototype.contains
		
	//This is the main canvas on which most of the procedures occur!
	function Menu(canvas) {
		this.canvas = canvas;																			// **** First some setup! 
			canvas.width = 120;
			canvas.height = 290;
		this.width = canvas.width;																		// 'this' is the current state
		this.height = canvas.height;
		this.ctx = canvas.getContext('2d');																// Load the context		
		this.Items = [];
		this.buttonA = false;
		this.buttonB = false;
		
		this.addItem(new Item(20, "Gallery"));
		this.addItem(new Item(60, "Search"));
		this.addItem(new Item(100, "Charts"));
		this.addItem(new Item(140, "Controls"));
		this.addItem(new Item(180, "Settings"));
		this.addItem(new Item(220, "Log Out"));
			
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
		this.htmlLeft = html.offsetLeft;																	// They will mess up mouse coordinates and this fixes that

		// **** Keep track of state! ****
		this.valid = false; 																			// When set to false, the canvas will redraw everything
	  
		// **** Then events! ****
	  
		// This is an example of a closure!
		// Right here "this" means the Menu. But we are making events on the Canvas itself,
		// and when the events are fired on the canvas the variable "this" is going to mean the canvas!
		// Since we still want to use this particular Menu in the events we have to save a reference to it.
		// This is our reference!
		var myState = this;
	  
		//fixes a problem where double clicking causes text to get selected on the canvas
		canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
		
		// Mousedown is for dragging and controlling parent/children nodes
		canvas.addEventListener('mousedown', function(e) {												// When the mouse button is clicked do this...
			OpenMenu(myState, myState.getMouse(e));
		}, true); //EventListener MouseDown
		
		canvas.addEventListener('touchstart', function(e) {												// When a finger touches them menu do this...
			if (e.targetTouches.length == 1) {									// If there is only one finger dragging
				var input = e.targetTouches[0];									// Store finger state
				OpenMenu(myState, input);										// Modular dragging function
			}//if
		}, true); //EventListener MouseDown

		// Mousedown is for dragging and controlling parent/children nodes
		canvas.addEventListener('mousemove', function(e) {												// When the mouse is moved do this...
			var items = myState.Items;
			var mouse = myState.getMouse(e);
			var mx = mouse.x;
			var my = mouse.y;
			
			for (var i=0; i<items.length; i++) {
				if (items[i].contains(mx,my)) {
					items[i].hover = true;
					myState.valid = false;
				} else {
					items[i].hover = false;
					myState.valid = false;
				}//if..else..
			}//for
		}, true); //EventListener MouseDown
		
		// Mouseover checks if the mouse is in the canvas area
		canvas.addEventListener('mouseover', function(e) {
			
		}, true); // EventListener MouseMove
		
		// Mouseout is for dragging
		canvas.addEventListener('mouseout', function(e) {

		}, true); // EventListener MouseMove
		
		// What to do when keys are pressed
		canvas.addEventListener('keyup', function (event){
		
		}, true); //EventListener KeyDown
	
	
		// **** Options! ****
		this.interval = 25;																				// Sets Interval at which to redraw the canvas - ms
		setInterval(function() { myState.draw(); }, myState.interval);									// Lower interval = smoother movement, higher CPU usage
	}//Menu

	// Adds the menu Items to the canvas
	Menu.prototype.addItem = function(Item) {
		this.Items.push(Item);																			// Add item to array of items
		this.valid = false;																				// Redraw canvas
	} //Menu.Prototype.addItem
	
	// Clears the canvas
		Menu.prototype.clear = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	} //Menu.prototype.Clear

	
	// While draw is called as often as the INTERVAL variable demands,
	// It only ever does something if the canvas gets invalidated by our code
	Menu.prototype.draw = function() {
		// If canvas has been invalidated, redraw.
		if (!this.valid) {
			var ctx = this.ctx;
			var items = this.Items;
			this.clear();																				// Clear the canvas

				ctx.font = "18pt 'Lilita One', 'Arial Black', sans-serif";												// Font size / type
				ctx.fillStyle = "#000000"; 																// Text color
				ctx.textAlign = "center";																// Text Alignment
				ctx.textBaseline = "top";																// Baseline of text
				ctx.fillText("Menu", 60, 260);															// Text and position of text in shape
			
			if(items.length != 0) {																		// Draw the menu options
				for (var i=0, p=items.length; i<p; i++){
					items[i].draw(ctx);
				}//for
			}//if
			
			this.valid = true;
		} //if
		
		if (document.getElementById('s02')){																// Procedure to ensure that
			var last1 = document.getElementById("s02");													// the Last Name of the individual
			var last2 = document.getElementById("s06");													// being searched for is the same as the
				last2.value=last1.value || "Last Name";													// Father's last name
		}//if
	} //Menu
	
	
	// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
	// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
	Menu.prototype.getMouse = function(e) {
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
	}//getMouse
	
	
	function OpenMenu(myState, input) {
		var items = myState.Items;
		var x = input.x;
		var y = input.y;
		
		if (items[0].contains(x,y)) {
			hideElements();
			photoGallery(' ');
		}//if
		else if (items[1].contains(x,y)) {
			hideElements();
			drawSearch();
		}//if
		else if (items[2].contains(x,y)) {
			hideElements();
			genderSplit();
		}//if
		else if (items[3].contains(x,y)) {
			hideElements();
			drawControls();
		}//if
		else if (items[4].contains(x,y)) {
			hideElements();
			drawSettings();
		}//if
		else if (items[5].contains(x,y)) {
			smoke.alert('Login/Logout is currently under development');
		}//if
	}//OpenMenu
	
	
	function drawSearch() {
		HelpTopic = "search";
		
		var body = document.getElementById('Window_BODY');
		var title = document.getElementById('Window_TITLE');
		var div = document.getElementById('Window');
			body.innerHTML = Node_Search.innerHTML;
			title.innerHTML = 'Search';
			div.className = "search";
		
		var w = div.offsetWidth;		var h = div.offsetHeight;
			div.setAttribute('style','margin-top:-'+h/2+'px; top: 50%;');
		
		document.getElementById("CloseBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-48)+'px;');
		document.getElementById("HelpBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-93)+'px;');
		show(["CloseBtn","HelpBtn","Window_BG"]);
	}//drawSearch
	
	function drawControls() {
		HelpTopic = "controls";
		
		var body = document.getElementById('Window_BODY');
		var title = document.getElementById('Window_TITLE');
		var div = document.getElementById('Window');
			body.innerHTML = Node_Controls.innerHTML;
			title.innerHTML = 'Controls';
			div.className = "controls";
		var w = div.offsetWidth;		var h = div.offsetHeight;
			div.setAttribute('style','margin-top:-'+h/2+'px; top: 50%;');
		
		document.getElementById("CloseBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-48)+'px;');
		document.getElementById("HelpBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-93)+'px;');
		show(["CloseBtn","HelpBtn","Window_BG"]);
	}//drawControls
	
	function drawSettings() {
		HelpTopic = "settings";
		
		var body = document.getElementById('Window_BODY');
		var title = document.getElementById('Window_TITLE');
		var div = document.getElementById('Window');
			body.innerHTML = Node_Settings.innerHTML;
			title.innerHTML = 'Settings';
			div.className = "settings";
		var w = div.offsetWidth;		var h = div.offsetHeight;
			div.setAttribute('style','margin-top:-'+h/2+'px; top: 50%;');
		
		document.getElementById("CloseBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-48)+'px;');
		document.getElementById("HelpBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-93)+'px;');
		show(["CloseBtn","HelpBtn","Window_BG"]);
		
		//Fill 'SelectPerson' Options
		var html = '';
		var items = [];
		var select = document.getElementById('selectPerson');
		for (var i in People) {
			items.push(People[i].NAME.SURN + ' ' + People[i].NAME.GIVN + '--' + (People[i].BIRTH.DATE[1] || '??') + '/' + (People[i].BIRTH.DATE[2] || '??') + '/' + (People[i].BIRTH.DATE[3] || '??') + ' ID:' + People[i].ID);
		}//for
		items.sort();
		for (var j in items) {
			html += '<option value="' + items[j].substr(items[j].length-5, items[j].length) + '">' + items[j].substr(0, items[j].length-9) + '</option>';
		}//for
		select.innerHTML = html;
	}//drawSettings

	// When the close button has been pressed...
	function closeButton() {
		hideElements();		
		document.getElementById('treeCanvas').focus();	//Stops multiple return key presses
	}// closeButton
	
	// When the Search Button has been pressed...
	function searchButton() {
		layerMenu.viewSearch = true;															//
		var a = document.forms["searchForm"]["s01"].value.toLowerCase() || '';					// GIVN[0]
		var b = document.forms["searchForm"]["s02"].value.toLowerCase() || '';					// SURN
		var c = document.forms["searchForm"]["s03"].value || '';								// Dob
		var d = document.forms["searchForm"]["s04"].value || '';								// DoD
		var e = document.forms["searchForm"]["s05"].value.toLowerCase() || '';					// Father GIVN[0]
		var f = document.forms["searchForm"]["s07"].value.toLowerCase() || '';					// Mother GIVN[0]
		var g = document.forms["searchForm"]["s08"].value.toLowerCase() || '';					// Mother Maiden
		var h = document.forms["searchForm"]["s09"].value.toLowerCase() || '';					// Spouse GIVN[0]
		var i = document.forms["searchForm"]["s10"].value.toLowerCase() || '';					// Spouse SURN
		
		document.getElementById('s01').focus();													//Stops multiple return key presses
		
		if (a == '' && b == '' && c == '' && d == '' && e == '' && f == '' && g == '' && h == '' && i == '') {
			smoke.signal('Please enter a search term');	
			return false;
		}  else if (e != '' && b == '') {	
			smoke.signal('You must enter both a first name <br> and last name for a father');
			return false; 
		} else if ( (f != '' && g == '') || (f == '' && g != '') ) {	
			smoke.signal('You must enter both a first name <br> and last name for a mother');
			return false; 
		} else if ( (h != '' && i == '') || (h == '' && i != '') ) {	
			smoke.signal('You must enter both a first name <br> and last name for a spouse');
			return false; 
		} else if (isNaN(c) == true || isNaN(d) == true) {
			smoke.signal('Birth and Death Years must be 4-digit numbers i.e 1901');
			return false;
		} //if
		
		var j,k,l, No, HighNo;	var Number = [];		var FinalResult = [];
		var Results = [];		var aResults = [];		var bResults = [];		var cResults = [];
		var dResults = [];		var eResults = [];		var fResults = [];		var hResults = [];
		
		for (var j=0, p=People.length; j<p-1; j++){
			if (a && a.toLowerCase() == People[j].NAME.GIVN[0].toLowerCase()) {								// Compare Forename
				aResults.push(People[j]);														//  Add to results list
			}//if a
			if (b && b.toLowerCase() == People[j].NAME.SURN.toLowerCase()) {									// Compare Surname
				bResults.push(People[j]);														//  Add to results list
			}//if b
			if (c && c == parseFloat(People[j].BIRTH[2])) {									// Compare DoB
				cResults.push(People[j]);														//  Add to results list
			}//if c
			if (d && d == parseFloat(People[j].DEATH[2])) {									// Compare DoD
				dResults.push(People[j]);														//  Add to results list
			}//if d
			
			if (e && b && e.toLowerCase() == People[j].NAME.GIVN[0].toLowerCase() && b.toLowerCase() == People[j].NAME.SURN.toLowerCase()) {
				for (k in People[j].CHIL) {
					for (var l=0, p=People.length; l<p-1; l++){
						if (People[l].ID == People[j].CHIL[k]) {
							eResults.push(People[l]);
						}//if
					}//for
				}//for
			}//if e
			
			if (f != '' && g != '' && f == People[j].NAME.GIVN[0].toLowerCase() && g == People[j].NAME.SURN.toLowerCase()) {
				for (k in People[j].CHIL) {
					for (var l=0, p=People.length; l<p-1; l++){
						if (People[l].ID == People[j].CHIL[k]) {
							fResults.push(People[l]);
						}//if
					}//for
				}//for
			}//if f
			
			if (h != '' && i != '' && h == People[j].NAME.GIVN[0].toLowerCase() && i == People[j].NAME.SURN.toLowerCase()) {
				for (var k=0, p=People.length; k<p-1; k++){
					if (People[j].SPOU == People[k].ID) {
						hResults.push(People[k]);
					}//if
				}//for
			}//if h
		}//for
		
		
		//Collate Results
		Results = aResults;
		for (var j=0, p=Results.length; j<p-1; j++){ 
			if (!Number[j]) { Number.push(1); }
			for (var k=0, q=bResults.length; k<q-1; k++){ 
				if (Results[j] == bResults[k]) {
					Number[j] += 1;
					bResults.splice(k,1);
				}//if
			}//for
		}//for
		Results = Results.concat(bResults);
		
		for (var j=0, p=Results.length; j<p-1; j++){ 
			if (!Number[j]) { Number.push(1); }
			for (var k=0, q=cResults.length; k<q-1; k++){ 
				if (Results[j] == cResults[k]) {
					Number[j] += 1;
					cResults.splice(k,1);
				}//if
			}//for
		}//for
		Results = Results.concat(cResults);
		
		for (var j=0, p=Results.length; j<p-1; j++){ 
			Number.push(1);
			for (var k=0, q=dResults.length; k<q-1; k++){ 
				if (Results[j] == dResults[k]) {
					Number[j] += 1;
					dResults.splice(k,1);
				}//if
			}//for
		}//for
		Results = Results.concat(dResults);
		
		for (var j=0, p=Results.length; j<p-1; j++){ 
			if (!Number[j]) { Number.push(1); }
			for (var k=0, q=eResults.length; k<q-1; k++){ 
				if (Results[j] == eResults[k]) {
					Number[j] += 1;
					eResults.splice(k,1);
				}//if
			}//for
		}//for
		Results = Results.concat(eResults);
		
		for (var j=0, p=Results.length; j<p-1; j++){ 
			if (!Number[j]) { Number.push(1); }
			for (var k=0, q=fResults.length; k<q-1; k++){ 
				if (Results[j] == fResults[k]) {
					Number[j] += 1;
					fResults.splice(k,1);
				}//if
			}//for
		}//for
		Results = Results.concat(fResults);
		
		for (var j=0, p=Results.length; j<p-1; j++){ 
			if (!Number[j]) { Number.push(1); }
			for (var k=0, q=hResults.length; k<q-1; k++){ 
				if (Results[j] == hResults[k]) {
					Number[j] ++;
					hResults.splice(k,1);
				}//if
			}//for
		}//for
		Results = Results.concat(hResults);
		
		for (var j=0, p=Results.length; j<p-1; j++){  
			if (!Number[j]) { Number.push(1); }
		}//for
		
		//Finish Collating Results
		
		HighNo = 0;
		for (j=0, p=Number.length; j<p-1; j++) {
			if (Number[j] > HighNo) { HighNo = Number[j]; }
		}//for
		
		for (j=0, p=Number.length; j<p-1; j++) {
			if (Number[j] == HighNo && Results[j]) { 
				FinalResult.push(Results[j]);
			}//if
		}//for
		
		No = FinalResult.length;
		if (No < 14) {
			for (j=0, p=Number.length; j<p-1; j++) {
				if (No < 14 && Number[j] == HighNo - 1) { 
					FinalResult.push(Results[j]);
					No ++;
				}//if
				else if (No == 14) { break;}//else
			}//for
		}//if
		
		if (No == 0) {	smoke.alert("No Matches Found."); 
			document.getElementById('s01').focus();	//Stops multiple return key presses
			return false; 
		}//if
		else if (No > 14) {	 smoke.alert("Too many results! <br> Please refine your search");
			document.getElementById('s01').focus();	//Stops multiple return key presses
			return false; 
		}//if
		else if (No > 0 && No < 15) {				
			var text = [];
			text.push('<table><thead><tr><td>ID</td><td>Name</td><td span="2">Surname</td><td>Date of Birth</td><td></td></tr></thead><tbody>');
			
			for (var i=0, p=FinalResult.length; i<p-1; i++) {
				var a = FinalResult[i];
				text.push('<tr><td>',a.ID,'</td><td>',a.NAME.GIVN[0],' ',(a.NAME.GIVN[1] || ' '),'</td><td>',a.NAME.SURN,'</td><td>');
				text.push(a.BIRTH.DATE[1],' ',a.BIRTH.DATE[2],' ',a.BIRTH.DATE[3],'</td>');
				text.push('<td><span class="go" onClick="getPerson(',"'",a.ID,"'",'); return false;">Go</span></td></tr>');
			}//for
			
			text.push('</tbody></table>');
			document.getElementById("Window_BODY").innerHTML = text.join('');
		}//else
	}// closeButton
	
	
	function requestID() {
		smoke.prompt('Enter the unique 4-Digit ID of the person you are looking for ...', function(e){
			if (isNaN(e) || e == "0000" || e.length > 4 || e.length < 4){
				if (e == "404") { smoke.alert('404 - This person could not be found.');
				}else{ smoke.alert('Invalid ID.');	}
			}else{
				var posX = winW;
				var posY = winH;
				layerTree.clear;
				layerTree.shapes = [];
				layerTree.ConnectorAs = [];
				layerTree.ConnectorBs = [];
				layerTree.addShape(new Shape(posX/2-100,posY/2-50, e));					// Insert the first node
				
				var i = parseFloat(e) - 1;
				smoke.signal('You have selected ' + People[i].NAME.GIVN[0] + ' ' + People[i].NAME.SURN);

				layerTree.valid = false;
				}
		}, {value:"0001", ok:"Find", cancel: "Cancel", maxlength: "4"});		
	}//requestID		
	
	//Draw Photo Gallery
	function photoGallery(id){
		HelpTopic = "gallery";
		
		var body = document.getElementById('Window_BODY');
		var title = document.getElementById('Window_TITLE');
		var div = document.getElementById('Window');
			title.innerHTML = 'Photo Gallery &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + Node_Gallery.innerHTML;
			div.className = "gallery";
		
		var w = div.offsetWidth;		var h = div.offsetHeight;
			div.setAttribute('style','margin-top:-'+h/2+'px; top: 50%;');
		
		document.getElementById("CloseBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-48)+'px;');
		document.getElementById("HelpBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-93)+'px;');
		show(["CloseBtn","HelpBtn","Window_BG"]);
		
		//Fill 'SelectPersonGallery' Options
		var select = document.getElementById('gallery_ID');
		
		if (id != ' '){var person = id;}
		else {
			if (select.selectedIndex == 0){ var person = 'ALL'; }
			else { var person = select.options[select.selectedIndex].value; }
		}//else
		
		var a = [];
		var select_type = document.getElementById('gallery_TYPE');
			
		for (var i=0, p=select_type.length; i<p; i++) {
			if (select_type[i].selected) {
				var type = select_type[i].value;
			}//if
		}//for		
			
		for (var i=0, p=photos.length; i<p; i++) {
			if (person == "ALL" || person == "All") {
				a.push(photos[i]);
			} else {
				for (var j=0; j<photos[i].WHO.length; j++) {
					if (person == photos[i].WHO[j]) {
						a.push(photos[i]);
					}//if
				}//for
			}//else
		}//for
		
		var html = "<div class='wrapper'>";
		
		for (var i=0, p=a.length; i<p; i++) {
			var b = a[i];
			if (type == "ALL") { 
				html += "<a href='data/photos/"+b.ID+".jpg' data-lightbox='all-photos' title='"+b.ID+"'><img src='data/photos/thumbs/"+b.ID+".jpg' onMouseOver='showTooltip(24)' onMouseOut='hide(["+'"tooltip"'+"]);'></a>";
			} else if (b.TYPE == type) {
				html += "<a href='data/photos/"+b.ID+".jpg' data-lightbox='photos-set' title='"+b.ID+"'><img src='data/photos/thumbs/"+b.ID+".jpg' onMouseOver='showTooltip(24)' onMouseOut='hide(["+'"tooltip"'+"]);'></a>";
			} else {
				for (var j=0; j<b.TYPE.length; j++) {
					if (b.TYPE[j] == type) {
						html += "<a href='data/photos/"+b.ID+".jpg' data-lightbox='photos-set' title='"+b.ID+"'><img src='data/photos/thumbs/"+b.ID+".jpg' onMouseOver='showTooltip(24)' onMouseOut='hide(["+'"tooltip"'+"]);'></a>";
						break;
					}//if
				}//for
			}//else					
		}//for
		
		html += '</div>';
		
		if (html == "<div class='wrapper'></div>") { body.innerHTML = "<center>Sorry, there are no pictures matching your search</center>"; }
		else { body.innerHTML = html; }
	}//photoGallery
		
	function getPerson(ID) {
		var posX, posY;																				//  This procedure checks if the windows height and width
		if (winW%2) {posX = winW - 0.5;} else {posX = winW;}										//   are divisible by 2 and adds a half pixel if they are
		if (winH%2) {posY = winH - 0.5;} else {posY = winH;}										//   this solves an issue where images render fuzzy
		layerTree.shapes.splice(0, layerTree.shapes.length);
		layerTree.ConnectorAs.splice(0, layerTree.ConnectorAs.length);
		layerTree.ConnectorBs.splice(0, layerTree.ConnectorBs.length);
		layerTree.addShape(new Shape(posX/2-100,posY/2-50, ID, false));					// Insert the first node
		layerTree.valid = false;
		layerTree.draw();
		closeButton();	
	}//getPerson
	
	function setHomeNode(){
		var id = document.getElementById('selectPerson').value;
		HomeNode = id;
		localStorage.setItem('HomeNode', id);
	}//setHomeNode
		
		