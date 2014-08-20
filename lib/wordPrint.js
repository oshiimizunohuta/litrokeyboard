/**
 * Word Print Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */
// function wordPrint(scrolls, sizetype)
function WordPrint(){return;};
WordPrint.prototype ={
	init: function(sizetype){
		this.moji_hira =  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやっゆ⼀よらりるれろわ、を。んがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉゃ！ゅ？ょ・『』◯☓";
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
			, '_': '－'
		};
		this.sp_hira = {
			'ー': '⼀', '？': '？', '！': '！', '・':'・', '『': '『', '』': '』', '◯': '◯', '☓': '☓'
			,'･':'・', '?': '？', '!': '！',  '「': '『', '」': '』', '○': '◯', '×': '☓'
		};
		this.soundmarks = {
			50: 5, 51: 6, 52: 7, 53: 8, 54: 9, 55: 10, 56: 11, 57: 12, 58: 13, 59: 14
			, 60: 15, 61: 16, 62: 17, 63: 18, 64: 19, 65: 25, 66: 26, 67: 27, 68: 28, 69: 29
			, 70: 25, 71: 26, 72: 27, 73: 28, 74: 29
			, 140: 95, 141: 96, 142: 97, 143: 98, 144: 99, 145: 100, 146: 101, 147: 102, 148: 103, 149: 104
			, 150: 105, 151: 106, 152: 107, 153: 108, 154: 109, 155: 115, 156: 116, 157: 117, 158: 118, 159: 119
			, 160: 115, 161: 116, 162: 117, 163: 118, 164: 119
		};
		this.soundmarkAlign = 'horizon'; // vertical:horizon
		this.soundmarkPos = []; // {line:line, pos:pos}
	
		this.color;
		this.bgcolor;
	//	this.newLineWord = "\n";
		this.newLineWord = "n";
		this.escapeWord = "$";
		this.cols = 24; //自動改行までの文字数
		this.rows = 3; //文字表示行数
		this.rowSpace = 2; //文字表示行数
		
		this.NOTFOUND_CODE = 83; //'？'
		this.SPACE_CODE = 236; //'　'
		this.HYPHEN_CODE = 177; //'-'
		this.ESCAPE_CODE = 254; //$
		this.chipSize = 8;
		this.vChipSize = 8;
		this.fontSize = '8px';
		this.imageName = 'font8p';
		this.DEFAULT_COLOR = COLOR_FONT8;
		this.wordIds;// = new Array();
		if(sizetype != null){
			this.setFontSize(sizetype != null ? sizetype : '12px');
		}
		this.DEFAULT_BGCOLOR = COLOR_TRANSPARENT;
	
		this.scroll;
		// this.targetScroll;
		this.position_x = 0;
		this.position_y = 0;
		this.spriteArray = [];
		this.scroll = "";
		
		this.DrawEvent;// = new DrawEvent();
		this.str;
		this.disp = true;
	},

	setScroll: function(scrollStr)
	{
		this.scroll  = scrollStr;
	},
	
	getScroll: function()
	{
		return this.scroll;
	},
	
	getSpriteHandle: function(str)
	{
		this.makeStrId(str);
		var SpriteHandles = makeSpriteHandle(this.spriteArray, this.scrolls);
		return SpriteHandles;
	},
	
	getSpriteArray: function(str, color, bgColor)
	{
		this.parse(str);
		this.setColor(color == null ? this.color : color, bgColor == null ? this.bgcolor : bgColor);
		this.swapColor();
		return this.spriteArray;
	},
	
	isHorizon: function()
	{
		return (this.chipSize < 12 && this.soundmarkAlign == 'horizon');
	},
	
	isVertical: function()
	{
		return (this.chipSize < 12 && this.soundmarkAlign == 'vertical');
	},
	
	SearchWordNum: function(w){
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
	},
	
	indexOf: function(i){
		//ひらがな
		if(i < 90){return this.moji_hira.substr(i, 1);}
		//カタカナア
		if(i < 180){return this.moji_kata.substr(i - 90, 1);}
		//アルファベット
		if(i < 240){return this.moji_alph.substr(i - 180, 1);}
		//数字
		if(i < 250){return this.moji_suji.substr(i - 240, 1);}

		return this.NOTFOUND_CODE;
	},

	searchNum: function(w){
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

		if(w == this.escapeWord){
			return this.ESCAPE_CODE;
		}
		
		return match < 0 ? this.NOTFOUND_CODE : match + ofs;
	},
	
	toStrId: function(str)
	{
		var idstr, baseword, TheWord, baseWords = []
		;
		for(i = 0; i < MS.length; i++){
			baseword = this.searchNum(MS.substr(i, 1));
			baseWords.push(baseword);
		}
		return baseWords;
	},
	
	makeStrId: function(MS)
	{
		var i, TheWord, baseword = 0, subword = this.SPACE_CODE
			, baseWords = []//行の文字
			, subWords = []//上段行の文字
			, isHorizon =  this.isHorizon(), isVertical = this.isVertical(), isSoundmark
			;

		for(i = 0; i < MS.length; i++){
			TheWord = MS.substr(i, 1);
			baseword = this.searchNum(TheWord);
			
			isSoundmark = baseword in this.soundmarks;//濁点半濁点
			if(isSoundmark && (isHorizon || isVertical)){
				subword = baseword;
				baseword = this.soundmarks[baseword];
			}else{
				subword = this.SPACE_CODE;
				isSoundmark = false;
			}
			
			if(baseword == -1){
				baseword = 179;
				subword = this.SPACE_CODE;
			}else if(baseword == this.ESCAPE_CODE){//特殊
				baseWords = this.escCommand(MS, i, baseWords);
				i += 1;
				continue;
			}
			
			baseWords.push(baseword);
			if(isSoundmark){
				this.soundmarkPos.push({line:this.wordIds.length, left:baseWords.length - 1, word: subword});
			}
			
			//改行ポイント
			if((baseWords.length % this.cols) == 0 && (this.cols > 0)){
				this.newLine(baseWords);
				baseWords = [];
			}
		}
		
		if(baseWords.length > 0){
			// if(!isHorizon){this.newLine(subWords);}
			this.newLine(baseWords);
		}

		return baseWords;
	},
	
	//濁音、半濁音の後挿入
	patchSoundmarks: function(){
		var subLine = [], smp = []
		;
		if(this.isHorizon()){
			this.soundmarkPos.forEach(function(mark, i){
				this.wordIds[mark.line].splice(mark.left + i + 1, 0, mark.word);
				smp.push({line: mark.line, left: mark.left + i + 1});
			}, this);
		}else if(this.isVertical()){
		// console.log(this.soundmarkPos)
			this.wordIds.forEach(function(wordLine, j){
				var sub = [], p = 0;
				wordLine.forEach(function(words, i){
					sub.push(this.SPACE_CODE);
				}, this);
				subLine.push(sub);
			}, this);
			
			this.soundmarkPos.forEach(function(mark, i){
				subLine[mark.line][mark.left] = mark.word;
				smp.push({line: mark.line * 2, left: mark.left});
			}, this);
	
			subLine.forEach(function(line, i){
				this.wordIds.splice(i * 2, 0, line);
			}, this);
		}
		this.soundmarkPos = smp;
		// return subLine;
	},

	setFontSize: function(sizetype)
	{
		if(sizetype == "8px"){
			this.imageName = "font8p";
			this.DEFAULT_COLOR = COLOR_FONT8;
			this.chipSize = 8;
			this.vChipSize = 8;
		}else if(sizetype == "4v6px"){
			this.imageName = "font4v6p";
			this.DEFAULT_COLOR = COLOR_FONT8;
			this.chipSize = 4;
			this.vChipSize = 6;
		}else if(sizetype == "12px"){
			this.imageName = "font12p";
			this.DEFAULT_COLOR = COLOR_FONT12;
			this.chipSize = 12;
			this.vChipSize = 12;
		}else{
			console.log('font no select!!');
		}
	},
	
	setMarkAlign: function(align)
	{
		this.soundmarkAlign = align;
	},

	setStr: function(str)
	{
		this.str = str;
		this.parse(str);
	},

	parse: function(MS)// char length, message
	{
		var ar, spr, i, j, isHorizon = this.isHorizon(), subLine;
		this.wordIds = []//行
		this.soundmarkPos = [];
		
		this.makeStrId(MS + "");
		this.patchSoundmarks();
		this.singleArray = [];

		this.spriteArray =[];
		
		for(i = 0; i < this.wordIds.length; i++){
			spr = imageResource.makeSpriteArray(this.imageName, this.wordIds[i]);
			this.spriteArray.push(spr);
			// this.singleArray = this.singleArray.concat(spr);
		}
		
		if(isHorizon){
			this.soundmarkPos.forEach(function(mark, i){
				this.spriteArray[mark.line][mark.left].rot(2);
			}, this);
		}
	},

	escCommand: function(words, index, lineWords){
		var command = words.substr(index + 1, 1)
			, result = []
		;
		// if(this.wordIds.length >1){
		// console.log(lineWords, this.cols);}
		switch(command){
		case this.newLineWord: result = this.newLine(lineWords);break;
		default: result = lineWords; break;
		}
		return result;
	},

	newLine: function(lineWords)
	{
		this.wordIds.push(lineWords);
		return [];
	},

	setPos: function(x, y)
	{
		if(x != null){this.position_x = x;}
		if(y != null){this.position_y = y;}
	},
	
	getPos: function()
	{
		return {x: this.position_x, y: this.position_y};
	},

	//DrawEventに登録
	registDraw: function(str)
	{
		if(str != null){
			this.setStr(str);
		}
		if(this.DrawEvent == null){
			this.DrawEvent = new DrawEvent(this.str, this);
			this.DrawEvent.append("draw");
		}
	},
	
	draw: function(scr)
	{
		var i, spr, ofs = 0
		, isHorizon = this.isHorizon()
		, isVertical = this.isVertical()
		, ofy = isVertical ? -this.vChipSize : 0
		;
		
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
		for(i = 0; i < this.spriteArray.length; i++){
			lineSpace = isVertical ? (((i / 2) | 0) * this.rowSpace) + (i * this.vChipSize) : i * (this.rowSpace + this.vChipSize);
			scr.drawSpriteArray(this.spriteArray[i], this.position_x, this.position_y + lineSpace + ofy, this.cols);
		}
		// dulog(this.cols);
	},

	//一行の長さ
	setLineCols: function(num)
	{
		this.cols = num;
	},

	setColor: function(color, bgColor)
	{
		this.color = color;
		this.bgcolor = bgColor == null ? this.bgcolor : bgColor;
//		this.swapColor();
	},

	setBGColor: function(color)
	{
		this.bgcolor = color;
//		this.swapColor();
	},

	swapColor: function()
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

	},

	print: function(str, x, y, color, bgcolor)
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
	},
	
	hide: function(){
		this.disp = false;
	},
	
	visible: function()
	{
		this.disp = true;
	},
};
