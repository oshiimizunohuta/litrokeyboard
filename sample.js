var ltkb;

$(function() {
	var cont
		, i,
	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	litroAudio = new LitroSound();
	litroAudio.init(SAMPLE_RATE, CHANNELS, BUFFER_FRAMES);
	
	ltkb = new LitroKeyboard();
	ltkb.init(litroAudio);
	
	requestAnimationFrame(main);
	
});

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
