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

		<!-- Possible Scripts for word bank -->
		<script type="text/javascript" src="keywords/lib/jquery-sortable-min.js"></script>
		<script type="text/javascript" src="keywords/lib/d3/d3.min.js" charset="utf-8"></script>
		<script type="text/javascript" src="keywords/lib/interact-1.2.4.min.js" charset="utf-8"></script>
		<script type="text/javascript" src="keywords/js/utils.js"></script>
		<script type="text/javascript" src="keywords/js/DeckManager.js"></script>
		<script type="text/javascript" src="keywords/js/DragView.js"></script>
		<script type="text/javascript" src="keywords/js/KeyBin.js"></script>
		<script type="text/javascript" src="keywords/js/app_controller.js"></script>
		<script src="keywords/apache_indians.json" type="text/javascript"></script>
		<!--<script src="js/main.js"></script>-->

	</head>
	<body>
		<div id="left-card">
			<h1>Title</h1>
			<div class="content">
				<div class="col-md-8" id="canvas2">
				</div>
			</div>
			<div class="left-buttons">
				<div class="finish">Restart</div>
				<div class="finish">Finish</div>
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
			app = new app_controller();
			app.init(400, 200, null);
		</script>
		<script src="map2.js"></script>

	</body>
	</html>
