var VIEWMULTI = 2;//基本サイズ拡大倍数
var CHIPCELL_SIZE_HALF = 8;//基本サイズ1辺り 8*8
var CHIPCELL_SIZE = 16;//基本サイズ1辺り 16*16
var CHIPSET_SIZE = 256;//基本サイズ全体サイズ 256*256
var CHIPSET_XCELLS = 16;//基本サイズ全体サイズ 16マス
var DISPLAY_WIDTH = 320;//表示基本幅
var DISPLAY_HEIGHT = 240;//表示基本高
var MENU_WIDTH = 80;//メニュー基本幅
var MAPSHEET_WIDTH = 240;//メニュー基本幅

var MENU_ROOM_CWIDTH = 10;//メニュー基本幅
var MENU_ROOM_CHEIGHT = 20;//メニュー基本幅

var MENU_SIDE_CWIDTH = 10;//メニュー基本幅
var MENU_SIDE_CHEIGHT = 20;//メニュー基本幅
var MENU_SIDE_CLEFT= 30;//メニュー基本位置
var MENU_SIDE_CTOP = 0;//メニュー基本幅位置

// var MENU_ROOM_CHWIDTH = 20;//メニュー基本幅半分
// var MENU_ROOM_CHHEIGHT = 40;//メニュー基本幅半分HOLDTIME = 20;//キーの押しっぱなし判定カウント

var EXP_MAXCOUNT = 99;//経験値カンスト
var STAR_MAX_TRAPS = 10;//【スター】TRAPカンスト
var STAR_MAX_SUPPORTS = 10;//【スター】SUPPORTSカンスト
var STAR_MAX_LOAD = 10;//【スター】LOADカンスト

//基本画像パス
// var SPRITE_DIR = "./images/spritechips/";
var SPRITE_DIR = "./images/sprites/";
var PROFICON_DIR = "./datafiles/profileicons/";//プロフアイコンパス
var IMAGE_EXTENSION = ".png";//画像拡張子
var DEFAULT_ICON = "defaulticon";//デフォルトアイコン

var KEYCONTROLL_HOLDTIME = 28;

//var SELECTEQUIP_CHARAIMAGE_DIR = "/images/sprites/"; //装備画面キャラクター画像パス

var layerScroll ={};

var POSTPARAMS = [];

function initScroll()
{
	layerScroll.screen = new CanvasScroll("scroll_screen", true);//倍にする
//	layerScroll["view"] = new CanvasScroll("scroll_view", true);
	layerScroll.view = new CanvasScroll("scroll_view");//全てのレイヤに書き込まれる
	layerScroll.bgmap = new CanvasScroll("scroll_bgmap");
	layerScroll.framemap = new CanvasScroll("scroll_frame");
//	layerScroll.window"] = new CanvasScroll("scroll_window");
	layerScroll.view.hide();
	layerScroll.bgmap.hide();
	layerScroll.framemap.hide();
}

function loadResource(images)
{
	imageResource.init();
	var i, chipsize = CHIPCELL_SIZE, halfchipsize = chipsize / 2;
	for(i = 0; i < images.length; i++){
		imageResource.push(images[i], chipsize, chipsize);
	}
	// imageResource.push("window_01", halfchipsize, halfchipsize);
	// imageResource.push("font12p", 12, 12);
	imageResource.push("font8p", 8, 8);

	// imageResource.push("relaxroom_01", chipsize, chipsize);
//	imageResource.push("relaxroom_01_s", chipsize, chipsize);
	imageResource.dirpath = './img/';
	imageResource.createStack();//一斉ロード →「１．画像がロードされた」へ

	return imageResource;
}

function swapPost()
{
	var key;
	for(key in VALUES){
		POSTPARAMS[key] = VALUES[key];
	};
	VALUES = null;
}

function cleanPostScript()
{
	var postdom = document.getElementById('postparams');
	postdom.parentNode.removeChild(postdom);
}

function windowCheck()
{
	if(POSTPARAMS.window_name != null){
		window.name = POSTPARAMS.window_name;
	}
//	if(window.name == );
}

function getScrolls(){
	return layerScroll;
}
