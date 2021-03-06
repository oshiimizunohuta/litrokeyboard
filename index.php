<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<meta name="author" content="bitchunk">
		<!-- <meta name="viewport" content="width=device-width; initial-scale=1.0"> -->
		<meta name="description" content="キーボードで演奏しながら作曲できるチップチューンシーケンサー　作曲したデータをSNS、HPに貼り付けて共有できる" />
		
		<!-- SNS OG params -->
		<meta property="og:title" content="LitroReceiver">
		<meta property="og:type" content="player">
		<meta property="og:url" content="<?php echo CARD_URL; ?>">
		<meta property="og:image" content="https://ltsnd.bitchunk.net/receiver/img/twitter_card_player.png">
		<meta name="twitter:card" content="player">
		<meta name="twitter:site" content="@litrosound">
		<meta name="twitter:title" content="LitroReceiver">
		<meta name="twitter:image" content="https://ltsnd.bitchunk.net/receiver/img/twitter_card_player.png">
		<meta name="twitter:description" content='"Litrosound" a browser chiptune.'>
		<meta name="twitter:creator" content="@litrosound">
		<meta name="twitter:player" content="<?php echo CARD_URL; ?>">
		<meta name="twitter:player:width" content="320">
		<meta name="twitter:player:height" content="320">

		<!-- Replace favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
		<link rel="shortcut icon" href="./img/ltkb16.png">
		<link rel="apple-touch-icon-precomposed" href="./img/apple-touch-icon.png">
		
		<!-- styleseet -->
		<link rel="stylesheet" type="text/css" href="./style.css" media="all">

		<title>LitroKeyboard</title>
		
		<script src="./chunklekit/util.js"></script>
		<script src="./chunklekit/prop.js"></script>
		<script src="./chunklekit/keycontroll.js"></script>
		<script src="./chunklekit/canvasdraw.js"></script>
		<script src="./chunklekit/wordprint.js"></script>
		<script src="./chunklekit/uitools.js"></script>
		<script src="./litrosound/Litrosound.js"></script>
		<script src="./LitroKeyboard.js"></script>

		<!-- GoogleAnalytics -->
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		  ga('create', 'UA-46774451-3', 'auto');
		  ga('send', 'pageview');
		
		</script>
		<style>
			
		</style>
	</head>

	<body>
		<div id="display" class="display center">
		</div>
		</body>
	</html>
