/**
 * Litro Keyboard Interface
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 * ver 0.12.00
 */

//環境判定
var IS_PRODUCTION = window.location.href.indexOf('ltkb.bitchunk.') >= 0;
var IS_DEVELOPMENT = window.location.href.indexOf('ham78.orz.hm') >= 0;
var IS_LOCAL = window.location.href.indexOf('localhost') >= 0;

var PRODUCTION = 0;
var DEVELOPMENT = 1;
var LOCAL = 2;
var HOST_ID =
	 (IS_PRODUCTION ? PRODUCTION : 0)
	+ (IS_DEVELOPMENT ? DEVELOPMENT : 0)
	+ (IS_LOCAL ? LOCAL : 0)
;

var RECEIVER_URL = {};
RECEIVER_URL[PRODUCTION] = '//ltsnd.bitchunk.net/receiver';
RECEIVER_URL[DEVELOPMENT] = 'http://ham78.orz.hm';
RECEIVER_URL[LOCAL] = 'http://localhost:58105';

var PaformTime = 0; //時間計測
var litroKeyboardInstance = null;
var VIEWMULTI = 2;
var DISPLAY_WIDTH = 320;
var DISPLAY_HEIGHT = 240;
// var CHIPCELL_SIZE = 16;
var CHIPCELL_SIZE = 8;
var layerScroll = null;
var COLOR_STEP = [184, 248, 216, 255];
var COLOR_TIME = [248, 216, 120, 255];

var COLOR_NOTEFACE = [184, 248, 184, 255];
var COLOR_NOTEPRINT = [0, 168, 0, 255];
var COLOR_PARAMKEY = [188, 188, 188, 255];
var COLOR_DISABLE = [120, 120, 120, 255];
var COLOR_LINE = [88, 216, 84, 255];
var COLOR_ARRAY = [[248, 120, 88, 255], [252, 168, 68, 255], [248, 184, 0, 255], [88, 216, 84, 255], [60, 188, 252, 255], [152, 120, 248, 255], [248, 120, 248, 255], [248, 88, 152, 255], ];

var USER_ID = 1;

var CW = cellhto(1);

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
	
	this.paramKeys = ['TYPE', 'VOLUME', 'ATTACK', 'HOLD', 'DECAY', 'SUSTAIN', 'LENGTH', 'RELEASE' , 'V-SPD', 'V-DPT', 'V-RISE', 'V-PHA', 'SWEEP', 'DELAY', 'DETUNE', 'TYP-A', 'TYP-H',  'TYP-D', ];
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
		'HOLD': 'hold',
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
		'TYP-H': 'waveTypeHold',
		'TYP-D': 'waveTypeDecay',
		'EVENT': 'event',
		'NOTE': 'note',
	};
	
	this.ltSoundCommonParamskeys = {	
		'NOTEOFF': 'noteoff',
		'NOTE-EX': 'noteextend',
		'S-NOTES': 'sweepnotes',
		'M-NOTES': 'meeknotes',
		'RESTART': 'restart',
		'RETURN': 'return',
	};
	
	this.keyCkeys = {};
	
	this.corsolKeys = ['up', 'down', 'left', 'right'];
	this.baseKeys = ['<', '>', 'select', 'space'];
	this.zoomKeys = ['[', ']'];

	this.baseKeysDrawName ={
		'<' : ',',
		'>' : '.',
		'select' : 'Tab',
		'space' : 'Space',
		'[' : 'C',
		']' : 'コ',
		'+' : '+', '^' : '+',
		'-' : '-',
		'ext' : 'Shift',
	};
	this.controllDispNameStr = 'Tab C$n+-  コ$n,.   $nShift$nSpace';
	this.controllDispWordPos = {};
	
	this.paramCursor = {x: 0, y: 0};
	this.paramCursorCurrent = {x: 0, y: 0};
	this.paramCursorBlinkFlag = false; //paramカーソルの点滅

	this.editMode = 'note';
	this.prevEditMode = 'tune';
	this.hiddenScreen = false;
	// this.modeNames = ['tune', 'note', 'file', 'play'];
	// this.modeNames = {0:'tune', 1:'note', 2:'play', 3:'catch'};
	this.modeNames = ['tune', 'note', 'undo', 'play', 'catch', 'file', 'title', 'error'];
	
	//UNDO Mode
	this.editHistory = [];
	this.EDITHISTORY_MAXNUM = 16;
	this.tmpEventsetData = [];
	this.isModified = [];
	
	this.frameChunks = []; //背景フレーム用ChunkRepeat
	this.frameSprites = {}; //背景フレーム用spriteChunk
	this.frameChunksKeys = {}; //framechunksのkeyインデックス重複はArray
	this.iconSprites = {};
	
	this.catchNotes = {}; //キャッチ操作
	this.selectNote = {}; //選択中
	this.selectNoteHistory = []; //選択履歴
	this.catchType = 'note';
	this.catchNoteBlinkCycle = 0;
	this.blinkDrawParams = []; //点滅スプライト保持
	this.blinkDrawEventset = []; //点滅スプライト保持
	this.catchEventset = {}; // tune{param0:x param1:x}
	
	// this.scrollCallbackStack = [];//manualスクロールコールバック
	this.drawStackCallback = null;//その他描画完了時コールバック
	
	this.viewModeImageOnLoad = function(){return;};
	this.firstDraw = null;

	this.debgCell = false;
	this.debugCellPos = {x: 0, y :0};
	this.cellCursorSprite = 88; //font8
	this.noteSprite = [];
	this.rnoteSprite = [];
	this.eventsetSprite = [];
	
	this.eventSprite = {
		// restart: {id: 208, ofx: -CW, swap: false},
		// 'return': {id: 209, ofx: CW, swap: false},
		// noteoff: {id: 210, ofx: 0, swap: true},
		// noteextend: {id: 211, ofx: 0, swap: true},
		// tmpstart: {id: 212, ofx: -CW, swap: false},
		// tmpend: {id: 213, ofx: CW, swap: false},
		// sweepnotes: {id: 214, ofx: -CW, swap: true},
		// meeknotes: {id: 215, ofx: CW, swap: true},
	};
	
	this.noteScrollCmargin = {x: 3, y: 3};
	this.noteCmargin = {x: 0, y: 11.5};
	// this.noteCmargin = {x: 3, y: 11.5};
	this.noteScrollPos = {x: 0, y: 0};
	this.noteScrollPage = 0;
	this.scrollTime = -1;
	this.scrollTime_m = -1;
	
	this.NOTE_RANGE_SCALE_DEFAULT = 8000;
	this.noteRangeScale = this.NOTE_RANGE_SCALE_DEFAULT; // msec per page
	this.noteRange = 1; // position multiple
	this.noteRangeCells = 40; // 8px * 32cells
	this.NOTE_RANGE_SCALE_MIN = 40;
	this.NOTE_RANGE_SCALE_MAX = this.noteRangeCells * this.noteRangeScale;
	
	this.seekLineCount= 0; //note をセットする位置アニメ
	this.drawNotesCount = 0;
	
	this.envelopeBeamClock = 0;
	this.beemsCurrentNote = makeLitroElement();
	
	this.tempPlaySeekTime = -1;

	this.titleSprites = {title: 49, user: 50, vol: 51, thumb_1: 65, thumb_2: 66, gauge: 67}; //タイトルアイコン
	this.titleCmargin = {x: 2, y: 17};
	this.titleVolCmargin = {x: 21, y: 21};
	this.VOLUME_INC = VOLUME_CELLSIZE; //0.01;
	this.VOLUME_MAX = this.VOLUME_INC * 80; //0.80
	this.VOLUME_MIN = 0.0;

	this.seekSprite = 242; //ノートカーソル
	this.seekWaitSprite = 243; //ノート待ちカーソル
	this.arrowSprite = 240; //左右カーソル
	this.seekBarSprite = 241; //ノートカーソル線
	this.seekCmargin = {x: 2, y: 0};

	this.menuDispCmargin = {x: 24, y: 17};
	this.ocsWaveCmargin = {x: 26, y: 17};
	this.menuCsize = {w: 12, h: 6};
	this.menuCindent = 1;
	this.modeSubCmargin = {x:34, y:17};

//TODO getMenuList(name)に統一してみる
	this.menus = {
		catch_select: ['KEEP'],
		catch_keep: ['PASTE', 'REMOVE'],
		note: ['CATCH', 'EVENTSET', 'UNDO', 'FILE', 'MANUAL'],
		file: ['LOAD', 'SAVE', 'SHARE', 'TITLE', 'LOGIN'],
		file_login: ['LOAD', 'SAVE', 'SHARE', 'PACK', 'TITLE', 'LOGOUT'],
		file_type: ['COOKIE', 'SERVER'],
		file_sns: ['SELECT SNS'], //GOOGLE+
		file_list: ['FILESELECT'],
		title: ['', '', '', 'CANCEL', 'FINISH'],
		pack_list: ['PACKFILES', 'SHIP', 'CANCEL'],
		share: ['SHAREFILE'],
		eventset: ['NOTEOFF', 'NOTE-EX', 'S-NOTES', 'M-NOTES', 'RESTART', 'RETURN', ],
		undo: ["NO", "OK"],
		confirm: ["NO", "OK"],
	};
	this.catchMenuList = ['KEEP'];
	this.catchKeepMenuList = ['PASTE', 'REMOVE'];
	this.catchMenuCursor = {x: 0, y:0};
	// this.noteMenuList = ['EVENTSET', 'CATCH', 'FILE', 'MANUAL'];
	this.noteMenuList = ['CATCH', 'UNDO', 'EVENTSET', 'FILE', 'MANUAL'];
	this.noteMenuCursor = {x:0, y:0};
	
	//TODO IMPORT(SERVER COOKIE) EXPORT(SERVER SHARE PACK SHORT MYTUNE) 
	//TODO 'IMPORT, 'EXPORT', '', 'PRIVATE?', 'TITLE', 'LOGOUT' 
	this.fileMenuList = ['LOAD', 'SAVE', 'SHARE', 'TITLE', 'LOGIN'];
	// this.fileMenuList_login = ['LOAD', 'SAVE', 'TITLE', 'LOGOUT'];
	this.fileMenuList_login = ['LOAD', 'SAVE', 'SHARE', 'PACK', 'TITLE', 'LOGOUT'];
	this.fileTypeList = ['COOKIE', 'SERVER'];
	
	// this.fileLoginList = ['TWITTER']; //GOOGLE+
	this.fileLoginList = ['SELECT SNS']; //GOOGLE+
	
	this.clearMenuList = ['FILE', 'CURRENT'];
	this.fileListList = ['FILESELECT'];
	this.fileTitleList = ['', '', '', 'CANCEL', 'FINISH'];
	this.titleMenuList = ['', '', '', 'CANCEL', 'FINISH'];
	
	// this.packListMenuList = ['PACKSELECT'];
	this.packMenuList = ['PACKFILES', 'SHIP', 'CANCEL'];
	this.shareMenuList = ['SHAREFILE'];
	// this.eventsetMenuList = ['SET'];
	this.eventsetMenuList = ['NOTEOFF', 'NOTE-EX', 'S-NOTES', 'M-NOTES', 'RESTART', 'RETURN', ];
	this.finalConf = ["NO", "OK"];
	this.loginParams = {user_id: 0, sns_type: null, user_name: null};
	
	if(window.location.href.indexOf('.bitchunk.') >= 0){
		this.loginURLs = {'TWITTER' : '//ltsnd.bitchunk.net/oauth/twitter/'};
	}else if(window.location.href.indexOf('localhost') >= 0){
		this.loginURLs = {'TWITTER' : '//localhost:58104/oauth/twitter/'};
	}else{
		this.loginURLs = {'TWITTER' : 'http://bitchunk.fam.cx/litrosound/oauth/twitter/'};
	}
	this.shareURLs = {'TWITTER': 'https://twitter.com/intent/tweet?'};
	
	
	this.allowHosts = ['bitchunk.fam.cx', 'ltsnd.bitchunk.com', 'ltsnd.bitchunk.net', 'localhost'];
	this.snsIconId = {twitter : 0, 'google+': 1};
	// this.serverFileList = {};
	this.fileMenuMap = {};
	this.commandPath = [];
	
	//TODO カーソルオブジェクトに変更する？
	this.fileMenuCursor = {x:0, y:0};
	this.fileListCursor = {x:0, y:0};
	this.fileListPage = 1; //Not 0value
	// this.fileListLoaded = [];
	this.fileListLoadLimit = 60;
	this.fileListOffset = 0;

	this.packMenuCursor = {x: 0, y:0};
	this.packListCursor = {x: 0, y:0};
	this.packMaxSize = 16;
	this.packedFiles = [];
	// this.packRCursor = {x: 0, y:0};
	
	this.eventsetMenuCursor = {x:0, y:0};
	this.undoMenuCursor = {x:0, y:0};
	
 	this.modeRect = {tune: [8, 9, 2, 2], note: [10, 9, 2, 2], file: [12, 9, 2, 2], play: [14, 9, 2, 2]
 		, 'catch': [8, 11, 2, 2], eventset: [10, 11, 2, 2], loading: [12, 11, 2, 2], error: [14, 11, 2, 2]
 		, manual: [12, 11, 2, 2], pack: [8, 13, 2, 2],  share: [10, 13, 2, 2]};
	this.modeCmargin = {x: 32, y: 19};
	this.word = null;
	this.word8 = null;
	this.word4 = null;
	
	// this.playSound = false;
	this.bg2x = {t: 0, b: 0};
	
	this.chOscCWidth = 8;
	this.chOscCHeight = 6;
	this.analyseRate = 4; // perFrame
	this.analyseReresh = 16; // perFrame
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
	this.titleCharCursor = {x: 0, y:0};
	this.titleMenuCursor = {x: 0, y:0};

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
	
	this.viewMode =null;
			
	return;
}

LitroKeyboard.prototype = {
	init : function() {
		var self = this;
		this.litroSound = new LitroSound();
		litroKeyboardInstance = this;
		
		//効果音用
		this.sePlayer = new LitroPlayer();
		
		this.keyControll = new KeyControll('cont1');
		this.player = new LitroPlayer();
		//

		this.litroSound.init(CHANNELS_NUM);
		this.sePlayer.init("se");
		this.player.init("edit");
		this.player.tmpEnable = true;
		this.pushEditHistory(Object.keys(this.player.eventsetData));

		
		this.player.setRestartEvent(function(){
			var seekPage = self.getNoteSeekPage();
			if(seekPage > 0){
				self.drawEventsetBatch(seekPage - 1);
			}else{
				self.drawEventsetBatch(0);
			}
		});
		
		//基本キー
		this.initKeys();
		this.initKeyCkeys();

		//ファイルメニュー設定
		this.fileMenuMap = {
			// LOAD: this.fileTypeList,
			// SAVE: this.fileTypeList,
			LOAD: this.fileListList,
			SAVE: this.fileListList,
			COOKIE: this.finalConf,
			FILESELECT: this.finalConf,
			//in fileTypeList
			SERVER: this.fileListList, 
			TITLE: this.fileTitleList,
			LOGIN: this.fileLoginList,
			FILE: this.fileMenuList,
			FINISH: this.fileMenuList,
		};


		this.loadImages();
		this.initFingerState(this.fingers);
		this.initCanvas();
		this.initViewMode();
		this.setBg2Position(this.noteScrollPos.x);
		this.initCatchEvent();
		this.initEventFunc();
		this.initManual();
		this.autoLogin();
		this.initControllDisp();
		this.initSoundEffect();
		
	},
	
	initKeys: function(){
		var code, row, chars, i
		, whiteCount = 0
		, blackCount = 0
		, codeNameCount = 0
		, repkeys_ff = this.KEY_REPLACE_FIREFOX;
		
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
	},
	
	initViewMode: function(){
		var href = window.location.href
			, sound_id = href.match(/[?|&]+sound_id\=([0-9]+)/)
			, step = href.match(/[?|&]+step\=([0-9]+)/)
			, multi = href.match(/[?|&]+screen\=([0-9]+)/)
			, buff = href.match(/[?|&]+buff\=([0-9a-zA-Z]+)/)
			, debug = href.match(/[?|&]+debug\=([0-9]+)/)
			, self = this;
		
		if(buff != null){
			PROCESS_BUFFER_SIZE = parseInt(buff[1], 10) == null ? 4096 : buff[1] | 0;
			if(this.litroSound.context != null){
				console.log('Process Buffer: ' + PROCESS_BUFFER_SIZE);
				this.litroSound.connectOff();
				this.litroSound.createContext();
				this.litroSound.connectModules(PROCESS_BUFFER_SIZE);
			}
			this.analysedData = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
			this.analysedData_b = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
		}
		if(step != null){
			this.noteRangeScale = (step[1] | 0) * this.noteRangeCells;
		}
		if(multi != null){
			if(multi[1] == 0){
				this.hiddenScreen = true;
				multi[1] = 1;
			}
			VIEWMULTI = multi[1] | 0;
			// console.log(VIEWMULTI);
		}
		if(sound_id != null){
			this.viewMode = 'full';
			this.editMode = 'play';
			this.player.loadFromServer(this.loginParams.user_id, sound_id[1], 
			function(data){
					if(data == null || data === false){
						self.setError(data != null ? data : {error_code: 0, message: 'error'});
						return;
					}
					// self.player.setPlayData(data); //playerにお任せ
					self.firstDraw = function(){
						self.selectMenuItem();//drawNoteのため
						self.drawParamKeys();
						self.drawChannelParams();
						self.drawParamCursor();
						self.drawPlayOnSpacekey();
					};
					return;
				},
				function(data){
					self.setError(data != null ? data : {error_code: 0, message: 'error'});
				});
		}
		if(debug != null){
			this.debugCell = true;
			window.document.getElementById('screen').addEventListener('mousemove', function(e){
					var bounds = this.getBoundingClientRect()
						;
					self.debugCellPos.x = (((e.clientX - bounds.left) / VIEWMULTI) / cellhto(1)) | 0;
					self.debugCellPos.y = (((e.clientY - bounds.top) / VIEWMULTI) / cellhto(1)) | 0;
			}, false);
			
		}
		return;
	},
	
	initKeyCkeys: function(){
		this.keyCkeys.row = Object.keys(this.ROW_CHARS);
		this.keyCkeys.octave = Object.keys(this.OCTAVE_KEYCODE);
		// this.keysCkeys.corsol = this.corsolKeys;
	},
	
	initSoundEffect: function(){
		var se = this.sePlayer
			, self = this
			, func = function(pack){
				// console.log(self.sePlayer, pack, self.sePlayer.name);
			}
			, errorFunc = function(){return;}
		;
		se.playOnce = true;
		//[15,16,17]
		// se.loadSoundPackage('15,16,17', func, errorFunc);
		se.loadSystemSound('litrokeyboard', func, errorFunc);
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
			, 'keys_012'
			, 'keys_013'
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
		this.player.setSetChannelEvent(function(ch, key, value){
			var eventset = {};
			eventset[key] = self.makeEventset(key, value, 0);
			self.drawChannelParams(null, null, null, null, eventset, ch);
		});
		this.player.setOnNoteKeyEvent(function(ch, key){
		// this.sePlayer.setOnNoteKeyEvent(function(ch, key){
			if(ch == self.editChannel()){
				self.status_on[0] = self.key2Char(key);
				self.refreshCurrentNote();
			}
			
			return;
		});
		this.player.setOffNoteKeyEvent(function(ch, chr){
			var fnum = self.searchState(self.key2Char(chr));
			// console.log(fnum, self.status_on, chr, self.key2Char(chr));
			if(fnum >= 0){
				self.status_on[fnum] = null;
			}
			return;
		});
		
		// this.player.setReferChannelFunc(function(){
		// this.sePlayer.setReferChannelFunc(function(){
			
			// return self.referChannel;
		// });
	},
	
	initWords: function()
	{
		var word, word8;//, WordPrint = wordPrint;
		word = new WordPrint();
		word.init('8px');
		word.setFontSize('8px');
		word.rowSpace = 0;
		this.word = word;
		
		word8 = new WordPrint();
		word8.init('8px');
		word8.setFontSize('8px');
		word8.rowSpace = 0;
		this.word8 = word8;
		
		word.init('4v6px');
		word.setFontSize('4v6px');
		word.rowSpace = 0;
		this.word4 = word;
		


	},
	
	initCanvas: function()
	{
		makeScroll('screen', true);
		makeScroll('view', false);
		makeScroll('bg1', false);
		makeScroll('bg2', false);
		makeScroll('bg3', false);
		makeScroll('sprite', false);
		// makeScroll('tmp', false); 未使用
		
		var bg1 = scrollByName('bg1')
			, bg2 = scrollByName('bg2')
			, bg3 = scrollByName('bg3')
			, spr = scrollByName('sprite')
			, view = scrollByName('view')
			, scr = scrollByName('screen')
			;
		scr.clear(COLOR_BLACK);
		view.clear(COLOR_BLACK);
		bg1.clear(COLOR_BLACK);
		bg2.clear();
		bg3.clear();
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
		// this.waveSprite = makePoint(this.uiImageName, 1);
		for(i = 0; i < this.whiteKeysSprite.length; i++){
			this.whiteKeysSprite[i] = makeSpriteChunk(this.uiImageName, makeRect(this.whiteKeysSprite[i]));
		}
		this.blackKeysSprite[0] = makeSpriteChunk(this.uiImageName, makeRect(this.blackKeysSprite[0]));
		
		// this.word.setFontSize('8px');
		this.cellCursorSprite = makeSprite(this.word8.imageName, this.cellCursorSprite);

	},
	
	initFrameSprites: function()
	{
		var img = this.uiImageName, self = this 
			, msc = function(rect){return makeSpriteChunk(img, makeRect(rect));}
			, msq = function(query){return makeSpriteQuery(img, query);}
			, mccf = function(chunk, x, y){
				var p = {sprites: chunk, cx: x, cy: y};
				self.frameChunks.push(p);
				return p;
			}
			, mcc = function(name, rr){
				var keys = self.frameChunksKeys;
				keys[name] = keys[name] == null ? []: keys[name];
				keys[name].push(self.frameChunks.length);
				self.frameChunks.push(self.makeChipChunk(name, self.frameSprites[name], makeRect(rr)));
			}
			, fspr
			, swaps = []
			, ms = function(id){return makeSprite(img, id);}
			,bftop = 14
			,bdtop = 22
			, ic
		;
		
		this.iconSprites = {
			//Play mode
			title: ms(49),
			user: ms(50),
			vol: ms(51),
			thumb1: ms(65),
			thumb2: ms(66),
			gauge: ms(67),
			
			//font8：◯
			cellCursor: ms(88),
			note1:  ms(176),
			note2:  ms(177),
			note3:  ms(178),
			note4:  ms(179),
			note5:  ms(180),
			note6:  ms(181),
			note7:  ms(182),
			note8:  ms(183),

			rnote1:  ms(176),
			rnote2:  ms(177),
			rnote3:  ms(178),
			rnote4:  ms(179),
			rnote5:  ms(180),
			rnote6:  ms(181),
			rnote7:  ms(182),
			rnote8:  ms(183),
			
			tune1: ms(192),
			tune2: ms(193),
			tune3: ms(194),
			tune4: ms(195),
			tune5: ms(196),
			tune6: ms(197),
			tune7: ms(198),
			tune8: ms(199),
			
			tab1: ms(144),
			tab2: ms(145),
			tab3: ms(146),
			tab4: ms(147),
			tab5: ms(148),
			tab6: ms(149),
			tab7: ms(150),
			tab8: ms(151),
			
			ntab1: ms(160),
			ntab2: ms(161),
			ntab3: ms(162),
			ntab4: ms(163),
			ntab5: ms(164),
			ntab6: ms(165),
			ntab7: ms(166),
			ntab8: ms(167),
			
			bgtab1: ms(20),
			bgtab2: ms(19),
			bgtab3: ms(19),
			bgtab4: ms(19),
			bgtab5: ms(19),
			bgtab6: ms(19),
			bgtab7: ms(19),
			bgtab8: ms(20),
			
			restart: ms(208),
			'return': ms(209),
			noteoff: ms(210),
			noteextend: ms(211),
			tmpstart: ms(212),
			tmpend: ms(213),
			sweepnotes: ms(214),
			meeknotes: ms(215),
			
			//左右カーソル
			arrow: ms(240),
			arrow_l: ms(240),
			//ノートカーソル線
			seekBar: ms(241),
			//ノートカーソル
			seek1: ms(242),
			seek2: ms(243),
			seek3: ms(244),
			 //ノート待ちカーソル
			seekWait1: ms(245),
			seekWait2: ms(246),
			seekWait3: ms(247),
			
		 	mode_tune: msq('8+2:9+2'),  mode_note: msq('10+2:9+2')
		 	,  mode_file: msq('12+2:9+2'),  mode_play: msq('14+2:9+2')
 			, mode_catch: msq('8+2:11+2'),  mode_eventset: msq('10+2:11+2')
 			, mode_loading: msq('12+2:11+2'),  mode_error: msq('14+2:11+2')
	 		, mode_manual: msq('12+2:11+2'),  mode_pack: msq('8+2:13+2')
	 		, mode_share: msq('10+2:13+2'), mode_title: msq('12+2:13+2'), mode_undo: msq('14+2:13+2')
			
		};
		
		ic = this.iconSprites;
		this.noteSprite = [
			ic.note1, ic.note2, ic.note3, ic.note4, ic.note5, ic.note6, ic.note7, ic.note8 
		];
		this.rnoteSprite = [
			ic.rnote1, ic.rnote2, ic.rnote3, ic.rnote4, ic.rnote5, ic.rnote6, ic.rnote7, ic.rnote8 
		];
		this.rnoteSprite.forEach(function(s){
			s.rot(3);
		});
		
		this.eventSprite = {
			restart: {sprite: ic.restart, ofx: -CW, swap: false},
			'return': {sprite: ic['return'], ofx: CW, swap: false},
			noteoff: {sprite: ic.noteoff, ofx: 0, swap: true},
			noteextend: {sprite: ic.noteextend, ofx: 0, swap: true},
			tmpstart: {sprite: ic.tmpstart, ofx: -CW, swap: false},
			tmpend: {sprite: ic.tmpend, ofx: CW, swap: false},
			sweepnotes: {sprite: ic.sweepnotes, ofx: -CW, swap: true},
			meeknotes: {sprite: ic.meeknotes, ofx: CW, swap: true},
		};
		this.eventsetSprite = [
			ic.tune1, ic.tune2, ic.tune3, ic.tune4, ic.tune5, ic.tune6, ic.tune7, ic.tune8,
		];

		this.frameSprites = {
		//上半分左
			topRollLeft: mccf(msq('9+2:1+1'), 0, 0),
			topRollLeft2: mccf(msq('9+2:1+1'), 0, 1),

			leftDispMiddle: mccf(msq('(9+2:3+1)^2'), 0, 3),
			leftDispEdge: mccf(msq('9+2:2+1'), 0, 6),
			leftDispMiddle2: mccf(msq('(9+2:3+1)^3'), 0, 8),
			leftDispEdge2: mccf(msq('9+2:2+1'), 0, 13),
			
		//上半分
			noteRollLeft: mccf(msq('(14+2:0+1)^6'), 36, 2),
			eventRollRight: mccf(msq('14+2:2+1'), 36, 0),
			
		// //下半分
			leftFrame: mccf(msq('0+1:1+8'), 0, bftop),
			rightFrame: mccf(msq('7+2:1+5'), 36, bftop),
			baseKeyDisp: mccf(msq('7+2:6+3'), 36, 24),
			
			topFrameLeft: mccf(msq('1+2:1+2'), 2, bftop),
			topFrameRight: mccf(msq('5+2:1+2'), 32, bftop),
			
			topFrameCenter_2: mccf(msq('(4+1:1+2)*2'), 6, bftop),
			topFrameCenter_1: mccf(msq('(3+1:1+2)*6'), 10, bftop),
			topFrameCenter_2_2: mccf(msq('(4+1:1+2)*2'), 22, bftop),
			topFrameCenter_1_2: mccf(msq('3+1:1+2'), 26, bftop),
			topFrameCenter_2_3: mccf(msq('4+1:1+2'), 28, bftop),
			topFrameCenter_1_3: mccf(msq('3+1:1+2'), 30, bftop),
			
		 //鍵盤
			boardFrameLeft_1: mccf(msq('1+1:5+4'), 2, bdtop),
			boardFrameCenter_1: mccf(msq('2+1:5+4'), 4, bdtop),
			boardFrameRight_2: mccf(msq('6+1:5+4'), 6, bdtop),

			boardFrameLeft_2: mccf(msq('4+1:5+4'), 8, bdtop),
			boardFrameCenter_1b: mccf(msq('2+1:5+4'), 10, bdtop),
			boardFrameCenter_1c: mccf(msq('2+1:5+4'), 12, bdtop),
			boardFrameRight_1: mccf(msq('3+1:5+4'), 14, bdtop),
			
			boardFrameLeft_1b: mccf(msq('1+1:5+4'), 16, bdtop),
			boardFrameCenter_1d: mccf(msq('2+1:5+4'), 18, bdtop),
			boardFrameRight_1b: mccf(msq('3+1:5+4'), 20, bdtop),

			boardFrameLeft_2b: mccf(msq('4+1:5+4'), 22, bdtop),
			boardFrameCenter_2: mccf(msq('5+1:5+4'), 24, bdtop),
			boardFrameCenter_1e: mccf(msq('2+1:5+4'), 26, bdtop),
			boardFrameRight_1c: mccf(msq('3+1:5+4'), 28, bdtop),
			
			boardFrameLeft_1c: mccf(msq('1+1:5+4'), 30, bdtop),
			boardFrameCenter_1f: mccf(msq('2+1:5+4'), 32, bdtop),
			boardFrameRight_1d: mccf(msq('3+1:5+4'), 34, bdtop),
			
			
			octaveRoll: msq('14+2:1+1'),
			
			// '0:0 1:1')),
			
			//Not openframe
			ocsLineV: msq('5+1:4+1'),
			ocsLineH: msq('6+1:4+1'),
			
			//
			envelopeBeam1: ms(73),
			envelopeBeam2: ms(74),
			envelopeBeam_s: ms(75),
			
			//ScoreBoardMSQ
			scoreTune4: msq('27 29*3 (28 29*3)*4'),
			scoreBoard4: msq(
				'59 61*3 (60 61*3)*4!;'
				+'43 45*3 (44 45*3)*4!;'
				+'27 29*3 (28 29*3)*4!;'
				+ '59 61*3 (60 61*3)*4!;'
				+ '59 61*3 (60 61*3)*4!;'
				+ '11 13*3 (12 13*3)*4!;'
			),
			
			//ScoreBoard
			noteStart: ms(5),
			notePeriod: ms(6),
			noteLine: ms(7),
			noteSpaceStart: ms(8),
			noteSpacePeriod: ms(9),
			noteSpace: ms(10),
			eventSpaceStart: ms(13),
			eventSpacePeriod: ms(14),
			eventSpace: ms(15),
			
		};
		fspr = this.frameSprites;
		['scoreTune4', 'eventRollRight'].forEach(function(s, i){
			var spr = fspr[s].sprites == null ? fspr[s] : fspr[s].sprites;
			swapColorSpriteRecursive(spr, 'push'
				, [248, 216, 120, 255], [88, 248, 152, 255]);
			swapColorSpriteRecursive(spr, 'push'
				, [252, 224, 168, 255], [184, 248, 184, 255]);
			swapColorSpriteRecursive(spr, 'push'
				, [168, 16, 0, 255], [0, 168, 0, 255]);
			swapColorSpriteRecursive(spr, 'push'
				, [252, 160, 68, 255], [88, 216, 84, 255]);
			swapColorSpriteRecursive(spr, 'start');
			
			if(fspr[s].sprites == null){
				fspr[s] = spr;
			}else{
				fspr[s].sprites = spr;
			}
		});
		
	},
	
	initControllDisp: function(){
		var wordPos = {}
			, make = function(n, l, p){wordPos[n] = {line: l, pos: p};}
			;
		make('Tab', 0, 0); make('C', 0, 4);
		make('+', 1, 0); make('-', 1, 1); make('コ', 1, 4);
		make(',', 2, 0); make('.', 2, 1);
		make('Shift', 3, 0); make('Space', 4, 0);
		this.controllDispNameStr = 'Tab C$n+-  コ$n,.   $nShift$nSpace';
		this.controllDispWordPos = wordPos;
	},
	
	//リピートchipchunk(Array, Array)
	makeChipChunk: function(name, sprite, repeatRect)
	{
		return {name: name, sprite: sprite, rect: repeatRect};
	},
	
	initCatchEvent: function(defaultset)
	{
		var i, type;
		if(defaultset == null){
			for(i = 0; i < LitroWaveChannel.sortParam.length; i++){
				type = LitroWaveChannel.sortParam[i];
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
	
	presetWordFormat: function(name)
	{
		var word = this.word8, form;
		switch(name){
			case 'charboard': form = {size: '8px', scroll: scrollByName('bg1'), maxrows: 2, linecols: this.titleMaxLength, malign: 'vertical'}; break;
		}
		
		// word.setFontSize(form.size);
		word.setScroll(form.scroll);
		word.setMaxRows(form.maxrows);
		word.setLineCols(form.linecols);
		word.setMarkAlign(form.malign);
		
		return form;
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
		var self = this, resorce = loadImages([
			 [this.uiImageName, 16, 16],
			 [this.snsImageName, 16, 16],
			 ['font4v6p', 4, 6],
			 ['font8p', 8, 8]], function(){
			self.imageLoaded = true;
			self.initWords();
			self.initSprite();
			self.initFrameSprites();
			self.openFrame();
			self.drawScoreBoard(true);
			self.drawScoreBoard(false);
			requestAnimationFrame(main);
		});

	},
	
	isBlackKey: function(name){
		if(this.BLACK_KEY[name] == null){
			return false;
		}else{
			return true;
		}
	},
	
	isPackedFile: function(file){
		return this.packedFiles.some(function(pack, i){
				return pack.sound_id == file.sound_id;
		});
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
		if(key < 0){
			return -1;
		}
		while(this.octaveInKeys < key - 1){
			key = key - this.octaveInKeys;
			append++;
		}
		cheight = this.iWHITE_KEYS[this.CHARS_INDEX[key]] == null ? this.iBLACK_KEYS[this.CHARS_INDEX[key]] + this.BLACK_KEY_SKIP[this.CHARS_INDEX[key]]: this.iWHITE_KEYS[this.CHARS_INDEX[key]];
		return cheight + (append * this.octaveInWhiteKeys);
	},
	
	eventValue2Key: function(value)
	{
		var ids = LitroWaveChannel.tuneParamsIDKey();
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
					return (oct > OCTAVE_MAX) ? OCTAVE_MAX : oct;
				}else{
					oct = this.octaveLevel + 2;
					return (oct > OCTAVE_MAX) ? OCTAVE_MAX : oct;
				}
			}
		}
	},
	
	key2Char: function(key)
	{
		var i = 7, chr, sepcnt = this.octaveSeparateCount
			, index = key - (this.octaveLevel * this.octaveInKeys)
			, chars = this.ROW_CHARS.top.concat(this.ROW_CHARS.bottom)
		;
		return chars[index] == null ? null : chars[index];
	},
	
	scale2bpm: function(scale)
	{
		return  60 / ((scale / this.noteRangeCells) / MILLI_SECOND);
	},
	
	time2pixel: function(time)
	{
		return time * (DISPLAY_WIDTH / this.noteRangeScale);
	},
	
	pixel2time: function(pixel)
	{
		return (pixel * this.noteRangeScale / DISPLAY_WIDTH) | 0;
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
	
	getTitleMenuList: function()
	{
		return this.titleMenuList;
	},
	
	getFileMenuList: function()
	{
		var mapIndex, com = this.getLastCommand();
		if(this.commandPath.length == 0){
			if(this.getLoginParams() != null){
				return this.fileMenuList_login;
			}
			return this.fileMenuList;
		}
		mapIndex = this.commandPath[this.commandPath.length - 1];
		
		return  this.fileMenuMap[mapIndex] == null ? 
		null :  this.fileMenuMap[mapIndex];
	},
	
	getPackMenuList: function()
	{
		var com = this.getLastCommand();
		return this.packMenuList;
	},
		
	getShareMenuList: function()
	{
		return this.shareMenuList;
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
			case 'note': return this.getMenuList('note');
			case 'play': return this.getFileMenuList();
			case 'catch': return this.getCatchMenuList();
			case 'eventset': return this.getEventsetMenuList();
			case 'undo': return this.getMenuList('undo');;
			case 'file': return this.getFileMenuList();
			case 'title': return this.getTitleMenuList();
			case 'share': return this.getShareMenuList();
			case 'pack': return this.getPackMenuList();
			case 'manual': return this.getManualMenuList();
			default: return [];
		}
	},
	
	//TODO オブジェクト化　キーで取り出せればok
	getModeCursor: function(mode)
	{
		switch(mode)
		{
			case 'tune': return this.paramCursor;
			case 'note': return this.noteMenuCursor;
			case 'play': return this.fileMenuCursor;
			case 'catch': return this.catchMenuCursor;
			case 'undo': return this.undoMenuCursor;
			case 'file': return this.fileMenuCursor;
			case 'title': return this.titleMenuCursor;
			case 'share': return this.fileMenuCursor;
			case 'pack': return this.packMenuCursor;
			case 'eventset': return this.eventsetMenuCursor;
			case 'manual': return this.manualCursor;
			default: return {};
		}
	},
	
	getActiveModeCursor: function()
	{
		return this.getModeCursor(this.getMode());
	},
	
	getMenuList: function(name)
	{
		return this.menus[name] == null ? ['???'] : this.menus[name];
	},
	
	getLoginParams: function()
	{
		return this.loginParams.user_id == 0 ? null : this.loginParams;
	},
	
	setError: function(errorObj, mode, comClear)
	{
		var self = this;
		comClear = comClear == null ? true : comClear;

		this.changeEditMode('error', comClear);
		this.drawMenu();
		window.setTimeout(function(){
			self.changeEditMode(mode == null ? 'note' : mode, comClear);
			self.drawMenu();
		}, 1200);
	},
	
	logoutSNS: function()
	{
		var self = this;
		this.changeEditMode('loading');
		self.drawMenu();
		
		sendToAPIServer('POST', 'logout', {}, function(data){
			if(data.error != null){
				self.setError(data.error_code);
				return;
			}
			self.loginParams = {user_id: 0, sns_type: null, user_name: null};
			self.changeEditMode('file');
			self.drawMenu();
		}, function(){
			self.setError('server error');
		});
		
	},
	
	autoLogin: function()
	{
		var self = this;
		sendToAPIServer('POST', 'login', {session: 1}, function(data){
			if(data == null){return;}
			if(data.error_code != null){
				console.info(data.error_code + ": " + data.message);
				// self.changeEditMode('error');
				return;
			}
			// self.drawMenu();
			self.loginParams = {user_id: data.user_id, sns_type: data.sns_type, account: data.account};
			self.player.playerAccount = data.account;
			
		}, function(data){
			if(data == null){return;}
			if(data.error_code != null){
				console.error(data.error_code + ": " + data.message);
			}
			self.changeEditMode('error');
			self.drawMenu();
		});
		
	},
	
	loginSNS: function()
	{
		var self = this;
		//TODO hostmatchのエラーがわかりずらい
		//SNSログイン完了
		window.addEventListener('message', function(event){
			if(event.data.match(/\{\S*\}/) == null){return;} //twitterのトラップ
			if(event.data == null || event.data == 'null'){self.setError('server error'); window.removeEventListener('message'); return;}
			var data, hostMatch = event.origin.match(/https?\:\/\/([^\s:\/]*):?/);
			if(hostMatch == null || self.allowHosts.indexOf(hostMatch[1]) < 0){self.setError('server error'); window.removeEventListener('message'); return;}
			data = JSON.parse(event.data);
			if(data.error_code != null){
				self.setError(data.message);
				return;
			}
			
			self.loginParams = {user_id: data.user_id, sns_type: data.sns_type, account: data.account};
			self.player.playerAccount = data.account;
			self.baseKeyOnFile('<');
			window.removeEventListener('message');
		}, false);
	},
	
	editChannel: function()
	{
		return this.paramCursor.x;
	},
	
	getCurrentNote: function()
	{
		return this.beemsCurrentNote;
	},
		
	refreshCurrentNote: function()
	{
		var note = this.player.searchNearBack(this.editChannel(), this.player.noteSeekTime, 0, 'note');
		this.beemsCurrentNote = note != null ? note : makeLitroElement();
		this.envelopeBeamClock = 0;
	},
	
	/**
	 * 位置調整系
	 * @param pos
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
		return this.player.channel[this.paramCursor.x].tune([this.paramCursor.y]);
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
	
	/**
	 * 仮再生 
	 */
	playLitroTemporary: function()
	{
		var player = this.player
			, self = this;
		if(this.getMode() == 'manual'){return;}
		if(this.getMode() == 'error'){return;}
		
// 		
		if(!player.isPlay() && this.tempPlaySeekTime < 0){
			this.tempPlaySeekTime = player.noteSeekTime;
			this.initCatchEvent();
			this.initSelect();
			this.drawSelectEvents({time: -1});
			player.setSeekPosition(player.noteSeekTime);
			this.updateBackSeek();
			this.prevEditMode = this.editMode;
			this.changeEditMode('tune');
			// this.editMode = 'play';
			this.drawMenu('tune');
			// this.drawOscillo();
			// this.drawPlayTitle();
			this.initFingerState(this.fingers);
			this.player.setOnStopFunc(function(){
				// self.stopPlayer();
				// self.tempPlaySeekTime = -1;
				self.stopLitroTemporary();
			});
			this.drawStackCallback = function(){
				player.play();
			};

		}
		
	},
	
	stopLitroTemporary: function()
	{
		var player = this.player
			, mode = this.prevEditMode
		;
		if(player.isPlay() && this.tempPlaySeekTime >= 0){
			player.stop();
		}
		if(this.tempPlaySeekTime >= 0){
			player.setSeekPosition(this.tempPlaySeekTime);
			this.tempPlaySeekTime = -1;
			this.changeEditMode(mode);
			this.prevEditMode = mode != 'note' ? 'note' : 'tune';
			this.updateScrollPage();
			// this.updateForwardSeek();
			this.updateBackSeek();
			this.drawEventsetBatch();
			// this.drawMenu('tune');
			this.drawMenu();
			this.initFingerState(this.fingers);

		}

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
		, types = this.player.typesArray('TUNE', ['event', 'enable']);
		;
		
		for(tindex = 0; tindex < types.length; tindex++){
			type = types[tindex];
			res[type] = {};
			value = this.player.getChannel(ch, type);
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
		, sort = LitroWaveChannel.sortParam, tindex
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
		this.setModified(ch);

	},
	
	deleteEventChange: function(ch, events)
	{
		var eventset
		, type, t //, samp = []
		, deleted = {}, cnt = 0
		// , data
		, sort = LitroWaveChannel.sortParam
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
					cnt++;
				}
			}
		}
		this.setModified(ch);

		return cnt == 0 ? null : deleted;
	
	},
	
	// setEventChange: function(ch, type, value, time)
	setEventChange: function(ch, eventset, player)
	{
		if(this.viewMode != null){return;}
		var idKeys = LitroWaveChannel.tuneParamsIDKey()
			, time, set, events
		;
		player = player == null ? this.player : player;
		if(eventset.type == 'event' && idKeys[eventset.value] in LitroWaveChannel.commonTuneType){
			ch = player.COMMON_TUNE_CH;
			events = player.eventsetData[ch][eventset.type];
			for(time in events){
				if(events[time].value == eventset.value){
					set = {}; set[eventset.type] = {};
					set[eventset.type][time] = eventset;
					this.deleteEventChange(ch, set);
				}
			}
			events[eventset.time] = eventset;
		}else{
			events = player.eventsetData[ch][eventset.type];
			events[eventset.time] = eventset;
		}
		
		if(player.name == 'edit'){
			this.setModified(ch);
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
	
	pushEditHistory: function(channels)
	{
		var ch, player = this.player
			, channelEvents
			, copied = {}, all
			, cur = this.getModeCursor('undo')
		;
		if(channels.length == null){
			channels = [channels];
		}else if(channels.length == 0){
			return;
		}
		
		//history0 is allChannels
		if(cur.x + 1 >= this.editHistory.length && this.editHistory.length >= this.EDITHISTORY_MAXNUM){
			//all is Object
			all = this.editHistory.shift();
			for(i in all){
				if(this.editHistory[0][i] == null){
					this.editHistory[0][i] = clone(all[i]);
				}
			}
		}
		for(i = 0; i < channels.length; i++){
			ch = channels[i];
			copied[ch] = clone(this.player.eventsetData[ch]);
		}
		
		this.editHistory = this.editHistory.slice(0, cur.x + 1);
		this.editHistory.push(copied);
		cur.x = this.editHistory.length - 1;
	},
	
	applyEditHistory: function(histNum)
	{
		var i, ch, player = this.player
			, channelEvents
			, cur = this.getModeCursor('undo');
		;
		if(this.editHistory[histNum] == null){
			return;
		}
		
		
		for(i = 0; i <= cur.x; i++){
			channelEvents = this.editHistory[i];
			for(ch in channelEvents){
				this.player.eventsetData[ch] = clone(channelEvents[ch]);
			}
		}
		this.drawEventsetBatch();
	},
	
	setModified: function(channel)
	{
		var m = this.isModified;
		
		if(channel.length == null){
			channel = [channel];
		}
		channel = channel.map(function(a){
			return a |= 0;
		});
		
		this.isModified = m.concat(channel.filter(function(a){
			return m.indexOf(a) < 0;
		}));
	},
	
	clearModified: function()
	{
		this.isModified = [];
	},
	
	incNotekeys: function(eventset)
	{
		var type = 'note', time;
		if(eventset[type] == null){return;}
		for(time in eventset[type]){
			if(eventset[type][time].value + 1 >= KEYCODE_MAX){
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
		
		this.setModified(ch);
	},
	
	sePlayCode: function(ch, code, octave)
	{
		var editch = this.editChannel(), p;

		//TODO 検証
		if(this.sePlayer.isPlay()){
			this.sePlayer.stop();
		}
		
		
		// console.log(ch, editch, this.sePlayer.channel[ch]);
		for(p in this.player.channel[editch].tuneParams){
			this.sePlayer.setChannel(ch, p, this.player.getChannel(editch, p, false));
		}
		
		this.sePlayer.onNoteFromCode(ch, code, octave, editch);
	},

	sePlayRhythm: function(bpm)
	{
		var ch = 0, i, oct
			, step = (MILLI_SECOND / (bpm / 60)) | 0
			, self = this
			, setec = function(type, value, time){
				// console.log(self.makeEventset(type, value, time), self.sePlayer);
				self.setEventChange(ch, self.makeEventset(type, value, time), self.sePlayer);
			}
		;
		this.sePlayer.setSeekPosition(0);
		this.sePlayer.stop();
		this.sePlayer.clearEventsData();
		this.sePlayer.channel[ch].resetChannelParams();

		setec('waveType', 12, 0);
		setec('volumeLevel', 4, 0);
		setec('sustain', 2, 0);
		setec('decay', 1, 0);
		setec('length', 1, 0);
		setec('release', 2, 0);
		
		for(i = 0; i < 8; i++){
			oct = i % 4 == 2 ? 6 : 7;
			setec('note', 7 + (oct	 * this.octaveInKeys), i * step);
		}
		setec('event', litroTuneProp('return').id, i * step);
		this.sePlayer.play();
		self = null;
		setec = null;
	},
	
	stopPlayer: function()
	{
		if(this.tempPlaySeekTime > -1){
			this.stopLitroTemporary();
			return;
		}
		
		if(this.editMode != 'tune'){
			this.getActiveModeCursor().y = 0;
		}
		
		this.changeEditMode(this.prevEditMode);
		this.prevEditMode = 'note';
		
		this.updateBackSeek();
		this.clearLeftScreen();
		this.drawParamKeys();
		this.drawParamCursor();
		this.drawChannelParams();
		this.drawMenu();
		if(this.viewMode != null){
			this.drawPlayOnSpacekey();
		}
		// this.drawChannelCursor();
		this.initFingerState(this.fingers);
	},
	
//TODO 複数キーの操作は選択中チャンネルで
	onCode: function(chr)
	{
		var channel, chars, row, octave, code, i
			, pos = this.getNoteDispPos()
			, seekPage = this.getNoteSeekPage()
			, editch = this.editChannel()
		;
		
		if(this.editMode == 'undo'){
			return;
		}

		octave = this.getOctaveFromKeyChar(chr);
		code = this.CODE_NAME_INDEX[this.CHARS_CODE_NAME[chr]];
		channel = this.searchReadySlot();
		
		if(channel < 0){
			return;
		}else{
			this.status_on[channel] = chr;
		}
		
		//仮使用
		if(channel == editch){
			this.setEventChange(editch, this.makeEventset('note', code + (octave * this.octaveInKeys)));
		}
		
		this.refreshCurrentNote();
		
		
		if(this.editMode == 'catch'){
			this.moveCatchCursor(null, false);
			return;
		}
				
		// this.player.setPreSwapTune(channel, this.player.getTuneParams(editch));
		this.sePlayCode(channel, code, octave);
		
		if(this.onkeyEvent != null){
			this.onkeyEvent(chr);
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
			//見つからない
			return;
		}
		if(this.offkeyEvent != null){
			this.offkeyEvent(chr);
		}
		this.status_on[channel] = null;
		
		// if(this.searchOnState() < 0){
			// this.referChannel = null;
		// }
		//TODO 検証
		if(this.sePlayer.isPlay()){
			this.sePlayer.stop();
		}
		
		// this.litroSound.offNoteFromCode(channel);
		// this.player.channel[channel].refChannel = -1;
		this.sePlayer.fadeOutNote(channel, paramChannel);
	},
	/**
	 * setDirect inpput Octave level 
	 * return @bool refreshDrawEnable
	 */
	setOctave: function(level)
	{
		level = level <= OCTAVE_MAX ? level : OCTAVE_MAX;
		level = level > 0 ? level : 0;
		
		if(this.octaveLevel == level){
			return false;
		}
		this.octaveLevel = level;
		this.drawOctaveMeter(this.octaveLevel);
		this.drawEventsetBatch();
		return true;
	},
	
	incOctave: function()
	{
		if(this.octaveLevel <= OCTAVE_MAX - this.octaveRange + 1){
			this.octaveLevel++;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawEventsetBatch();
		}
	},
	
	decOctave: function()
	{
		if(this.octaveLevel > 0){
			this.octaveLevel--;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawEventsetBatch();
		}
	},
	
	isEnableOnlyChannel: function(ch, enable)
	{
		for(var i = 0; i < this.player.channel.length; i++){
			if(this.player.getChannel(i, 'enable', false) != (((ch == i) == enable) | 0)){
				return false;
			}
		}
		return true;
	},
	
	toggleOnlyChannel: function(ch, enable)
	{
		for(var i = 0; i < this.player.channel.length; i++){
			this.player.toggleOutput(i, (ch == i) == enable);
			this.drawChannelTab_on(i, (ch == i) == enable);
		}
	},
	
	toggleAllChannel: function(enable)
	{
		for(var i = 0; i < this.player.channel.length; i++){
			this.player.toggleOutput(i, enable);
			this.drawChannelTab_on(i, enable);
		}
	},
	
	searchReadySlot: function()
	{
		var i, key
		;
		for(i = 0; i < this.fingers; i++){
			key = (i + this.editChannel()) % this.sePlayer.channel.length;
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
			key = (i + this.paramCursor.x) % this.player.channel.length;
			// key = i;
			if(this.status_on[key] == chr){
				return key;
			}
		}
		return -1;
	},
	
	searchOnState: function()
	{
		var i, key
		;
		for(i = 0; i < this.fingers; i++){
			if(this.status_on[i] != null){
				return i;
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
	
	fileInListAtIndex: function(index)
	{
		var id, c = 0, list = this.player.fileList();
		for(id in list){
			if(c++ == index){return list[id];}
		}
		return null;
	},
	
	pushPackFile: function(file)
	{
		if(this.isPackedFile(file)){
			return false;
		}
		this.packedFiles.push(file);
		this.packedFiles = this.packedFiles.slice(0, this.packMaxSize);
		return this.packedFiles.length >= this.packMaxSize;
	},
	popPackFile: function()
	{
		return this.packedFiles.length == 0 ? null : this.packedFiles.pop();
	},
	
	clearPackedFiles: function()
	{
		this.packedFiles = [];
	},
	
	shipPackFiles: function()
	{
		var packstr, ids = [], len = this.packedFiles.length
		;
		this.packedFiles.map(function(file, i){
			ids.push(file.sound_id);
		});
		packstr = '[' + ids.join(',') + ']';
		prompt('Add Your Script :', 'LitroPlayer.loadPack(' + packstr + ');');
		this.keyControll.allReset();
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
		if(this.viewMode != null){
			this.editMode = 'play';
			return;
		}
		if(typeof mode == 'string'){
			this.editMode = mode;
		}else if(mode == parseInt(mode, 10)){
			this.editMode = this.modeNames[mode];
		}
		// var self = this;
		// if(this.editMode == 'error'){
			// setTimeout(function(){
				// self.changeEditMode('note');
				// self.drawMenu();
			// }, 1000);
		// }
// console.log(comClear);
		if(comClear){
			this.commandPath = [];
		}
		if(this.getActiveModeCursor().y >= this.getActiveModeMenuList().length){
			this.getActiveModeCursor().y = 0;
		}
		//history stack for UNDO mode 
		this.pushEditHistory(this.isModified);
		this.clearModified();
		return;
	},
	
	loadList: function(page, limit)
	{
		var self = this, commonError = {error_code: 0, message: 'server error'};
		try{
			this.player.listFromServer(this.loginParams.user_id, page, limit, 
				function(list){
					//TODO finishLoadListで処理する(空リストの処理)
					// if(list == null || list.error_code != null){
						// list = {};
					// }
					self.finishLoadList(list);
					self.drawMenu();
					
				}, function(error){
					// self.setError(commonError, 'file');
					self.finishLoadList(error);
					// self.drawMenu();
				});
		}catch(e){
			console.error(e);
			self.setError(commonError, 'file');
		}
	},
	
	finishLoadList: function(list)
	{
		var i, player = self.player, com1 = this.getLastCommand(1), com0 = this.getLastCommand(0)
			, mode = '', curX = 0, title = '', isError = false, clear = false
			, commonError = {error_code: 0, message: 'server error'}
			, error
			
		;
		if(list == null || list.error_code != null){
			error = list;
			list = {};
			isError = true;
			this.player.fileList(list);
		}
		
		if(com0 == 'SAVE'){
			title = 'NEW FILE';
			mode = 'file';
			clear = true;
		}else if(com0 == 'LOAD'){
			//最初にスコア削除を入れておく
			title = '！！CLEAR　NOTES！！';
			mode = 'file';
		}else if(com0 == 'SHARE'){
			title = 'SHARE LITROKEYBOARD！';
			mode = 'share';
		}else if(com0 == 'PACK'){
			title = 'PACK RESET';
			mode = 'pack';
			curX = 1;
			this.packMenuCursor.x = curX;
		}
		
		if(isError){
			// console.log(list);
			title = com1 == 'SAVE' ? error.message : title;
			this.setError(error, mode, clear);
		}else{
			this.changeEditMode(mode, false);
		}
		list[0] = {sound_id: 0, user_id: this.loginParams.user_id, title: title, packed: false};

		if(mode == 'pack'){
			this.drawPackedFileList();
			this.drawFileListCursor();
		}else{
			this.drawFileList();
			this.drawFileListCursor();
		}
	},
	
	/*
	 * 最後のコマンドがOKだったら実行
	 */
	commandExecute: function()
	{
		var com_conf = this.getLastCommand()
			// , com_type = this.getLastCommand(1)
			// , com_method = this.getLastCommand(2)
			// , com_submethod = this.getLastCommand(3)
			, com_type = 'SERVER'
			, com_method = this.getLastCommand(2)
		;
		// if(this.commandPath.indexOf('COOKIE') == -1){
			// com_type = com_method;
			// com_method = com_submethod;
		// }
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
		var self = this, tid
			, commonError = {error_code: 0, message: 'server error'}
			, mode = 'file';
		;
		switch(type){
			case 'COOKIE': this.player.saveToCookie(); this.changeEditMode('note'); break;
			case 'SERVER': this.changeEditMode('loading'); this.player.playerAccount = this.getLoginParams().account;
			 this.player.saveToServer(this.loginParams.user_id, this.fileInListAtIndex(this.fileListCursor.y).sound_id, this.player.eventsetData, 
			
				function(data){
					if(data == null || data === false || data.error_code != null){
						// self.setError(data != null ? data : {error_code: 0, message: 'error'});
						// self.drawMenu();
						self.setError(commonError, mode, false);
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
					self.setError(commonError, mode, false);
					// self.changeEditMode('error');
					// self.drawMenu();
				}); break;
			
		}
	},
	
	loadCommand: function(type)
	{
		var self = this, tid, file, pack;
		switch(type){
			case 'COOKIE': this.player.loadFromCookie(); this.changeEditMode('note');break;
			case 'SERVER': 
				file = this.fileInListAtIndex(this.fileListCursor.y);
				if(file == null){
					this.fileListCursor.y = 0;
					return;
				}
				//削除
				if(file.sound_id == 0){
					this.player.clearEventsData();
					this.setModified(Object.keys(this.player.eventsetData));
					this.changeEditMode('note');
					this.drawParamKeys();
					this.drawChannelParams();
					return;
				}
				this.changeEditMode('loading');
				this.player.loadFromServer(this.loginParams.user_id, file.sound_id, 
				function(data){
					if(data == null || data === false){
						self.changeEditMode('error');
						self.drawMenu();
						return;
					}
					self.setModified(Object.keys(self.player.eventsetData));
					
					self.changeEditMode('note');
					// self.player.setPlayData(data);
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
			case 'PACK': 
				// pack = this.fileInListAtIndex(this.packListCursor.y);
				// if(pack == null){
					// this.packListCursor.y = 0;
					// return;
				// }
			break;
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
			, pre = (this.bg2x.t / DISPLAY_WIDTH) | 0
		;
		this.bg2x.t = - (((pos + DISPLAY_WIDTH) % (DISPLAY_WIDTH * 2)) - DISPLAY_WIDTH);
		
		if(this.bg2x.t >= 0){
			this.bg2x.b = this.bg2x.t - DISPLAY_WIDTH;
		}else{
			this.bg2x.b = this.bg2x.t + DISPLAY_WIDTH;
		}
	},
	
	updateForwardSeek: function()
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
	moveMenuCursorCommon: function(cur, dir, list, ext)
	{
		var limit = list.length
			, seekTime = this.player.noteSeekTime, moveTime = this.seekTime(cellhto(1))
			, divTime = seekTime % moveTime
			, nextTime = divTime == 0 ? moveTime : divTime
			, prevTime = divTime == 0 ? moveTime : moveTime - divTime
		;
		
		nextTime = ext ? this.noteRangeScale : nextTime;
		prevTime = ext ? this.noteRangeScale : prevTime;
		
		// console.log(moveTime, divTime);
		switch(dir){
			case 'up':
					if(ext){
						this.incOctave();
						break;
					}
					cur.y = (cur.y + limit - 1) % limit;
					this.drawMenuList(list);
					this.drawMenuListCursor(list, cur.y);
					break;
			case 'down':
					if(ext){
						this.decOctave();
						break;
					}
					cur.y = (cur.y + 1) % limit;
					this.drawMenuList(list);
					this.drawMenuListCursor(list, cur.y);
					break;
			case 'left':
						this.player.seekMoveBack(nextTime); 
						this.updateBackSeek(); break;
			
			case 'right':
					this.player.seekMoveForward(prevTime);
					this.updateForwardSeek();
					this.drawNoteScroll(null, true);
					break;
		}
	},
	
	channelMove: function(dir)
	{
		var cur = this.paramCursor
			, chLength = this.player.channel.length
			, ch = this.editChannel();
		;
		switch(dir){
			case 'up': if(this.player.getChannel(ch, 'enable', false) == 0){
								this.player.toggleOutput(ch, true);
								this.drawChannelTab_on(ch, true);
							}else{
								if(!this.isEnableOnlyChannel(ch, true)){
									this.toggleOnlyChannel(ch, true);
								}else{
									this.toggleAllChannel(true);
								}
							}
							break;
			case 'down': if(this.player.getChannel(ch, 'enable', false) == 1){
									this.player.toggleOutput(ch, false);
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
		this.drawParamCursor(!(this.editMode == 'tune'));
		
		this.drawEventsetBatch();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
	},
	
	moveChannelParamCursor: function(dir, ext)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, limit = this.paramLimit
			, offset = this.paramOffset
			, row = 0, xc = 0, yc = 0
			, cmc = this.channelParamsCmargin
			, pmc = this.paramskeysCmargin
			, param = this.ltSoundChParamKeys[this.paramKeys[cur.y]]
			, paramsLength = this.paramKeys.length
			, currentLength = paramsLength - (limit - 1)
			, isscroll = false, isreflesh = false
		;
		// this.drawParamCursor(curr.x, curr.y, true);
		if(!ext){
			switch(dir){
				case 'up': cur.y = (cur.y + paramsLength - 1) % paramsLength;
								if(--curr.y < 0){
									curr.y = offset == 0 ? limit - 1 : 0;
									offset = (offset + currentLength - 1) % currentLength; //4
									isscroll = true;
									isreflesh = offset == currentLength - 1;
									yc = this.channelParamsCmargin.y;
									row = offset;
								}
								break;
				case 'down': cur.y = (cur.y + 1) % paramsLength;
								if(++curr.y > limit - 1){
									curr.y = offset + limit - 1 >= paramsLength - 1 ? 0 : limit - 1;
									offset = (offset + 1) % currentLength;
									isscroll = true;
									isreflesh = offset == 0;
									yc = this.channelParamsCmargin.y + limit - 1;
									row = offset + limit - 1;
								}
								break;
				case 'left': this.player.setChannel(cur.x, param, this.player.getChannel(cur.x, param, false) - 1);
								break;
				case 'right': this.player.setChannel(cur.x, param, this.player.getChannel(cur.x, param, false) + 1);
								break;
			}
			
			if(isreflesh){
				this.drawParamKeys(offset, limit);
				this.drawChannelParams(offset, limit);
			}else if(isscroll){
				this.scrollChannelParams(dir);
				this.drawParamKeys(row, 1, pmc.x, yc);
				this.drawChannelParams(row, 1, cmc.x, yc);
			}

			this.paramOffset = offset;
			// this.drawParamCursor();
		}else{
			//描画込み
			this.channelMove(dir);
		}
	},
	
	moveCatchCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, searchTime = -1
			, catchKey = ['note', 'TUNE', 'ALL']
			, catchVal, eventset = null
			, ignore = this.selectNote
			, prevNote
			, ch = this.editChannel()
			, player = this.player
			, octave
			// , player = this.sePlayer
		;
		
		if(this.getLastCommand() == "KEEP"){
			 if(ext){
				switch(dir){
					case 'up':
						this.incNotekeys(this.catchEventset);
						this.setModified(ch);
						this.drawEventsetBatch();
						break;
					case 'down':
						this.decNotekeys(this.catchEventset);
						this.setModified(ch);
						this.drawEventsetBatch();
						break;
					case 'left':
						this.channelMove(dir);
						break;
					case 'right':
						this.channelMove(dir);
						break;
				}
				
			}else{
				this.moveMenuCursorCommon(cur, dir, this.getActiveModeMenuList(), ext);
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
			case 'left': eventset = player.searchNearBack(ch, player.noteSeekTime, 0, this.catchType, ignore);
							break;
			case 'right': eventset = player.searchNearForward(ch, player.noteSeekTime, -1, this.catchType, ignore);
							break;
			default: eventset = player.searchNearForward(ch, player.noteSeekTime, -1, this.catchType);
		}
		this.drawMenu(this.editMode);

		if(eventset != null){
			player.soundEventPush(ch, eventset.type, eventset.value);
			// this.sePlayKey(ch, code, octave);


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
			
			if(eventset.time > player.noteSeekTime){
				//前へキャッチ
				player.noteSeekTime = eventset.time;
				this.updateForwardSeek();
			}else{
				//後ろへキャッチ
				player.noteSeekTime = eventset.time;
				this.updateBackSeek();
			}
			
			this.catchEventset[eventset.type][eventset.time] = eventset;
			this.drawSelectEvents(this.selectNote);
			
			if(eventset.type == 'note'){
				octave = (eventset.value / KEY_FREQUENCY[0].length) | 0;
				if(octave > this.octaveLevel){
					octave = octave > this.octaveLevel + 2 ? octave - 2 : this.octaveLevel;
				}
				if(this.setOctave(octave)){
					return eventset;
				};
			}
			
			// console.log(this.catchEventset);
			this.drawEventsetBatch();
		}else{
			eventset = player.searchNearBack(ch, player.noteSeekTime, 0, this.catchType);
			if(eventset != null){
				player.soundEventPush(ch, eventset.type, eventset.value);
			}
		}
		
		return eventset;
	},
	
	moveFileListCursor: function(dir, ext)
	{
		var cur = this.fileListCursor
			, limit = Object.keys(this.player.fileList()).length
			, offset = this.fileListOffset, page = this.fileListPage
			, dispHeight = 6
			;
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit; break;
			case 'down': cur.y = (cur.y + 1) % limit; break;
			case 'left': cur.y = 0; break;
			case 'right': cur.y = limit - 1; break;
		}
		// if(dispHeight <= limit){
		// }else{
		// }
		offset = cur.y - offset < 0 ? cur.y : offset;
		offset = cur.y - offset >= dispHeight ? cur.y - dispHeight + 1 : offset;

		this.fileListOffset = offset;
		
		// this.drawFileMenu();
		// this.drawFileCursor();

	},
	
	moveFileMenuCursor: function(dir, ext)
	{
		var cur = this.fileMenuCursor
			, limit
			, chLength = this.player.channel.length
			, paramsLength = this.paramKeys.length
			, list = this.getFileMenuList()
			, currentLength
			, com = this.getLastCommand()
		;
		if(com == 'TITLE'){
			this.moveTitleMenuCursor(dir, ext);
			// this.moveCharBoardCursor(dir, ext);
			return;
		}else if(com == 'SAVE' || com == 'LOAD'){
			this.moveFileListCursor(dir, ext);
			this.drawFileList();
			this.drawFileListCursor();
			return;
		}else if(com == 'SERVER'){
			this.moveFileListCursor(dir, ext);
			this.drawFileList();
			this.drawFileListCursor();
			return;
		}
		if(list == null){
			 return;
		}
		limit = list.length;
		
		currentLength = paramsLength - (limit - 1);
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit; break;
			case 'down': cur.y = (cur.y + 1) % limit; break;
			case 'left': cur.y = 0; break;
			case 'right': cur.y = limit - 1; break;
		}
		this.drawFileMenu();
		this.drawFileCursor();
	},

	moveTitleMenuCursor: function(dir, ext)
	{
		var skip = 3
			,Ccur =  this.charBoardCursor, Fcur =  this.titleMenuCursor
			, curr = this.charBoardCurrent
			, Climit = this.charBoardLimit, Flimit = this.getActiveModeMenuList().length - skip
			, y = Fcur.y
		;
		
		if(Fcur.x != 0){
			this.moveCharBoardCursor(dir, ext);
		}else{
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
				this.drawCharBoardChar(curr, Ccur, true);
				this.drawMenuList(this.getActiveModeMenuList());
			}else if(Fcur.x < 0){
				Ccur.x = Climit.x - 1;
				this.drawCharBoard();
				this.drawCharBoardChar(curr, Ccur, true);
				this.drawMenuList(this.getActiveModeMenuList());
			}else{
				this.drawMenu();
			}
		}
	},
		
	moveCharBoardCursor: function(dir, ext)
	{
		var Ccur =  this.charBoardCursor, Fcur =  this.titleMenuCursor
			, Climit = this.charBoardLimit
			, curr = this.charBoardCurrent, dispNum = this.charBoardDispNum
			, Tcur = this.titleCharCursor, Tlimit = this.player.titleMaxLength
			, tlength = this.player.title.length + 1
			, isScrollDown = false, isScrollUp= false, isClean = false
			, maxID = 250
		;

		if(ext){
			switch(dir){
				case 'up': Ccur.y = (Ccur.y + Climit.y - 2) % Climit.y;
						curr.y = curr.y - 2; isScrollUp = true; break;
				case 'down': Ccur.y = (Ccur.y + 2) % Climit.y;
						curr.y = curr.y + 2; isScrollDown = true; break;
				case 'left': Tcur.x = tlength == 1 ? Tcur.x : (Tcur.x + tlength - 1) % tlength; break;
				case 'right': Tcur.x = tlength == 1 ? Tcur.x : (Tcur.x + 1) % tlength; break;
			}			
			curr.y = Ccur.y - curr.y >= dispNum.y ? Ccur.y - dispNum.y + 1 : curr.y;
			curr.y = Ccur.y - curr.y + 1 < 0 ? Ccur.y : curr.y;

		}else{
			this.drawCharBoardChar(curr, Ccur, false);
			switch(dir){
				case 'up': Ccur.y = (Ccur.y + Climit.y - 1) % Climit.y; break;
				case 'down': Ccur.y = (Ccur.y + 1) % Climit.y; break;
				case 'left': Ccur.x = Ccur.x - 1; break;
				case 'right': Ccur.x = Ccur.x + 1; break;
			}
			
			//MaxIDを超えたら
			// if((Ccur.y * dispNum.x) + Ccur.x > maxID){
				// switch(dir){
					// case 'up': Ccur.y = (Ccur.y + Climit.y - 1) % Climit.y; break;
					// case 'down': Ccur.y = (Ccur.y + 1) % Climit.y; break;
					// case 'left': Ccur.x = maxID; Ccur.y = dispNum.y - 1; break;
					// case 'right': Ccur.x = 0; Ccur.y = 0; break;
				// }
			// }
			
			//char列スクロール
			if(Ccur.y - curr.y >= dispNum.y){
				curr.y = Ccur.y - dispNum.y + 1;
				isScrollDown = true;
			}
			if(Ccur.y - curr.y < 0){
				curr.y = Ccur.y;
				isScrollUp = true;
			}
			
			//char列外に出る
			if(Ccur.x >= Climit.x || Ccur.x < 0){
				 this.titleMenuCursor.x = 0;
				isClean = true;
				this.drawMenu();
			}
		}
		
		if(isScrollUp || isScrollDown || isClean){
			this.drawCharBoard();
			this.drawTitleCharCursor();//?
		}
		if(!isClean){
			this.drawCharBoardChar(curr, Ccur, true);
		}
	},
	
	movePackMenuCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, limit
			, list = this.getPackMenuList()
			, currentLength
			, self = this
			, refreshRight = function(enable){
				self.drawMenu();
				if(enable){
					self.drawPackCursor();
				}}
			, refreshLeft = function(enable){
				self.drawPackedFileList();
				if(enable){
					self.drawFileListCursor();
			}}
		;
		if(list == null){
			 return;
		}
		limit = list.length;
		
		if(ext){
			switch(dir){
				case 'left': cur.x = 1; refreshRight(false);refreshLeft(true); break;
				case 'right': cur.x = 0; refreshRight(true);refreshLeft(false); break;
			}
		}else{
			if(cur.x == 0){
				switch(dir){
					case 'up': cur.y = (cur.y + limit - 1) % limit; break;
					case 'down': cur.y = (cur.y + 1) % limit; break;
					case 'left': cur.y = 0; break;
					case 'right': cur.y = limit - 1; break;
				}
				this.drawPackMenu();
				this.drawPackCursor();
			}else{
				this.moveFileListCursor(dir, ext);
				this.drawPackMenu();
				this.drawPackedFileList();
				this.drawFileListCursor();
			}
		}
	},
	
	moveShareMenuCursor: function(dir, ext)
	{
		this.moveFileListCursor(dir, ext);
		this.drawFileList();
		this.drawFileListCursor();
		this.drawShareMenu();
		this.drawShareCursor();
	},
	
	moveEventsetCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
		;
		switch(dir)
		{
			case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
			case 'down': cur.y = (cur.y + 1) % list.length; break;
			case 'left': this.moveMenuCursorCommon(cur, dir, list, ext); return;
			case 'right': this.moveMenuCursorCommon(cur, dir, list, ext); return;
		}
		this.drawEventsetMenu();
		// this.drawEventsetCursor();

	},
	
	moveUndoCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
			, history = this.editHistory
		;
		if(history.length == 0){
			cur.y = 0;
			return;
		} 
		switch(dir)
		{
			case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
			case 'down': cur.y = (cur.y + 1) % list.length; break;
			case 'left':
				cur.x -= cur.x == 0 ? 0 : 1;
				this.applyEditHistory(cur.x);
				break;
			case 'right':
				cur.x += cur.x + 1 < history.length ? 1 : 0;
				this.applyEditHistory(cur.x);
				break;
		}
		this.drawMenu();
		
	},
	
	moveNoteMenuCursor: function(dir, ext)
	{
		var cur = this.noteMenuCursor
			, list = this.getMenuList('note')
		;
		this.moveMenuCursorCommon(cur, dir, list, ext);
	},
	
	moveManualMenuCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
		;
		return;
		// switch(dir)
		// {
			// case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
			// case 'down': cur.y = (cur.y + 1) % list.length; break;
			// case 'left': this.moveMenuCursorCommon(cur, dir, list); break;
			// case 'right': this.moveMenuCursorCommon(cur, dir, list); break;
		// }
	},
	
	movePlayCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
			, vol = this.player.volume()
			, ltsnd = this.litroSound
			, crateInc = 0.05
		;
		
		if(ext){
			switch(dir)
			{
				// case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
				// case 'down': cur.y = (cur.y + 1) % list.length; break;
				case 'left': ltsnd.clockRate = ltsnd.clockRate - crateInc < 0 ? 0 : ltsnd.clockRate - crateInc; break;
				case 'right': ltsnd.clockRate = ltsnd.clockRate + crateInc > 10 ? 10 : ltsnd.clockRate + crateInc; break;
			}
			ltsnd.clockRate = Math.round(ltsnd.clockRate * 100) / 100;
		}else{
			switch(dir)
			{
				// case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
				// case 'down': cur.y = (cur.y + 1) % list.length; break;
				case 'left': this.player.volume(vol > this.VOLUME_MIN ? vol - this.VOLUME_INC : vol); break;
				case 'right': this.player.volume(vol < this.VOLUME_MAX - this.VOLUME_INC ? vol + this.VOLUME_INC : vol); break;
			}
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
		if(this.viewMode != null){return;}
		if(this.player.isPlay()){
			if(this.editMode == 'tune'){
				this.changeEditMode('play');
				this.drawPlayTitle();
			}else{
				this.changeEditMode('tune');
				this.drawPlayOnSpacekey();
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
		this.drawChannelParams();
		this.drawParamCursor(!(this.editMode == 'tune'));
		this.drawMenu();
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
				this.drawMenu();
				break;
			case '>': 
				com = this.setMenuCommandPath();
				//共通コマンド処理
				this.selectMenuItem(com, key);
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
	
	//TODO 各モードで処理するべき？
	selectMenuItem: function(item, key)
	{
		var cur = this.noteMenuCursor
			, deldat = {}
		;
		switch(item){
			case 'PASTE': 

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
			case 'SAVE':
			case 'LOAD':
				cur = this.fileMenuCursor;
				if(key == '<'){
					cur.y = 0;
				}else{
					this.changeEditMode('loading', false);
					this.loadList(this.fileListPage, this.fileListLoadLimit);
					this.getActiveModeCursor().y = 0;
					this.drawMenu();
				}
				break;

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
		this.drawEventsetBatch();
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
			this.drawEventsetBatch();
		}else{
			switch(key){
				case '<': this.deleteAtTime(ch, time, 'note'); break;
				case '>': 
				switch(this.setMenuCommandPath()){
					case 'CATCH':
						cur.y = 0;
						this.changeEditMode('catch');
						this.getActiveModeCursor().y = 0;
						this.initCatchEvent();
						this.initSelect();
						break;
					case 'UNDO': 
						this.tmpEventsetData = clone(this.player.eventsetData);
						this.getModeCursor('undo').y = 1;
						this.changeEditMode('undo');
						break;
					case 'EVENTSET': 
						this.changeEditMode('eventset');
						break;
					case 'FILE':
						this.changeEditMode('file');
						break;
					case 'MANUAL':
						this.openManual();
						break;
					case 'LOGIN':
						this.getActiveModeCursor().y = 0;
						break;

					default: 
						// cur.y = 0;
				} 
				break;
				case 'select': 
					this.commonTabKey();
					break;

			}

			this.drawMenu();
			this.drawEventsetBatch();
			//com = this.baseKeyMenuCommon(cur, key);
		}
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
					eventset = this.makeEventset(param, this.player.getChannel(ch, param, false));
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
		this.drawEventsetBatch();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
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
					// this.editMode = this.selectNote.time < 0 ? 'note' : this.editMode;
					this.changeEditMode(this.selectNote.time < 0 ? 'note' : this.editMode);
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
						if(deldat == null){
							this.backMenu();
						}
						this.initCatchEvent(deldat);
					}
					this.getActiveModeCursor().y = 0;
				}else{
					com = this.setMenuCommandPath();
				}

				this.drawMenu();
				break;
			case 'select': 
				this.initCatchEvent();
				this.initSelect();
				this.changeEditMode('note');
				this.drawMenu();
				break;
		}
		this.drawSelectEvents({time: -1});
		this.drawEventsetBatch();
	},
		
	baseKeyOnEventset: function(key, ext)
	{
		var cur = this.paramCursor, mCur = this.getActiveModeCursor()
			, param = this.ltSoundCommonParamskeys[this.eventsetMenuList[mCur.y]]
			, id = LitroWaveChannel.tuneParamsProp[param].id
			, ch = this.editChannel(), time = this.player.noteSeekTime, events
			// , id = LitroWaveChannel.tuneParamsID[param]
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
		this.drawMenu();
		this.drawEventsetBatch();
	},
	
	baseKeyOnUndo: function(key, ext)
	{
		var cur = this.getActiveModeCursor(), deldat
			, selCommand = this.getMenuCommandPath()
			, lastCommand = this.getLastCommand()
			, cancelX = this.editHistory.length - 1
			, i
		;
		switch(key){
			case '<': 
				this.player.eventsetData = clone(this.tmpEventsetData);
				this.changeEditMode('note');
				cur.y = 0;
				cur.x = cancelX;
				this.drawMenu();
				break;
			case '>': 
				switch(this.getMenuCommandPath()){
					case 'NO':
						cur.x = cancelX;
						this.player.eventsetData = clone(this.tmpEventsetData);
						this.changeEditMode('note');
					break;
					case 'OK':
						this.changeEditMode('note');
					break;
				}
				this.drawMenu();
				cur.y = 0;
				break;
			case 'select': 
				cur.x = cancelX;
				this.player.eventsetData = clone(this.tmpEventsetData);
				this.commonTabKey(true);
				cur.y = 0;
				break;
		}
		this.drawEventsetBatch();
	},
	
	baseKeyOnFile_login: function(key, ext)
	{
		this.fileMenuCursor.y = 0;
		if(key == '>'){
			return;
		}else if(key == '<'){
			this.backMenu();
		}else if(key == 'select'){
			this.changeEditMode('note');
		}
		this.closeSNSTab();
		this.drawMenu();
	},
	
	baseKeyOnFile: function(key, ext)
	{
		var fcur = this.fileMenuCursor, ccur = this.charBoardCursor
			, cLimit = this.charBoardLimit
			, com, self = this
		;
		
		// if(this.getLastCommand() == 'TITLE'){
			// if(this.baseKeyOnFile_title(key, ext)){
				// return;
			// };
		// }

		if(this.getLastCommand() == 'LOGIN'){
			this.baseKeyOnFile_login(key, ext);
			return;
		}
		
		if(key == 'select'){
			this.commonTabKey(true);
			return;
		}
		//共通処理		
		com = this.baseKeyMenuCommon(fcur, key);
		
		if(key == '<' && (this.fileMenuList.indexOf(com) >= 0 || this.fileMenuList_login.indexOf(com) >= 0)){
			this.changeEditMode('note');
			this.drawMenu();
		}else{
			switch(com){
				case 'FILELIST':
					this.commandExecute(); //未使用？
					break;
				case 'TITLE':
					this.titleBackup = this.player.title;
					this.changeEditMode('title');
					this.drawMenu();
					this.drawMenuList(this.getActiveModeMenuList());
					
					this.getActiveModeCursor().y = 0;
					
					this.titleMenuCursor.x = -1;
					this.titleMenuCursor.y = 3;
					this.charBoardCursor.x = 0;
					this.clearLeftScreen();
					this.drawCharBoard();
					this.drawCharBoardChar(this.charBoardCurrent, this.charBoardCursor, true);
					break;
				case 'SHARE':
				case 'PACK':
					this.packMenuCursor.x = 1;
				case 'SERVER':
					cur = this.fileMenuCursor;
					if(key == '<'){
						cur.y = 0;
					}else{
						this.changeEditMode('loading', false);
						this.loadList(this.fileListPage, this.fileListLoadLimit);
						this.getActiveModeCursor().y = 0;
						this.drawMenu();
					}
					break;
				case 'LOGIN':
					fcur.y = 0;
					this.loginSNS();
					this.openSNSTab(function(item){
						self.openLoginWindow(item.name);
					});
					break;
				case 'LOGOUT':
					fcur.y = 0;
					this.logoutSNS();
					break;
				default: fcur.y = 0;
			}
		}
		this.drawEventsetBatch();
	},	
	
	baseKeyOnCharBoard: function(key, ext)
	{
		var parser = new LitroSoundParser()
			, fcur = this.titleMenuCursor, ccur = this.charBoardCursor, curr = this.charBoardCurrent
			, cur = this.titleCharCursor, limit = parser.titleMaxLength
			, Ccur = this.charBoardCursor, Climit = this.charBoardLimit
			, word = this.word8
			, title = this.player.title, cha = word.indexOf(Ccur.x + (Ccur.y * Climit.x))
			, maxID = 250
			;
		;
		cha = (cha < 0 ? word.indexOf(word.SPACE_CODE) : cha);
		switch(key){
			case '<': 
				if(ext){
					title = title.substr(0, cur.x) + title.substr(cur.x + 1);
				}else{
					cur.x = cur.x > 0 ? cur.x - 1 : cur.x;
					title = title.substr(0, cur.x) + title.substr(cur.x + 1);
				}
				this.player.title = title.substr(0, limit);
				this.drawCharBoard();
				this.drawCharBoardChar(curr, ccur, true);
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
				this.player.title = title.substr(0, limit);
				this.drawCharBoard();
				this.drawCharBoardChar(curr, ccur, true);
				break;
			case 'select':
				fcur.x = 0;	ccur.x = -1;
				this.drawTitleCursor();
				this.drawCharBoard();
				break;
			case 'space': 
				this.playKeyOn(ext);
				break;
		}
		parser = null;
		
		// this.drawCharBoard();
		// this.drawCharBoardChar(curr, ccur, true);
		
	},

	baseKeyOnTitle: function(key, ext)
	{
		var fcur = this.titleMenuCursor, ccur = this.charBoardCursor, curr = this.charBoardCurrent
			, com = this.setMenuCommandPath()
		;
		if(fcur.x == 0){
			if(key == 'select'){
				ccur.x = 0; fcur.x = 2;
				// this.drawMenuList(this.getFileMenuList());
				this.drawMenuList(this.getActiveModeMenuList());
				this.drawCharBoard();
				this.drawCharBoardChar(curr, ccur, true);
				return true;
			}else{
				switch(com){
					case 'CANCEL':
						this.getActiveModeCursor().y = 0;
						this.titleCharCursor.x = this.titleBackup.length;
						this.player.title = this.titleBackup;
						this.changeEditMode('file');
						this.drawMenu();
						this.drawParamKeys();
						this.drawChannelParams();
	
						break;
					case 'FINISH':
						this.getActiveModeCursor().y = 0;
						if(key == '<'){
							this.getActiveModeCursor().y = 0;
							this.titleCharCursor.x = this.titleBackup.length;
							this.player.title = this.titleBackup;
							this.changeEditMode('file');
							this.drawMenu();
							this.drawParamKeys();
							this.drawChannelParams();
							break;
						}
						this.word8.setLineCols(this.player.titleMaxLength + 1);
						this.player.titleCodes = this.word8.makeStrId(this.player.title);
						this.titleBackup = this.player.title;
						this.changeEditMode('file');
						this.drawMenu();
						this.drawParamKeys();
						this.drawChannelParams();
						break;
				}
				return false;
			}
		}else{
			this.baseKeyOnCharBoard(key, ext);
			return true;
		}
		return false;
	},
	
	baseKeyOnPack: function(key, ext)
	{
		var fcur = this.fileMenuCursor, ccur = this.charBoardCursor
			, menu = this.getPackMenuList(), path = this.getMenuCommandPath()
			, cur = this.getActiveModeCursor(), self = this
			, refreshRight = function(enable){
				self.drawMenu();
				if(enable){
					self.drawPackCursor();
				}}
			, refreshLeft = function(enable){
				self.drawPackedFileList();
				if(enable){
					self.drawFileListCursor();
				}}
			;
		if(key == 'select'){
			this.changeEditMode('file');
			this.drawMenu();
			// this.commonTabKey(true);
			this.clearLeftScreen();
			return;
		}
		
		com = this.baseKeyMenuCommon(fcur, key);
		
		if(key == '<'){
			if(cur.x == 0){
				if(menu.indexOf(com) < 0){return;}
				this.changeEditMode('file');
				this.drawMenu();
				this.clearLeftScreen();
				return;
			}else{
				//file選択
				if(this.popPackFile() == null){
					cur.x = 0;
					refreshRight(true);
					refreshLeft(false);
				}else{
					refreshRight(false);
					refreshLeft(true);
				}
			}
		}else{
			if(cur.x == 0){
				switch(com){
					case 'CANCEL':
						this.changeEditMode('file');
						this.drawMenu();
						this.clearLeftScreen();
						return;
					case 'PACKFILES': cur.x = 1;
						this.drawFileListCursor();
						break;
					case 'SHIP': this.shipPackFiles(); break;
				}
			}else{
				if(this.fileListCursor.y == 0){
					this.clearPackedFiles();
				}else{
					this.pushPackFile(this.fileInListAtIndex(this.fileListCursor.y));
				}
				refreshRight(false);
				refreshLeft(true);
			}
		}
		
		// this.drawMenu();
		// this.drawPackCursor();
	},
	
	baseKeyOnShare: function(key, ext)
	{
		var fcur = this.fileMenuCursor
			, menu = this.getShareMenuList(), path = this.getMenuCommandPath()
			, self = this
			;
		if(key == 'select'){
			this.commonTabKey(true);
			this.clearLeftScreen();
			return;
		}
		com = this.baseKeyMenuCommon(fcur, key);
		if(key == '<'){
			this.changeEditMode('file');
			this.drawMenu();
			this.clearLeftScreen();
			return;
		}else if(key == '>'){
			this.openSNSTab(function(item){
				self.openShareWindow(item.name, self.fileInListAtIndex(self.fileListCursor.y));
			});

		}else{
			return;
		}
		
		this.drawMenu();
		this.drawShareCursor();
	},
	
	baseKeyOnManual: function(key, ext)
	{
		var cur = this.paramCursor, mCur = this.getActiveModeCursor()
			, param = this.ltSoundCommonParamskeys[this.eventsetMenuList[mCur.y]]
			, id = LitroWaveChannel.tuneParamsProp[param].id
			// , id = LitroWaveChannel.tuneParamsID[param]
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

	},
	
	playKeyOn: function(ext)
	{
		var  player = this.player
			, tmpendval = LitroWaveChannel.tuneParamsProp.tmpstart.id
			, cch = player.COMMON_TUNE_CH
			, self = this
			;
		if(ext){return;}
		if(this.getMode() == 'manual'){return;}
		this.initCatchEvent();
		this.initSelect();
		this.drawSelectEvents({time: -1});
		
		if(!player.isPlay()){
			if(ext){
				this.deleteAtTime(cch, player.commonEventTime('tmpend'), 'event');
				this.setEventChange(cch, this.makeEventset('event', tmpendval, this.player.noteSeekTime));
				this.drawEventsetBatch();
			}

			player.setSeekPosition(player.commonEventTime('tmpstart'));
			
			this.updateBackSeek();
			this.editMode = 'play';
			this.drawMenu('play');
			this.drawOscillo();
			this.drawPlayTitle();
			this.player.setOnStopFunc(function(){
				self.stopPlayer();
			});
		}else{
			if(ext){
				this.setEventChange(player.COMMON_TUNE_CH, this.makeEventset('event', LitroWaveChannel.tuneParamsProp.tmpend.id, this.player.noteSeekTime));
				this.drawEventsetBatch();
			}


		}
		this.initFingerState(this.fingers);
		
		if(player.isPlay() == true){
			player.stop();
		}else{
			this.drawStackCallback = function(){
				player.play();
			};
		}
	},
	
	baseKeyOn: function(key, ext)
	{
		var isOk = true;
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
			case 'undo': this.baseKeyOnUndo(key, ext);break;
			case 'file': this.baseKeyOnFile(key, ext);break;
			case 'title': this.baseKeyOnTitle(key, ext);break;
			case 'pack': this.baseKeyOnPack(key, ext);break;
			case 'share': this.baseKeyOnShare(key, ext);break;
			case 'manual': this.baseKeyOnManual(key, ext);break;
			default: break;
		}
		
		if(isOk){
			switch(key){
				case '>': this.playSE('ok'); break;
				case '<': this.playSE('cancel'); break;
			}
			
			this.refreshCurrentNote();
		}
	},
	
	holdKeyCommon: function(key, ext, hold)
	{
		if(key == 'space' && ext){
			this.playLitroTemporary();
			return;
		}else{
			if(key == 'space' && hold){
				return;
			}
			this.baseKeyOn(key, ext);
			
		}
	},
	
	unTrigCommon: function(key, ext)
	{
		if(key == 'space'){
			this.stopLitroTemporary();
			return;
		}else{
//			this.baseKeyOn(key, ext);
		}
	},
	
	moveCursor: function(dir, ext)
	{
		var isMove = false;
		if(scrollByName('bg1').isDrawingInfoStack()){return;}
		switch(this.editMode){
			case 'tune': this.moveChannelParamCursor(dir, ext);break;
			case 'note': this.moveNoteMenuCursor(dir, ext);break;
			case 'play': this.movePlayCursor(dir, ext); break; //this.moveChannelParamCursor(dir, ext);break;
			case 'catch': this.moveCatchCursor(dir, ext);break;
			case 'undo': this.moveUndoCursor(dir, ext);break;
			case 'eventset': this.moveEventsetCursor(dir, ext);break;
			case 'file': this.moveFileMenuCursor(dir, ext);break;
			case 'title': this.moveTitleMenuCursor(dir, ext); break;
			case 'pack': this.movePackMenuCursor(dir, ext);break;
			case 'share': this.moveShareMenuCursor(dir, ext);break;
			case 'manual': this.moveManualMenuCursor(dir, ext);break;
			// case 3: this.baseKeyOnChannel(dir);break;
		}
		
		this.refreshCurrentNote();
		isMove = true;
		if(this.editMode == 'catch'){
			isMove = false;
		}
		if(isMove){
			this.playSE('cursor');
		}
		
	},
	
	zoomKeyOn: function(key, ext)
	{
		var r = this.noteRangeScale
			, c = this.noteRangeCells
			, p = 0
			, max = this.NOTE_RANGE_SCALE_MAX
			, min = this.NOTE_RANGE_SCALE_MIN
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
		
		scrollByName('bg2').clearDrawInfoStack();//表示待ちをクリア
		
		this.drawZoomScale(this.noteRangeScale);
		this.updateForwardSeek();
		this.drawEventsetBatch();
		
		this.sePlayRhythm(this.scale2bpm(this.noteRangeScale));

	},
	
	keycheck: function(){
		var state, hold, trigs, untrigs, chars, cont = this.keyControll
			, ext_s = cont.getState('ext'), i, key
			, getTrig = function(t){return cont.getTrig(t);}
			, getUntrig = function(t){return cont.getUntrig(t);}
			, getHold = function(t){return cont.getHold(t);}
			, getState = function(t){return cont.getState(t);}
			, ckeys = [], klen, rowKeys, rowlen
		;
		chars = this.ROW_CHARS;
		rowKeys = this.keyCkeys.row; rowlen = rowKeys.length;
		for(row = 0; row < rowlen; row++){
			ckeys = chars[rowKeys[row]]; klen = ckeys.length;
			for(i = 0; i < klen; i++){
				key = ckeys[i];
				if(getTrig(key)){
					this.onCode(key);
				}
				if(getUntrig(key)){
					this.offCode(key);
				}
			}
		}
		
		chars = this.OCTAVE_KEYCODE;
		ckeys = this.keyCkeys.octave; klen = ckeys.length;
		for(i = 0; i < klen; i++){
			key = ckeys[i];
			trigs = getTrig(key);
			untrigs = getUntrig(key);
			if(trigs){
				if(key == '^' || key == '+' ){
					this.incOctave();
				}
				if(key == '-'){
					this.decOctave();
				}
				if(this.octaveEvent != null){
					this.octaveEvent();
				}
				this.drawOnBaseKey(key, true);
			}
			if(untrigs){
				this.drawOnBaseKey(key, false);
			}
		}

		//カーソル移動
		ckeys = this.corsolKeys; klen = ckeys.length;
		for(i = 0; i < klen; i++){
			key = ckeys[i];
			if(getTrig(key) || getHold(key)){
				this.moveCursor(key, ext_s);
			}
		}
		// this.corsolKeys.forEach(function(key){
		// }, this);
		
		if(getTrig('select') && ext_s){
			captureScreen('view');
			return;
		}
		
		//操作キー
		ckeys = this.baseKeys; klen = ckeys.length;
		for(i = 0; i < klen; i++){
			key = ckeys[i];
			hold = getHold(key);
			if(getTrig(key) || hold){
				this.holdKeyCommon(key, ext_s, hold);
				this.drawOnBaseKey(key, true);
			}
			if(getUntrig(key)){
				this.unTrigCommon(key, ext_s);
				this.drawOnBaseKey(key, false);
			}
		}
		//ズームキー
		ckeys = this.zoomKeys; klen = ckeys.length;
		for(i = 0; i < klen; i++){
			key = ckeys[i];
			if(getTrig(key) || getHold(key)){
				this.zoomKeyOn(key, ext_s);
				this.drawOnBaseKey(key, true);
			}
			if(getUntrig(key)){
				this.drawOnBaseKey(key, false);
			}
		}
		if(getState('[') && getState(']')){
			this.zoomKeyOn('[]', ext_s);
		}
		
		if(getTrig('ext') ||getUntrig('ext')){
			this.drawOnBaseKey('ext', ext_s);
		}
		// console.timeEnd('chars');
	},
	
	//全てのエンベロープが終了した時の処理
	envelopeCheck: function()
	{
		// var channels = this.player.channel, ch
		// ;
		// for(ch = 0; ch < channels.length; ch++){
			// if(channels[ch].envelopeEnd == false){
				// return false;
			// }
		// }
		// this.referChannel = null;
		// return true;
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
	
	playSE: function(key)
	{
		var se = this.sePlayer;
		switch(key){
			case 'ok': se.playForKey(0); break;
			case 'cursor': se.playForKey(1); break;
			case 'cancel': se.playForKey(2); break;
		}
	},
	
	//TODO makeSpriteChunk制にする
	openFrame: function()
	{
		var self = this;
		scrollByName('bg1').clear(null, makeRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT / 2));
		this.clearLeftScreen();
		this.frameChunks.forEach(function(chunk){
			var rect = chunk.rect;
			// console.log(rect.x, rect.y, rect.w, rect.h);
			// this.drawFrameLine(chunk.sprite, rect.x, rect.y, rect.w, rect.h);
			// console.log(chunk);
			self.drawFrameLayout(chunk.sprites, chunk.cx, chunk.cy);
		}, this);
		
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
		
		this.drawEventsetBatch();
		
		this.drawOnBaseKey(null, false);
		
	},
	
	drawSeek: function()
	{
		var sprites = this.iconSprites, mode = this.editMode
			, waitTable = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1]
			, seekTable = [0, 0, 0, 0, 1, 2, 2, 2, 2, 1]
			, waitSprite = [sprites.seekWait1, sprites.seekWait2, sprites.seekWait3]
			, seekSprite = [sprites.seek1, sprites.seek2, sprites.seek3]
			, sprite = mode == 'note' || mode == 'eventset' || mode == 'catch' || this.player.isPlay()
			 ? seekSprite[seekTable[((this.drawNotesCount / 4) % seekTable.length) | 0]]
			 : waitSprite[waitTable[((this.drawNotesCount / 10) % waitTable.length) | 0]]
			, arrow = sprites.arrow
			, arrow_l = sprites.arrow_l
			, bar = sprites.seekBar
			, scr = scrollByName('sprite')
			, mc = this.seekCmargin
			, i, ch = this.editChannel()
			, min_y, max_y
			, centerPos = (cellhto(this.noteRangeCells) * this.noteRange / 2)
			// , x = (this.player.noteSeekTime) * this.noteRange * (cellhto(this.noteRangeCells) / this.noteRangeScale)
			, x = this.seekPosition(), y
			, px = Math.sin(this.seekLineCount * (Math.PI / DISPLAY_HEIGHT) * 16) * 4
			, arrowDisps = {'note': 0, 'catch': 0, 'eventset': 0}
		;
		x = x < centerPos? x : centerPos;
		scr.drawSprite(sprite, cellhto(mc.x) + x, mc.y);
		if(this.getMode() in arrowDisps){
			scr.drawSprite(arrow, cellhto(mc.x + 2) + x + px, mc.y);
			arrow_l.hflip(true);
			scr.drawSprite(arrow_l, cellhto(mc.x - 2) + x - px, mc.y);
		}
		
		x = cellhto(mc.x + 2) + x - 1;
		min_y = cellhto(2);
		max_y = (cellhto(this.octaveRangeCells + 2) / 2) + min_y;
		// bar.swapColor(COLOR_ARRAY[ch], COLOR_WHITE);
		bar.setSwapColor(COLOR_ARRAY[ch], COLOR_WHITE);
		
		for(i = -4; i < 0; i++){
			y = (((this.seekLineCount * 30) + (this.seekLineCount * 16) + 80) % ((DISPLAY_HEIGHT) | 0));
			y = (DISPLAY_HEIGHT - y) + cellhto(i * 2);

			if(y >= max_y || y < min_y){continue;}
			scr.drawSprite(bar, Math.round(x), y);
			
		}
		
		this.seekLineCount = (this.seekLineCount + 1) % DISPLAY_HEIGHT;
	},
	
	drawEnvelopeBeam: function()
	{
		var scr = scrollByName('sprite')
			, mc = this.seekCmargin
			, ncm = this.noteCmargin
			, sprites = {
				a: this.frameSprites.envelopeBeam1
				, b: this.frameSprites.envelopeBeam2
				, c: this.frameSprites.envelopeBeam_s
			},
			cto = cellhto
			, self = this
			, player = this.player
			, t2p = function(t){return self.time2pixel(t);}
			, ch = this.editChannel()
			, cnote = this.getCurrentNote()
			, clk = this.envelopeBeamClock
			// , centerPos = (cto(this.noteRangeCells) * this.noteRange / 2)
			, baseX = t2p(cnote.time - this.pixel2time(this.noteScrollPos.x)) 
			, baseY = cto(ncm.y - (this.noteCurrentHeight(cnote.value)) / 2) + cto(1)
			, cycle = (player.channel[ch].envelopeDistance() / MIN_CLOCK) | 0, mul = 2
			, ampSize = WAVE_VOLUME_RESOLUTION
			, envelopes = player.getEnvelopes(ch)
			, sumDist = t2p(player.channel[ch].envelopeDistance())
			, dists = {
				a: t2p(envelopes.attack), 
				b: t2p(envelopes.hold), 
				c: t2p(envelopes.decay), 
				d: t2p(envelopes.length), 
				e: t2p(envelopes.release), 
			}
			, fdists = {}
			, vol = envelopes.volumeLevel
			, sus = envelopes.sustain
			;
			fdists.a = dists.a;
			fdists.b = fdists.a + dists.b;
			fdists.c = fdists.b + dists.c;
			fdists.d = fdists.c + dists.d; 
			fdists.e = fdists.d + dists.e;
			function beam(clock, sprite){
				var y = baseY
					, x = baseX
					, pos = ((sumDist / cycle) * clock) | 0
					, color
				;
				if(pos < 0){
					return;
				}
				if(pos < dists.a){
					color = COLOR_ARRAY[0];
					y -= dists.a == 0 ? vol * mul : (vol - ((vol / ampSize) * (((fdists.a - pos) / dists.a) * ampSize))) * mul;
					// console.log(vol, ampSize, fdists.a, pos, mul);
				}else if(pos < fdists.b){
					color = COLOR_ARRAY[2];
					y -= vol * mul;
				}else if(pos < fdists.c){
					color = COLOR_ARRAY[4];
					y -= dists.c == 0 ? sus * mul : (sus + (((vol - sus) / ampSize) * (((fdists.c - pos) / dists.c) * ampSize))) * mul;
				}else if(pos < fdists.d){
					color = COLOR_ARRAY[5];
					y -= sus * mul;
				}else if(pos < fdists.e){
					color = COLOR_ARRAY[6];
					y -= dists.e == 0 ? 0 : (((sus / ampSize) * (((fdists.e - pos) / dists.e) * ampSize))) * mul;
				}else{
					color = COLOR_ARRAY[0];
				}
					
				// console.log(this.getCurrentNote().time);
				// x = x < centerPos? x : centerPos;
				x += cto(mc.x) + pos + 8;
				// console.log(dDist);
				sprite.setSwapColor(color, COLOR_WHITE);
				scr.drawSprite(sprite, Math.round(x), Math.round(y));
				sprite = null;
			};
			beam(clk, (((clk) / 10) | 0) % 2 == 0 ? sprites.a : sprites.b);
			beam((clk + cycle - 4) % cycle, sprites.c);
			beam((clk + cycle - 8) % cycle, sprites.c);
			this.envelopeBeamClock = (clk + 1) % cycle;
			cto = null;
			t2p = null;
			self = null;
			player = null;
			beam = null;
	},

	
	drawScoreBoard: function(bottom)
	{
		var scr = scrollByName('bg3')
			// , i, xc, s
			, xCells = (DISPLAY_WIDTH / cellhto(1)) | 0
			, len
			, btmOffset
			, sprites = this.frameSprites
			;
		bottom == bottom == null ? false : bottom;
		btmOffset = bottom ? (DISPLAY_HEIGHT / 2) | 0 : 0;
		
		scr.drawSpriteChunk(sprites.scoreTune4, 0, btmOffset);
		scr.drawSpriteChunk(sprites.scoreBoard4, 0, cellhto(2) + btmOffset);
	},
	
	// drawTitleCursor: function()
	// drawCharBoardCursor: function()
	drawTitleCharCursor: function()
	{
		var cm = this.paramskeysCmargin
			, cur = this.titleCharCursor, word = this.word8
			// , cur = this.fileTitleCursor, word = this.word8
		;
		this.paramCursorBlinkFlag = !this.paramCursorBlinkFlag;
		if(this.paramCursorBlinkFlag){return;}
		// word.setFontSize('8px');
		word.setMarkAlign('vertical');
		word.setMaxRows(2);
		word.setLineCols(32);
		word.setScroll(scrollByName('sprite'));
		
		word.print('　', cellhto(cm.x + cur.x), cellhto(cm.y + 0), COLOR_BLACK, COLOR_NOTEFACE);
		word.print('　', cellhto(cm.x + cur.x), cellhto(cm.y + 1), COLOR_BLACK, COLOR_NOTEFACE);
		word.setMarkAlign('holizon');
		// this.drawMenuListCursor(menu, this.titleCharCursor.y);
	},
	
	drawCharBoardChar: function(clpos, pos, neg)
	{
		var scr = scrollByName('bg1')
			, word = this.word8, x, y, i = 0
			, cm = this.charBoardCmargin
			, tcm = this.paramskeysCmargin
			, dispNum = this.charBoardDispNum
			, code = pos.x + ((pos.y) * dispNum.x)
			, spr, tspr, rev
			, maxID = 250
		;
		// console.log(((pos.y - clpos.y) * 2) + cm.y, pos.y);
		function setsprite(code, reverse){
			var sprite = makeSprite(word.imageName, code);
			sprite.swapColor(reverse ? COLOR_BLACK : COLOR_NOTEFACE, COLOR_FONT8);
			sprite.swapColor(reverse ? COLOR_NOTEFACE : COLOR_BLACK, COLOR_TRANSPARENT);
			return sprite;
		}
		
		neg = neg == null ? false : neg;
		
		this.presetWordFormat('charboard');
		
		// rev = pos.x == x && pos.y - clpos.y == y ;
		if(code in word.soundmarks){
			tspr = setsprite(code, neg);
			spr = setsprite(word.soundmarks[code], neg);
		}else{
			tspr = setsprite(word.SPACE_CODE, neg);
			spr = setsprite(code, neg);
		}
		// if(neg)console.log(code);
		x = cellhto(pos.x + cm.x);
		y = cellhto(((pos.y - clpos.y) * 2) + cm.y);
// 		
		// scr.drawSprite(tspr, x, y);
		// scr.drawSprite(spr, x, y + cellhto(1));
		
		word.print([code < maxID ? code : word.SPACE_CODE], x, y + cellhto(1)
			, neg ? COLOR_BLACK : COLOR_NOTEFACE
			, neg ? COLOR_NOTEFACE : COLOR_BLACK
			);
		
		
		word.setMarkAlign('holizon');
		// scr.drawSprite(tspr, cellhto(1), cellhto(1));
	},

	drawCharBoard: function()
	{
		var scr = scrollByName('bg1')
			, word = this.word8, x, y, i = 0, id
			, cm = this.charBoardCmargin
			, tcm = this.paramskeysCmargin
			, dispNum = this.charBoardDispNum
			, ofstr = this.charBoardCurrent.y * dispNum.x
			, chrNum, hiphens = '', spaces = ''
			, maxID = 250
			, parser = new LitroSoundParser()
			, ids = []
		;
		
		this.presetWordFormat('charboard');
		word.print(this.player.title, cellhto(cm.x), cellhto(tcm.y + 1), COLOR_NOTEFACE, COLOR_BLACK);
		
		for(x = 0; x < parser.titleMaxLength - this.player.title.length; x++){
			spaces += '　';
			hiphens += '－';
		}
		word.print(spaces, cellhto(cm.x + this.player.title.length), cellhto(tcm.y + 1), COLOR_NOTEFACE, COLOR_BLACK);
		word.print(hiphens, cellhto(cm.x + this.player.title.length), cellhto(tcm.y + 1.25), COLOR_NOTEFACE, COLOR_BLACK);
		// y = cellhto(0.25);
		
		for(y = 0; y < dispNum.y; y++){
			ids[y] = [];
			for(x = 0; x < dispNum.x; x++){
				id = i + ofstr;
				ids[y].push(id < maxID ? id : word.SPACE_CODE);
				i++;
			}
		}
		word.print(ids, cellhto(cm.x), cellhto(cm.y + 1));
		word.setMarkAlign('horizon');
		parser = null;
	},	
	
	drawThumbVolume: function()
	{
		var scr = scrollByName('sprite')
			, sprs = this.titleSprites, image = this.uiImageName
			, cm = this.titleVolCmargin
			, vol = this.player.volume(), thumbSep = this.VOLUME_INC
			, max = this.VOLUME_MAX, min = this.VOLUME_MIN
			, bcell = (cellhto(2) - ((vol / this.VOLUME_MAX) * cellhto(2))) | 0
			, thumbRot = ((vol / thumbSep) | 0)
			// , thumbSpr = thumbRot % 2 == 0 ? makeSprite(image, sprs.thumb_1) : makeSprite(image, sprs.thumb_2)
			, thumbSpr = thumbRot % 2 == 0 ? this.iconSprites.thumb1 : this.iconSprites.thumb2
		;
		if(this.editMode == 'tune'){
			return;
		}
		thumbSpr.rot(((thumbRot / 2) | 0) % 4);
		scr.drawSprite(thumbSpr, cellhto(cm.x), cellhto(cm.y));
		scr.drawSprite(makeSprite(image, sprs.vol), cellhto(cm.x), cellhto(cm.y));
		scr.drawSprite(makeSprite(image, sprs.gauge), cellhto(cm.x + 2), cellhto(cm.y));
		scr.clear(COLOR_BLACK, makeRect(cellhto(cm.x + 4) -  bcell, cellhto(cm.y), bcell, cellhto(2)));
	},
	
	drawThumbClock: function(){
		var scr = scrollByName('sprite')
			, sprs = this.titleSprites, image = this.uiImageName
			, cm = this.titleVolCmargin
			, crate = this.litroSound.clockRate
			, bcell = cellhto(1)
		;
		if(this.editMode == 'tune'){
			return;
		}

		crate += 0.001;
		this.word.setFontSize('4v6px');
		this.word.print('R:' + str_pad(crate, 4, '0', 'STR_PAD_RIGHT'), cellhto(cm.x), cellhto(cm.y - 2), COLOR_WHITE, COLOR_BLACK);
		// this.word.print('RATE:' + str_pad(sec, 2, '0', 'STR_PAD_LEFT'));
		
		
	},
	
	drawPlayTitle: function()
	{
		var scr = scrollByName('bg1')
			, word = this.word8, x, y, i = 0
			, tcm = this.titleCmargin
			, title = this.player.title != null ? this.player.title : ''
			, str_t = title.substr(0, 16)
			, str_b = title.substr(16, 16)
			, user = this.player.fileUserName.substr(0, 16)
			, titleSpr = this.iconSprites.title
			, userSpr = this.iconSprites.user
			// , titleSpr = makeSprite(this.uiImageName, this.titleSprites.title)
			// , userSpr = makeSprite(this.uiImageName, this.titleSprites.user)
		;
		this.clearLeftScreen();
		scr.drawSprite(titleSpr, cellhto(tcm.x), cellhto(tcm.y));
		scr.drawSprite(userSpr, cellhto(tcm.x), cellhto(tcm.y + 4));
		
		// word.setFontSize('8px');
		word.setScroll(scr);
		word.setMaxRows(2);
		word.setLineCols(32);
		word.setMarkAlign('horizon');
		word.setMarkAlign('vertical');
		word.print(str_t, cellhto(tcm.x + 2), cellhto(tcm.y + 1), COLOR_NOTEFACE, COLOR_BLACK);
		word.print(str_b.length == 0 ? '' : '' + str_b , cellhto(tcm.x + 1), cellhto(tcm.y + 3), COLOR_NOTEFACE, COLOR_BLACK);
		word.print(user, cellhto(tcm.x + 2), cellhto(tcm.y + 5), COLOR_WHITE, COLOR_BLACK);
		word.setMarkAlign('horizon');
	},
	
	drawPlayOnSpacekey: function()
	{
		var scr = scrollByName('bg1')
			, word = this.word8, x, y, i = 0
			, cm = this.charBoardCmargin
			, tcm = this.paramskeysCmargin
		;
		this.clearLeftScreen();
		// word.setFontSize('8px');
		word.setScroll(scr);
		// word.setLineCols(this.player.titleMaxLength);
		word.setMarkAlign('horizon');
		word.print('play: ', cellhto(cm.x), cellhto(tcm.y + 2), COLOR_PARAMKEY, COLOR_BLACK);
		word.print('*SPACE KEY*', cellhto(cm.x + 6), cellhto(tcm.y + 2), COLOR_ARRAY[3], COLOR_BLACK);
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
			, sprite, esp
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
			// sprite = makeSprite(this.uiImageName, this.noteSprite + ch);
			sprite = rot != 3 ? this.noteSprite[ch] : this.rnoteSprite[ch];
		}else if(this.eventSprite[type] == null){
			y = 0;
			sprite = this.eventsetSprite[ch];
			sprite.swapColor(COLOR_ARRAY[ch], COLOR_WHITE);
			sprite.swapStart();
		}else{
			y = 0;
			// sprite = makeSprite(this.uiImageName, esp.id);
			esp = this.eventSprite[type];
			sprite = esp.sprite;
			if(esp.swap){
				sprite.swapColor(COLOR_ARRAY[ch], COLOR_WHITE);
				sprite.swapStart();
			}
			x += esp.ofx;
		}
		// sprite.rot(rot);

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
		if(this.player.channel == null){
			return;
		}
		catchMode = catchMode == null ? false : catchMode;
		page = page == null ? this.noteScrollPage | 0 : page;
		var bottom = (page % 2 == 0) ? false : true
		;
		if(!catchMode){
			this.clearNoteLayer(bottom);
			// this.drawScoreBoard(bottom);
		}else{
			this.blinkDrawEventset = [];
		}

// console.log(catchMode, page);
// console.time('drawData');
		this.drawDataScroll(page, catchMode, this.player.eventsetData);
// console.timeEnd('drawData');
	},
	
	clearNoteLayer: function(bottom)
	{
		var bg = scrollByName('bg2'), w = DISPLAY_WIDTH, h = DISPLAY_HEIGHT / 2;
		if(bottom){
			bg.clear(null, makeRect(0, h, w, h));
		}else{
			bg.clear(null, makeRect(0, 0, w, h));
		}
	},
	
	drawDataScroll: function(page, catchMode)
	{
		var eventset, settype, data, ch, i, chlen, x, y, note, noref, drawCnt = 0, noteCnt = 0
			, type, typelen, ty
			, tuneWrited = {}, chSort = []
			, bottom = (page % 2 == 0) ? false : true
			, scrollTop = !bottom ? 0 : (DISPLAY_HEIGHT / 2)
			, testcolor = !bottom ? COLOR_ADD : COLOR_PARAMKEY
			, cellTime = this.noteRangeScale / this.noteRangeCells
			, divofsTime = 0
			, catchData = this.catchEventset
			, channelsData = this.player.eventsetData
			// , channelsData = this.sePlayer.eventsetData
			, channels = this.player.channel
			, drawnNotes = {}
			
			, times, ti, timelen
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
		chlen = channelsData.length;
		for(ch = 0; ch < chlen; ch++){
			if(this.editChannel() != ch){chSort.push(ch);}
		}
		chSort.push(this.editChannel());
		
		for(i = 0; i < chlen; i++){
			ch = chSort[i];
			if(!channels[ch].isEnable()){continue;}
			tuneWrited = {};
			// types = channelsData[ch];
			types = Object.keys(channelsData[ch]);
			typelen = types.length;
			for(ty = 0; ty < typelen; ty++){
				type = types[ty];
				if(!catchMode){
					//プレイヤー
					data = channelsData[ch][type];
				}else{
					if(ch != (this.selectNote.ch | 0)){
						break;
					}
					//キャッチ
					data = catchData[type];
				}
				if(data == null){continue;}
				times = Object.keys(data);
				timelen = times.length;
				for(ti = 0; ti < timelen; ti++){
					t = times[ti];
				// Object.keys(data).forEach(function(t){
				// }, this);
				//(t in data){
					if(t in tuneWrited && type in LitroWaveChannel.tuneParamsProp){
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
	drawEventsetBatch: function(page){
		page = page == null ? this.noteScrollPage : page;
		this.drawNoteScroll(page);
		this.drawNoteScroll(page + 1);
		this.drawNoteScroll(null, true);
	},
	
	//共通メニュー表示
	drawMenuList: function(list)
	{
		var cm = this.menuDispCmargin
			, indent = this.menuCindent
			, word = this.word8, sublen = 10
			, i
		;
		if(list == null){
			list = ['？？？'];
		}
		
		// console.log(list);
		// word.setFontSize('8px');
		word.setScroll(scrollByName("bg1"));
		word.setLineCols(sublen);

		for(i = 0; i < list.length; i++){
			word.print(list[i].substr(0, 10), cellhto(cm.x + indent), cellhto(cm.y + i), COLOR_PARAMKEY, COLOR_BLACK);
		}		
	},
	
	drawCatchType: function(type)
	{
		var menu = this.getMenuList('catch_select')
			, indent = this.menuCindent
			, cm = this.menuDispCmargin
			, cur = this.paramCursor, word = this.word8
			;
		type = type == null ? this.catchType : type;
		// word.setFontSize('8px');
		word.setScroll(scrollByName('bg1'));
		word.print('CATCH', cellhto(cm.x + indent), cellhto(cm.y + 2), COLOR_PARAMKEY, COLOR_BLACK);
		word.print('　TYPE：', cellhto(cm.x + indent), cellhto(cm.y + 3), COLOR_PARAMKEY, COLOR_BLACK);
		word.print(type, cellhto(cm.x + indent), cellhto(cm.y + 4), COLOR_ARRAY[cur.x], COLOR_BLACK);
		
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
			, player = this.player
			// , player = this.sePlayer
			, size = {w: 16, h: 12}
			, left = {x: 4, y: 2}, right = {x: size.w + 4, y: 2}
			, cm = side == 'left' ? right : left
			, scroll = scrollByName('bg1'), word = this.word8
			, eventset = player.getEventsFromTime(events.ch, events.time)
			, key, keys = [], i
			, rows = 10
		;
		this.blinkDrawParams = [];
		if(events.time < 0){
			scroll.clear(null, makeRect(cellhto(left.x), cellhto(left.y), cellhto(size.w * 2), cellhto(size.h)));
			return;
		}
		keys = this.intersectParamKeys(eventset);
		
		// word.setFontSize('8px');
		word.setScroll(scroll);
		scroll.clear(side == 'left' ? null : COLOR_BLACK, makeRect(cellhto(left.x), cellhto(left.y), cellhto(size.w), cellhto(size.h)));
		scroll.clear(side == 'left' ? COLOR_BLACK : null, makeRect(cellhto(right.x), cellhto(right.y), cellhto(size.w), cellhto(size.h)));
		word.print('　T:' + player.noteSeekTime, cellhto(cm.x), cellhto(cm.y), COLOR_NOTEFACE, COLOR_BLACK);
		this.drawParamKeys(0, rows, cm.x + 1, cm.y + 2, keys);
		this.drawChannelParams(0, rows, cm.x + 5 + 1, cm.y + 2, eventset, events.ch);
		this.drawParamKeys(rows, rows, cm.x + 8 + 1, cm.y + 2, keys);
		this.drawChannelParams(rows, rows, cm.x + 13 + 1, cm.y + 2, eventset, events.ch);
	},
	
	drawCatchMenu: function()
	{
		var menu;

		if(this.getLastCommand() == 'KEEP'){
			menu = this.getMenuList('catch_keep');
			this.drawMenuList(menu);
		}else{
			menu =  this.catchMenuList;
			this.drawMenuList(menu);
			this.drawCatchType(this.catchType);
		}
		// this.drawSelectEvents(this.selectNote);
		this.drawMenuListCursor(this.getActiveModeMenuList(), this.getActiveModeCursor().y);
	},
	
	drawNoteMenu: function()
	{
		var menu = this.getMenuList('note');
		this.drawMenuList(menu);
		this.drawNoteCursor();
	},	
	
	drawEventsetMenu: function()
	{
		var menu = this.getMenuList('eventset')
		, cur = this.eventsetMenuCursor
		, key = menu[cur.y]
		, type = this.ltSoundCommonParamskeys[key]
		, esp = this.eventSprite[type] != null ? this.eventSprite[type] : this.eventsetSprite[this.editChannel()]
		// , icon = makeSprite(this.uiImageName, esp.id)
		, icon = esp.sprite
		, cm = this.modeSubCmargin
		;
		
		if(esp.swap){
			// icon.swapColor(COLOR_ARRAY[this.editChannel()], COLOR_WHITE);
			icon.setSwapColor(COLOR_ARRAY[this.editChannel()], COLOR_WHITE);
		}
		this.drawMenuList(menu);
		this.drawMenuListCursor(this.eventsetMenuList, cur.y);
		scrollByName('bg1').clear(COLOR_BLACK, makeRect(cellhto(cm.x), cellhto(cm.y), cellhto(2), cellhto(2)));
		scrollByName('bg1').drawSprite(icon, cellhto(cm.x), cellhto(cm.y));
		
	},
	
	drawUndoMenu: function()
	{
		var menu = this.getActiveModeMenuList()
			, indent = this.menuCindent
			, cm = this.menuDispCmargin
			, cur = this.getActiveModeCursor(), word = this.word8
			, histstr_1, histstr_2
			;
		this.drawMenuList(menu);
		
		this.drawMenuListCursor(menu, cur.y);
		
		word.setScroll(scrollByName('bg1'));
		// word.print('TYPE：', cellhto(cm.x + indent), cellhto(cm.y + 3), COLOR_PARAMKEY, COLOR_BLACK);		
		if(this.editHistory.length > 0){
			histstr_1 = 'HISTORY:';
			histstr_2 = formatNum(cur.x + 1, 2) + '/' + formatNum(this.editHistory.length, 2);
		}else{
			histstr_1 = 'NO';
			histstr_2 = ' HISTORY';
		}
		word.print(histstr_1, cellhto(cm.x + indent), cellhto(cm.y + 3), COLOR_PARAMKEY, COLOR_BLACK);
		word.print(histstr_2, cellhto(cm.x + indent), cellhto(cm.y + 4));
		
	},
	
	drawFileMenu: function()
	{
		var menu = this.getFileMenuList(),
			 cm = this.menuDispCmargin,
			 indent = this.menuCindent,
			 bg = scrollByName('bg1'),
			 spr = this.loginParams.sns_type != null ? makeSprite(this.snsImageName, this.snsIconId[this.loginParams.sns_type]) : null
		;
		if(menu == null){
			menu = ['？？？'];
		}
		
		this.drawMenuList(menu);
		this.drawFileCursor();
		if(spr != null && this.getLastCommand() != 'TITLE'){
			bg.drawSprite(spr, cellhto(this.modeSubCmargin.x), cellhto(this.modeSubCmargin.y));
			this.drawMenuListCursor(this.getActiveModeMenuList(), this.getActiveModeCursor().y);
		}
		
		if(this.commandPath.indexOf('LOAD') > -1){
			this.word8.print('LOAD', cellhto(cm.x + indent), cellhto(cm.y + 4), COLOR_ARRAY[3], COLOR_BLACK);
		}else if(this.commandPath.indexOf('SAVE') > -1){
			this.word8.print('SAVE', cellhto(cm.x + indent), cellhto(cm.y + 4), COLOR_ARRAY[0], COLOR_BLACK);
		}
	},
	
	drawTitleMenu: function()
	{
		var menu = this.getTitleMenuList(),
			 bg = scrollByName('bg1')
		;
		if(menu == null){
			menu = ['？？？'];
		}
		this.drawMenuList(menu);
		this.drawTitleCursor();
	},
	
	drawPackMenu: function(enableCur)
	{
		var menu = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			, now = this.packedFiles.length
			, max = this.packMaxSize
			, print = '00'.slice((now + '').length) + now + '/' + max
			, mc = this.menuDispCmargin
			;
		this.drawMenuList(menu);
		enableCur = enableCur == null ? false : enableCur;
		
		this.word8.print(print, cellhto(mc.x + 1), cellhto(mc.y + 5), now >= max ? COLOR_ARRAY[0] : COLOR_PARAMKEY, COLOR_BLACK);
		if(enableCur){
			this.drawMenuListCursor(this.getActiveModeMenuList(), this.getActiveModeCursor().y);
		}
		
	},
	drawShareMenu: function()
	{
		var menu = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			;
		this.drawMenuList(menu);
		this.drawMenuListCursor(this.getActiveModeMenuList(), this.getActiveModeCursor().y);
	},
	
	drawNoteCursor: function()
	{
		this.drawMenuListCursor(this.getMenuList('note'), this.noteMenuCursor.y);
	},
	
	//共通メニューカーソル表示
	drawMenuListCursor: function(list, y)
	{
		var keyCm = this.menuDispCmargin
			, indent = this.menuCindent
			, word = this.word8, sublen = 10
			;
		if(list == null){
			list = ['？？？'];
		}
		if(list[y] == null){
			y = 0;
			
		}
		// word.setFontSize('8px');
		word.setScroll(scrollByName('bg1'));
		word.setLineCols(sublen);
		word.print(list[y], cellhto(indent + keyCm.x), cellhto(keyCm.y + y), COLOR_BLACK, COLOR_PARAMKEY);
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
	
	drawTitleCursor: function()
	{
		var menu = this.getTitleMenuList()
			, com = this.getLastCommand();
			;

		if(menu == null){
			menu = ['？？？'];
		}
		this.drawMenuListCursor(menu, this.titleMenuCursor.y);
	},
	
	drawFileListCursor: function()
	{
		var cur = this.fileListCursor, offset = this.fileListOffset
			, word = this.word8, cm = this.channelParamsCmargin
			, title, list = this.player.fileList()
			, file = list[Object.keys(list)[cur.y]]
			;
			
			// console.log(offset, cur.y);
			// word.setFontSize('8px');
			word.setScroll(scrollByName('bg1'));
			word.setLineCols(16);
			word.setMaxRows(1);
			if(file == null){return;}
			// console.log(file, cur);
			title = file.title.substr(0, 16);
			word.print(title == '' ? '　' : title, cellhto(cm.x), cellhto(cm.y + cur.y - offset), COLOR_BLACK, cur.y == 0 ? COLOR_ARRAY[0] : COLOR_NOTEFACE);
	},
	
	drawPackCursor: function()
	{
		var cur = this.packMenuCursor, offset = this.fileListOffset
			, menu = this.getPackMenuList()
			, word = this.word8, cm = this.channelParamsCmargin
			, title, list = this.player.fileList()
			, file = list[Object.keys(list)[cur.y]]
			;
			
			this.drawMenuListCursor(menu, cur.y);
	},
	
	drawShareCursor: function()
	{
		var cur = this.packMenuCursor, offset = this.fileListOffset
			, menu = this.getShareMenuList()
			, word = this.word8, cm = this.channelParamsCmargin
			, title, list = this.player.fileList()
			, file = list[Object.keys(list)[cur.y]]
			;
			this.drawMenuListCursor(menu, cur.y);
	},
	
	// drawParamCursorBlink: function(toggle, scrollName)
	drawParamCursorBlink: function()
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent, word = this.word8
			, paramCm = this.channelParamsCmargin
			, keyCm = this.paramskeysCmargin
			, key = ""
			
		;
		this.paramCursorBlinkFlag = !this.paramCursorBlinkFlag;
		// word.setFontSize('8px');
		word.setScroll(scrollByName('sprite'));
		
		key = this.paramKeys[cur.y];
		color = COLOR_BLACK;
		bgcolor = COLOR_PARAMKEY;
		word.print(key.substr(0, this.paramKeysStrLen), cellhto(keyCm.x), cellhto(keyCm.y + curr.y), color, bgcolor);
		if(this.paramCursorBlinkFlag){
			color = COLOR_BLACK;
			bgcolor = COLOR_ARRAY[cur.x];
			param = this.player.channel[cur.x].tune(this.ltSoundChParamKeys[key]);
			word.print(formatNum(param.toString(16), 2), cellhto(paramCm.x + (cur.x * 2)), cellhto(paramCm.y + curr.y), color, bgcolor);
		}else{
			word.print('  ', cellhto(paramCm.x + (cur.x * 2)), cellhto(paramCm.y + curr.y), COLOR_ARRAY[cur.x], COLOR_ARRAY[cur.x]);
		}
	},
	
	drawParamCursor: function(enable)
	{
		var keyCm = this.paramskeysCmargin
			, paramCm = this.channelParamsCmargin
			, cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, key = "", word = this.word8
			, color
			, bgcolor
			;
		if(this.editMode == 'play'){return;}
		enable = enable == null ? true : enable;
		key = this.paramKeys[cur.y];
		
		// word.setFontSize('8px');
		word.setScroll(scrollByName('bg1'));
		color = enable ? COLOR_BLACK : COLOR_PARAMKEY;
		bgcolor = enable ? COLOR_PARAMKEY : COLOR_BLACK;
		word.print(key.substr(0, this.paramKeysStrLen), cellhto(keyCm.x), cellhto(keyCm.y + curr.y), color, bgcolor);
		
		color = enable ? COLOR_BLACK : COLOR_ARRAY[cur.x];
		bgcolor = enable ? COLOR_ARRAY[cur.x] : COLOR_BLACK;
		param = this.player.channel[cur.x].tune(this.ltSoundChParamKeys[key]);
		word.print(formatNum(param.toString(16), 2), cellhto(paramCm.x + (cur.x * 2)), cellhto(paramCm.y + curr.y), color, bgcolor);
			
	},
	
	currentTitleIndexes: function(list, offset, limit)
	{
		var title, key, file, i
			, keylen = 4, titlelen = 16, len = Object.keys(list).length
			, files = []
		;
		limit = limit == null ? this.paramLimit : limit;
		for(i = 0; i < limit; i++){
			if(i + offset < len){
				file = list[Object.keys(list)[i + offset]];
				key = (i + offset) + '';
				title = file.title;
			}else{
				key = '　　　　　';
				title = '';
			}
			title += '                    '.substr(0, titlelen - title.length);
			index = '0000'.substr(0, keylen - key.length) + key + ':';
			files.push({title: title, index: index, sound_id: file.sound_id});
		}
		return files;
	},
	
	drawPackedFileList: function()
	{
		var list = this.player.fileList()
			, offset = this.fileListOffset
			, imc = this.paramskeysCmargin, mc = this.channelParamsCmargin
			, dispFiles, i, title, index, isPacked
			, indexLen = 5, titlelen = 16
			, icol, tcol, file
			, haveLength = this.packedFiles.length > 0
		;
		dispFiles = this.currentTitleIndexes(this.player.fileList(), offset, this.paramLimit);
		for(i = 0; i < dispFiles.length; i++){
			file = dispFiles[i];
			sound_id = file.sound_id;
			isPacked = this.isPackedFile(file);
			icol = isPacked ? COLOR_DISABLE : COLOR_PARAMKEY;
			tcol = isPacked ? COLOR_DISABLE: COLOR_NOTEFACE;
			this.drawParamKeys(0, null, imc.x, imc.y + i, [file.index], indexLen, sound_id > 0 || haveLength ? icol : COLOR_DISABLE);
			this.drawParamKeys(0, null, mc.x, mc.y + i, [file.title], titlelen, sound_id > 0 ? tcol : COLOR_ARRAY[0]);
		}
	},
	
	drawFileList: function()
	{
		var list = this.player.fileList()
			, len = Object.keys(list).length, offset = this.fileListOffset
			, i, indexes = [], titles = []
			, key = '', title = '', file
			, keylen = 4, indexLen = 5, titlelen = 16, mc = this.channelParamsCmargin
			, imc = this.paramskeysCmargin
		;
		for(i = 0; i < this.paramLimit; i++){
			if(i + offset < len){
				file = list[Object.keys(list)[i + offset]];
				key = (i + offset) + '';
				title = file.title;
			}else{
				key = '　　　　　';
				title = '';
			}
			title += '                    '.substr(0, titlelen - title.length);
			indexes.push('0000'.substr(0, keylen - key.length) + key + ':');
			titles.push(title);
		}
		
		if(offset == 0){
			this.drawParamKeys(0, null, imc.x, imc.y, [indexes.shift()], indexLen, COLOR_DISABLE);
			this.drawParamKeys(0, null, mc.x, mc.y, [titles.shift()], titlelen, COLOR_ARRAY[0]);
			this.drawParamKeys(0, null, imc.x, imc.y + 1, indexes, indexLen, COLOR_PARAMKEY);
			this.drawParamKeys(0, null, mc.x, mc.y + 1, titles, titlelen, COLOR_NOTEFACE);
		}else{
			this.drawParamKeys(0, null, imc.x, imc.y, indexes, indexLen, COLOR_PARAMKEY);
			this.drawParamKeys(0, null, mc.x, mc.y, titles, titlelen, COLOR_NOTEFACE);
		}
	},
	
	// drawParamKeys: function(offset, limit, xc, yc, params, sublen, firstCol, secondCol)
	drawParamKeys: function(offset, limit, xc, yc, params, sublen, printCol)
	{
		offset = offset == null ? this.paramOffset : offset;
		limit = limit == null ? this.paramLimit : limit;
		var i, index
			, keys = []
			, word = this.word8
			, mc = (xc == null || yc == null) ? this.paramskeysCmargin : {x: xc, y: yc}
			, tuneKeyLavel = {} //tuneKeyLavel= key:lavel
			, col
			, mode = this.getMode()
			;
			
		if(mode == 'play'){return;}
		sublen = sublen == null ? 5 : sublen;
		
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
		printCol = printCol == null ? COLOR_PARAMKEY: printCol;
		//draw> tune:value
		// word.setFontSize('8px');
		word.setScroll(scrollByName('bg1'));
		word.setLineCols(sublen);
		word.setMaxRows(1);
		
		for(i = 0; i < limit; i++){
			index = i + offset;
			if(keys.length < index){break;}
			word.setPos(cellhto(mc.x), cellhto(mc.y + i));
			word.print(str_pad(keys[index], sublen, "　", "STR_PAD_RIGHT"), cellhto(mc.x), cellhto(mc.y + i), printCol, COLOR_BLACK);
		}
	},
	
	scrollChannelParams: function(dir, step)
	{
		var scr = scrollByName('bg1')
			, delta = 2
			, mc = this.leftScreenCmargin
			, size = this.leftScreenSize
			, x = cellhto(mc.x)
			, y = cellhto(mc.y)
			, w = cellhto(size.w)
			, h = cellhto(size.h)
		;
		step = step == null ? 1 : step;
		h -= cellhto(step);
		if(dir == 'up'){
			scr.rasterto(scr, x, y, w, h, x, y + cellhto(step), w, h);
		}else if(dir == 'down'){
			scr.rasterto(scr, x, y + cellhto(step), w, h, x, y, w, h);
		}
	},

	drawChannelParams: function(offset, limit, xc, yc, params, fixch)
	{
		offset = offset == null ? this.paramOffset : offset;
		limit = limit == null ? this.paramLimit : limit;
		if(this.editMode == 'play'){return;}
		var i, j, index, key, color, num, sprite, noref
			, keys = []
			, word = this.word8
			, mc = (xc == null || yc == null) ? this.channelParamsCmargin: {x: xc, y: yc}
			, chLeft = 0, chLength = 0
			, numLength = 2
			, tuneKeyLavel = {}
			, tuneLavelKey = this.ltSoundChParamKeys
			, player = this.player
			// , player = this.sePlayer
			;
		for(i in  this.ltSoundChParamKeys){
			tuneKeyLavel[this.ltSoundChParamKeys[i]] = i;
		}
		if(params == null){
			params = {};
			chLength = player.channel.length;
			for(i in tuneLavelKey){
				params[tuneLavelKey[i]] = {};
				for(j = 0; j < chLength; j++){
					num = player.getChannel(j, tuneLavelKey[i], false);
					if(num == null){continue;}
					params[tuneLavelKey[i]][j] = player.getChannel(j, tuneLavelKey[i], false).toString(16);
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
		
		// word.setFontSize('8px');
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
							noref = !(params[key].time in player.eventsetData[fixch][params[key].type]);
							this.blinkDrawParams.push({sprite: sprite, x: cellhto(mc.x + (j * numLength) + chLeft), y: cellhto(mc.y + i), noref: noref});
							continue;
						}
					}
					word.print(formatNum(num, 2), cellhto(mc.x + (j * numLength) + chLeft), cellhto(mc.y + i), color, COLOR_BLACK);
				}
			}
		}
	},

//左柱描画
	drawScrollTime: function(time, init)
	{
		var cm = {x: 1, y: 8}, word = this.word4
			, c1 = COLOR_WHITE
			, c2 = COLOR_BLACK
			, sec, msec, bg = scrollByName('bg1')
			, x = cellhto(cm.x), y = cellhto(cm.y) , ycel = cellhto(1)
		;
		init = init == null ? false : init;
		time = time == null ? this.player.noteSeekTime : time;
		// word.setFontSize('4v6px');
		word.setScroll(bg);
		if(init){
			bg.clear(COLOR_BLACK, makeRect(x, y, cellhto(2), cellhto(5)));
			word.print('TIME', x, y, COLOR_TIME, c2);
			word.print(' sec', x, y + (ycel * 2), c1, c2);
			word.print('msec', x, y + (ycel * 4), c1, c2);
		}
		
		sec = (time / 1000) | 0;
		// msec = Math.round(time - (sec * 100));
		msec = (time - (sec * 1000)) | 0;
		if(sec != this.scrollTime || init){
			this.scrollTime = sec;
			word.print(str_pad(sec, 4, '0', 'STR_PAD_LEFT'), x, y + (ycel * 1), c1, c2);
		}
		if(msec != this.scrollTime_m || init){
			this.scrollTime_m = msec;
			word.print('.' + str_pad(msec, 3, '0', 'STR_PAD_LEFT'), x, y + (ycel * 3), c1, c2);
		}
	},
	
	drawZoomScale: function(scale)
	{
		var cm = {x: 1, y: 3}, x = cellhto(cm.x), y = cellhto(cm.y), celly = cellhto(1)
			, stepTime, bg = scrollByName('bg1'), word = this.word4
			, c1 = COLOR_WHITE
			, c2 = COLOR_BLACK
		;
		bg.clear(COLOR_BLACK, makeRect(x, y, cellhto(2), cellhto(3)));
		
		stepTime = (scale / this.noteRangeCells) | 0;
		
		// word.setFontSize('4v6px');
		word.setScroll(bg);
		word.print('STEP', x, y, COLOR_STEP, c2);
		word.print(str_pad(stepTime, 4, '0', 'STR_PAD_LEFT'), x, y + (celly * 1), c1, c2);
		word.print('msec', x, y + (celly * 2), c1, c2);

	},
	
	drawOctaveMeter: function(level)
	{
		var i
			, cm = {x: 37.5, y: 12.25}
			, cDistance = 3.5
			, scr = scrollByName('bg1'), word = this.word8
			, sprite = this.frameSprites.octaveRoll
			, cto = cellhto
		;
		scr.drawSpriteChunk(sprite, cto(36), cto(5));
		scr.drawSpriteChunk(sprite, cto(36), cto(8.5));
		scr.drawSpriteChunk(sprite, cto(36), cto(12));
		// this.drawFrameLine(sprite, 18, 2.5, 1, 1);
		// this.drawFrameLine(sprite, 18, 4.25, 1, 1);
		// this.drawFrameLine(sprite, 18, 6, 1, 1);
		
		// word.setFontSize('8px');
		word.setScroll(scr);
		for(i = 0; i < 3; i++){
			word.print((level + i), cellhto(cm.x), cellhto(cm.y - (i * cDistance)), COLOR_NOTEPRINT, COLOR_NOTEFACE);
		}
		word.print('Oct', cellhto(cm.x - 1), cellhto(cm.y - (i * cDistance) + 1), COLOR_NOTEPRINT, COLOR_NOTEFACE);
		cto = null;
	},
	
	drawChannelTab_on: function(ch, toggle)
	{
		var i
			, scr = scrollByName('bg1')
			, chOnId = 144, chOffId = 160, chOffset = 1
			, tabsprite, cm = {x: 6, y: 14}
			, x, y, iconName
		;
		// chId = toggle == null || toggle ? chOnId : chOffId;
		iconName = toggle == null || toggle ? 'tab' : 'ntab';
		if(ch == null){
			ch = [0, 1, 2, 3, 4, 5, 6, 7];
			//背景
			for(i = 0; i < ch.length; i++){
				// tabsprite = makeSprite(this.uiImageName, this.topFrameCenter[i]);
				tabsprite = this.iconSprites['bgtab'+ (i + chOffset)];
				scr.drawSpriteChunk(tabsprite, cellhto(cm.x + (i * 2)), cellhto(cm.y));
			}
			for(i = 0; i < ch.length; i++){
				// tabsprite = makeSprite(this.uiImageName, chId + ch[i]);
				tabsprite = this.iconSprites[iconName + (ch[i] + chOffset)];
				scr.drawSpriteChunk(tabsprite, cellhto(cm.x + ((ch[i] + chOffset) * 2)), cellhto(cm.y));
			}
		}
		else{
			x = cellhto(cm.x + ((ch + chOffset) * 2));
			y = cellhto(cm.y);
			// tabsprite = makeSprite(this.uiImageName, this.topFrameCenter[ch + chOffset]);
			scr.drawSpriteChunk(this.iconSprites['bgtab' + (ch  + chOffset)], x, y);
			// tabsprite = makeSprite(this.uiImageName, ch + chId);
			tabsprite = this.iconSprites[iconName + (ch  + chOffset)];
			scr.drawSpriteChunk(tabsprite, x, y);
		}
		
	},
	
	drawFrameLayout: function(chunk, cx, cy)
	{
		var x, y, sHeight, sWidth
			, scr = scrollByName('bg1')
		;
		scr.drawSpriteChunk(chunk, cellhto(cx), cellhto(cy));
	},
	
	//TODO msq形式に移行
	// drawFrameLine: function(frameline, cx, cy, rep_x, rep_y, size)
	drawFrameLine: function(sprite, cx, cy, rep_x, rep_y, size)
	{
		var x, y, sHeight, sWidth
			, scr = scrollByName('bg1')
			// , sprite = makeSpriteChunk(this.uiImageName, makeRect(frameline))
		;
		
		// console.log(sprite, cx, cy, rep_x, rep_y, size);
		size = size == null ? cellto(2) : size;
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
			, cm = this.modeCmargin, iconName
			;
		if(modeName == null){
			return;
		}
		iconName = 'mode_' + modeName;
		// if(this.modeRect[modeName] == null){
		if(this.iconSprites[iconName] == null){
			return;
		}
		// sprite = makeSpriteChunk(this.uiImageName, makeRect(this.modeRect[modeName]));
		sprite = this.iconSprites[iconName];
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
		this.blinkDrawParams.forEach(function(sparam, i){
			sparam = this.blinkDrawParams[i];
			if(this.catchNoteBlinkCycle % 8 == i % 8){return;}
			if(sparam.noref && this.catchNoteBlinkCycle % 2 == i % 2){return;}
			scr.drawSpriteChunk(sparam.sprite, sparam.x, sparam.y);
		}, this);
		scrpos = (this.noteScrollPos.x % DISPLAY_WIDTH);
		scrpos = 0;
		this.blinkDrawEventset.forEach(function(sparam, i){
			if(this.catchNoteBlinkCycle % 8 == i % 8){return;}
			if(sparam.noref && this.catchNoteBlinkCycle % 2 == i % 2){return;}
			this.drawNoteRaster(sparam.ch, sparam.type, sparam.x - scrpos, sparam.y, sparam.rot, sparam.bottom, sparam.catchMode, sparam.time);
		}, this);
	},
	
	scrollManual: function()
	{
		var params = this.manualScrollParams
			, d = params.dulation
			, c = params.count
			, fstack = null
			;
		params.bg1.x = 0;
		params.bg2.x = 0;
		params.bg1.y = 0;
		params.bg2.y = 0;
		
		
		if(scrollByName('bg3').isDrawingInfoStack()){return;}//
		
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
				scrollByName('bg1').clear();
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
			case 'tune': this.drawChannelWave(); this.drawParamCursorBlink(); break;
			case 'note': ; break;
			case 'play': this.drawOutputWave(); this.drawThumbVolume(); this.drawThumbClock(); break;
			case 'catch': ; break;
			case 'file': break;
			case 'title': this.drawTitleCharCursor(); break;
			// case 'pack': this.drawPackMenu(); break;

			case 'manual': this.scrollManual(); return;
			default: break;
		}
		// console.time('rep');
		this.drawSeek();
		this.drawEnvelopeBeam();
		// console.timeEnd('rep');
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
		switch(mode){
			case 'tune': this.drawOscillo(); break;
			case 'note': this.drawNoteMenu(); break; //this.drawNoteScroll(); 
			case 'play': this.drawOscillo(); break;
			case 'catch': this.drawCatchMenu(); break;
			case 'eventset': this.drawEventsetMenu(); break;
			case 'undo': this.drawUndoMenu(); break;
			case 'file': this.drawFileMenu();break;
			case 'title': this.drawTitleMenu();break;
			case 'pack': this.drawPackMenu(false); break;
			case 'share': this.drawShareMenu(); break;
			case 'manual': return;
			case 'error': break;
			
		}
		this.drawMenuCommon(mode);
	},

	
	drawOscillo: function(pos)
	{
		var
			scr = scrollByName('bg1')
			, cm = this.menuDispCmargin
			, size = {w: this.chOscCWidth, h: this.chOscCHeight}
			, osccCm = {x: this.ocsWaveCmargin.x, y:20 }
			, oscCm = {x: osccCm.x, y: this.ocsWaveCmargin.y}
			
			// , ocsLineV = this.makeChipChunk('oscLineV', this.frameSprites.oscLineV, [(oscCm.x / 2) - 1, oscCm.y / 2, 1, 3])
			// , ocsLineH = this.makeChipChunk('oscLineH', this.frameSprites.oscLineH, [osccCm.x / 2, osccCm.y / 2, 4, 1])
			// , ocsLineH_c = this.makeChipChunk('oscLineH', this.frameSprites.oscLineH, [(osccCm.x / 2) + pos, osccCm.y / 2, 1, 1])
		;

		// オシロ
		if(pos == null){
			this.drawFrameLine(this.frameSprites.ocsLineV, (oscCm.x / 2) - 1, oscCm.y / 2, 1, 3);
			this.drawFrameLine(this.frameSprites.ocsLineH, osccCm.x / 2, osccCm.y / 2, 4, 1);
		}else{
			scr.clear(COLOR_BLACK, makeRect(cellhto(oscCm.x + (pos * 2)), cellhto(oscCm.y), cellhto(2), cellhto(size.h)));
			this.drawFrameLine(this.frameSprites.ocsLineH, (osccCm.x / 2) + pos, osccCm.y / 2, 1, 1);
			if(pos == this.analyseRate - 1){
				this.drawMenuCommon();
			}
		}
	},
	
	drawOutputWave: function()
	{
		// this.analyseRate = 8;
		var chOscWidth = cellhto(this.chOscCWidth)
			, chOscHeight = cellhto(this.chOscCHeight)
			, chOscHeight_h = ((chOscHeight / 2 ) | 0) - 1
			, sepWidth = chOscWidth / this.analyseRate
			, size = (PROCESS_BUFFER_SIZE / this.analyseRate) | 0
			// , size = 2048
			, cm = this.ocsWaveCmargin
			, px, py, i, dindex, ofsx = 0, ofsy = 128, ofsyRate =  (chOscHeight / 256), pre_y
			, from, to
			, spr = scrollByName('bg1')
			, sprite = this.waveSprite
			, cnt = 0
			, debug = this.debugCell
			;
			
		pre_y = null;
		this.analyseCount = (this.analyseCount + 1) % this.analyseRate;

// debug = true;
		if(debug){
			cm.x = 0;
			cm.y = 4 + (((((this.catchNoteBlinkCycle) / 5) | 0) % 3) * this.chOscCHeight);
			spr.clear(COLOR_BLACK, makeRect(cellhto(cm.x), cellhto(cm.y), DISPLAY_WIDTH, cellhto(this.chOscCHeight)));
			this.analyseRate = 1;
			size = PROCESS_BUFFER_SIZE;
			chOscWidth = DISPLAY_WIDTH;
			sepWidth = chOscWidth;
		}else{
			this.drawOscillo((this.analyseCount + 1) % this.analyseRate);
		}
		
		if(this.analyseCount == 0){
			data = this.litroSound.getAnalyseData(size);
			this.analysedData = data;
		}
		data = this.analysedData;
		
		for(i = this.analyseCount * sepWidth; i < chOscWidth; i++){
			if(cnt++ >= sepWidth){break;}
			dindex = (i * (size / (chOscWidth ) ) | 0);
			px = i + cellhto(cm.x) + ofsx;
			py = data[dindex] != null ? data[dindex] : ofsy;
			py = (py * ofsyRate) | 0;
			if(py >= chOscHeight){continue;}
			if(py < 0){continue;}
			py += cellhto(cm.y);
			from = {x: px, y: py};
			to = {x: px, y: pre_y == null ? py : pre_y};
			spr.spriteLine(from, to, COLOR_NOTEFACE);
			pre_y = py;
			
		}
	},

	drawChannelWave: function(ch)
	{
		ch = ch == null ? this.editChannel() : ch;
		var channel = this.player.isPlay() ? this.player.channel[ch] : this.sePlayer.channel[ch]
			, data, c, i, dindex, istep, layerScale, datH = 0
			, px, py, vol = 0, stPos = 0, swp = null
			, detune = channel.getDetunePosition()
			, pre_y, from, to, ofsy = 128
			, spr = scrollByName('bg1')
			, sprite = makePoint(this.uiImageName, 1)
			, sprite2 = makePoint(this.uiImageName, 1)
			, chOscWidth = cellhto(this.chOscCWidth)
			, chOscHeight = cellhto(this.chOscCHeight)
			, chOscHeight_h = ((chOscHeight / 2) | 0) - 1
			, cm = this.ocsWaveCmargin
			, sepWidth = (chOscWidth / this.analyseRate) | 0
			, cnt = 0, chcolor = COLOR_ARRAY[ch]
			;
		;
		
		if(this.editMode == "file"){
			return;
		}
			
		//デバッグ
		if(this.keyControll.getState('ext')){
			// if(channel.envelopeEnd == true){
			// //クリック音防止余韻
				// vol = channel.absorbVolume * Math.exp(-0.001 * channel.absorbCount);
			// }else if(channel.absorbNegCount < channel.absorbCount){
				// vol = -channel.absorbVolume * Math.exp(-0.001 * channel.absorbNegCount);
			// }
			// stPos = channel.absorbVolume;
		}
		
		// console.log(this.analyseCount);
		
		this.analyseCount = (this.analyseCount + 1) % this.analyseRate;
		if(this.analyseCount == 0){
			data = channel.data;
			this.analysedData = data;
		}
		data = this.analysedData;
		// data = channel.data;
		
		istep = data.length / chOscWidth;
		istep /= (this.octaveLevel + 1);
		this.drawOscillo((this.analyseCount + 1) % this.analyseRate);
		// for(i = 0; i < chOscWidth; i++){
		for(i = this.analyseCount * sepWidth; i < chOscWidth; i++){
			if(cnt++ >= sepWidth){break;}
			dindex = (i * istep) | 0;
			datH = channel.waveLength > dindex ? data[(dindex + detune) % channel.waveLength] : 0;
			px = i + cellhto(cm.x);
			py = (-(datH + vol) * (chOscHeight_h / ofsy)) | 0;
			// py = (py * (chOscHeight_h / ofsy)) | 0;
			// if(i == 0){console.log(datH , vol, chOscHeight)}
			if(py > chOscHeight_h){continue;}
			if(py < -chOscHeight_h){continue;}
			py += chOscHeight_h + cellhto(cm.y);

			from = {x: px, y: py};
			to = {x: px, y: pre_y == null ? py : pre_y};
			if(stPos == datH && from.y == to.y){
				spr.spriteLine(from, to, COLOR_PARAMKEY);
			}else{
				spr.spriteLine(from, to, chcolor);
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
			, status = this.status_on
			, len = status.length
			, player = this.player
			;
		
		
		// this.status_on.forEach(function(status, i){
		// }, this);

		for(i = 0; i < len; i++){
			if(!player.channel[i].isEnable()){
				continue;
			}
			chr = status[i];
			phase = player.channel[i].getPhase();
			if(chr == null && (phase == 'r' || phase == '')){
				continue;
			}
			chr = chr == null ? this.key2Char(player.getNoteKey(i)) : chr;
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
	
	//TODO makeSpriteChunk制にする
	drawOnBaseKey: function(code, status){
		if(this.getMode() == 'manual'){return;}
		// var fchip = this.frameChunks[this.frameChunksKeys.baseKeyDisp[0]]
			// , baseCm = {x: fchip.rect.x, y: fchip.rect.y}
		var fchip = this.frameSprites.baseKeyDisp
			, baseCm = {x: fchip.cx, y: fchip.cy}
			// , wm = {x: cellhto((baseCm.x * 2) + 1) + 2, y:cellhto((baseCm.y * 2) + 1)}
			, wm = {x: cellhto(baseCm.x + 1) + 2, y:cellhto(baseCm.y + 1) - 3}
			, name = (code != null) ? this.baseKeysDrawName[code] : '', select
			, word = this.word4
			;
		// word.setFontSize('4v6px');
		word.setMarkAlign('horizon');
		word.setMaxRows(5);
		word.setLineCols(0);
		word.setScroll(scrollByName('bg1'));
		if(name != '' ){
			select = this.controllDispWordPos[name];
			word.print(name, wm.x + (select.pos * word.chipSize), wm.y + (select.line * word.vChipSize), status ? COLOR_WHITE : COLOR_PARAMKEY, COLOR_BLACK);
		}else{
			word.print(this.controllDispNameStr, wm.x, wm.y, status ? COLOR_WHITE : COLOR_PARAMKEY, COLOR_BLACK);
		}
	},
	
	openSNSTab: function(itemFunc)
	{
		var crect = {x:cellhto(0), y:cellhto(23), w: cellhto(40), h: cellhto(15)}
			, r = makeRect(crect.x, crect.y, crect.w, crect.h)
			, bg = scrollByName('bg1')
			, view = scrollByName('view')
			, spr = makeSprite(this.snsImageName, 0)
			, self = this, word = this.word8
			, iconCrect = {x: 18, y: 26, w:2, h: 2} //this.snsIconCmargin
		;
		view.y = cellhto(7);
		bg.clear(COLOR_BLACK, r);
		bg.drawSprite(spr, cellhto(iconCrect.x), cellhto(iconCrect.y));
		word.setScroll(bg);
		// word.setFontSize('8px');
		word.setLineCols(0);
		word.setMarkAlign('horizon');
		word.print('Click SNS Icon for Login', crect.x + cellhto(1), crect.y + cellhto(1), COLOR_WHITE, COLOR_BLACK);
		this.appendClickableItem(makeRect(cellhto(iconCrect.x), cellhto(iconCrect.y), cellhto(iconCrect.w), cellhto(iconCrect.h)), itemFunc, 'TWITTER');
		
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
		window.open(this.loginURLs[type], null,"width=640,height=480,scrollbars=yes");

	},
	
	openShareWindow: function(type, file)
	{
		var url = this.shareURLs[type];
		if(type == 'TWITTER'){
			url += [
				'url=' + encodeURIComponent(location.origin + location.pathname 
				+ (file.sound_id == 0 ? '' : '?sound_id=' + file.sound_id)),
				'text=' + encodeURIComponent(file.sound_id == 0 ? 'ブラウザでPSG音源DTM！' : ('"'+ file.title + '" play on the litrokeyboard!!')),
				'hashtags=' + encodeURIComponent('litrokeyboard,dtm'),
				// 'via=' + 'LitroKeyboard'
				].join('&');
			}
			console.log(location.origin + location.pathname 
				+ (file.sound_id == 0 ? '' : '?sound_id=' + file.sound_id));
		window.open(url, null,"width=640,height=480,scrollbars=yes");
		this.closeSNSTab();
		this.changeEditMode('file');
		this.clearMenu();
		this.drawMenu();
		this.drawFileMenu();
		this.drawFileMenuCursor();
		this.clearLeftScreen();
	},

	closeManual: function()
	{
		var i, params = this.manualScrollParams
			// // , ltkb = litroKeyboardInstance
			, spr = scrollByName('sprite')
			, bg1 = scrollByName('bg1')
			, bg2 = scrollByName('bg2')
			, bg3 = scrollByName('bg3')
			, view = scrollByName('view')
			, scr = scrollByName('screen')
			, self = this
		;
		
		if(params.count > 0 && params.dir == 'left'){
			return;
		}
		params.count = 0;
		bg3.visible();
		view.drawto(bg1);
		bg3.drawto(bg2);
		this.drawScoreBoard(true);
		this.drawScoreBoard(false);
		

		// this.manualPage = 0;
		params.dir = 'left';
	},
	
	openManual: function(page)
	{
		var self = this, pre, prePage = this.manualPage
			, img, i
			, params = this.manualScrollParams
			, sbnf = scrollByName
			, view = sbnf('view')
			, bg1 = sbnf('bg1')
			, bg2 = sbnf('bg2')
			, bg3 = sbnf('bg3')
			, sprite
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
			//復帰画面を複写
			view.drawto(bg3); bg3.hide();
		}

		// this.keyControll.allReset();
		this.manualPage = page;
		this.loadManualImage(img.name, function(){

			params.count = 0;
			view.drawto(bg1);
			bg2.clear(COLOR_BLACK);
			sprite = makeSprite(img.name, 0);
			bg2.drawSprite(sprite, ((DISPLAY_WIDTH - sprite.w) * 0.5) | 0, ((DISPLAY_HEIGHT - sprite.h) * 0.5) | 0);
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
	},
	
	doneDrawStackCallback: function()
	{
		if(this.drawStackCallback != null){
			this.drawStackCallback();
			this.drawStackCallback = null;
		}
	}
};

function printDebug(val, row){
		// if(litroKeyboardInstance == null){return;}
		if(!imageResource.isload()){return;}
		var scr = scrollByName('sprite'), ltkb = litroKeyboardInstance
			, word = ltkb.word4
			, mc = {x: 0, y: 29};
		;
		if(row == null){
			row = 0;
		}
		if(word == null){
			return;
		}
		// word.setFontSize('4v6px');
		word.setMarkAlign('horizon');
		word.setScroll(scr);
		word.setColor(COLOR_WHITE, COLOR_BLACK);
		word.print(val, cellhto(mc.x), cellhto(mc.y - row));
};
	
function drawLitroScreen()
{
	var i, x, y, cx, cy, w, h
	, ltkb = litroKeyboardInstance
	, spr = scrollByName('sprite')
	, bg1 = scrollByName('bg1')
	, bg2 = scrollByName('bg2')
	, bg3 = scrollByName('bg3')
	, view = scrollByName('view')
	, scr = scrollByName('screen')
	, pbg2, pbg1
	, spmax = ltkb.debugCell == null ? null : 3200
	;

	if(ltkb.firstDraw != null && ltkb.imageLoaded){
		ltkb.firstDraw();
		ltkb.firstDraw = null;
	}
	// printDebug(ltkb.player.channel[0].isFinishEnvelope(0), 1);
	// printDebug(ltkb.player.channel[0].waveLength, 2);
	if(ltkb.hiddenScreen){
		return;
	}
	if(ltkb.imageLoaded === false){
		return;
	}
	// ltkb.drawNoteTest();
	ltkb.repeatDrawMenu();
	
	if(ltkb.debugCell && ltkb.word != null){
		// ltkb.word.setFontSize('8px');
		ltkb.word8.setScroll(spr);
		cx = ltkb.debugCellPos.x, cy = ltkb.debugCellPos.y;
		x = cellhto(cx), y = cellhto(cy);
		x = Math.round(x);
		ltkb.word.print((cx < 10 ? 'x:0' : 'x:') + cx + '', x - cellhto(3), y - cellhto(2));
		ltkb.word.print((cy < 10 ? 'y:0' : 'y:') + cy + '', x - cellhto(3), y - cellhto(1));
		spr.drawSprite(ltkb.cellCursorSprite, x, y);
	}
	if(drawCanvasStacks(spmax)){
		//スプライト表示が完了したら
		ltkb.doneDrawStackCallback();
	}
	
	// drawCanvasStacks();
	if(ltkb.editMode != 'manual'){
		h = DISPLAY_HEIGHT / 2;
		w = null;
		x = ltkb.bg2x.t + cellhto(ltkb.noteScrollCmargin.x);
		y = 0;
		bg3.rasterto(view, 0, 0, w, h, x, y);
		bg2.rasterto(view, 0, 0, w, h, x, y);
		x = ltkb.bg2x.b + cellhto(ltkb.noteScrollCmargin.x);
		y = 0;
		bg3.rasterto(view, 0, h, w, h, x, y);
		bg2.rasterto(view, 0, h, w, h, x, y);
		bg1.drawto(view);
	}else{
		pbg2 = ltkb.manualScrollParams.bg2;
		pbg1 = ltkb.manualScrollParams.bg1;
		
		bg3.rasterto(view, 0, 0, null, null, pbg1.x | 0, pbg1.y | 0);
		bg2.rasterto(view, 0, 0, null, null, pbg2.x | 0, pbg2.y | 0);
		bg1.rasterto(view, 0, 0, null, null, pbg1.x | 0, pbg1.y | 0);
	}

	// printDebug(Math.round(litroSoundInstance.context.currentTime), 0);
	// printDebug(testval);
	spr.drawto(view);
	spr.clear();
	// view.drawto(view);
	
	screenView(scr, view, VIEWMULTI);
	// console.log(scr.canvas.width);
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
	ltkb.envelopeCheck();
	// console.time("key");
	// console.timeEnd("key");
	ltkb.playLitro();
	drawLitroScreen();
};

function main() {
	litroSoundMain();
	litroKeyboardMain();
	keyStateCheck();
	requestAnimationFrame(main);
};


function getClient()
{
	var client
	, agent = navigator.userAgent
	, spDevices = ['iPhone', 'iPad', 'ipod', 'Android']
	, deviceName = ''
	, isSmartDevice = false
	;
	spDevices.map(function(d){
		if(agent.indexOf(d) >= 0){
			deviceName = d;
			isSmartDevice = true;
		}
	});
	client = {isSmartDevice: isSmartDevice, deviceName: deviceName};
	return client;
	
};

window.addEventListener('load', function() {
	var client = getClient()
		, query = location.href.match(/\?([^?/]*)/)
		, ltkb = new LitroKeyboard()
		;
		
	if(client.isSmartDevice){
		location.href = RECEIVER_URL[HOST_ID] + (query != null ? '/?' + query[1] : '');
		// location.href = './litroreceiver' + (query != null ? '/?' + query[1] : '');
		return;
	}
	
	
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	
	ltkb.init();
	
	// requestAnimationFrame(main);
	removeEventListener('load', this, false);
	
	window.onbeforeunload = function(event){
		// event = event || window.event;
		return event.returnValue = 'LitroKeyboardを中断します';
};
}, false);


