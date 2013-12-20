<?php

$email_to = "";//Insert email here
$error = $_POST['error'];
$email_from = ""; //Insert Email
$email_subject = "Family Tree Error Report";
$headers = "From: $email_from \r\n";
$headers .= "Reply-To: $email_from \r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

$text = '<html><body>' . $error . '</body></html>';

ini_set("sendmail_from", $email_from);
$sent = mail($email_to, $email_subject, $text, $headers, "-f" .$email_from);
if ($sent)
{
} else {
echo "There has been an error sending your error.  Isn't that ironic.";
}

?>