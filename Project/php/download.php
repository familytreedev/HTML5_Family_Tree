<? //Generate text file on the fly

$type = $_POST["type"];
$file = $_POST["file"];
$data = json_decode(urldecode($_POST["data"]), true);

if ($type == 'ind') {
	$filename = $data["ID"] . '_' . $data["NAME"]["SURN"];
}
if ($file == 'csv') {
	header("Content-type: text/csv");
	header("Content-Disposition: attachment; filename=$filename.csv");
	foreach ($data as $key => $value) {
		if (is_array($value)) {
			echo "\r\n$key,";
			foreach ($value as $subKey => $subValue){
			
				if (is_array($subValue)) {
					echo "$subKey,";
					foreach ($subValue as $i){
						echo "$i,";
					}//foreach
				} else {
					echo "$subKey, $subValue,";
				}//is_array
				
			}//foreach
		} else {
			echo "\r\n$key, $value,";
		}//is_array
	}//foreach
}//if csv file
else if ($file == 'ged') {
	header("Content-type: text/ged");
	header("Content-Disposition: attachment; filename=$filename.ged");
	foreach ($data as $key => $value) {
		if (empty($value)){ }
		else {
		
			if ($key == "ID"){ echo "\r\n0 @I1@ INDI"; }
			
			else if (is_array($value)) {
				if ($key == "NAME") { 
					echo "\r\n1 NAME ";
					foreach ($value["GIVN"] as $i){ echo "$i "; }
					echo "/" . $value["SURN"] . "/"; 
				}//if NAME
				else if ($key == "OCCU"){ foreach ($value as $i) { echo "\r\n1 OCCU $i"; } }
				else { echo "\r\n1 $key"; }
				
				foreach ($value as $subKey => $subValue){
					if (empty($subValue)){ }
					else {
						if (is_array($subValue)) {
							echo "\r\n2 $subKey ";
							foreach ($subValue as $i){
								echo "$i ";
							}//foreach
						} else {
							echo "\r\n2 $subKey $subValue";
						}//is_array
					}//subvalue is not empty
				}//foreach
			} else {
				echo "\r\n1 $key $value";
			}//is_array
			
		}//if value is not blank
	}//foreach
}//else if ged file
?>