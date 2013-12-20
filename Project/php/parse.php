<?php 

/** This is the code for uploading a file to the server **/
/** Commented out bits weren't working but control the  **/
/** Allowable extension types and the maximum file size **/


//$allowedExts = array(".ged");
//$extension = end(explode(".", $_FILES["file"]["name"]));
//if (($_FILES["file"]["size"] < 500000)
//&& in_array($extension, $allowedExts))
 // {
/*
 if ($_FILES["file"]["error"] > 0)
    {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
    }
  else
    {
    echo "Upload: " . $_FILES["file"]["name"] . "<br>";
    echo "Type: " . $_FILES["file"]["type"] . "<br>";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
    echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";

    if (file_exists("upload/" . $_FILES["file"]["name"]))
      {
      echo $_FILES["file"]["name"] . " already exists. ";
      }
    else
      {
      move_uploaded_file($_FILES["file"]["tmp_name"],
      "upload/" . $_FILES["file"]["name"]);
      echo "Stored in: " . "upload/" . $_FILES["file"]["name"];
      }
    }
 // }
//else
//  {
//  echo "Invalid file";
//  }

*/

$gedcom=fopen("upload/tree.ged","r") or exit("Unable to open gedcom!");
$peoplejs=fopen("upload/people.js","w") or exit ("Unable to write output - People.js");
$familyjs=fopen("upload/family.js","w") or exit ("Unable to write output - Family.js");
$sourcejs=fopen("upload/source.js","w") or exit ("Unable to write output - Source.js");

$Person = array();
$Family = array();
$Source = array();

//list of acceptable tags
$tags = array ('ABBR','ABBR','ADR1','ADR2','ADOP','AFN ','AGE ','AGNC','ALIA','ANCE','ANCI','ANUL','ASSO','AUTH','BAPL','BAPM','BARM','BASM','BIRT','BLES','BLOB','BURI','CALN','CAST','CAUS','CENS','CHAN','CHAR','CHIL','CHR ','CHRA','CITY','CONC','CONF','CONL','CONT','COPR','CORP','CREM','CTRY','DATA','DATE','DEAT','DESC','DESI','DEST','DIV ','DIVF','DSCR','EDUC','EMIG','ENDL','ENGA','EVEN','FAM ','FAMC','FAMF','FAMS','FCOM','FILE','FORM','GEDC','GIVN','GRAD','HEAD','HUSB','IDNO','IMMI','INDI','LANG','LEGA','MARB','MARC','MARL','MARR','MARS','MEDI','NAME','NATI','NATU','NCHI','NICK','NMR ','NOTE','NPFX','NSFX','OBJE','OCCU','ORDI','ORDN','PAGE','PEDI','PHON','PLAC','POST','PROB','PROP','PUBL','QUAY','REFN','RELA','RELI','REPO','RESI','RESN','RETI','RFN ','RIN ','ROLE','SEX ','SLGC','SLGS','SOUR','SPFX','SSN','STAE','STAT','SUBM','SUBN','SURN','TEMP','TEXT','TIME','TITL','TRLR','TYPE','VERS','WIFE','WILL');
//List of event types
$events = array ('ANUL','BAPL','BAPM','BARM','BASM','BIRT','BLES','BURI','CENS','CHR ','CHRA','CONF','CONL','CREM','DEAT','DIV ','DIVF','EDUC','EMIG','EDUC','ENDL','ENGA','EVEN','FCOM','GRAD','IMMI','MARB','MARC','MARL','MARR','MARS','NATU','OCCU','ORDN','PROB','SOUR','WILL');

/**********************Extract Data from the File****************/
// Variables
$level = 0;
$famNo = 0;
$srcNo = 0;
$no = 0;

//Read gedcom file line-by-line
while(!feof($gedcom)) {
  
   $line = fgets($gedcom);															//Copy the line from the file into a string
	$level = substr($line,0,1);													//Get the level of information i.e. 0(new person), 1(Info about person)
  
	if ($level == 0) {																//If the level of the data is 0
		$rec_type = getTagType($line);
		
		if ($rec_type == 'Ind') {															//If the record is an individual
			$no = count($Person);													//Set number to the length of the array
			$ID = sprintf("%05d",$no + 1);										//ID is number+1 with 5 leading zeros
			$Person[$no]['ID'] = $ID;												//Set Person ID
		}//if
		else if ($rec_type == 'Fam') {													//If the record is a Family
			$fno = count($Family);													//Set family number to the length of the array
			$ID = sprintf("%05d",$fno + 1);										//ID is number+1 with 5 leading zeros
			$Family[$fno]['GedID'] = formatID($line);							//Set GedcomID
			$Family[$fno]['ID'] = $ID;												//Set Person ID
		}//if
		else if ($rec_type == 'Src') {											//If the record is a Source
			$sno = count($Source);													//Set source number to the length of the array
			$ID = sprintf("%05d",$sno + 1);										//ID is number+1 with 5 leading zeros
			$Source[$sno]['GedID'] = formatID($line);							//Set GedcomID
			$Source[$sno]['ID'] = $ID;												//Set Person ID
		}//if
		else if ($rec_type == 'Trlr') {											//If the record is a Trailer (Footer)
			//Do nothing
		}//if
		else if ($rec_type == 'Head') {											//If the record is a Header
			//Do nothing
		}//if
		
	} else {																				//If the level > 0 (The line is an item of a record)
		$tag = substr($line,2,4);													// Get the Tag
		if (in_array($tag, $events) !== false) { $event = $tag; }			//Certain tags are events
		
		if ($rec_type == 'Ind') {
			//Extract the information using the tags
			// ADD: if infotype='NAME' then run a function to parse name;
				  if ($tag == 'GIVN') {	$Person[$no]['GIVN'] = formatGIVN($line); }
			else if ($tag == 'SURN') {	$Person[$no]['SURN'] = strtoupper(trim(substr($line,7,strlen($line)))); }
			else if ($tag == 'NPFX') {	$Person[$no]['NPFX'] = trim(substr($line,7,strlen($line))); }
			else if ($tag == 'NSFX') {	$Person[$no]['NSFX'] = trim(substr($line,7,strlen($line))); }
			else if ($tag == 'SPFX') {	$Person[$no]['SPFX'] = trim(substr($line,7,strlen($line))); }
			else if ($tag == 'NICK') {	$Person[$no]['NICK'] = trim(substr($line,7,strlen($line))); }
			else if ($tag == 'SEX ') {	$Person[$no]['GEND'] = strtoupper(trim(substr($line,6,1))); }
			else if ($tag == 'RELI') {	$Person[$no]['RELI'] = trim(substr($line,7,strlen($line))); }
			else if ($tag == 'CAUS') {	$Person[$no]['CAUS'] = trim(substr($line,7,strlen($line))); }
			else if ($tag == '_PRI') {	$Person[$no]['_PRIV'] = trim(substr($line,8,1)); }
			
			//The following info is a little more complicated		
			else if ($tag == 'OCCU') {
				if (array_key_exists($tag, $Person[$no]) !== true) { 								//If OCCU array doesn't exist
					$Person[$no][$tag][0] = trim(substr($line,7,strlen($line))); 						//Create it and add the occupation
				} else {
					$i = count($Person[$no][$tag]);														// i is the length of the OCCU array
					$Person[$no][$tag][$i] = trim(substr($line,7,strlen($line)));						// Add the occupation to the end of the array
				}//array_key_exists OCCU
			}//tag == OCCU
			
			else if ($tag == 'FAMS') {
				if (array_key_exists('FAMS', $Person[$no]) !== true) { 							//If FAMS array doesn't exist
					$Person[$no]['FAMS'][0] = trim(substr($line,7,strlen($line))); 		//Create it and add the family
				} else {
					$i = count($Person[$no]['FAMS']);													// i is the length of the FAMS array
					$Person[$no]['FAMS'][$i] = trim(substr($line,7,strlen($line)));		// Add the familyID to the end of the array
				}//array_key_exists FAMS
			}//tag == FAMS
			
			else if ($tag == 'FAMC') {
				$Person[$no]['FAMC'] = trim(substr($line,7,strlen($line)));
			}//tag == FAMC
			
			
			//The following are tags for events ********************************************************
			
			else if ($tag == 'DATE') {																		//If the info is a DATE
				//Make a function for formatting the date
					  if ($event == 'BIRT') {		$Person[$no]['DOB'] = formatDate(substr($line,7,strlen($line)));		}		//Birthdate
				else if ($event == 'BURI') {		$Person[$no]['BURD'] = formatDate(substr($line,7,strlen($line)));		}		//Burial Date
				else if ($event == 'DEAT') {		$Person[$no]['DOD'] = formatDate(substr($line,7,strlen($line)));		}		//Deathdate
			}//tag == DATE
			
			else if ($tag == 'PLAC') {																		//If the info is a PLACE
					  if ($event == 'BIRT') {		$Person[$no]['POB'] = trim(substr($line,7,strlen($line)));		}		//Birthdate
				else if ($event == 'BURI') {		$Person[$no]['BURP'] = trim(substr($line,7,strlen($line)));		}		//Burial Date
				else if ($event == 'DEAT') {		$Person[$no]['POD'] = trim(substr($line,7,strlen($line)));		}		//Deathdate
				else if ($event == 'EDUC') {		$Person[$no]['EDUC'] = trim(substr($line,7,strlen($line)));		}		//Deathdate
			}//tag == PLAC
			
			else if ($tag == 'NOTE') {																		//If the info is a PLACE
					  if ($event == 'BIRT') {		$Person[$no]['NOB'] = trim(substr($line,7,strlen($line)));		}		//Birthdate
				else if ($event == 'DEAT') {		$Person[$no]['NOD'] = trim(substr($line,7,strlen($line)));		}		//Deathdate
			}//tag == NOTE
			
			else if ($tag == 'SOUR') {																		//If the info is a PLACE
					  if ($event == 'BIRT') {		$Person[$no]['SOB'] = trim(substr($line,7,strlen($line)));		}		//Birthdate
				else if ($event == 'BURI') {		$Person[$no]['BURS'] = trim(substr($line,7,strlen($line)));		}		//Burial Date
				else if ($event == 'DEAT') {		$Person[$no]['SOD'] = trim(substr($line,7,strlen($line)));		}		//Deathdate
				}//tag == SOURCE
		
		}//Individual Tags
		else if ($rec_type == 'Fam') {
			
			if ($event == 'MARR') {
				if ($tag == 'DATE') {		$Family[$fno]['D_MAR'] = formatDate(substr($line,7,strlen($line)));	}		//Marriage Date
				if ($tag == 'PLAC') {		$Family[$fno]['P_MAR'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'NOTE') {		$Family[$fno]['N_MAR'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'SOUR') {		$Family[$fno]['S_MAR'] = trim(substr($line,7,strlen($line)));	}				
			}//Marriage Info
			else if ($event == 'ENGA') {		//Engagement
				if ($tag == 'DATE') {		$Family[$fno]['D_ENG'] = formatDate(substr($line,7,strlen($line)));	}		
				if ($tag == 'PLAC') {		$Family[$fno]['P_ENG'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'NOTE') {		$Family[$fno]['N_ENG'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'SOUR') {		$Family[$fno]['S_ENG'] = trim(substr($line,7,strlen($line)));	}			
			}//Engagement Info
			else if ($event == 'ANUL') {		//Annulment
				if ($tag == 'DATE') {		$Family[$fno]['D_ANL'] = formatDate(substr($line,7,strlen($line)));	}		
				if ($tag == 'PLAC') {		$Family[$fno]['P_ANL'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'NOTE') {		$Family[$fno]['N_ANL'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'SOUR') {		$Family[$fno]['S_ANL'] = trim(substr($line,7,strlen($line)));	}				
			}//Annulment Info
			else if ($event == 'DIV ') {		//Divorce
				if ($tag == 'DATE') {		$Family[$fno]['D_DIV'] = formatDate(substr($line,7,strlen($line)));	}		
				if ($tag == 'PLAC') {		$Family[$fno]['P_DIV'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'NOTE') {		$Family[$fno]['N_DIV'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'SOUR') {		$Family[$fno]['S_DIV'] = trim(substr($line,7,strlen($line)));	}				
			}//Divorce Info
			else if ($event == 'MARB') {		//Marriage Bann
				if ($tag == 'DATE') {		$Family[$fno]['D_MRB'] = formatDate(substr($line,7,strlen($line)));	}		
				if ($tag == 'PLAC') {		$Family[$fno]['P_MRB'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'NOTE') {		$Family[$fno]['N_MRB'] = trim(substr($line,7,strlen($line)));	}				
				if ($tag == 'SOUR') {		$Family[$fno]['S_MRB'] = trim(substr($line,7,strlen($line)));	}				
			}//MARB Info
			
		}//Family Tags
		else if ($rec_type == 'Src') {
		
				  if ($tag == 'TITL') {	$Source[$sno]['TITL'] = trim(substr($line,7,strlen($line))); }	
			else if ($tag == 'PUBL') {	$Source[$sno]['PUBL'] = trim(substr($line,7,strlen($line))); }	
			else if ($tag == 'AGNC') {	$Source[$sno]['AGNC'] = trim(substr($line,7,strlen($line))); }	
			else if ($tag == 'TEXT') {	$Source[$sno]['TEXT'] = trim(substr($line,7,strlen($line))); }	
			
		}//Source Tags
		else {
			//Do nothing for headers/trailers
		}//Record_Type
		
	}//if level > 1
	
}//while (Reading Gedcom)

/*********************************Sort out Families **************************************************/
foreach ($Family as &$a) {
	foreach ($Person as &$b) {		
		if (isset ($b['FAMS']) !== false) {
			
			if (count($b['FAMS']) > 1) {
				foreach($b['FAMS'] as &$c) {
					if ($a['GedID'] == $c) {
						if ($b['GEND'] == 'M') { 	$a['HUSB'] = $b['ID'];	}
						if ($b['GEND'] == 'F') { 	$a['WIFE'] = $b['ID'];	}
						$c = $a['ID'];
					}//GedID == $c
				}//foreach $c		
			}
			else {
				if ($a['GedID'] == $b['FAMS'][0]) {
					if ($b['GEND'] == 'M') { 	$a['HUSB'] = $b['ID'];	}
					if ($b['GEND'] == 'F') { 	$a['WIFE'] = $b['ID'];	}
					$b['FAMS'][0] = $a['ID'];
				}//GedID == $c
			}//else
			
		}//isset $b['FAMS']
		
		if (isset($b['FAMC']) !== false) {
			
			if ($b['FAMC'] == $a['GedID']) {
				if (array_key_exists('CHIL', $a) !== true) { 										//If CHIL array doesn't exist
					$a['CHIL'][0] = $b['ID'];									 							//Create it and add the CHILD
				} else {
					$i = count($a['CHIL']);																	// i is the length of the CHIL array
					$a['CHIL'][$i] = $b['ID'];																// Add the child to the end of the array
				}//array_key_exists FAMS
				$b['FAMC'] = $a['ID'];
			}//if
			
		}//isset $b['FAMC']
	}//foreach $b
}//foreach $a


/*********************************Sort out Sources**************************************************/
foreach ($Source as &$a) {
	foreach ($Person as &$b) {		
		if (isset ($b['SOB']) !== false) {
			if ($a['GedID'] == $b['SOB']) {		$b['SOB'] = $a['ID'];		}
		}//SOB
		if (isset ($b['BURS']) !== false) {
			if ($a['GedID'] == $b['BURS']) {		$b['BURS'] = $a['ID'];		}
		}//BURS
		if (isset ($b['SOD']) !== false) {
			if ($a['GedID'] == $b['SOD']) {		$b['SOD'] = $a['ID'];		}
		}//SOD
		if (isset ($b['SOUR']) !== false) {
			if ($a['GedID'] == $b['SOUR']) {		$b['SOUR'] = $a['ID'];		}
		}//SOUR
	}//foreach $b
}//foreach $a


//************************PRIVATISE**********************************
foreach ($Person as &$i) {
	if (isset($i['_PRIV']) !== false && $i['_PRIV'] == 'Y') {
		unset($i['DOB']);
		unset($i['POB']);
		unset($i['NOB']);
		unset($i['DOD']);
		unset($i['POD']);
		unset($i['CAUS']);
		unset($i['NOD']);
		unset($i['SOD']);
		unset($i['EDUC']);
		unset($i['OCCU']);
		unset($i['RELI']);
		unset($i['SOB']);
		
		foreach($Family as &$j) {
			if (isset ($i['FAMS']) !== false && in_array($j['ID'], $i['FAMS']) !== false) {
				unset($j['PLAC']);
				unset($j['DATE']);
			}//if
		}//foreach
	}//If private
	
	/*************Set Name to UNKNOWN**********************/
	if ($i['GIVN'] == '') { $i['GIVN'] = 'Unknown'; }
}//foreach

//***************************Print to File****************************
fwrite($familyjs, 'var Family = [' . "\n");
foreach ($Family as $i) {
	fwrite($familyjs, '{"ID":"' . $i['ID'] . '",');
	fwrite($familyjs, '"HUSB":"' . $i['HUSB'] . '",');
	fwrite($familyjs, '"WIFE":"' . $i['WIFE'] . '",');	
	
	/********MARRIAGE/BANN/ENGAGEMENT/DIVORCE/ANNULMENT INFO**********/
	$line_item = '"MARR":{';
		$line_item .= '"DATE":["'.$i['D_MAR']['est'].'","'.$i['D_MAR']['day'].'","'.$i['D_MAR']['month'].'","'.$i['D_MAR']['year'];
		$line_item .= '","'.$i['D_MAR']['day2'].'","'.$i['D_MAR']['month2'].'","'.$i['D_MAR']['year2'].'"],';
		$line_item .=  '"PLAC":"' . $i['P_MAR'] . '",';
		$line_item .=  '"NOTE":"' . $i['N_MAR'] . '",';
		$line_item .=  '"SRC":"' . $i['S_MAR'] . '",';
	$line_item .= '},';
	fwrite($familyjs,$line_item);	//Write MARRIAGE INFO to file
	
	/***************************/
	$line_item = '"MARB":{';
		$line_item .= '"DATE":["'.$i['D_MRB']['est'].'","'.$i['D_MRB']['day'].'","'.$i['D_MRB']['month'].'","'.$i['D_MRB']['year'];
		$line_item .= '","'.$i['D_MRB']['day2'].'","'.$i['D_MRB']['month2'].'","'.$i['D_MRB']['year2'].'"],';
		$line_item .=  '"PLAC":"' . $i['P_MRB'] . '",';
		$line_item .=  '"NOTE":"' . $i['N_MRB'] . '",';
		$line_item .=  '"SRC":"' . $i['S_MRB'] . '",';
	$line_item .= '},';
	fwrite($familyjs,$line_item);	//Write MARRIAGE BANN INFO to file
	
	/***************************/
	$line_item = '"ANUL":{';
		$line_item .= '"DATE":["'.$i['D_ANL']['est'].'","'.$i['D_ANL']['day'].'","'.$i['D_ANL']['month'].'","'.$i['D_ANL']['year'];
		$line_item .= '","'.$i['D_ANL']['day2'].'","'.$i['D_ANL']['month2'].'","'.$i['D_ANL']['year2'].'"],';
		$line_item .=  '"PLAC":"' . $i['P_ANL'] . '",';
		$line_item .=  '"NOTE":"' . $i['N_ANL'] . '",';
		$line_item .=  '"SRC":"' . $i['S_ANL'] . '",';
	$line_item .= '},';
	fwrite($familyjs,$line_item);	//Write ANNULMENT INFO to file
	
	/***************************/
	$line_item = '"ENGA":{';
		$line_item .= '"DATE":["'.$i['D_ENG']['est'].'","'.$i['D_ENG']['day'].'","'.$i['D_ENG']['month'].'","'.$i['D_ENG']['year'];
		$line_item .= '","'.$i['D_ENG']['day2'].'","'.$i['D_ENG']['month2'].'","'.$i['D_ENG']['year2'].'"],';
		$line_item .=  '"PLAC":"' . $i['P_ENG'] . '",';
		$line_item .=  '"NOTE":"' . $i['N_ENG'] . '",';
		$line_item .=  '"SRC":"' . $i['S_ENG'] . '",';
	$line_item .= '},';
	fwrite($familyjs,$line_item);	//Write ENGAGEMENT INFO to file
	
	/***************************/
	$line_item = '"DIV":{';
		$line_item .= '"DATE":["'.$i['D_DIV']['est'].'","'.$i['D_DIV']['day'].'","'.$i['D_DIV']['month'].'","'.$i['D_DIV']['year'];
		$line_item .= '","'.$i['D_DIV']['day2'].'","'.$i['D_DIV']['month2'].'","'.$i['D_DIV']['year2'].'"],';
		$line_item .=  '"PLAC":"' . $i['P_DIV'] . '",';
		$line_item .=  '"NOTE":"' . $i['N_DIV'] . '",';
		$line_item .=  '"SRC":"' . $i['S_DIV'] . '",';
	$line_item .= '},';
	fwrite($familyjs,$line_item);	//Write DIVORCE INFO to file
	
	/*****************************************************************************************/
	
	fwrite($familyjs, '"CHIL":[');
	fwrite($familyjs, '"' . implode('","',$i['CHIL']) . '"');
		
	fwrite($familyjs, ']},' . "\n");
}//foreach Family
fwrite($familyjs, ']');

//*****************************Print to File*****************************
fwrite($peoplejs,'var People = [' . "\n");
foreach ($Person as $i) {
	fwrite($peoplejs,'{"ID":"' . $i['ID'] . '",');																				//ID
	
	fwrite($peoplejs,'"GEND":"' . $i['GEND'] . '",');							//GENDER
		
	//NAMES
	$line_item = '"NAME":{';
		$line_item .=  '"GIVN":["' . $i['GIVN'] . '"],';
		$line_item .=  '"SURN":"' . $i['SURN'] . '",';
		$line_item .=  '"NICK":"' . $i['NICK'] . '",';
		$line_item .=  '"NPFX":"' . $i['NPFX'] . '",';
		$line_item .=  '"NSFX":"' . $i['NSFX'] . '",';
		$line_item .=  '"SPFX":"' . $i['SPFX'] . '",';
	$line_item .= '},';
	fwrite($peoplejs,$line_item);	//Write Names to file
	
	//BIRTH INFO
	$line_item = '"BIRTH":{';
		$line_item .= '"DATE":["'.$i['DOB']['est'].'","'.$i['DOB']['day'].'","'.$i['DOB']['month'].'","'.$i['DOB']['year'];
		$line_item .= '","'.$i['DOB']['day2'].'","'.$i['DOB']['month2'].'","'.$i['DOB']['year2'].'"],';
		$line_item .=  '"PLAC":"' . $i['POB'] . '",';
		$line_item .=  '"NOTE":"' . $i['NOB'] . '",';
		$line_item .=  '"SRC":"' . $i['SOB'] . '",';
	$line_item .= '},';
	fwrite($peoplejs,$line_item);	//Write BIRTH INFO to file

	//DEATH INFO
	$line_item = '"DEATH":{';
		$line_item .=  '"DATE":["' . $i['DOD']['est'] . '","' . $i['DOD']['day'] . '","' . $i['DOD']['month'] . '","' . $i['DOD']['year'] . '"' ;
		$line_item .=  ',"' . $i['DOD']['day2'] . '","' . $i['DOD']['month2'] . '","' . $i['DOD']['year2'] . '"],' ;
		$line_item .=  '"PLAC":"' . $i['POD'] . '",';
		$line_item .=  '"CAUS":"' . $i['CAUS'] . '",';
		$line_item .=  '"NOTE":"' . $i['NOD'] . '",';
		$line_item .=  '"SRC":"' . $i['SOD'] . '",';
	$line_item .= '},';
	fwrite($peoplejs,$line_item);	//Write DEATH INFO to file
	
	//BURIAL INFO
	$line_item = '"BURI":{';	
		$line_item .=  '"DATE":["' . $i['BURI']['est'] . '","' . $i['BURI']['day'] . '","' . $i['BURI']['month'] . '","' . $i['BURI']['year'];
		$line_item .=  '","' . $i['BURI']['day2'] . '","' . $i['BURI']['month2'] . '","' . $i['BURI']['year2'] . '"],' ;
		$line_item .=  '"PLAC":"' . $i['BURP'] . '",';
		$line_item .=  '"SRC":"' . $i['BURS'] . '",';
	$line_item .= '},';
	fwrite($peoplejs,$line_item);	//Write BURIAL INFO to file
	
	//OCCUPATION
	fwrite($peoplejs,'"OCCU":["' . implode('","',$i['OCCU']) . '"],');
	
	fwrite($peoplejs,'"EDUC":"' . $i['EDUC'] . '",');					//EDUCATION
	fwrite($peoplejs,'"RELI":"' . $i['RELI'] . '",');					//RELIGION
	
	fwrite($peoplejs,'"FAMS":["' . implode('","',$i['FAMS']) . '"],');
	
	fwrite($peoplejs,'"FAMC":"' . $i['FAMC'] . '",');	//FAMC
	fwrite($peoplejs,'"_PRIV":"' . $i['_PRIV'] . '",');			//PRIVATE?
	
	fwrite($peoplejs,'"NOTE":"' . $i['NOTE'] . '",');
	
	fwrite($peoplejs,'},' . "\n");
}//while
fwrite($peoplejs, ']');

//***************************************Print to File****************************************************
fwrite($sourcejs, 'var Sources = [' . "\n");
foreach ($Source as $i) {
	fwrite($sourcejs, '{"ID":"' . $i['ID'] . '","TITL":"');
		if (isset($i['TITL']) !== false) { fwrite($sourcejs, $i['TITL']); }
	fwrite($sourcejs, '","PUBL":"');
		if (isset($i['PUBL']) !== false) { fwrite($sourcejs, $i['PUBL']); }	
	fwrite($sourcejs, '","AGNC":"');
		if (isset($i['AGNC']) !== false) { fwrite($sourcejs, $i['AGNC']); }	
	fwrite($sourcejs, '","TEXT":"');
		if (isset($i['TEXT']) !== false) { fwrite($sourcejs, $i['TEXT']); }
		
	fwrite($sourcejs, '"},' . "\n");
}//foreach Family
fwrite($sourcejs, ']');


fclose($gedcom);
fclose($peoplejs);
fclose($familyjs);
fclose($sourcejs);


/********************************************************************************/
/***********************************FUNCTIONS************************************/

/* Function to understand the tag for INDI, FAM and SOUR */
function getTagType($text) {
	$tag = ' ';
	if (strpos($text, '@ INDI') != false){			 $tag = 'Ind';			//If text is found within
	} else if (strpos($text, '@ FAM') != false){	 $tag = 'Fam';			//the string then set the
	} else if (strpos($text, '@ SOUR') != false){ $tag = 'Src';			//tag appropriately.
	} else if (strpos($text, 'TRLR') != false){ 	 $tag = 'Trlr';			//Trailer Tag
	} else if (strpos($text, 'HEAD') != false){ 	 $tag = 'Head';			//Header Tag
	} // if..else..	
	return $tag;
}//getTagType

function formatID ($text) {
	if (strpos($text, '@ ') != false){
		$i = strpos($text, '@ ') - strpos($text, '@') + 1;
		return substr($text, strpos($text, '@'), $i);
	}//if @_ in string
}//formatID

function formatDate ($text) {
	
	$date = array('est' => '', 'day' => '', 'month' => '', 'year'=> '', 'day2' => '', 'month2' => '', 'year2'=> '');
	
	//Estimated Dates
		  if (strpos($text, 'ABT') !== false){		$date['est'] = 'ABT';		}
	else if (strpos($text, 'BEF') !== false){		$date['est'] = 'BEF';		}
	else if (strpos($text, 'AFT') !== false){		$date['est'] = 'AFT';		}
	else if (strpos($text, 'BET') !== false) {
		$date['est'] = 'BET';
		$text2 =substr($text, strpos($text, 'AND')+3,strlen($text));
		$text = substr($text, strpos($text, 'BET')+3,strpos($text, ' AND'));
	}
	
	//Find Month
		  if (strpos($text, 'JAN') !== false){		$date['month'] = 'JAN';		}
	else if (strpos($text, 'FEB') !== false){		$date['month'] = 'FEB';		}
	else if (strpos($text, 'MAR') !== false){		$date['month'] = 'MAR';		}
	else if (strpos($text, 'APR') !== false){		$date['month'] = 'APR';		}
	else if (strpos($text, 'MAY') !== false){		$date['month'] = 'MAY';		}
	else if (strpos($text, 'JUN') !== false){		$date['month'] = 'JUN';		}
	else if (strpos($text, 'JUL') !== false){		$date['month'] = 'JUL';		}
	else if (strpos($text, 'AUG') !== false){		$date['month'] = 'AUG';		}
	else if (strpos($text, 'SEP') !== false){		$date['month'] = 'SEP';		}
	else if (strpos($text, 'OCT') !== false){		$date['month'] = 'OCT';		}
	else if (strpos($text, 'NOV') !== false){		$date['month'] = 'NOV';		}
	else if (strpos($text, 'DEC') !== false){		$date['month'] = 'DEC';		}
	
	//Find Day
	if (preg_match('/[0-9]{2} |[0-9]{1} /', trim($text), $matches)) {
		$match = trim($matches[0]);
		if (strlen($match) == 1) {
			$date['day'] = '0' . $match[0];
		} else {
			$date['day'] = $match;
		}
	}
	
	//Mind Month
	if (preg_match('/[0-9]{4}/', $text, $matches)) {
		$date['year'] = substr($matches[0], 0, 4);
	}

	//If event is BETWEEN two dates
	if ($date['est'] == 'BET') {
			  if (strpos($text2, 'JAN') !== false){		$date['month2'] = 'JAN';		}
		else if (strpos($text2, 'FEB') !== false){		$date['month2'] = 'FEB';		}
		else if (strpos($text2, 'MAR') !== false){		$date['month2'] = 'MAR';		}
		else if (strpos($text2, 'APR') !== false){		$date['month2'] = 'APR';		}
		else if (strpos($text2, 'MAY') !== false){		$date['month2'] = 'MAY';		}
		else if (strpos($text2, 'JUN') !== false){		$date['month2'] = 'JUN';		}
		else if (strpos($text2, 'JUL') !== false){		$date['month2'] = 'JUL';		}
		else if (strpos($text2, 'AUG') !== false){		$date['month2'] = 'AUG';		}
		else if (strpos($text2, 'SEP') !== false){		$date['month2'] = 'SEP';		}
		else if (strpos($text2, 'OCT') !== false){		$date['month2'] = 'OCT';		}
		else if (strpos($text2, 'NOV') !== false){		$date['month2'] = 'NOV';		}
		else if (strpos($text2, 'DEC') !== false){		$date['month2'] = 'DEC';		}
	
			//Find Day
		if (preg_match('/[0-9]{2} |[0-9]{1} /', trim($text), $matches)) {
			$match = trim($matches[0]);
			if (strlen($match) == 1) {
				$date['day2'] = '0' . $match[0];
			} else {
				$date['day2'] = $match;
			}
		}
		
		//Find Month
		if (preg_match('/[0-9]{4}/', $text, $matches)) {
			$date['year2'] = substr($matches[0], 0, 4);
		}
	}//Event is BETWEEN 2 dates
	
	if ($date['day'] > 31) { $date['day'] = ''; } //Stops invalid dates
	if ($date['day2'] > 31) { $date['day2'] = ''; } //Stops invalid dates
	
	return $date;
}//formatDate

function formatGIVN($line) {
	$text = str_replace(' ', '","', trim(substr($line,7,strlen($line))));
	return $text;
}

?>