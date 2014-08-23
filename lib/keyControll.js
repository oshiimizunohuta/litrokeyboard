/**
 * Key Controll
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */

var allcontrolls = {};
var allcontrollsKeys = {};
var nowkey;
window.onkeydown = function(e){
	var enabled = true, i, c, indexes = Object.keys(allcontrolls), len = indexes.length;
	for(i = 0; i < len; i++){
		c = allcontrolls[indexes[i]];
		if(!(e.keyCode in c.code2name)){return;}//余計なキーは反応させない
		c.stateDown(e.keyCode);
		enabled = false;
	}
	// Object.keys(allcontrolls).forEach(function(idname){
	// });
//	nowkey = e.keyCode;
	return enabled;//false: 他の処理が無効
};
window.onkeyup = function(e){
	var enabled = true, i, c, indexes = Object.keys(allcontrolls), len = indexes.length;
	for(i = 0; i < len; i++){
		c = allcontrolls[indexes[i]];
		if(!(e.keyCode in c.code2name)){return;}//余計なキーは反応させない
		c.stateUp(e.keyCode);
		enabled = false;
	}
	// Object.keys(allcontrolls).forEach(function(idname){
	// });
	return enabled;
};


//選択しない
window.onmousedown = function(e){
	e.preventDefault();
};

//ウィンドウ離れた
window.addEventListener('blur', function(){
	var enabled = true, i, c, indexes = Object.keys(allcontrolls), len = indexes.length;
	for(i = 0; i < len; i++){
		allcontrolls[indexes[i]].allReset();
	}
	// Object.keys(allcontrolls).forEach(function(idname){
	// });
}, true);
// window.addEventListener('focus', function(){
	// keyUntrig();
// }, true);

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
	var enabled = true, i, j, c, indexes = Object.keys(allcontrolls), len = indexes.length, codes, clen, cindex;
	for(i = 0; i < len; i++){
		c = allcontrolls[indexes[i]];
		codes = c.name2code;
		cindex =  Object.keys(codes);
		clen = cindex.length;
		for(j = 0; j < clen; j++){
			c.holdon(codes[cindex[j]]);
		}
	}
	// Object.keys(allcontrolls).forEach(function(idname){
		// Object.keys(c.name2code).forEach(function(name){
		// });
	// });
}
/**
 * キーのトリガを解除
 */
function keyUntrig(){
	var enabled = true, i, j, c, indexes = Object.keys(allcontrolls), len = indexes.length, codes, clen, cindex;
	for(i = 0; i < len; i++){
		c = allcontrolls[indexes[i]];
		codes = c.name2code;
		cindex =  Object.keys(codes);
		clen = cindex.length;
		for(j = 0; j < clen; j++){
			c.untrig(codes[cindex[j]]);
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
	this.controlls = {};//操作名に対する状態
	this.code2name = {};//codeに対応する操作名
	this.name2code = {};//操作名に対応するcode
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
		this.name2code[name] = code;
		this.controlls[name] = new Array();
		this.controlls[name]['state'] = false;
		this.controlls[name]['trig'] = false;
		this.controlls[name]['off'] = false;
		this.controlls[name]['hold'] = false;
		this.controlls[name]['time'] = 0;
//		allcontrolls[this.idname] = this;
	// console.dir(this.controlls);
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

	function allReset()
	{
		var idnamename, states = {};
		for(idname in this.code2name){
			this.stateUp(idname);
		}
	}
	KeyControll.prototype.allReset = allReset;
	
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
			var states = {}, cont = this.controlls, nIndex = Object.keys(name), len = nIndex.length;
			for(i = 0; i < len; i++){
				n = name[i];
				states[n] = cont[n].state;
			}
			return states;
			// name.forEach(function(n, i){
			// }, this);
		}else{
			if(this.controlls[name] == null){return false;}
			return this.controlls[name].state;
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
			var trigs = {}, cont = this.controlls, nIndex = Object.keys(name), len = nIndex.length;
			for(i = 0; i < len; i++){
				n = name[i];
				trigs[n] = cont[n].trig;
			}
			// var trigs = {};
			// name.forEach(function(n, i){
				// trigs[n] = this.controlls[n].trig;
			// }, this);
			return trigs;
		}else{
			return this.controlls[name].trig;
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
			var unTrigs = {}, cont = this.controlls, nIndex = Object.keys(name), len = nIndex.length;
			for(i = 0; i < len; i++){
				n = name[i];
				unTrigs[n] = cont[n].off;
			}
			// var unTrigs = {};
			// name.forEach(function(n, i){
				// unTrigs[n] = this.controlls[n].off;
			// }, this);
			return unTrigs;
		}else{
			return this.controlls[name].off;
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
			var holds = {}, cont = this.controlls, nIndex = Object.keys(name), len = nIndex.length;
			for(i = 0; i < len; i++){
				n = name[i];
				holds[n] = cont[n].hold;
			}
			// var holds = {};
			// name.forEach(function(n, i){
				// holds[n] = this.controlls[n].hold;
			// }, this);
			return holds;
		}else{
			return this.controlls[name].hold;
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
