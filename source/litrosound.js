/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 * ver 0.05.04
 */
// var SAMPLE_RATE = 24000;
var SAMPLE_RATE = 48000;
// var SAMPLE_RATE = 144000;
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

var TOP_FREQ_LENGTH = 1;

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
		this.minClock = this.milliSecond / this.frameRate
		this.sampleRate = sampleRate;
		// this.refreshRate = sampleRate / 60;
		this.refreshRate = sampleRate / this.milliSecond;
		// console.log(this.refreshRate);

		this.maxFreq = (sampleRate / 2) | 0;
		this.maxWavlen = 0;
		this.minWavlen = 0;
		this.mode = 0;
		this.OCTAVE_MAX = 7;
		this.KEYCODE_MAX = KEY_FREQUENCY.length * KEY_FREQUENCY[0].length;
		litroSoundInstance = this;
		this.masterVolume = VOLUME_TEST;
		this.WAVE_VOLUME_RESOLUTION = 15; //波形データのボリューム分解能
		this.outputBuffer = [];
		this.isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? true : false;
		this.gain = null; //ゲイン
		this.analyser = null; //波形分析
		this.delay = null; //遅延
		this.source = null; //重要バッファ
		this.setChannelEventFunc = function(){return;};
		this.onNoteKeyEventFunc = function(){return;};
		this.fadeoutEventFunc = function(){return;};
		
		TOP_FREQ_LENGTH = (sampleRate / this.freqByKey((KEY_FREQUENCY.length * KEY_FREQUENCY[0].length) - 1)) | 0;
		
		var agent, src, i, data, buf, context;
		window.performance = window.performance == null ? window.Date : window.performance;
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if(window.AudioContext == null){
			console.log("this browser can't AudioContext!! ");
			return;
		}
		this.context = new AudioContext();
		this.setSampleRate(sampleRate, PROCESS_BUFFER_SIZE);
		this.maxWavlen = (this.context.sampleRate / minFreq()) | 0;
		this.minWavlen = (this.context.sampleRate / maxFreq()) | 0;
		// 出力開始
		// src.noteOn(0);
	},
	//TODO グローバル化
	freqByOctaveCodeNum: function(octave, codenum){
		return KEY_FREQUENCY[octave][codenum];
	},
	
	keyByOctaveCodeNum: function(octave, codenum){
		return (KEY_FREQUENCY[octave].length * octave) + codenum;
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
		return data;
	},
	
	setSampleRate: function(rate, size){
		var i, channel, context, scriptProcess, src;
		context = this.context;
		context.sampleRate = rate;
		
		this.sampleRate = rate;
		
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
			channel.refChannel = i;
			this.channel[i] = channel;
			this.setFrequency(i, 0);
		}
		return;
	},

	bufferProcess: function(ev)
	{
		var parent = litroSoundInstance
			, i, ch, isNoises = parent.isNoises(true)
			, data = ev.outputBuffer.getChannelData(0);
			
		
		for(i = 0; i < data.length; i++){
			ch = parent.channel[0];
			if(ch.refreshClock == 0){
				litroPlayerInstance.playSound();
				parent.refreshWave(0);
				ch.refreshClock = 0;
				isNoises = parent.isNoises(true);
			}
			data[i] = isNoises[0] ? ch.nextNoise() : ch.nextWave();
			ch.refreshClock = ch.refreshClock + 1 < parent.refreshRate ?  ch.refreshClock + 1 : 0;
			for(c = 1; c < parent.channel.length; c++){
				ch = parent.channel[c];
				if(ch.refreshClock == 0){
					parent.refreshWave(c);
					ch.refreshClock = 0;
					isNoises = parent.isNoises(true);
				}
				data[i] += isNoises[c] ? ch.nextNoise() : ch.nextWave();
				// ch.refreshClock++;
				ch.refreshClock = ch.refreshClock + 1 < parent.refreshRate ?  ch.refreshClock + 1 : 0;
			}
		}
		parent.outputBuffer = data;
	},
	
	setWaveType: function(channelNum, type)
	{
		this.setChannel(channelNum, 'waveType', type);
	},
	
	setFrequency: function(ch, freq)
	{
		var channel = this.channel[ch]
		;
		channel.setFreqency(freq);
	},
	
	getPhase: function(ch, refEnable)
	{
		// ch = refEnable ? this.channel[ch].refChannel : ch;
		if(this.channel[ch] == null){return '';}
		var clock = this.channel[ch].envelopeClock
			, env = this.getEnvelopes(ch, refEnable)
			;
		clock -= env.attack;
		if(clock < 0){return 'a';}
	
		clock -= env.decay;
		if(clock < 0){return 'd';}
	
		clock -= env.length;
		if(clock < 0){ return 's';}
		
		clock -= env.release;
		if(clock < 0){ return 'r';}
		
		return '';
		// return phase(this.channel[ch]);
	},
	
	isFinishEnvelope: function(ch, refEnable)
	{
		var clock = this.channel[ch].envelopeClock, env = this.getEnvelopes(ch, refEnable)
		;
		if(clock >= env.attack + env.decay + env.length + env.release){
			return true;
		}
		return false;
	},
	
	isNoises: function(refEnable)
	{
		var noises = []
			, i, len = this.channel.length, ch;
		for(i = 0; i < len; i++){
			ch = refEnable ? this.channel[i].refChannel : i;
			noises.push(this.channel[ch].isNoiseType());
		}
		return noises;
	},
	
	getChannel: function(ch, key, refEnable)
	{
		if(this.channel[ch].refChannel >= 0){
			ch = refEnable ? this.channel[ch].refChannel : ch;
		}
		return this.channel[ch].tuneParams[key];
	},
	getVibratos: function(ch, refEnable)
	{
		if(this.channel[ch].refChannel >= 0){
			ch = refEnable ? this.channel[ch].refChannel : ch;
		}
		return this.channel[ch].vibratos(this.minClock);
	},
	
	getDelay: function(ch, refEnable)
	{
		if(this.channel[ch].refChannel >= 0){
			ch = refEnable ? this.channel[ch].refChannel : ch;
		}
		return this.channel[ch].tuneParams.delay * this.minClock;
	},
	
	// getDetune: function(ch, refEnable)
	// {
		// if(this.channel[ch].refChannel >= 0){
			// ch = refEnable ? this.channel[ch].refChannel : ch;
		// }
		// return this.channel[ch].tuneParams.detune * this.minClock;
	// },	
	getEnvelopes: function(ch, refEnable)
	{
		if(this.channel[ch].refChannel >= 0){
			ch = refEnable ? this.channel[ch].refChannel : ch;
		}
		return this.channel[ch].envelopes(this.minClock);
	},
	
	setSetChannelEvent: function(func){
		this.setChannelEventFunc = func;
	},
	setChannel: function(ch, key, value)
	{
		var channel = this.channel[ch];
		if(value > AudioChannel.tuneParamsProp[key].max){
			value = AudioChannel.tuneParamsProp[key].min;
		}else if(value < AudioChannel.tuneParamsProp[key].min){
			value = AudioChannel.tuneParamsProp[key].max;
		}
		channel.tuneParams[key] = value;
		if(key == 'sweep'){
			if(channel.waveLength > 0){
				this.setFrequency(ch, Math.round(this.context.sampleRate / channel.waveLength) | 0);
			}
			channel.sweepClock = 1;
		}
		
		this.setChannelEventFunc(ch, key, value);
		return value;
	},
	
	toggleOutput: function(ch, toggle)
	{
		this.setChannel(ch, 'enable', toggle | 0);
		if(!toggle){
			this.channel[ch].trigFall();
			this.channel[ch].clearWave();
			this.channel[ch].absorbVolume = 0;
			this.channel[ch].waveLength = 0;
		}
	},
	
	// execper1/60fps
	refreshWave: function (channelNum)
	{
		var i, sumFreq, phase
		, wavLen, vibLen, detuneLen, sweepLen, sumLen
		, channel = this.channel[channelNum]
		, data = channel.data
		, vib = this.getVibratos(channelNum, true)
		, vibDist = AudioChannel.tuneParamsProp.vibratodepth.max - AudioChannel.tuneParamsProp.vibratodepth.min
		, lenDist
		, vibriseClock = channel.vibratoClock - vib.vibratorise
		, sweep = this.getChannel(channelNum, 'sweep', true)
		, detune = this.getChannel(channelNum, 'detune', true)
		, detuneDiv = 4
		, prop = AudioChannel.tuneParamsProp
		;
		if(this.getChannel(channelNum, 'enable', true) == 0){
			// channel.trigFall();
			return;
		}
		
		//立ち上がり
		if(channel.envelopeStart && channel.envelopeClock == 0 && !channel.envelopeEnd){
			channel.trigRize();
		}
		//立ち下がり
		else if(this.isFinishEnvelope(channelNum, true) && !channel.envelopeEnd){
			channel.trigFall();
		}
		
		sumFreq = channel.frequency;
		if(sumFreq < minFreq()){
			sumFreq = minFreq();
		}else if(sumFreq > maxFreq()){
			sumFreq = maxFreq();
		}
		channel.prevLength = channel.waveLength;

		wavLen = this.context.sampleRate / channel.frequency;
		sweepLen = sweep == 0 ? 0 
							: sweep > 0 ? -maxWavlen() * channel.sweepClock / Math.exp(sweep * prop.sweep.max * 0.001)
							: maxWavlen() * channel.sweepClock / Math.exp(sweep * prop.sweep.min * 0.001);
		//TODO 波形ずらしとして仕込みたい。負荷が軽減され次第
		detuneLen = (detune / detuneDiv) | 0;
		lenDist = wavLen;
		phase = vib.vibratophase * 180 / vibDist;
		vibLen = vibriseClock < 0 || vib.vibratospeed == 0 ? 0 : (lenDist * (vib.vibratodepth) / vibDist)
		 			* Math.sin((vibriseClock + phase) * (Math.PI / 180) * 180 / vib.vibratospeed);
		sumLen = sweepLen + detuneLen + vibLen;
		channel.waveLength = (wavLen + sumLen) | 0;
		channel.waveLength = channel.waveLength > maxWavlen() ? maxWavlen() : channel.waveLength;
		channel.waveLength = channel.waveLength < minWavlen() ? minWavlen() : channel.waveLength;

		switch(this.envelopeWaveType(channelNum, true)){
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
		// channel.shiftWave((this.getChannel(channelNum, 'detune', true)) % channel.waveLength);


		if(!channel.envelopeEnd && channel.envelopeStart){
			channel.envelopeClock++;
			channel.detuneClock++;
			channel.sweepClock++;
			channel.vibratoClock++;
			channel.refreshClock = 0;
		}
	},
	
	envelopeWaveType: function(ch, refEnable)
	{
		var refch = refEnable ? this.channel[ch].refChannel : ch
			, res;
		;
		switch(this.getPhase(ch, refEnable)){
			case 'a': res = this.getChannel(ch, 'waveTypeAttack', refEnable); break;
			case 'd': res = this.getChannel(ch, 'waveTypeDecay', refEnable); break;
			default: res = -1;
		}
		return res < 0 ? this.getChannel(ch, 'waveType', refEnable) : res;
	},
	
	setOnNoteKeyEvent: function(func){
		this.onNoteKeyEventFunc = func;
	},
	
	getNoteKey: function(ch)
	{
		return this.channel[ch].noteKey;
	},
	onNoteKey: function(ch, key, refChannel)
	{
		// console.log(codenum + ' ' + octave);
		var channel = this.channel[ch], freq = this.freqByKey(key);

		channel.refChannel = ch;
		channel.noteKey = key;
		channel.envelopeClock = 0;
		channel.detuneClock = 0;
		channel.sweepClock = 0;
		// channel.refreshClock = 0;
		channel.vibratoClock = 0;
		channel.dataUpdateFlag = true;
		channel.resetEnvelope();
		this.refreshWave(ch);
		
		
		// this.setFrequency(ch, freq);
	},	
	onNoteFromCode: function(ch, codenum, octave, refChannel)
	{
		// console.log(codenum + ' ' + octave);
		var channel = this.channel[ch], freq = this.freqByOctaveCodeNum(octave, codenum);
		// this.channel[ch].clearWave();
		channel.refChannel = refChannel;
		channel.noteKey = this.keyByOctaveCodeNum(octave, codenum);
		channel.envelopeClock = 0;
		channel.detuneClock = 0;
		channel.sweepClock = 0;
		// channel.refreshClock = 0;
		channel.vibratoClock = 0;
		channel.dataUpdateFlag = true;
		channel.resetEnvelope();
		this.refreshWave(ch);
		
		// console.log("onN", channel.absorbPosition, channel.waveClockPosition);
		
		// this.setFrequency(ch, freq);
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
		this.channel[channel].resetEnvelope();
		this.setFrequency(channel, 0);

	},
	
	extendNote: function(channelNum, refChannel)
	{
		var channel = this.channel[channelNum]
			, envelopes = channel.envelopes(this.minClock)
		;
		channel.envelopeClock = (envelopes.attack + envelopes.decay) | 0;
	},
	
	fadeOutNote: function(channelNum, refChannel)
	{
		if(channelNum == null){
			return;
		}
		// this.channel[channel].resetEnvelope();
		this.skiptoReleaseClock(channelNum, true);
		this.channel[channelNum].refChannel = refChannel == null ? channelNum : refChannel;

		// console.log(this.channel[channelNum].refChannel);
	},
	
	skiptoReleaseClock: function(ch, refEnable)
	{
		// var clock = this.getChannel(ch, 'attack', refEnable) + this.getChannel(ch, 'decay', refEnable) + this.getChannel(ch, 'length', refEnable)
		var env = this.getEnvelopes(ch, true)
			, clock = env.decay + env.length
			, channel = this.channel[ch]
		;
		// console.log(channel.envelopeClock);
		channel.envelopeClock = channel.envelopeClock < clock ? clock : channel.envelopeClock;
		// console.log(ch, channel.envelopeClock);
	},
		
	noteOn: function(channel){
		this.channel[channel].bufferSource.start(0);
	},
	
	noteoff: function(channel){
		this.channel[channel].bufferSource.stop(0);
	},
	
	envelopedVolume: function(ch)
	{
		// printDebug(ch);
		var i
		, channel = this.channel[ch]
		, vol = (1 / 2) / channel.WAVE_VOLUME_RESOLUTION  // +1 / -1 
		, clock = channel.envelopeClock
		, env = this.getEnvelopes(ch, true)
		, sLevel = env.sustain
		, svol = vol * sLevel
		;
		if(this.getChannel(ch, 'enable') == 0){return 0;}
		if(!channel.envelopeStart){return 0;}
		vol = vol * env.volumeLevel;
		switch(this.getPhase(ch, true)){
			case 'a': 
				d = vol / env.attack;
				vol = clock * d;
				break;
			case 'd': 
				clock -= env.attack;
				d = (vol - svol) / env.decay;
				vol -= clock * d;
				break;
			case 's': 
				clock -= env.attack + env.decay;
				vol = svol;
				break;
			case 'r': 
				clock -= env.length + env.attack + env.decay;
				d = (svol) / env.release;
				vol = svol - (clock * d);
				break;
			default: vol = 0; break;
		}
		
		if(Number.isNaN(vol)){
			console.log(this.getPhase(ch, true));
		}
		return vol;
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
		//v0.03:-値対応
		this.fversion = '00.00.04';
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
		this.litroSound = litroSoundInstance;
		this.systemTime = 0;
		this.timeOutEvent = {};
		// this.timeOutEvent = [];
		this.timeOutCC = [];
		this.eventsetKeyIndex = {};
		this.FORMAT_LAVEL = 'litrosoundformat';
		this.fileUserName = 'guest_user_';
		this.fileOtherInfo = 'xxxxxxxxxxxxxxxx';
		this.dataHeaderDelimiter = '[datachunk]';
		this.HEADER_TITLELENGTH = this.titleMaxLength;
		this.DATA_LENGTH16 = {ch:2, type:2, timeval:4, time:6, value:2};
		this.DATA_LENGTH36 = {ch:1, type:2, timeval:3, time:4, value:2};
		this.CHARCODE_LENGTH16 = 8;//4byte
		this.CHARCODE_LENGTH36 = 6;//3byte
		this.CHARCODE_MODE = 36;
		// this.HEADER_LENGTH = 64;
		if(window.location.href.indexOf('localhost') >= 0){
			this.SERVER_URL = 'http://localhost:58104/api';
		}else{
			this.SERVER_URL = 'http://bitchunk.fam.cx/litrosound/api';
		}
		// this.COMMON_TUNE_CH = this.litroSound.channel.length;
		this.COMMON_TUNE_CH = 0;
		
		var type, ch, addEtc = 0;
		for(ch = 0; ch < this.litroSound.channel.length + addEtc; ch++){
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
	 * <255><COMMONTYPEID><LENGTH><DATA>
	 * DATA:<time><value>
	 * 4.6h
	 */
	/**
	 * litrosoundformat
	 * [version]xx.xx.xx
	 * [auth]xxxxxxxxxxx
	 * [title](xxxxxxxxxxxxxxxx)32
	 * [datachunk]4096 - 64
	 * <CH><TYPEID><LENGTH><DATA>
	 * <CH><TYPEID><LENGTH><DATA>
	 * <255><COMMONTYPEID><LENGTH><DATA>
	 * DATA:<time><value>
	 * 4.6h
	 */	
	headerInfo: function()
	{
		// this.fileUserName = this.fileUserName.substr(0, 11);
		var title = this.str5bit(this.titleCodes.length > 0 ? this.titleCodes : this.title);
		// if(info.length < this.HEADER_TITLELENGTH){
			// info = 'xxxxxxxxxxxxxxxx'.substr(0, this.HEADER_TITLELENGTH - info.length) + info;
		// }
		// this.fileOtherInfo = info.substr(0, this.HEADER_TITLELENGTH);
		// return this.FORMAT_LAVEL + 'version-' + this.fversion + 'auth_' + this.fileUserName + this.fileOtherInfo;
		return this.FORMAT_LAVEL + '[version]' + this.fversion + '[auth]' + this.fileUserName + '[title]' + title + this.dataHeaderDelimiter;
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
			, prop = AudioChannel.tuneParamsProp
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
				
				typestr = this.pad0((prop[type].id | 0).toString(mode), datLen.type);//+2
				typestr += this.pad0((timeDatsNum | 0).toString(mode), datLen.timeval);//+4
			// console.log('length', this.pad0((timeDatsNum | 0).toString(mode), 4));
			// console.log('type', this.pad0((type | 0).toString(mode), 2));
				for(time in edat[ch][type]){
					typestr += this.pad0((time | 0).toString(mode), datLen.time);//+6
					typestr += this.pad0(((edat[ch][type][time].value | 0) - prop[type].min).toString(mode), datLen.value);//+2
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
			//insert needs sound_id:0
			this.sendToAPIServer('POST', 'fileinsert', params, func, errorFunc);
		}else{
			//update needs sound_id > 0
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
	//datastr parse のみ有効
	timevalData: function(type, timeval)
	{
		var i, res = {}, datLen = this.DATA_LENGTH36
		, mode = this.CHARCODE_MODE
		, chunkLen = datLen.time + datLen.value
		, length = (timeval.length / chunkLen) | 0
		, time, value
		, prop = AudioChannel.tuneParamsProp
		;
		// console.log(timeval, length);
		for(i = 0; i < length; i++){
			time = parseInt(timeval.substr(chunkLen * i, datLen.time), mode);
			value = parseInt(timeval.substr((chunkLen * i) + datLen.time, datLen.value), mode) + prop[type].min;
			res[time] = {type: type, time: time, value: value};
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
			, delim = this.dataHeaderDelimiter
		;
		// data = data.substr(this.HEADER_LENGTH);
		data = data.substr(data.lastIndexOf(delim) + delim.length);
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
		if(sound_id == 0){
			errorFunc({error_code: 0, message: 'no file'});
			return false;
		}
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
		return true;
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
		x.withCredentials = true;
		x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		// Set-Cookie:LITROSOUND=8lr6fpmr30focapfnejn807mo5;
		x.send(str);
	},

	isPlay: function()
	{
		return this.playSoundFlag;
	},
	play: function(toggle)
	{
		this.systemTime = performance.now();
		this.playSoundFlag = true;
		this.timeOutEvent = {};
		
		
		for(var i = 0; i < litroSoundInstance.channel.length; i++){
			litroSoundInstance.channel[i].refChannel = litroSoundInstance.channel[i].id;
		}
	},
	
	stop: function(toggle)
	{
		this.systemTime = performance.now();
		this.playSoundFlag = false;
		this.timeOutEvent = {};
	},
	
	commonEventTime: function(eventName){
		var t, tuneID = AudioChannel.tuneParamsProp[eventName].id
			, set = this.eventsetData[this.COMMON_TUNE_CH].event;
		for(t  in set){
			if(set[t].value == tuneID){
				return t | 0;
			}
		}
		return -1;
	},
	
	//ループの際何かを実行
	restartEvent: function(){
		return;
	},
	
	setRestartEvent: function(func){
		this.restartEvent = func;
	},
	
	soundEventPush: function(ch, type, value)
	{
		// var tuneId = AudioChannel.tuneParamsID;
		var tuneProp = AudioChannel.tuneParamsProp;
		if(type == 'note'){
			litroSoundInstance.onNoteKey(ch, value);
		}else if(type == 'event'){
			switch(value){
				case tuneProp['return'].id: this.seekMoveBack(-1), this.seekMoveForward(this.commonEventTime('restart')); this.timeOutEvent = {}; this.restartEvent(); return true;
				case tuneProp.noteoff.id: litroSoundInstance.fadeOutNote(ch, ch); break;
				case tuneProp.noteextend.id: litroSoundInstance.extendNote(ch, ch); break;
			}
		}else{
			litroSoundInstance.setChannel(ch, type, value);
		}
		return false;
	},
	
	//bufferProcess任せ
	playSound: function()
	{
		if(!this.playSoundFlag){return;}
		var t, ch, s
			, data, delay
			, now = performance.now()
			// , perFrameTime = (now - this.systemTime) | 0
			, perFrameTime = 1
			, sort = AudioChannel.sortParam
		;
		for(t = 0; t < perFrameTime; t++){
			for(ch in this.eventsetData){
				delay = litroSoundInstance.getChannel(ch, 'delay', true) * 10;
				for(s = 0; s < sort.length; s++){
					type = sort[s];
					if(this.eventsetData[ch][type][this.noteSeekTime] != null){
						data = this.eventsetData[ch][type][this.noteSeekTime];
						if(delay > 0){
							this.setTimeOutEvent(ch, t + delay, delay + t + data.time, type, data.value);
						}else if(t > 0){
							this.setTimeOutEvent(ch, t, t + data.time, type, data.value);
						}else{
							if(this.soundEventPush(ch, type, data.value)){
								return;
							}
						}
					}
				}
			}
			this.seekMoveForward(1);
		}
		this.systemTime = now;
	},
	
	//requestAnimation任せ
	setTimeOutEvent: function(ch, time, time_id, type, value)
	{
		if(this.timeOutEvent[time_id] == null){
			this.timeOutEvent[time_id] = [];
			this.timeOutEvent[time_id].push({time: time, ch: ch, type: type, value: value});
			setTimeout(function(){
				// console.log(1);
				var t, i, self = litroPlayerInstance, data;
				// for(i = 0; i < self.timeOutEvent.length; i++){
				for(t in self.timeOutEvent){
					for(i = 0; i < self.timeOutEvent[t].length; i++){
						data = self.timeOutEvent[t][i];
						// if(data.time <= self.noteSeekTime){
						// }
						//ループしたら
						if(self.soundEventPush(data.ch, data.type, data.value)){
							return;
						}
					}
					self.timeOutEvent[t] = null;
					delete self.timeOutEvent[t];
					return;
				}
			}, time);
		}else{
			this.timeOutEvent[time_id].push({time: time, ch: ch, type: type, value: value});
		}
		
	},

	getEventsFromTime: function(ch, time, filter)
	{
		var type, types = {}, res = {}, set = false, tindex;
		filter = filter == null ? AudioChannel.sortParam : this.typesArray(filter);
		for(tindex = 0; tindex < filter.length; tindex++){
			type = filter[tindex];
			if(this.eventsetData[ch] != null && this.eventsetData[ch][type] != null && this.eventsetData[ch][type][time] != null){
				res[type] = this.eventsetData[ch][type][time];
			}
		}
		return res;
	},
	
	seekMoveForward: function(ftime)
	{
		ftime = ftime == null ? 1 : ftime;
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
		, typeKeys = this.typesArray()
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
	
	typesArray: function(type, exIgnores)
	{
		var types = [], t, params = []
			, del = {}
			, ignores = ['note']
			;
		exIgnores = exIgnores == null ? [] : exIgnores;
		type = type == null ? 'ALL' : type;
		if(type == 'ALL'){
			//すべてのタイプを検索
			types = AudioChannel.sortParam;
		}else if(type == 'TUNE'){
			//イベントセットの検索
			params = AudioChannel.sortParam;
			for(t = 0; t < params.length; t++){
				if(ignores.indexOf(params[t]) >= 0 || exIgnores.indexOf(params[t]) >= 0){
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
		types = this.typesArray(type == null ? 'ALL' : type);
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
		types = this.typesArray(type == null ? 'ALL' : type);
		//後方一致
		events = this.allStackEventset(ch, types);
		// console.log(events, types[type], this.eventsetData[ch][types[type]]);
		events.reverse();
		for(t = 0; t < events.length; t++){
			for(tindex = 0; tindex < types.length; tindex++){
				type = types[tindex];
				eventset = events[t];
				if(ignore != null && ignore.time == eventset.time){
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
	'vibratospeed',
	'vibratodepth',
	'vibratorise',
	'vibratophase',
	'sweep',
	'delay',
	'detune',
	'waveTypeAttack',
	'waveTypeDecay',
	'event',
	'enable',
	'note'
];
// 
// AudioChannel.sortParam = [
	// 'waveType',
	// 'volumeLevel',
	// 'attack',
	// 'decay',
	// 'sustain',
	// 'length',
	// 'release',
	// 'delay',
	// 'detune',
	// 'sweep',
	// 'vibratospeed',
	// 'vibratodepth',
	// 'vibratorise',
	// 'vibratophase',
	// 'waveTypeAttack',
	// 'waveTypeDecay',
	// 'event',
	// 'enable',
	// 'note'
// ];

//TODO エンベロープごとの波形タイプ
//TODO サーバー保存時のマイナス処理
AudioChannel.tuneParamsProp = {
	'void': {id: 0, max: 0, min: 0},
	enable: {id: 1, max: 1, min: 0},
	restart: {id: 2, max: Infinity, min: 0},
	'return': {id: 3, max: Infinity, min: 0},
	prestart: {id: 4, max: Infinity, min: 0},
	preend:{id: 5, max: Infinity, min: 0},
	noteon:{id: 6, max: Infinity, min: 0},
	noteoff:{id: 7, max: Infinity, min: 0},
	noteextend:{id: 8, max: Infinity, min: 0},
	'event': {id: 127, max: 255, min: 0},
	note: {id: 128, max: 255, min: 0},
	waveType:{id: 129, max: 15, min: 0},
	volumeLevel:{id: 130, max: 15, min: 0},
	attack:{id: 131, max: 64, min: 0},
	decay:{id: 132, max: 64, min: 0},
	sustain:{id: 133, max: 15, min: 0},
	length:{id: 134, max: 255, min: 0},
	release:{id: 135, max: 255, min: 0},
	delay:{id: 136, max: 255, min: 0},
	detune:{id: 137, max: 127, min: -127},
	sweep:{id: 138, max: 127, min: -127},
	vibratospeed:{id: 160, max: 255, min: 0},
	vibratodepth:{id: 161, max: 255, min: 0},
	vibratorise:{id: 162, max: 255, min: 0},
	vibratophase:{id: 163, max: 255, min: 0},
	waveTypeAttack:{id: 180, max: 15, min: -1},
	waveTypeDecay:{id: 181, max: 15, min: -1},
};

AudioChannel.commonTuneType = {
	restart: '',
	'return': '',
};

AudioChannel.tuneParamsIDKey = function()
{
	var k, keys = {};
	for(k in AudioChannel.tuneParamsProp){
		keys[AudioChannel.tuneParamsProp[k].id] = k;
	}
	// for(k in AudioChannel.tuneParamsID){
		// keys[AudioChannel.tuneParamsID[k]] = k;
	// }
	return keys;
};
AudioChannel.maxTune = function(name)
{
	return AudioChannel.tuneParamsProp[name].max;
	// return AudioChannel.tuneParamsMax[name];
};
AudioChannel.minTune = function(name)
{
	return AudioChannel.tuneParamsProp[name].min;
	// return AudioChannel.tuneParamsMin[name];
};
AudioChannel.prototype = {
	init:function(datasize, resolution){
		// console.log(this.data);
		this.id = null;
		this.bufferSource = null;
		this.buffer = null;
		this.absorbVolume = 0;
		this.absorbPosition = 0;
		this.absorbCount = 0;
		this.absorbNegCount = 0;
		this.waveLength = 0;
		this.refreshClock = 0;
		this.waveClockPosition = 0;
		this.detuneClock = 0;
		this.envelopeClock = 0;
		this.envelopeEnd = true;//初期大音量防止
		this.envelopeStart = false;
		this.sweepClock = 0;
		this.vibratoClock = 0;
		this.prevLength = 0;
		this.data = this.allocBuffer(datasize);
		this.bufferSize = datasize;
		this.dataUpdateFlag = false;//不要？
		this.refChannel = -1;
		this.noteKey = -1;
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
			length:32,
			delay:0,
			detune:0,
			sweep:0,
			attack:0,
			decay:0,
			sustain:10,
			release:0,
			vibratospeed:0,
			vibratodepth:0,
			vibratorise:0,
			vibratophase:0,
			waveTypeAttack:-1,
			waveTypeDecay:-1,
			'event': 0,
			enable:1,
			turn:1,
		};
		
	},
	
	tune: function(name, param)
	{
		var p = this.tuneParams;
		return p[name] = (param == null) ? p[name] : param;
	},
	envelopes: function(clockRate)
	{
		var p = this.tuneParams;
		clockRate == null ? 1 : clockRate;
		return {attack: p.attack * clockRate, decay: p.decay * clockRate, length: p. length * clockRate, release: p.release * clockRate, sustain: p.sustain, volumeLevel: p.volumeLevel};
	},
	
	vibratos: function(clockRate)
	{
		var p = this.tuneParams;
		clockRate == null ? 1 : clockRate;
		return {vibratospeed: p.vibratospeed * clockRate, vibratodepth: p.vibratodepth, vibratorise: p. vibratorise * clockRate, vibratophase: p.vibratophase};
	},
	
	setFreqency: function(freq)
	{
		this.frequency = freq;// + (freq / 1028 * this.getChannel(ch, 'detune', true));
		this.prevLength = this.waveLength;
		this.waveLength = ((litroSoundInstance.context.sampleRate / this.frequency)) | 0;
	},
	
	allocBuffer: function(datasize){
		var i, data;
		data = [];
		for(i = 0; i < datasize; i++){
			data.push(0);
		}
		return data;
	},
	// isRefreshClock: function()
	// {
		// this.refreshLimit = (SAMPLE_RATE / 1000) | 0;
		// return this.refreshClock < this.refreshLimit  ? false : true;
	// },
	
	// getDetunePosition: function()
	// {
		// if(this.tuneParams.detune == 0){return 0;}
		// return (this.detuneClock * this.tuneParams.detune) | 0;
	// },
	
	isNoiseType: function()
	{
		var type = this.tuneParams.waveType;
		return type > 11 && type < 16;
	},
	
	resetEnvelope: function()
	{
		this.envelopeClock = 0;
		this.envelopeEnd = false;
		this.envelopeStart = true;
	},
	
	clearWave: function(start, end)
	{
		 var i, r = this.data[this.waveLength - 1], len = end == null ? this.waveLength : end;
		for(i = (start == null ? 0 : start); i < len; i++){
			this.data[i] = 0;
		}
		return r;
	},
	
	shiftWave: function(val){
		// var i, a = this.data.slice(0, this.waveLength);
		// for(i = 0; i < val; i++){
			// a.unshift(a.pop());
		// }
		// this.data.splice(0, this.waveLength, a);
	},
	
	trigRize: function(){
		//立ち上がり
			this.setFreqency(freqByKey(this.noteKey));
			this.clearWave(this.waveLength, this.prevLength);
			this.waveClockPosition = Math.round(this.waveClockPosition * (this.waveLength / this.prevLength));
			this.absorbPosition = Math.round(this.absorbPosition * (this.waveLength / this.prevLength));
			this.absorbNegCount = 0;
	},
	
	trigFall: function(){
		//立ち下がり
		// if(this.isFinishEnvelope(channelNum, true) && !channel.envelopeEnd){
			this.absorbVolume = this.data[this.waveClockPosition];
			this.absorbPosition = this.waveClockPosition;
			this.absorbCount = 0;
			this.envelopeEnd = true;
			this.dataUpdateFlag = false;
			this.envelopeStart = false;
	},
	
	isFinishEnvelope: function(clockRate){
		clockRate == null ? 1 : clockRate;
		var clock = this.envelopeClock, env = this.envelopes(clockRate)
		;
		if(clock >= env.attack + env.decay + env.length + env.release){
			return true;
		}
		return false;
	},
	
	nextWave: function(){
		var vol, avol;
		vol = this.data[this.waveClockPosition];
		if(this.envelopeEnd == true){
			//クリック音防止余韻
			avol = this.absorbVolume * Math.exp(-0.001 * this.absorbCount++);
			return vol + avol;
		// }else if(this.absorbNegCount < this.absorbCount){
		}else if(this.envelopeStart == true){
			avol = -this.absorbVolume * Math.exp(-0.001 * this.absorbNegCount++);
		}else{
			avol = 0;
			return avol;
		}
		// if(this.absorbNegCount == 1){console.log(this.absorbPosition, this.waveClockPosition, vol + avol );}
		this.waveClockPosition = this.waveClockPosition + 1 < this.waveLength ? this.waveClockPosition + 1 : 0;
		return vol + avol;
	},
	
	nextNoise: function(){
		var p = this.noiseParam
			, vol = 0, avol = 0
		;
		vol += litroSoundInstance.envelopedVolume(this.id);

		if(p.clock++ >= p.halfLength){
			p.reg >>= 1;
			p.reg |= ((p.reg ^ (p.reg >> p.shortType)) & 1) << 15;
			p.volume =  ((p.reg & 1) * vol * 2.0) - vol;
			p.clock = 0;
		}
		
		this.waveClockPosition = this.waveClockPosition < this.waveLength ? this.waveClockPosition + 1 : 0;
		this.data[this.waveClockPosition] = p.volume;
		if(this.envelopeEnd == true){
			//クリック音防止余韻
			avol = this.absorbVolume * Math.exp(-0.0001 * this.absorbCount++);
			return avol;
		}else if(this.envelopeStart == true){
			avol = -this.absorbVolume * Math.exp(-0.0001 * this.absorbNegCount++);
		}else{
			avol = 0;
			return avol;
		}
		
		return p.volume + vol + avol;
	},
	
};

function noiseWave(channel, type)
{
	var i
		, vol = litroSoundInstance.envelopedVolume(channel.id)
		, freq = channel.frequency
		, p = channel.noiseParam
		;
	if(vol <= 0){vol = 0;}
		
	p.shortType = type; //短周期タイプ
	p.halfLength = ((channel.waveLength - TOP_FREQ_LENGTH) / 2) | 0;
		// console.log(p.halfLength);
	// if(p.halfLength == 2){
	// }
	
	p.reg >>= 1;
	p.reg |= ((p.reg ^ (p.reg >> p.shortType)) & 1) << 15;
	p.volume =  ((p.reg & 1) * vol * 2.0) - vol;
	
}

function sawstairWave(channel, widthRate_l, widthRate_r)
{
	var i
		, vol = litroSoundInstance.envelopedVolume(channel.id) * Math.sqrt(2)
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
	
	if(vol <= 0){vol = 0;}
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
		, vol = litroSoundInstance.envelopedVolume(channel.id) * Math.sqrt(3)
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
	
	if(vol <= 0){vol = 0;}
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
		, vol = litroSoundInstance.envelopedVolume(channel.id)
		// , doffset = channel.getDetunePosition()
		;
	
	if(vol < 0){vol = 0;}
	switchPos = ((channel.waveLength / (widthRate_l + widthRate_r)) * widthRate_l) | 0;
	for(i = 0; i < channel.waveLength; i++){
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

function maxWavlen()
{
	return litroSoundInstance.maxWavlen;
}
function minWavlen()
{
	return litroSoundInstance.minWavlen;
}
function freqByKey(key){
	return KEY_FREQUENCY[(key / KEY_FREQUENCY[0].length) | 0][key % KEY_FREQUENCY[0].length];
}


//call at 60fps
function litroSoundMain()
{
	// var ch;
	// for(ch = 0; ch < CHANNELS; ch++){
		// litroSoundInstance.refreshWave(ch);
	// }
	// if(litroSoundInstance.channel != null){
		// printDebug(litroSoundInstance.channel[0].waveClockPosition, 1);
		// printDebug(litroSoundInstance.channel[0].absorbPosition, 0);
		// , this.waveClockPosition, this.absorbPosition
	// }
	litroPlayerInstance.playSound();
};


