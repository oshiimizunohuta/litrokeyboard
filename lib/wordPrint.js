function wordPrint(scrolls, sizetype)
{
	this.moji_hira =  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやっゆーよらりるれろわ、を。んがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉゃ！ゅ？ょ・『』◯☓";
//	this.moji_kata = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤッユ～ヨラリルレロワ☆ヲ♥ンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポァィゥェォャ（ュ）ョ=+-*/";
	this.moji_kata = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤッユ～ヨラリルレロワ☆ヲ♥ンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポァィゥェォャ（ュ）ョ＝＋－＊／";
	this.moji_alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ,.:;abcdefghijklmnopqrstuvwxyz ^&©";
	this.moji_suji = "0123456789";
	
	this.sp_alph = {
		',': ',', '.': '.', ':': ':', ';': ';' , ' ': ' ', '^': '^', '&': '&', '©': '©'
		,'，': ',', '．': '.', '：': ':', '；': ';' , '　': ' ', '＾': '^', '＆': '&', '@': '©', '＠': '©', '™': '©'
	};
	this.sp_kata = {
		'＝':'＝', '＋': '＋', '－': '－', '＊': '＊', '／': '／'
		,'=':'＝', '+': '＋', '-': '－', '*': '＊', '/': '／'
	};
	this.sp_hira = {
		'・':'・', '『': '『', '』': '』', '◯': '◯', '☓': '☓'
		,'･':'・', '「': '『', '」': '』', '○': '◯', '×': '☓'
	};

	this.color;
	this.bgcolor;
//	this.newLineWord = "\n";
	this.newLineWord = "n";
	this.escapeWord = "$";
	this.cols = 24; //自動改行までの文字数
	this.rows = 3; //文字表示行数
	this.rowSpace = 2; //文字表示行数
	
	this.NOTFOUND_CODE = 83; //'？'

	this.wordIds;// = new Array();
	this.imageName = "font12p";
	this.DEFAULT_COLOR = COLOR_FONT12;
	this.chipSize = 12;
	if(sizetype == "8px"){
		this.imageName = "font8p";
		this.DEFAULT_COLOR = COLOR_FONT8;
		this.chipSize = 8;
	}
	this.DEFAULT_BGCOLOR = COLOR_TRANSPARENT;

	this.scroll;
	// this.targetScroll;
	this.position_x = 0;
	this.position_y = 0;
	this.spriteArray = [];
	if(scrolls != null){
		this.scroll = scrolls;
	}
	
	this.DrawEvent;// = new DrawEvent();
	this.str;
	this.disp = true;
	
//	if(x != null && y != null){
//	this.position_x = x;
//	this.position_y = y;
//	}
//	if(words != null){
//	this.parse(words);
//	}

	function setScroll(scrollStr)
	{
		this.scroll  = scrollStr;
	}
	wordPrint.prototype.setScroll = setScroll;
	function getScroll()
	{
		return this.scroll;
	}
	wordPrint.prototype.getScroll = getScroll;
	
	function getSpriteHandle(str)
	{
		this.makeStrId(str);
		var SpriteHandles = makeSpriteHandle(this.spriteArray, this.scrolls);
		return SpriteHandles;
	}
	wordPrint.prototype.getSpriteHandle = getSpriteHandle;

	function SearchWordNum(w){
		var match;
		//ひらがな
		match = this.moji_hira.indexOf(w);
		if(match > -1){return match;}
		//カタカナア
		match = this.moji_kata.indexOf(w);
		if(match > -1){return match + 90;}
		//アルファベット
		match = this.moji_alph.indexOf(w);
		if(match > -1){return match + 180;}
		//数字
		match = this.moji_suji.indexOf(w);
		if(match > -1){return match + 240;}

		return match;
	}
	wordPrint.prototype.SearchWordNum = SearchWordNum;

	function SearchNum(w){
		var match, ofs = 0, code = w.charCodeAt(0);
		if(w in this.sp_alph){
			match = this.moji_alph.indexOf(this.sp_alph[w]);
			ofs = 180;
		}else if(w in this.sp_hira){
			match = this.moji_hira.indexOf(this.sp_hira[w]);
			ofs = 0;
		}else if(w in this.sp_kata){
			match = this.moji_kata.indexOf(this.sp_kata[w]);
			ofs = 90;
		}
		else if(code < 65){
			match = this.moji_suji.indexOf(w);
			ofs = 240;
		}else if(code < 8000){
			//アルファベット
			match = this.moji_alph.indexOf(w);
			ofs = 180;
		}else if(code < 12450){
			//ひらがな
			match = this.moji_hira.indexOf(w);
			ofs = 0;
		}else{
			//カタカナ
			match = this.moji_kata.indexOf(w);
			ofs = 90;
		}
		
		return match < 0 ? this.NOTFOUND_CODE : match + ofs;
	}
	wordPrint.prototype.SearchNum = SearchNum;

	function makeStrId(MS)
	{
		var i; var TheWord; var thisword = 0;
		var lineWords = new Array();//行の文字数
//		this.wordIds = new Array();//行

		for(i = 0; i < MS.length; i++){
			TheWord = MS.substr(i, 1);
			thisword = this.SearchNum(TheWord);

			if(thisword == -1){
				if(TheWord == this.escapeWord){//特殊
					lineWords = this.escCommand(MS, i, lineWords);
					i += 1;
					continue;
				}else{
					lineWords.push(179);
				}
			}else{
				lineWords.push(thisword);
			}
			//改行ポイント
			if((lineWords.length % this.cols) == 0 && (this.cols > 0)){
//				this.wordIds.push(lineWords);
//				lineWords = new Array;
				lineWords = this.newLine(lineWords);
			}
		}
		return lineWords;
	}
	wordPrint.prototype.makeStrId = makeStrId;

	function setFontSize(sizetype)
	{
		if(sizetype == "8px"){
			this.imageName = "font8p";
			this.DEFAULT_COLOR = COLOR_FONT8;
			this.chipSize = 8;
		}else{
			this.imageName = "font12p";
			this.DEFAULT_COLOR = COLOR_FONT12;
			this.chipSize = 12;
		}
	}
	wordPrint.prototype.setFontSize = setFontSize;

	function setStr(str)
	{
		this.str = str;
		this.parse(str);
	}
	wordPrint.prototype.setStr = setStr;

	function parse(MS)// char length, message
	{
		this.wordIds = [];//行
		var lineWords = [];
		lineWords = this.makeStrId(MS + "");

		//最終行
		if(lineWords.length > 0){
			this.wordIds.push(lineWords);
		}

		this.spriteArray =[];
		// for(var i in this.wordIds){
		for(var i = 0; i < this.wordIds.length; i++){
			this.spriteArray.push(imageResource.makeSpriteArray(this.imageName, this.wordIds[i]));
		}
	}
	wordPrint.prototype.parse = parse;

	function escCommand(words, index, lineWords){
		var command = words.substr(index + 1, 1);
		var result = new Array();
		switch(command){
		case this.newLineWord: result = this.newLine(lineWords);break;
		default: result = lineWords; break;
		}
		return result;
	}
	wordPrint.prototype.escCommand = escCommand;

	function newLine(lineWords)
	{
		this.wordIds.push(lineWords);
		return new Array;
	}
	wordPrint.prototype.newLine = newLine;

	function setPos(x, y)
	{
		if(x != null){this.position_x = x;}
		if(y != null){this.position_y = y;}
	}
	wordPrint.prototype.setPos = setPos;
	
	function getPos()
	{
		return {x: this.position_x, y: this.position_y};
	}
	wordPrint.prototype.getPos = getPos;

	//DrawEventに登録
	function registDraw(str)
	{
		if(str != null){
			this.setStr(str);
		}
		if(this.DrawEvent == null){
			this.DrawEvent = new DrawEvent(this.str, this);
			this.DrawEvent.append("draw");
		}
	}
	wordPrint.prototype.registDraw = registDraw;
	
	function draw(scr)
	{
		if(!this.disp){
			return;
		}
		if(scr == null){
			scr = this.scroll;
		}
		if(typeof scr == "string"){
			scr = layerScroll[scr];
		}
		this.swapColor();
		for(var i = 0; i < this.spriteArray.length; i++){
			scr.drawSpriteArray(this.spriteArray[i], this.position_x, this.position_y +(i * (this.rowSpace + this.chipSize)), this.cols);
		}
		// dulog(this.cols);
	}
	wordPrint.prototype.draw = draw;

	//一行の長さ
	function setLineCols(num)
	{
		this.cols = num;
	}
	wordPrint.prototype.setLineCols = setLineCols;

	function setColor(color)
	{
		this.color = color;
//		this.swapColor();
	}
	wordPrint.prototype.setColor = setColor;

	function setBGColor(color)
	{
		this.bgcolor = color;
//		this.swapColor();
	}
	wordPrint.prototype.setBGColor = setBGColor;

	function swapColor()
	{
		// for(var j in this.spriteArray){
		for(var j = 0; j < this.spriteArray.length; j++){
			if(this.color == null){break;}
			for(var i = 0; i < this.spriteArray[j].length; i++){
				this.spriteArray[j][i].swapColor(this.color, this.DEFAULT_COLOR);
			}
		}
		for(var j = 0; j < this.spriteArray.length; j++){
			if(this.bgcolor == null){break;}
			for(var i = 0; i < this.spriteArray[j].length; i++){
				this.spriteArray[j][i].swapColor(this.bgcolor, this.DEFAULT_BGCOLOR);
			}
		}

	}
	wordPrint.prototype.swapColor = swapColor;

	function print(str, x, y, color, bgcolor)
	{
		// var startTime = performance.now();

		this.parse(str);
		if(x != null){this.position_x = x;}
		if(y != null){this.position_y = y;}
		if(color != null){this.color = color;}
		if(bgcolor != null){this.bgcolor = bgcolor;}
		this.draw();
		// var endTime = performance.now();
		// console.log(str, endTime - startTime);
	}
	wordPrint.prototype.print = print;
	
	function hide(){
		this.disp = false;
	}
	wordPrint.prototype.hide = hide;
	function visible()
	{
		this.disp = true;
	}
	wordPrint.prototype.visible = visible;
}
