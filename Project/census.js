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

	function displayCensus(ID){ 
		HelpTopic = "census";
		
		show(['Window_BG']);
		var div = document.getElementById('Window');
		var body = document.getElementById('Window_BODY');
		var title = document.getElementById('Window_TITLE');
			 title.innerText = census[ID].YEAR + ' Census';
			div.className = "census";
		var text = [];		
		var a = census[ID];
		var b = '';
		var c = '';
		
		text = ["<table><tr><td><u>Piece No:</u> ",a.PIEC,"</td><td><u>Place:</u> ",a.PLAC,"</td><td><u>District:</u> ",
				a.DIST,"</td></tr><tr><td><u>Parish:</u> ",a.PARI,"</td><td><u>Folio:</u> ",a.FOLI,"</td><td><u>Page:</u> ",a.PAGE,
				"</td></tr><tr><td><u>Address:</u> ",a.ADDR,"</td><td><u>Source:</u> <a target='_blank' href='",a.SRC,"'>",a.SRC,
				"</a></td></tr></table><br />"];
		
		if (census[ID].YEAR == "1841") {
			text.push("<div class='holder'><table><thead><tr><th>SURNAME</th><th>FORENAME</th><th>AGE</th><th>SEX</th><th>OCCUPATION</th><th>WHERE BORN?</th></tr></thead><tbody>");
			
			for (var i=0; i<a.WHO.length; i++){
				c = (parseFloat(a.WHO[i].ID) - 1) || null;
				b = People[c] || null;
				
				text.push("<tr");
				if (i%2) { text.push(' class="alt"'); }
				if (b) { text.push(' onClick="getPerson(',"'",b.ID,"'",'); return false;"'); }
				text.push("><td>",(a.WHO[i].SURN || b.NAME.SURN),"</td><td>",(a.WHO[i].GIVN || b.NAME.GIVN ),"</td><td>",a.WHO[i].AGE,"</td><td>",(a.WHO[i].GEND || b.GEND.toUpperCase()),"</td><td>",a.WHO[i].OCCU,"</td><td>",a.WHO[i].BORN,"</td></tr>");
			}//for
			text.push("<tbody></table></div>");
		}// 1841
		else if (census[ID].YEAR == "1851") {
			text.push("<div class='holder'><table><thead><tr><th>SURNAME</th><th>FORENAME</th><th>REL</th><th>STATUS</th><th>SEX</th><th>AGE</th><th>OCCUPATION</th><th>WHERE BORN?</th></tr></thead><tbody>");
			
			for (var i=0; i<a.WHO.length; i++){
				c = (parseFloat(a.WHO[i].ID) - 1) || null;
				b = People[c] || null;
				
				text.push("<tr");
				if (i%2) { text.push(' class="alt"'); }
				if (b) { text.push(' onClick="getPerson(',"'",b.ID,"'",'); return false;"'); }
				text.push("><td>",(a.WHO[i].SURN || b.NAME.SURN),"</td><td>",(a.WHO[i].GIVN || b.NAME.GIVN),"</td><td>",a.WHO[i].REL,"</td><td>",(a.WHO[i].STAT || ' '),"</td><td>",(a.WHO[i].GEND || b.GEND.toUpperCase()),"</td><td>",a.WHO[i].AGE,"</td><td>",a.WHO[i].OCCU,"</td><td>",a.WHO[i].BORN,"</td></tr>");
			}//for		
			text.push("</tbody></table></div>");
		}// 1851
		
		var URIhtml = generateCensusHtml(a);
		var URIcsv = generateCensusCSV(a);
		
		text.push("<br><table><tr><td>");
		text.push("Export: &nbsp; </td><td><span onClick='downloadCensus("+'"html","'+URIhtml+'"'+");'>Html</span></td>");
		text.push("<td><span onClick='downloadCensus("+'"csv","'+URIcsv+'"'+");'>CSV</span></td>");
		text.push("</td></tr></table>");
		
		body.innerHTML = text.join('');
		var w = div.offsetWidth;		var h = div.offsetHeight;
			div.setAttribute('style','margin-top:-'+h/2+'px; top: 50%;');
		
		document.getElementById("CloseBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-48)+'px;');
		document.getElementById("HelpBtn").setAttribute('style','margin-top:-'+(h/2-7)+'px; margin-left:+'+(w/2-93)+'px;');
		show(["CloseBtn","HelpBtn"]);
	}

	
	function downloadCensus(type, URI){
		var msg = '';
		if (type == "html") {
			msg = 'You are downloading this census in HTML format<br><b>Please end the filename with <style="color: red;">.htm</b><style="color: #000000"><br>i.e. "Census1.htm"';
		} else if (type == "csv") {
			msg = 'You are downloading this census in CSV format<br><b>Please end the filename with <style="color: red;">.csv</b><style="color: #000000"><br>i.e. "Census1.csv"';
		}//type
		smoke.confirm(msg,function(e){
			if (e){
				window.open(URI);
			}//if
		}, {ok:"Download", cancel:"Cancel"});
		
	}//download
	
	function generateCensusHtml(a){
		var text = []; 
		text.push("<html><body><table><tr><td><b>Peice No:</b> ",a.PIEC,"</td><td><b>Place:</b> ",a.PLAC,"</td><td><b>District:</b> ");
		text.push(a.DIST,"</td></tr><tr><td><b>Parish:</b> ",a.PARI,"</td><td><b>Folio:</b> ",a.FOLI,"</td><td><b>Page:</b> ",a.PAGE);
		text.push("</td></tr><tr><td><b>Address:</b> ",a.ADDR);
		text.push("</a></td></tr></table><br />");
		
		if (a.YEAR == "1841") {
			text.push("<table><tr><th>SURNAME</th><th>FORENAME</th><th>AGE</th><th>SEX</th><th>OCCUPATION</th><th>WHERE BORN?</th></tr>");
			
			for (var i=0; i<a.WHO.length; i++){
				c = (parseFloat(a.WHO[i].ID) - 1) || null;
				b = People[c] || null;
				
				text.push("<tr><td>",(a.WHO[i].SURN || b.NAME.SURN),"</td><td>",(a.WHO[i].GIVN || b.NAME.GIVN ),"</td><td>",a.WHO[i].AGE,"</td><td>",(a.WHO[i].GEND || b.GEND.toUpperCase()),"</td><td>",a.WHO[i].OCCU,"</td><td>",a.WHO[i].BORN,"</td></tr>");
			}//for
		}// 1841
		else if (a.YEAR == "1851") {
			text.push("<table><tr><th>SURNAME</th><th>FORENAME</th><th>REL</th><th>STATUS</th><th>SEX</th><th>AGE</th><th>OCCUPATION</th><th>WHERE BORN?</th></tr>");
			
			for (var i=0; i<a.WHO.length; i++){
				c = (parseFloat(a.WHO[i].ID) - 1) || null;
				b = People[c] || null;
				
				text.push("<tr><td>",(a.WHO[i].SURN || b.NAME.SURN + '*'),"</td><td>",(a.WHO[i].GIVN || b.NAME.GIVN + '*'),"</td><td>",a.WHO[i].REL,"</td><td>",(a.WHO[i].STAT || ' '),"</td><td>",(a.WHO[i].GEND || b.GEND.toUpperCase() + '*'),"</td><td>",a.WHO[i].AGE,"</td><td>",a.WHO[i].OCCU,"</td><td>",a.WHO[i].BORN,"</td></tr>");
			}//for	
		}//else
		
		text.push("</table></body></html>"); 
		var URI = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(text.join(''));
		return URI;
	}//generateHtml

	function generateCensusCSV(a){
		var text = []; 
		text.push("Peice No:",a.PIEC,"\r\nPlace:",a.PLAC,"\r\nDistrict:");
		text.push(a.DIST,"\r\nParish:",a.PARI,"\r\nFolio:",a.FOLI,"\r\nPage:",a.PAGE);
		text.push("\r\nAddress:",a.ADDR, "\r\n");
		
		if (a.YEAR == "1841") {
			text.push("\r\nSURNAME","FORENAME","AGE","SEX","OCCUPATION","WHERE BORN?");
			
			for (var i=0; i<a.WHO.length; i++){
				c = (parseFloat(a.WHO[i].ID) - 1) || null;
				b = People[c] || null;
				
				text.push("\r\n" + (a.WHO[i].SURN || b.NAME.SURN),(a.WHO[i].GIVN || b.NAME.GIVN ),a.WHO[i].AGE,(a.WHO[i].GEND || b.GEND.toUpperCase()),a.WHO[i].OCCU,a.WHO[i].BORN);
			}//for
		}// 1841
		else if (a.YEAR == "1851") {
			text.push("\r\nSURNAME","FORENAME","REL","STATUS","SEX","AGE","OCCUPATION","WHERE BORN?");
			
			for (var i=0; i<a.WHO.length; i++){
				c = (parseFloat(a.WHO[i].ID) - 1) || null;
				b = People[c] || null;
				
				text.push("\r\n" + (a.WHO[i].SURN || b.NAME.SURN + '*'),(a.WHO[i].GIVN || b.NAME.GIVN + '*'),a.WHO[i].REL,(a.WHO[i].STAT || ' '),(a.WHO[i].GEND || b.GEND.toUpperCase() + '*'),a.WHO[i].AGE,a.WHO[i].OCCU,a.WHO[i].BORN);
			}//for	
		}//else
		
		var URI = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(text.join(','));
		return URI;
	}//generateCSV
















