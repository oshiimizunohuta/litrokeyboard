/**
 * Litro Keyboard Interface
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 * ver 0.05.01
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
var COLOR_LINE = [88, 216, 84, 255];
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
	
	this.TWO_BUTTON = {
		'<': 188, '>': 190,
	},
	this.OCTAVE_KEYCODE = {
		'-' : 189, '^' : 222, '+' : 187,
	},
	this.ZOOM_KEYCODE = {
		'[' : 219, ']' : 221,
	},
	this.zoomKeys = ['[', ']'];
	this.EXTEND_KEYCODE = {
		'ext' : 16,
	},
	
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
	this.snsImageName = 'sns';
	
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
	
	this.paramKeys = ['TYPE', 'VOLUME', 'ATTACK', 'DECAY', 'SUSTAIN', 'LENGTH', 'RELEASE' , 'V-SPD', 'V-DPT', 'V-RISE', 'V-PHA', 'SWEEP', 'DELAY', 'DETUNE', 'TYP-A', 'TYP-D', ];
	this.paramSubKeys = ['EVENT', 'NOTE'];
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
		'V-SPD': 'vibratospeed',
		'V-DPT': 'vibratodepth',
		'V-RISE': 'vibratorise',
		'V-PHA': 'vibratophase',
		'SWEEP': 'sweep',
		'DELAY': 'delay',
		'DETUNE': 'detune',
		'TYP-A': 'waveTypeAttack',
		'TYP-D': 'waveTypeDecay',
		'EVENT': 'event',
		'NOTE': 'note',
	};
	
	this.ltSoundCommonParamskeys = {	
		'NOTEOFF': 'noteoff',
		'NOTE-EX': 'noteextend',
		'RESTART': 'restart',
		'RETURN': 'return',
	};
	
	this.corsolKeys = ['up', 'down', 'left', 'right'];
	this.baseKeys = ['<', '>', 'select', 'space'];
	
	this.paramCursor = {x: 0, y: 0};
	this.paramCursorCurrent = {x: 0, y: 0};
	this.paramCursorBlinkFlag = false; //paramカーソルの点滅

	this.editMode = 'note';
	this.prevEditMode = 'tune';
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
	this.restartSprite = 208;
	this.returnSprite = 209;
	this.noteoffSprite = 210;
	this.extendSprite = 211;
	
	this.noteScrollCmargin = {x: 3, y: 3};
	this.noteCmargin = {x: 0, y: 11.5};
	// this.noteCmargin = {x: 3, y: 11.5};
	this.noteScrollPos = {x: 0, y: 0};
	this.noteScrollPage = 0;
	this.scrollTime = -1;
	
	this.NOTE_RANGE_SCALE_MIN = 40;
	this.NOTE_RANGE_SCALE_MAX = this.noteRangeCells * this.noteRangeScale;
	this.NOTE_RANGE_SCALE_DEFAULT = 8000;
	this.noteRange = 1; // position multiple
	this.noteRangeCells = 40; // 8px * 32cells
	this.noteRangeScale = this.NOTE_RANGE_SCALE_DEFAULT; // msec per page
	this.seekLineCount= 0; //note をセットする位置アニメ
	this.drawNotesCount = 0;

	this.seekSprite = 242; //ノートカーソル
	this.seekWaitSprite = 243; //ノート待ちカーソル
	this.arrowSprite = 240; //左右カーソル
	this.seekCmargin = {x: 2, y: 0};

	this.menuDispCmargin = {x: 24, y: 17};
	this.ocsWaveCmargin = {x: 26, y: 17};
	this.menuCsize = {w: 12, h: 6};
	this.menuCindent = 1;

	this.catchMenuList = ['KEEP'];
	this.catchKeepMenuList = ['PASTE', 'REMOVE'];
	this.catchMenuCursor = {x: 0, y:0};
	this.noteMenuList = ['EVENTSET', 'CATCH', 'FILE', 'MANUAL'];
	this.noteMenuCursor = {x:0, y:0};
	
	this.fileMenuList = ['LOAD', 'SAVE', 'TITLE', 'LOGIN'];
	this.fileMenuList_login = ['LOAD', 'SAVE', 'TITLE', 'LOGOUT'];
	this.fileTypeList = ['COOKIE', 'SERVER'];
	
	// this.fileLoginList = ['TWITTER']; //GOOGLE+
	this.fileLoginList = ['SELECT SNS']; //GOOGLE+
	
	this.clearMenuList = ['FILE', 'CURRENT'];
	this.fileListList = ['FILESELECT'];
	this.fileTitleList = ['', '', '', 'CANCEL', 'FINISH'];
	// this.eventsetMenuList = ['SET'];
	this.eventsetMenuList = ['NOTEOFF', 'NOTE-EX', 'RESTART', 'RETURN', ];
	this.finalConf = ["NO", "OK"];
	this.loginParams = {user_id: 0, sns_type: null};
	if(window.location.href.indexOf('localhost') >= 0){
		this.loginURLs = {'TWITTER' : 'http://localhost:58104/oauth/twitter/'};
	}else{
		this.loginURLs = {'TWITTER' : 'http://bitchunk.fam.cx/litrosound/oauth/twitter/'};
	}
	
	this.snsIconId = {twitter : 0, 'google+': 1};
	this.serverFileList = [];
	this.fileMenuMap = {};
	this.commandPath = [];
	this.fileMenuCursor = {x:0, y:0};
	this.fileListCursor = {x:0, y:0};
	this.fileListPage = 0;
	this.fileListOffset = 0;

	this.eventsetMenuCursor = {x:0, y:0};
	
 	this.modeRect = {tune: [8, 9, 2, 2], note: [10, 9, 2, 2], file: [12, 9, 2, 2], play: [14, 9, 2, 2], 'catch': [8, 11, 2, 2], eventset: [10, 11, 2, 2], loading: [12, 11, 2, 2], error: [14, 11, 2, 2], manual: [12, 11, 2, 2]};
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
	this.fileTitleCursor = {x: 0, y:0};
	this.charBoardDispNum = {x: 20, y: 2};
	this.charBoardCmargin = {x: 3, y: 19};
	this.titleBackup = '';
	// this.topFrameCenter_1 = 19;
	// this.topFrameCenter_2 = 20;
	this.topFrameCenter = [20, 20, 19, 19, 19, 19, 19, 19, 20, 20, 19, 20, 19, ];
	
	this.manualDir = './img/manual/';
	this.manualImage = [];
	this.manualChapters = [];
	this.manualMenuList = ['NEXT, BACK, CLOSE'];
	this.manualCursor = {x: 0, y:0};
	this.manualPage = 0;
	this.manualScrollParams = {dir: null, count: 0, dulation: 24, bg1: {x: 0, y: 0}, bg2: {x: 0, y: 0}, changeMode: null, openTime:Date.now()};
	
	this.clickableItems = [];
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
		this.keyControll.initDefaultKey('right');
		
		
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
		
		//拡張キー
		for(i in this.EXTEND_KEYCODE){
			this.keyControll.setKey(i, this.EXTEND_KEYCODE[i]);
		}
		
		//2ボタンキー
		for(i in this.TWO_BUTTON){
			this.keyControll.setKey(i, this.TWO_BUTTON[i]);
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
			TITLE: this.fileTitleList,
			LOGIN: this.fileLoginList,
			FILE: this.fileMenuList,
			FINISH: this.fileMenuList,
			CURRENT: this.finalConf,
		};
		
		//
		this.loadImages();
		this.initFingerState(this.fingers);
		this.initCanvas();
		this.initWords();
		this.setBg2Position(this.noteScrollPos.x);
		this.initCatchEvent();
		this.initEventFunc();
		this.initManual();
		
	},
	
	initManual: function(){
		var key, i, c = 0 , page, names = {
			top : [
			'manual_top'
			]
			, base_disp : [
			'basedisplay_label'
			, 'eventboard_label'
			, 'scoreboard_label'
			, 'leftroll_label'
			, 'rightroll_label'
			, 'tuneparams_label'
			, 'wavemenu_label'
			, 'keyboard_label'
			]
		, mode_keys : [
			'mode_top'
			, 'keys_000'
			, 'keys_001'
			, 'keys_002'
			, 'keys_003'
			, 'keys_004'
			, 'keys_005'
			, 'keys_006'
			, 'keys_007'
			, 'keys_008'
			, 'keys_009'
			, 'keys_010'
			, 'keys_011'
		] 
		, tune_params : [
			'tune_top'
			, 'tune_000'
			, 'tune_001'
			, 'tune_002'
			, 'tune_003'
			, 'tune_004'
			, 'tune_005'
		]}
		;
		for(key in names)
		{
			this.manualChapters.push({name: key, index: c});
			for(i = 0; i < names[key].length; i++){
				this.manualImage.push({name: names[key][i], chapter: key});
				c++;
			}
		}

	},
	initEventFunc: function()
	{
		var self = this;
		this.litroSound.setSetChannelEvent(function(ch, key, value){
			var eventset = {};
			eventset[key] = self.makeEventset(key, value, 0);
			self.drawChannelParams(null, null, null, null, eventset, ch);
		});
		this.litroSound.setOnNoteKeyEvent(function(ch, key){
			if(ch == self.paramCursor.x){
				self.status_on[0] = self.key2Char(key);
			}
			return;
		});
	},
	
	initWords: function()
	{
		var word;//, WordPrint = wordPrint;
		word = new WordPrint();
		word.init('8px');
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
		if(this.selectNote.time >= 0 && !pop){
			this.selectNoteHistory.push({time: this.selectNote.time, ch: this.selectNote.ch, type:this.selectNote.type});
		}
		this.selectNote = {time: eventset.time, ch: ch, type:eventset.type};
	},
		
	loadImages: function()
	{
		// this.loader.init();
		var resorce = loadResource([this.uiImageName, this.snsImageName]);
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
	
	seekStep: function()
	{
		return (this.noteRangeScale / this.noteRangeCells) | 0;
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
	
	eventValue2Key: function(value)
	{
		var ids = AudioChannel.tuneParamsIDKey();
		if(ids[value] != null){
			return ids[value];
		}
		return '';
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
	
	key2Char: function(key)
	{
		var i = 0, chr, sepcnt = this.octaveSeparateCount
			, index = key - (this.octaveLevel * this.octaveInKeys)
			, chars = this.ROW_CHARS.top.concat(this.ROW_CHARS.bottom)
		;
		return chars[index] == null ? null : chars[index];
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
			if(this.getLoginParams() != null){
				return this.fileMenuList_login;
			}
			return this.fileMenuList;
		}
		var mapIndex = this.commandPath[this.commandPath.length - 1];
		
		return  this.fileMenuMap[mapIndex] == null ? 
		null :  this.fileMenuMap[mapIndex];
	},
		
	getCatchMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.catchMenuList;
		}else{
			return this.catchKeepMenuList;
		}
	},
	
	getEventsetMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.eventsetMenuList;
		}
		return null;
	},
	
	getManualMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.manualMenuList;
		}
		return null;
	},
	
	getActiveModeMenuList: function()
	{
		switch(this.getMode())
		{
			case 'tune': return this.ltSoundChParamKeys;
			case 'note': return this.getNoteMenuList();
			case 'play': return this.getFileMenuList();
			case 'catch': return this.getCatchMenuList();
			case 'file': return this.getFileMenuList();
			case 'eventset': return this.getEventsetMenuList();
			case 'manual': return this.getManualMenuList();
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
			case 'catch': return this.catchMenuCursor;
			case 'file': return this.fileMenuCursor;
			case 'eventset': return this.eventsetMenuCursor;
			case 'manual': return this.manualCursor;
			default: return {};
		}
	},
	
	getLoginParams: function()
	{
		return this.loginParams.user_id == 0 ? null : this.loginParams;
	},
	
	setError: function()
	{
		var self = this;
		this.changeEditMode('error');
		this.drawMenu();
		window.setTimeout(function(){
			self.changeEditMode('note');
			self.drawMenu();
		}, 2000);
	},
	
	logoutSNS: function()
	{
		var self = this;
		this.changeEditMode('loading');
		self.drawMenu();
		
		this.player.sendToAPIServer('POST', 'logout', {}, function(data){
			if(data.error != null){
				self.setError(data.error_code);
				return;
			}
			self.loginParams = {user_id: 0, sns_type: null};
			self.changeEditMode('file');
			self.drawMenu();
		}, function(){
			self.setError('server error');
		});
		
	},
	loginSNS: function()
	{
		var self = this;
		//SNSログイン完了
		window.addEventListener('message', function(event){
			if(event.data.match(/\{\S*\}/) == null){return;} //twitterのトラップ
			if(event.data == null || event.data == 'null'){self.setError('server error'); window.removeEventListener('message'); return;}
			var data = JSON.parse(event.data);
			if(data.error_code != null){
				self.setError(data.message);
				return;
			}
			
			self.loginParams = {user_id: data.user_id, sns_type: data.sns_type};
			self.baseKeyOnFile('<');
			window.removeEventListener('message');
		}, false);
	},
	
	editChannel: function()
	{
		return this.paramCursor.x;
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
	
	appendClickableItem: function(rect, func, name)
	{
		this.clickableItems.push({rect: rect, func: func, name: (name == null ? this.clickableItems.lengh : name)});
		return this.clickableItems.length;
	},
	
	clearClickableItem: function(name){
		var rep = [], i;
		if(name == null){
			this.clickableItems = [];
			return;
		}
		for(i = 0; i < this.clickableItems.length; i++){
			if(this.clickableItems[i].name){
				continue;
			}
			rep.push(this.clickableItems[i]);
		}
		this.clickableItems = [];
		this.clickableItems = rep;
		return this.clickableItems.length;
	},
	
	makeAllTuneParamSet: function(ch, time)
	{
		time = time == null ? null : time;
		var value, res = {}, tindex
		, types = this.player.typesArray('TUNE', ['event']);
		;
		
		for(tindex = 0; tindex < types.length; tindex++){
			type = types[tindex];
			res[type] = {};
			value = this.litroSound.getChannel(ch, type);
			res[type][time] = this.makeEventset(type, value, time);
		}
		return res;
	},
	
	makeEventset: function(type, value, time)
	{
		time = time == null ? this.player.noteSeekTime: time;
		time = this.player.isPlay() ? time - 1 : time; //プレイ中は重複再生防止
		var e = {
			// time: this.resolutedTime(time),
			time: time,
			type: type == null ? this.getParamKeyName() : type,
			value: value
		}
		;
			// console.log(type, value, time);
		return e;
	},
	
	deleteAtTime: function(ch, time, type)
	{
		type = type == null ? 'ALL' : type;
		var types = this.player.typesArray(type)
		, sort = AudioChannel.sortParam, tindex
		, player = this.player, deleted = {}
		;
		for(tindex = 0; tindex < types.length; tindex++){
			type = types[tindex];
			deleted[type] = {};
			if(this.player.eventsetData[ch] != null && this.player.eventsetData[ch][type] != null && this.player.eventsetData[ch][type][time] != null){
				eventset = this.player.eventsetData[ch][type][time];
				deleted[type][time] = this.makeEventset(type, eventset.value, eventset.time);
				delete this.player.eventsetData[ch][type][time];
				
			}
		}
	},
	
	deleteEventChange: function(ch, events)
	{
		var eventset
		, type, t //, samp = []
		, deleted = {}
		// , data
		, sort = AudioChannel.sortParam
		;
		ch = ch == null ? this.paramCursor.x : ch;
		events = events == null ? this.catchEventset : events;
		for(type in events){
			deleted[type] = {};
			for(t in events[type]){
				// samp.push(t);
				// data = events[type][t];
				if(this.player.eventsetData[ch][type][t] != null){
					eventset = this.player.eventsetData[ch][type][t];
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
		var idKeys = AudioChannel.tuneParamsIDKey()
			, time, set, events
		;
		if(eventset.type == 'event' && idKeys[eventset.value] in AudioChannel.commonTuneType){
			ch = this.player.COMMON_TUNE_CH;
			events = this.player.eventsetData[ch][eventset.type];
			for(time in events){
				if(events[time].value == eventset.value){
					set = {}; set[eventset.type] = {};
					set[eventset.type][time] = eventset;
					this.deleteEventChange(ch, set);
				}
			}
			events[eventset.time] = eventset;
		}else{
			events = this.player.eventsetData[ch][eventset.type];
			events[eventset.time] = eventset;
		}
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
				t = t | 0;
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
	
	incNotekeys: function(eventset)
	{
		var type = 'note', time;
		if(eventset[type] == null){return;}
		for(time in eventset[type]){
			if(eventset[type][time].value + 1 >= this.litroSound.KEYCODE_MAX){
				return;
			}
		}
		for(time in eventset[type]){
			eventset[type][time].value++;
		}
	},
	
	decNotekeys: function(eventset)
	{
		var type = 'note', time;
		if(eventset[type] == null){return;}
		for(time in eventset[type]){
			if(eventset[type][time].value - 1 < 0){
				return;
			}
		}
		for(time in eventset[type]){
			eventset[type][time].value--;
		}
	},
	
	insertSpace: function(ch, startTime, space)
	{
		var types = this.player.typesArray()
			, tindex, type, eventStack, result = {}, t
		;
		eventStack = this.player.allStackEventset(ch, types);
		for(tindex = 0; tindex < eventStack.length; tindex++){
			e = eventStack[tindex];
			t = e.time;
			type = e.type;
			if(startTime <= t){
				t += space;
				if(startTime > t){return;}
			}
			if(result[type] == null){
				result[type] = {};
			}
			result[type][t] = this.makeEventset(type, e.value, t);
		}
		for(type in result){
			this.player.eventsetData[ch][type] = result[type];
		}
	},

//TODO 複数キーの操作は選択中チャンネルで
	onCode: function(chr)
	{
			// console.log(chr);

		var channel, chars, row, octave, code, i
			, pos = this.getNoteDispPos()
			, seekPage = this.getNoteSeekPage()
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
		this.litroSound.onNoteFromCode(channel, code, octave, this.editChannel());
		
		if(this.onkeyEvent != null){
			this.onkeyEvent(chr);
		}
		
		//仮使用
		if(channel == this.editChannel()){
			this.setEventChange(this.editChannel(), this.makeEventset('note', code + (octave * this.octaveInKeys)));
		}
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
		var channel = this.searchState(chr)
			, paramChannel = this.paramCursor.x
			;
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
		// console.log(this.status_on);
		this.status_on[channel] = null;
		// this.litroSound.offNoteFromCode(channel);
		// this.litroSound.channel[channel].refChannel = -1;
		this.litroSound.fadeOutNote(channel, paramChannel);
	},
	
	incOctave: function()
	{
		if(this.octaveLevel <= this.litroSound.OCTAVE_MAX - this.octaveRange + 1){
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
	
	isEnableOnlyChannel: function(ch, enable)
	{
		for(var i = 0; i < this.litroSound.channel.length; i++){
			if(this.litroSound.getChannel(i, 'enable', false) != (((ch == i) == enable) | 0)){
				return false;
			}
		}
		return true;
	},
	
	toggleOnlyChannel: function(ch, enable)
	{
		for(var i = 0; i < this.litroSound.channel.length; i++){
			this.litroSound.toggleOutput(i, (ch == i) == enable);
			this.drawChannelTab_on(i, (ch == i) == enable);
		}
	},
	
	toggleAllChannel: function(enable)
	{
		for(var i = 0; i < this.litroSound.channel.length; i++){
			this.litroSound.toggleOutput(i, enable);
			this.drawChannelTab_on(i, enable);
		}
	},
	
	searchReadySlot: function()
	{
		var i, key
		;
		for(i = 0; i < this.fingers; i++){
			key = (i + this.editChannel()) % this.litroSound.channel.length;
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
	
	manualChapterName: function(next)
	{
		var index, i, chapter = this.manualImage[this.manualPage].chapter
		;
		
		for(i = 0; i < this.manualChapters.length; i++){
			if(this.manualChapters[i].name == chapter){
				index = this.manualChapters[i].index;
				if(next <  0){
					index = this.manualPage + next < index ? i + next : i;
				}else{
					index = i + next;
				}
				return this.manualChapters[index] == null ? '' : this.manualChapters[index].name;
			}
		}
		return '';
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
		
		if(this.getActiveModeCursor().y >= this.getActiveModeMenuList().length){
			// console.log(this.editMode, this.getActiveModeMenuList());
			this.getActiveModeCursor().y = 0;
		}
		
		return;
	},
	
	loadList: function(page)
	{
		var self = this;
		try{
			this.player.listFromServer(this.loginParams.user_id, this.fileListPage, 
				function(append){
					if(append == null || append.error_code != null){
						self.changeEditMode('error');
						self.drawMenu();
						return;
					}
					self.serverFileList = append.length == null ? [append] : append;
					if(self.getLastCommand(1) == 'SAVE'){
						append.push({sound_id: 0, user_id: self.loginParams.user_id, title: 'NEW FILE'});
					}else if(self.getLastCommand(1) == 'LOAD' && append.length == 0){
						append.push({sound_id: 0, user_id: 0, title: 'FILE NOT FOUND'});
					}
					self.changeEditMode('file', false);
					self.fileListCursor.y = self.fileListCursor.y >= self.fileMenuList.length ? 0 : self.fileListCursor.y;

					self.drawFileMenu();
					// self.drawMenu();
					self.drawFileList();
					self.drawFileListCursor();
				}, function(){
					self.changeEditMode('error');
					self.drawMenu();
				});
		}catch(e){
			console.error(e);
			self.changeEditMode('error');
			self.drawMenu();
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
			case 'SERVER': this.changeEditMode('loading'); this.player.saveToSever(this.loginParams.user_id, this.serverFileList[this.fileListCursor.y].sound_id,
				function(data){
					if(data == null || data === false || data.error_code != null){
						self.changeEditMode('error');
						self.drawMenu();
						return;
					}
					self.changeEditMode('note');
					self.drawMenu();
					self.drawParamKeys();
					self.drawChannelParams();
					self.drawParamCursor();
					return;
				},
				function(){
					self.changeEditMode('error');
					self.drawMenu();
				}); break;
		}
	},
	
	loadCommand: function(type)
	{
		var self = this, tid;
		switch(type){
			case 'COOKIE': this.player.loadFromCookie(); this.changeEditMode('note');break;
			case 'SERVER': 
				if(this.serverFileList[this.fileListCursor.y] == null){
					this.fileListCursor.y = 0;
					return;
				}
				this.changeEditMode('loading');
				this.player.loadFromServer(this.loginParams.user_id, this.serverFileList[this.fileListCursor.y].sound_id, 
				function(data){
					if(data == null || data === false){
						self.changeEditMode('error');
						self.drawMenu();
						return;
					}
					self.changeEditMode('note');
					self.drawMenu();
					self.selectMenuItem();//drawNoteのため
					self.drawParamKeys();
					self.drawChannelParams();
					self.drawParamCursor();
					return;
				},
				function(data){
					self.setError(data != null ? data : {error_code: 0, message: 'error'});
				}); break;
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
			, seekTime = this.player.noteSeekTime, moveTime = this.seekTime(cellhto(1))
			, divTime = seekTime % moveTime
			, nextTime = divTime == 0 ? moveTime : divTime
			, prevTime = divTime == 0 ? moveTime : moveTime - divTime
		;
		// console.log(moveTime, divTime);
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit;
					// this.drawNoteMenu();
					// this.drawNoteCursor();
					this.drawMenuList(list);
					this.drawMenuListCursor(list, cur.y);
					break;
			case 'down': cur.y = (cur.y + 1) % limit;
					// this.drawNoteMenu();
					// this.drawNoteCursor();
					this.drawMenuList(list);
					this.drawMenuListCursor(list, cur.y);
					break;
			case 'left': this.player.seekMoveBack(nextTime); this.updateBackSeek(); break;
			case 'right': this.player.seekMoveForward(prevTime); this.updateForwardSeek(); break;
		}
	},
	
	channelMove: function(dir)
	{
		var cur = this.paramCursor
			, chLength = this.litroSound.channel.length
			, ch = this.editChannel();
		;
		switch(dir){
			case 'up': if(this.litroSound.getChannel(ch, 'enable', false) == 0){
								this.litroSound.toggleOutput(ch, true);
								this.drawChannelTab_on(ch, true);
							}else{
								if(!this.isEnableOnlyChannel(ch, true)){
									this.toggleOnlyChannel(ch, true);
								}else{
									this.toggleAllChannel(true);
								}
							}
							break;
			case 'down': if(this.litroSound.getChannel(ch, 'enable', false) == 1){
									this.litroSound.toggleOutput(ch, false);
									this.drawChannelTab_on(ch, false);
								}else{
									if(!this.isEnableOnlyChannel(ch, false)){
										this.toggleOnlyChannel(ch, false);
									}else{
										this.toggleAllChannel(false);
									}
								}
							break;
			case 'left': cur.x = (cur.x + chLength - 1) % chLength;
							break;
			case 'right': cur.x = (cur.x + 1) % chLength;
							break;
		}
		// this.drawParamKeys();
		this.drawChannelParams();
		this.drawParamCursor();
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	moveChannelParamCursor: function(dir, ext)
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
		if(!ext){
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
				case 'left': this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param, false) - 1);
								this.drawParamCursor();
								break;
				case 'right': this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param, false) + 1);
								this.drawParamCursor();
								break;
			}
			this.paramOffset = offset;
			this.drawParamKeys(offset, limit);
			this.drawChannelParams(offset, limit);
			this.drawParamCursor();
		}else{
			//描画込み
			this.channelMove(dir);
		}
	},
	
	moveCatchCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			// , curr = this.paramCursorCurrent
			// , limit = this.paramLimit
			// , offset = this.paramOffset
			, searchTime = -1
			, catchKey = ['note', 'TUNE', 'ALL']
			, catchVal, eventset = null
			, ignore = this.selectNote
			, prevNote
			, ch = this.editChannel()
		;
		
		if(this.getLastCommand() == "KEEP"){
			 if(ext){
				switch(dir){
					case 'up':
						this.incNotekeys(this.catchEventset);
						this.drawEventsetBatch();
						break;
					case 'down':
						this.decNotekeys(this.catchEventset);
						this.drawEventsetBatch();
						break;
					case 'left': this.channelMove(dir);
									break;
					case 'right': this.channelMove(dir);
									break;
				}
			}else{
				this.moveMenuCursorCommon(cur, dir, this.getActiveModeMenuList());
			}
			return;
		}

		//キャッチタイプのインデックス
		for(catchVal = 0; catchVal < catchKey.length; catchVal++){
			if(catchKey[catchVal] == this.catchType){break;}
		}
		switch(dir){
			case 'up': this.catchType = catchKey[(catchVal + catchKey.length - 1) % catchKey.length];
							break;
			case 'down': this.catchType = catchKey[(catchVal + 1) % catchKey.length];
							break;
			case 'left': eventset = this.player.searchNearBack(ch, this.player.noteSeekTime, 0, this.catchType, ignore);
							break;
			case 'right': eventset = this.player.searchNearForward(ch, this.player.noteSeekTime, -1, this.catchType, ignore);
							break;
		}
		this.drawMenu(this.editMode);

		if(eventset != null){
			if(!ext || (this.catchType != 'ALL' && ((this.catchType == 'TUNE' && this.selectNote.type == 'note') || (this.catchType == 'note' && this.selectNote.type != 'note')) && (this.selectNote.ch != ch || this.selectNote.type != this.catchType))){
				//違うチャンネルをキャッチした
				this.initCatchEvent();
				this.initSelect();
			}
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
			// console.log(this.catchEventset);
			this.drawSelectEvents(this.selectNote);
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
			this.drawNoteScroll(null, true);
		}
		
		return eventset;
	},
	
	moveCharBoardCursor: function(dir, ext)
	{
		var skip = 3
			,Ccur =  this.charBoardCursor, Fcur =  this.fileMenuCursor
			, Climit = this.charBoardLimit, Flimit = this.getActiveModeMenuList().length - skip
			, curr = this.charBoardCurrent, dispNum = this.charBoardDispNum
			, Tcur = this.fileTitleCursor, Tlimit = this.player.titleMaxLength
			, tlength = this.player.title.length + 1
			,y = Fcur.y
		;
		if(ext){
			switch(dir){
				case 'up': Ccur.y = (Ccur.y + Climit.y - 2) % Climit.y;
						curr.y = curr.y - 2; break;
				case 'down': Ccur.y = (Ccur.y + 2) % Climit.y;
						curr.y = curr.y + 2; break;
				case 'left': Tcur.x = tlength == 1 ? Tcur.x : (Tcur.x + tlength - 1) % tlength; break;
				case 'right': Tcur.x = tlength == 1 ? Tcur.x : (Tcur.x + 1) % tlength; break;
			}			
			curr.y = Ccur.y - curr.y >= dispNum.y ? Ccur.y - dispNum.y + 1 : curr.y;
			curr.y = Ccur.y - curr.y + 1 < 0 ? Ccur.y : curr.y;
			this.drawCharBoard();
		}else if(Fcur.x == 0){
			y -= skip;
			switch(dir){
				case 'up': Fcur.y = ((y + Flimit - 1) % Flimit) + skip; break;
				case 'down': Fcur.y = ((y + 1) % Flimit) + skip; break;
				case 'left': Fcur.x = Fcur.x - 1; break;
				case 'right': Fcur.x = Fcur.x + 1; break;
			}
			if(Fcur.x > 0){
				Ccur.x = 0;
				this.drawCharBoard();
				this.drawFileMenu();
			}else if(Fcur.x < 0){
				Ccur.x = Climit.x - 1;
				this.drawCharBoard();
				this.drawFileMenu();
			}else{
				this.drawMenu();
				this.drawFileCursor();
				this.drawCharBoard();
			}
		}else{
			switch(dir){
				case 'up': Ccur.y = (Ccur.y + Climit.y - 1) % Climit.y; break;
				case 'down': Ccur.y = (Ccur.y + 1) % Climit.y; break;
				case 'left': Ccur.x = Ccur.x - 1; break;
				case 'right': Ccur.x = Ccur.x + 1; break;
			}
			curr.y = Ccur.y - curr.y >= dispNum.y ? Ccur.y - dispNum.y + 1 : curr.y;
			curr.y = Ccur.y - curr.y < 0 ? Ccur.y : curr.y;
			if(Ccur.x >= Climit.x || Ccur.x < 0){
				Fcur.x = 0;
				this.drawFileCursor();
				this.drawCharBoard();
			}else{
				this.drawCharBoard();
			}
		}
	},
	
	moveFileMenuCursor: function(dir, ext)
	{
		if(this.getLastCommand() == 'TITLE'){
			this.moveCharBoardCursor(dir, ext);
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
	
	moveEventsetCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
		;
		// this.moveMenuCursorCommon(cur, dir, list);
		switch(dir)
		{
			case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
			case 'down': cur.y = (cur.y + 1) % list.length; break;
			case 'left': this.moveMenuCursorCommon(cur, dir, list); break;
			case 'right': this.moveMenuCursorCommon(cur, dir, list); break;
		}
		this.drawEventsetMenu();
		this.drawEventsetCursor();

	},
	
	moveNoteMenuCursor: function(dir)
	{
		var cur = this.noteMenuCursor
			, list = this.noteMenuList
		;
		this.moveMenuCursorCommon(cur, dir, list);
	},
	
	moveManualMenuCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
		;
		return;
		// this.moveMenuCursorCommon(cur, dir, list);
		switch(dir)
		{
			case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
			case 'down': cur.y = (cur.y + 1) % list.length; break;
			case 'left': this.moveMenuCursorCommon(cur, dir, list); break;
			case 'right': this.moveMenuCursorCommon(cur, dir, list); break;
		}
	},

	getMenuCommandPath: function()
	{
		var list = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			;
		if(list == null){
			return null;
		}
		return list[cur.y];
	},
	
	setMenuCommandPath: function()
	{
		var path = this.getMenuCommandPath()
			;
		if(path == null){
			return this.getLastCommand();
		}
		this.commandPath.push(path);
		return path;
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
	
	commonTabKey: function(back)
	{
		var mode;
		back = back == null ? false : back;
		if(this.player.isPlay()){
			if(this.editMode == 'tune'){
				this.changeEditMode('play');
			}else{
				this.changeEditMode('tune');
			}
		}else if(back){
				this.changeEditMode('note');
		}else{
			mode = this.editMode;
			if(mode == this.prevEditMode){this.prevEditMode = 'tune';}
			this.changeEditMode(this.prevEditMode);
			this.prevEditMode = mode;
		}
		this.drawParamKeys();
		// this.drawSelectEvents(this.selectNote);
		this.drawChannelParams();
		this.drawParamCursor();
		this.drawMenu();
	},
	
	baseKeyOnChannel: function(key, ext)
	{
		var cur = this.paramCursor
			// , curr = this.paramCursorCurrent
			, param = this.ltSoundChParamKeys[this.paramKeys[cur.y]]
			, eventset, types = {}, player = this.player, time = player.noteSeekTime, ch = this.editChannel()
		;
		switch(key){
			case '<': 
				types = ext ? 'TUNE' : param;
				// this.initCatchEvent();
				// this.initSelect();
				this.deleteAtTime(ch, time, types);
				break;
			case '>': 
				if(ext){
					eventset = this.makeAllTuneParamSet(ch, time);
					this.pasteEventCange(ch, time, eventset);
				}else{
					eventset = this.makeEventset(param, this.litroSound.getChannel(ch, param, false));
					this.setEventChange(ch, eventset);
				}
					
				break;
			case 'select': 
				this.commonTabKey();
				// this.changeEditMode(this.editMode == 'tune' ? 'note' : 'tune');
				break;
			case 'space': 
				this.playKeyOn(ext);
				break;
		}
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	baseKeyOnCatch: function(key, ext)
	{
		var cur, deldat
			, selCommand = this.getMenuCommandPath()
			, lastCommand = this.getLastCommand()
			, i
		;
		switch(key){
			case '<': 
				if(lastCommand == 'KEEP'){
					com = this.backMenu();
					this.getActiveModeCursor().y = 0;
					// break;
				}else{
					this.editMode = this.selectNote.time < 0 ? 'note' : this.editMode;
					this.initCatchEvent();
					this.initSelect();
				}
				this.drawMenu();
				break;
			case '>': 
				if(lastCommand == 'KEEP'){
					if(selCommand == 'PASTE'){
						this.pasteEventCange(this.editChannel(), this.player.noteSeekTime, this.catchEventset);
					}else if(selCommand == 'REMOVE'){
						deldat = this.deleteEventChange(this.selectNote.ch, this.catchEventset);
						this.initCatchEvent(deldat);
					}
					this.getActiveModeCursor().y = 0;
				}else{
					com = this.setMenuCommandPath();
				}
				// this.changeEditMode('note');
				// for(i = 0; i < this.noteMenuList.length; i++){
					// if(this.noteMenuList[i] == 'PASTE'){cur.y = i; break;}
				// };
				// this.drawMenuList(list);
				// this.drawMenuListCursor(list, cur.y);
				this.drawMenu();
				break;
			case 'select': 
				this.initCatchEvent();
				this.initSelect();
				this.changeEditMode('note');
				this.drawMenu();
				break;
			case 'space': 
				this.initCatchEvent();
				this.initSelect();
				this.playKeyOn(ext);
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
				this.commonTabKey();
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
				this.getActiveModeCursor().y = 0;
				this.initCatchEvent();
				this.initSelect();
				break;
			case 'PASTE': 
				// if(key == '<'){
					// cur.y = 0;
					// break;
				// }
				// this.pasteNote(cur.x, this.player.noteSeekTime, this.catchNotes.note);
				// this.pasteEventCange(this.paramCursor.x, this.player.noteSeekTime, this.catchEventset);
				// this.commandPath = [];
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
				this.changeEditMode('eventset');
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
			case 'MANUAL':
				if(key == '<'){
					break;
				}
				this.openManual();
				break;
			case 'SAVE':
				cur = this.fileMenuCursor;
				cur.y = 0;
				break;
			case 'COOKIE':
				cur = this.fileMenuCursor;
				if(key == '<'){
					cur.y = 0;
					break;
				}
			break;
			case 'SERVER':
				cur = this.fileMenuCursor;
				if(key == '<'){
					cur.y = 0;
					break;
				}
				this.changeEditMode('loading', false);
				this.loadList(this.fileListPage);
				this.getActiveModeCursor().y = 0;
				break;
			case 'TITLE':
				this.titleBackup = this.player.title;
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					break;
				}
				break;
			case 'LOGIN':
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					break;
				}
				break;
			case 'FINISH':
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					this.getActiveModeCursor().y = 0;
					this.fileTitleCursor.x = this.titleBackup.length;
					this.player.title = this.titleBackup;
					break;
				}
				this.word.setLineCols(this.player.titleMaxLength + 1);
				this.player.titleCodes = this.word.makeStrId(this.player.title);
				this.titleBackup = this.player.title;
				// console.log(this.player.titleCodes, this.player.titleCodes.length, this.player.titleMaxLength, this.word.cols);
				this.changeEditMode('file');
				break;
			case 'OK':
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					break;
				}
				this.commandExecute();
				break;
			case 'CANCEL':
				this.getActiveModeCursor().y = 0;
				this.fileTitleCursor.x = this.titleBackup.length;
				this.player.title = this.titleBackup;
				if(key == '>'){
					this.backMenu();
					this.backMenu();
				}
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
	
	baseKeyOnNote: function(key, ext)
	{
		var cur = this.noteMenuCursor
			, ch = this.editChannel(), time = this.player.noteSeekTime
			, space = this.seekStep()
		;
		if(ext){
			switch(key){
				case '<': this.insertSpace(ch, time, -space); break;
				case '>': this.insertSpace(ch, time, space); break;
			}
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
			this.drawNoteScroll(null, true);
		}else{
			switch(key){
				case '<': this.deleteAtTime(ch, time, 'note'); break;
			}
			com = this.baseKeyMenuCommon(cur, key);
		}
	},	
	
	baseKeyOnEventset: function(key, ext)
	{
		var cur = this.paramCursor, mCur = this.getActiveModeCursor()
			, param = this.ltSoundCommonParamskeys[this.eventsetMenuList[mCur.y]]
			, id = AudioChannel.tuneParamsProp[param].id
			, ch = this.editChannel(), time = this.player.noteSeekTime, events
			// , id = AudioChannel.tuneParamsID[param]
		;
		switch(key){
			case '<': 
				if(ext){this.deleteAtTime(ch, time, 'event');}
				else{this.deleteAtTime(ch, time, 'event');}
				// else{this.changeEditMode('note');}
				break;
			case '>': 
				this.setEventChange(cur.x, this.makeEventset('event', id));
				break;
			case 'select': 
				this.commonTabKey(true);
				break;
			case 'space': 
				this.playKeyOn(ext);
				break;
		}
		// cur.y = 0;
		this.drawMenu();
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	baseKeyOnTitle: function(key, ext)
	{
		var cur = this.fileTitleCursor, limit = this.player.titleMaxLength
			, Ccur = this.charBoardCursor, Climit = this.charBoardLimit
			, title = this.player.title, cha = this.word.indexOf(Ccur.x + (Ccur.y * Climit.x))
		;
		switch(key){
			case '<': 
				if(ext){
					title = title.substr(0, cur.x) + title.substr(cur.x + 1);
				}else{
					cur.x = cur.x > 0 ? cur.x - 1 : cur.x;
					title = title.substr(0, cur.x) + title.substr(cur.x + 1);
				}
				break;
			case '>': 
				if(ext){
					if(title.length <= cur.x){
						title = title.substr(0, cur.x) + cha + title.substr(cur.x);
					}else{
						title = title.substr(0, cur.x) + cha + title.substr(cur.x + 1);
					}
				}else{
					if(title.length <= cur.x){
						title = title.length < limit
						? title.concat(cha)
						: title.substr(0, title.length - 1) + cha;
					}else{
						title = title.substr(0, cur.x) + cha + title.substr(cur.x);
					}
					cur.x = cur.x < limit ? cur.x + 1 : cur.x;
				}
				break;
			case 'select': 
				break;
			case 'space': 
				this.playKeyOn(ext);
				break;
		}
		this.player.title = title.substr(0, limit);
	},
	
	baseKeyOnFile: function(key, ext)
	{
		var fcur = this.fileMenuCursor, ccur = this.charBoardCursor
			, cLimit = this.charBoardLimit
			, com
		;
		if(this.getLastCommand() == 'TITLE'){
			if(key == 'select'){
				if(fcur.x == 0){
					ccur.x = 0; fcur.x = 2;
					this.drawFileMenu();
				}else{
					fcur.x = 0;	ccur.x = -1;
					this.drawFileCursor();
				}
				this.drawCharBoard();
				return;
			}
			if(this.fileMenuCursor.x != 0){
				this.baseKeyOnTitle(key, ext);
				this.drawCharBoard();
				return;
			}
		}

		if(this.getLastCommand() == 'LOGIN'){
			fcur.y = 0;
			if(key == '>'){
				return;
			}else if(key == '<'){
				this.backMenu();
			}else if(key == 'select'){
				this.changeEditMode('note');
			}
			this.closeSNSTab();
			this.drawMenu();
			return;
		}
		
		if(key == 'select'){
			this.commonTabKey(true);
			return;
		}		
		com = this.baseKeyMenuCommon(fcur, key);
		if(key == '<' && this.fileMenuList.indexOf(com) >= 0){
			this.changeEditMode('note');
			this.drawMenu();
		}else if(com == 'FILELIST'){
			this.commandExecute(); //未使用？
		}else if(com == 'TITLE'){
			this.fileMenuCursor.x = -1;
			this.fileMenuCursor.y = 3;
			this.charBoardCursor.x = 0;
			this.clearLeftScreen();
			this.drawCharBoard();
			return;
		}else if(com == 'LOGIN'){
			fcur.y = 0;
			this.loginSNS();
			this.openSNSTab();
		}else if(com == 'LOGOUT'){
			fcur.y = 0;
			this.logoutSNS();
		}else if(key == '>'){
			// if(this.fileLoginList.indexOf(com) >= 0){
				// this.openLoginIFrame(com);
				// this.changeEditMode('file', true);
				// this.drawMenu();
			// }
			fcur.y = 0;
		}
	},	
	baseKeyOnManual: function(key, ext)
	{
		var cur = this.paramCursor, mCur = this.getActiveModeCursor()
			, param = this.ltSoundCommonParamskeys[this.eventsetMenuList[mCur.y]]
			, id = AudioChannel.tuneParamsProp[param].id
			// , id = AudioChannel.tuneParamsID[param]
		;
		switch(key){
			case '<': 
				if(ext){
					if(this.manualPage == 0){
						this.closeManual();
					}else{
						this.openManual(this.manualChapterName(-1));
					}
				}else{
					if(this.manualPage == 0){
						this.closeManual();
					}else{
						this.openManual(this.manualPage - 1);
					}
				}
				break;
			case '>': 
				if(ext){
					this.openManual(this.manualChapterName(1));
				}else{
					this.openManual(this.manualPage + 1);
				}
				break;
			case 'select': 
				this.closeManual();
				// this.commonTabKey(true);
				break;
			case 'space': 
				// this.playKeyOn(ext);
				break;
		}
		// cur.y = 0;
		// this.drawMenu();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
	},
	playKeyOn: function(ext)
	{
		var  player = this.player
			;
			
		if(!player.isPlay()){
			if(!ext){
				player.seekMoveBack(-1);
			}
			this.updateBackSeek();
			this.editMode = 'play';
			this.drawMenu('play');
			this.drawOscillo();
		}else{
			if(this.editMode != 'tune'){
				this.getActiveModeCursor().y = 0;
			}
			this.changeEditMode(this.prevEditMode);
			this.prevEditMode = 'note';
			// this.changeEditMode('note');
			// this.editMode = 'note';
			
			this.drawParamKeys();
			this.drawParamCursor();
			this.drawChannelParams();
			this.drawMenu();
			// this.drawChannelCursor();
		}
		this.initFingerState(this.fingers);
		player.isPlay() == true ? player.stop() : player.play();
	},
	
	baseKeyOn: function(key, ext)
	{
		if(key == 'space'){
			this.playKeyOn(ext);
			return;
		}
		
		switch(this.editMode){
			case 'tune': this.baseKeyOnChannel(key, ext);break;
			case 'note': this.baseKeyOnNote(key, ext);break;
			case 'play': this.baseKeyOnChannel(key, ext);break;
			case 'catch': this.baseKeyOnCatch(key, ext);break;
			case 'eventset': this.baseKeyOnEventset(key, ext);break;
			case 'file': this.baseKeyOnFile(key, ext);break;
			case 'manual': this.baseKeyOnManual(key, ext);break;
			default: break;
		}
	},
	
	holdKeyCommon: function(key, ext)
	{
		this.baseKeyOn(key, ext);
	},
	
	moveCursor: function(dir, ext)
	{
		switch(this.editMode){
			case 'tune': this.moveChannelParamCursor(dir, ext);break;
			case 'note': this.moveNoteMenuCursor(dir, ext);break;
			case 'play': this.moveChannelParamCursor(dir, ext);break;
			case 'catch': this.moveCatchCursor(dir, ext);break;
			case 'eventset': this.moveEventsetCursor(dir, ext);break;
			case 'file': this.moveFileMenuCursor(dir, ext);break;
			case 'manual': this.moveManualMenuCursor(dir, ext);break;
			// case 3: this.baseKeyOnChannel(dir);break;
		}
	},
	
	zoomKeyOn: function(key, ext)
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
			c = ext ? min : c;
			this.noteRangeScale = r + c >= max ? max : r + c;
		}else if(key == ']'){
			for(c; c < max; c += c){
				if((c + p) * 16 >= r){break;}
				p += c;
			}
			c = ext ? min : c;
			this.noteRangeScale = r - c <= min ? min : r - c;
		}else if(key == '[]'){
			this.noteRangeScale = ext ? min * 10 : this.NOTE_RANGE_SCALE_DEFAULT;
		}
		this.drawZoomScale(this.noteRangeScale);
		this.updateForwardSeek();
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	keycheck: function(){
		var state, hold, trigs, untrigs, row, chars, name, cont = this.keyControll
			, ext = cont.getState('ext')
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
				this.moveCursor(key, ext);
			}
		}
		
		trigs = cont.getTrig('select');
		if(trigs && ext){
			captureScreen('view');
			return;
		}
		
		//操作キー
		trigs = cont.getTrig(this.baseKeys);
		hold = cont.getHold(this.baseKeys);
		for(key in trigs){
			if(trigs[key] || hold[key]){
				this.holdKeyCommon(key, ext);
			}
		}
		
		//ズームキー
		trigs = cont.getTrig(this.zoomKeys);
		hold = cont.getHold(this.zoomKeys);
		for(key in trigs){
			if(trigs[key] || hold[key]){
				this.zoomKeyOn(key, ext);
			}
		}
		state = cont.getState(this.zoomKeys);
		if(state['['] && state[']']){
			this.zoomKeyOn('[]', ext);
		}
	},
	
	clickEvent: function(x, y)
	{
		var i, item;
		for(i = 0; i < this.clickableItems.length; i++){
			item = this.clickableItems[i];
			if(item.rect.isContain(x, y)){
				item.func(item);
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
		this.drawScrollTime(null, true);
		
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
	},
	
	drawSeek: function()
	{
		var sprite = this.editMode == 'note' || this.editMode == 'eventset' || this.editMode == 'catch' || this.player.isPlay()
			 ? makeSprite(this.uiImageName, this.seekSprite) : makeSprite(this.uiImageName, this.seekWaitSprite)
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
	drawTitleCursor: function()
	{
		var cm = this.paramskeysCmargin
			, cur = this.fileTitleCursor
		;
		this.paramCursorBlinkFlag = !this.paramCursorBlinkFlag;
		if(this.paramCursorBlinkFlag){return;}
		this.word.setScroll(scrollByName('sprite'));
		this.word.print('　', cellhto(cm.x + cur.x), cellhto(cm.y + 0), COLOR_BLACK, COLOR_NOTEFACE);
		this.word.print('　', cellhto(cm.x + cur.x), cellhto(cm.y + 1), COLOR_BLACK, COLOR_NOTEFACE);
		
	},
	
	drawCharBoard: function()
	{
		var scr = scrollByName('bg1')
			, word = this.word, x, y, i = 0
			, cm = this.charBoardCmargin
			, tcm = this.paramskeysCmargin
			, dispNum = this.charBoardDispNum
			, ofstr = this.charBoardCurrent.y * dispNum.x
			, spr, tspr, rev, chrNum, hiphens = '', spaces = ''
			, maxCurrent = 200
			, cur = this.charBoardCursor
		;
		word.setScroll(scr);
		word.setMarkAlign('vertical');
		word.setLineCols(this.player.titleMaxLength);
		
		function setsprite(code, reverse){
			sprite = makeSprite(word.imageName, code);
			sprite.swapColor(reverse ? COLOR_BLACK : COLOR_NOTEFACE, COLOR_FONT8);
			sprite.swapColor(reverse ? COLOR_NOTEFACE : COLOR_BLACK, COLOR_TRANSPARENT);
			return sprite;
		}
		
		word.print(this.player.title, cellhto(cm.x), cellhto(tcm.y + 1), COLOR_NOTEFACE, COLOR_BLACK);
		
		for(x = 0; x < this.player.titleMaxLength - this.player.title.length; x++){
			spaces += '　';
			hiphens += '-';
		}
		word.print(spaces, cellhto(cm.x + this.player.title.length), cellhto(tcm.y + 1), COLOR_NOTEFACE, COLOR_BLACK);
		word.print(hiphens, cellhto(cm.x + this.player.title.length), cellhto(tcm.y + 1.25), COLOR_NOTEFACE, COLOR_BLACK);
		// y = cellhto(0.25);
		
		for(y = 0; y < dispNum.y; y++){
			for(x = 0; x < dispNum.x; x++){
				rev = cur.x == x && cur.y - this.charBoardCurrent.y == y ;
				if(i + ofstr in word.soundmarks){
					tspr = setsprite(i + ofstr, rev);
					spr = setsprite(word.soundmarks[i + ofstr], rev);
				}else{
					tspr = setsprite(word.SPACE_CODE, rev);
					spr = setsprite(i + ofstr, rev);
				}
				scr.drawSprite(tspr, cellhto(x + cm.x), cellhto((y * 2) + cm.y));
				scr.drawSprite(spr, cellhto(x + cm.x), cellhto((y * 2) + cm.y + 1));
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
	drawNoteRaster: function(ch, type, x, y, rot, bottom, catchMode, divofs)
	{
		var noteCm = this.noteCmargin
			, sprite
		;
		divofs = divofs == null ? 0 : divofs;
		// if(cx < -1 || cy < 0){return;}
		if(x < cellhto(-2)){return;}
		if(x >= cellhto(this.noteRangeCells + 1) || y >= cellhto(this.octaveRangeCells)){return;}
		x = cellhto(noteCm.x) + x;
		if(type == 'note'){
			x -= rot == 3 ? cellhto(1) / 2 : 0;
			y = cellhto(noteCm.y) - (y / 2);
			y += rot == 3 ? cellhto(1) / 2 : 0;
			sprite = makeSprite(this.uiImageName, this.noteSprite + ch);
		}else{
			y = 0;
			if(type == 'noteoff'){
				sprite = makeSprite(this.uiImageName, this.noteoffSprite);
				sprite.swapColor(COLOR_ARRAY[ch], COLOR_WHITE);
			}else if(type == 'noteextend'){
				sprite = makeSprite(this.uiImageName, this.extendSprite);
				sprite.swapColor(COLOR_ARRAY[ch], COLOR_WHITE);
			}else if(type == 'restart'){
				sprite = makeSprite(this.uiImageName, this.restartSprite);
				x -= cellhto(1);
			}else if(type == 'return'){
				sprite = makeSprite(this.uiImageName, this.returnSprite);
				x += cellhto(1);
			}else{
				sprite = makeSprite(this.uiImageName, this.eventsetSprite + ch);
			}
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
		var eventset, settype, type, data, ch, i, t, x, y, note, noref, drawCnt = 0, noteCnt = 0
			, tuneWrited = {}, chSort = []
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
			if(this.editChannel() != ch){chSort.push(ch);}
		}
		chSort.push(this.editChannel());
		
		for(i = 0; i < channelsData.length; i++){
			ch = chSort[i];
			if(this.litroSound.getChannel(ch, 'enable', false) == 0){continue;}
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
					// if(t in tuneWrited && type in AudioChannel.tuneParamsMax){
					if(t in tuneWrited && type in AudioChannel.tuneParamsProp){
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
							this.blinkDrawEventset.push({ch: ch, type: type, x: x, y: y, rot: rot, bottom: bottom, catchMode: catchMode, time: divofsTime, noref: noref});
						}else{
							this.drawNoteRaster(ch, type, x, y, rot, bottom, catchMode, divofsTime);
						}
					}else{
						tuneWrited[t] = true;
						x = ((eventset.time - timeStart) * DISPLAY_WIDTH / this.noteRangeScale) | 0;
						if(x in drawnNotes){continue;}
						y = cellhto(-1);
						//console.log(eventset, type);
						settype = type == 'event' ? this.eventValue2Key(eventset.value) : type;
						if(catchMode){
							this.blinkDrawEventset.push({ch: ch, type: settype, x: x, y: y, rot: 0, bottom: bottom, catchMode: catchMode, time: divofsTime, noref: noref});
						}else{
							this.drawNoteRaster(ch, settype, x, y, 0, bottom, catchMode, divofsTime);
						}
					}
					drawnNotes[x] = t;
					noteCnt++;
				}
				drawnNotes = {};
			}
		}
		
	},
	
	//一括eventset描画
	drawEventsetBatch: function(){
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		this.drawNoteScroll(null, true);
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
			, size = {w: 16, h: 12}
			, left = {x: 4, y: 2}, right = {x: size.w + 4, y: 2}
			, cm = side == 'left' ? right : left
			, scroll = scrollByName('bg1')
			, eventset = this.player.getEventsFromTime(events.ch, events.time)
			, key, keys = [], i
			, rows = 10
		;
		this.blinkDrawParams = [];
		if(events.time < 0){
			scroll.clear(null, makeRect(cellhto(left.x), cellhto(left.y), cellhto(size.w * 2), cellhto(size.h)));
			return;
		}
		
		keys = this.intersectParamKeys(eventset);
		
		this.word.setScroll(scroll);
		scroll.clear(side == 'left' ? null : COLOR_BLACK, makeRect(cellhto(left.x), cellhto(left.y), cellhto(size.w), cellhto(size.h)));
		scroll.clear(side == 'left' ? COLOR_BLACK : null, makeRect(cellhto(right.x), cellhto(right.y), cellhto(size.w), cellhto(size.h)));
		this.word.print('　T:' + this.player.noteSeekTime, cellhto(cm.x), cellhto(cm.y), COLOR_NOTEFACE, COLOR_BLACK);
		this.drawParamKeys(0, rows, cm.x + 1, cm.y + 2, keys);
		this.drawChannelParams(0, rows, cm.x + 5 + 1, cm.y + 2, eventset, events.ch);
		this.drawParamKeys(rows, rows, cm.x + 8 + 1, cm.y + 2, keys);
		this.drawChannelParams(rows, rows, cm.x + 13 + 1, cm.y + 2, eventset, events.ch);
	},
	
	drawCatchMenu: function()
	{
		var menu;
		if(this.getLastCommand() == 'KEEP'){
			menu = this.catchKeepMenuList;
			this.drawMenuList(menu);
		}else{
			menu =  this.catchMenuList;
			this.drawMenuList(menu);
			this.drawCatchType(this.catchType);
		}
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
			 cm = this.menuDispCmargin
			 indent = this.menuCindent
			 bg = scrollByName('bg1')
			 spr = this.loginParams.sns_type != null ? makeSprite(this.snsImageName, this.snsIconId[this.loginParams.sns_type]) : null
		;
		if(menu == null){
			menu = ['？？？'];
		}
		this.drawMenuList(menu);
		
		if(spr != null && this.getLastCommand() != 'TITLE'){
			bg.drawSprite(spr, cellhto(cm.x + indent), cellhto(cm.y + menu.length));
		}
		
		if(this.commandPath.indexOf('LOAD') > -1){
			this.word.print('LOAD', cellhto(cm.x + indent), cellhto(cm.y + 4), COLOR_ARRAY[3], COLOR_BLACK);
		}else if(this.commandPath.indexOf('SAVE') > -1){
			this.word.print('SAVE', cellhto(cm.x + indent), cellhto(cm.y + 4), COLOR_ARRAY[0], COLOR_BLACK);
		}
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
			;
		if(list == null){
			list = ['？？？'];
		}
		word.setScroll(scrollByName('bg1'));
		word.print(list[y], cellhto(indent + keyCm.x), cellhto(keyCm.y + y), COLOR_BLACK, COLOR_PARAMKEY);
		
	},
	
	drawEventsetCursor: function()
	{
		var menu = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			, com = this.getLastCommand();
			;

		if(menu == null){
			menu = ['？？？'];
		}
		this.drawMenuListCursor(menu, cur.y);
	},
	
	drawFileCursor: function()
	{
		var menu = this.getFileMenuList()
			, com = this.getLastCommand();
			;

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
			if(this.serverFileList[cur.y] == null){return;}
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
			sublen = 5;
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
			, chLeft = 0, chLength = 0
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
					num = this.litroSound.getChannel(j, tuneLavelKey[i], false);
					if(num == null){continue;}
					params[tuneLavelKey[i]][j] = this.litroSound.getChannel(j, tuneLavelKey[i], false).toString(16);
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
		chLeft = (fixch != null) && (xc == null) ? fixch * numLength : 0;
		
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
							this.blinkDrawParams.push({sprite: sprite, x: cellhto(mc.x + (j * numLength) + chLeft), y: cellhto(mc.y + i), noref: noref});
							continue;
						}
					}
					word.print(formatNum(num, 2), cellhto(mc.x + (j * numLength) + chLeft), cellhto(mc.y + i), color, COLOR_BLACK);
				}
			}
		}
	},

	drawScrollTime: function(time, init)
	{
		var cm = {x: 0, y: 9}
			, c1 = COLOR_NOTEPRINT
			, c2 = COLOR_NOTEFACE
		;
		init = init == null ? false : init;
		time = time == null ? this.player.noteSeekTime : time;
		if(init){
			this.word.print('TIME', cellhto(cm.x), cellhto(cm.y), c1, c2);
			this.word.print(' sec', cellhto(cm.x), cellhto(cm.y + 3), c1, c2);
		}
		
		time = (time / 1000) | 0;
		if(time == this.scrollTime && !init){
			return;
		}
		this.scrollTime = time;
		this.word.setScroll(scrollByName('bg1'));
		this.word.print(str_pad(time, 4, '0', 'STR_PAD_LEFT'), cellhto(cm.x), cellhto(cm.y + 2), c1, c2);
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
	
	drawChannelTab_on: function(ch, toggle)
	{
		var i
			, scr = scrollByName('bg1')
			, chOnId = 144, chOffId = 160, chOffset = 1
			, tabsprite, cm = {x: 6, y: 14}
			, x, y
		;
		chId = toggle == null || toggle ? chOnId : chOffId;
		if(ch == null){
			ch = [0, 1, 2, 3, 4, 5, 6, 7];
			//背景
			for(i = 0; i < this.topFrameCenter.lenth; i++){
				tabsprite = makeSprite(this.uiImageName, this.topFrameCenter[i]);
				scr.drawSpriteChunk(tabsprite, cellhto(cm.x + (i * 2)), cellhto(cm.y));
			}
			for(i = 0; i < ch.length; i++){
				tabsprite = makeSprite(this.uiImageName, chId + ch[i]);
				scr.drawSpriteChunk(tabsprite, cellhto(cm.x + ((ch[i] + chOffset) * 2)), cellhto(cm.y));
			}
		}
		else{
			x = cellhto(cm.x + ((ch + chOffset) * 2));
			y = cellhto(cm.y);
			tabsprite = makeSprite(this.uiImageName, this.topFrameCenter[ch + chOffset]);
			scr.drawSpriteChunk(tabsprite, x, y);
			tabsprite = makeSprite(this.uiImageName, ch + chId);
			scr.drawSpriteChunk(tabsprite, x, y);
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
			this.drawNoteRaster(sparam.ch, sparam.type, sparam.x - scrpos, sparam.y, sparam.rot, sparam.bottom, sparam.catchMode, sparam.time);
		}
	},
	
	scrollManual: function()
	{
		var params = this.manualScrollParams
			, d = params.dulation
			, c = params.count
			;
		params.bg1.x = 0;
		params.bg2.x = 0;
		params.bg1.y = 0;
		params.bg2.y = 0;
		if(params.dir == 'up'){
			params.bg1.y = -c * (DISPLAY_HEIGHT / d);
			params.bg2.y = -c * (DISPLAY_HEIGHT / d) + DISPLAY_HEIGHT;
		}else if(params.dir == 'down'){
			params.bg1.y = c * (DISPLAY_HEIGHT / d);
			params.bg2.y = c * (DISPLAY_HEIGHT / d) - DISPLAY_HEIGHT;
		}else if(params.dir == 'right'){
			params.bg1.x = -c * (DISPLAY_WIDTH / d);
			params.bg2.x = -c * (DISPLAY_WIDTH / d) + DISPLAY_WIDTH;
		}else if(params.dir == 'left'){
			params.bg1.x = c * (DISPLAY_WIDTH / d);
			params.bg2.x = (c * (DISPLAY_WIDTH / d)) - DISPLAY_WIDTH;
		}
		if(params.dir != null && params.count++ >= d){
			if(params.dir == 'left'){
				this.changeEditMode(params.changeMode);
				params.changeMode = null;
				this.openFrame();
			}else{
				scrollByName('bg2').drawto(scrollByName('bg1'));
			}
			params.count = 0;
			params.dir = null;
		}
		// console.log(params.pos.x);
	},
	
	repeatDrawMenu : function()
	{
		//channel note file play
		switch(this.editMode){
			case 'tune': this.player.isPlay() ? this.drawOutputWave() : this.drawChannelWave(); this.drawParamCursorBlink(); break;
			case 'note': ; break;
			case 'play': this.drawOutputWave(); break;
			case 'catch': ; break;
			case 'file': if(this.getLastCommand() == 'TITLE'){this.drawTitleCursor();} break;
			case 'manual': this.scrollManual(); return;
			default: break;
		}
		this.drawSeek();
		this.drawScrollTime();
		this.blinkDraw();
		this.drawOnkey();

		// this.drawNoteScroll(null, true);
		this.drawNotesCount++;
	},
	drawMenu: function(mode)
	{
		mode = mode == null ? this.editMode : mode;
		this.clearMenu();
		//channel note file play
		// this.drawMenuCommon(mode);
		switch(mode){
			case 'tune': this.drawOscillo(); break;
			case 'note': this.drawNoteMenu(); this.drawNoteCursor(); break; //this.drawNoteScroll(); 
			case 'play': this.drawOscillo(); break;
			case 'catch': this.drawCatchMenu(); this.drawMenuListCursor(this.getActiveModeMenuList(), this.getActiveModeCursor().y); break;
			case 'eventset': this.drawEventsetMenu(); this.drawMenuListCursor(this.eventsetMenuList, this.eventsetMenuCursor.y); break;
			case 'file': 
				this.drawFileMenu();
				if(this.getLastCommand() != 'TITLE'){
					this.drawMenuListCursor(this.getActiveModeMenuList(), this.getActiveModeCursor().y);
				} break;
			case 'manual': return;
			case 'error': break;
			
		}
		this.drawMenuCommon(mode);
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
		this.analyseRate = 8;
		var chOscWidth = 64
			, chOscHeight = cellhto(6) - 2
			, chOscHeight_h = (chOscHeight / 2) | 0
			, data
			, size = (PROCESS_BUFFER_SIZE / this.analyseRate) | 0
			, cm = this.ocsWaveCmargin
			, px, py, i, dindex, ofsx = 0, ofsy = 128, pre_y
			, from, to
			, spr = scrollByName('sprite')
			, sprite = this.waveSprite
			;
			
			// if(this.litroSound.channel[0].envelopeClock > 0){
				// return;
			// }

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
			px = i + cellhto(cm.x) + ofsx;
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
		var channel = ch == null ? this.litroSound.channel[this.editChannel()] : [ch]
			, data, c, i, dindex, istep
			, layerScale
			, px, py, vol = 0, stPos = 0, swp = null
			, pre_y
			, from, to
			, spr = scrollByName('sprite')
			, sprite = makePoint(this.uiImageName, 1)
			, sprite2 = makePoint(this.uiImageName, 1)
			, chOscWidth = 64
			, chOscHeight = cellhto(6) - 2
			, chOscHeight_h = (chOscHeight / 2) | 0
			, cm = this.ocsWaveCmargin
			;
		;
		
		if(this.editMode == "file"){
			return;
		}
			
		//デバッグ
		if(this.keyControll.getState('ext')){
			if(channel.envelopeEnd == true){
			//クリック音防止余韻
				vol = channel.absorbVolume * Math.exp(-0.000001 * channel.absorbCount);
				// console.log(vol);
			}else if(channel.absorbNegCount < channel.absorbCount){
				// vol = channel.absorbVolume - (channel.absorbVolume * Math.exp(-0.0001 * channel.absorbNegCount));
				vol = -channel.absorbVolume * Math.exp(-0.000001 * channel.absorbNegCount);
			}
			stPos = channel.absorbVolume;
			sprite2.swapColor(COLOR_ARRAY[0], COLOR_LINE);
		// console.log(stPos);
		}
		

		data = channel.data;
		istep = data.length / chOscWidth;
		 sprite.swapColor(COLOR_LINE, COLOR_ARRAY[0]);
		
		for(i = 0; i < chOscWidth; i++){
			dindex = (i * istep) | 0;
			px = i + cellhto(cm.x);
			py = (-(data[dindex] + vol) * chOscHeight) | 0;
			if(py > chOscHeight_h){continue;}
			if(py < -chOscHeight_h){continue;}
			py += chOscHeight_h + cellhto(cm.y);

			from = {x: px, y: py};
			to = {x: px, y: pre_y == null ? py : pre_y};
			if(stPos == data[dindex]){
				spr.spriteLine(from, to, sprite2);
			}else{
				spr.spriteLine(from, to, sprite);
			}
			
			pre_y = py;
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
			, chr, phase
			, keyIndex
			;
			
		for(i = 0; i < this.status_on.length; i++){
			chr = this.status_on[i];
			phase = this.litroSound.getPhase(i, false);
			if(chr == null && (phase == 'r' || phase == '')){
				continue;
			}
			chr = chr == null ? this.key2Char(this.litroSound.getNoteKey(i)) : chr;
			if(chr == null){continue;}
			
			if(this.isBlackKey(chr)){
				keyIndex = this.indexAtBlack(chr);
				sprite = this.blackKeysSprite[spritekeys[chr]];
				scr.drawSpriteChunk(sprite, cellhto(cm_b.x + ((this.BLACK_KEY_SKIP[chr] + keyIndex) * 2)), cellhto(cm_b.y));
			}else{
				keyIndex = this.indexAtWhite(chr);
				sprite = this.whiteKeysSprite[spritekeys[chr]];
				scr.drawSpriteChunk(sprite, cellhto(cm_w.x + (keyIndex * 2)), cellhto(cm_w.y));
			}
		}
	},
	
	openSNSTab: function()
	{
		var crect = {x:cellhto(0), y:cellhto(23), w: cellhto(40), h: cellhto(15)}
			, r = makeRect(crect.x, crect.y, crect.w, crect.h)
			, bg = scrollByName('bg1')
			, view = scrollByName('view')
			, spr = makeSprite(this.snsImageName, 0)
			, self = this
			, iconCrect = {x: 18, y: 26, w:2, h: 2} //this.snsIconCmargin
		;
		view.y = cellhto(6);
		bg.clear(COLOR_BLACK, r);
		bg.drawSprite(spr, cellhto(iconCrect.x), cellhto(iconCrect.y));
		this.word.setScroll(bg);
		this.word.print('Click SNS Icon for Login', crect.x + cellhto(1), crect.y + cellhto(1), COLOR_WHITE, COLOR_BLACK);
		this.appendClickableItem(makeRect(cellhto(iconCrect.x), cellhto(iconCrect.y), cellhto(iconCrect.w), cellhto(iconCrect.h)), function(item){
			self.openLoginWindow(item.name);
		}, 'TWITTER');
		
		window.document.getElementById('screen').onclick = function(e){
			var bounds = this.getBoundingClientRect(), w = view.canvas.width, h = view.canvas.height
				, x = ((((e.clientX - bounds.left) / VIEWMULTI) | 0) - view.x + w) % w
				, y = ((((e.clientY - bounds.top) / VIEWMULTI) | 0) - view.y + h) % h
			;
			self.clickEvent(x, y);
		};
	},
	
	closeSNSTab: function()
	{
		var view = scrollByName('view')
		;
		view.y = 0;
		this.openFrame();
		this.clearClickableItem();
		window.document.getElementById('screen').onclick = null;
	},
	
	openLoginWindow: function(type)
	{
		// var e = document.getElementById('login') == null ? document.createElement('iframe') : document.getElementById('login');
		var e = document.getElementById('login') == null ? document.createElement('button') : document.getElementById('login');
		function attr(e, key, value){
			e.setAttribute(key, value);
		};
		e.onclick = function(){
			alert(type);
		};
		// console.log(type);
		window.open(this.loginURLs[type], null,"width=640,height=480,scrollbars=yes");

	},
	

	closeManual: function()
	{
		var i, params = this.manualScrollParams
			// // , ltkb = litroKeyboardInstance
			, spr = scrollByName('sprite')
			, bg1 = scrollByName('bg1')
			, bg2 = scrollByName('bg2')
			, view = scrollByName('view')
			, scr = scrollByName('screen')
		;
		params.count = 0;
		bg2.drawto(view);
		this.openFrame();
		this.drawMenu(params.changeMode);
		bg1.drawto(bg2);
		view.drawto(bg1);

		// this.manualPage = 0;
		params.dir = 'left';
	},
	
	openManual: function(page)
	{
		var self = this, pre, prePage = this.manualPage
			, img, i
			, params = this.manualScrollParams
		;
		page = page == null ? this.manualPage : page;
		if(page === ''){page = this.manualImage.length - 1;}
		if(typeof page == 'string'){
			for(i = 0; i < this.manualChapters.length; i++){
				if(this.manualChapters[i].name == page){
					page = this.manualChapters[i].index;
					break;
				}
			}
		}
		
		if(this.manualImage.length <= page){return;}
		img = this.manualImage[page];
		if(self.editMode != 'manual'){
			setImageLoadRefreshTime(Date.now());
		}

		// this.keyControll.allReset();
		this.manualPage = page;
		this.loadManualImage(img.name, function(){
			params.count = 0;
			scrollByName('view').drawto(scrollByName('bg1'));
			scrollByName('bg2').clear(COLOR_BLACK);
			var sprite = makeSprite(img.name, 0);
			scrollByName('bg2').drawSprite(sprite, ((DISPLAY_WIDTH - sprite.w) * 0.5) | 0, ((DISPLAY_HEIGHT - sprite.h) * 0.5) | 0);
			if(page == prePage || self.editMode != 'manual'){
				params.dir = 'right';
			}else if(page < prePage){
				params.dir = 'down';
			}else if(page > prePage){
				params.dir = 'up';
			}
			if(self.editMode != 'manual'){
				params.changeMode = self.editMode;
				self.changeEditMode('manual');
			}
		});
	},
	
	loadManualImage: function(name, func)
	{
		func = func == null ? function(){return;} : func;
		var pre;
		setLoadImageDir(this.manualDir);
		pre = preLoadImage(name, null, null, func);
		setLoadImageDir(pre);
	}
	
};

function printDebug(val, row){
		// if(litroKeyboardInstance == null){return;}
		if(!imageResource.isload()){return;}
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
	if(ltkb.editMode != 'manual'){
		ltkb.drawOctaveButton();
		bg2.rasterto(view, 0, 0, null, DISPLAY_HEIGHT / 2, ltkb.bg2x.t + cellhto(ltkb.noteScrollCmargin.x), 0);
		bg2.rasterto(view, 0, DISPLAY_HEIGHT / 2, null, DISPLAY_HEIGHT / 2, ltkb.bg2x.b + cellhto(ltkb.noteScrollCmargin.x), 0);
		bg1.drawto(view);
	}else{
		bg2.rasterto(view, 0, 0, null, null, ltkb.manualScrollParams.bg2.x, ltkb.manualScrollParams.bg2.y);
		bg1.rasterto(view, 0, 0, null, null, ltkb.manualScrollParams.bg1.x, ltkb.manualScrollParams.bg1.y);
	}
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


