<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<title>8bitブラウザDTM | LitroKeyboard</title>
		<meta name="description" content="キーボードで演奏しながら作曲できるWebアプリ　作曲したデータをSNS、HPに貼り付けて共有できるサービスの予定" />
		<meta name="keywords" content="ブラウザDTM,WebAudioAPI,8bit,PSG,フリー鍵盤演奏ソフト,ケモノ,ドラゴン" />
		<meta name="author" content="しふたろう">
		<!-- <meta name="viewport" content="width=device-width; initial-scale=1.0"> -->
		
		<!-- SNS OG params -->
		<meta property="og:title" content="LitroKeyBoard">
		<meta property="og:type" content="website">
		<meta property="og:url" content="<?php echo PROTOCOL_HOST_REQUEST; ?>">
		<meta property="og:image" content="https://ltsnd.bitchunk.net/keyboard/img/twitter_card_summary.png">
		<meta name="twitter:card" content="summary">
		<meta name="twitter:site" content="@shiftal_on">
		<meta name="twitter:title" content="LitroKeyBoard">
		<meta name="twitter:description" content="8bit Style DTM on Blowser">
		<meta name="twitter:creator" content="@LitroSound">
		<meta name="twitter:image:src" content="https://ltsnd.bitchunk.net/keyboard/img/twitter_card_summary.png">
		<meta name="twitter:domain" content="ltsnd.bitchunk.net">

		<!-- Replace favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
		<link rel="shortcut icon" href="./img/ltkb16.png">
		<link rel="apple-touch-icon-precomposed" href="./img/apple-touch-icon.png">
		
		<link rel="stylesheet" type="text/css" href="./style.css" media="all">

		<script src="./chunklekit/string.js"></script>
		<script src="./chunklekit/prop.js"></script>
		<script src="./chunklekit/keyControll.js"></script>
		<script src="./chunklekit/canvasdraw.js"></script>
		<script src="./chunklekit/wordPrint.js"></script>
		<script src="./chunklekit/UITools.js"></script>
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
