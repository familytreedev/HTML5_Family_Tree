<?php
/** This is the code for uploading a file to the server **/
/** Commented out bits weren't working but control the  **/
/** Allowable extension types and the maximum file size **/


//$allowedExts = array(".ged");
//$extension = end(explode(".", $_FILES["file"]["name"]));
//if (($_FILES["file"]["size"] < 500000)
//&& in_array($extension, $allowedExts))
 // {
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
?>