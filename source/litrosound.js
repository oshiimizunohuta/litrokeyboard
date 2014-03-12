/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */
// var SAMPLE_RATE = 24000;
var SAMPLE_RATE = 48000;
// var SAMPLE_RATE = 144000;
// var MASTER_BUFFER_SIZE = 24000;
var MASTER_BUFFER_SIZE = 24000;
// var PROCESS_BUFFER_SIZE = 8192;
// var PROCESS_BUFFER_SIZE = 4096;
var PROCESS_BUFFER_SIZE = 2048;
// var CHANNEL_BUFFER_SIZE = 48000;
var BUFFER_FRAMES = 60;
// var BUFFERS = 2;
var CHANNELS = 8;
var litroAudio = null;
var VOLUME_TEST = 0.2;
var litroSoundInstance = null;


var DEFAULT_NOTE_LENGTH = 800; //ms
var KEY_FREQUENCY = [
	[32.703,34.648,36.708,38.891,41.203,43.654,46.249,48.999,51.913,55.000,58.270,61.735],
	[65.406,69.296,73.416,77.782,82.407,87.307,92.499,97.999,103.826,110.000,116.541,123.471],
	[130.813,138.591,146.832,155.563,164.814,174.614,184.997,195.998,207.652,220.000,233.082,246.942],
	[261.626,277.183,293.665,311.127,329.628,349.228,369.994,391.995,415.305,440.000,466.164,493.883],
	[523.251,554.365,587.330,622.254,659.255,698.456,739.989,783.991,830.609,880.000,932.328,987.767],
	[1046.502,1108.731,1174.659,1244.508,1318.510,1396.913,1479.978,1567.982,1661.219,1760.000,1864.655,1975.533],
	[2093.005,2217.461,2349.318,2489.016,2637.020,2793.826,2959.955,3135.963,3322.438,3520.000,3729.310,3951.066],
	[4186.009,4434.922,4698.636,4978.032,5274.041,5587.652,5919.911,6271.927,6644.875,7040.000,7458.620,7902.133],
];

var LitroKeyboardControllChar = [
['q', 81],['2', 50],['w', 87],['3', 51],['e', 69],['r', 82],['5', 53],['t', 84],['6', 54],['y', 89],['7', 55],['u', 85],['i', 56],['9', 73],['o', 57],['0', 79],['p', 80],
['z', 90],['s', 83],['x', 88],['d', 68],['c', 67],['v', 86],['g', 71],['b', 66],['h', 72],['n', 78],['j', 77],['m', 75],[',', 188],['l', 76],['.', 190],[';', 187],['/', 191],
];

var KEY_NAME = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
function LitroSound() {
	return;
}

LitroSound.prototype = {
	init : function(sampleRate, channelNum, bufferFrame) {
		this.channel = [];
		this.channel.length = channelNum;
		this.bufferFrame = bufferFrame;
		this.frameRate = 60;
		this.milliSecond = 1000;
		this.masterBufferSize = 48000;
		this.channelBufferSize = 48000;
		this.maxFreq = (sampleRate / 2) | 0;
		this.mode = 0;
		this.OCTAVE_MAX = 7;
		litroSoundInstance = this;
		this.masterVolume = VOLUME_TEST;
		this.WAVE_VOLUME_RESOLUTION = 15; //波形データのボリューム分解能
		this.outputBuffer = [];
		this.isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? true : false;
		this.gain = null; //ゲイン
		this.analyser = null; //波形分析
		this.delay = null; //遅延
		this.source = null; //重要バッファ]
		this.setChannelEventFunc = function(){return;};
		this.onNoteKeyEventFunc = function(){return;};
		var agent, src, i, data, buf, context;

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if(window.AudioContext == null){
			console.log("this browser can't AudioContext!! ");
			return;
		}
		this.context = new AudioContext();
		this.setSampleRate(sampleRate, PROCESS_BUFFER_SIZE);
		
		// 出力開始
		// src.noteOn(0);
	},
	
	freqByOctaveCodeNum: function(octave, codenum){
		return KEY_FREQUENCY[octave][codenum];
	},
	
	freqByKey: function(key){
		return KEY_FREQUENCY[(key / KEY_FREQUENCY[0].length) | 0][key % KEY_FREQUENCY[0].length];
	},
	
	/**
	 * 視覚用波形出力
	 * @param {Object} size
	 */
	getAnalyseData: function(size)
	{
		var data = new Uint8Array(size);
		this.analyser.getByteTimeDomainData(data);
		// if(this.analysedData_b.length < size){
			// this.analysedData_b = data;
		// }else{
			// this.analysedData = this.analysedData_b.concat(data);
		// }
		return data;
		// analyser.getByteFrequencyData(data); //Spectrum Data
	},
	
	setSampleRate: function(rate, size){
		var i, channel, context, scriptProcess, src;
		context = this.context;
		context.sampleRate = rate;
		
		//ゲイン
		this.gain = context.createGain();
		this.gain.gain.value = this.masterVolume;
		this.gain.connect(context.destination);
		
		//プロセス
		scriptProcess = context.createScriptProcessor(size, 0, 1);
		scriptProcess.onaudioprocess = this.bufferProcess;
		scriptProcess.parent_audio = this;
		
		scriptProcess.connect(this.gain);

		this.source = this.context.createBufferSource();
		this.source.connect(scriptProcess);
		this.source.start(0);
		
		//解析
		this.analyser = this.context.createAnalyser();
		this.analyser.fft = 512;
		scriptProcess.connect(this.analyser);
		
		// console.log(scriptProcess);
		// this.delay = this.context.createDelay();
		// this.delay.delayTime.value = 1.0;
		// this.delay.connect(context.destination);
		// scriptProcess.connect(this.delay);
		
		//チャンネル設定
		for(i = 0; i < this.channel.length; i++){
			channel = new AudioChannel();
			channel.init(((rate / KEY_FREQUENCY[0][0]) | 0) + 1, this.WAVE_VOLUME_RESOLUTION);
			channel.id = i;
			this.channel[i] = channel;
			this.setFrequency(i, 0);
		}
		return;
	},
	
	bufferProcess: function(ev)
	{
		var parent = litroSoundInstance
			, i
			, ch
			// , data = ev.outputBuffer.getChannelData(0);
			, data = ev.outputBuffer.getChannelData(0);
		for(i = 0; i < data.length; i++){
			ch = parent.channel[0];
			ch.refreshClock++;
			
			data[i] = ch.nextWave();

			for(c = 1; c < parent.channel.length; c++){
				ch = parent.channel[c];
				data[i] += ch.nextWave();
				ch.refreshClock++;
			}
		}
		parent.outputBuffer = data;
		// console.log(parent.channel[0]);
	},
	
	setWaveType: function(channelNum, type)
	{
		// this.channel[channelNum].waveType = type;
		this.setChannel(channelNum, 'waveType', type);
		// this.refreshWave(channelNum);
	},
	
	setFrequency: function(ch, freq)
	{
		var channel = this.channel[ch]
		;
		channel.frequency = freq + (freq / 1028 * channel.tuneParams.detune);
		channel.prevLength = channel.waveLength;
		channel.waveLength = ((this.context.sampleRate / channel.frequency)) | 0;

		this.refreshWave(ch);
	},
	
	getChannel: function(ch, key)
	{
		return this.channel[ch].tuneParams[key];
	},
	
	setSetChannelEvent: function(func){
		this.setChannelEventFunc = func;
	},
	setChannel: function(ch, key, value)
	{
		var channel = this.channel[ch];
		if(value > AudioChannel.tuneParamsMax[key]){
			value = AudioChannel.tuneParamsMin[key];
		}else if(value < AudioChannel.tuneParamsMin[key]){
			value = AudioChannel.tuneParamsMax[key];
		}
		channel.tuneParams[key] = value;
		this.setChannelEventFunc(ch, key, value);
		return value;
	},
	
	toggleOutput: function(ch, toggle)
	{
		this.setChannel(ch, 'enable', toggle | 0);
	},
	
	refreshWave: function (channelNum)
	{
		var i
		, channel = this.channel[channelNum]
		, data = channel.data
		, freq
		;
		if(channel.isFinishEnverope() && channel.dataUpdateFlag){
			for(i = 0; i < data.length; i++){
				data[i] = 0.0;
			}
			channel.dataUpdateFlag = false;
			return;
		}
		
		channel.frequency += channel.frequency * 0.001 * (channel.sweepClock * channel.tuneParams.sweep);
		detuneFreq = (channel.frequency * channel.tuneParams.detune * 0.0001);

		if(channel.frequency < minFreq()){
			channel.frequency = minFreq();
		}else if(channel.frequency > maxFreq()){
			channel.frequency = maxFreq();
		}
		channel.prevLength = channel.waveLength;
		channel.waveLength = (this.context.sampleRate / (channel.frequency + detuneFreq)) | 0;
		 // channel.waveLength = (channel.waveLength / ((channel.isNoiseType() | 0) + 1)) | 0;

		switch(this.getChannel(channelNum, 'waveType')){
			case 0: pulseWave(channel, 1, 1); break;
			case 1: pulseWave(channel, 1, 2); break;
			case 2: pulseWave(channel, 1, 4); break;
			case 3: pulseWave(channel, 1, 6); break;
			
			case 4: tristairWave(channel, 1, 1); break;
			case 5: tristairWave(channel, 1, 2); break;
			case 6: tristairWave(channel, 1, 4); break;
			case 7: tristairWave(channel, 1, 6); break;
			
			case 8: sawstairWave(channel, 1, 1); break;
			case 9: sawstairWave(channel, 1, 2); break;
			case 10: sawstairWave(channel, 1, 4); break;
			case 11: sawstairWave(channel, 1, 6); break;
			
			case 12: noiseWave(channel, 1); break;
			case 13: noiseWave(channel, 6); break;
			case 14: noiseWave(channel, 31); break;
			case 15: noiseWave(channel, 69); break;
		}

		channel.envelopeClock++;
		channel.detuneClock++;
		channel.sweepClock++;
		channel.refreshClock = 0;
	},
	
	setOnNoteKeyEvent: function(func){
		this.onNoteKeyEventFunc = func;
	},
	onNoteKey: function(channel, key)
	{
		// console.log(codenum + ' ' + octave);
		var freq = this.freqByKey(key);
		this.channel[channel].clearWave();
		// console.log(freq);
		this.channel[channel].envelopeClock = 0;
		this.channel[channel].detuneClock = 0;
		this.channel[channel].sweepClock = 0;
		this.channel[channel].refreshClock = 0;
		this.channel[channel].dataUpdateFlag = true;
		this.setFrequency(channel, freq);
		this.channel[channel].resetEnvelope();
		this.onNoteKeyEventFunc(channel, key);
	},	
	onNoteFromCode: function(channel, codenum, octave)
	{
		// console.log(codenum + ' ' + octave);
		var freq = this.freqByOctaveCodeNum(octave, codenum);
		this.channel[channel].clearWave();
		// console.log(freq);
		this.channel[channel].envelopeClock = 0;
		this.channel[channel].detuneClock = 0;
		this.channel[channel].sweepClock = 0;
		this.channel[channel].refreshClock = 0;
		this.channel[channel].dataUpdateFlag = true;
		this.setFrequency(channel, freq);
		this.channel[channel].resetEnvelope();
	},
	
	offNoteFromCode: function(channel)
	{
		// var freq = this.freqByOctaveCode(octave, code);
		
		if(channel == null){
			var i;
			for(i = 0; i < this.channel.length; i++){
				this.setFrequency(i, 0);
			}
			return;
		}
		this.setFrequency(channel, 0);
		this.channel[channel].resetEnvelope();
		this.channel.envelopeClock = 0;

	},
	
	fadeOutNote: function(channelNum)
	{
		if(channelNum == null){
			return;
		}
		// this.channel[channel].resetEnvelope();
		this.channel[channelNum].skiptoReleaseClock();
	},
	
	noteOn: function(channel){
		this.channel[channel].bufferSource.start(0);
	},
	
	noteoff: function(channel){
		this.channel[channel].bufferSource.stop(0);
	},
	
};

var litroPlayerInstance = null;
/**
 * 再生
 */
function LitroPlayer(){return;};
LitroPlayer.prototype = {
	init: function()
	{
		litroPlayerInstance = this;
		this.sound_id = null;
		this.user_id = null;
		this.title = '';
		this.titleCodes = [];
		this.titleMaxLength = 32;
		this.noteData = []; //note data
		this.eventsetData = []; //ControllChangeともいう
		this.noteSeekTime= 0; //note をセットする位置
		this.playSoundFlag = false;
		this.loopStart = 0;
		this.loopEnd = -1;
		this.litroSound = litroSoundInstance;
		this.systemTime = 0;
		// this.timeOutNote = [];
		this.timeOutEvent = [];
		this.timeOutCC = [];
		this.fversion = 0.01;
		this.eventsetKeyIndex = {};
		this.FORMAT_LAVEL = 'litrosoundformat';
		this.fileUserName = 'guest_user_';
		this.fileOtherInfo = 'xxxxxxxxxxxxxxxx';
		this.HEADER_TITLELENGTH = 16;
		this.DATA_LENGTH16 = {ch:2, type:2, timeval:4, time:6, value:2};
		this.DATA_LENGTH36 = {ch:1, type:2, timeval:3, time:4, value:2};
		this.CHARCODE_LENGTH16 = 8;//4byte
		this.CHARCODE_LENGTH36 = 6;//3byte
		this.CHARCODE_MODE = 36;
		this.HEADER_LENGTH = 64;
		this.SERVER_URL = 'http://localhost:58104/api';
		
		var type, ch;
		for(ch = 0; ch < this.litroSound.channel.length; ch++){
			this.noteData.push({});
			this.eventsetData.push({});
			this.eventsetData[ch].note = {};
			for(i = 0; i < AudioChannel.sortParam.length; i++){
				this.eventsetData[ch][AudioChannel.sortParam[i]] = {};
			}
		}
		for(i = 0; i < AudioChannel.sortParam.length; i++){
			this.eventsetKeyIndex[AudioChannel.sortParam[i]] = i;
		}
	},
	
	pad0: function(str, num)
	{
		while(num - str.length > 0){
			str = '0' + str;
		}
		return str;
	},
	
	/**
	 * cookie
	 * [header: 64]
	 * litrosoundformat
	 * version-xx.xx.xx
	 * auth_xxxxxxxxxxx
	 * [title: 16](xxxxxxxxxxxxxxxx)
	 * [datachunk: 4096 - 64]
	 * <CH><TYPEID><LENGTH><DATA>
	 * <CH><TYPEID><LENGTH><DATA>
	 * DATA:<time><value>
	 * 4.6h
	 */
	
	headerInfo: function()
	{
		this.fileUserName = this.fileUserName.substr(0, 11);
		var info = this.str5bit(this.titleCodes.length > 0 ? this.titleCodes : this.title);
		if(info.length < this.HEADER_TITLELENGTH){
			info = 'xxxxxxxxxxxxxxxx'.substr(0, this.HEADER_TITLELENGTH - info.length) + info;
		}
		this.fileOtherInfo = info.substr(0, this.HEADER_TITLELENGTH);
		return this.FORMAT_LAVEL + 'version-00.00.01' + 'auth_' + this.fileUserName + this.fileOtherInfo;
	},
	
	//byteArray or String
	str5bit: function(source)
	{
		var i = 0, bstr = "", str = '', len = source.length, c
			, mode = this.CHARCODE_MODE, strbits = 16, codebits = 5
		;
		while(len > i){
			if(typeof source == 'string'){
				c = source.charCodeAt(i).toString(2);
			}else{
				c = source[i].toString(2);
			}
			if(c.length % strbits > 0){
				c = ('00000000'.substr(0, strbits - (c.length % strbits))) + c;
			}
			bstr += c;
			i++;
		}
		len = bstr.length;
		if(len % codebits > 0){
			bstr += '00000'.substr(0, codebits - (len % codebits));
			len = bstr.length;
		}
		i = 0;
		while(len > i){
			str += parseInt((bstr.substr(i, codebits)), 2).toString(mode);
			i += codebits;
		}
		return str;
		// return encodeURIComponent(this.title).substr(0, 16);
	},
	
	dataToString: function()
	{
		// AudioChannel.tuneParamsID
		var str = ''
			, ch, time, type, chstr, timeDats, typeDatsNum
			, typestr
			, edat = this.eventsetData
			, keyId = AudioChannel.tuneParamsID
			, mode = this.CHARCODE_MODE
			, datLen = this.DATA_LENGTH36
		;
		// console.log(keyId);
		for(ch in edat){
			chstr = this.pad0((ch | 0).toString(mode), datLen.ch); //+2
			// console.log('ch', chstr);

			for(type in edat[ch]){
				timeDatsNum = 0;
				for(time in edat[ch][type]){
					timeDatsNum++;
				}
				
				typestr = this.pad0((keyId[type] | 0).toString(mode), datLen.type);//+2
				typestr += this.pad0((timeDatsNum | 0).toString(mode), datLen.timeval);//+4
			// console.log('length', this.pad0((timeDatsNum | 0).toString(mode), 4));
			// console.log('type', this.pad0((type | 0).toString(mode), 2));
				for(time in edat[ch][type]){
					typestr += this.pad0((time | 0).toString(mode), datLen.time);//+6
					typestr += this.pad0((edat[ch][type][time].value | 0).toString(mode), datLen.value);//+2
			// console.log('time', this.pad0((time | 0).toString(mode), 6));
			// console.log('value', edat[ch][type][time], this.pad0((edat[ch][type][time].value | 0).toString(mode), 2));
				}
				if(timeDatsNum == 0){continue;}
				str += chstr + typestr;
			// console.log(chstr + typestr);
			}
		}
		
//		str = JSON.stringify(this.eventsetData);
		// console.log(str, str.length);
		return str;
	},
	
	dataStrToCharCode: function(str)
	{
		var i, len, clen = 0, sepLen = this.CHARCODE_LENGTH36
			, charCode = ''
		;
		len = str.length;
		if(len % sepLen > 0){
			str += '00000000'.substr(0, sepLen - (len % sepLen));
			len += len % sepLen;
		}
		
		while(len > clen){
			charCode += String.fromCharCode(parseInt(str.substr(clen, sepLen), 16));
			// console.log(str.substr(clen, sepLen), String.fromCharCode(parseInt(str.substr(clen, sepLen), 16)));
			clen += sepLen;
		}
		// console.log(charCode, charCode.length);
		return charCode;
	},
	//%04%E6%90%80%E2%B0%80%EF%90%80%EB%B0%80

	saveToCookie: function()
	{
		var data
		;
		// data = this.dataStrToCharCode(data); //mode16
		data = this.dataToString();
		data =this.headerInfo() + data;
		// console.log('save ok', data, data.length);
		document.cookie = 'd=' + encodeURIComponent(data) + ";expires=Tue, 31-Dec-2030 23:59:59;";
	},
	
	saveToSever: function(user_id, sound_id, func, errorFunc)
	{
		var data = encodeURIComponent(this.headerInfo() + this.dataToString());
		title = this.title;
		params = {user_id: user_id, title: this.title, data: data};
		;
		// console.log('save ok', data, data.length);
		func = func == null ? function(){return;} : func;
		errorFunc = errorFunc == null ? function(){return;} : errorFunc;
		
		if(sound_id == 0){
			this.sendToAPIServer('POST', 'fileinsert', params, func, errorFunc);
		}else{
			params.sound_id = sound_id;
			this.sendToAPIServer('POST', 'fileupdate', params, func, errorFunc);
		}
		
	},
	
	charCodeToDataStr: function(code)
	{
		var sepLen = this.CHARCODE_LENGTH36, clen = code.length
			, rlen = 0, str = '', sepStr
		, mode = this.CHARCODE_MODE
		;
		// console.log(code);
		while(clen > rlen){
			sepStr = code.substr(rlen, 1).charCodeAt(0).toString(mode);
			// console.log(sepStr);
			str += '00000000'.substr(0, sepLen - sepStr.length) + sepStr;
			// console.log(sepStr, '00000000'.substr(0, sepLen - sepStr.length) + sepStr);
			rlen += 1;
		}
		return str;
	},
	timevalData: function(type, timeval)
	{
		var i, res = {}, datLen = this.DATA_LENGTH36
		, mode = this.CHARCODE_MODE
		, chunkLen = datLen.time + datLen.value
		, length = (timeval.length / chunkLen) | 0
		, time, value
		;
		// console.log(timeval, length);
		for(i = 0; i < length; i++){
			time = parseInt(timeval.substr(chunkLen * i, datLen.time), mode);
			value = parseInt(timeval.substr((chunkLen * i) +  datLen.time, datLen.value), mode);
			res[time] = {type: type, time: time, value: parseInt(timeval.substr((chunkLen * i) +  datLen.time, datLen.value), mode)};
		}
		// console.log(type, res);
		return res;
	},
	parseDataStr: function(data)
	{
		var dlen
			, mode = this.CHARCODE_MODE
			, datLen = this.DATA_LENGTH36
			, rlen = 0, res = '', tvalLen = 0
			, idKey = AudioChannel.tuneParamsIDKey()
			, minLen = datLen.ch + datLen.type + datLen.timeval
		;
		data = data.substr(this.HEADER_LENGTH);
		dlen = data.length;
		// console.log(data);
		while(dlen > rlen + minLen){
			ch = parseInt(data.substr(rlen, this.DATA_LENGTH36.ch), mode);
			rlen += this.DATA_LENGTH36.ch;
			type = idKey[parseInt(data.substr(rlen, this.DATA_LENGTH36.type), mode) | 0];
			rlen += this.DATA_LENGTH36.type;
			tvalLen = parseInt(data.substr(rlen, this.DATA_LENGTH36.timeval), mode);
			rlen += this.DATA_LENGTH36.timeval;
			tval = this.timevalData(type, data.substr(rlen, (this.DATA_LENGTH36.time + this.DATA_LENGTH36.value) * tvalLen));
			rlen += (this.DATA_LENGTH36.time + this.DATA_LENGTH36.value) * tvalLen;
			// console.log(tval, dlen, rlen, tvalLen);
			// if(dlen <= rlen + minLen){break;}
			// console.log('ch: ' + ch, 'type: ' + type, 'tvalLen: ' + tvalLen, 'tval: ' + tval);
			this.eventsetData[ch][type] = tval;
			// console.log(this.eventsetData[ch]);
		}
	},
	
	loadFromCookie: function()
	{
		var cookies = document.cookie.split('; ')
			, i, dic, str
		;
		this.init();//初期化
		for(i = 0; i < cookies.length; i++){
			dic = cookies[i].split('=');
			if(dic[1] != null && dic[1].indexOf(this.FORMAT_LAVEL) >= 0){
				break;
			}
		}
		// str = this.charCodeToDataStr(decodeURIComponent(dic[1]).substr(headerLength));//mode16
		this.parseDataStr(decodeURIComponent(dic[1]));
		// console.log('load ok', dic[1], dic[1].length);
		// console.log(this.eventsetData);
	},
	
	loadFromServer: function(user_id, sound_id, func, errorFunc)
	{
		var self = this
			, params = {user_id: user_id, sound_id: sound_id};
		;
		// console.log('save ok', data, data.length);
		func = func == null ? function(){return;} : func;
		errorFunc = errorFunc == null ? function(){return;} : errorFunc;
		
		this.sendToAPIServer('GET', 'fileload', params, function(data){
			if(data == null || data == false){
				errorFunc(data);
			}
			
			self.init();
			self.parseDataStr(decodeURIComponent(data.data));
			self.title = data.title;
			self.user_id = data.user_id;
			self.sound_id = data.sound_id;
			func(data);
			}, errorFunc);
		
	},
	
	listFromServer: function(user_id, page, func, errorFunc)
	{
		var params = {page: page, user_id: user_id};
		func = func == null ? function(){return;} : func;
		errorFunc = errorFunc == null ? function(){return;} : errorFunc;
		this.sendToAPIServer('GET', 'filelist', params, func, errorFunc);
	},

	sendToAPIServer: function(method, api, params, func, errorFunc)
	{
		var query = [], key, x = new XMLHttpRequest();
		if(func != null){
			x.onreadystatechange = function(){
				var j;
				switch(x.readyState){
					case 0:break;//オブジェクト生成
					case 1:break;//オープン
					case 2:break;//ヘッダ受信
					case 3:break;//ボディ受信
					case 4:
								if((200 <= x.status && x.status < 300) || (x.status == 304)){
									j = x.responseText;
									try{
										j = typeof j == 'string' ? JSON.parse(j) : '';
									}catch(e){
										j = null;
									}
									func(j);
									x.abort();
								}else{
									errorFunc();
									x.abort();
								}
								 break;//send()完了
				}
			//	func;
			};
		}
		for(key in params){
			query.push(key + '=' + params[key]);
		}
		str = query.join('&');
		if(method.toUpperCase() == 'GET'){
			x.open(method, this.SERVER_URL + '/' + api + '?' + str , true);
			str = "";
		}else{
			x.open(method, this.SERVER_URL + '/' + api, true);
		}
		x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		x.send(str);
	},
	
	setTimeOutEvent: function(ch, time, type, value)
	{
		this.timeOutEvent.push({time: time, ch: ch, type: type, value: value});
		setTimeout(function(){
			var removes = [], i, self = litroPlayerInstance, data;
			for(i = 0; i < self.timeOutEvent.length; i++){
				data = self.timeOutEvent[i];
				if(data.time <= self.noteSeekTime){
					if(data.type == 'note'){
						litroSoundInstance.onNoteKey(data.ch, data.value);
					}else{
						litroSoundInstance.setChannel(data.ch, data.type, data.value);
					}
					removes.push(i);
				}
			}
			if(removes.length > 0){
				self.timeOutEvent.splice(0, removes.length);
			}
		}, time);
	},
	isPlay: function()
	{
		return this.playSoundFlag;
	},
	play: function(toggle)
	{
		this.systemTime = performance.now();
		this.playSoundFlag = true;
	},
	
	stop: function(toggle)
	{
		this.systemTime = performance.now();
		this.playSoundFlag = false;
	},
	
	playSound: function()
	{
		if(!this.playSoundFlag){return;}
		var t, ch, s
			, data
			, now = performance.now()
			, perFrameTime = (now - this.systemTime) | 0
			, sort = AudioChannel.sortParam
		;
		for(t = 0; t < perFrameTime; t++){
			for(ch in this.eventsetData){
				for(s = 0; s < sort.length; s++){
					type = sort[s];
					if(this.eventsetData[ch][type][this.noteSeekTime] != null){
						data = this.eventsetData[ch][type][this.noteSeekTime];
						if(t > 0){
							this.setTimeOutEvent(ch, t, type, data.value);
						}else{
							if(type == 'note'){
								litroSoundInstance.onNoteKey(ch, data.value);
							}else{
								litroSoundInstance.setChannel(ch, type, data.value);
							}
						}
					}
				}
			}
			this.seekMoveForward(1);
		}
		this.systemTime = now;
		// console.log(this.noteSeekTime);
	},
	
	getEventsFromTime: function(ch, time)
	{
		var type, res = {};
		for(type in this.eventsetData[ch]){
			if(this.eventsetData[ch][type][time] != null){
				res[type] = this.eventsetData[ch][type][time];
			}
		}
		return res;
	},
	
	seekMoveForward: function(ftime)
	{
		ftime = ftime == null ? 1 : ftime;
		if(ftime < 0){
			ftime = this.loopEnd  < 0 ? 0 : this.loopEnd;
		}
		this.noteSeekTime += ftime;
	},
	seekMoveBack: function(ftime)
	{
		ftime = ftime == null ? this.noteRange * this.noteRangeScale / this.noteRangeCells : ftime;
		if(ftime < 0){
			ftime = this.noteSeekTime;
		}
		this.noteSeekTime -= ftime;
		this.noteSeekTime = this.noteSeekTime < 0 ? 0 : this.noteSeekTime;
	},
	//eventset-time-type
	allStackEventset: function(ch, types)
	{
		var tindex, type, t, events = {}
		, typeKeys = this.searchTypes()
		, len = types.length
		, timedStack = []
		;
		for(tindex = 0; tindex < len; tindex++){
			type = types[tindex];
			for(t in this.eventsetData[ch][type]){
				t |= 0;
				if(this.eventsetData[ch][type][t] != null){
					events[t] = events[t] == null ? {} : events[t];
					events[t][type] = this.eventsetData[ch][type][t];
				}
			}
		}
		for(t in events){
			for(type in events[t]){
				timedStack.push(events[t][type]);
			}
		}
		return timedStack;
	}, 
	// allStackEventset: function(ch, types)
	// {
		// var tindex, type, t, events = [];
		// for(tindex = 0; tindex < types.length; tindex++){
			// type  = types[tindex];
			// for(t in this.eventsetData[ch][type]){
				// t |= 0;
				// if(this.eventsetData[ch][type][t] != null){
					// events.push(this.eventsetData[ch][type][t]);
				// }
			// }
		// }
		// return events;
	// }, 
	
	
	
	searchTypes: function(type)
	{
		var types = [], t, params = []
			, ignores = {'note': 1, }
			, del = {}
			;
		
		if(type == 'ALL'){
			//すべてのタイプを検索
			types = AudioChannel.sortParam;
		}else if(type == 'TUNE'){
			//イベントセットの検索
			params = AudioChannel.sortParam;
			for(t = 0; t < params.length; t++){
				if(params[t] in ignores){
					continue;
				}
				types.push(params[t]);
			}
		}else{
			//指定のタイプを見る
			types.push(type);
		}
		return types;
	},
	//Note検索 end:0前方・-1後方
	//return eventset / null
	searchNearForward: function(ch, start, end, type, ignore)
	{
		var t, tindex, events ={}, types = [], eventset
			, keyIndex = this.eventsetKeyIndex
		;
		start = start == null ? this.noteSeekTime : start;
		//前方一致
		types = this.searchTypes(type == null ? 'ALL' : type);
		events = this.allStackEventset(ch, types);

		for(t = 0; t < events.length; t++){
			for(tindex = 0; tindex < types.length; tindex++){
				type = types[tindex];
				eventset = events[t];
				if(ignore.time == eventset.time){
					if(ignore.type == eventset.type || keyIndex[ignore.type] >= keyIndex[eventset.type]){
						continue;
					}
				}
				if(eventset.time >= start && (end >= 0 && eventset.time <= end)){
					return eventset;
				}else if(eventset.time >= start && end < 0){
					return eventset;
				}
			}
		}
		return null;
	},
	//return eventset / null
	searchNearBack: function(ch, start, end, type, ignore)
	{
		var t, tindex, events ={}, types = [], eventset
			, keyIndex = this.eventsetKeyIndex
		;
		start = start == null ? this.noteSeekTime : start;
		types = this.searchTypes(type == null ? 'ALL' : type);
		//後方一致
		events = this.allStackEventset(ch, types);
		// console.log(events, types[type], this.eventsetData[ch][types[type]]);
		events.reverse();
		for(t = 0; t < events.length; t++){
			for(tindex = 0; tindex < types.length; tindex++){
				type  = types[tindex];
				eventset = events[t];
				if(ignore.time == eventset.time){
					if(ignore.type == eventset.type || keyIndex[ignore.type] <= keyIndex[eventset.type]){
						continue;
					}
				}
				if(eventset.time <= start && eventset.time >= end){
					return eventset;
				}
			}
		}
		return null;
	},
	
};
/**
 * 波形生成
 */
function AudioChannel(){return;};
AudioChannel.sortParam = [
	'waveType',
	'volumeLevel',
	'attack',
	'decay',
	'sustain',
	'length',
	'release',
	'delay',
	'detune',
	'sweep',
	'enable',
	'note'
];
AudioChannel.tuneParamsMax = {
	volumeLevel:15,
	waveType:15,
	length:255,
	delay:32,
	detune:15,
	sweep:32,
	attack:255,
	decay:64,
	sustain:15,
	release:255,
	enable:1,
	turn:2,
};
AudioChannel.tuneParamsMin = {
	volumeLevel:0,
	waveType:0,
	length:0,
	delay:0,
	detune:-15,
	sweep:-32,
	attack:0,
	decay:0,
	sustain:0,
	release:0,
	enable:0,
	turn:-2,
};
AudioChannel.tuneParamsID = {
	'void': 0,
	enable:1,
	restart:2,
	end:3,
	prestart:4,
	preend:5,
	noteon:6,
	noteoff:7,
	noteextend:8,
	note: 128,
	waveType:129,
	volumeLevel:130,
	attack:131,
	decay:132,
	sustain:133,
	length:134,
	release:135,
	delay:136,
	detune:137,
	sweep:138,
};
AudioChannel.tuneParamsIDKey = function()
{
	var k, keys = {};
	for(k in AudioChannel.tuneParamsID){
		keys[AudioChannel.tuneParamsID[k]] = k;
	}
	return keys;
};

AudioChannel.prototype = {
	init:function(datasize, resolution){
		// console.log(this.data);
		this.id = null;
		this.bufferSource = null;
		this.buffer = null;
		this.waveLength = 0;
		this.refreshClock = 0;
		this.waveClockPosition = 0;
		this.detuneClock = 0;
		this.envelopeClock = 999999;//初期大音量防止
		this.sweepClock = 0;
		this.prevLength = 0;
		this.data = this.allocBuffer(datasize);
		this.bufferSize = datasize;
		this.dataUpdateFlag = false;
		this.noiseParam = {
			volume : 0,
			shortType : 1,
			reg: 0x8000,
			halfLength : 0,
			clock : 0,
		};
		// this.waveType = 0;
		this.frequency = 1;
		this.WAVE_VOLUME_RESOLUTION = resolution;

		this.tuneParams = {
			volumeLevel:12,
			waveType:0,
			length:8,
			delay:0,
			detune:0,
			sweep:0,
			attack:1,
			decay:8,
			sustain:10,
			release:32,
			enable:1,
			turn:1,
		};
		
	},
	tuneMax: function(name)
	{
		return this.tuneParamsMax[name];
	},
	tune: function(name, param)
	{
		var p = this.tuneParams;
		return p[name] = (param == null) ? p[name] : param;
	},
	
	allocBuffer: function(datasize){
		var i, data;
		data = [];
		for(i = 0; i < datasize; i++){
			data.push(0);
		}
		return data;
	},
	isRefreshClock: function()
	{
		this.refreshLimit = (SAMPLE_RATE / 1000) | 0;
		return this.refreshClock < this.refreshLimit  ? false : true;
	},
	
	isLastWaveCrock: function()
	{
		// return this.waveClockPosition < this.bufferSize - 1 ? false : true; 
		// return this.waveClockPosition > 0 ? false : true; 
		return true; 
	},
	
	getDetunePosition: function()
	{
		if(this.tuneParams.detune == 0){return 0;}
		return (this.detuneClock * this.tuneParams.detune) | 0;
// 		this.tuneMax('detune') - 
	},
	
	isFinishEnverope: function()
	{
		if(this.envelopeClock > this.tuneParams.attack + this.tuneParams.decay + this.tuneParams.length + this.tuneParams.release){
			return true;
		}
		return false;
	},
	
	getNoiseType: function()
	{
		return this.tuneParams.waveType % 4;
	},
	
	isNoiseType: function()
	{
		var type = this.tuneParams.waveType;
		return type > 11 && type < 16;
	},
	
	skiptoReleaseClock: function()
	{
		var clock = this.tune('attack') + this.tune('decay') + this.tune('length');
		this.envelopeClock = this.envelopeClock < clock ? clock : this.envelopeClock;
	},
	
	resetEnvelope: function()
	{
		this.envelopeClock = 0;
		// console.log(1);
	},
	
	clearWave: function()
	{
		 var i
		;
		for(i = 0; i < this.waveLength; i++){
			this.data[i] = 0;
		}
		
		// this.waveLength = 0;
	},
	
	nextWave: function(){
		if(this.waveLength == 0 || this.tune('enable') == 0){
			return 0;
		}
		if(this.isNoiseType()){

			return this.nextNoise();
			// return noiseWave(this);
		}
		// this.getDetunePosition();
		var d = this.data[this.waveClockPosition];
		this.waveClockPosition = (this.waveClockPosition + 1) % this.waveLength;
		// console.log(this.envelopeClock);
		return d;
	},
	
	nextNoise: function(){
		var p = this.noiseParam
			, vol = envelopedVolume(this)
		;
		this.waveClockPosition = (this.waveClockPosition + 1) % this.bufferSize;
		
		if(p.clock++ >= p.halfLength){
			p.reg >>= 1;
			p.reg |= ((p.reg ^ (p.reg >> p.shortType)) & 1) << 15;
			p.volume =  ((p.reg & 1) * vol * 2.0) - vol;
			p.clock = 0;
		}
		
		this.data[this.waveClockPosition] = p.volume;
		return this.data[this.waveClockPosition];
	},
	
};
function phase(channel)
{
	var clock = channel.envelopeClock;
	// ;return 's';
	clock -= channel.tune('attack');
	if(clock < 0){return 'a';}

	clock -= channel.tune('decay');
	if(clock < 0){return 'd';}

	// clock -= channel.tune('length') - channel.tune('attack') - channel.tune('decay') - channel.tune('release');
	clock -= channel.tune('length');
	if(clock < 0){ return 's';}
	
	clock -= channel.tune('release');
	if(clock < 0){ return 'r';}
	
	return '';
}

function envelopedVolume(channel)
{
		var i
		, vLevel = channel.tuneParams.volumeLevel
		// , vol = channel.WAVE_VOLUME_RESOLUTION / channel.WAVE_VOLUME_RESOLUTION / 2
		// , vol = 1 / channel.WAVE_VOLUME_RESOLUTION
		, vol = (1 / 2) / channel.WAVE_VOLUME_RESOLUTION  // +1 / -1 
		, sLevel = channel.tuneParams.sustain
		, svol = vol * sLevel
		, clock = channel.envelopeClock
		;
		vol = vol * vLevel;
	switch(phase(channel)){
		case 'a': 
			d = vol / channel.tuneParams.attack;
			vol = clock * d;
			break;
		case 'd': 
			clock -= channel.tuneParams.attack;
			d = (vol - svol) / channel.tuneParams.decay;
			vol -= clock * d;
			break;
		case 's': 
			clock -= channel.tuneParams.attack + channel.tuneParams.decay;
			vol = svol;
			break;
		case 'r': 
			clock -= channel.tuneParams.length + channel.tuneParams.attack + channel.tuneParams.decay;
			d = (svol) / channel.tuneParams.release;
			vol = svol - (clock * d);
			break;
		default: vol = 0; break;
	}
	return vol;
}

function noiseWave(channel, type)
{
	var i
		, vol = envelopedVolume(channel)
		, freq = channel.frequency
		, p = channel.noiseParam
		;
		
	p.shortType = type; //短周期タイプ
	p.halfLength = (channel.waveLength / 2) | 0;
	
	p.reg >>= 1;
	p.reg |= ((p.reg ^ (p.reg >> p.shortType)) & 1) << 15;
	p.volume =  ((p.reg & 1) * vol * 2.0) - vol;
	
}

function sawstairWave(channel, widthRate_l, widthRate_r)
{
	var i
		, vol = envelopedVolume(channel)
		, vResolute = 8 //volume reso
		, wResolute = vResolute //wave reso
		, cellVol = vol / (vResolute) //volume per stair
		, dh = 1
		, resolPos = 0
		, stairLen = 0
		, halftriLen = 0
		, triPhase = []
		, wavePhase = []
		, stairPos = 0
		, stairHeight = 0
		, triPos = 0
		;
	
	if(vol < 0){vol = 0; channel.waveLength = 0;}
	// if(vol == 0){return;}
	switchPos = ((channel.waveLength / (widthRate_l + widthRate_r)) * widthRate_l); // half wave length
	stairLen = switchPos / wResolute; //1cell length
	for(i = 0; i < wResolute; i++){
		stairPos += stairLen;
		wavePhase.push(stairPos);
	}
	triPhase.push(stairPos);
	
	switchPos = channel.waveLength - switchPos;
	stairLen = switchPos / wResolute;
	for(i = 0; i < wResolute; i++){
		stairPos += stairLen;
		wavePhase.push(stairPos);
	}	
	triPhase.push(stairPos);
	vol = 0;
	// stairHeight = 1;
	for(i = 0; i < channel.waveLength; i++){
		if(i >= wavePhase[resolPos]){
			resolPos++;
			stairHeight++;
			if(i >= triPhase[triPos]){
				// printDebug(i, triPos + 1);
				 triPos++;
				 stairHeight = 0;
				 vol = -vol - cellVol;
			}
			switch(triPos){
				case 0: vol += cellVol; break;
				case 1: vol += cellVol; break;
				default: vol = 0;
			}
		}
		channel.data[i] = vol;
	}
}

function tristairWave(channel, widthRate_l, widthRate_r)
{
	var i
		, vol = envelopedVolume(channel)
		, vResolute = 8 //volume reso
		, wResolute = (vResolute * 2) //wave reso
		, cellVol = vol / (vResolute) //volume per stair
		, dh = 1
		, resolPos = 0
		, stairLen = 0
		, halftriLen = 0
		, triPhase = []
		, wavePhase = []
		, stairPos = 0
		, stairHeight = 0
		, triPos = 0
		;
	
	if(vol < 0){vol = 0; channel.waveLength = 0;}
	// if(vol == 0){return;}
	switchPos = ((channel.waveLength / (widthRate_l + widthRate_r)) * widthRate_l); // half wave length
	stairLen = switchPos / wResolute; //1cell length
	for(i = 0; i < wResolute; i++){
		stairPos += stairLen;
		wavePhase.push(stairPos);
		if(i > 0 && i % vResolute == 0){
			triPhase.push(stairPos);
		}
	}
	triPhase.push(stairPos);
	
	switchPos = channel.waveLength - switchPos;
	stairLen = switchPos / wResolute;
	for(i = 0; i < wResolute; i++){
		stairPos += stairLen;
		wavePhase.push(stairPos);
		if(i > 0 && i % vResolute == 0){
			triPhase.push(stairPos);
		}
	}	
	triPhase.push(stairPos);
	// printDebug(channel.waveLength - (stairPos - stairLen), 2);
	// console.log([channel.waveLength, switchPos], 2);
	vol = 0;
	// stairHeight = 1;
	for(i = 0; i < channel.waveLength; i++){
		if(i >= wavePhase[resolPos]){
			resolPos++;
			stairHeight++;
			if(i >= triPhase[triPos]){
				// printDebug(i, triPos + 1);
				 triPos++;
				 stairHeight = 0;
			}
			switch(triPos){
				case 0: vol += cellVol; break;
				case 1: vol -= cellVol; break;
				case 2: vol -= cellVol; break;
				case 3: vol += cellVol; break;
				default: vol = 0;
			}
		}
		channel.data[i] = vol;
	}
}

function pulseWave(channel, widthRate_l, widthRate_r)
{
	var i
		, switchPos
		, vol = envelopedVolume(channel)
		// , doffset = channel.getDetunePosition()
		;
	
	if(vol < 0){vol = 0; channel.waveLength = 0;}
	// if(vol == 0){return;}
	switchPos = ((channel.waveLength / (widthRate_l + widthRate_r)) * widthRate_l) | 0;
	for(i = 0; i < channel.waveLength; i++){
		// if(++doffset >= channel.waveLength){
			// doffset = 0;
		// }
		if(i < switchPos){
			channel.data[i] = vol;
		}else{
			channel.data[i] = -vol;
		}
	}
	for(i; i < channel.prevLength; i++){
		channel.data[i] = 0;
	}
}

var start = function() {
};

var change = function(){
	litroAudio.changeWave();
	// console.log(litroAudio.mode);
	litroAudio.mode = (litroAudio.mode + 1) % 4;
};

function maxFreq()
{
	return KEY_FREQUENCY[KEY_FREQUENCY.length - 1][KEY_FREQUENCY[KEY_FREQUENCY.length - 1].length - 1];
}
function minFreq()
{
	return KEY_FREQUENCY[0][0];
}
//call at 60fps
function litroSoundMain()
{
	var ch;
// printDebug(maxFreq(), 1);

	for(ch = 0; ch < CHANNELS; ch++){
		litroSoundInstance.refreshWave(ch);
	}
	litroPlayerInstance.playSound();
};


