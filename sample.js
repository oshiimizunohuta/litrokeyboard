var ltkb;

window.addEventListener('load', function() {
	var cont
		, i
		, litroAudio = new LitroSound()
		, litroPlayer = new LitroPlayer()
		, ltkb = new LitroKeyboard()

		,requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
	;
	window.requestAnimationFrame = requestAnimationFrame;
	
	litroAudio.init(SAMPLE_RATE, CHANNELS, BUFFER_FRAMES);
	
	litroPlayer.init(litroAudio);
	
	ltkb.init(litroAudio);
	
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
