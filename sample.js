var ltkb;

window.addEventListener('load', function() {
	var cont
		, i
		// , litroAudio = new LitroSound()
		// , litroPlayer = new LitroPlayer()
		, ltkb = new LitroKeyboard()

		,requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
	;
	window.requestAnimationFrame = requestAnimationFrame;
	
	// litroAudio.init(CHANNELS);
	
	// litroPlayer.init(litroAudio);
	
	ltkb.init();
	
	requestAnimationFrame(main);
	removeEventListener('load', this, false);
	
}, false);


function main() {
	litroSoundMain();
	litroKeyboardMain();
	keyStateCheck();
	requestAnimationFrame(main);
};

window.onbeforeunload = function(event){
	event = event || window.event;
	return event.returnValue = 'LitroKeyboardを中断します';
};
