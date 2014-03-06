/**
 * Litro Keyboard Interface
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */
var litroKeyboardInstance = null;
var VIEWMULTI = 2;
var DISPLAY_WIDTH = 320;
var DISPLAY_HEIGHT = 240;
var CHIPCELL_SIZE = 16;
var layerScroll = null;
var COLOR_NOTEPRINT = [0, 168, 0, 255];
var COLOR_NOTEFACE = [184, 248, 184, 255];
var COLOR_NOTEPRINT = [0, 168, 0, 255];
var COLOR_PARAMKEY = [188, 188, 188, 255];
var COLOR_ARRAY = [[248, 120, 88, 255], [252, 168, 68, 255], [248, 184, 0, 255], [88, 216, 84, 255], [60, 188, 252, 255], [152, 120, 248, 255], [248, 120, 248, 255], [248, 88, 152, 255], ];

var USER_ID = 1;

function LitroKeyboard() {
	this.CODE_NAME = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	this.CODE_NAME_INDEX = {};
	this.CHARS_INDEX = [];
	
	this.CONTROLL_CHARS = {};
	this.CHARS_CODE_NAME = {};
	this.ROW_CHARS = {
		top:['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', ],
		bottom:[],
	};
	this.ROW_CHARS_BOTTOM_OV = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', ',', 'l', '.', ';', '/', ];
	this.ROW_CHARS_BOTTOM_ST = ['z', 's', 'x', 'd', 'c', 'f', 'v', 'b', 'h', 'n', 'j', 'm',];
	
	this.OCTAVE_KEYCODE = {
		'-' : 189, '^' : 222, '+' : 187,
	},
	this.ZOOM_KEYCODE = {
		'[' : 219, ']' : 221,
	},
	this.zoomKeys = ['[', ']'];
	
	this.KEY_REPLACE_FIREFOX = {
		187 : 59, 189 : 173, 222 : 160,
	};
	this.ROW_KEYCODE = {
		top:[81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85, 73, 57, 79, 48, 80],
		bottom:[],
	};
	this.ROW_KEYCODE_BOTTOM_OV = [90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77, 188, 76, 190, 187, 191];
	this.ROW_KEYCODE_BOTTOM_ST = [90, 83, 88, 68, 67, 70, 86, 66, 72, 78, 74, 77, ];
	this.keyBottomType = 'straight';
	// this.keyBottomType = 'overlap';
	
	//初期化でcharが入る
	this.BLACK_KEY = {};
	this.BLACK_KEY_OV = {'2':0, '3':0, '5':0, '6':0, '7':0, '9':0, '0':0, 's':0, 'd':0, 'g':0, 'h':0, 'j':0, 'l':0, ';':0, ':': 0};
	this.BLACK_KEY_ST = {'2':0, '3':0, '5':0, '6':0, '7':0, '9':0, '0':0, 's':0, 'd':0, 'f':0, 'h':0, 'j':0};
	this.iWHITE_KEYS = {};
	this.iBLACK_KEYS = {};
	this.BLACK_KEY_SKIP = {};
	this.BLACK_KEY_SKIP_SUM = 4;
	this.BLACK_KEY_SKIP_OV = {'2': 0, '3': 0, '5': 1, '6': 1, '7': 1, '9': 2, '0': 2, 's': 2, 'd': 2, 'g': 3, 'h': 3, 'j': 3, 'l': 4, ';': 4,};
	this.BLACK_KEY_SKIP_ST = {'2': 0, '3': 0, '5': 1, '6': 1, '7': 1, '9': 2, '0': 2, 's': 3, 'd': 3, 'f': 3, 'h': 4, 'j': 4};
	this.octaveLevel = 2;
	this.octaveRange = 3; //octave level range
	this.octaveInKeys = 12; //1オクターブ中のキー数
	this.octaveInWhiteKeys = 7; //1オクターブ中の白鍵キー数
	this.octaveRangeCells = 21; //4px * 21cells
	this.octaveRangeScale = 63; //per page
	this.fingers = 6;
	this.status_on = []; //set chars
	this.onkeyEvent = null;
	this.offkeyEvent = null;
	this.octaveEvent = null;
	this.isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? true : false;
	this.imageLoaded = false;
	this.loader = imageResource;
	this.uiImageName = 'ui_16p';
	
	this.octaveSeparateCount = [12, 12, 5]; //オクターブが切り替わる鍵盤数
	
	this.noteKeysSpriteKeys = {};
	this.noteKeysSpriteKeys_ov = {'q': 0, '2': 0 , 'w': 1, '3': 0, 'e': 5, 'r': 3, '5': 0, 't': 1, '6': 0, 'y': 1, '7': 0, 'u': 2, 'i': 0, '9': 0, 'o': 1, '0': 0, 'p': 2
											, 'z': 0, 's': 0, 'x': 1, 'd': 0, 'c': 2, 'v': 3, 'g': 0, 'b': 4, 'h': 0, 'n': 1, 'j': 0, 'm': 5, ',': 0, 'l': 0, '.': 1, ';': 0, '/': 2,};
	this.noteKeysSpriteKeys_st = {'q': 0, '2': 0 , 'w': 1, '3': 0, 'e': 5, 'r': 3, '5': 0, 't': 1, '6': 0, 'y': 1, '7': 0, 'u': 2, 'i': 0, '9': 0, 'o': 1, '0': 0, 'p': 2
											, 'z': 3, 's': 0, 'x': 4, 'd': 0, 'c': 1, 'f': 0,'v': 5, 'b': 0, 'h': 0, 'n': 1, 'j': 0, 'm': 2,};
											
	this.whiteKeysSprite = [[9, 7, 1, 2], [10, 7, 1, 2], [11, 7, 1, 2], [12, 7, 1, 2], [13, 7, 1, 2], [14, 7, 1, 2], ];
	this.blackKeysSprite = [[9, 5, 1, 2], ];
	this.whiteKeysCmargin = {x: 2, y: 24};
	this.blackKeysCmargin = {x: 3, y: 24};
	
	// this.paramKeys = ['VOLUME', 'TYPE', 'LENGTH', 'DELAY', 'DETUNE', 'SWEEP', 'ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE' ];
	this.paramKeys = ['TYPE', 'VOLUME', 'ATTACK', 'DECAY', 'SUSTAIN', 'LENGTH', 'RELEASE' , 'DELAY', 'DETUNE', 'SWEEP'];
	this.paramSubKeys = ['NOTE'];
	this.paramKeysStrLen = 5;
	this.paramPage = 0;
	this.paramOffset = 0;
	this.paramLimit = 6;
	this.paramsScrollOffset = 0;
	
	this.ltSoundChParamKeys = {
		'TYPE': 'waveType',
		'VOLUME': 'volumeLevel',
		'ATTACK': 'attack',
		'DECAY': 'decay',
		'SUSTAIN': 'sustain',
		'LENGTH': 'length' ,
		'RELEASE': 'release',
		'DELAY': 'delay',
		'DETUNE': 'detune',
		'SWEEP': 'sweep',
		
		'NOTE': 'note',
	};
	
	this.corsolKeys = ['up', 'down', 'left', 'right'];
	this.baseKeys = ['<', '>', 'select', 'space'];
	
	this.paramCursor = {x: 0, y: 0};
	this.paramCursorCurrent = {x: 0, y: 0};
	this.paramCursorBlinkFlag = false; //paramカーソルの点滅

	this.editMode = 'note';
	// this.modeNames = ['tune', 'note', 'file', 'play'];
	// this.modeNames = {0:'tune', 1:'note', 2:'play', 3:'catch'};
	this.modeNames = ['tune', 'note', 'play', 'catch', 'file', 'error'];
	// this.modeNames = ['tune', 'note'];
	
	this.catchNotes = {}; //キャッチ操作
	this.selectNote = {}; //選択中
	this.selectNoteHistory = []; //選択履歴
	this.catchType = 'note';
	this.catchNoteBlinkCycle = 0;
	this.blinkDrawParams = []; //点滅スプライト保持
	this.blinkDrawEventset = []; //点滅スプライト保持
	this.catchEventset = {}; // tune{param0:x param1:x}
	
	this.noteSprite = 176;
	this.eventsetSprite = 192;
	
	this.noteScrollCmargin = {x: 3, y: 3};
	this.noteCmargin = {x: 0, y: 11.5};
	// this.noteCmargin = {x: 3, y: 11.5};
	this.noteScrollPos = {x: 0, y: 0};
	this.noteScrollPage = 0;
	this.scrollTime = -1;
	
	this.noteRange = 1; // position multiple
	this.noteRangeCells = 40; // 8px * 32cells
	this.noteRangeScale = 4000; // msec per page
	this.NOTE_RANGE_SCALE_MIN = 40;
	this.NOTE_RANGE_SCALE_MAX = this.noteRangeCells * this.noteRangeScale;
	this.NOTE_RANGE_SCALE_DEFAULT = 4000;
	this.seekLineCount= 0; //note をセットする位置アニメ
	this.drawNotesCount = 0;

	this.seekSprite = 242; //ノートカーソル
	this.arrowSprite = 240; //左右カーソル
	this.seekCmargin = {x: 2, y: 0};

	this.menuDispCmargin = {x: 24, y: 17};
	this.ocsWaveCmargin = {x: 26, y: 17};
	this.menuCsize = {w: 12, h: 6};
	this.menuCindent = 1;

	this.catchMenuList = ['KEEP'];
	this.noteMenuList = ['CHANNEL', 'CATCH', 'PASTE', 'REMOVE', 'FILE'];
	this.noteMenuCursor = {x:0, y:0};
	
	// this.fileMenuList = ['LOAD', 'SAVE', 'CLEAR'];
	// this.fileTypeList = ['COOKIE', 'STRINGS', 'SERVER'];
	this.fileMenuList = ['LOAD', 'SAVE', 'TITLE'];
	this.fileTypeList = ['COOKIE', 'SERVER'];
	this.clearMenuList = ['FILE', 'CURRENT'];
	this.fileListList = ['FILESELECT'];
	this.fileTitleList = ['FINISH', 'CANCEL'];
	this.eventsetMenuList = ['SET'];
	this.finalConf = ["NO", "OK"];
	this.serverFileList = [];
	this.fileMenuMap = {};
	this.commandPath = [];
	this.fileMenuCursor = {x:0, y:0};
	this.fileListCursor = {x:0, y:0};
	this.fileListPage = 0;
	this.fileListOffset = 0;

	this.eventsetMenuCursor = {x:0, y:0};
	
 	this.modeRect = {tune: [8, 9, 2, 2], note: [10, 9, 2, 2], file: [12, 9, 2, 2], play: [14, 9, 2, 2], 'catch': [8, 11, 2, 2], eventset: [10, 11, 2, 2], loading:  [12, 11, 2, 2], error: [14, 11, 2, 2]};
	this.modeCmargin = {x: 32, y: 19};
	this.word = null;
	
	// this.playSound = false;
	this.bg2x = {t: 0, b: 0};
	
	this.chOscWidth = 64;
	this.analyseRate = 4; // perFrame
	this.analyseCount = 0;
	// this.analysedData = new Uint8Array(this.chOscWidth);
	// this.analysedData_b = new Uint8Array(this.chOscWidth);
	this.analysedData = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
	this.analysedData_b = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
	
	this.paramskeysCmargin = {x:3, y: 17};
	this.channelParamsCmargin = {x:8, y: 17};
	this.leftScreenCmargin = {x: 2, y: 17};
	this.leftScreenSize = {w: 22, h: 6};
	this.charBoardCurrent = {x: 0, y: 0};
	this.charBoardCursor = {x:0, y: 0};
	this.charBoardLimit = {x: 20, y:13};
	
	return;
}

LitroKeyboard.prototype = {
	init : function(litroSound) {
		var code, row, chars, i
		, whiteCount = 0
		, blackCount = 0
		, codeNameCount = 0
		, repkeys_ff = this.KEY_REPLACE_FIREFOX;
		this.litroSound = litroSound;
		litroKeyboardInstance = this;
		this.keyControll = new KeyControll();
		this.player = litroPlayerInstance;
		
		//基本キー
		this.keyControll.initCommonKey();
		
		
		if(this.keyBottomType == 'straight'){
			this.ROW_KEYCODE.bottom = this.ROW_KEYCODE_BOTTOM_ST;
			this.BLACK_KEY = this.BLACK_KEY_ST;
			this.BLACK_KEY_SKIP = this.BLACK_KEY_SKIP_ST;
			this.ROW_CHARS.bottom = this.ROW_CHARS_BOTTOM_ST;
			this.noteKeysSpriteKeys = this.noteKeysSpriteKeys_st;
		}else{
			this.ROW_KEYCODE.bottom = this.ROW_KEYCODE_BOTTOM_OV;
			this.BLACK_KEY = this.BLACK_KEY_OV;
			this.BLACK_KEY_SKIP = this.BLACK_KEY_SKIP_OV;
			this.ROW_CHARS.bottom = this.ROW_CHARS_BOTTOM_OV;
			this.noteKeysSpriteKeys = this.noteKeysSpriteKeys_ov;
		}
		
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

				this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[codeNameCount % this.CODE_NAME.length];
				this.CHARS_INDEX[codeNameCount] = chars[i];
				codeNameCount++;
				// if(row == 'top'){
					// this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[i % this.CODE_NAME.length];
				// }else{
					// this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[(i + 5) % this.CODE_NAME.length];
				// }
				
				
				//補完
				if(chars[i] in this.BLACK_KEY){
					this.BLACK_KEY[chars[i]] = code[i];
					this.iBLACK_KEYS[chars[i]] = blackCount++;
				}else{
					this.iWHITE_KEYS[chars[i]] = whiteCount++;
				}
			}
			//重複分戻すキー
			if(this.keyBottomType == 'overlap'){
				blackCount -= 2;
				whiteCount -= 3;
			}
		}
		// console.log(this.iWHITE_KEYS);
		
		//オクターブ設定
		for(i in this.OCTAVE_KEYCODE){ 
			code = this.OCTAVE_KEYCODE[i];
			if(this.isFirefox){
				code = repkeys_ff[code] == null ? code : repkeys_ff[code];
			}
			this.keyControll.setKey(i, code);
		}
		//ズームキー
		for(i in this.ZOOM_KEYCODE){
			this.keyControll.setKey(i, this.ZOOM_KEYCODE[i]);
		}

		
		for(i = 0; i < this.CODE_NAME.length; i++){
			this.CODE_NAME_INDEX[this.CODE_NAME[i]] = i;
		}
		
		//チャンネルデータ初期
		// for(i = 0; i < this.litroSound.channel.length; i++){
			// this.eventsetData.push({});
		// }
		
		//ファイルメニュー設定
		this.fileMenuMap = {
			LOAD: this.fileTypeList,
			SAVE: this.fileTypeList,
			CLEAR: this.clearMenuList,
			COOKIE: this.finalConf,
			STRINGS: this.finalConf,
			FILESELECT: this.finalConf,
			SERVER: this.fileListList,
			TITLE: this.finalConf,
			FILE: this.fileMenuList,
			CURRENT: this.finalConf,
		};
		
		//
		
		this.loadImages();
		this.initFingerState(this.fingers);
		this.initCanvas();
		this.initWords();
		this.setBg2Position(this.noteScrollPos.x);
		this.initCatchEvent();
	},
	
	initWords: function()
	{
		var word, WordPrint = wordPrint;
		word = new WordPrint();
		word.setFontSize('8px');
		this.word = word;
	},
	
	initCanvas: function()
	{
		makeScroll('screen', true);
		makeScroll('view', false);
		makeScroll('bg1', false);
		makeScroll('bg2', false);
		makeScroll('sprite', false);
		makeScroll('tmp', false);
		
		var bg1 = scrollByName('bg1')
			, bg2 = scrollByName('bg2')
			, spr = scrollByName('sprite')
			, view = scrollByName('view')
			, scr = scrollByName('screen')
			;
		scr.clear(COLOR_BLACK);
		view.clear(COLOR_BLACK);
		bg1.clear(COLOR_BLACK);
		bg2.clear();
		spr.clear();

		
	},
	
	initFingerState: function(num)
	{
		var i;
		this.status_on = [];
		for(i = 0; i < num; i++){
			this.status_on.push(null);
		}
	},
	
	initSprite: function()
	{
		var i
		;
		this.waveSprite = makePoint(this.uiImageName, 1);
		for(i = 0; i < this.whiteKeysSprite.length; i++){
			this.whiteKeysSprite[i] = makeSpriteChunk(this.uiImageName, makeRect(this.whiteKeysSprite[i]));
		}
		this.blackKeysSprite[0] = makeSpriteChunk(this.uiImageName, makeRect(this.blackKeysSprite[0]));
		
	},
	
	initCatchEvent: function(defaultset)
	{
		var i, type;
		if(defaultset == null){
			for(i = 0; i < AudioChannel.sortParam.length; i++){
				type = AudioChannel.sortParam[i];
				this.catchEventset[type] = {};
			}
		}else{
			this.catchEventset = defaultset;
		}
		// console.log("init", this.catchEventset);
	},
	initSelect: function()
	{
		this.selectNote = {time: -1, ch: -1, type:'note'};
		this.selectNoteHistory = [];
		this.selectNoteHistory.push({time: -1, ch: -1, type:'note'});
	},
	selectEventset: function(ch, eventset, pop)
	{
		if(this.selectNote.time > 0 && !pop){
			this.selectNoteHistory.push({time: this.selectNote.time, ch: this.selectNote.ch, type:this.selectNote.type});
		}
		this.selectNote = {time: eventset.time, ch: ch, type:eventset.type};
	},
		
	loadImages: function()
	{
		// this.loader.init();
		var resorce = loadResource([this.uiImageName]);
		resorce.onload = function(){
			var ltkb = litroKeyboardInstance;
			ltkb.imageLoaded = true;
			ltkb.initSprite();
			ltkb.openFrame();
		};
	},
	
	isBlackKey: function(name){
		if(this.BLACK_KEY[name] == null){
			return false;
		}else{
			return true;
		}
	},
	seekDispSide: function(pos){
		var ppos = this.seekPosition()
			, center = DISPLAY_WIDTH / 2
		;
		pos = pos == null ? ppos : pos;
		if(center < pos){
			return 'right';
		}
			return 'left';
	},
	
	seekCenterPosition: function()
	{
		return this.seekPosition(this.noteRangeScale * this.noteRange / 2);
	},
	
	noteCurrentHeight: function(key)
	{
		var start = this.octaveLevel * this.octaveInKeys
			, append = 0
			, cheight = 0
			, skip = 0
		;
		key = key - start;
		while(this.octaveInKeys < key - 1){
			key = key - this.octaveInKeys;
			append++;
		}
		cheight = this.iWHITE_KEYS[this.CHARS_INDEX[key]] == null ? this.iBLACK_KEYS[this.CHARS_INDEX[key]] + this.BLACK_KEY_SKIP[this.CHARS_INDEX[key]]: this.iWHITE_KEYS[this.CHARS_INDEX[key]];
		return cheight + (append * this.octaveInWhiteKeys);
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
	
	getLastCommand: function(a)
	{
		a = a == null ? 0 : a;
		return this.commandPath[this.commandPath.length - 1 - a] == null ? '' : this.commandPath[this.commandPath.length - 1 - a];
	},
	
	getNoteMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.noteMenuList;
		}
		return null;
	},
	
	getFileMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.fileMenuList;
		}
		
		// if(this.getLastCommand() == 'SERVER'){
			// return 'FILELIST';
		// }
		
		return  this.fileMenuMap[this.commandPath[this.commandPath.length - 1]] == null ? 
		null :  this.fileMenuMap[this.commandPath[this.commandPath.length - 1]];
	},
	
	getCatchMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.catchMenuList;
		}
		return null;
		// return  this.fileMenuMap[this.commandPath[this.commandPath.length - 1]] == null ? 
		// null :  this.fileMenuMap[this.commandPath[this.commandPath.length - 1]];
		
	},
	
	getActiveModeMenuList: function()
	{
		switch(this.getMode())
		{
			case 'tune': return [];
			case 'note': return this.getNoteMenuList();
			case 'play': return this.getFileMenuList();
			case 'catch': return this.getCatchMenuList();
			case 'file': return this.getFileMenuList();
			default: return [];
		}
	},
	
	getActiveModeCursor: function()
	{
		switch(this.getMode())
		{
			case 'tune': return this.paramCursor;
			case 'note': return this.noteMenuCursor;
			case 'play': return this.fileMenuCursor;
			case 'catch': return {};
			case 'file': return this.fileMenuCursor;
			default: return {};
		}
	},
	
	/**
	 * 位置調整系
	 * @param {Object} pos
	 */
	getNoteDispPos: function(pos)
	{
		pos = pos == null ? this.player.noteSeekTime : pos;
		return (pos % this.noteRangeScale) * (DISPLAY_WIDTH / this.noteRangeScale);
	},
	
	getNoteSeekPage: function(putpos)
	{
		putpos = putpos == null ? this.player.noteSeekTime : putpos;
		return (putpos / this.noteRangeScale) | 0;
	},
	
	getParamKeyName: function(index)
	{
		index = index == null ? this.paramCursor.x : index;
		return this.ltSoundChParamKey[this.paramKeys[index]];
	},
	
	getTuneParam: function()
	{
		return this.litroSound.channel[this.paramCursor.x].tune([this.paramCursor.y]);
	},
	
	isCatch: function(time, ch, dataType)
	{
		if(time in this.catchEventset[dataType] && this.selectNote.ch == ch){
			return true;
		}
		return false;
	},
	
	resolutedTime: function(time)
	{
		var cellTime = (this.noteRangeScale / this.noteRangeCells) | 0
			, abTime = time % cellTime
		;
		return cellTime - abTime > abTime ? time - abTime : time - abTime + cellTime ;
	},
	
	playLitro: function()
	{
		if(!this.player.isPlay()){
			return;
		}
		this.updateForwardSeek();
	},
	
	makeEventset: function(type, value, time)
	{
		time = time == null ? this.player.noteSeekTime: time;
		var e = {
			time: this.resolutedTime(time),
			type: type == null ? this.getParamKeyName() : type,
			value: value
		}
		;
			// console.log(type, value, time);
		return e;
	},
	
	deleteEventChange: function(ch, events)
	{
		var eventset
		, type, t, samp = []
		, deleted = {}
		, data
		, sort = AudioChannel.sortParam
		;
		ch = ch == null ? this.paramCursor.x : ch;
		events = events == null ? this.catchEventset : events;
		for(type in events){
			deleted[type] = {};
			for(t in events[type]){
				samp.push(t);
				data = events[type][t];
				if(this.player.eventsetData[ch][type][t] != null){
					eventset = this.player.eventsetData[ch][type][t];
//					deleted.tune[t] = this.makeEventset(type, eventset.value, eventset.time);
					deleted[type][t] = this.makeEventset(type, eventset.value, eventset.time);
					delete this.player.eventsetData[ch][type][t];
					
				}
			}
		}
		
		return deleted;
	
	},
	
	// setEventChange: function(ch, type, value, time)
	setEventChange: function(ch, eventset)
	{
		this.player.eventsetData[ch][eventset.type][eventset.time] = eventset;
	},
	
	pasteEventCange: function(ch, time, events)
	{
		var type, eventset = {}, t, eventArray = []
			, startTime = 9999999999, endTime = -1, moveTime;
		events = events == null ? this.catchEventset : events;
		//type-time -> time-type
		for(type in events){
			for(t in events[type]){
				eventset[t] = eventset[t] == null ? {} : eventset[t];
				eventset[t][type] = events[type][t];
				startTime = startTime > t ? t : startTime;
				endTime = endTime < t ? t : endTime;
			}
		}
		
		for(t in eventset){
			for(type in eventset[t]){
				eventArray.push(eventset[t][type]);
			}
		}

		if(eventArray.length == 0){
			return;
		}
		moveTime = startTime <= this.selectNote.time ? time - startTime : time - endTime;
		// moveTime = time;
		for(type in events){
			for(t in events[type]){
				if((t | 0) + moveTime < 0){
					continue;
				}
				eventset = this.makeEventset(type, events[type][t].value, (t | 0) + moveTime);
				this.setEventChange(ch, eventset);
			}
		}
	},
	
	// deleteNote: function(ch, notes)
	// {
		// if(this.player.eventsetData[ch] == null){
			// return;
		// }
		// for(var t in notes){
			// if(this.player.eventsetData[ch][t] == null){
				// continue;
			// }
			// delete this.player.eventsetData[ch][t];
		// };
	// },

	onCode: function(chr)
	{
			// console.log(chr);

		var channel, chars, row, octave, code, i
			, pos = this.getNoteDispPos()
			, seekPage = this.getNoteSeekPage();
		;
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
		
		//仮使用
		// console.log(this.noteSeekTime);
		// this.setNote(channel, this.makeNote(code, octave));
		this.setEventChange(channel, this.makeEventset('note', code + (octave * this.octaveInKeys)));
		this.drawNoteScroll(seekPage);
		if(pos < cellhto(2) ){
			this.drawNoteScroll(seekPage - 1);
		}else if(pos > cellhto(this.noteRangeCells) - cellhto(2) ){
			this.drawNoteScroll(seekPage + 1);
		}
		this.drawNoteScroll(null, true);

	},
	
	offCode: function(chr)
	{
		var channel = this.searchState(chr);

		if(chr == null || channel < 0){
			// this.offkeyEvent();
			// this.initFingerState(this.fingers);
			// this.litroSound.offNoteFromCode();
			// console.log('chr: ' + chr);
			return;
		}
		if(this.offkeyEvent != null){
			this.offkeyEvent(chr);
		}
		this.status_on[channel] = null;
		// this.litroSound.offNoteFromCode(channel);
		this.litroSound.fadeOutNote(channel);
	},
	
	incOctave: function()
	{
		if(this.octaveLevel < this.litroSound.OCTAVE_MAX){
			this.octaveLevel++;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
			this.drawNoteScroll(null, true);
		}
	},
	
	decOctave: function()
	{
		if(this.octaveLevel > 0){
			this.octaveLevel--;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
			this.drawNoteScroll(null, true);
		}
	},
	
	searchReadySlot: function()
	{
		var i, key
		;
		for(i = 0; i < this.fingers; i++){
			key = (i + this.paramCursor.x) % this.litroSound.channel.length;
			// key = i;
			if(this.status_on[key] == null){
				return key;
			}
		}

		return -1;
	},
	
	searchState: function(chr)
	{
		var i, key;
		for(i = 0; i < this.fingers; i++){
			key = (i + this.paramCursor.x) % this.litroSound.channel.length;
			// key = i;
			if(this.status_on[key] == chr){
				return key;
			}
		}

		return -1;
	},
	
	getMode: function()
	{
		return this.editMode;
	},
	
	getTimeNoteByRange: function(ch, startTime, endTime)
	{
		var eventsetData = this.eventsetData[ch]
			, i
			, trimData = {}
			, note
		;
		
		for(i = 0; i < eventsetData.length; i++){
			note = eventsetData[i];
			if(startTime > note.time){
				continue;
			}else if(endTime <= note.time){
				break;
			}
			trimData[note.time] = note;
		}

		return trimData;
	},
	
	indexAtWhite: function(chr)
	{
		return this.iWHITE_KEYS[chr] != null ? this.iWHITE_KEYS[chr] : -1;
	},
		
	indexAtBlack: function(chr)
	{
		return this.iBLACK_KEYS[chr] != null ? this.iBLACK_KEYS[chr] : -1;
	},
	
	changeEditMode: function(mode, comClear)
	{
		comClear = comClear == null ? true : comClear;
		if(typeof mode == 'string'){
			this.editMode = mode;
		}else if(mode == parseInt(mode, 10)){
			this.editMode = this.modeNames[mode];
		}
		var self = this;
		if(this.editMode == 'error'){
			setTimeout(function(){
				self.changeEditMode('note');
				self.drawMenu();
			}, 1000);
		}

		if(comClear){
			this.commandPath = [];
		}
		return;
	},
	
	loadList: function(page)
	{
		var self = this;
		try{
			this.player.listFromServer(USER_ID, this.fileListPage, 
				function(append){
					if(append == null || append.error_code != null){
						self.changeEditMode('error');
						self.drawMenu();
						return;
					}
					self.serverFileList = append.length == null ? [append] : append;
					if(self.getLastCommand(1) == 'SAVE'){
						append.push({sound_id: 0, user_id: USER_ID, title: 'NEW FILE'});
					}
					self.changeEditMode('file', false);
					self.drawFileMenu();
					// self.drawMenu();
					self.drawFileList();
					self.drawFileListCursor();
				}, function(){
					self.changeEditMode('error');
				});
		}catch(e){
			console.error(e);
			self.changeEditMode('error');
		}
	},
	
	/*
	 * 最後のコマンドがOKだったら実行
	 */
	commandExecute: function()
	{
		var com_conf = this.getLastCommand()
			, com_type = this.getLastCommand(1)
			, com_method = this.getLastCommand(2)
			, com_submethod = this.getLastCommand(3)
		;
		if(this.commandPath.indexOf('COOKIE') == -1){
			com_type = com_method;
			com_method = com_submethod;
		}
		
		// this.player.listFromSever()
		if(com_conf != 'OK'){
			return;
		}
		switch(com_method){
			case 'SAVE': this.saveCommand(com_type); break;
			case 'LOAD': this.loadCommand(com_type); break;
		}
	},
	
	saveCommand: function(type)
	{
		var self = this, tid;
		switch(type){
			case 'COOKIE': this.player.saveToCookie(); this.changeEditMode('note'); break;
			case 'SERVER': this.player.saveToSever(USER_ID, this.serverFileList[this.fileListCursor.y].sound_id,
				function(data){
					if(data == null || data === false){
						self.changeEditMode('error');
						self.drawMenu();
						return;
					}
					self.changeEditMode('note');
					self.drawMenu();
					return;
				},
				function(){
					self.changeEditMode('error');
					self.drawMenu();
				});
				this.changeEditMode('loading'); break;
		}
	},
	
	loadCommand: function(type)
	{
		switch(type){
			case 'COOKIE': this.player.loadFromCookie(); this.changeEditMode('note');break;
			case 'SERVER': this.player.loadFromSever(); break;
		}
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
	
	updateScrollPage: function(scrollPos)
	{
		var page
		;
		scrollPos = scrollPos == null ? this.noteScrollPos.x : scrollPos;
		page = (scrollPos / DISPLAY_WIDTH) | 0;
		if(this.noteScrollPage != page){
			this.noteScrollPage = page;
			return true;
		}else{
			return false;
		}
	},
	
	seekTime: function(seekPos)
	{
		seekPos = seekPos == null ? this.noteScrollPos.x : seekPos;
		return seekPos * (this.noteRangeScale * this.noteRange / DISPLAY_WIDTH);
	},	
	seekPosition: function(seekTime)
	{
		seekTime = seekTime == null ? this.player.noteSeekTime : seekTime;
		// console.log(seekTime *DISPLAY_WIDTH / (this.noteRangeScale * this.noteRange));
		return  seekTime * DISPLAY_WIDTH / (this.noteRangeScale * this.noteRange);
	},
	//スクロール合わせ
	setBg2Position: function(scrollPos)
	{
		var pos = scrollPos | 0
			// , pos = ((DISPLAY_WIDTH * (scrollPos / this.noteRangeScale)) | 0)
			, pre = (this.bg2x.t / DISPLAY_WIDTH) | 0
		;
		this.bg2x.t = - (((pos + DISPLAY_WIDTH) % (DISPLAY_WIDTH * 2)) - DISPLAY_WIDTH);
		
		if(this.bg2x.t >= 0){
			this.bg2x.b = this.bg2x.t - DISPLAY_WIDTH;
		}else{
			this.bg2x.b = this.bg2x.t + DISPLAY_WIDTH;
		}
	},
	
	updateForwardSeek: function(pos)
	{
		var centerPos = this.seekCenterPosition()
			, setPos = this.seekPosition()
			, player = this.player
			;
		this.noteScrollPos.x = setPos > centerPos ? setPos - centerPos: 0;
		this.setBg2Position(this.noteScrollPos.x);
		if(this.updateScrollPage()){
			this.drawNotesCount = 0; //ノート描画カウントリセット
			this.drawNoteScroll(this.noteScrollPage + 1);
		}
		this.drawNoteScroll(null, true);
	},

	updateBackSeek: function()
	{
		var centerPos = this.seekPosition(this.noteRangeScale * this.noteRange / 2)
			, setPos = this.seekPosition()
			, player = this.player
			;
		this.noteScrollPos.x = setPos < centerPos ? 0 : setPos - centerPos;
		this.noteScrollPos.x = this.noteScrollPos.x < 0 ? 0 : this.noteScrollPos.x;
		this.setBg2Position(this.noteScrollPos.x);
		if(setPos == 0){
			this.updateScrollPage();
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
		}else if(this.updateScrollPage()){
			this.drawNotesCount = 0; //ノート描画カウントリセット
			this.drawNoteScroll(this.noteScrollPage);
		}		
		this.drawNoteScroll(null, true);
	},
	
	/**
	 * キーチェック
	 */
	moveMenuCursorCommon: function(cur, dir, list)
	{
		var limit = list.length
			, moveTime = this.seekTime(cellhto(1));
			// , moveTime = this.noteRange * this.noteRangeScale / this.noteRangeCells
		;
		// console.log(moveTime);
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit;
					this.drawNoteMenu();
					this.drawNoteCursor();
					break;
			case 'down': cur.y = (cur.y + 1) % limit;
					this.drawNoteMenu();
					this.drawNoteCursor();
					break;
			case 'left': this.player.seekMoveBack(moveTime); this.updateBackSeek(); break;
			case 'right': this.player.seekMoveForward(moveTime); this.updateForwardSeek(); break;
		}
	},
	
	channelMove: function(dir)
	{
		var cur = this.paramCursor
			, chLength = this.litroSound.channel.length
		;
		if(dir == 'right'){
			cur.x = (cur.x + 1) % chLength;
		}else{
			cur.x = (cur.x + chLength - 1) % chLength;
		}
		this.drawParamKeys();
		this.drawChannelParams();
		this.drawParamCursor();
	},
	
	moveChannelParamCursor: function(dir)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, limit = this.paramLimit
			, offset = this.paramOffset
			, param = this.ltSoundChParamKeys[this.paramKeys[cur.y]]
			, paramsLength = this.paramKeys.length
			, currentLength = paramsLength - (limit - 1)
		;
		// this.drawParamCursor(curr.x, curr.y, true);
		
		switch(dir){
			case 'up': cur.y = (cur.y + paramsLength - 1) % paramsLength;
							if(--curr.y < 0){
								curr.y = offset == 0 ? limit - 1 : 0;
								offset = (offset + currentLength - 1) % currentLength; //4
							}
							break;
			case 'down': cur.y = (cur.y + 1) % paramsLength;
							if(++curr.y > limit - 1){
								curr.y = offset + limit - 1 >= paramsLength - 1 ? 0 : limit - 1;
								offset = (offset + 1) % currentLength;
							}
							break;
			case 'left': this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param) - 1);
							this.drawParamCursor();
							break;
			case 'right': this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param) + 1);
							this.drawParamCursor();
							break;
			// case 'left': this.moveMenuCursorCommon(null, dir, []); break;
			// case 'right': this.moveMenuCursorCommon(null, dir, []); break;
		}
		this.paramOffset = offset;
		
		this.drawParamKeys(offset, limit);
		this.drawChannelParams(offset, limit);
		this.drawParamCursor();
	},
	
	moveCatchCursor: function(dir)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, limit = this.paramLimit
			, offset = this.paramOffset
			, searchTime = -1
			, catchKey = ['note', 'TUNE', 'ALL']
			, catchVal, eventset
			, ignore = this.selectNote
			, prevNote
			, ch = cur.x
		;

		// this.drawParamCursor(curr.x, curr.y, true);
		for(catchVal = 0; catchVal < catchKey.length; catchVal++){
			if(catchKey[catchVal] == this.catchType){break;}
		}
		switch(dir){
			case 'up': this.catchType = catchKey[(catchVal + catchKey.length - 1) % catchKey.length];
							break;
			case 'down': this.catchType = catchKey[(catchVal + 1) % catchKey.length];
							break;
			case 'left': eventset = this.player.searchNearBack(ch, this.player.noteSeekTime, 0, this.catchType, ignore); break;
			case 'right': eventset = this.player.searchNearForward(ch, this.player.noteSeekTime, -1, this.catchType, ignore); break;
		}
		this.drawMenu(this.editMode);

		if(eventset != null){
			if((this.catchType != 'ALL' && this.catchType != 'TUNE') && (this.selectNote.ch != ch || this.selectNote.type != this.catchType)){
				//違うチャンネルをキャッチした
				this.initCatchEvent();
				this.initSelect();
			}
			// console.log(prevNote);
			prevNote = this.selectNoteHistory.pop();
			if(eventset.time == prevNote.time && eventset.type == prevNote.type){
				//もどった
				delete this.catchEventset[this.selectNote.type][this.selectNote.time];
				prevNote = null;
				this.selectEventset(ch, eventset, true);
			}else{
				this.selectNoteHistory.push(prevNote);
				this.selectEventset(ch, eventset, false);
			}
			
			if(eventset.time > this.player.noteSeekTime){
				//前へキャッチ
				this.player.noteSeekTime = eventset.time;
				this.updateForwardSeek();
			}else{
				//後ろへキャッチ
				this.player.noteSeekTime = eventset.time;
				this.updateBackSeek();
			}
			
			// eventset = this.player.eventsetData[ch][this.selectNote.type][searchTime];

			this.catchEventset[eventset.type][eventset.time] = eventset;
			
			this.drawSelectEvents(this.selectNote);
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
			this.drawNoteScroll(null, true);
		}
		// this.drawParamKeys(offset, limit);
		// this.drawChannelParams(offset, limit);
		// this.drawParamCursor(curr.x, curr.y, false);
	},
	
	moveFileTitleCursor: function(dir)
	{
		var cur =  this.charBoardCursor
			, curr = this.paramCursorCurrent
			, limit = this.charBoardLimit
		;
		if(list == null){
			 return;
		}
		if(cur.x == limit.x){
			cur = this.fileMenuCursor;
			limit = this.getActiveModeMenuList();
			switch(dir){
				case 'up': cur.y = (cur.y + limit.y - 1) % limit.y; break;
				case 'down': cur.y = (cur.y + 1) % limit.y; break;
				case 'left': cur.x = cur.x - 1; break;
				case 'right': cur.x = cur.x + 1; break;
				// case 'left': cur.x = (cur.x + limit.x - 1) % limit.x; break;
				// case 'right': cur.x = (cur.x + 1) % limit.x; break;
			}
		}else{
			switch(dir){
				case 'up': cur.y = (cur.y + limit.y - 1) % limit.y; break;
				case 'down': cur.y = (cur.y + 1) % limit.y; break;
				case 'left': cur.x = cur.x - 1; break;
				case 'right': cur.x = cur.x + 1; break;
				// case 'left': cur.x = (cur.x + limit.x - 1) % limit.x; break;
				// case 'right': cur.x = (cur.x + 1) % limit.x; break;
			}
		}
		if(cur.x > limit.x){
			cur.x = 0;
		}else if(cur.x < 0){
			cur.x = limit.x;
		}
	},
	
	moveFileMenuCursor: function(dir)
	{
		if(this.getLastCommand() == 'TITLE'){
			this.moveFileTitleCursor(dir);
			return;
		}
		var cur = this.fileMenuCursor
			, curr = this.paramCursorCurrent
			, limit
			, offset = this.fileListOffset, page = this.fileListPage
			, chLength = this.litroSound.channel.length
			, paramsLength = this.paramKeys.length
			, list = this.getFileMenuList(), dispHeight = 6
			, currentLength
		;
		if(list == null){
			 return;
		}
		
		if(this.getLastCommand() == 'SERVER'){
			cur = this.fileListCursor;
			limit = this.serverFileList.length;
		}else{
			limit = list.length;
		}
		
		currentLength = paramsLength - (limit - 1);
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit; break;
			case 'down': cur.y = (cur.y + 1) % limit; break;
			case 'left': cur.y = 0; break;
			case 'right': cur.y = limit - 1; break;
		}
		this.drawFileMenu();
		
		if(this.getLastCommand() == 'SERVER'){
			offset = offset < cur.y ? offset - 1 : offset;
			offset = offset + dispHeight > cur.y ? offset + 1 : offset;
			this.drawFileList();
			this.drawFileListCursor();
		}else{
			this.drawFileCursor();
		}
	},
	moveEventsetCursor: function(dir)
	{		var cur = this.noteMenuCursor
			, list = this.noteMenuList
		;
		switch(dir)
		{
			case 'up': this.moveChannelParamCursor(dir); break;
			case 'down': this.moveChannelParamCursor(dir); break;
			case 'left': this.moveMenuCursorCommon(cur, dir, list); break;
			case 'right': this.moveMenuCursorCommon(cur, dir, list); break;
		}
	},
	
	moveNoteMenuCursor: function(dir)
	{
		var cur = this.noteMenuCursor
			, list = this.noteMenuList
		;
		this.moveMenuCursorCommon(cur, dir, list);
	},
	
	setMenuCommandPath: function()
	{
		var list = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			;
		if(list == null){
			return this.getLastCommand();
		}
		this.commandPath.push(list[cur.y]);
		return list[cur.y];
	},
	
	backMenu: function()
	{
		var list = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			, p
			;
			/*
		if(this.commandPath.length == 0){
			return []; //??
			// return list[cur.y];
		}*/
		p = this.commandPath.pop();
		return list == null ? p : list[cur.y];
	},
	
	baseKeyOnChannel: function(key)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, param = this.ltSoundChParamKeys[this.paramKeys[cur.y]]
		;
		switch(key){
			case '<': 
				this.deleteEventChange();
				// this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param) - 1);
				// this.drawParamCursor();
				break;
			case '>': 
				this.setEventChange(cur.x, this.makeEventset(param, this.litroSound.getChannel(cur.x, param)));
				// this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param) + 1);
				// this.drawParamCursor();
				break;
			case 'select': 
				this.changeEditMode(this.editMode == 'tune' ? 'note' : 'tune');
				this.commandPath = [];
				
				this.drawParamKeys();
				// this.drawSelectEvents(this.selectNote);
				this.drawChannelParams();
				this.drawParamCursor();
				this.drawMenu();
				break;
			case 'space': 
				this.playKeyOn();
				break;
		}
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	baseKeyOnCatch: function(key)
	{
		var cur = this.noteMenuCursor
			, i
		;
		switch(key){
			case '<': 
				this.editMode = this.selectNote.time < 0 ? 'note' : this.editMode;
				this.initCatchEvent();
				this.initSelect();
				this.drawMenu();
				break;
			case '>': 
				this.changeEditMode('note');
				for(i = 0; i < this.noteMenuList.length; i++){
					if(this.noteMenuList[i] == 'PASTE'){cur.y = i; break;}
				};
				this.drawMenu();
				break;
			case 'select': 
				this.changeEditMode('note');
				this.drawMenu();
				break;
			case 'space': 
				this.playKeyOn();
				break;
		}
		this.drawSelectEvents({time: -1});
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	baseKeyMenuCommon: function(cursor, key)
	{
		var com = ''
			, player = this.player
			;
		switch(key){
			case '<': 
				com = this.backMenu();
				this.selectMenuItem(com, key);
				// this.drawSelectEvents(this.selectNote);
				this.drawMenu();
				break;
			case '>': 
				com = this.setMenuCommandPath();
				this.selectMenuItem(com, key);
				// this.drawSelectEvents(this.selectNote);
				this.drawMenu();
				break;
			case 'select': 
				// this.editMode = this.editMode == 'tune' ? 'note' : 'tune';
				this.changeEditMode(this.editMode == 'tune' ? 'note' : 'tune');
				this.commandPath = [];
				
				this.drawParamKeys();
				this.drawChannelParams();
				this.drawParamCursor();
				// this.drawSelectEvents(this.selectNote);
				this.drawMenu();
				break;
			case 'space': 
				this.playStartLitro();
				com = 'space';
			break;
		}
		return com;
	},
	
	selectMenuItem: function(item, key)
	{
		var cur = this.noteMenuCursor
			, deldat = {}
		;
		switch(item){
			case 'CATCH':
				cur.y = 0;
				if(key == '<'){
					break;
				}
				this.changeEditMode('catch');
				this.initCatchEvent();
				this.initSelect();
				break;
			case 'PASTE': 
				if(key == '<'){
					cur.y = 0;
					break;
				}
				// this.pasteNote(cur.x, this.player.noteSeekTime, this.catchNotes.note);
				this.pasteEventCange(this.paramCursor.x, this.player.noteSeekTime, this.catchEventset);
				this.commandPath = [];
				break;
			case 'REMOVE':
				if(key == '<'){
					cur.y = 0;
					break;
				}
				// this.deleteNote(this.catchNotes.ch, this.catchNotes.note);
				deldat = this.deleteEventChange(this.selectNote.ch, this.catchEventset);
				this.initCatchEvent(deldat);
				// this.initSelect();
				this.commandPath = [];
				break;
			case 'EVENTSET': 
				//未使用
				if(key == '<'){
					cur.y = 0;
					break;
				}
				this.commandPath = [];
				break;
			case 'CHANNEL':
				cur = this.paramCursor;
				if(key == '<'){
					this.channelMove('left');
				}else{
					this.channelMove('right');
				}
				this.commandPath = [];
				break;
			case 'FILE':
				// cur.y = 0;
				if(key == '<'){
					break;
				}
				this.changeEditMode('file');
				break;
			case 'SAVE':
				cur = this.fileMenuCursor;
				cur.y = 0;
				break;
			case 'SERVER':
				this.changeEditMode('loading', false);
				this.loadList(this.fileListPage);
				this.getActiveModeCursor().y = 0;
				break;
			case 'TITLE':
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					break;
				}
				this.clearLeftScreen();
				this.drawCharBoard();
				break;
			case 'OK':
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					break;
				}
				this.commandExecute();
				break;
			case 'NO':
				this.getActiveModeCursor().y = 0;
				if(key == '>'){
					this.backMenu();
					this.backMenu();
				}
				break;
			default: 
				// cur.y = 0;
		}
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	baseKeyOnNote: function(key)
	{
		var cur = this.noteMenuCursor
		;
		com = this.baseKeyMenuCommon(cur, key);

		if(com == 'space'){
		}
		
	},	
	
	baseKeyOnEventset: function(key)
	{
		// var cur = this.eventsetMenuCursor
		var cur = this.paramCursor
		;
		switch(key){
			case '<': 
				this.changeEditMode('note');
				break;
			case '>': 
				this.setEventChange(cur.x, this.makeEventset(this.getParamKeyName(), this.getTuneParam()));
				break;
			case 'select': 
				this.changeEditMode('note');
				break;
			case 'space': 
				this.playKeyOn();
				break;
		}
		// cur.y = 0;
		this.drawMenu();
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	baseKeyOnFile: function(key)
	{
		var fcur = this.fileMenuCursor
			, com
		;
		com = this.baseKeyMenuCommon(fcur, key);
		if(key == '<' && this.fileMenuList.indexOf(com) >= 0){
			this.changeEditMode('note');
			this.drawMenu();
		}else if(com == 'FILELIST'){
			this.commandExecute();
		}else if(key == '>'){
			fcur.y = 0;
		}
	},	

	playKeyOn: function()
	{
		var  player = this.player
			;
			
		if(!player.isPlay()){
			player.seekMoveBack(-1);
			this.updateBackSeek();
			this.editMode = 'play';
			this.drawMenu('play');
			this.drawOscillo();
		}else{
			this.editMode = 'note';
			this.drawMenu();
		}
		player.isPlay() == true ? player.stop() : player.play();
	},
	
	baseKeyOn: function(key)
	{
		if(key == 'space'){
			this.playKeyOn();
			return;
		}
		
		switch(this.editMode){
			case 'tune': this.baseKeyOnChannel(key);break;
			case 'note': this.baseKeyOnNote(key);break;
			case 'play': this.baseKeyOnChannel(key);break;
			case 'catch': this.baseKeyOnCatch(key);break;
			case 'eventset': this.baseKeyOnEventset(key);break;
			case 'file': this.baseKeyOnFile(key);break;
			default: break;
		}
	},
	
	holdKeyCommon: function(key)
	{
		this.baseKeyOn(key);
	},
	
	moveCursor: function(dir)
	{
		switch(this.editMode){
			case 'tune': this.moveChannelParamCursor(dir);break;
			case 'note': this.moveNoteMenuCursor(dir);break;
			case 'play': this.moveChannelParamCursor(dir);break;
			case 'catch': this.moveCatchCursor(dir);break;
			case 'eventset': this.moveEventsetCursor(dir);break;
			case 'file': this.moveFileMenuCursor(key);break;
			// case 2: this.movefileMenuCursor(dir);break;
			// case 3: this.baseKeyOnChannel(dir);break;
		}
	},
	
	zoomKeyOn: function(key)
	{
		var r = this.noteRangeScale
			, c = this.noteRangeCells
			, p = 0
			, max = this.NOTE_RANGE_SCALE_MAX
			, min = this.NOTE_RANGE_SCALE_MIN
			, cep = this.NOTE_RANGE_SCALE_SEPARATE
		;
		
		if(key == '['){
			for(c; c < max; c += c){
				if((c + p) * 16 > r){break;}
				p += c;
			}
			this.noteRangeScale = r + c >= max ? max : r + c;
		}else if(key == ']'){
			for(c; c < max; c += c){
				if((c + p) * 16 >= r){break;}
				p += c;
			}
			this.noteRangeScale = r - c <= min ? min : r - c;
		}
		this.drawZoomScale(this.noteRangeScale);
		this.updateForwardSeek();
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	keycheck: function(){
		var hold, trigs, untrigs, row, chars, name, cont = this.keyControll
		;
		chars = this.ROW_CHARS;
		// console.log(chars);
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
				if(name == '^' || name == '+' ){
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
		
		//カーソル移動
		trigs = cont.getTrig(this.corsolKeys);
		hold = cont.getHold(this.corsolKeys);
		for(key in trigs){
			if(trigs[key] || hold[key]){
				this.moveCursor(key);
			}
		}
		
		//操作キー
		trigs = cont.getTrig(this.baseKeys);
		hold = cont.getHold(this.baseKeys);
		for(key in trigs){
			if(trigs[key] || hold[key]){
				this.holdKeyCommon(key);
			}
		}
		
		//ズームキー
		trigs = cont.getTrig(this.zoomKeys);
		hold = cont.getHold(this.zoomKeys);
		for(key in trigs){
			if(trigs[key] || hold[key]){
				this.zoomKeyOn(key);
			}
		}
	},
	
	openFrame: function()
	{
		var i, j
			, noteRollLeft = [1, 0, 2, 1]
			, noteRollRight = [3, 0, 2, 1]
			, eventRollLeft = [11, 0, 2, 1]
			, eventRollRight = [11, 0, 2, 1]
			, leftFrame = [0, 1, 1, 8]
			, rightFrame = [7, 1, 2, 8]
			, topFrameLeft = [1, 1, 2, 2]
			, topFrameCenter_1 = [3, 1, 1, 2]
			, topFrameCenter_2 = [4, 1, 1, 2]
			, topFrameRight = [5, 1, 2, 2]
			, boardFrameLeft_1 = [1, 5, 1, 4]
			, boardFrameCenter_1 = [2, 5, 1, 4]
			, boardFrameRight_1 = [3, 5, 1, 4]
			, boardFrameLeft_2 = [4, 5, 1,4]
			, boardFrameCenter_2 = [5, 5, 1, 4]
			, boardFrameRight_2 = [6, 5, 1, 4]
		;
		
		scrollByName('bg1').clear(null, makeRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT / 2));

		//上半分
		this.drawFrameLine(noteRollLeft, 0, 1, 1, 6);
		
		this.drawFrameLine(noteRollLeft, 18, 1, 1, 6);
		
		this.drawFrameLine(eventRollLeft, 0, 0, 1, 1);
		// this.drawFrameLine(eventFaceLine, 2, 0, 16, 1);
		this.drawFrameLine(eventRollRight, 18, 0, 1, 1);
		
		//下半分
		this.drawFrameLine(leftFrame, 0, 7, 1, 1);
		this.drawFrameLine(rightFrame, 18, 7, 1, 1);
		this.drawFrameLine(topFrameLeft, 1, 7, 1, 1);
		this.drawFrameLine(topFrameRight, 16, 7, 1, 1);
		
		this.drawFrameLine(topFrameCenter_2, 3, 7, 2, 1);
		this.drawFrameLine(topFrameCenter_1, 5, 7, 6, 1);
		this.drawFrameLine(topFrameCenter_2, 11, 7, 2, 1);
		this.drawFrameLine(topFrameCenter_1, 13, 7, 1, 1);
		this.drawFrameLine(topFrameCenter_2, 14, 7, 1, 1);
		this.drawFrameLine(topFrameCenter_1, 15, 7, 1, 1);
		
		//鍵盤
		this.drawFrameLine(boardFrameLeft_1, 1, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 2, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_2, 3, 11, 1, 1);
		
		this.drawFrameLine(boardFrameLeft_2, 4, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 5, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 6, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_1, 7, 11, 1, 1);
		
		this.drawFrameLine(boardFrameLeft_1, 8, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 9, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_1, 10, 11, 1, 1);
		
		this.drawFrameLine(boardFrameLeft_2, 11, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_2, 12, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 13, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_2, 14, 11, 1, 1);
		
		this.drawFrameLine(boardFrameLeft_1, 15, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 16, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_1, 17, 11, 1, 1);
		
		//初期メニュー表示
		this.drawMenu();

		// オクターブ
		this.drawOctaveMeter(this.octaveLevel);
		
		this.drawChannelTab_on();
		
		this.drawParamKeys();
		
		this.drawChannelParams();
		
		this.drawParamCursor();
		
		this.drawZoomScale(this.noteRangeScale);
		
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
		// scrollByName('bg1').spriteLine({x:50, y:20},{x:50, y:0}, this.waveSprite);
	},
	
	drawSeek: function()
	{
		var sprite = makeSprite(this.uiImageName, this.seekSprite)
			, arrow = makeSprite(this.uiImageName, this.arrowSprite)
			, scr = scrollByName('sprite')
			, mc = this.seekCmargin
			, i, mode
			, from, to
			, min_y, max_y
			, centerPos = (cellhto(this.noteRangeCells) * this.noteRange / 2)
			// , x = (this.player.noteSeekTime) * this.noteRange * (cellhto(this.noteRangeCells) / this.noteRangeScale)
			, x = this.seekPosition()
			, px = Math.sin(this.seekLineCount / 20) * 4
			, arrowDisps = {'note': 0, 'catch': 0, 'eventset': 0}
		;
		// printDebug(cellhto(mc.x) + x, 1);
		
		// console.log(centerTime, x);
		x = x < centerPos? x : centerPos;
		scr.drawSprite(sprite, cellhto(mc.x) + x, mc.y);
		if(this.getMode() in arrowDisps){
			scr.drawSprite(arrow, cellhto(mc.x + 2) + x + px, mc.y);
			arrow.hflip(true);
			scr.drawSprite(arrow, cellhto(mc.x - 2) + x - px, mc.y);
			arrow.hflip(false);
		}
		
		from = {x: cellhto(mc.x + 2) + x - 1, y: mc.y + this.seekLineCount + cellhto(2)};
		to = {x: from.x, y: mc.y + this.seekLineCount + cellhto(3)};
		
		min_y = cellhto(2);
		max_y = (cellhto(this.octaveRangeCells + 2) / 2) + min_y;
		for(i = -5; i < 0; i++){
			from.y = this.seekLineCount + cellhto(i * 2);
			to.y = this.seekLineCount + cellhto(1 + (i * 2));
			from.y = from.y < min_y ? min_y : from.y;
			to.y = to.y < min_y ? min_y : to.y;
			from.y = from.y > max_y ? max_y : from.y;
			to.y = to.y > max_y ? max_y : to.y;
			if(from.y == to.y){continue;}
			
			scr.spriteLine(from, to, this.waveSprite);
		}
		
		this.seekLineCount = (this.seekLineCount + 4) % DISPLAY_HEIGHT;
	},
	
	drawScoreBoard: function(bottom)
	{
		var scr = scrollByName('bg2')
			, i, xc, yc, s
			, xCells = (DISPLAY_WIDTH / cellhto(1)) | 0
			, noteStart = makeSprite(this.uiImageName, 5)
			, notePeriod = makeSprite(this.uiImageName, 6)
			, noteLine = makeSprite(this.uiImageName, 7)
			, noteSpaceStart = makeSprite(this.uiImageName, 8)
			, noteSpacePeriod = makeSprite(this.uiImageName, 9)
			, noteSpace = makeSprite(this.uiImageName, 10)
			, eventSpaceStart = makeSprite(this.uiImageName, 13)
			, eventSpacePeriod = makeSprite(this.uiImageName, 14)
			, eventSpace = makeSprite(this.uiImageName, 15)
			, line5 = [2, 4, 7, 9, 10]
			, spaces = [5, 12]
			, btmOffset
			;
			
		bottom == bottom == null ? false : bottom;
		btmOffset = bottom ? (DISPLAY_HEIGHT / 2) | 0 : 0;
		
		for(yc = 0; yc < line5.length; yc++){
			for(xc = 0; xc < xCells; xc += 2){
				s = xc % 5 == 0 ? notePeriod : noteLine;
				if(xc == 0){s = noteStart;}
				scr.drawSprite(s, cellhto(xc), cellhto(line5[yc]) + btmOffset);
			}
		}
		for(yc = 0; yc < spaces.length; yc++){
			for(xc = 0; xc < xCells; xc += 2){
				s = xc % 5 == 0 ? noteSpacePeriod : noteSpace;
				if(xc == 0){s = noteSpaceStart;}
				scr.drawSprite(s, cellhto(xc), cellhto(spaces[yc]) + btmOffset);
			}
		}
		for(xc = 0; xc < xCells; xc += 2){
			s = xc % 5 == 0 ? eventSpacePeriod : eventSpace;
			if(xc == 0){s = eventSpaceStart;}
			scr.drawSprite(s, cellhto(xc), btmOffset);
		}
		
	},
	
	drawCharBoard: function()
	{
		var scr = scrollByName('bg1')
			, word = this.word, x, y, i = 0
			, cm = this.paramskeysCmargin
			, dispNum = {x: 20, y: 3}
			, ofstr = this.charBoardCurrent.y * dispNum.x
			, spr, ofs, tspr
			, maxCurrent = 200
		;
		word.setScroll(scr);
		word.setMarkAlign('vertical');
		function setsprite(code){
			sprite = makeSprite(word.imageName, code);
			sprite.swapColor(COLOR_NOTEFACE, COLOR_FONT8);
			sprite.swapColor(COLOR_BLACK, COLOR_TRANSPARENT);
			return sprite;
		}
		for(y = 0; y < 3; y++){
			ofs = 0;
			for(x = 0; x < 20; x++){
				// ofs = ((x > 4) | 0) + ((x > 9) | 0);
				if(i in word.soundmarks){
					tspr = setsprite(i + ofstr);
					spr = setsprite(word.soundmarks[i]);
				}else{
					tspr = setsprite(word.SPACE_CODE);
					spr = setsprite(i + ofstr);
				}
				scr.drawSprite(tspr, cellhto(x + cm.x + ofs), cellhto((y * 2) + cm.y));
				scr.drawSprite(spr, cellhto(x + cm.x + ofs), cellhto((y * 2) + cm.y + 1));
				i++;
			}
		}
		word.setMarkAlign('horizon');
		
	},
	
	drawNoteTest: function()
	{
		var i;
		for(i = 0; i < this.octaveRangeCells; i++){
			this.drawNoteRaster(0, 2, i, 0, false, false);
		}
	},

	//bg2の上下分割描画
	drawNoteRasterCell: function(ch, cx, cy, rot, bottom, catchMode, divofs)
	{
		var noteCm = this.noteCmargin
			, sprite
			, x, y
		;
		divofs = divofs == null ? 0 : divofs;
		// if(cx < -1 || cy < 0){return;}
		if(cx < -1){return;}
		if(cx >= this.noteRangeCells + 1 || cy >= this.octaveRangeCells){return;}
		x = cellhto(noteCm.x + cx);
		if(cy >= 0){
			x -= rot == 3 ? cellhto(1) / 2 : 0;
			y = cellhto(noteCm.y - (cy / 2));
			y += rot == 3 ? cellhto(1) / 2 : 0;
			sprite = makeSprite(this.uiImageName, this.noteSprite + ch);
		}else{
			y = 0;
			sprite = makeSprite(this.uiImageName, this.eventsetSprite + ch);
		}
		sprite.rot(rot);
		if(!catchMode){
			y += bottom ? DISPLAY_HEIGHT / 2 : 0;
			scrollByName('bg2').drawSprite(sprite, x, y);
		}else{
			x += cellhto(this.noteScrollCmargin.x) - divofs;
			scrollByName('sprite').drawSprite(sprite, x, y);
		}
	},
	
	//bg2の上下分割描画
	drawNoteRaster: function(ch, x, y, rot, bottom, catchMode, divofs)
	{
		var noteCm = this.noteCmargin
			, sprite
		;
		divofs = divofs == null ? 0 : divofs;
		// if(cx < -1 || cy < 0){return;}
		if(x < cellhto(-2)){return;}
		if(x >= cellhto(this.noteRangeCells + 1) || y >= cellhto(this.octaveRangeCells)){return;}
		x = cellhto(noteCm.x) + x;
		if(y >= 0){
			x -= rot == 3 ? cellhto(1) / 2 : 0;
			y = cellhto(noteCm.y) - (y / 2);
			y += rot == 3 ? cellhto(1) / 2 : 0;
			sprite = makeSprite(this.uiImageName, this.noteSprite + ch);
		}else{
			y = 0;
			sprite = makeSprite(this.uiImageName, this.eventsetSprite + ch);
		}
		sprite.rot(rot);
		if(!catchMode){
			y += bottom ? DISPLAY_HEIGHT / 2 : 0;
			scrollByName('bg2').drawSprite(sprite, x, y);
		}else{
			x += cellhto(this.noteScrollCmargin.x) - divofs;
			scrollByName('sprite').drawSprite(sprite, x, y);
		}
	},	
	drawRefleshNote: function()
	{
		this.drawNotesCount = 0;
	},
	
	drawNoteScroll: function(page, catchMode)
	{
		if(this.litroSound.channel == null){
			return;
		}
		page = page == null ? this.noteScrollPage | 0 : page;
		var bottom = (page % 2 == 0) ? false : true
		;
		if(!catchMode){
			this.drawScoreBoard(bottom);
		}else{
			this.blinkDrawEventset = [];
		}

		this.drawDataScroll(page, catchMode, this.player.eventsetData);
	},
	
	drawDataScroll: function(page, catchMode)
	{
		var eventset, type, data, t, x, y, note, noref, drawCnt = 0, noteCnt = 0
			, tuneWrited = {}
			, bottom = (page % 2 == 0) ? false : true
			, scrollTop = !bottom ? 0 : (DISPLAY_HEIGHT / 2)
			, testcolor = !bottom ? COLOR_ADD : COLOR_PARAMKEY
			, cellTime = this.noteRangeScale / this.noteRangeCells
			, divofsTime = 0
			, catchData = this.catchEventset
			, channelsData = this.player.eventsetData
			, drawnNotes = {}
		;
		cellTime = cellTime < 1 ? 1 : cellTime;

		keyStart = this.octaveLevel * this.octaveInKeys;
		keyEnd = keyStart + (this.octaveInKeys * this.octaveRange);
		catchMode = catchMode == null ? false : catchMode;
		if(!catchMode){
			timeStart = this.noteRangeScale * page;
			timeEnd = timeStart + this.noteRangeScale;
		}else{
			if(this.selectNote.ch < 0){
				return;
			}
			timeStart = this.seekTime(this.noteScrollPos.x);
			divofsTime = timeStart % (cellTime | 0); //スクロール考慮時間
			timeStart -= divofsTime;
			divofsTime = divofsTime * (DISPLAY_WIDTH / this.noteRangeScale) | 0;//スクロール考慮ピクセル変換
			timeEnd = timeStart + this.noteRangeScale;
		}
		
		for(ch = 0; ch < channelsData.length; ch++){
			tuneWrited = {};
			for(type in channelsData[ch]){
				if(!catchMode){
					//プレイヤー
					data = channelsData[ch][type];
				}else{
					if(ch != (this.selectNote.ch | 0)){
						continue;
					}
					//キャッチ
					data = catchData[type];
				}
				for(t in data){
					// if(noteCnt != this.drawNotesCount){break;}
					if(t in tuneWrited && type in AudioChannel.tuneParamsMax){
						//未使用分岐
						continue;
					}
					if(!catchMode && this.isCatch(t, ch, type)){
						continue;//キャッチ点滅用非表示
					}
					drawCnt = (drawCnt + 1) % 8;

					eventset = data[t];
					noref = !(t in channelsData[ch][type]);
					if(type == 'note'){
					
						if(eventset.value > keyEnd || eventset.value < keyStart){
							continue;
						}
						chr = this.CHARS_INDEX[eventset.value % this.octaveInKeys];
						x = ((eventset.time - timeStart) * DISPLAY_WIDTH / this.noteRangeScale) | 0;
						if(x in drawnNotes){continue;}
						y = cellhto(this.noteCurrentHeight(eventset.value));
						rot = this.isBlackKey(chr) ? 3 : 0;
						if(catchMode){
							this.blinkDrawEventset.push({ch: ch, x: x, y: y, rot: 0, bottom: bottom, catchMode: catchMode, time: divofsTime, noref: noref});
						}else{
							this.drawNoteRaster(ch, x, y, rot, bottom, catchMode, divofsTime);
						}
					}else{
						tuneWrited[t] = true;
						x = ((eventset.time - timeStart) * DISPLAY_WIDTH / this.noteRangeScale) | 0;
						if(x in drawnNotes){continue;}
						y = cellhto(-1);
						if(catchMode){
							this.blinkDrawEventset.push({ch: ch, x: x, y: y, rot: 0, bottom: bottom, catchMode: catchMode, time: divofsTime, noref: noref});
						}else{
							this.drawNoteRaster(ch, x, y, 0, bottom, catchMode, divofsTime);
						}
					}
					drawnNotes[x] = t;
					noteCnt++;
				}
				drawnNotes = {};
			}
		}
		
	},
	
	//共通メニュー表示
	drawMenuList: function(list)
	{
		var cm = this.menuDispCmargin
			, indent = this.menuCindent
			, word = this.word
			, i
		;
		if(list == null){
			list = ['？？？'];
		}
		
		// console.log(list);
		word.setScroll(scrollByName("bg1"));
		for(i = 0; i < list.length; i++){
			word.print(list[i].substr(0, 10), cellhto(cm.x + indent), cellhto(cm.y + i), COLOR_PARAMKEY, COLOR_BLACK);
		}		
	},
	
	drawCatchType: function(type)
	{
		var menu = this.catchMenuList
			, indent = this.menuCindent
			, cm = this.menuDispCmargin
			, cur = this.paramCursor
			;
		type = type == null ? this.catchType : type;
		this.word.setScroll(scrollByName('bg1'));
		this.word.print('CATCH', cellhto(cm.x + indent), cellhto(cm.y + 2), COLOR_PARAMKEY, COLOR_BLACK);
		this.word.print('　TYPE：', cellhto(cm.x + indent), cellhto(cm.y + 3), COLOR_PARAMKEY, COLOR_BLACK);
		this.word.print(type, cellhto(cm.x + indent), cellhto(cm.y + 4), COLOR_ARRAY[cur.x], COLOR_BLACK);
		
	},
	
	//compare: object
	intersectParamKeys: function(compare)
	{
		var i, key, keys = [];
		i = 0;
		for(key  in this.ltSoundChParamKeys){
			if(this.ltSoundChParamKeys[key] in compare){
				keys.push(this.paramKeys[i] == null ? this.paramSubKeys[i - this.paramKeys.length] : this.paramKeys[i]);
			}else{
				keys.push('');
			}
			i++;
		}
		return keys;
	},
	
	//選択パネル表示
	drawSelectEvents: function(events)
	{
		var side = this.seekDispSide(this.seekPosition() + cellhto(4))
			, size = {w: 16, h: 10}
			, left = {x: 4, y: 2}, right = {x: size.w + 4, y: 2}
			, cm = side == 'left' ? right : left
			, scroll = scrollByName('bg1')
			, eventset = this.player.getEventsFromTime(events.ch, events.time)
			, key, keys = [], i
		;
		this.blinkDrawParams = [];
		if(events.time < 0){
			scroll.clear(null, makeRect(cellhto(left.x), cellhto(left.y), cellhto(size.w * 2), cellhto(size.h)));
			return;
		}
		
		keys = this.intersectParamKeys(eventset)
		
		scroll.clear(side == 'left' ? null : COLOR_BLACK, makeRect(cellhto(left.x), cellhto(left.y), cellhto(size.w), cellhto(size.h)));
		scroll.clear(side == 'left' ? COLOR_BLACK : null, makeRect(cellhto(right.x), cellhto(right.y), cellhto(size.w), cellhto(size.h)));
		this.drawParamKeys(0, 8, cm.x + 1, cm.y + 1, keys);
		this.drawChannelParams(0, 8, cm.x + 5 + 1, cm.y + 1, eventset, events.ch);
		this.drawParamKeys(8, 8, cm.x + 8 + 1, cm.y + 1, keys);
		this.drawChannelParams(8, 8, cm.x + 13 + 1, cm.y + 1, eventset, events.ch);
	},
	
	drawCatchMenu: function()
	{
		var menu = this.catchMenuList
			;
		this.drawMenuList(menu);
		this.drawCatchType(this.catchType);
		this.drawSelectEvents(this.selectNote);
	},
	
	drawNoteMenu: function()
	{
		var menu = this.noteMenuList;
		this.drawMenuList(menu);
	},	
	
	drawEventsetMenu: function()
	{
		var menu = this.eventsetMenuList;
		this.drawMenuList(menu);
	},
	
	drawFileMenu: function()
	{
		var menu = this.getFileMenuList()
		;
		if(menu == null){
			menu = ['？？？'];
		}
		this.drawMenuList(menu);
	},
	
	drawNoteCursor: function()
	{
		this.drawMenuListCursor(this.noteMenuList, this.noteMenuCursor.y);
	},
	
	//共通メニューカーソル表示
	drawMenuListCursor: function(list, y)
	{
		var keyCm = this.menuDispCmargin
			, indent = this.menuCindent
			, word = this.word
			, key = list[y]
			;
		
		if(list == null){
			list = ['？？？'];
		}
		word.setScroll(scrollByName('bg1'));
		word.print(list[y], cellhto(indent + keyCm.x), cellhto(keyCm.y + y), COLOR_BLACK, COLOR_PARAMKEY);
		
	},
	
	drawFileCursor: function()
	{
		var menu = this.getFileMenuList()
			, com = this.getLastCommand();
			;
		switch(com){
			// case: ''
		}
		if(menu == null){
			menu = ['？？？'];
		}
		this.drawMenuListCursor(menu, this.fileMenuCursor.y);
	},
	
	drawFileListCursor: function()
	{
		var cur = this.fileListCursor, offset = this.fileListOffset
			, word = this.word, cm = this.channelParamsCmargin
			, title
			;
			word.setScroll(scrollByName('bg1'));
			title = this.serverFileList[cur.y].title.substr(0, 16);
			word.print(title == '' ? '　' : title, cellhto(cm.x), cellhto(cm.y + cur.y - offset), COLOR_BLACK, COLOR_NOTEFACE);
	},
	
	// drawParamCursorBlink: function(toggle, scrollName)
	drawParamCursorBlink: function()
	{
		this.paramCursorBlinkFlag = !this.paramCursorBlinkFlag;
		if(this.paramCursorBlinkFlag){return;}
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, paramCm = this.channelParamsCmargin
		;
		this.word.setScroll(scrollByName('sprite'));
		this.word.print('  ', cellhto(paramCm.x + (cur.x * 2)), cellhto(paramCm.y + curr.y), COLOR_ARRAY[cur.x], COLOR_ARRAY[cur.x]);
	},
	
	drawParamCursor: function(cur)
	{
		var keyCm = this.paramskeysCmargin
			, paramCm = this.channelParamsCmargin
			, curr = this.paramCursorCurrent
			, key = ""
			, color
			, bgcolor
			;
			
		cur = cur == null ? this.paramCursor : cur;
		key = this.paramKeys[cur.y];
		// this.litroSound.getChannel(cur.x, this.ltSoundChParamKeys[key]) | 0;
		
		this.word.setScroll(scrollByName('bg1'));
		color = COLOR_BLACK;
		bgcolor = COLOR_PARAMKEY;
		this.word.print(key.substr(0, this.paramKeysStrLen), cellhto(keyCm.x), cellhto(keyCm.y + curr.y), color, bgcolor);
		
		// this.drawParamCursorBlink(true, 'bg1');
		color = COLOR_BLACK;
		bgcolor = COLOR_ARRAY[cur.x];
		param = this.litroSound.channel[cur.x].tune(this.ltSoundChParamKeys[key]);
		this.word.print(formatNum(param.toString(16), 2), cellhto(paramCm.x + (cur.x * 2)), cellhto(paramCm.y + curr.y), color, bgcolor);
			
	},
	
	drawFileList: function()
	{
		var list = this.serverFileList
			, len = list.length, offset = this.fileListOffset
			, i, indexes = [], titles = []
			, key = '', title = ''
			, keylen = 4, titlelen = 16, mc = this.channelParamsCmargin
		;
		for(i = 0; i < this.paramLimit; i++){
			if(i < len){
				key = (i + offset + 1) + '';
				title = list[i].title;
			}else{
				key = '　　　　　';
				title = '';
			}
			indexes.push('0000'.substr(0, keylen - key.length) + key + ':');
			titles.push(title + '                    '.substr(0, titlelen - title.length));
		}
		
		this.drawParamKeys(offset, null, null, null, indexes);
		this.drawParamKeys(offset, null, mc.x, mc.y, titles, titlelen);
	},
			
	drawParamKeys: function(offset, limit, xc, yc, params, sublen)
	{
		offset = offset == null ? this.paramOffset : offset;
		limit = limit == null ? this.paramLimit : limit;
		var i, index
			, keys = []
			, word = this.word
			, mc = (xc == null || yc == null) ? this.paramskeysCmargin : {x: xc, y: yc}
			, tuneKeyLavel = {} //tuneKeyLavel= key:lavel
			, col = COLOR_NOTEFACE
			// , tuneLavelKey = this.ltSoundChParamKeys
			;
			//params= key:eventset
		if(sublen == null){
			sublen = 5
			col = COLOR_PARAMKEY;
		}
		for(i in  this.ltSoundChParamKeys){
			tuneKeyLavel[this.ltSoundChParamKeys[i]] = i;
		}
			
		if(params == null){
			keys = this.intersectParamKeys(tuneKeyLavel);
		}else{
			for(i in params){
				keys.push(params[i]);
			}
		}
		//draw> tune:value
		word.setScroll(scrollByName('bg1'));
		for(i = 0; i < limit; i++){
			index = i + offset;
			if(keys.length < index){break;}
			word.print(str_pad(keys[index], sublen, "　", "STR_PAD_RIGHT") , cellhto(mc.x), cellhto(mc.y + i), col, COLOR_BLACK);
		}
	},

	drawChannelParams: function(offset, limit, xc, yc, params, fixch)
	{
		offset = offset == null ? this.paramOffset : offset;
		limit = limit == null ? this.paramLimit : limit;
		var i, index, key, color, num, sprite, noref
			, keys = []
			, word = this.word
			, mc = (xc == null || yc == null) ? this.channelParamsCmargin: {x: xc, y: yc}
			, chLength = 0
			, numLength = 2
			, tuneKeyLavel = {}
			, tuneLavelKey = this.ltSoundChParamKeys
			;
		for(i in  this.ltSoundChParamKeys){
			tuneKeyLavel[this.ltSoundChParamKeys[i]] = i;
		}
			
		if(params == null){
			params = {};
			chLength = this.litroSound.channel.length;
			for(i in tuneLavelKey){
				params[tuneLavelKey[i]] = {};
				for(j = 0; j < chLength; j++){
					num = this.litroSound.getChannel(j, tuneLavelKey[i]);
					if(num == null){continue;}
					params[tuneLavelKey[i]][j] = this.litroSound.getChannel(j, tuneLavelKey[i]).toString(16);
				}
			}
			keys = this.intersectParamKeys(tuneKeyLavel);
		}else{
			//1ch分のみ
			for(i in tuneLavelKey){
				keys.push(i);
			}
			chLength = 1;
		}
					
		word.setScroll(scrollByName('bg1'));
		for(j = 0; j < chLength; j++){
			for(i = 0; i < limit; i++){
				index = i + offset;
				if(keys.length < index){break;}
				if(tuneLavelKey[keys[index]] in params){
					key = this.ltSoundChParamKeys[keys[index]];
					if(fixch == null){
						color = COLOR_ARRAY[j];
						num = params[key][j];
					}else{
						color = COLOR_ARRAY[fixch];
						num = (params[key].value | 0).toString(16);
						if(this.isCatch(params[key].time, fixch, params[key].type)){
							sprite = word.getSpriteArray(formatNum(num, 2), color, COLOR_BLACK);
							noref = !(params[key].time in this.player.eventsetData[fixch][params[key].type]);
							this.blinkDrawParams.push({sprite: sprite, x: cellhto(mc.x + (j * numLength)), y: cellhto(mc.y + i), noref: noref});
							continue;
						}
					}
					word.print(formatNum(num, 2), cellhto(mc.x + (j * numLength)), cellhto(mc.y + i), color, COLOR_BLACK);
				}
			}
		}

	},
	drawScrollTime: function(time)
	{
		var cm = {x: 0, y: 9}
			, c1 = COLOR_NOTEPRINT
			, c2 = COLOR_NOTEFACE
		;
		time = time == null ? this.player.noteSeekTime : time;
		time = (time / 1000) | 0;
		if(time == this.scrollTime){
			return;
		}
		this.scrollTime = time;
		this.word.setScroll(scrollByName('bg1'));
		this.word.print(str_pad(time, 4, '0', 'STR_PAD_LEFT'), cellhto(cm.x), cellhto(cm.y + 2), c1, c2);
		if(time == 0){
			this.word.print('TIME', cellhto(cm.x), cellhto(cm.y), c1, c2);
			this.word.print(' sec', cellhto(cm.x), cellhto(cm.y + 3), c1, c2);
		}
	},
	
	drawZoomScale: function(scale)
	{
		var cm = {x: 0, y: 3}
			, stepTime
			, c1 = COLOR_NOTEPRINT
			, c2 = COLOR_NOTEFACE
		;
		stepTime = (scale / this.noteRangeCells) | 0;
		this.word.setScroll(scrollByName('bg1'));
		this.word.print('STEP', cellhto(cm.x), cellhto(cm.y), c1, c2);
		this.word.print(str_pad(stepTime, 4, '0', 'STR_PAD_LEFT'), cellhto(cm.x), cellhto(cm.y + 2), c1, c2);
		this.word.print('msec', cellhto(cm.x), cellhto(cm.y + 3), c1, c2);
		
	},
	
	drawOctaveMeter: function(level)
	{
		var i
			, cm = {x: 37.5, y: 12.25}
			, cDistance = 3.5
			, scr = scrollByName('bg1')
			, noteRollRight = [3, 0, 2, 1]
		;
		// this.drawFrameLine(noteRollRight, 18, 0.75, 1, 1);
		this.drawFrameLine(noteRollRight, 18, 2.5, 1, 1);
		this.drawFrameLine(noteRollRight, 18, 4.25, 1, 1);
		this.drawFrameLine(noteRollRight, 18, 6, 1, 1);
		
		this.word.setScroll(scr);
		// this.word.swapColor(COLOR_FONT8, COLOR_NOTEPRINT);
		for(i = 0; i < 3; i++){
			this.word.print((level + i), cellhto(cm.x), cellhto(cm.y - (i * cDistance)), COLOR_NOTEPRINT, COLOR_NOTEFACE);
			// this.word.print('tes', 0, 0, COLOR_NOTEPRINT);
		}
		this.word.print('Oct', cellhto(cm.x - 1), cellhto(cm.y - (i * cDistance) + 1), COLOR_NOTEPRINT, COLOR_NOTEFACE);
	},
	
	drawOctaveButton: function()
	{
		var scr = scrollByName('sprite')
			, sprite_u = makeSpriteChunk(this.uiImageName, makeRect([9, 3, 2, 1]))
			, sprite_d = makeSpriteChunk(this.uiImageName, makeRect([9, 4, 2, 1]))
			, cm_u = {x: 36, y: 24}
			, cm_d = {x: 36, y: 26}
			, cnt = this.keyControll
		;
		
		if(cnt.getState('^')){
			scr.drawSpriteChunk(sprite_u, cellhto(cm_u.x), cellhto(cm_u.y));
		}
		if(cnt.getState('-')){
			scr.drawSpriteChunk(sprite_d, cellhto(cm_d.x), cellhto(cm_d.y));
		}
	},
	
	drawChannelTab_on: function(ch)
	{
		var i
			, scr = scrollByName('bg1')
			, tabsprite = makeSpriteChunk(this.uiImageName, makeRect([0, 9, 1, 1]))
			, draws = makeSpriteChunk(this.uiImageName, makeRect([0, 9, 1, 1]))
			, cm = {x: 8, y: 14}
		;
		if(ch == null){
			ch = [0, 1, 2, 3, 4, 5, 6, 7];
		}
		if(ch.length == null){
			ch = [ch];
		}
		for(i = 0; i < ch.length; i++){
			//xだけ変更してchannelスプライト変更
			draws[0][0].x = tabsprite[0][0].x + (ch[i] * cellhto(2)); //よくない
			scr.drawSpriteChunk(draws, cellhto(cm.x + (ch[i] * 2)), cellhto(cm.y));
		}
		
	},
	
	drawFrameLine: function(frameline, cx, cy, rep_x, rep_y, size)
	{
		var x, y, sHeight, sWidth
			, scr = scrollByName('bg1')
			, sprite = makeSpriteChunk(this.uiImageName, makeRect(frameline))
		;
		size = size == null ? CHIPCELL_SIZE : size;
		rep_y = (rep_y == null ? 1 : rep_y);
		rep_x = (rep_x == null ? 1 : rep_x);
		for(y = 0; y < rep_y; y++){
			sHeight = sprite.length;
			for(x = 0; x < rep_x; x++){
				sWidth = sprite[0].length;
				scr.drawSpriteChunk(sprite, ((x * sWidth) + cx) * size, ((y * sHeight) + cy) * size);
			}
		}
	},
	
	drawMenuCommon: function(mode)
	{
		var modeName = mode == null ? this.editMode : mode
			, sprite
			, cm = this.modeCmargin
			;
		if(modeName == null){
			return;
		}
		sprite = makeSpriteChunk(this.uiImageName, makeRect(this.modeRect[modeName]));
		scrollByName('bg1').drawSpriteChunk(sprite, cellhto(cm.x), cellhto(cm.y));
	},
	
	clearMenu: function()
	{
		var scr = scrollByName('bg1')
			, cm = this.menuDispCmargin
			, size = this.menuCsize
		;
		scr.clear(COLOR_BLACK, makeRect(cellhto(cm.x), cellhto(cm.y), cellhto(size.w), cellhto(size.h)));
	},
	
	clearLeftScreen: function()
	{
		var scr = scrollByName('bg1')
			, cm = this.leftScreenCmargin
			, size = this.leftScreenSize
		;
		scr.clear(COLOR_BLACK, makeRect(cellhto(cm.x), cellhto(cm.y), cellhto(size.w), cellhto(size.h)));
	},
	
	blinkDraw: function()
	{
		var scrpos, i, sparam, scr = scrollByName('sprite');
		this.catchNoteBlinkCycle++;
		for(i = 0; i < this.blinkDrawParams.length; i++){
			sparam = this.blinkDrawParams[i];
			if(this.catchNoteBlinkCycle % 8 == i % 8){continue;}
			if(sparam.noref && this.catchNoteBlinkCycle % 2 == i % 2){continue;}
			scr.drawSpriteChunk(sparam.sprite, sparam.x, sparam.y);
		}
		scrpos = (this.noteScrollPos.x % DISPLAY_WIDTH);
		scrpos = 0;
		for(i = 0; i < this.blinkDrawEventset.length; i++){
			sparam = this.blinkDrawEventset[i];
			if(this.catchNoteBlinkCycle % 8 == i % 8){continue;}
			if(sparam.noref && this.catchNoteBlinkCycle % 2 == i % 2){continue;}
			this.drawNoteRaster(sparam.ch, sparam.x - scrpos, sparam.y, sparam.rot, sparam.bottom, sparam.catchMode, sparam.time);
		}
	},
	
	repeatDrawMenu : function()
	{
		//channel note file play
		switch(this.editMode){
			case 'tune': this.player.isPlay() ? this.drawOutputWave() : this.drawChannelWave(); this.drawParamCursorBlink(); break;
			case 'note': ; break;
			case 'play': this.drawOutputWave(); break;
			case 'catch': ; break;
			
		}
		this.drawSeek();
		this.drawScrollTime();
		this.blinkDraw();
		// this.drawNoteScroll(null, true);
		this.drawNotesCount++;
	},
	drawMenu: function(mode)
	{
		mode = mode == null ? null : mode;
		this.clearMenu();
		//channel note file play
		this.drawMenuCommon(mode);
		switch(this.editMode){
			case 'tune': this.drawOscillo(); break;
			case 'note': this.drawNoteMenu(); this.drawNoteCursor(); break; //this.drawNoteScroll(); 
			case 'play': this.drawOscillo(); break;
			case 'catch': this.drawCatchMenu(); this.drawMenuListCursor(this.catchMenuList, this.noteMenuCursor.y); break;
			case 'eventset': this.drawEventsetMenu(); this.drawMenuListCursor(this.eventsetMenuList, this.eventsetMenuCursor.y); break;
			case 'file': this.drawFileMenu(); this.drawMenuListCursor(this.getActiveModeMenuList(), this.getActiveModeCursor().y); break;
			case 'error': break;
			
		}
	},

	
	drawOscillo: function()
	{
		var ocsLineV = [5, 4, 1, 1]
			, ocsLineH = [6, 4, 1, 1]
		;

		// オシロ
		this.drawFrameLine(ocsLineV, 12, 8.5, 1, 3);
		this.drawFrameLine(ocsLineH, 13, 10, 4, 1);
	},
	
	drawOutputWave: function()
	{
		var chOscWidth = 64
			, chOscHeight = cellhto(6) - 2
			, chOscHeight_h = (chOscHeight / 2) | 0
			, data
			, size = (PROCESS_BUFFER_SIZE / this.analyseRate) | 0
			, cm = this.ocsWaveCmargin
			, px, py, i, dindex, ofsx, ofsy = 128, pre_y
			, from, to
			, spr = scrollByName('sprite')
			, sprite = this.waveSprite
			;

		pre_y = null;
		// data = ltkb.litroSound.getAnalyseData(chOscWidth / this.analyseRate);
		// this.analysedData_b.set(data, this.analyseCount * (chOscWidth / this.analyseRate));
		// this.analysedData_b.set(data, this.analyseCount * PROCESS_BUFFER_SIZE);
		this.analyseCount = (this.analyseCount + 1) % this.analyseRate;
			// // console.dir(data);
		if(this.analyseCount == 0){
			// this.analysedData = this.analysedData_b;
			// this.analysedData_b = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
			data = this.litroSound.getAnalyseData(size);
			this.analysedData = data;
		}
		data = this.analysedData;
		for(i = 0; i < chOscWidth; i++){
			dindex = (i * (size / (chOscWidth ) ) | 0);
			px = i + cellhto(cm.x);
			py = data[dindex] != null ? data[dindex] : ofsy;
			py = ((py * (chOscHeight_h / ofsy))  + cellhto(cm.y)) | 0;
			from = {x: px, y: py};
			to = {x: px, y: pre_y == null ? py : pre_y};
			spr.spriteLine(from, to, sprite);
			pre_y = py;
			
		}
	},
	
	drawChannelWave: function(ch)
	{
		var channel = ch == null ? this.litroSound.channel : [ch]
			, data, c, i, dindex
			, layerScale
			, px, py
			, pre_y
			, from, to
			, spr = scrollByName('sprite')
			, sprite = this.waveSprite
			, chOscWidth = 64
			, chOscHeight = cellhto(6) - 2
			, chOscHeight_h = (chOscHeight / 2) | 0
			, cm = this.ocsWaveCmargin
			;
		;
		
		if(this.editMode == "file"){
			return;
		}

		for(c = 0; c < channel.length; c++){
		// for(c  in channel){
			data = channel[c].data;
			if(this.status_on[c] == null){
				continue;
			}
			for(i = 0; i < chOscWidth; i++){
				dindex = (i * (data.length / chOscWidth)) | 0;
				px = i + cellhto(cm.x);
				py = (-data[dindex] * chOscHeight) | 0;
				if(py > chOscHeight_h){continue;}
				if(py < -chOscHeight_h){continue;}
				py += chOscHeight_h + cellhto(cm.y);

				from = {x: px, y: py};
				to = {x: px, y: pre_y == null ? py : pre_y};
				spr.spriteLine(from, to, sprite);
				
				pre_y = py;
				// console.log(py);
				// break;
			}
			break;
		}

		// console.log(data.length);
	},
	
	drawOnkey: function()
	{
		var i
			, cm_w = this.whiteKeysCmargin
			, cm_b = this.blackKeysCmargin
			, spritekeys = this.noteKeysSpriteKeys
			, wSprite = this.whiteKeysSprite
			, bSprite = this.blackKeysSprite
			, sprite = null
			, scr = scrollByName('sprite')
			, chr
			, keyIndex
			;
			
		for(i = 0; i < this.status_on.length; i++){
			chr = this.status_on[i];
			if(chr == null){
				continue;
			}
			if(this.isBlackKey(chr)){
				keyIndex = this.indexAtBlack(chr);
				sprite = this.blackKeysSprite[spritekeys[chr]];
				scr.drawSpriteChunk(sprite, cellhto(cm_b.x + ((this.BLACK_KEY_SKIP[chr] + keyIndex) * 2)), cellhto(cm_b.y));
			}else{
				keyIndex = this.indexAtWhite(chr);
				sprite = this.whiteKeysSprite[spritekeys[chr]];
				// console.log(spritekeys);
				scr.drawSpriteChunk(sprite, cellhto(cm_w.x + (keyIndex * 2)), cellhto(cm_w.y));
			}
			
			
		}
	},
	
};

function LitroSoundFile()
{
	return;
};
LitroSoundFile.prototype = {
	init: function()
	{
		this.fileVersion = 0.01;
		this.fileList = [];
		
	},
	
	loadFromPath: function(path)
	{
	},
	loadFromURL: function(url)
	{
	},
	loadFromCookie: function()
	{
	},
	saveToPath: function(path, data)
	{
	},
	saveToURL: function(url, data)
	{
	},
	saveToCookie: function(data)
	{
	},
	
	decode: function(audioParams)
	{
		
	},
	
	encode: function(str)
	{
		
	}
};


function printDebug(val, row){
		var scr = scrollByName('sprite'), ltkb = litroKeyboardInstance
			, word = ltkb.word
			, mc = {x: 0, y: 29};
		;
		if(row == null){
			row = 0;
		}
		if(word == null){
			return;
		}
		word.setScroll(scr);
		word.setColor(COLOR_WHITE);
		word.print(val, cellhto(mc.x), cellhto(mc.y - row));
};
	
function drawLitroScreen()
{
	var i
	, ltkb = litroKeyboardInstance
	, spr = scrollByName('sprite')
	, bg1 = scrollByName('bg1')
	, bg2 = scrollByName('bg2')
	, view = scrollByName('view')
	, scr = scrollByName('screen')
	;
	// printDebug(ltkb.litroSound.channel[0].isRefreshClock(), 1);
	if(ltkb.imageLoaded === false){
		return;
	}
	
	// ltkb.drawNoteTest();
	ltkb.repeatDrawMenu();
	ltkb.drawOnkey();
	ltkb.drawOctaveButton();
	bg2.rasterto(view, 0, 0, null, DISPLAY_HEIGHT / 2, ltkb.bg2x.t + cellhto(ltkb.noteScrollCmargin.x), 0);
	bg2.rasterto(view, 0, DISPLAY_HEIGHT / 2, null, DISPLAY_HEIGHT / 2, ltkb.bg2x.b + cellhto(ltkb.noteScrollCmargin.x), 0);
	// bg2.drawto(view);
	bg1.drawto(view);
	spr.drawto(view);
	spr.clear();
	// view.drawto(view);
	screenView(scr, view, VIEWMULTI);
	return;

}


//call at 60fps
function litroKeyboardMain()
{
	var i
	, ltkb = litroKeyboardInstance
	;
	// ltkb.test();
	ltkb.keycheck();
	ltkb.playLitro();
	drawLitroScreen();
};


