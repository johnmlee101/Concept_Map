<?php

include 'mysql.php';

$debug = false;

session_start();


$id = $_SESSION['id'];
$initials = $_SESSION['initials'];
$condition = $_SESSION['condition'];
$text = $_SESSION['text'];
$activity = $_SESSION['activity'];

$nodes = postEscape($db, "nodes", "N/A");
$image = postEscape($db, "image", "N/A");

$query = "INSERT INTO `SchoolResearch_map` (`id`,`initials`,`condition`,`text`,`activity`,`nodes`,`image`) VALUES ('$id', '$initials', '$condition','$text','$activity','$node','$image')";

query($db, $query);

	

//Escape with the db returning var or empty if empty
function postEscape($db, $var, $empty) {
	if (isset($_POST[$var])) {
		return $db->escape_string($_POST[$var]);
	}

	return $empty;
}

//Runs $query on $db
function query($db, $query) {
	//check if any errors occured.
	if (($result = $db->query($query)) === false) {
		if ($debug) {
			printf("Invalid query: %s\n", $query);
			printf("Error: ", $db->error);
		}
	}
}
?>
