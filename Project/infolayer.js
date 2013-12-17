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
//

// This code controls the functions of the InfoLayer canvas, containing the Menu
	
	//This is the main canvas on which most of the procedures occur!
	function InfoLayer(canvas) {
		this.canvas = canvas;																			// **** First some setup! 
			canvas.width = 350;
			canvas.height = winH;
		this.width = canvas.width;																		// 'this' is the current state
		this.height = canvas.height;
		this.ctx = canvas.getContext('2d');																// Load the context
		this.ctx.clearRect(0,0,1,1);																	// Clear the canvas
		this.type = "";
		this.visible = false;
		this.ID = "";																					// ID of person or family
		
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
		this.valid = true; 																			// When set to false, the canvas will redraw everything
	  
		// **** Then events! ****
	  
		// This is an example of a closure!
		// Right here "this" means the InfoLayer. But we are making events on the Canvas itself,
		// and when the events are fired on the canvas the variable "this" is going to mean the canvas!
		// Since we still want to use this particular InfoLayer in the events we have to save a reference to it.
		// This is our reference!
		var myState = this;
	  
		//fixes a problem where double clicking causes text to get selected on the canvas
		canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
		
		// Mousedown is for dragging and controlling parent/children nodes
		canvas.addEventListener('mousedown', function(e) {												// When a button is pressed "down" do this...
			var mouse = myState.getMouse(e);
			if (mouse.x <= 30 && mouse.x >=0) {
				var info1 = document.getElementById("infoCanvas");
				var info2 = document.getElementById("infoBox");
				var info3 = document.getElementById("info_CLOSE");
				if (info1.className=="show") { info1.className="autohide"; info2.className="autohide"; info3.className="autohide"; }
			}//if
		}, true); //EventListener MouseDown

		// Mousedown is for dragging and controlling parent/children nodes
		canvas.addEventListener('mousemove', function(e) {												// When a button is pressed "down" do this...
		}, true); //EventListener MouseDown
		
		// Mouseover checks if the mouse is in the canvas area
		canvas.addEventListener('mouseover', function(e) {
			var info1 = document.getElementById("infoCanvas");
			var info2 = document.getElementById("infoBox");
			
			if (info1.className=="autohide") { info1.className="show"; info2.className="show"; }
		}, true); // EventListener MouseMove
		
		// Mouseout is for dragging
		canvas.addEventListener('mouseout', function(e) {
		}, true); // EventListener MouseMove
		
	
		// **** Options! ****
		this.interval = 1000;																				// Sets Interval at which to redraw the canvas - ms
		setInterval(function() { myState.draw(); }, myState.interval);									// Lower interval = smoother movement, higher CPU usage
	}//InfoLayer
	
	// Clears the canvas
	InfoLayer.prototype.clear = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	} //InfoLayer.prototype.Clear

	
	// While draw is called as often as the INTERVAL variable demands,
	// It only ever does something if the canvas gets invalidated by our code
	InfoLayer.prototype.draw = function() {
		var infoCanvas = document.getElementById('infoCanvas');
		getDisplaySize();
		
		if (this.visible && this.height != winH || this.visible && this.width != 350) {
			this.valid = false;
		}//if
		// if our state is invalid, redraw and validate!
		if (!this.valid) {
			if (this.visible == false) {
					hide(['infoCanvas']);
			}//if
			else {
				infoCanvas.style.width  = 350 + "px";	infoCanvas.style.height = winH + "px";		
				show(['infoCanvas']);
				this.canvas.width = 350;	this.width  = 350;
				this.canvas.height = winH;	this.height = winH;
				
				if (this.type == "person") {
					showInfoPerson(this);
				} else {
					showInfoMarriage(this);
				}//if..else..
				
			}//else
			this.valid = true;
		} //if
	} //InfoLayer
	
	// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
	// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
	InfoLayer.prototype.getMouse = function(e) {
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

//Display InfoLayer Canvas overlaying main canvas
	function showInfoPerson(myState) {	
		var ctx = myState.ctx;
		var x = 0, y = 0, h = winH, w = 350, v = 0;						// v = variation in y-position
		var grd = ctx.createLinearGradient(x, y, x + w, y);
		var photo = document.createElement('img');
		
		show(['info_CLOSE']);
		
		if (myState.ID == "") { return; } 
		var a = People[parseFloat(myState.ID) - 1];
		
		for (var i=0, p=photos.length; i<p - 1; i++){
			if (photos[i].TYPE == "IND" && photos[i].WHO[0] == a.ID) {
				photo.src="data/photos/thumbs/" + photos[i].ID + ".jpg";
				break;
			}//if
		}//for */
		if (photo.src == "") { v = -130; } //if 
		
		if (a._PRIV == "Y") { 
			myState.canvas.width = 0;	myState.canvas.height = 0;
			myState.visible = false;	myState.valid = false;
			layerInfo.draw();
			smoke.signal('This individual has been marked as private.<br>You do not have permission to view their information.');
			return;
		}//if
		
		var bPlace = (a.BIRTH.PLAC.replace("'",'')).split(',');					// Split the place names by commas
		var dPlace = (a.DEATH.PLAC.replace("'",'')).split(',');					// Split the place names by commas
		
		//Fill+Decorate box
		if (a.GEND == 'M') {
			grd.addColorStop(0.05, "#00aaff"); // cyan
			grd.addColorStop(1.00, "#ccffff"); // very light blue
		} else if (a.GEND == 'F') {
			grd.addColorStop(0.05, "#ff3333"); // red
			grd.addColorStop(1.00, "#ffcccc"); // very light pink
		} else {
			grd.addColorStop(0.05, "#999999"); // grey
			grd.addColorStop(1.00, "#dddddd"); // very light grey
		}
		
		ctx.fillStyle = grd;
		
		ctx.fillRect(x,y,w,h);
		ctx.moveTo(x+0.5,y);
		ctx.lineTo(x+1,y+h);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "";
		ctx.stroke();
		
		//Insert Text
		ctx.font = "12pt 'Arial', sans-serif";
		ctx.fillStyle = "#000000"; // text color
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText("ID: " + a.ID, w/2+5, 12);
		
		//Heading
		ctx.font = "24pt 'Lilita One', 'Arial Black', sans-serif";
		ctx.fillStyle = "#000000"; // text color
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(a.NAME.GIVN[0]+' '+(a.NAME.GIVN[1] || ' '), w/2 + 5, 50);            				
		ctx.fillText(a.NAME.SURN, w/2 + 5, 90);
		
		if (photo.src != "") { 
			photo.onload = function() {
				ctx.drawImage(photo, w/2 - 50, 120); 
			}//onload
		}//if
		if (a.BIRTH.DATE[3] == '' && a.DEATH.DATE[3] == '') { v -= 20;
		} else {
			ctx.fillText(a.BIRTH.DATE[3] + " - " + a.DEATH.DATE[3], w/2 + 5, 270 + v);												
		}//if..else..
		if (a.AGE != '?') {
			ctx.fillText(a.AGE + " Years Old", w/2 + 5, 310 + v);
		} else { v -= 40; }
		
		//Data
		var info = document.getElementById('infoBox');
			show(['infoBox']);
			info.style.height = (winH - 350 - v) + "px";
			info.style.top = (340 + v) + "px";
		var text = [];
		
		text.push('<table style="border:0px;width:100%">');
		
		// BIRTH
		if (a.BIRTH.NOTE != "" || a.BIRTH.SRC != "") { text.push('<tr onClick="dispNote('+"'"+a.ID+"','BIRTH'"+');">'); }
		else { text.push('<tr>'); }
		if (a.BIRTH.DATE[1] || a.BIRTH.DATE[2] || a.BIRTH.DATE[3] || bPlace[0]) {
			if (a.BIRTH.DATE[0] != 'BET') {
				text.push('<td class="col1">Birth:</td><td>',a.BIRTH.DATE[0],' ',a.BIRTH.DATE[1],' ',a.BIRTH.DATE[2],' ',a.BIRTH.DATE[3],'</td></tr>');
			} else { //If event is between 2 dates
				text.push('<td class="col1">Birth:</td><td>','BETWEEN ',a.BIRTH.DATE[1],' ',a.BIRTH.DATE[2],' ',a.BIRTH.DATE[3],' AND ', a.BIRTH.DATE[4],' ',a.BIRTH.DATE[5],' ',a.BIRTH.DATE[6],'</td></tr>');	
			}//Birth BETWEEN dates
			
			if (bPlace[0]){
				text.push('<tr><td><span onClick="window.open('+"'"+'http://maps.google.co.uk/maps?q='+bPlace[0] + ', '+(bPlace[1] || ' ')+"'"+');" onMouseOver="showTooltip(19);" onMouseOut="hide(['+"'tooltip'"+']);" style="font-size:10pt;line-height:1;">Map</span>');
				text.push('</td><td>',bPlace[0],'</td></tr><tr><td></td><td>',(bPlace[1] || ' '),'</td>');
			}//if
		}//if
		
		// DEATH
		if (a.DEATH.DATE.NOTE || a.DEATH.SRC) { text.push('<tr onClick="dispNote('+"'"+a.ID+"','DEATH'"+');">'); }
		else { text.push('<tr>'); }
		if (a.DEATH.DATE[1] || a.DEATH.DATE[2] || a.DEATH.DATE[3] || dPlace[0]) { 
			if (a.DEATH.DATE[0] != 'BET') {
				text.push('<td class="col1">Death:</td><td>',a.DEATH.DATE[0],' ',a.DEATH.DATE[1],' ',a.DEATH.DATE[2],' ',a.DEATH.DATE[3],'</td></tr>');
			} else { //If event is between 2 dates
				text.push('<td class="col1">Death:</td><td>','BETWEEN ',a.DEATH.DATE[1],' ',a.DEATH.DATE[2],' ',a.DEATH.DATE[3],' AND ', a.DEATH.DATE[4],' ',a.DEATH.DATE[5],' ',a.DEATH.DATE[6],'</td></tr>');	
			}//Death BETWEEN dates
			
			if (dPlace[0]) {
				text.push('<tr><td><span onClick="window.open('+"'"+'http://maps.google.co.uk/maps?q='+dPlace[0] + ', '+(dPlace[1] || ' ')+"'"+');" onMouseOver="showTooltip(20);" onMouseOut="hide(['+"'tooltip'"+']);" style="font-size:10pt;line-height:1;">Map</span>');
				text.push('</td><td>',dPlace[0],'</td></tr><tr><td></td><td>',(dPlace[1] || ' '),'</td>');
			}//if
		}//if
		if (a.DEATH.CAUS) {
			text.push('<tr><td class="col1">Cause:</td><td>',a.DEATH.CAUS,'</td></tr>');
		}//if
		
		if (a.BURI.DATE[0] == "" && a.BURI.DATE[1] == "" && a.BURI.DATE[2] == "" && a.BURI.DATE[3] == "" && a.BURI.PLAC == "") { /* Do Nothing */
		} else if (a.BURI.DATE[0] == "" && a.BURI.DATE[1] == "" && a.BURI.DATE[2] == "" && a.BURI.DATE[3] == "" && a.BURI.PLAC != "") { 
			text.push('<tr><td class="col1">Burial:</td><td>',a.BURI.PLAC,'</td></tr><tr>'); 
		} else {	
			text.push('<tr><td class="col1">Burial:</td><td>',a.BURI.DATE[0],' ',a.BURI.DATE[1],' ',a.BURI.DATE[2],' ',a.BURI.DATE[3],'</td></tr>');
			text.push('<tr><td></td><td>',a.BURI.PLAC,'</td></tr><tr><td></td><td></td>'); 
		} //Burial
				
		if (!a.OCCU[0] && !a.OCCU[1])  {
			OccuNested: 
			for (var i=0, p=census.length; i<p; i++){
				for (var j=0; j<census[i].WHO.length; j++){ 
					if (a.ID == census[i].WHO[j].ID && census[i].WHO[j].OCCU != ' ') {
						a.OCCU = census[i].WHO[j].OCCU;
						text.push('<tr><td class="col1">Occu:</td><td>',a.OCCU[0],'</td></tr>');
						break OccuNested;
					}//if
				}//for
			}//for
		} else { text.push('<tr><td class="col1">Occu:</td><td>',a.OCCU[0],'</td></tr>'); } //else
		if (a.OCCU[1] != "") { text.push('<tr><td class="col1"></td><td>',a.OCCU[1],'</td></tr>'); }
		
		if (a.RELI) {
			text.push('<tr><td class="col1">Religion:</td><td>',a.RELI,'</td></tr>');
		}//if
		
		var censusCode = [];
		
		//1841 Census
		CensusNested1: 
		for (var i=0, p=census.length; i<p; i++){
			if (census[i].YEAR == '1841'){
				for (var j=0; j<census[i].WHO.length; j++){ 
					if (a.ID == census[i].WHO[j].ID) {
						censusCode.push('<td><span onClick="displayCensus(',i,')" onMouseOver="showTooltip(21);" onMouseOut="hide(['+"'tooltip'"+']);">1841</span></td>');
						censusCode.push('<tr><td></td>');
						break CensusNested1;
					}//if
				}//for
			}//if
		}//for
	
		//1851 Census
		CensusNested2: 
		for (var i=0, p=census.length; i<p; i++){
			if (census[i].YEAR == '1851'){
				for (var j=0; j<census[i].WHO.length; j++){ 
					if (a.ID == census[i].WHO[j].ID) {
						censusCode.push('<td><span onClick="displayCensus(',i,')" onMouseOver="showTooltip(22);" onMouseOut="hide(['+"'tooltip'"+']);">1851</span></td>');
						censusCode.push('<tr><td></td>');
						break CensusNested2;
					}//if
				}//for
			}//if
		}//for
/*		
		censusCode.push('<tr><td></td><td><span class="infoBtn" onClick="">1861</span></td></tr>');
		censusCode.push('<tr><td></td><td><span class="infoBtn" onClick="">1871</span></td></tr>');
		censusCode.push('<tr><td></td><td><span class="infoBtn" onClick="">1881</span></td></tr>');
		censusCode.push('<tr><td></td><td><span class="infoBtn" onClick="">1891</span></td></tr>');
		censusCode.push('<tr><td></td><td><span class="infoBtn" onClick="">1901</span></td></tr>');
		censusCode.push('<tr><td></td><td><span class="infoBtn" onClick="">1911</span></td></tr>');
*/
		if (censusCode.length > 0) {
			text.push('<tr><td class="col1">Census:</td>');
			text.push(censusCode.join(''));
		}//if
		
		text.push('<tr><td>&nbsp;</td><td>&nbsp;</td></tr>');
		
		var totalPhotos = 0;
		
		for (var i=0, p=photos.length; i<p-1; i++){
			for (var j=0; j<photos[i].WHO.length; j++) {
				if (a.ID == photos[i].WHO[j]) {
					totalPhotos ++;
					break;
				}//if
			}//for
		}//for
		if (totalPhotos != 0) {
			text.push('<tr><td colspan="2"><span onClick="photoGallery(',"'",a.ID,"'",')" onMouseOver="showTooltip(23);" onMouseOut="hide(['+"'tooltip'"+']);">Photos [',totalPhotos,']</span></td></tr>');
		}//if..else..
		
		text.push('<tr><td colspan="2" onClick="selectFileType(',"'ind','",a.ID,"'",')"><span onMouseOver="showTooltip(25);" onMouseOut="hide(['+"'tooltip'"+']);">Export Data</span></td></tr>');
		text.push('<tr><td colspan="2" onClick="HomeNode = ',"'",a.ID,"'",'; localStorage.setItem(',"'HomeNode','",a.ID,"'",');"><span onMouseOver="showTooltip(26);" onMouseOut="hide(['+"'tooltip'"+']);">Set as Home Person</span></td></tr>');
		text.push('<tr><td colspan="2" onClick="editPerson(',"'",a.ID,"'",');"><span onMouseOver="showTooltip(27);" onMouseOut="hide(['+"'tooltip'"+']);">Edit / Add Info</span></td></tr>');
		text.push('<tr><td colspan="2" onClick="personSearch(',"'",a.ID,"'",');"><span onMouseOver="showTooltip(31);" onMouseOut="hide(['+"'tooltip'"+']);">Web Search</span></td></tr>');
		text.push('</table>');
		
		info.innerHTML = text.join('');
	}; //showInfoPerson

	//Display InfoLayer Canvas overlaying main canvas
	function showInfoMarriage(myState) {	
		var ctx = myState.ctx;
		var x = 0, y = 0, h = winH, w = 350, v = 0;		
		var grd = ctx.createLinearGradient(x, y, x + w, y);
		
		if (myState.ID == "") { return false;	} 
		var i = Family[parseFloat(myState.ID)];
			var a = People[parseFloat(i.HUSB)-1];
			var b = People[parseFloat(i.WIFE)-1];
		
		if (a._PRIV == "Y" || b._PRIV == "Y") { 
			myState.canvas.width = 0;	myState.canvas.height = 0;
			myState.visible = false;	myState.valid = false;
			layerInfo.draw();
			smoke.signal('This marriage has been marked as Private.<br>No Data is available.');
			return;
		}//if
		
		grd.addColorStop(0, "#ffdd00"); 															// orange
		grd.addColorStop(1, "#ffff99"); 															// yellow

		ctx.fillStyle = grd;
  
		ctx.fillRect(x,y,w,h);
		ctx.moveTo(x+0.5,y);
		ctx.lineTo(x+1,y+h);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "";
		ctx.stroke();
		
		//Insert Text
		ctx.font = "30pt 'Lilita One', 'Arial Black', sans-serif";
		ctx.fillStyle = "#000000"; // text color
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(a.NAME.GIVN[0] +' '+ (a.NAME.GIVN[1] || ' '), w/2 + 5, h*2/30);						
		ctx.fillText(a.NAME.SURN, w/2 + 5, h*3.5/30);						
		ctx.fillText("&", w/2 + 5, h*5.5/30);						
		ctx.fillText(b.NAME.GIVN[0] +' '+ (b.NAME.GIVN[1] || ' '), w/2 + 5, h*7.5/30); 
		ctx.fillText(b.NAME.SURN, w/2 + 5, h*9/30); 

		//Data
		var info = document.getElementById('infoBox');
			show(['infoBox']);
			info.style.height = "auto";
			info.style.top = (40) + "%";
		var text = [];
		
		text.push('<table style="border:0px;width:100%">');
	
		text.push('<tr><td class="col1">Married:</td><td>',i.MARR.DATE[1] + ' ' + i.MARR.DATE[2] + ' ' + i.MARR.DATE[3],'</td></tr>');
		text.push('<tr><td class="col1">Place:</td><td onClick="window.open('+"'"+'http://maps.google.com/maps?q='+i.MARR.PLAC+"'"+');">',i.MARR.PLAC,'</td></tr>');
		text.push('<tr><td class="col1">Children:</td><td>');
		for (var j in i.CHIL) {
			var child = People[parseFloat(i.CHIL[j])-1].NAME.GIVN[0] + ' ' + (People[parseFloat(i.CHIL[j])-1].NAME.GIVN[1] || '');
			text.push('<span onClick="getPerson(',"'",i.CHIL[j],"'",'); return false;">', child, '</span><br>') 
		}//for
		text.push('<td></tr>');
		
		text.push('<tr><td colspan="2"><span onClick="addPerson(',"'child',",i.ID,');">Add Child</span></td></tr>');
		//text.push('<tr><td><label class="infoBtn" onClick="photoGallery('+"'"+a.ID+"'"+')">Wedding Photo</label></td>');
		
		text.push('</table>');
		
		info.innerHTML = text.join('');				
	}; //showInfoMarriage
	
	
	function dispNote(ID, type) {
		var z = parseFloat(ID) - 1;
		var a = People[z];
		var note = "";
		
		if (type == "BIRTH") {
			if (a.BIRTH.NOTE != "") {	note += '<u>Note:</u><br>' + a.BIRTH.NOTE + '<br>&nbsp;<br>';		}
			if (a.BIRTH.SRC != "") {	
				for (var i in Sources) {
					if (Sources[i].ID == a.BIRTH.SRC) {
						note += '<u>Source:</u><br>' + Sources[i].TITL + ' - ' + Sources[i].AGNC + ' - ' + Sources[i].PUBL + ' - ' + Sources[i].TEXT; 						
					}//if
				}//for
			}//if
		}//BIRTH
		else if (type == "DEATH") {
			if (a.DEATH[6] != "") {	note += '<u>Note:</u><br>' + a.DEATH[6] + '<br>&nbsp;<br>';		}
			if (a.DEATH[7] != "") {	note += '<u>Source:</u><br>' + a.DEATH[7]; 						}
		}//DEATH
		smoke.alert(note);
	}//dispNote
	
	function selectFileType(type, id){
		var file;
		if (type == 'ind') {		
			smoke.quiz("Select File Type:", function(e){
				if (e == "GEDCOM"){ file = 'ged'; downloadData(type, file, id); }//downloadData(type, file, id);}
				if (e == "CSV"){ file = 'csv';  downloadData(type, file, id);}
				if (e == "Cancel"){}
			}, {button_1: "GEDCOM",button_2: "CSV",button_cancel: "Cancel"});
		}//if
	}//selectFileType
	
	function downloadData(type, file, id){
		var a, b, html, download;
			  if (type == 'ind') {		a = People[parseFloat(id)-1];	}//if
		else if (type == 'fam') {		a = Family[parseFloat(id)-1];	}
		else if (type == 'cen') {		a = Census[parseFloat(id)-1];	}
		
		b = JSON.stringify(a);
		
		var form = document.getElementById('PHP_download');
		
		html = "<input type='text' name='type' value='"+type+"'>";
		html += "<input type='text' name='file' value='"+file+"'>";
		html += "<input type='text' name='data' value='"+encodeURIComponent(b.replace(/'/g, "%27"))+"'>";
		
		form.innerHTML = html;
		form.submit();
		form.innerHTML = '';
	}//downloadData
	
	
	//*******************************Functions to Edit Information*************************************
	function editPerson(id) {
		var a = People[parseFloat(id)-1];
		HelpTopic = "edit";
		
		var body = document.getElementById('Window_BODY');
		var title = document.getElementById('Window_TITLE');
		var div = document.getElementById('Window');
			body.innerHTML = Node_EditForm.innerHTML;
			title.innerHTML = 'Edit Person: '+ a.NAME.GIVN[0] + ' ' + a.NAME.SURN;
			div.className = "editForm";
		var w = div.offsetWidth;		var h = div.offsetHeight;
			div.setAttribute('style','margin-top:-'+h/2+'px; top: 50%;');
		
		document.getElementById("CloseBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-48)+'px;');
		document.getElementById("HelpBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-93)+'px;');
		show(["CloseBtn","HelpBtn","Window_BG"]);
		
		var form = document.getElementById('EditForm1');

		form.edit_ID.value = a.ID;
		//BASIC
		form.edit_GIVN.value = a.NAME.GIVN.join(' ') || '';
		form.edit_SURN.value = a.NAME.SURN || '';
		form.edit_NICK.value = a.NAME.NICK || '';
		form.edit_NPFX.value = a.NAME.NPFX || '';
		form.edit_NSFX.value = a.NAME.NSFX || '';
		form.edit_GEND.value = a.GEND || 'u';
		//BIRTH/DEATH
		form.edit_DOB1.value = a.BIRTH.DATE[1] || 0;
		form.edit_DOB2.value = a.BIRTH.DATE[2] || '';
		form.edit_DOB3.value = a.BIRTH.DATE[3] || 0;
		form.edit_DOB4.value = a.BIRTH.DATE[4] || 0;
		form.edit_DOB5.value = a.BIRTH.DATE[5] || '';
		form.edit_DOB6.value = a.BIRTH.DATE[6] || 0;
		form.edit_DOD1.value = a.DEATH.DATE[1] || 0;
		form.edit_DOD2.value = a.DEATH.DATE[2] || '';
		form.edit_DOD3.value = a.DEATH.DATE[3] || 0;
		form.edit_DOD4.value = a.DEATH.DATE[4] || 0;
		form.edit_DOD5.value = a.DEATH.DATE[5] || '';
		form.edit_DOD6.value = a.DEATH.DATE[6] || 0;
		form.edit_POB1.value = a.BIRTH.PLAC || '';
		form.edit_POB2.value = '' || '';
		form.edit_POB3.value = '' || '';
		form.edit_NOB.value = a.BIRTH.NOTE || '';
		form.edit_SOB.value = a.BIRTH.SRC || '';
		form.edit_POD1.value = a.DEATH.PLAC || '';
		form.edit_POD2.value = '' || '';
		form.edit_POD3.value = '' || '';
		form.edit_NOD.value = a.DEATH.NOTE || '';
		form.edit_SOD.value = a.DEATH.SRC || '';
		form.edit_TOB1.value = 00;
		form.edit_TOB2.value = 00;
		form.edit_TOD1.value = 00;
		form.edit_TOD2.value = 00;
		//BURIAL
		form.edit_BURD1.value = a.BURI.DATE[1] || 0;
		form.edit_BURD2.value = a.BURI.DATE[2] || '';
		form.edit_BURD3.value = a.BURI.DATE[3] || 0;
		form.edit_BURD4.value = a.BURI.DATE[4] || 0;
		form.edit_BURD5.value = a.BURI.DATE[5] || '';
		form.edit_BURD6.value = a.BURI.DATE[6] || 0;
		form.edit_BURP1.value = a.BURI.PLAC || '';
		form.edit_BURP2.value = '' || '';
		form.edit_BURP3.value = '' || '';
		form.edit_BURN.value = '' || '';
		form.edit_BURS.value = a.BURI.SRC || '';
		//GENERAL
		form.edit_OCCU.value = a.OCCU.join(', ') || '';
		form.edit_EDUC.value = a.EDUC || '';
		form.edit_RELI.value = a.RELI || '';
		form.edit_NOTE.value = a.NOTE || '';
	}
	
	function toggleRow(rowName){
		var row = document.getElementById(rowName);
		
		if (rowName == 'edit_r_AltDates' || rowName == 'edit_r_AltDates2') {
			var select1 = document.getElementById('EditForm1').edit_DOB0.selectedIndex;
			var select2 = document.getElementById('EditForm1').edit_DOD0.selectedIndex;
			var select3 = document.getElementById('EditForm1').edit_BURD0.selectedIndex;
			
			if (select1 == 4 || select1 == 5 || select2 == 4 || select2 == 5 || select3 == 4 || select3 == 5){ 
				show([row]);
			} else { hide([row]); }
		}
		else {
			if (row.className == 'rowHide'){ row.className='rowShow';
			} else { row.className='rowHide'; }
		}
		
		var div = document.getElementById('Window');
		var w = div.offsetWidth;		var h = div.offsetHeight;
			div.setAttribute('style','margin-top:-'+h/2+'px; top: 50%;');
		
		document.getElementById("CloseBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-48)+'px;');
		document.getElementById("HelpBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-93)+'px;');
		show(["CloseBtn","HelpBtn"]);
	}//function
	
	function saveEdit(){
		var div = document.getElementById('EditForm');
		var form = document.getElementById('EditForm1');
		var a = People[parseFloat(form.edit_ID.value)-1];
		
		//BASIC
		a.NAME.GIVN = form.edit_GIVN.value.split(' ') || '';
		a.NAME.SURN = form.edit_SURN.value || '';
		a.NAME.NICK = form.edit_NICK.value || '';
		a.NAME.NPFX = form.edit_NPFX.value || '';
		a.NAME.NSFX = form.edit_NSFX.value || '';
		a.GEND = form.edit_GEND.value || 'u';
		//BIRTH/DEATH
		a.BIRTH.DATE[1] = form.edit_DOB1.value || 0;
		a.BIRTH.DATE[2] = form.edit_DOB2.value || '';
		a.BIRTH.DATE[3] = form.edit_DOB3.value || 0;
		a.BIRTH.DATE[4] = form.edit_DOB4.value || 0;
		a.BIRTH.DATE[5] = form.edit_DOB5.value || '';
		a.BIRTH.DATE[6] = form.edit_DOB6.value || 0;
		a.DEATH.DATE[1] = form.edit_DOD1.value || 0;
		a.DEATH.DATE[2] = form.edit_DOD2.value || '';
		a.DEATH.DATE[3] = form.edit_DOD3.value || 0;
		a.DEATH.DATE[4] = form.edit_DOD4.value || 0;
		a.DEATH.DATE[5] = form.edit_DOD5.value || '';
		a.DEATH.DATE[6] = form.edit_DOD6.value || 0;
		a.BIRTH.PLAC = form.edit_POB1.value || '';
	//	form.edit_POB2.value = '' || '';
	//	form.edit_POB3.value = '' || '';
		a.BIRTH.NOTE = form.edit_NOB.value || '';
		a.BIRTH.SRC = form.edit_SOB.value || '';
		a.DEATH.PLAC = form.edit_POD1.value || '';
	//	form.edit_POD2.value = '' || '';
	//	form.edit_POD3.value = '' || '';
		a.DEATH.NOTE = form.edit_NOD.value || '';
		a.DEATH.SRC = form.edit_SOD.value || '';
	//	form.edit_TOB1.value = 00;
	//	form.edit_TOB2.value = 00;
	//	form.edit_TOD1.value = 00;
	//	form.edit_TOD2.value = 00;
		//BURIAL
		a.BURI.DATE[1] = form.edit_BURD1.value || '';
		a.BURI.DATE[2] = form.edit_BURD2.value || '';
		a.BURI.DATE[3] = form.edit_BURD3.value || '';
		a.BURI.DATE[4] = form.edit_BURD4.value || '';
		a.BURI.DATE[5] = form.edit_BURD5.value || '';
		a.BURI.DATE[6] = form.edit_BURD6.value || '';
		a.BURI.PLAC = form.edit_BURP1.value || '';
	//	form.edit_BURP2.value = '' || '';
	//	form.edit_BURP3.value = '' || '';
	//	form.edit_BURN.value = '' || '';
		a.BURI.SRC = form.edit_BURS.value || '';
		//GENERAL
		a.OCCU = form.edit_OCCU.value.split(', ') || '';
		a.EDUC = form.edit_EDUC.value || '';
		a.RELI = form.edit_RELI.value || '';
		a.NOTE = form.edit_NOTE.value || '';
		
		/*
		var output1 = 'var People = [' + JSON.stringify(People) + ']';
		var output2 = 'var People = [' + JSON.stringify(People) + ']';
		var html;
		var form = document.getElementById('PHP_save');
			html += "<input type='text' name='indData' value='"+encodeURIComponent(output1.replace(/'/g, "%27"))+"'>";
			html += "<input type='text' name='famData' value='"+encodeURIComponent(output2.replace(/'/g, "%27"))+"'>";
			form.innerHTML = html;
			form.submit();
			form.innerHTML = '';
		*/
	}//saveEdit
	
	
	function personSearch(id){
		var a = People[parseFloat(id)-1];
		var f1 = Family[parseFloat(a.FAMC)-1];
		var f2 = Family[parseFloat(a.FAMS[0])-1];
		var b = '', c = '', d = '';
		var url = '', query = '';
		
		url  = "https://www.familysearch.org/search/record/results#count=20&query=";

		if (a.NAME.GIVN[0] != '') {	query += "%2Bgivenname%3A"+a.NAME.GIVN[0]+"~%20"; }									//%2Bgivenname%3Atest~%20
		if (a.NAME.SURN != '') {	query += "%2Bsurname%3A"+a.NAME.SURN+"~%20"; }												//%2Bsurname%3Atest~%20
		if (a.BIRTH.PLAC[0] != '') {	query += "%2Bbirth_place%3A%22"+a.BIRTH.PLAC+"%22~%20"; }						//%2Bbirth_place%3Atest~%20
		if (a.BIRTH.DATE[3] != '') {	query += "%2Bbirth_year%3A"+a.BIRTH.DATE[3]+"-"+a.BIRTH.DATE[3]+"~%20"; }	//%2Bbirth_year%3A1800-1810~%20
		if(f2){
			if (f2.MARR.PLAC !='') { query += "%2Bmarriage_place%3A%22"+f2.MARR.PLAC+"%22~%20"; }								//%2Bmarriage_place%3Atest~%20
			if (f2.MARR.DATE[3] != '') {	query += "%2Bmarriage_year%3A"+f2.MARR.DATE[3]+"-"+f2.MARR.DATE[3]+"~%20"; }	//%2Bmarriage_year%3A1800-1810~%20
		}
			//%2Bresidence_place%3Atest~%20
			//%2Bresidence_year%3A1800-1810~%20
		if (a.DEATH.PLAC[0] != '') {	query += "%2Bdeath_place%3A%22"+a.DEATH.PLAC+"%22~%20"; }						//%2Bdeath_place%3Atest~%20
		if (a.DEATH.DATE[3] != '') {	query += "%2Bdeath_year%3A"+a.DEATH.DATE[3]+"-"+a.DEATH.DATE[3]+"~%20"; }	//%2Bdeath_year%3A1800-1810~%20
			//%2Bany_place%3Atest~%20
			//%2Bany_year%3A1800-1810~%20
		
		if(f2){
			if (a.GEND == 'M') { 		b = People[parseFloat(f2.WIFE)-1]; }
			else if (a.GEND == 'F') { 	b = People[parseFloat(f2.HUSB)-1]; }
		}
		if(b) {
			if (b != '') {	query += "%2Bspouse_givenname%3A"+b.NAME.GIVN[0]+"~%20"; }											//%2Bspouse_givenname%3Atest~%20
			if (b != '') {	query += "%2Bspouse_surname%3A"+b.NAME.SURN+"~%20"; }												//%2Bspouse_surname%3Atest~%20
		}
		if(f1){
			if (f1.HUSB != '') { 	c = People[parseFloat(f1.HUSB)-1]; }
			if (f1.WIFE != '') { 	d = People[parseFloat(f1.WIFE)-1]; }
		}
		if(c) {
			if (c.NAME.GIVN[0] != '') {	query += "%2Bfather_givenname%3A"+c.NAME.GIVN[0]+"~%20"; }											//%2Bfather_givenname%3Atest~%20
			if (c.NAME.SURN != '') {	query += "%2Bfather_surname%3A"+c.NAME.SURN+"~%20"; }												//%2Bfather_surname%3Atest~%20
		}
		if(d) {
  			if (d.NAME.GIVN[0] != '') {	query += "%2Bmother_givenname%3A"+d.NAME.GIVN[0]+"~%20"; }											//%2Bmother_givenname%3Atest~%20
			if (d.NAME.SURN != '') {	query += "%2Bmother_surname%3A"+d.NAME.SURN+"~%20"; }												//%2Bmother_surname%3Atest~%20
		}
			//%2Bother_givenname%3Atest~%20
			//%2Bother_surname%3Atest~
		
		query = query.replace(/,/,"%2C").replace(" ","%20").replace(/[^\w\s\%\~\-]/gi, '');
		url = url + query;
		window.open(url);

	}//personSearch
	
	