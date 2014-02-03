/**
 * Key Controll
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */

var allcontrolls = [];
var nowkey;
window.onkeydown = function(e){
	var enabled = true;
	for(var idname in allcontrolls){
		if(!(e.keyCode in allcontrolls[idname].code2name)){continue;}//余計なキーは反応させない
		allcontrolls[idname].stateDown(e.keyCode);
		enabled = false;
	}
	//alert(e.keyCode);
//	nowkey = e.keyCode;
	return enabled;//false: 他の処理が無効
};
window.onkeyup = function(e){
	var enabled = true;
	for(var idname in allcontrolls){
		if(!(e.keyCode in allcontrolls[idname].code2name)){continue;}//余計なキーは反応させない
		allcontrolls[idname].stateUp(e.keyCode);
		enabled = false;
	}
	return enabled;
};


//選択しない
window.onmousedown = function(e){
	e.preventDefault();
};
	
/**
 * キーのトリガとホールドのチェック（設置はmainの後ろ）
 */
function keyStateCheck()
{
	keyUntrig();
	keyHold();
}

/**
 * キーのホールドを確認
 */
function keyHold(){
	for(var idname in allcontrolls){
		for(var code in allcontrolls[idname].code2name){
			allcontrolls[idname].holdon(code);
		}
	}
}
/**
 * キーのトリガを解除
 */
function keyUntrig(){
	for(var idname in allcontrolls){
		for(var code in allcontrolls[idname].code2name){
			allcontrolls[idname].untrig(code);
		}
	}
}

/**
 * キー操作クラス
 * @param idname
 * @returns
 */
function KeyControll(idname)
{
//	this.keys = [];
	this.keys = new Array;
	this.controlls = new Array;//操作名に対する状態（こちらに変えたい20130310）
	this.code2name = [];//codeに対応する操作名（こちらに変えたい20130310）
	this.codename = [];//操作名に対応するcode
	this.idname = idname;
	this.action; //カスタム関数
	allcontrolls[this.idname] = this;
	try{
		this.holdTime = KEYCONTROLL_HOLDTIME;
	}catch(e){
		this.holdTime = 20;
		console.warn(e);
		console.log('key controll set hold on time: 20');
	}
//	alert(toString(this.action));
	/**
	 * 関数を登録
	 * @param name
	 * @param function f
	 */
	function setAction(f){
		this.action = f;
		this.action.prototype.action = this.action;
//		allcontrolls[this.idname] = this;
	}
	KeyControll.prototype.setAction = setAction;

	/**
	 * 操作名でキーコードを登録
	 * @param name
	 * @param code
	 */
	function setKey(name, code)
	{
		this.code2name[code + ""] = name;
		this.controlls[name] = new Array();
		this.controlls[name]['state'] = false;
		this.controlls[name]['trig'] = false;
		this.controlls[name]['off'] = false;
		this.controlls[name]['hold'] = false;
		this.controlls[name]['time'] = 0;
//		alert(array_keys(this.controlls));
//		allcontrolls[this.idname] = this;
//		console.dir(this.controlls);
	}
	KeyControll.prototype.setKey = setKey;

	/**
	 * キーが押された瞬間の挙動
	 * @param code
	 */
	function stateDown(code)
	{
		var controll = this.code2name[code];
		var state = this.controlls[controll]['state'];

		if(state){
			this.controlls[controll]['trig'] = false;
			this.controlls[controll]['off'] = false;
		}else{
			this.controlls[controll]['trig'] = true;
			this.controlls[controll]['state'] = true;
			this.controlls[controll]['off'] = false;
		}

	}
	KeyControll.prototype.stateDown = stateDown;

	/**
	 * キーを離した瞬間の挙動
	 * @param code
	 */
	function stateUp(code)
	{
		var controll = this.code2name[code];
		this.controlls[controll]['off'] = true;
		this.controlls[controll]['state'] = false;
		this.controlls[controll]['trig'] = false;

	}
	KeyControll.prototype.stateUp = stateUp;
	
	/**
	 * キーのホールドを確認
	 * @param code
	 */
	function holdon(code)
	{
		var controll = this.code2name[code];
		var state = this.controlls[controll]['state'];

		if(state){
			if(this.controlls[controll]['time']++ > this.holdTime){
				this.controlls[controll]['hold'] = true;
				// dulog("hold" + name);
			}
		}else{
			
			this.controlls[controll]['hold'] = false;
			this.controlls[controll]['time'] = 0;
		}

	}
	KeyControll.prototype.holdon = holdon;

	/**
	 * キーのトリガを解除
	 * @param code
	 */
	function untrig(code)
	{
		var name = this.code2name[code];
		this.controlls[name]['trig'] = false;
		this.controlls[name]['off'] = false;
	}
	KeyControll.prototype.untrig = untrig;

	function allState()
	{
		var name, states = {};
		for(name in this.controlls){
			states[name] = this.controlls[name].state;
		}
		return states;
	}
	KeyControll.prototype.allState = allState;
	/**
	 * キーの状態を取得
	 * @param name
	 * @returns
	 */
	function getState(name)
	{
		if(typeof name == "object"){
			var states = {};
			for(var i = 0; i < name.length; i++){
				states[name[i]] = this.controlls[name[i]]['state'];
			}
			return states;
		}else{
			if(this.controlls[name] == null){return false;}
			return this.controlls[name]['state'];
		}
	}
	KeyControll.prototype.getState = getState;

	/**
	 * キーの入力した瞬間を取得
	 * @param name
	 * @returns
	 */
	function getTrig(name)
	{
		if(typeof name == "object"){
			var trigs = {};
			for(var i = 0; i < name.length; i++){
				trigs[name[i]] = this.controlls[name[i]]['trig'];
			}
			return trigs;
		}else{
			return this.controlls[name]['trig'];
		}
	}
	KeyControll.prototype.getTrig = getTrig;

	/**
	 * キーをはなした瞬間を取得
	 * @param name
	 * @returns
	 */
	function getUntrig(name)
	{
		if(typeof name == "object"){
			var unTrigs = {};
			for(var i = 0; i < name.length; i++){
				unTrigs[name[i]] = this.controlls[name[i]]['off'];
			}
			return unTrigs;
		}else{
			return this.controlls[name]['off'];
		}
	}
	KeyControll.prototype.getUntrig = getUntrig;

	/**
	 * キーの固定判定を取得
	 * @param name
	 * @returns
	 */
	function getHold(name)
	{
		if(typeof name == "object"){
			var holds = {};
			for(var i = 0; i < name.length; i++){
				holds[name[i]] = this.controlls[name[i]]['hold'];
			}
			return holds;
		}else{
			return this.controlls[name]['hold'];
		}
	}
	KeyControll.prototype.getHold = getHold;

	function initDefaultKey(type)
	{
		if(type == "left"){
			this.setKey('left', 65);
			this.setKey('up', 87);
			this.setKey('right', 68);
			this.setKey('down', 83);
			this.setKey('<', 188);
			this.setKey('>', 190);
		}else{
			this.setKey('left', 37);
			this.setKey('up', 38);
			this.setKey('right', 39);
			this.setKey('down', 40);
			this.setKey('<', 88);
			this.setKey('>', 90);
		}
		this.setKey('select', 9);
		this.setKey('space', 32);
		this.setKey('debug', 16);
	}
	KeyControll.prototype.initDefaultKey = initDefaultKey;

	function initCommonKey()
	{
		//LFETCONTROLL
		this.setKey('left', 65);
		this.setKey('up', 87);
		this.setKey('right', 68);
		this.setKey('down', 83);
		this.setKey('<', 188);
		this.setKey('>', 190);
		//RIGHTCONTROLL
		this.setKey('left', 37);
		this.setKey('up', 38);
		this.setKey('right', 39);
		this.setKey('down', 40);
		this.setKey('<', 88);
		this.setKey('>', 90);

		this.setKey('select', 9);
		this.setKey('space', 32);
		this.setKey('debug', 16);
	}
	KeyControll.prototype.initCommonKey = initCommonKey;

}
