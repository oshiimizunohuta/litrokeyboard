/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */

var LitroKeyboardInstance = null;


function LitroKeyboard() {
	this.CODE_NAME = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	this.CODE_NAME_INDEX = {};
	
	this.CONTROLL_CHARS = {};
	this.CHARS_CODE_NAME = {};
	this.ROW_CHARS = {
		top:['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', ],
		bottom:['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', ',', 'l', '.', ';', '/', ],
		// bottom:['z', 's', 'x', 'd', 'c', 'f', 'v', 'b', 'h', 'n', 'j', 'm', ',', 'l', '.', ';', '/', ':', '\\',  ],
	};
	
	this.OCTAVE_KEYCODE = {
		'-' : 189, '^' : 222,
	},
	this.ZOOM_KEYCODE = {
		'[' : 219, ']' : 221,
	},
	
	this.KEY_REPLACE_FIREFOX = {
		187 : 59, 189 : 173, 222 : 160,
	};
	this.ROW_KEYCODE = {
		top:[81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85, 73, 57, 79, 48, 80],
		bottom:[90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77, 188, 76, 190, 187, 191],
		// bottom:[90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 77, 75, 188, 76, 190, 187, 191, 186, 226],
	};
	this.BLACK_KEY = {'2':0, '3':0, '5':0, '6':0, '7':0, '9':0, '0':0, 's':0, 'd':0, 'g':0, 'h':0, 'j':0, 'l':0, ';':0, ':': 0};
	// this.BLACK_KEY = {'2':0, '3':0, '5':0, '6':0, '7':0, '9':0, '0':0, 's':0, 'd':0, 'f':0, 'h':0, 'j':0, 'l':0, ';':0, ':': 0};
	this.octaveLevel = 2;
	this.fingers = 6;
	this.status_on = []; //set chars
	this.onkeyEvent = null;
	this.offkeyEvent = null;
	this.octaveEvent = null;
	this.isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? true : false;
	
	this.octaveSeparateCount = [12, 17, 5];
	
	return;
}

LitroKeyboard.prototype = {
	init : function(litrosoundInstance) {
		var code, row, chars, i
		, repkeys_ff = this.KEY_REPLACE_FIREFOX;
		this.litroSound = litrosoundInstance;
		LitroKeyboardInstance = this;
		this.keyControll = new KeyControll();
		
		//キーボード設定
		for(row in this.ROW_CHARS){
			chars = this.ROW_CHARS[row];
			code = this.ROW_KEYCODE[row];
			for(i = 0; i < chars.length; i++){
				if(this.isFirefox){
					code[i] = repkeys_ff[code[i]] == null ? code[i] : repkeys_ff[code[i]];
				}
				this.CONTROLL_CHARS[chars[i]] = code[i];
				this.keyControll.setKey(chars[i], code[i]);

				this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[i % this.CODE_NAME.length];
				// if(row == 'top'){
					// this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[i % this.CODE_NAME.length];
				// }else{
					// this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[(i + 5) % this.CODE_NAME.length];
				// }
				
				
				//補完
				if(chars[i] in this.BLACK_KEY){
					this.BLACK_KEY[chars[i]] = code[i];
				}
			}
		}
		
		//オクターブ設定
		for(i in this.OCTAVE_KEYCODE){ 
			code = this.OCTAVE_KEYCODE[i];
			if(this.isFirefox){
				code = repkeys_ff[code] == null ? code : repkeys_ff[code];
			}
			this.keyControll.setKey(i, code);
		}
		
		for(i = 0; i < this.CODE_NAME.length; i++){
			this.CODE_NAME_INDEX[this.CODE_NAME[i]] = i;
		}
		
		this.initFingerState(this.fingers);
	},
	
	initFingerState: function(num)
	{
		var i;
		this.status_on = [];
		for(i = 0; i < num; i++){
			this.status_on.push(null);
		}
	},
	
	isBlackKey: function(name){
		if(this.BLACK_KEY[name] == null){
			return false;
		}else{
			return true;
		}
	},
	
	getOctaveFromKeyChar: function(chr)
	{
		var chars, i, ocnt, oct;
		
		chars = this.ROW_CHARS.top.concat(this.ROW_CHARS.bottom);
		// console.log(this.ROW_CHARS.bottom);
		// code = this.ROW_KEYCODE.top.join(this.ROW_KEYCODE.bottom);
		for(i = 0; i < chars.length; i++){
			if(chars[i] == chr){
				ocnt = this.octaveSeparateCount;
				if(i < ocnt[0]){
					return this.octaveLevel;
				}else if(i < ocnt[0] + ocnt[1]){
					oct = this.octaveLevel + 1;
					return (oct > this.litroSound.OCTAVE_MAX) ? this.litroSound.OCTAVE_MAX : oct;
				}else{
					oct = this.octaveLevel + 2;
					return (oct > this.litroSound.OCTAVE_MAX) ? this.litroSound.OCTAVE_MAX : oct;
				}
			}
		}
	},
	
	getCodeNameFromKeyChar: function(chr){
		var chars, row, i;
		for(row in this.ROW_CHARS){
			chars = this.ROW_CHARS[row];
			for(i = 0; i < chars.length; i++){
				if(chars[i] == chr){
					return ;
				}
			}
		}	
	},
	
	getKeysDefine: function(){
		return this.CONTROLL_CHARS;
	},
	
	onCode: function(chr)
	{
			// console.log(chr);

		var channel, chars, row, octave, code, i;
		// console.log(chr);
		octave = this.getOctaveFromKeyChar(chr);
		code = this.CODE_NAME_INDEX[this.CHARS_CODE_NAME[chr]];
		channel = this.searchReadySlot();
		if(channel < 0){
			return;
		}else{
			this.status_on[channel] = chr;
		}
		this.litroSound.onNoteFromCode(channel, code, octave);
		
		if(this.onkeyEvent != null){
			this.onkeyEvent(chr);
		}
		
		// this.CODE_NAME
		// this.litroSound.setFrequency();

	},
	
	offCode: function(chr)
	{
		var channel = this.searchState(chr);

		if(chr == null || channel < 0){
			this.offkeyEvent();
			this.initFingerState(this.fingers);
			this.litroSound.offNoteFromCode();
			// console.log('chr: ' + chr);
			return;
		}
		if(this.offkeyEvent != null){
			this.offkeyEvent(chr);
			this.status_on[channel] = null;
			this.litroSound.offNoteFromCode(channel);
		}
	},
	
	incOctave: function()
	{
		if(this.octaveLevel < this.litroSound.OCTAVE_MAX){
			this.octaveLevel++;
			console.log(this.octaveLevel);
		}
	},
	
	decOctave: function()
	{
		if(this.octaveLevel > 0){
			this.octaveLevel--;
			console.log(this.octaveLevel);
		}
	},
	
	searchReadySlot: function()
	{
		var i;
		for(i = 0; i < this.fingers; i++){
			if(this.status_on[i] == null){
				return i;
			}
		}
		return -1;
	},
	
	searchState: function(chr)
	{
		var i;
		for(i = 0; i < this.fingers; i++){
			if(this.status_on[i] == chr){
				return i;
			}
		}
		return -1;
	},
	
	appendOctaveEvent: function(e)
	{
		this.octaveEvent = e;
	},
	appendOnkeyEvent: function(e)
	{
		this.onkeyEvent = e;
	},
	appendOffkeyEvent: function(e)
	{
		this.offkeyEvent = e;
	},
	
	test: function(){
		var trigs, untrigs, row, chars, name, cont = this.keyControll
		;
		chars = this.ROW_CHARS;
		
		for(row in chars){
			trigs = cont.getTrig(chars[row]);
			untrigs = cont.getUntrig(chars[row]);
			for(name in trigs){
				if(trigs[name]){
					this.onCode(name);
				}
			}
			for(name in untrigs){
				if(untrigs[name]){
					this.offCode(name);
				}
			}
		}
		
		chars = this.OCTAVE_KEYCODE;
		// console.log(trigs);
		for(name in chars){
			trigs = cont.getTrig(name);
			// untrigs = cont.getUntrig(name);
			if(trigs){
				if(name == '^'){
					this.incOctave();
				}
				if(name == '-'){
					this.decOctave();
				}
				if(this.octaveEvent != null){
					this.octaveEvent();
				}
			}
		}


	}

};

//call at 60fps
function litroKeyboardMain()
{
	var i
	, ltkb = LitroKeyboardInstance
	;
	ltkb.test();
};


