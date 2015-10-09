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
		<script src="ocanvas-2.8.1.js"></script>
		<script src="jquery.autoGrowInput.js"></script>
		
		<!--<script src="js/main.js"></script>-->

	</head>
	<body>
		<div id="left-card">
			<h1>Title</h1>
			<div class="content">
				Description or experiment info goes here
			</div>
		</div>
		<div id="right-card">

			<div class="canvas-holder">
				<!-- <canvas width="500px" height="500px" id="backgroundCanvas" class="canvas"></canvas> -->
				<canvas width="500px" height="500px" id="canvas" class="canvas" tabindex="1"></canvas>
			</div>

			<!-- <div id="toolbar">
				<div selected>Select</div>
				<div>Add</div>
				<div>Edit</div>
				<div>Draw</div>
				<div>Move</div>
			</div> -->

			<div class="word-elem">
				<input type="text" class="editable-word" onkeydown="editKeyChange()" onkeypress="editKeyChange()" onkeyup="editKeyChange()"></div>
			</div>
		</div>

		<script type="application/javascript">
		</script>
		<script src="map2.js"></script>

	</body>
</html>
