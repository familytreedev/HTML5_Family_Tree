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

// Declare Global Variables

var winW, winH; 
var Multiplier, Scale, pt, z, lastSel, curSel;
var layerTree, layerMenu, layerInfo;
var NoGens, icon, livingIcon, lock, HelpTopic, loadMsg, HomeNode;
var Node_EditForm, Node_Charts, Node_Settings, Node_Search, Node_Controls, Node_Gallery;

//************************************************************************************************************
// Initialise when window loads
	window.onerror = function(message, url, linenumber) {
		var a = "I'm sorry.  There has been an error on the page.<br>Please click 'send' and I will try to fix it";
			 a+= "<br> In the mean time, it may help to simply refresh the page and click 'Home Person'";
		smoke.confirm(a,function(e){
			if (e){
				var report = "Error: " + message + "\nURL: " + url + "\n Line Number: " + linenumber;
				var html;
				var form = document.getElementById('PHP_error');
					html = "<input type='text' name='error' value='"+report+"'>";
					form.innerHTML = html;
					form.submit();
					form.innerHTML = '';
			}//if
		}, {ok:"Send Error Report", cancel:"Don't Send"});
	}
	
	window.onload = function(){
		var html = document.getElementsByTagName('html')[0];
		html.style.cursor = "wait";																// Show timer cursor while loading
		getDisplaySize();																				// Calculate Display Size
		Multiplier = 0;		Scale = 1;		pt = 18;	z = 0;											// Initialise Global Variables
		NoGens = localStorage.getItem('Gens') || 5;
		AutoHideOn = localStorage.getItem('AutoHideOn') || 1;
		TooltipOn = localStorage.getItem('TooltipOn') || true;
		HomeNode = localStorage.getItem('HomeNode') || "00004";
		
		prepData();
		
		//Fill Gallery Person Picker
		var text = '<option value="ALL" selected="selected">ALL</option>';
		var items = [];
		for (var i in People) {
			items.push(People[i].NAME.SURN + ' ' + People[i].NAME.GIVN + '--' + (People[i].BIRTH.DATE[1] || '??') + '/' + (People[i].BIRTH.DATE[2] || '??') + '/' + (People[i].BIRTH.DATE[3] || '??') + ' ID:' + People[i].ID);
		}//for
		items.sort();
		for (var j in items) {
			text += '<option value="' + items[j].substr(items[j].length-5, items[j].length) + '">' + items[j].substr(0, items[j].length-9) + '</option>';
		}//for
		document.getElementById('gallery_ID').innerHTML = text;
		
		/* The following code removes elements from the DOM, storing the references 
			which can be copied into the "Window" later without causing multiple cases
			of IDs */
		Node_EditForm = document.getElementsByTagName('body')[0].removeChild(document.getElementById('EditForm'));
		Node_Charts = document.getElementsByTagName('body')[0].removeChild(document.getElementById('chartsDiv'));
		Node_Search = document.getElementsByTagName('body')[0].removeChild(document.getElementById('Search'));
		Node_Controls = document.getElementsByTagName('body')[0].removeChild(document.getElementById('controlsDiv'));
		Node_Settings = document.getElementsByTagName('body')[0].removeChild(document.getElementById('settingsDiv'));
		Node_Gallery = document.getElementsByTagName('body')[0].removeChild(document.getElementById('gallery'));
		
		icon = document.createElement('img');						icon.src = "images/icon64.ico";
		icon16 = document.createElement('img');  					icon16.src = "images/icon.ico";
		lock = document.createElement('img');						lock.src = "images/lock.png";
		
		begin();
		document.getElementsByTagName('body')[0].style.visibility = "visible";							// Display the 'body' (hidden until loaded)	
		html.style.cursor = "auto";
	}//window.onload
	
	function RequestFullScreen(){
		var element = document.getElementsByTagName('html')[0];
		
		if(element.requestFullScreen) {
			element.requestFullScreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen();
		}//if
				  
		document.getElementById('FullScreen').src = "images/resize2.png";
		document.getElementById('FullScreen').setAttribute('onclick','ExitFullScreen();');
	}//function RequestFullScreen

	function ExitFullScreen(){
		if(document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}//if
		document.getElementById('FullScreen').src = "images/resize.png";
		document.getElementById('FullScreen').setAttribute('onclick','RequestFullScreen();');
	}//function ExitFullScreen
	
	// Get new display size when window is resized
	window.onresize = function(){
		// Set up something to deal with resized window
	}//onresize

	// Prevent text selection on double-click or click/drag
	window.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);		
	window.addEventListener('keyup', function(e) { 
		if (e.keyCode == 27){
			ExitFullScreen();
		}//if
	}, false);		
	
	//Get the size of the screen
	function getDisplaySize() {
		if (document.body && document.body.offsetWidth) {												// This function will get the width and ...
			winW = document.body.offsetWidth;															// ... height of the broswer and store ...
			winH = document.body.offsetHeight;															// ... them in variables for use in ...
		} //if																							// ... other procedures
		if (document.compatMode=='CSS1Compat' &&	
			document.documentElement &&
			document.documentElement.offsetWidth ) {
			 winW = document.documentElement.offsetWidth;
			 winH = document.documentElement.offsetHeight;
		} //if
		if (window.innerWidth && window.innerHeight) {
			winW = window.innerWidth;
			winH = window.innerHeight;
		} //if
	}//function getDisplaySize
	
	function begin() {
		var id = localStorage.getItem('id') || "00004";
		document.getElementById('treeCanvas').focus();													//Stops multiple return key presses		
		
		layerTree = new Tree(document.getElementById('treeCanvas'));									// Load "treeCanvas"
			var posX, posY;																				//  This procedure checks if the windows height and width
			if (winW%2) {posX = winW - 0.5;} else {posX = winW;}										//   are divisible by 2 and adds a half pixel if they are
			if (winH%2) {posY = winH - 0.5;} else {posY = winH;}										//   this solves an issue where images render fuzzy
			layerTree.addShape(new Shape(posX/2-100,posY/2-50, id, false));					// Insert the first node
		
		show(['menuCanvas']);
		layerMenu = new Menu(document.getElementById("menuCanvas"));																// Create new object for menu
			layerMenu.draw();																			//  Draw the Menu

		layerInfo = new InfoLayer(document.getElementById('infoCanvas'));								// Load "infoCanvas"
			
	}//begin
	
	// Draw a small box in the bottom left showing the scale
	function drawScale() {
		var canvas = document.getElementById("scaleCanvas");											// Load the canvas
				canvas.height = 32;		canvas.width = 62;												// 	Set the canvas dimensions
		var ctx = canvas.getContext("2d");																//  Load the context
		var grd = ctx.createLinearGradient(0, 0, 0, 30);												// Create a gradient to fill the shape
				grd.addColorStop(0.00, "#eeeeee"); 														//  Grey
				grd.addColorStop(0.55, "#bbbbbb"); 														//  Light Grey
				grd.addColorStop(0.55, "#999999"); 														//  Grey
				grd.addColorStop(1.00, "#eeeeee"); 														//  Light Grey
			
		//fixes a problem where double clicking causes text to get selected on the canvas
		canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
		
		ctx.beginPath();																				// Draw the shape
		ctx.moveTo(-1,1);
		ctx.lineTo(51,1);
		ctx.arcTo(61,1,61,11,11);
		ctx.lineTo(61, 35);
		ctx.lineTo(-1,35);
		ctx.closePath();
		
		ctx.fillStyle = grd;																			// Set the properties of the shape
		ctx.fill();
		ctx.lineWidth = 2;																			
		ctx.strokeStyle = "black";
		ctx.stroke();
		
		ctx.font = "14pt 'Lilita One', 'Arial Black', sans-serif";														// Set the properties of the text
		ctx.fillStyle = "#000000"; 																			
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";		
		
		var Percentage;																					// Display the current scale
		if (Multiplier == 0) 		{ Percentage = 100 				  					}
		else if (Multiplier > 0) 	{ Percentage = Math.pow(1.1, Multiplier)*100; 		}
		else						{ Percentage = Math.pow(10/11,0-Multiplier)*100;	};
		ctx.fillText(Percentage.toFixed(0)+"%", 30, 17);
	}//drawScale
	
	
	function GenCounter(value) {
		smoke.alert('This feature is currently unavailable due to bugs.  Sorry :-(');
		
	//	NoGens = value;
	//		document.getElementById('Set2').value = value;
	//		localStorage.setItem('Gens', value);
	
	}//GenCounter

	// Prepare the data in the array of People
	function prepData(){
		var i,j,k,p,q, temp;
		var Children = [];
		var Today = new Date();

		for (var i in People) {
			var a = People[i];
			a.BIRTH.DATE[3] = parseFloat(a.BIRTH.DATE[3]) || 0; 				/*Year*/
			a.DEATH.DATE[3] = parseFloat(a.DEATH.DATE[3]) || 0; 					/*Year*/
			
			if (a.BIRTH.DATE[3] == 0 || a.DEATH.DATE[3] == 0) { a.AGE = '?'; }				// If Birth is Blank, age is not known
			else { a.AGE = a.DEATH.DATE[3] - a.BIRTH.DATE[3]; }									// Else, Calculate AGE
			
			// Decide if Person is alive or not
			if (a.DEATH.DATE[3] == 0 && a.BIRTH.DATE[3] > Today.getFullYear() - 90) {				// If not marked dead and under 100 y.o.
				a.ALIVE = true;															//  Person is assumed alive
				a.AGE = Today.getFullYear() - a.BIRTH.DATE[3]; 								//  Calculate AGE
			} else { a.ALIVE = false; }													// Else, person is dead
		
			if (a.BIRTH.DATE[3] == 0) { a.BIRTH.DATE[3] = ''; }
			if (a.DEATH.DATE[3] == 0) { a.DEATH.DATE[3] = ''; }
		}//for	
		
		
		//Sort Children by Age
		for (i=0, p=Family.length; i<p-1; i++) {
			for (j in Family[i].CHIL) {
				for (k=0, q=People.length; k<q-1; k++) {
					if (Family[i].CHIL[j] == People[k].ID) {
						Children.push(People[k]);
					}//if
				}//for
			}//for
			Family[i].CHIL = [];
			for (j=0; j<Children.length - 1; j++) {
				for (k=j+1; k<Children.length; k++) {
					if (Children[k].BIRTH.DATE[3] < Children[j].BIRTH.DATE[3]) {
						temp = Children[j];
						Children[j] = Children[k];
						Children[k] = temp;
					}//if
				}//for
			}//for
			for (j in Children) {
				Family[i].CHIL.push(Children[j].ID);
			}//for
			Children = [];
		}//for
	}//prepData
	
	// Remove Data of Private Individuals
	function privatiseData() {
		var i,j,p;
		
		for (i=0, p=People.length; i<p-1; i++) {
			if (People[i]._PRIV == 'Y') {
				People[i].BIRTH.DATE[0] = '';	People[i].BIRTH.DATE[1] = '';	People[i].BIRTH.DATE[2] = '';	
				People[i].BIRTH.DATE[3] = '';	People[i].BIRTH.PLAC = '';	People[i].BIRTH.NOTE[5] = '';
				People[i].DEATH.DATE[0] = '';	People[i].DEATH.DATE[1] = '';	People[i].DEATH.DATE[2] = '';
				People[i].DEATH.DATE[3] = '';	People[i].DEATH.PLAC = '';	People[i].DEATH.CAUS = '';

				People[i].EDUC = '';
				People[i].RELI = '';
				People[i].OCCU = '';
				People[i].AGE = '';
			}//if
		}//for
	}//privatiseData


	//Help
	function Help() {
		var box = document.getElementById("helpBox");								// Get the Div
		var btn = document.getElementById("HelpBtn");
		var text, left, top;
		
		if (box.className == "show") { hide(["helpBox"]); }					// Show/Hide the box
		else { show(["helpBox"]); }
			
		if (HelpTopic == "") { return; }
		else if (HelpTopic == "search") {
			text = "Enter as much data as you can about the individual and press the search button";
			left = 155;			top = -245;
		} else if (HelpTopic == "controls") {
			text = "These are the keys/actions which you can use to navigate the website";
			left = 155;			top = -145;
		} else if (HelpTopic == "settings") {
			text = "Changing these settings will change the behaviour/style of the website. <br> <u>Number of Generations</u><br> This will change the number of generations shown in the tree view, including the current generation and their children.";
			left = 155;			top = -145;
		} else if (HelpTopic == "genderChart") {
			text = "This pie chart shows the percentage of males and females in the tree."
			left = 155;			top = -245;
		} else if (HelpTopic == "maleNamesChart") {
			text = "This chart shows the top 5 male names in the tree and the number of occurrences."
			left = 155;			top = -245;
		} else if (HelpTopic == "femaleNamesChart") {
			text = "This chart shows the top 5 female names in the tree and the number of occurrences."
			left = 155;			top = -245;
		} else if (HelpTopic == "surnamesChart") {
			text = "This chart shows the top 5 surnames in the tree and the number of occurrences."
			left = 155;			top = -245;
		} else if (HelpTopic == "relationCalc") {
			text = "Enter the ID's of 2 individuals and the relationship will be calculated."
			left = 155;			top = -245;
		} else if (HelpTopic == "gallery") {
			text = "Click on a thumbnail to view the full photo.  Hover over the photo for links to the people in it.  Click on the photo to close."
			left = 245;			top = -245;
		} else if (HelpTopic == "census") {
			text = "Click on an entry to navigate to the person in the tree."
			left = 245;			top = -245;
		}//if
		
		box.innerHTML = text;
		box.style.marginLeft = btn.style.marginLeft;
		box.style.marginTop = btn.style.marginTop;
	}//Help
	
	
	function showTooltip(id){
		if (TooltipOn) {
			var div = document.getElementById('tooltip');
			var title = ''; var desc = '';
			switch (id) {
				case 1:	title = 'Current Scale'; break;
				case 2:	title = 'Go Home'; 	desc = 'Jump to the person set as the Root Node <br>(this can be edited in Settings)'; break;
				case 3:	title = 'Zoom In'; break;
				case 4:	title = 'Zoom Out'; break;
				case 5:	title = 'Close'; break;
				case 6:	title = 'Help'; break;
				case 7:	title = 'Photo Type'; desc = 'Select the type of photos you are looking for'; break;
				case 8:	title = 'Forename'; desc = 'Insert the forename of the individual'; break;
				case 9:	title = 'Surname'; desc = 'Insert the surname of the individual'; break;
				case 10:	title = 'Birth Year'; desc = 'Insert the birth year of the individual'; break;
				case 11:	title = 'Death Year'; desc = 'Insert the death year of the individual'; break;
				case 12:	title = 'Father'; desc = 'Insert the forename of the individuals father'; break;
				case 13:	title = 'Fathers Surname (auto)'; desc = 'This is the same as the individuals surname'; break;
				case 14:	title = 'Mother'; desc = 'Insert the forename of the individuals mother'; break;
				case 15:	title = 'Maiden Name'; desc = 'Insert the maiden name of the individuals mother'; break;
				case 16:	title = 'Spouse Forename'; desc = 'Insert the forename of the individuals partner'; break;
				case 17:	title = 'Spouse Surname'; desc = 'Insert the surname of the individuals partner'; break;
				case 18:	title = 'Charts'; desc = 'Select the chart you wish to view'; break;
				case 19:	title = 'Map'; desc = 'Show map of birth place (if available)'; break;
				case 20:	title = 'Map'; desc = 'Show map of death place (if available)'; break;
				case 21:	title = 'Census'; desc = 'Show census entry for this person'; break;
				case 22:	title = 'Census'; desc = 'Show census entry for this person'; break;
				case 23:	title = 'Photos'; desc = 'Show photo gallery for this person'; break;
				case 24:	title = 'Left Click'; desc = 'Left click to enlarge the image'; break;
				case 25:	title = 'Export'; desc = 'Export data in GEDCOM or CSV format'; break;
				case 26:	title = 'Set Home Person'; desc = 'This person will be accessible by the Home Person button'; break;
				case 27:	title = 'Edit Person'; desc = 'Edit the information of this person'; break;
				case 28:	title = 'Double Click / Right Click'; desc = 'Double click to display the family of this person<br>Right click to display this persons information'; break;
				case 29:	title = 'Right Click'; desc = 'Right click to view marriage'; break;
				case 30:	title = 'Full Screen'; desc = 'Go to Full Screen.  [Esc] to exit'; break;
				case 31:	title = 'Search'; desc = 'Find this person on FamilySearch.org'; break;
			}//switch
			
			var html = '<b>'+title+'</b>';
			if (desc != '') { html += '<br>' + desc; }
			div.innerHTML = html;
			
			var divRect = div.getBoundingClientRect();
			var height = divRect.bottom - divRect.top;
			var width = divRect.right - divRect.left;
			
			div.style.marginLeft = (-width/2) + 'px';
			div.style.marginTop = (-height) + 'px';
			show(['tooltip']);
		}//if
	}//function
	 
	function hideTooltip(){						//This whole thing is useless
	 var div = document.getElementById('tooltip');
	 div.className = 'hide';
	}
	
	/** MODULAR FUNCTIONS ******************************************************************************/
	/***************************************************************************************************/
	/***************************************************************************************************/
	/***************************************************************************************************/
	
	
	function hide(elements) {
		for (var i = 0; i < elements.length; i++) {
			document.getElementById(elements[i]).className='hide';
		}//for
	}//showHide
	
	function show(elements) {
		for (var i = 0; i < elements.length; i++) {
			document.getElementById(elements[i]).className='show';
		}//for
	}//showHide
	
	function hideElements() {
		hide(["CloseBtn","HelpBtn","helpBox","Window_BG"]);
	}//hideElements
	
	
	// Modular function for drawing a rounded rectangle
	function drawRoundedRectangle(ctx,x,y,w,h,r,fill){
		ctx.beginPath();																				// Begin the outline of the shape
		ctx.moveTo(x + r, y);																			// ...
		ctx.lineTo(x + w - r, y);																		// ...
		ctx.arcTo(x + w, y, x + w, y + r, r);															// ...
		ctx.arcTo(x + w, y + h, x + w - r, y + h, r);													// Draw the shape
		ctx.lineTo(x + r, y + h);																		// ...
		ctx.arcTo(x, y + h, x, y + h - r, r);															// ...
		ctx.arcTo(x, y, x + r, y, r);																	// ...
		ctx.closePath();																				// Finish the outline of the shape
	}//DrawRoundedRectangle
	
	
	function title(ctx,text,x,y) {
		ctx.font = "24pt 'Lilita One', 'Arial Black', sans-serif";														// Font size / type
		ctx.fillStyle = "#000000"; 																		// Text color
		ctx.textAlign = "center";																			// Text Alignment
		ctx.textBaseline = "top";																		// Baseline of text
		ctx.fillText(text,x,y);																			// Text and position of title
	}// formatTitle