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
	
	ltkb.appendOnkeyEvent(keyon);
	ltkb.appendOffkeyEvent(keyoff);
	ltkb.appendOctaveEvent(octaveChange);
	octaveChange();
	
	// makeTestKeyboard();
	
	$('.waveTypeFrame button').mousedown(waveSwitchEvent);
	
	$('.octaveFrame button.down').mousedown(decOctave);
	$('.octaveFrame button.up').mousedown(incOctave);

	$('.notekey').mousedown(noteon);
	$(window).mouseup(noteoff);
	$('.notekey').mouseup(noteoff);
	
	requestAnimationFrame(main);
	
});

function main() {
	litroSoundMain();
	litroKeyboardMain();
	keyStateCheck();
	
	
	requestAnimationFrame(main);
};

var octaveChange = function()
{
	$('.octaveLevel').text(ltkb.octaveLevel);
};

var decOctave = function()
{
	ltkb.decOctave();
	octaveChange();
};
var incOctave = function()
{
	ltkb.incOctave();
	octaveChange();
};

var keyon = function(code)
{
	$('.notekey[value="' + code + '"]').toggleClass('keyon', true);
};

var keyoff = function(code)
{
	if(code == null){
		$('.notekey').toggleClass('keyon', false);
	}else{
		$('.notekey[value="' + code + '"]').toggleClass('keyon', false);
	}
};

var waveSwitch = function(type)
{
	for(var c = 0; c < ltkb.litroSound.channel.length; c++){
		if(type == null){
			// ltkb.setWaveType(c, (ltkb.litroSound.channel + 1) % 4);
		}else{
			ltkb.litroSound.setWaveType(c, type | 0);
		}
	}
};

var waveSwitchEvent = function()
{
	var type = $(this).attr('value');
	waveSwitch(type);
};

var noteon = function()
{
	// change();
	var code = $(this).attr('value');
	keyon(code);
	ltkb.onCode(code);
};

var noteoff = function()
{
	// litroAudio.setFrequency(0);
	var code = $(this).attr('value');
	// console.log(code);
	ltkb.offCode(code);
	keyoff(code);
};

function makeTestKeyboard()
{
	var row, i, j, element, d, span
		, e = $(".boardFrame")
		, code
		, chars
		, cl
		, cl2
		, oct
		, pos = 0
		, width = 32
		, bwidth = 24
		, border = 2
		, keyCodes
		;
	for(row in ltkb.ROW_KEYCODE){
		keyCodes = ltkb.ROW_KEYCODE[row];
		chars = ltkb.ROW_CHARS[row];
		
		d = $('<div class="octaveRow ' + row + '"></div>');
		pos = 0;
		for(i = 0; i < keyCodes.length; i++){
			// i % ltkb.CODE_NAME.length;
			codename = ltkb.CODE_NAME[i % ltkb.CODE_NAME.length];
			cl = ltkb.isBlackKey(chars[i]) ? 'black' : 'white';
			if(cl == 'white'){
				oct = ltkb.getOctaveFromKeyChar(chars[i]) - ltkb.octaveLevel;
				cl2 = 'oct' + oct;
			}else{
				cl2 = "";
			}
			
			// code = ltkb.isBlackKey(chars[i]) ? 'black' : 'white';
			element = $('<button type="button" class="notekey '+ cl + ' ' + cl2 + '" value="' + chars[i] + '" ></button>');
			span = $('<span class="controllName ' + cl + '">' + chars[i] + '</span><span class="codeName ' + cl + '">' + codename + '</span>');
			element.append(span);
			
			if(i > 0){
				if(!ltkb.isBlackKey(chars[i - 1])){
					pos += ltkb.isBlackKey(chars[i]) ? ((width + border) / 2) | 0 : width - border | 0 ;
					// pos += ltkb.isBlackKey(chars[i]) ? border : 0;
				}else{
					pos += ((bwidth + border) / 2) | 0;
				}
				// pos += border;
			}
			element.css('left', pos + 'px');
			d.append(element);
			
		}
		e.append(d);
	}
	
	// $('.octaveFrame').append('<select class="octaveSel"></select>');
	// for(i = 0; i < ltkb.litroSound.MAX_OCTAVE; i++){
		// $('.octaveFrame').find('select').append('<option value="' + i +'">' + i + '</option>');
	// }
	
};
