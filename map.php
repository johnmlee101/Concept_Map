<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- Basic Page Needs
		–––––––––––––––––––––––––––––––––––––––––––––––––– -->
		<meta charset="utf-8">
		<title>Concept Map</title>
		<meta name="description" content="Canvas Map">
		<meta name="author" content="Purdue Cognition and Learning Lab">

		<!-- Mobile Specific Metas
		–––––––––––––––––––––––––––––––––––––––––––––––––– -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<!-- CSS
		–––––––––––––––––––––––––––––––––––––––––––––––––– -->
		<link rel="stylesheet" href="css/normalize.css">
		<link rel="stylesheet" href="css/main.css">

		<!-- Scripts
		–––––––––––––––––––––––––––––––––––––––––––––––––– -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		
		<!--<script src="js/main.js"></script>-->

	</head>
	<body>
		<div id="left-card">
			<h1>Title</h1>
			<div class="content">
			Description or experiment info goes here
			</div>
		</div>
		<div id="center">
			<canvas width="1000" height="1000" id="canvas"></canvas>
			<div class="word-elem">
				<div contenteditable="true" class="editable-word" onkeydown="resize()" onkeypress="resize()"></div>
			</div>
			<div id="toolbar">
			<div selected>+</div>
			<div>Edit</div>
			<div>Draw</div>
			</div>
		</div>

		<script type="application/javascript">
		</script>
		<script src="map.js"></script>

	</body>
</html>