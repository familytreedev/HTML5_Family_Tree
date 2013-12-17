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

	// Detect graph selection
	function getGraph(a) {
		if      (a == '1') { genderSplit();		}
		else if (a == '2') { topMaleNames();		}
		else if (a == '3') { topFemaleNames();	}
		else if (a == '4') { topSurnames();		}
		else { smoke.signal("Oops! Something has gone wrong!"); }
	}//getGraph
	
	
	//Draw the background for the graphs
	function graphBg() {
		show(['Window_BG']);
		var body = document.getElementById('Window_BODY');
		var title = document.getElementById('Window_TITLE');
		var div = document.getElementById('Window');
			body.innerHTML = Node_Charts.innerHTML;
			title.innerText = 'Graphs & Charts';
			div.className = "graph";
			
		var w = div.offsetWidth;		var h = div.offsetHeight;
			div.setAttribute('style','margin-top:-'+h/2+'px; top: 50%;');
		
		document.getElementById("CloseBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-48)+'px;');
		document.getElementById("HelpBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-93)+'px;');
		show(["CloseBtn","HelpBtn"]);
	}//graphBg
	
	
	// Draws a pie chart showing the percentages of men and women
	function genderSplit() {
		HelpTopic = "genderChart";
		
		graphBg();
		
		var canvas = document.getElementById("charts_CANVAS");
		var ctx = canvas.getContext("2d");
		
		var x = 275;		var y = 200;
		
		title(ctx,"Gender Distribution", x, y - 199);								
		
		var male, female, unknown, total, mPercent, fPercent, mArc, fArc;
		
		var grd = ctx.createRadialGradient(x, y, 0, x, y, 150);					//Male Gradient
		var grd2 = ctx.createRadialGradient(x, y, 0, x, y, 150);				//Male Gradient
		var grd3 = ctx.createRadialGradient(x, y, 0, x, y, 150);				//Male Gradient
		
		male = 0.0;																// Initialise Variables
		female = 0.0;
		unknown = 0.0;
		
		for (var i=0, p=People.length; i<p-1; i++){							// Go through People
			if (People[i].GEND == 'M') { male += 1; }							// Add 1 to males if male
			else if (People[i].GEND == 'F') { female += 1; }				// Add 1 to females if female
			else { unknown += 1; }													// Add 1 to unknown if unknown
		}//for
		
		total = male + female + unknown;													// Total People
		mPercent = male/total;													// Percentage of males
		fPercent = female/total;												// Percentage of females
		uPercent = unknown/total;												// Percentage of females
		
		mArc = mPercent * 2 * Math.PI;											// Gives length of arc for pie chart
		fArc = fPercent * 2 * Math.PI;											// Gives length of arc for pie chart
		uArc = uPercent * 2 * Math.PI;											// Gives length of arc for pie chart
		
		grd.addColorStop(0, '#aaffff');
		grd.addColorStop(1, '#00aaff');
		ctx.beginPath();														// Draw Male Section
		ctx.moveTo(x,y);
		ctx.arc(x,y,150,0,mArc,false);
		ctx.closePath();
		ctx.fillStyle = grd;
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000000';
		ctx.stroke();
		
		grd2.addColorStop(0, '#ffdddd');										// Draw Female Section
		grd2.addColorStop(1, '#ff3333');
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.arc(x,y,150,mArc,fArc +mArc,false);
		ctx.closePath();
		ctx.fillStyle = grd2;
		ctx.fill();
		ctx.strokeStyle = '#000000';
		ctx.stroke();
		
		grd3.addColorStop(0, '#ffffff');										// Draw Female Section
		grd3.addColorStop(1, '#aaaaaa');
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.arc(x,y,150,mArc+fArc,0,false);
		ctx.closePath();
		ctx.fillStyle = grd3;
		ctx.fill();
		ctx.strokeStyle = '#000000';
		ctx.stroke();
		
		ctx.font = "16pt 'Lilita One', cursive";								// Labels
		ctx.textAlign = "center";																		
		ctx.textBaseline = "middle";																	
		ctx.fillStyle = '#000000';
		ctx.fillText((mPercent*100).toFixed(2) + '% - ' + male, x, y + 30);
		ctx.fillText('Men', x, y + 70);
		ctx.fillText((fPercent*100).toFixed(2) + '% - ' + female, x, y - 30);
		ctx.fillText('Women', x, y -70);
		ctx.textAlign = "left";		
		if (unknown > 0) {
			ctx.fillText((uPercent*100).toFixed(2) + '% - ' + unknown, x + 155, y + 10);
			ctx.fillText('Unknown', x + 155, y - 10);
		}//if
		
	}//GenderSplit
	
	
	// Draws a bar chart showing the top 5 male names in the tree
	function topMaleNames() {
		HelpTopic = "maleNamesChart";
		
		graphBg();
		
		var canvas = document.getElementById("charts_CANVAS");
		var ctx = canvas.getContext("2d");
			
		var Names = [];		var Number = [];	var NewName = false;
		var x = 275;			var y = 200;		var Total;
		
		title(ctx,"Most Popular Male Names", x, y - 199);													// Place the title
		
		for (var i=0, p=People.length; i<p-1; i++){															// Get number of occurrences of each name
			if (People[i].GEND == 'M' && People[i].NAME.GIVN[0] != "Private") {
				for (var j=0, q=Names.length; j<=q; j++) {
					if (People[i].NAME.GIVN[0] == Names[j]) {
						Number[j] ++;
						NewName = false;
						break;
					} else {
						NewName = true;
					}//if..else..
				}//for
				if (NewName) {
					Names.push(People[i].NAME.GIVN[0]);
					Number.push(1);
					NewName = false;
				}//if
			}//if
		}//for
		
		var tempName, tempNo;											// Order the list of names
		for (var i=0; i<5; i++) {
			for (var j=Number.length; j>i; j--) {
				if (Number[j] > Number[i]) {
					tempName = Names[i];
					tempNo = Number[i];
					Names[i] = Names[j];
					Number[i] = Number[j];
					Names[j] = tempName;
					Number[j] = tempNo;
				}//if
			}//for
		}//for
		Names.splice(5,Names.length);		Number.splice(5,Number.length);
		Names.splice(5,Names.length);		Number.splice(5,Number.length);
		
		Total = Number[0] + Number[1] + Number[2] + Number[3] + Number[4];
		
		x -= 150;		y += 70.5;
		
		ctx.beginPath();
		ctx.moveTo(x-20,y);
		ctx.lineTo(x+320,y);
		ctx.stroke();
		for (var i=0; i<5; i++) {
			h = Number[i]*3;
			var grd3 = ctx.createLinearGradient(x,y-h,x,y);
			grd3.addColorStop(0, '#00ccff');
			grd3.addColorStop(1, '#0000ff');
			ctx.beginPath();
			ctx.rect(x+10,y,40,-h);
			ctx.fillStyle = grd3;
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = "#000000";
			ctx.fillText(Number[i],x+15,y-h-45);
			
			x += 60;
		}//for
		
		ctx.font = "18pt 'Lilita One', cursive";
		ctx.fillStyle = "#000000";
		
		x = 275;		y += 15;
		ctx.textAlign = "center";																		
		ctx.textBaseline = "middle";
		ctx.fillText(Names[0],x-120,y+30);
		ctx.fillText(Names[1],x-60,y);
		ctx.fillText(Names[2],x,y+30);
		ctx.fillText(Names[3],x+60,y);
		ctx.fillText(Names[4],x+120,y+30);
	}//topMaleNames
	
	
	function topFemaleNames() {
		HelpTopic = "femaleNamesChart";
		
		graphBg();
		
		var canvas = document.getElementById("charts_CANVAS");
		var ctx = canvas.getContext("2d");
				
		var Names = [];		var Number = [];	var NewName = false;
		var x = 275;		var y = 200;		var Total;
		
		title(ctx,"Most Popular Female Names", x, y - 199);							
		
		for (var i=0, p=People.length; i<p-1; i++){										// Get number of occurrences of each name
			if (People[i].GEND == 'F' && People[i].NAME.GIVN[0] != "Private") {
				for (var j=0, q=Names.length; j<=q; j++) {
					if (People[i].NAME.GIVN[0] == Names[j]) {
						Number[j] += 1;
						NewName = false;
						break;
					} else {
						NewName = true;
					}//if..else..
				}//for
				if (NewName) {
					Names.push(People[i].NAME.GIVN[0]);
					Number.push(1);
					NewName = false;
				}//if
			}//if
		}//for
		
		var tempName, tempNo;											// Order the list of names
		for (var i=0; i<5; i++) {
			for (var j=Number.length; j>i; j--) {
				if (Number[j] > Number[i]) {
					tempName = Names[i];
					tempNo = Number[i];
					Names[i] = Names[j];
					Number[i] = Number[j];
					Names[j] = tempName;
					Number[j] = tempNo;
				}//if
			}//for
		}//for
		Names.splice(5,Names.length);		Number.splice(5,Number.length);
		Names.splice(5,Names.length);		Number.splice(5,Number.length);
		
		Total = Number[0] + Number[1] + Number[2] + Number[3] + Number[4];
		
		x -= 150;		y += 70.5;
		
		ctx.beginPath();
		ctx.moveTo(x-20,y);
		ctx.lineTo(x+320,y);
		ctx.stroke();
		for (var i=0; i<5; i++) {
			h = Number[i]*3;
			var grd3 = ctx.createLinearGradient(x,y-h,x,y);
			grd3.addColorStop(0, '#ffdddd');
			grd3.addColorStop(1, '#ff0000');
			ctx.beginPath();
			ctx.rect(x+10,y,40,-h);
			ctx.fillStyle = grd3;
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = "#000000";
			ctx.fillText(Number[i],x+15,y-h-45);
			
			x += 60;
		}//for
		
		ctx.font = "18pt 'Lilita One', cursive";
		ctx.fillStyle = "#000000";
		
		x = 275;		y += 15;
		ctx.textAlign = "center";																		
		ctx.textBaseline = "middle";
		ctx.fillText(Names[0],x-120,y+30);
		ctx.fillText(Names[1],x-60,y);
		ctx.fillText(Names[2],x,y+30);
		ctx.fillText(Names[3],x+60,y);
		ctx.fillText(Names[4],x+120,y+30);
	}//topFemaleNames
	
	
	// Draws graph of top surnames
	function topSurnames() {
		HelpTopic = "surnamesChart";
		
		graphBg();
		
		var canvas = document.getElementById("charts_CANVAS");
		var ctx = canvas.getContext("2d");
				
		var Names = [];		var Number = [];	var NewName = false;
		var x = 275;		var y = 200;		var Total;
		
		title(ctx,"Most Researched Surnames", x, y - 199);							// Text and position of text in shape
		
		for (var i=0, p=People.length; i<p-1; i++){											// Get number of occurrences of each name
			if (People[i].NAME.GIVN[0] != "Private") {
				for (var j=0, q=Names.length; j<=q; j++) {
					if (People[i].NAME.SURN == Names[j]) {
						Number[j] += 1;
						NewName = false;
						break;
					} else {
						NewName = true;
					}//if..else..
				}//for
				if (NewName) {
					Names.push(People[i].NAME.SURN);
					Number.push(1);
					NewName = false;
				}//if
			}//if
		}//for
		
		var tempName, tempNo;											// Order the list of names
		for (var i=0; i<5; i++) {
			for (var j=Number.length; j>i; j--) {
				if (Number[j] > Number[i]) {
					tempName = Names[i];
					tempNo = Number[i];
					Names[i] = Names[j];
					Number[i] = Number[j];
					Names[j] = tempName;
					Number[j] = tempNo;
				}//if
			}//for
		}//for
		Names.splice(5,Names.length);		Number.splice(5,Number.length);
		Names.splice(5,Names.length);		Number.splice(5,Number.length);
		
		Total = Number[0] + Number[1] + Number[2] + Number[3] + Number[4];
		
		x -= 150;		y += 70.5;
		
		ctx.beginPath();
		ctx.moveTo(x-20,y);
		ctx.lineTo(x+320,y);
		ctx.stroke();
		for (var i=0; i<5; i++) {
			h = Number[i]*3;
			var grd3 = ctx.createLinearGradient(x,y-h,x,y);
			grd3.addColorStop(0, '#00ff00');
			grd3.addColorStop(1, '#009900');
			ctx.beginPath();
			ctx.rect(x+10,y,40,-h);
			ctx.fillStyle = grd3;
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = "#000000";
			ctx.fillText(Number[i],x+15,y-h-45);
			
			x += 60;
		}//for
		
		ctx.font = "18pt 'Lilita One', cursive";
		ctx.fillStyle = "#000000";
		
		x = 275;		y += 15;
		ctx.textAlign = "center";																		
		ctx.textBaseline = "middle";
		ctx.fillText(Names[0],x-120,y+30);
		ctx.fillText(Names[1],x-60,y);
		ctx.fillText(Names[2],x,y+30);
		ctx.fillText(Names[3],x+60,y);
		ctx.fillText(Names[4],x+120,y+30);
	}//topFemaleNames
	
	
	
	
	