/**
 * Canvas Draw Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */
//キャンバスことスクロール
var canvasScrollBundle = {};
var VIEWMULTI = 1;
function makeScroll(name, mainFlag, width, height){
	var scr = new CanvasScroll();
	scr.init(name, mainFlag, width, height);
	return scr;
};
dulog = function(){return;};

function CanvasScroll(name, mainFlag, width, height)
{
	function init(name, mainFlag, width, height){
		var size = getDisplaySize()
			, scrsize = getScrollSize()
			, insertDiv
			;
			
		this.canvas = document.getElementById(name);
		if(this.canvas == null){
			this.canvas = document.createElement('canvas');
			this.canvas.setAttribute('id', name);
			document.getElementById('display').appendChild(this.canvas);
		}
	//	this.autoClear = true;//no actiove
	//	this.clearTrig = false;//no clear trigger
		if(mainFlag != null && mainFlag){
			width = size.w;
			height =size.h;
	//		this.autoClear = false;
		}else if(width == null && height == null){
			width = scrsize.w;
			height = scrsize.h;
		}
		if(mainFlag == null || mainFlag == false){
			display = 'none';
		}else{
			display = 'inline';///////////////////////
		}
	//	this.canvas.width = width * VIEWMULTI;
	//	this.canvas.height = height * VIEWMULTI;
		this.name = name;
		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.style.width = width;
		this.canvas.style.height = height;
		this.canvas.style.display = display;
		this.canvas.hidden = display == 'none' ? false : true;
		this.canvas.style.backgroundColor = "transparent";
		
		this.ctx = contextInit(this.canvas);
		this.x = 0;
		this.y = 0;
		canvasScrollBundle[name] = this;
	};
	CanvasScroll.prototype.init = init;

	function draw(otherScroll, x, y)
	{
		//this.ctx.drawImage(otherScroll, otherScroll.x, otherScroll.y, otherScroll.w, otherScroll.h, otherScroll.x, otherScroll.y, otherScroll.w, otherScroll.h);
	}

	function drawto(targetScroll, x, y, w, h)
	{
//		debugUser.log([x, y]);
		if(w == null){w = this.canvas.width;}
		if(h == null){h = this.canvas.height;}
		if(x == null){x = 0;}
		if(y == null){y = 0;}
//		debugUser.log([this.canvas, targetScroll, x, y]);
//		targetScroll.ctx.drawImage(this.canvas, 0 | -x, 0 | -y, 0 | w, 0 | h);
		targetScroll.ctx.drawImage(this.canvas, 0 | -x, 0 | -y);

//		alert();
	}
	CanvasScroll.prototype.drawto = drawto;

	function rasterto(targetScroll, sx, sy, sw, sh, dx, dy, dw, dh)
	{
		if(sw == null){sw = this.canvas.width;}
		if(sh == null){sh = this.canvas.height;}
		if(sx == null){sx = 0;}
		if(sy == null){sy = 0;}
		if(dw == null){dw = sw;}
		if(dh == null){dh = sh;}
		if(dx == null){dx = sx;}
		if(dy == null){dy = sy;}
		
		targetScroll.ctx.drawImage(this.canvas, 0 | sx, 0 | sy, 0 | sw, 0 | sh, 0 | dx, 0 | dy, 0 | dw, 0 | dh);

//		alert();
	}
	CanvasScroll.prototype.rasterto = rasterto;
	/**
	 * ニアレストネイバー
	 * @param targetScroll
	 * @param multi
	 */
	function nearestTo(targetScroll, multi)
	{
		if(targetScroll.canvas == null){return;}
		if(multi == null){multi = VIEWMULTI;}

//		var from = {};
		var to = {}, w, h;//, x, y;

		to.w = targetScroll.canvas.width | 0;
		to.h = targetScroll.canvas.height | 0;
		to.x = (this.x * multi) | 0;
		to.y = (this.y * multi) | 0;

		w = (to.w / multi) | 0;
		h = (to.h / multi) | 0;
		// x = (this.x * multi) | 0;
		// y = (this.y * multi) | 0;

		targetScroll.ctx.drawImage(this.canvas, 0, 0, w, h, to.x, to.y, to.w, to.h);
		
		//ミラーリング
		if(this.x != 0){
			// targetScroll.ctx.drawImage(this.canvas, 0, 0, w, h, to.x - to.w, to.y, to.w, to.h);
		}
		if(this.y != 0){
			// targetScroll.ctx.drawImage(this.canvas, 0, 0, w, h, to.x, to.y - to.h, to.w, to.h);
		}
		if(this.y * this.y != 0){
			// targetScroll.ctx.drawImage(this.canvas, 0, 0, w, h, to.x - to.w, to.y - to.h, to.w, to.h);
		}

	}
	CanvasScroll.prototype.nearestTo = nearestTo;

	/**
	   * 描く
	   * @param sprite
	   * @param x
	   * @param y
	   */
	function drawSprite(sprite, x, y)
	{//echo(x + " " + y +  "   ");
		var image
			, vf = 1, hf = 1, r, rox = 0, roy = 0
		;

		if(sprite.swaps !== null){
			//色変更
			// image = new Image();
			// image.src = this.canvas.toDataURL("image/png");
			// sprite.swapStart().data;
			image = sprite.swapStart(this.ctx.getImageData(x, y, sprite.w, sprite.h));
		}else{
			//通常
			image = sprite.image;
		}

		//反転
		if(sprite.vFlipFlag || sprite.hFlipFlag){
			hf = (-sprite.hFlipFlag + !sprite.hFlipFlag) | 0;
			vf = (-sprite.vFlipFlag + !sprite.vFlipFlag) | 0;
			this.ctx.scale(hf, vf);
		}
		//回転
		if(sprite.rotFlag > 0){
			r = sprite.rotFlag;

			r = (((1 == r) * 90) + ((2 == r) * 180) + ((3 == r) * 270)) * Math.PI / 180;
			rox = x;
			roy = y;
			x = (((Math.cos(r) + Math.sin(r)) * sprite.w) - sprite.w) * 0.5;
			y = (((Math.cos(r + (Math.PI * 0.5)) + Math.sin(r + (Math.PI * 0.5))) * sprite.w) - sprite.w) * 0.5;
			this.ctx.translate(rox , roy);
			this.ctx.rotate(r);
		}
		
		if(sprite.swaps != null){
			//色変更描画
			sprite.workSpace.ctx.putImageData(image, 0, 0);
			this.ctx.drawImage(sprite.workSpace.canvas, 0, 0, 0 | sprite.w, 0 | sprite.h, 0 | (hf * x) - (sprite.w * sprite.hFlipFlag), 0 | (vf * y) - (sprite.h * sprite.vFlipFlag) , 0 | (sprite.w), 0 | (sprite.h));
		}else{
			//通常描画
			// this.ctx.drawImage(image, 0 | sprite.x, 0 | sprite.y, 0 | sprite.w, 0 | sprite.h, 0 | (hf * x), 0 | (vf * y), 0 | (hf * sprite.w), 0 | (vf * sprite.h));
			this.ctx.drawImage(image, 0 | sprite.x, 0 | sprite.y, 0 | sprite.w, 0 | sprite.h, 0 | (hf * x) - (sprite.w * sprite.hFlipFlag), 0 | (vf * y) - (sprite.h * sprite.vFlipFlag) , 0 | (sprite.w), 0 | (sprite.h));
			
		}
		
		//以下元通りにする
		if(sprite.rotFlag > 0){
			this.ctx.rotate(-r);
			this.ctx.translate(-rox , -roy);
		}
		if(sprite.vFlipFlag || sprite.hFlipFlag){
			this.ctx.scale(hf, vf);
		}
		
	};
	CanvasScroll.prototype.drawSprite = drawSprite;

	function drawSpriteArray(spriteArray, x, y, cellsWidth)
	{
		var posX, posY, alen = spriteArray.length
		;
		if(cellsWidth == null){throw "noCellWidth!";}
		
		spriteArray.forEach(function(sprite, i){
			posX = (x < 0) 
			? DISPLAY_WIDTH + (sprite.w * (i % cellsWidth)) + x
			: (sprite.w * (i % cellsWidth)) + x;
			posY = (y < 0)
			? DISPLAY_HEIGHT + (sprite.h * (0 | (i / cellsWidth))) + y
			: (sprite.h * (0 | (i / cellsWidth))) + y;
			if((y < 0) ){
				dulog(((0 | (i / cellsWidth)) - (0 | (alen / cellsWidth))))
			}

			this.drawSprite(sprite, posX, posY);
			
		}, this);
		// (i = 0; i < spriteArray.length; i += 1){
		// }
	};
	CanvasScroll.prototype.drawSpriteArray = drawSpriteArray;

	function drawSprite2dArray(sprite2dArray, x, y)
	{
		var j , i, posX, posY;
		sprite2dArray.forEach(function(spriteArray, j){
			spriteArray.forEach(function(sprite, i){
				posX = (x < 0) 
				? DISPLAY_WIDTH + (sprite.w * i) + x
				: (sprite.w * i) + x;
				posY = (y < 0)
				? DISPLAY_HEIGHT + (sprite.h * j) + y
				: (sprite.h * j) + y;
				this.drawSprite(sprite, posX, posY);
			}, this);
		}, this);
		// for(j= 0; j < spriteArray.length; j += 1){
			// for(i = 0; i < spriteArray[0].length; i++){
			// }
		// }
	};
	CanvasScroll.prototype.drawSprite2dArray = drawSprite2dArray;

	function drawSpriteChunk(chunk, x, y)
	{
		if(chunk.length == null){
			// dulog(chunk);
			chunk = [[chunk]];
		}
		if(chunk.length == 0){
			chunk = [[chunk]];
		}
		if(chunk[0].length == 0){
			chunk = [chunk];
		}
		this.drawSprite2dArray(chunk, x, y);
	}
	CanvasScroll.prototype.drawSpriteChunk = drawSpriteChunk;

	function stackClear()
	{
		DRAW_EVENTS.oneShot(this, "clear");
	}
	CanvasScroll.prototype.stackClear = stackClear;

	function stackDraw(func)
	{
		DRAW_EVENTS.oneShot(this, func);
	}
	CanvasScroll.prototype.stackDraw = stackDraw;

	function pset(x, y, color)
	{
		var img = this.ctx.getImageData(0, 0)
		// var img = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
			// , data = img.data
			// , pos = (x + (this.canvas.width * y)) * 4;
			;
			// img[pos++] = color[0];
			// img[pos++] = color[1];
			// img[pos++] = color[2];
			// img[pos++] = color[3];
	}
	CanvasScroll.prototype.pset = pset;

	// function spriteLine(from, to, sprite)
	function spriteLine(from, to, color)
	{
		var i
			, point
			, lx = to.x - from.x
			, ly = to.y - from.y
			, pri =  lx * lx > ly * ly ? 'x' : 'y' //大きい方
			, len = pri == 'x' ? lx : ly
			, dx = pri == 'x' ? 1 : lx / ly
			, dy = pri == 'y' ? 1 : ly / lx
		;
		if(isNaN(len)){
			return;
		}
		
		point = this.ctx.getImageData(0, 0, 1, 1);
		
		point.data[0] = color[0];
		point.data[1] = color[1];
		point.data[2] = color[2];
		point.data[3] = color[3];
		
		if(len < 0){
			for(i = 0; -i > len - 1; i++){
				this.ctx.putImageData(point, (to.x + (i * dx)) | 0, (to.y + (i * dy)) | 0);
			}
		}else if(len > 0){
			for(i = 0; i < len + 1; i++){
				this.ctx.putImageData(point, (from.x + (i * dx)) | 0, (from.y + (i * dy)) | 0);
			}
		}else{
			this.ctx.putImageData(point, from.x, from.y);
		}
		
		// this.ctx.beginPath();
		// this.ctx.lineWidth = 1;
		// this.ctx.strokeStyle = makeRGBA(color);
		// this.ctx.beginPath();
		// this.ctx.moveTo(from.x, from.y);
		// this.ctx.lineTo(to.x, to.y);
		// this.ctx.stroke();
		// this.ctx.closePath();
	}
	CanvasScroll.prototype.spriteLine = spriteLine;
	
	/**
	* 消す
	*/
	function clear(color, rect)
	{
//		echo(this.canvas.getAttribute("id"));

		if(rect == null){
			rect = {x: 0, y: 0, w: (0 | this.canvas.width), h: (0 | this.canvas.height)}
		}else{
		}
		if(color != null){
			//this.canvas.style.backgroundColor = color;
			this.ctx.fillStyle = makeRGB(color);
			this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
		}else{		
			this.ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
		}
	};
	CanvasScroll.prototype.clear = clear;

//未使用？
	function colorSwap(sprite, left, top)
	{
		var swaps = sprite.swaps
			, tmp, tmpimage
			, from, to, data, index
			, i, y, x
			;
		sprite.swaps = null;//一旦nullにしないと無限入れ子

		tmp = new CanvasScroll();
		tmp.init("tmp", null, sprite.w, sprite.h);
		tmp.hide();

		tmp.drawSprite(sprite);
		tmpimage = tmp.ctx.getImageData(0, 0, sprite.w, sprite.h);
		data = tmpimage.data;
		for(i in swaps){
			from = swaps[i][0];
			to = swaps[i][1];
			index = 0;
			for(y = 0; y < sprite.h; y++){
				for(x = 0; x < sprite.w; x++){
					if(data[index] == from[0] && data[index + 1] == from[1] && data[index + 2] == from[2] && data[index + 3] == from[3]){
						data[index++] = to[0];
						data[index++] = to[1];
						data[index++] = to[2];
						data[index++] = to[3];
					}else{
						index += 4; continue;
					}
				}
			}
		}
		tmp.ctx.putImageData(tmpimage, 0, 0);

		this.ctx.drawImage(tmp.canvas, left, top, sprite.w, sprite.h);
		sprite.swaps = swaps;//もどしてやる

	}
	CanvasScroll.prototype.colorSwap = colorSwap;

	/**
	* 映す
	*/
	function project(scrollsrc)
	{
		this.ctx.clearRect();
	};
	CanvasScroll.prototype.clear = clear;

	function zIndex(z)
	{
		this.canvas.style.zIndex = z;
	};
	  CanvasScroll.prototype.zIndex = zIndex;

	  function hide()
	  {
		  this.canvas.hidden = true;
	  };
	  CanvasScroll.prototype.hide = hide;

	  function visible()
	  {
		  this.canvas.hidden = false;
	  };
	  CanvasScroll.prototype.visible = visible;

	  function is_visible()
	  {
		  if(this.canvas.hidden){return false;}
		  return true;
	  }
	  CanvasScroll.prototype.is_visible = is_visible;

	  function setPosition(x, y)
	  {
		  this.canvas.style.left = x + "px";
		  this.canvas.style.top = y + "px";
	  }
	  CanvasScroll.prototype.setPosition = setPosition;

	  function getSize()
	  {
		  var size = new Array();
		  size['w'] = this.canvas.width;
		  size['h'] = this.canvas.height;
		  return size;
	  }
	  CanvasScroll.prototype.getSize = getSize;

	function screenShot()
	{
		//図形の保存
		var img = new Image();
		//保存できるタイプは、'image/png'と'image/jpeg'の2種類
		var type = 'image/png';
		//imgオブジェクトのsrcに格納。
		img.src = this.canvas.toDataURL(type);
		//念のため、onloadで読み込み完了を待つ。
		img.onload = function() {
			//例：現在のウィンドウに出力。
			// location.href = img.src;
			//別ウィンドウに表示
			var element_img = document.createElement("img");
			var element_a = document.createElement("a");
			var del_a = document.createElement("a");
			var pair = document.createElement("span");
			element_img.setAttribute("src", img.src);
			element_img.setAttribute("width", "96px");
			element_a.setAttribute("href", "javascript:window.open('" + img.src +"'); ");
			del_a.setAttribute("onclick", "SSImgRemove(this)");
			del_a.innerHTML = '<a href="javascript:void(0);">X</a>';
			
			element_a.appendChild(element_img);
			pair.appendChild(del_a);
			pair.appendChild(element_a);
			
			document.body.appendChild(pair);
		}; 
	}
	CanvasScroll.prototype.screenShot = screenShot; 

};

function SSImgRemove(obj)
{
	// dulog(obj.parentNode.parentNode);
	obj.parentNode.parentNode.removeChild(obj.parentNode)
}

/**
 * 簡易呼び出し
 */
function screenView(to, from, multi)
{
	from.nearestTo(to, multi);
}

function scrollByName(name)
{
	var scr = canvasScrollBundle == null ? layerScroll : canvasScrollBundle;
	return (scr[name] != null) ? scr[name] : null;
}
/**
 * 画面キャプチャー
 */
function captureScreen(scrollName)
{
	scrollByName(scrollName).screenShot();
}

function contextInit(canvas)
{
	var ctx
	;
	ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;//アンチ無効
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.oImageSmoothingEnabled = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// ctx.scale(-1, 1);
	// ctx.translate(-canvas.width, 0);
	return ctx;
}
////////
////////
////////
/**
 * イメージリソース
 */
var imageResource = function(){};

imageResource.init = function(){
	this.data = [];
	this.dirpath =  "./images/spritechips/";
	this.extention =  ".png";
	this.isLoadNum = 0;//ロードする数
	this.loadcount = 0;//ロードした数
	this.separateWidth = [];
	this.separateHeight = [];
	this.workSpace = [];
	this.stack= [];
	this.ctx = {};
	this.loadRefreshTime = Date.now();
	
	this.multi = window.VIEWMULTI == null ? 1 : window.VIEWMULTI;
};	
imageResource.init();

//imageResource.create = function(nameArray, sepWidth, sepHeight)
imageResource.create = function(name, sepWidth, sepHeight, callbackEnable)
{
	this.separateWidth[name] = sepWidth;
	this.separateHeight[name] = sepHeight;

	var img = new Image()
	;
	img.src = this.dirpath + name + this.extention;
	
	if(callbackEnable == null){
		callbackEnable = true;
	}
	if(callbackEnable){
		img.onload = this.loaded;//ロードされたらカウント
	}
	img.name = name; //無理やりプロパティ
	this.data[name] = img;
};
/**
 * プリロード用
 */
imageResource.appendImage = function(name, img, sepWidth, sepHeight)
{
	this.separateWidth[name] = sepWidth;
	this.separateHeight[name] = sepHeight;

	this.data[name] = img;
};


imageResource.push = function(name, sepWidth, sepHeight)
{
	this.stack.push({name: name, w:sepWidth, h:sepHeight, });
	this.isLoadNum++;
};

// function loadImages(imageNames){
	// this.stack = imageNames;
	// this.isLoadNum = this.stack.length;
	// imageResource.createStack();
// }

imageResource.createStack = function()
{
	for(var i = 0; i < this.stack.length; i++){
		this.create(this.stack[i].name, this.stack[i].w, this.stack[i].h);
	}
	this.stack = [];
};

imageResource.makePointSprite = function(name, index, size)
{
	var img = this.data[name]
		, cellsX = 0|(img.width / this.separateWidth[name])
		, cellsY = 0|(img.height / this.separateHeight[name])
		, x = (index % cellsX) * this.separateWidth[name]
		, y = (0|(index / cellsX)) * this.separateHeight[name]
		, spr
		;
		size = size == null ? 1 : size;
	spr = new CanvasSprite();
	spr.init(name, x, y, size, size);
	return spr;
};

imageResource.makeSprite = function(name, index)
{
	var img = this.data[name]
		, cellsX = 0|(img.width / this.separateWidth[name])
		, cellsY = 0|(img.height / this.separateHeight[name])
		, x = (index % cellsX) * this.separateWidth[name]
		, y = (0|(index / cellsX)) * this.separateHeight[name]
		, spr = new CanvasSprite()
		;
	spr.init(name, x, y, this.separateWidth[name], this.separateHeight[name]);
	return  spr;
};

/**
 * 配列でスプライト生成
 * 画像が読み込まれる前にinit等を実行するタイミングに注意
 * @param name
 * @param indexes
 * @returns {Array}
 */
imageResource.makeSpriteArray = function(name, indexes)
{
// console.log(name, indexes)
	var img = this.data[name]
		, cellsX = 0 | (img.width / this.separateWidth[name])
		, cellsY = 0 | (img.height / this.separateHeight[name])
		, spriteArray = [], i, x, y, spr
	;
		
	for(i = 0; i < indexes.length; i++){
		x = (indexes[i] % cellsX) * this.separateWidth[name];
		y = (0 | (indexes[i] / cellsX)) * this.separateHeight[name];
		spr = new CanvasSprite();
		spr.init(name, x, y, this.separateWidth[name], this.separateHeight[name]);
		spriteArray.push(spr);
	}

	return spriteArray;
};

imageResource.makeSprite2dArray = function(name, indexes)
{
	var img = this.data[name]
		, cellsX = 0 | (img.width / this.separateWidth[name])
		, cellsY = 0 | (img.height / this.separateHeight[name])
		, spriteArray = [], j, i, x, y, spr
	;

	for(j = 0; j < indexes.length; j++){
		for(i = 0; i < indexes[0].length; i++){
			x = (indexes[j][i] % cellsX) * this.separateWidth[name];
			y = (0 | (indexes[j][i] / cellsX)) * this.separateHeight[name];
			spr = new CanvasSprite();
			spr.init(name, x, y, this.separateWidth[name], this.separateHeight[name]);
			spriteArray.push(spr);
		}
	}
	return spriteArray;
};

/**
 * 2次元配列から2次元スプライト配列をつくる
 */
imageResource.makeSpriteChunk = function(name, indexes)
{
	var img = this.data[name]
		, cellsX = 0 | (img.width / this.separateWidth[name])
		, cellsY = 0 | (img.height / this.separateHeight[name])
		, spriteChunk = [], i, j, x, y, spr
	;
	for(j = 0; j < indexes.length; j++){
		spriteChunk[j] = [];
		for(i = 0; i < indexes[0].length; i++){
			x = (indexes[j][i] % cellsX) * this.separateWidth[name];
			y = (0 | (indexes[j][i] / cellsX)) * this.separateHeight[name];
			spr = new CanvasSprite();
			spr.init(name, x, y, this.separateWidth[name], this.separateHeight[name]);
			spriteChunk[j].push(spr);
		}
	}
	return spriteChunk;
};

/**
 * rect(x, y, w, h)から2次元スプライト配列をつくる
 */
imageResource.makeSpriteChunkFromRect = function(name, sprect)
{
	var img = this.data[name]
		, spriteChunk = []
		, i, j, x, y, spr
	;

	for(j = 0; j < sprect.h; j++){
		spriteChunk[j] = [];
		for(i = 0; i < sprect.w; i++){
			x = (sprect.x + i) * this.separateWidth[name];
			y = (sprect.y + j) * this.separateHeight[name];
			spr = new CanvasSprite();
			spr.init(name, x, y, this.separateWidth[name], this.separateHeight[name]);
			spriteChunk[j].push(spr);
		}
	}
	return spriteChunk;
};

imageResource.width = function(name)
{
	return this.data[name].width;
};
imageResource.height = function(name)
{
	return this.data[name].height;
};
/**
 * ロードされた
 * イベントより呼び出されたものなのでthisはImageオブジェクト？
 */
imageResource.loaded = function (){
	imageResource.loadcount++;	
	var canvas, ctx, workSpace
	;
	canvas = document.createElement('canvas');
	canvas.width = this.width;
	canvas.height = this.height;
	ctx = contextInit(canvas);
	ctx.drawImage(this, 0, 0);
	imageResource.data[this.name] = canvas;
	imageResource.ctx[this.name] = ctx;
	
	canvas = document.createElement('canvas');
	canvas.width = imageResource.separateWidth[this.name];
	canvas.height = imageResource.separateHeight[this.name];
	ctx = contextInit(canvas);
	workSpace = {canvas:canvas, ctx:ctx};
	imageResource.workSpace[this.name] = workSpace;
	delete img;
	if(imageResource.isload()){
		console.log('Onload ImageResource.');
		imageResource.onload();
	}
};

imageResource.isload = function()
{
	if(this.loadcount == this.isLoadNum){
		return true;
	}
	return false;
};

imageResource.onload = function(){
	//alert();
};

/**
 * コールバック付き画像ロード
 */
function preLoadImage(name, sepWidth, sepHeight,  func)
{
	// preLoadObj = this.apply;
	var t = new Image(), r = imageResource;
	t.src = r.dirpath + name + r.extention + '?lrt=' + r.loadRefreshTime;
	t.name = name;
	t.sepWidth = sepWidth == null ? null : sepWidth;
	t.sepHeight = sepHeight == null ? null : sepHeight;
	
	t.onload = function(){
		r.appendImage(this.name, this, this.sepWidth == null ? this.width | 0 : this.sepWidth, this.sepHeight == null ? this.height | 0 : this.sepHeight);
		func();
	};
}

function setImageLoadRefreshTime(time){
	imageResource.loadRefreshTime = time;
}

function setLoadImageDir(dir)
{
	var pre = imageResource.dirpath;
	imageResource.dirpath = dir;
	return pre;
}
// var preLoadImageTmp;

function makePoint(name, sprite, size)
{
	return imageResource.makePointSprite(name, sprite, size);
};
function makeSprite(name, sprite)
{
	return imageResource.makeSprite(name, sprite);
};
/**
 * 短縮系関数
 * 
 * sprect:sprite rect or 2dArray
 * makeRect(x,y,w,h)
 * [a1,a2,a3,a4]
 */
function makeSpriteChunk(name, sprect)
{
	try{
		if(sprect.length != null){
			return imageResource.makeSpriteChunk(name, sprect);
		}
//		debugUser.log(sprect);
		return imageResource.makeSpriteChunkFromRect(name, sprect);
	}catch(e){
		dulog(name + ": error makeSpriteChunk");
		dulog(sprect);
	}
}

function spreadSpriteChunk(name, indexes, w, h)
{
	try{
		var spArray = [];
		for(var y = 0; y < h; y++){
			spArray[y] = [];
			for(var x = 0; x < w; x++){
				spArray[y].push(indexes);
			}
		}
		return imageResource.makeSpriteChunk(name, spArray);
	}catch(e){
		dulog(name);
		dulog(indexes);
	}
}

function imageCellWidth(name)
{
	return imageResource.data[name].width;
}

function imageSeparateWidth(name)
{
	return imageResource.separateWidth[name];
}
function imageChipSize(name)
{
	return imageResource.separateWidth[name];
}

function spriteFromImage(name, index)
{
	var sp = imageResource.makeSprite(name, index);
	return sp;
}
////////
////////
////////
/**
 * キャンバススプライト
 * @param img
 * @param x
 * @param y
 * @param w
 * @param h
 * @returns
 */
function CanvasSprite(){return;}
CanvasSprite.prototype = {

	// init: function(img, x, y, w, h)
	init: function(name, x, y, w, h)
	{
		// if(typeof img == "object"){
			// //?
			// this.image = img.image;
			// this.x = img.x; this.y = img.y;
			// this.w = img.w; this.h = img.h;
		// }else{
			// this.image = img;
			// this.x = x; this.y = y;
			// this.w = w; this.h = h;
		// }
		this.image = imageResource.data[name];
		this.ctx = imageResource.ctx[name];
		this.workSpace = imageResource.workSpace[name];
		this.x = x; this.y = y;
		this.w = w; this.h = h;
		this.swaps = null;
		this.swapImage = [];
		this.hFlipFlag = false;
		this.vFlipFlag = false;
		this.rotFlag = 0; //0:↑ 1:→ 2:↓ 3:←
		this.name = name;
	},
	
	drawScroll: function(scroll, x, y)
	{
		scroll.drawSprite(this, 0 | x, 0 | y);
	},

	makeRect: function(x, y)
	{
		var rects = new Rect(x, y, this.w, this.h);
		return rects;
	},

	vflip: function(toggle)
	{
		this.vFlipFlag = toggle == null ? !this.vFlipFlag : toggle;
		
		return this.vFlipFlag;
	},
	
	hflip: function(toggle)
	{
		this.hFlipFlag = toggle == null ? !this.hFlipFlag : toggle;
		
		return this.hFlipFlag;
	},
	//回転非対応
	rot: function(trbl)
	{
		this.rotFlag = trbl == null ? (trbl + 1) % 4 : trbl;
		return this.rotFlag;
	},

	/**
	 * スクロール側で実行
	 */
	swapStart: function(bg)
	{
		var tmp, data, bgdata, index = 0
			, from , to, pixels = this.w * this.h, p
		;
		if(this.swaps == null){this.swaps = [];}
		tmp = this.ctx.getImageData(this.x, this.y, this.w, this.h);
		data = tmp.data; bgdata = bg.data;
		for(p = 0; p < pixels; p++){
			this.swaps.forEach(function(swap, i){
			// (i = 0; i < this.swaps.length; i++){
				from = swap[0];
				to = swap[1];
				if(data[index] == from[0] && data[index + 1] == from[1] && data[index + 2] == from[2] && data[index + 3] == from[3]){
					data[index] = to[0];
					data[index+1] = to[1];
					data[index+2] = to[2];
					data[index+3] = to[3];
				}
			}, this);
			if(data[index + 3] == 0){
				//アルファ描画補正
				data[index] = bgdata[index];
				data[index+1] = bgdata[index + 1];
				data[index+2] = bgdata[index + 2];
				data[index+3] = bgdata[index + 3];
			}
			index += 4;
		}
		this.swapImage = tmp;
		return tmp;
	},
	/**
	 * 色を交換
	 */
	swapColor: function(to, from)
	{
		if(this.swaps == null){this.swaps = [];}
		this.swaps.push([from, to]);
	},

	swapColorReset: function()
	{
		this.swaps = null;
	},

};

//サイズ変換
function cellto(cell, size, side)
{
	if(size == null){
		size = CHIPCELL_SIZE_HALF;
	}
	
	if(side != null && side == "bottom"){
		return DISPLAY_HEIGHT - (cell * size);
	}else if(side != null && side == "right"){
		return DISPLAY_WIDTH - (cell * size);
	}
	return cell * size;
}
function cellhto(cellh, side)
{
	if(side != null && side == "bottom"){
		return DISPLAY_HEIGHT - (cellh * CHIPCELL_SIZE_HALF);
	}else if(side != null && side == "right"){
		return DISPLAY_WIDTH - (cellh * CHIPCELL_SIZE_HALF);
	}
	return cellh * CHIPCELL_SIZE_HALF;
}

function tocellh(px)
{
	return (px / CHIPCELL_SIZE_HALF) | 0;
}

function SpriteHandle(imageName, id, scroll)
{
//	alert(imageName);
	this.x = 0;
	this.y = 0;
	this.sprite;
	this.scroll = 'view';
	this.disp = true;
	this.id = null;
	this.key = null;
	this.destroy = false;
	this.imageName = "";
	this.sortIndex = 0;
	this.frameAnimation = null;	// = new frameAnimation();
	this.frameTransition = {x: null, y:null};	// = new frameTransition();
	this.name = "noname";
	this.priority = "";//多分使わない方向

	if(scroll != null){
		this.scroll = scroll;
	}

//	this.sprite = imageResource.makeSprite(this.imageName, 0);
	if(imageName != null){
		this.imageName = imageName;
	}
	if(id != null){
		this.id = id;
	}
	//スプライトをつくる
	if(this.id != null && this.scroll != null){
		this.sprite = imageResource.makeSprite(this.imageName, this.id);
// console.log(111)
	}

	// function initWithResourceSpriteScroll(resource, sprite, scroll)
	// {
		// this.sprite = sprite;
		// this.setImageName(resource);
		// this.setScroll(scroll);
		// this.key = SpriteHandleBundle.stack(this);//これがやばい→インスタンス時の参照渡しは厳禁
	// }
	// SpriteHandle.prototype.initWithResourceSpriteScroll = initWithResourceSpriteScroll;
	
	function initWithResourceSpriteIdScroll(resource, id, scroll)
	{
		// dulog(resource);
		this.setImageName(resource);
		this.setId(id);
		this.setScroll(scroll);
		if(this.key == null){
			this.key = SpriteHandleBundle.stack(this);//
		}
		this.sortIndex = 0;
	}
	SpriteHandle.prototype.initWithResourceSpriteIdScroll = initWithResourceSpriteIdScroll;
	
	function initWithResourceSpriteRectScroll(resource, sprRect, scroll)
	{
		this.setImageName(resource);
		if(sprRect != null){
			this.sprite = makeSpriteChunk(resource, sprRect);
		}
		this.setScroll(scroll);
		if(this.key == null){
			this.key = SpriteHandleBundle.stack(this);//
		}
		this.sortIndex = 0;
	}
	SpriteHandle.prototype.initWithResourceSpriteRectScroll = initWithResourceSpriteRectScroll;
	
	function setTransition(dist, frame, points, delay, loop, func){
		var trn = this.frameTransition; 
		if(trn != null){
			trn = this.initTransition(trn, dist, points, frame, (delay != null) ? delay : null, (loop != null) ? loop : null, (func != null) ? func : null);
		}else{
			trn = this.makeTransition("", dist, points, frame, (delay != null) ? delay : null, (loop != null) ? loop : null, (func != null) ? func : null);
		}
		this.frameTransition = trn;
	}
	SpriteHandle.prototype.setTransition = setTransition;

	function setTransition_x(dist, frame, points, delay, loop, func){
		var trn = this.frameTransition.x;
		if(trn != null){
			trn = this.initTransition(trn, dist, points, frame, (delay != null) ? delay : null, (loop != null) ? loop : null, (func != null) ? func : null);
		}else{
			trn = this.makeTransition(".x", dist, points, frame, (delay != null) ? delay : null, (loop != null) ? loop : null, (func != null) ? func : null);
		}
		this.frameTransition.x = trn;
	}
	SpriteHandle.prototype.setTransition_x = setTransition_x;
	
	function setTransition_y(dist, frame, points, delay, loop, func){
		var trn = this.frameTransition.y;
		if(trn != null){
			trn = this.initTransition(trn, dist, points, frame, (delay != null) ? delay : null, (loop != null) ? loop : null, (func != null) ? func : null);
		}else{
			trn = this.makeTransition(".y", dist, points, frame, (delay != null) ? delay : null, (loop != null) ? loop : null, (func != null) ? func : null);
		}
		this.frameTransition.y = trn;

	}
	SpriteHandle.prototype.setTransition_y = setTransition_y;
	
	function getTransition()
	{
		return this.frameTransition;
	}
	SpriteHandle.prototype.getTransition = getTransition;

	function makeTransition(ext, dist, points, frame, delay, loop, func){
		var trn = new FrameTransition(this.imageName + "." + this.scroll + "." + this.key + ext);
		this.initTransition(
			trn, dist, 
			(points == null) ? null : points,
			(frame == null) ? null : frame,
			(delay == null) ? null : delay,
			(loop == null) ? null : loop,
			(func == null) ? null : func
			
		);
		// trn.setFramePoints(dist, frame, (points == null) ? null : points);
		// if(delay != null){//みしよう？
			// trn.setDelay(delay);
		// }
		// if(func != null){
			// trn.setCallback(func);
		// }
		// // dulog(trn.from)
		// trn.loop = (loop != null) ? loop : trn.loop;

		return trn;
	}
	SpriteHandle.prototype.makeTransition = makeTransition;
	
	function initTransition(trn, dist, points, frame, delay, loop, func){
		trn.setFramePoints(dist, frame, (points == null) ? null : points);
		if(delay != null){//みしよう？
			trn.setDelay(delay);
		}
		if(func != null){
			trn.setCallback(func);
		}
		// dulog(trn.from)
		trn.loop = (loop != null) ? loop : trn.loop;

		return trn;
	}
	SpriteHandle.prototype.initTransition = initTransition;

	function resetTransition_x()
	{
		this.frameTransition.x.resetCount();
	}
	SpriteHandle.prototype.resetTransition_x = resetTransition_x;
	
	function resetTransition_y()
	{
		this.frameTransition.y.resetCount();
	}
	SpriteHandle.prototype.resetTransition_y = resetTransition_y;
	
	function doesTransition()
	{
		return this.frameTransition == null ? false : !this.frameTransition.isFinish();
	}
	SpriteHandle.prototype.doesTransition = doesTransition;

	function doesTransition_x()
	{
		return this.frameTransition.x == null ? false : !this.frameTransition.x.isFinish();
	}
	SpriteHandle.prototype.doesTransition_x = doesTransition_x;

	function doesTransition_y()
	{
		return this.frameTransition.y == null ? false : !this.frameTransition.y.isFinish();
	}
	SpriteHandle.prototype.doesTransition_y = doesTransition_y;
	
	function doesAnimation()
	{
		return this.frameAnimation == null ? false : !this.frameAnimation.isFinish();
	}
	SpriteHandle.prototype.doesAnimation = doesAnimation;

	function setAnimation(sprites, frames, delay, loop, func, primary)
	{
		// var anm = new FrameAnimation(this.imageName + "." + this.scroll + "." + this.key);
		var anm;
		if(this.frameAnimation == null){
			anm = new FrameAnimation(this.priority + this.imageName + "." + this.scroll + "." + this.key);
		}else{
			anm = this.frameAnimation;
		}
		anm.setSpritesFrames(sprites, frames);
		this.sprite = [];
		for(var i = 0; i < sprites.length; i++){
			if(sprites[i].length != null){
				this.sprite.push(makeSprite(this.imageName, sprites[i]));
			}else{
				// this.sprite[sprites[i]] = makeSprite(this.imageName, sprites[i]);
				this.sprite.push(makeSprite(this.imageName, sprites[i]));
			}
		}
		anm.loop = (loop != null) ? loop : anm.loop;
			//	dulog(this.sprite);

		this.frameAnimation = anm;
	}
	SpriteHandle.prototype.setAnimation = setAnimation;

	function setName(name){
		this.name = name;
	}
	SpriteHandle.prototype.setName = setName;

	function setImageName(imageName){
		this.imageName = imageName;
	}
	SpriteHandle.prototype.setImageName = setImageName;

	function setScroll(scroll){
		if(typeof scroll == "string"){
			scroll = scrollByName(scroll);
		}
		this.scroll = scroll;
		// dulog(this.scroll)
	}
	SpriteHandle.prototype.setScroll = setScroll;

	function setId(id){
		if(id == null){
			id = 0;
		}
		if(id.length != null){
			this.setIds(id);
			return;
		}
		
//		this.sprite = imageResource.makeSprite(this.imageName, this.id);
		this.id = id;
		this.sprite = imageResource.makeSprite(this.imageName, this.id);
		var swap = this.getSwap();
		this.setSwap(swap);
	}
	SpriteHandle.prototype.setId = setId;

	function setIds(ids){
		if(ids.length == 0){
			ids = [[ids]];
		}
		if(ids[0].length == 0){
			ids = [ids];
		}
		this.id = ids;
		// dulog(this.id);
		this.sprite = makeSpriteChunk(this.imageName, this.id);
		var swap = this.getSwap();
		this.setSwap(swap);
	}
	SpriteHandle.prototype.setIds = setIds;

	function setPos(x, y){
		if(x != null){
			this.x = x;
		}
		if(y != null){
			this.y = y;
		}
	}
	SpriteHandle.prototype.setPos = setPos;

	function getPos()
	{
		var x = this.x;
		x += (this.frameTransition.x != null) ? this.frameTransition.x.getNowPoint() : 0;
		var y = this.y;
		y += (this.frameTransition.y != null) ? this.frameTransition.y.getNowPoint() : 0;
		return {x: x, y: y};
	}
	SpriteHandle.prototype.getPos = getPos;
	
	function getSprite()
	{
		// return (this.frameAnimation != null) ? this.sprite[this.frameAnimation.getNowSprite()] : this.sprite;
		try{
			return (this.frameAnimation != null) ? this.sprite[this.frameAnimation.getNowSpritePat()] : this.sprite;
		}catch(e){
			dulog([this.frameAnimation, this.sprite]);
			throw 'getSprite error: ';
		}
		
	}
	SpriteHandle.prototype.getSprite = getSprite;
	
	function setSprite(sprite)
	{
		this.sprite = sprite;
	}
	SpriteHandle.prototype.setSprite = setSprite;
	
	function setSort(index)
	{
		this.sortIndex = index;
	}
	SpriteHandle.prototype.setSort = setSort;
	function getSortIndex(index)
	{
		return this.sortIndex;
	}
	SpriteHandle.prototype.getSortIndex = getSortIndex;
	
	function width()
	{
		return this.sprite.w;
	}
	SpriteHandle.prototype.width = width;

	function height()
	{
		return this.sprite.h;
	}
	SpriteHandle.prototype.height = height;

	function visible()
	{
		this.disp = true;
	}
	SpriteHandle.prototype.visible = visible;

	function hide()
	{
		this.disp = false;
	}
	SpriteHandle.prototype.hide = hide;

	//スクロールに書き込む
	function drawScroll(scr, x, y){
		if(scr == null){
			if(this.scroll == null){return;}
			scr = this.scroll;
		}
		if(this.getSprite() == null){return;}
		
		if(!this.disp){return;}
		var pos;
		if(x != null && y != null){
			pos = {x:x, y:y};
		}else{
			pos = this.getPos();
		};
		if(this.sprite.length == null){
			scr.drawSprite(this.getSprite(), pos.x, pos.y);
		}else{
			scr.drawSpriteChunk(this.getSprite(), pos.x, pos.y);
		}
	}
	SpriteHandle.prototype.drawScroll = drawScroll;

	function getSwap()
	{
		if(this.sprite.length != null){
			if(this.sprite[0].length != null){
				return this.sprite[0][0].swaps;
			}
			return this.sprite[0].swaps;
		}
		return this.sprite.swaps;
	}
	SpriteHandle.prototype.getSwap = getSwap;

	function setSwap(swap)
	{
		if(this.sprite.length != null){
			if(this.sprite[0].length != null){
				for(var j in this.sprite){
					for(var i in this.sprite[j]){
						this.sprite[j][i].swaps = swap;
					}
				}
				return;
			}
			for(var i in this.sprite){
				this.sprite[i].swaps = swap;
			}
			return;
		}
		this.sprite.swaps = swap;
	}
	SpriteHandle.prototype.setSwap = setSwap;

	function swapColor(to, from)
	{
//		alert(from);
		this.sprite.swapColor(to, from);
	}
	SpriteHandle.prototype.swapColor = swapColor;
	function swapColorReset()
	{
		this.sprite.swapColorReset();
	}
	SpriteHandle.prototype.swapColorReset = swapColorReset;
	//スタックする
//	function stack(scroll){
//		if(scroll != null){
//			this.scroll = scroll;
//		}
////		if(this.sprite == null){return;}alert(scroll);
//	}
//	SpriteHandle.prototype.stack = stack;

	function makeRect()
	{
		var rect = this.sprite.makeRect();
		return rect;
	}
	SpriteHandle.prototype.makeRect = makeRect;


	function remove(){
		this.destroy = true;
		this.hide();
		if(this.frameAnimation != null){
			this.frameAnimation.remove();
		}
		if(this.frameTransition.remove != null){
			this.frameTransition.remove();
		}else{
			if(this.frameTransition.y != null){
				this.frameTransition.y.remove();
			}
			if(this.frameTransition.x != null){
				this.frameTransition.x.remove();
			}
		}
		delete this.sprite;
	}
	SpriteHandle.prototype.remove = remove;
}

function getScrollNum()
{
	return layerScroll.length;
}


/**
 * スプライトハンドルまとめ（DrawEventでまとめてSprite実行）
 */

var SpriteHandleBundle = {};

SpriteHandleBundle.init = function()
{
	this.spriteStacks = new Array(getScrollNum());//sprite Handle

	this.FrameEvent = new FrameEvent("sprite:frame");//FrameEventを先にインスタンスしないとDrawEventがインスタンスできない
	this.DrawEvent = new DrawEvent("zzzsprite:draw", this);//これでいいのかよくわからない
//	alert(a_dump(this.DrawEvent));
	this.DrawEvent.append("draw");
//	this.FrameEvent.append("ysort");

	this.stack = function(spriteh)
	{
		// console.log(111);
		var scroll;
		// if(this.spriteStacks == null){return;}
		if(spriteh.scroll == null){return;}
		scroll = spriteh.scroll;
		if(scroll == null){scroll = 'view';}
		if(this.spriteStacks[scroll] == null){
		// alert(scroll);
			this.spriteStacks[scroll] = [];
		}
		// console.dir(spriteh);
		var returnKey =this.spriteStacks[scroll].length;
		this.spriteStacks[scroll].push(spriteh);
		// dulog(returnKey);
		return returnKey;
//		this.spriteStacks.push = spriteh;
	};

	this.sort = function()
	{

	};

	this.ysort = function(stacks)
	{
//		for(var j in stacks){
//			for(var i in stacks[]){
//
//			if(this.spriteStacks[scroll].y )
//			this.spriteStacks[scroll].y;
//		}
	};

	this.draw = function()
	{
// echoEnable = true;
// for(var key in this.spriteStacks['view']){
	// echo(this.spriteStacks['view'][key]);
// }
// dulog(this.spriteStacks);
// echo(this.spriteStacks['view']); // cnt = 0;
// return;

		var stack, scrName;
		if(this.spriteStacks == null){
			return;
		}
		for(scrName in this.spriteStacks){
			if(this.spriteStacks[scrName] == null){
				// dulog("Scroll[" + scrName + "] not found");
				// pauseScript();
				continue;
			}
			 stack = this.spriteStacks[scrName];
			if(stack.length == 0){continue;}
// dulog(scrName);
			var sorted = [];
			var sortIndexes = [];
			// dulog(stack.length);
				//消す
			try{
				for(var i = 0; i < stack.length; i++){
					if(stack[i].destroy){
						stack[i] = null;
						delete stack[i];
						stack.splice(i, 1);
						// this.spriteStacks[scrName].splice(i, 1);
//TODO:連続delete 確認
						i--;
						// dulog(stack);
					}
				}
			}catch(e){
				dulog('spriteHandle draw stacks error:');
				dulog([stack, i]);
			}

				for(var i = 0; i < stack.length; i++){
					if(stack[i] == null){
						dulog("sprite handle not found: " + i);
					}
					sortIndexes.push(stack[i].sortIndex);
					sorted.push(stack[i]);
				}
				sorted.sort(function(a, b){return a.getSortIndex() - b.getSortIndex()});
	
				//表示
				try{
					for(var i = 0; i < sorted.length; i++){
						// echoEnable = true;
						// echo("<br>sprite::" + sorted[i].destroy + "<hr>");
						// echo("<br>" + sorted.length);
						
						sorted[i].drawScroll();
					}
				}catch(e2){
					dulog([stack, sorted[i]]);
					throw (e2 + ' > spriteHandle sort draw error:');
				};
			}
	};

};

//要makeSprite
function makeSpriteHandle(sprites, scrollName, x, y)
{
	var spritehandle = [[]];
	array_squrt(sprites);//2次元

	if(x == null){
		x = 0;
	}
	if(y == null){
		y = 0;
	}
	for(var j in sprites)
		for(var i in sprites[j])
		{
			var handle = new SpriteHandle(sprites[j][i].image, 0, scrollName);
			handle.setPos(x + (sprites[j][i].w * i) , y + (sprites[j][i].h * j));
			spritehandle[j].push(handle);
		}
	return spritehandle;
}

function rectFromSprite(sprite, x, y)
{
	if(typeof sprite != "object"){
		return sprite.makeRect(x, y);
	}else if(typeof sprite[0] != "object"){
		sprite = [sprite];
	}
	var rects = new Rect(0,0,0,0);
	for(var j = 0; j < sprite.length; j++){
		for(var i = 0; i < sprite[0].length; i++){
			var w = sprite[j][i].w;
			var h = sprite[j][i].h;
			rects.append(sprite[j][i].makeRect(x + (i * w),y + (j * h)));
		}
	}
	return rects;
}

function Rect(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.overlapRect = new Array();
	this.appendRect = new Array();

	function isContain(x, y)
	{
//		alert(this.x + "-" + this.w + " > " + x + " , " + this.y + "-" + this.h + " >" + y);
		//OR//
		var orResult = false;
		if(this.x <= x && this.y <= y && (this.x + this.w) > x && (this.y + this.h) > y){
			orResult |= true;
		}
		if(this.appendRect.length > 0){
			for(var i = 0; i < this.appendRect.length; i++){
				if(this.appendRect[i].isContain(x, y)){
					orResult |= true;
					break;
				}
			}
		}
		//OR//

		return orResult;
	}
	Rect.prototype.isContain = isContain;

	function append(add)
	{
		this.appendRect.push(add);
	}
	Rect.prototype.append = append;
}

function makeRect(x, y, w, h)
{
	if(x.length != null && x.length == 4){
		h = x['3'];
		w = x['2'];
		y = x['1'];
		x = x['0'];
	}
	return new Rect(x, y, w, h);
}

//RGBA
var COLOR_RED = [247, 49, 0, 255];
var COLOR_FONT8 = [252, 252, 252, 255];
var COLOR_FONT12 = [181, 247, 214, 255];
var COLOR_LIGHTBLUE = [60, 188, 252, 255];
var COLOR_TRANSPARENT = [0, 0, 0, 0];
var COLOR_ADD = [82, 247, 148, 255];
var COLOR_SUB = [247, 82, 148, 255];
var COLOR_BLACK = [1, 1, 1, 255];
// var COLOR_WHITE = [255, 255, 255, 255];
var COLOR_WHITE = [252, 252, 252, 255];//nespallette
var COLOR_REQUID = [0, 140, 140, 255];
var COLOR_INVALID = [247, 181, 0, 255];
var COLOR_STAR = [255, 222, 123, 255];
function makeRGB(color)
{
	var csv = color.slice(0, 3).join(", ");
	return 'rgb(' + csv + ')';
}
function makeRGBA(color)
{
	var csv = color.join(", ");
	return 'rgba(' + csv + ')';
}

/**
 * 拡大縮小済み画面サイズ
 * @returns {___anonymous22047_22111}
 */
function getDisplaySize()
{
	return {w: (VIEWMULTI * DISPLAY_WIDTH), h: (VIEWMULTI * DISPLAY_HEIGHT)};
//	return {w: (DISPLAY_WIDTH), h: (DISPLAY_HEIGHT)};
}

/**
 * 拡大縮小なしスクロールサイズ	
 * @returns 
 */
function getScrollSize()
{
	return {w: (DISPLAY_WIDTH), h: (DISPLAY_HEIGHT)};
}

/**
 * アニメーション用推移
 */
function setTransition(transition, value, delay, from)
{
	if(transition == null){
		transition = {};
	}
	transition.to = value | 0;
	transition.count = 0;
	if(delay != null){
		transition.delay = delay | 0;
	}
	if(from != null){
		transition.from = from | 0;
	}
	return transition;
}

/**
 * 分割して何節目か
 */
function dividePattern(pattern, division)
{
	this.count = 0;
	this.pattern = pattern;
	this.division = division;
	this.max = this.pattern * this.division;
	function init(division, pattern)
	{
		this.count = 0;
		this.pattern = pattern;
		this.division = division;
	}
	dividePattern.prototype.init = init;
		
	function now()
	{
		var d = ((this.count / this.division) | 0) % this.pattern;
		return d;
	}
	dividePattern.prototype.now = now;
	
	function next()
	{
		this.count = (this.count + 1) % (this.max);
	}
	dividePattern.prototype.next = next;
}


/**
 * 3点からなる2次曲線をの位置を求める
 * @param {Object} t->x
 * @param {Object} pos->y
 */
function quadrateCurve(t, pos)
{
	var term = [];//ax^2 + bx + c = y
	var plen = pos.length;
	for(var i = 0; i < plen; i++){
		term[i] = [];
		for(var p = 0; p < plen; p++){
			term[i].push(Math.pow(pos[i].x, plen - 1 - p));
		}
		term[i].push(pos[i].y);
		// term[i] = [pos[i].x * pos[i].x, pos[i].x, 1, pos[i].y];
		//100 10 0 1
		//400 20 0 2
		//900 30 0 25
		 // alert(term[i]);
	}
	var tlen = term[0].length;
	for(var j = 0; j < plen; j++){
		var d = term[j][j];//注目式の係数を１にするための値
		// alert(d);
		//100 , 400?, 900?
		//
		for(var k = j; k < tlen; k++){
			term[j][k] = (d != 0) ? term[j][k] / d : 0 ;//0を割るところはスキップされている
			
			//term[j][k] = (d != 0) ? term[j][k] / d : 1 ;//0を割るところはスキップされている
			
			//0, 0.1, 0, 0.01
			//
			// if(term[j][k] == 0){dulog([j, k])}
			// if(d==0){dulog("0divide")}
		}
		
		for(var l = 0; l < plen; l++){
			if(l == j){continue;}//注目式スキップ
			var sub = term[l][j];
			// _ 400, 900
			// alert(sub);
			for(var m = j; m < tlen; m++){
				term[l][m] = term[l][m] - (sub * term[j][m]);
			// _ 400, 900
			}
		}
	}
	var res = 0;
	for(var n= 0; n < plen - 1; n++){
		res += Math.pow(t, plen - 1 - n) * term[n][tlen - 1];
		// dulog(res);
	}
	// toggleScript()
	// dulog(res);	
	return res;

}
