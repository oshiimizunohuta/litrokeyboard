/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 * ver 0.07.08
 */
// var SAMPLE_RATE = 24000;
// var SAMPLE_RATE = 48000;
var SAMPLE_RATE = 44100;//readonly意味ないy
// var SAMPLE_RATE = 144000;
// var PROCESS_BUFFER_SIZE = 8192;
// var PROCESS_BUFFER_SIZE = 4096;
// var PROCESS_BUFFER_SIZE = 2048; //chrome
var PROCESS_BUFFER_SIZE = 1024; //firefox
// var CHANNEL_BUFFER_SIZE = 48000;
var BUFFER_FRAMES = 60;
// var BUFFERS = 2;
var CHANNELS = 8;
var litroAudio = null;
var VOLUME_TEST = 0.4;
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

var testval = 0;

LitroSound.prototype = {
	init : function(channelNum) {
		this.isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? true : false;
		this.channel = [];
		this.channel.length = channelNum;
		// this.players = {};
		this.players = [];
		this.frameRate = 60;
		// this.milliSecond = this.isFirefox ? 1100 : 1000;//firefox : chrome
		this.milliSecond = 1000;//firefox : chrome
		this.minClock = this.milliSecond / this.frameRate; //ノート単位クロック
		this.sampleRate = 0;
		this.refreshRate = 0; //init
		this.refreshClock = 0;
		this.recoverCount = 0; //異常時立ち直りまでのカウント
		this.processHeavyLoad = false;
		this.performanceCycle = 280; //?
		this.performanceValue = 0;
		// console.log(this.refreshRate);
		this.radiateTime = 16; //[ms] 安定化待ち時間
		this.radiationTimer = 0;

		this.maxFreq = 0; //init
		this.maxWavlen = 0;
		this.minWavlen = 0;
		this.mode = 0;
		this.OCTAVE_MAX = 7;
		this.KEYCODE_MAX = KEY_FREQUENCY.length * KEY_FREQUENCY[0].length;
		litroSoundInstance = this;
		this.masterVolume = VOLUME_TEST;
		this.WAVE_VOLUME_RESOLUTION = 15; //波形データのボリューム分解能
		this.outputBuffer = [];
		// console.log(this.isFirefox);
		this.scriptProcess = null;
		this.gain = null; //ゲイン
		this.analyser = null; //波形分析
		this.delay = null; //遅延
		this.source = null; //重要バッファ
		this.setChannelEventFunc = function(){return;};
		this.onNoteKeyEventFunc = function(){return;};
		this.fadeoutEventFunc = function(){return;};
		
		TOP_FREQ_LENGTH = 0; //init
		
		var agent, src, i, data, buf;
		window.performance = window.performance == null ? window.Date : window.performance;
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if(window.AudioContext == null){
			console.log("this browser can't AudioContext!! ");
			return;
		}
		// this.context = new AudioContext();
		// this.setSampleRate(sampleRate, PROCESS_BUFFER_SIZE);
		this.createContext();
		
		this.initWaveProperties();
		
		this.audioChennelInit(channelNum);
		
		this.connectModules(PROCESS_BUFFER_SIZE);

		// 出力開始
		// src.noteOn(0);
	},
	
	//チャンネル設定
	audioChennelInit: function(chnum){
		var rate = this.context.sampleRate;
		for(i = 0; i < this.channel.length; i++){
			channel = new AudioChannel();
			channel.init(((rate / KEY_FREQUENCY[0][0]) | 0) + 1, this.WAVE_VOLUME_RESOLUTION);
			channel.id = i;
			channel.refChannel = i;
			channel.refreshEnvelopeParams(this.minClock);
			this.channel[i] = channel;
			this.setFrequency(i, 0);
		}
	},

	appendPlayer: function(name, player)
	{
		var primary = this.players.some(function(p, i){
			if(p.name == name){
				primary = i;
				return true;
			}
			return false;
		}) ? primary : this.players.length
			, append = {name: name, player: player, primary: primary};
		this.players[primary] = append;
		
		return primary;
	},
	
	removePlayer: function(name)
	{
		var deleted;
		deleted = this.players.some(function(p, i){
			if(p.name == name){
				delete this.player[i];
				return true;
			}
			return false;
		}, this);

		return deleted;
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
	
	createContext: function(){
		if(this.context == null){this.context = new AudioContext();}
		// context.sampleRate = rate; //read only
		
		this.sampleRate = this.context.sampleRate; //
	},
	
	connectModules: function(size)
	{
		var i, channel, scriptProcess, src, self = this, vol;
		context = this.context;
		//ゲイン
		if(this.gain != null){
			vol = this.gain.gain.value;
		}
		this.gain = null;
		this.gain = context.createGain();
		this.gain.gain.value = vol == null ? this.masterVolume : vol;
		this.gain.connect(context.destination);
		
		//プロセス
		this.scriptProcess = null;
		scriptProcess = context.createScriptProcessor(size, 0, 1);
		scriptProcess.onaudioprocess = function(ev){self.bufferProcess(ev);};
		scriptProcess.parent_audio = this;
		
		scriptProcess.connect(this.gain);
		this.scriptProcess = scriptProcess;

		// this.source = this.context.createBufferSource();
		// this.source.connect(scriptProcess);
		// this.source.start(0);
		// this.source.playbackRate = 8;
		
		//解析
		this.analyser = null;
		this.analyser = this.context.createAnalyser();
		this.analyser.fft = 512;
		scriptProcess.connect(this.analyser);
		
		// console.log(scriptProcess);
		// this.delay = this.context.createDelay();
		// this.delay.delayTime.value = 1.0;
		// this.delay.connect(context.destination);
		// scriptProcess.connect(this.delay);
		
	},
	
	initWaveProperties: function()
	{
		if(this.context == null){return;}
		TOP_FREQ_LENGTH = (this.context.sampleRate / this.freqByKey((KEY_FREQUENCY.length * KEY_FREQUENCY[0].length) - 1)) | 0;
		this.refreshRate = this.context.sampleRate / this.milliSecond;
		this.maxFreq = (this.context.sampleRate / 2) | 0;
		this.maxWavlen = (this.context.sampleRate / minFreq()) | 0;
		this.minWavlen = (this.context.sampleRate / maxFreq()) | 0;
	},
	
	connectOn: function()
	{
		this.connectOff();
		this.connectModules(PROCESS_BUFFER_SIZE);
		// this.scriptProcess.connect(this.gain);
		// this.scriptProcess.connect(this.analyser);
		// this.gain.connect(this.context.destination);
	},
	connectOff: function()
	{
		this.scriptProcess.disconnect();
		this.scriptProcess.onaudioprocess = null;
		this.gain.disconnect();
	},
	
	enableChannels: function(){
		return this.channel.filter(function(ch){
			return ch.tune('enable') == 1;
		});
	},

	bufferProcess: function(ev)
	{
		var i, ch, channels = this.channel
			, players = this.players
			, data = ev.outputBuffer.getChannelData(0)
			, dlen = data.length, clen = channels.length, plen = players.length
			, rate = this.refreshRate, rCrock = this.refreshClock
			, d0 = new Float32Array(ev.outputBuffer.length)
			;
			// console.log(channels.length);
		if(!this.checkPerformance(ev)){
			this.clearBuffer(ev);
			return;
		}
		data.set(d0);
		for(i = 0; i < dlen; i++){
			if(++rCrock >= rate){
				for(ch = 0; ch < plen; ch++)
				players[ch].player.playSound();
				for(ch = 0; ch < clen; ch++){
					this.refreshWave(ch);
				}
				rCrock = 0;
			// }else{
				// rCrock = rCrock >= rate ? 0 : rCrock + 1;
			}
			for(ch = 0; ch < clen; ch++){
				data[i] += channels[ch].nextWave();
			}
		}
		this.refreshClock = rCrock;
	},
	
	checkPerformance: function(ev)
	{
		var pf = window.performance.now()
			, self = this;
		if(this.scriptProcess == null){return;}
		if(pf - this.performanceValue > this.performanceCycle){
			if(!this.processHeavyLoad){
				console.log('process has become overloaded!!');
				this.processHeavyLoad = true;
				this.connectOff();
				this.radiationTimer = setInterval(function(e, ev){self.checkPerformance(ev);}, this.radiateTime, ev);
				// console.log(pf - this.performanceValue, this.refreshRate * 4);
			}
			this.recoverCount = 0;
		}else{
			if(this.processHeavyLoad && this.recoverCount++ > this.frameRate){
				this.recoverCount = 0;
				console.log('process has recovered...');
				this.connectOn();
				clearInterval(this.radiationTimer);
				this.processHeavyLoad = false;
			}
		}
		this.performanceValue = pf;
		if(this.processHeavyLoad){return false;}
		
		return true;
	},
	
	clearBuffer: function(ev)
	{
		var i
			, data = ev.outputBuffer.getChannelData(0)
			, dlen = ev.outputBuffer.length, clen = parent.channel.length
			;
		for(i = 0; i < dlen; i++){
			data[i] = 0;
		}
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
		try{
		if(this.channel[ch].refChannel >= 0){
			ch = refEnable ? this.channel[ch].refChannel : ch;
		}
		return this.channel[ch].tuneParams[key];
		}catch(e){
			console.log(ch);
		}

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
		return this.channel[ch].envelopes;
		// return this.channel[ch].envelopes(this.minClock);
	},
	
	setSetChannelEvent: function(func){
		this.setChannelEventFunc = func;
	},
	setChannel: function(ch, key, value)
	{
		var channel = this.channel[ch];
		if(value > AudioChannel.maxTune(key)){
			value = AudioChannel.minTune(key);
		}else if(value < AudioChannel.minTune(key)){
			value = AudioChannel.maxTune(key);
		}
		channel.tune(key, value);
		channel.refreshEnvelopeParams(this.minClock);
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
		, wavLen, vibLen, sweepLen, sumLen
		, channel = this.channel[channelNum]
		, data = channel.data
		, vib = this.getVibratos(channelNum, true)
		, vibDist = AudioChannel.tuneParamsProp.vibratodepth.max - AudioChannel.tuneParamsProp.vibratodepth.min
		, lenDist
		, vibriseClock = channel.vibratoClock - vib.vibratorise
		, sweep = this.getChannel(channelNum, 'sweep', true)
		, enable = channel.isEnable()
		// , detune = this.getChannel(channelNum, 'detune', true)
		, detuneDiv = 4
		, prop = AudioChannel.tuneParamsProp
		;

		//立ち上がり
		if(channel.envelopeStart && channel.envelopeClock == 0 && !channel.envelopeEnd && enable){
			channel.trigRize();
		}
		//立ち下がり
		else if(this.isFinishEnvelope(channelNum, true) && !channel.envelopeEnd && enable){
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
		// lenDist = wavLen;
		phase = vib.vibratophase * 180 / vibDist;
		vibLen = vibriseClock < 0 || vib.vibratospeed == 0 ? 0 : (wavLen * (vib.vibratodepth) / vibDist)
		 			* Math.sin((vibriseClock + phase) * (Math.PI / 180) * 180 / vib.vibratospeed);
		// sumLen = sweepLen + vibLen;
		channel.waveLength = (wavLen + sweepLen + vibLen) | 0;
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
			
			case 12: noiseWave(channel, 1, true); break;
			case 13: noiseWave(channel, 6, true); break;
			case 14: noiseWave(channel, 31, true); break;
			case 15: noiseWave(channel, 69, true); break;
		}

		if(!channel.envelopeEnd && channel.envelopeStart){
			channel.envelopeClock++;
			channel.detuneClock++;
			channel.sweepClock++;
			channel.vibratoClock++;
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
		channel.vibratoClock = 0;
		channel.dataUpdateFlag = true;
		channel.resetEnvelope();
		
		
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
			, envelopes = channel.envelopes
		;
		// channel.envelopeClock = (envelopes.attack + envelopes.decay) | 0;
		channel.envelopeClock = (envelopes.attack + envelopes.decay) | 0;
		channel.envelopeClock += 0.1; //立ち上がり調整防止
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
		channel.envelopeClock += 0.1; //立ち上がり調整防止
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
		if(!this.channel[ch].isEnable()){return 0;}
		// printDebug(ch);
		var i
		, channel = this.channel[ch]
		, vol = (1 / 2) / channel.WAVE_VOLUME_RESOLUTION  // +1 / -1 
		, clock = channel.envelopeClock
		, env = this.getEnvelopes(ch, true)
		, sLevel = env.sustain
		, svol = vol * sLevel
		;
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

var TITLE_MAXLENGTH = 32;
var litroPlayerInstance = null;
/**
 * 再生
 */
function LitroPlayer(){return;};
LitroPlayer.prototype = {
	init: function(name)
	{
		// litroPlayerInstance = this;
		
		// this.noteData = []; //note data
		this.playPack = new LitroPlayPack(); //複数のファイルを入れておく連続再生用？
		this.playPack.init(this);
		this.noteSeekTime= 0; //note をセットする位置
		this.playSoundFlag = false;
		this.litroSound = litroSoundInstance;
		this.litroSound.appendPlayer(name, this);
		this.systemTime = 0;
		this.VOLUME_INC = 0.1;
		
		this.eventsetData = []; //ControllChangeともいう
		this.delayEventset = [];
		this.fileUserName = 'guest_user_';
		this.playerAccount = 'guest_user_';
		this.sound_id = null;
		this.user_id = null;
		this.title = '';
		
		this.serverFileList = {};
		
		//parserParams
		//v0.03:-値対応
		//v0.01.00:タグ付き
		this.fversion = '00.01.00';
		this.titleCodes = [];
		this.titleMaxLength = TITLE_MAXLENGTH;
		this.fileUserName = 'guest_user_';
		this.playerAccount = 'guest_user_';
		this.FORMAT_LAVEL = 'litrosoundformat';
		this.fileOtherInfo = 'xxxxxxxxxxxxxxxx';
		this.dataHeaderDelimiter = '[datachunk]';
		this.headerParamDelimiters = {title: '[title]', playerAccount: '[auth]', fversion: '[version]'};
		this.HEADER_TITLELENGTH = this.titleMaxLength;
		this.DATA_LENGTH16 = {ch:2, type:2, timeval:4, time:6, value:2};
		this.DATA_LENGTH36 = {ch:1, type:2, timeval:3, time:4, value:2};
		this.CHARCODE_LENGTH16 = 8;//4byte
		this.CHARCODE_LENGTH36 = 6;//3byte
		this.CHARCODE_MODE = 36;		
		this.headerParams = {};
		
		// this.timeOutEvent = {};
		this.timeOutCC = [];
		this.eventsetKeyIndex = {};

		// this.HEADER_LENGTH = 64;
		if(window.location.href.indexOf('localhost') >= 0){
			this.SERVER_URL = 'http://localhost:58104/api';
		}else{
			this.SERVER_URL = 'http://bitchunk.fam.cx/litrosound/api';
		}
		initAPIServer(this.SERVER_URL);
		// this.COMMON_TUNE_CH = this.litroSound.channel.length;
		this.COMMON_TUNE_CH = 0;
		
		this.clearEventsData();
		
		var i;
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
	 
// 	 TODO headerObjectをつくる
	headerInfo: function()
	{
		// this.fileUserName = this.fileUserName.substr(0, 11);
		var title = this.str5bit(this.titleCodes.length > 0 ? this.titleCodes : this.title);
		// if(info.length < this.HEADER_TITLELENGTH){
			// info = 'xxxxxxxxxxxxxxxx'.substr(0, this.HEADER_TITLELENGTH - info.length) + info;
		// }
		// this.fileOtherInfo = info.substr(0, this.HEADER_TITLELENGTH);
		// return this.FORMAT_LAVEL + 'version-' + this.fversion + 'auth_' + this.fileUserName + this.fileOtherInfo;
		return this.FORMAT_LAVEL + '[version]' + this.fversion + '[auth]' + this.playerAccount + '[title]' + title + this.dataHeaderDelimiter;
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
	
	dataToString: function(edat)
	{
		// AudioChannel.tuneParamsID
		var str = ''
			, ch, time, type, chstr, timeDats, typeDatsNum
			, typestr
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
	
	parseHeaderStr: function(str)
	{
		// '[version]' '[auth]' '[title]' 
		var start, len, deli;
		for(key in this.headerParamDelimiters){
			deli = this.headerParamDelimiters[key];
			start = str.lastIndexOf(deli) + deli.length;
			len = str.indexOf('[', start) - start;
			this.headerParams[key] = len < 0 ? '' : str.substr(start, len);
		// console.log(start, len, this);
		}
	},
	
	parseDataStr: function(data)
	{
		var dlen
			, mode = this.CHARCODE_MODE
			, datLen = this.DATA_LENGTH36
			, rlen = 0, res = '', tvalLen = 0
			, idKey = AudioChannel.tuneParamsIDKey()
			, minLen = datLen.ch + datLen.type + datLen.timeval
			, delim = this.dataHeaderDelimiter, headerParams = {}
			, eventsetData = makeEventsetData();
		;
		// data = data.substr(this.HEADER_LENGTH);
		headerParams = this.parseHeaderStr(data.substr(0, data.lastIndexOf(delim)));
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
			// console.log('ch: ' + ch, 'type: ' + type, 'tvalLen: ' + tvalLen, 'tval: ' + tval);
			if(eventsetData[ch] == null){
				eventsetData[ch] = {};
			}
			eventsetData[ch][type] = tval;
			// this.eventsetData[ch][type] = tval;
			// console.log(this.eventsetData[ch]);
		}
		
		return eventsetData;
	},
	clearEventsData: function()
	{
		this.eventsetData = makeEventsetData();
		this.delayEventset = makeEventsetData(); 
		this.noteSeekTime= 0; //note をセットする位置
		
	},
	
	saveToCookie: function(data)
	{
		document.cookie = 'd=' + encodeURIComponent(data) + ";expires=Tue, 31-Dec-2030 23:59:59;";
	},
	
	// saveToServer: function(params, func, errorFunc)
	saveToServer: function(user_id, sound_id, dataObj, func, errorFunc)
	{
		var data = encodeURIComponent(this.headerInfo() + this.dataToString(dataObj))
			, params = {user_id: user_id, sound_id: sound_id, data: data, title: this.title};
		
		func = func == null ? function(){return;} : func;
		errorFunc = errorFunc == null ? function(){return;} : errorFunc;
		if(params.sound_id == 0){
			//insert needs sound_id:0
			sendToAPIServer('POST', 'fileinsert', params, func, errorFunc);
		}else{
			//update needs sound_id > 0
			sendToAPIServer('POST', 'fileupdate', params, func, errorFunc);
		}
	},
	
	loadFromCookie: function()
	{
		var cookies = document.cookie.split('; ')
			, i, dic, str, data
		;
		this.clearEventsData();//初期化
		for(i = 0; i < cookies.length; i++){
			dic = cookies[i].split('=');
			if(dic[1] != null && dic[1].indexOf(this.FORMAT_LAVEL) >= 0){
				break;
			}
		}
		data = this.parseDataStr(decodeURIComponent(dic[1]));
		return data;
	},
	
	loadFromServer: function(user_id, sound_id, func, errorFunc)
	{
		var self = this
			, params = {user_id: user_id, sound_id: sound_id}
			// , user_name = this.fileUserName
		;
		// console.log('save ok', data, data.length);
		if(sound_id == 0){
			errorFunc({error_code: 0, message: 'no file'});
			return false;
		}
		func = func == null ? function(){return;} : func;
		errorFunc = errorFunc == null ? function(){return;} : errorFunc;
		
		sendToAPIServer('GET', 'fileload', params, function(data){
			var sound = {};
			if(data == null || data == false){
				errorFunc(data);
			}
			
			sound.data = data.data == null ? [] : data.data;
			sound.title = data.title == null ? '' : data.title;
			sound.user_name = data.user_name == null ? '' : data.user_name;
			sound.user_id = data.user_id == null ? 0 : data.user_id;
			sound.sound_id = data.sound_id == null ? 0 : data.sound_id;
			
			// self.dataPacks[self.NONPACK_NAME] = {};
			// self.dataPacks[self.NONPACK_NAME][sound.title] = sound;
			
			func(sound);
		}, errorFunc);
	},
	
	listFromServer: function(user_id, page, limit, func, errorFunc)
	{
		var params = {page: page, limit: limit, user_id: user_id}
			, self = this;
		func = func == null ? function(){return;} : func;
		errorFunc = errorFunc == null ? function(){return;} : errorFunc;
		sendToAPIServer('GET', 'filelist', params, function(data){
			var i;
			if(data == null || data.error_code != null){
				errorFunc(data);
				return;
			}
			// append = append.length == null ? [append] : append;
			//取得ファイルでリストを更新
			for(i = 0; i < data.length; i++){
				self.serverFileList[data[i].sound_id] = data[i];
			}
			func(self.serverFileList);
		}, errorFunc);
	},
	
	packListFromServer: function(user_id, page, limit, func, errorFunc)
	{
		this.playPack.listFromServer(user_id, page, limit, func, errorFunc);
	},
	
	setPlayData: function(data)
	{
		this.clearEventsData();
		this.eventsetData = this.parseDataStr(decodeURIComponent(data.data));
		this.title = data.title == null ? '' : data.title;
		this.fileUserName = data.user_name == null ? '' : data.user_name;
		this.user_id = data.user_id == null ? 0 : data.user_id;
		this.sound_id = data.sound_id == null ? 0 : data.sound_id;
		return true;
	},
	
	//パースしたデータが入る
	insertPack: function(pack)
	{
		var title, playdata;
		for(title in pack){
			playdata = pack[title];
			// playdata = 
		}
		this.playPack = pack;
	},
	
	setPlayDataFromPackForKey: function(packName, indexKey)
	{
		var key = typeof indexKey == 'String' ? indexKey : Object.keys(this.playPack.packData[packName])[indexkey];
		if(key == null){
			return false;
		}
		return this.setPlayData(this.playPack.packData[packName][key]);
	},
	
	// loadFromServer: function(user_id, sound_id, func, errorFunc)
	// {
		// var self = this;
		// this.playPack.loadFromServer(user_id, sound_id, function(data){
			// self.setPlayData(data);
			// func(data);
		// }, errorFunc);
	// },
	
	fileList: function(list)
	{
		this.serverFileList = list == null ? this.serverFileList : list;
		return this.serverFileList;
	},

	isPlay: function()
	{
		return this.playSoundFlag;
	},
	
	playForKey: function(index_title)
	{
		var key = typeof index_title == 'String' ? index_title : Object.keys(this.pack)[index_title];
		this.eventsetData = this.dataPack[key];
		this.play();//
	},
	
	play: function()
	{
		this.systemTime = performance.now();
		this.playSoundFlag = true;
		this.delayEventset = makeEventsetData();
		for(var i = 0; i < litroSoundInstance.channel.length; i++){
			litroSoundInstance.channel[i].refChannel = litroSoundInstance.channel[i].id;
		}
		litroSoundInstance.connectOff();
		litroSoundInstance.connectOn();
	},
	
	stop: function(toggle)
	{
		this.systemTime = performance.now();
		this.playSoundFlag = false;
		this.delayEventset = makeEventsetData();
	},
	
	volume: function(vol)
	{
		var sTime, gain = this.litroSound.gain.gain;
		if(vol != null){
			vol = vol < 0 ? 0 : vol;
			sTime = this.litroSound.context.currentTime;
			gain.cancelScheduledValues(sTime);
			gain.setValueAtTime(gain.value, sTime);
			gain.setTargetAtTime(vol, sTime, 0);
		}else{
			vol = gain.value;
		}
		
		return vol;
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
				case tuneProp['return'].id: this.seekMoveBack(-1), this.seekMoveForward(this.commonEventTime('restart')); this.delayEventset = makeEventsetData(); this.restartEvent(); return true;
				case tuneProp.noteoff.id: litroSoundInstance.fadeOutNote(ch, ch); break;
				case tuneProp.noteextend.id: litroSoundInstance.extendNote(ch, ch); break;
			}
		}else{
			litroSoundInstance.setChannel(ch, type, value);
		}
		return false;
	},
	
	scanEdata: function(ch, edata)
	{
		var seekTime = this.noteSeekTime, looped = false
			, sort = AudioChannel.sortParam, slen = sort.length, typeBlock, data
			, type, i
			, delay = litroSoundInstance.getChannel(ch, 'delay', true) * 10;
		;
		for(i = 0; i < slen; i++){
			type = sort[i];
			typeBlock = edata[ch][type];
			if(typeBlock[seekTime] == null){continue;}
			data = typeBlock[seekTime];
			if(delay > 0){
				this.soundEventDelayPush(ch, delay, delay + data.time, type, data.value);
			}else{
				looped |= this.soundEventPush(ch, type, data.value);
			}
			
		}
		return looped;
	},
	scanDelayedEdata: function(ch, dData)
	{
		var seekTime = this.noteSeekTime, looped = false
			, sort = AudioChannel.sortParam, slen = sort.length, typeBlock, data
			, type, i
		;
		for(i = 0; i < slen; i++){
			type = sort[i];
			typeBlock = dData[ch][type];
			if(typeBlock[seekTime] == null){continue;}
			data = typeBlock[seekTime];
			looped |= this.soundEventPush(ch, type, data.value);
		}
		
		return looped;
	},
	//bufferProcess任せ
	playSound: function()
	{
		// console.log(this.playSoundFlag);
		if(!this.playSoundFlag){return;}
		var t, ch, s
			, data, delay
			, now = performance.now()
			, perFrameTime = 1
			, eData = this.eventsetData, typeBlock, clen = eData.length
			, dData = this.delayEventset
			, looped = false
		;
		for(t = 0; t < perFrameTime; t++){
			for(ch = 0; ch < clen; ch++){
				looped |= this.scanEdata(ch, eData);
			}
			for(ch = 0; ch < clen; ch++){
				looped |= this.scanDelayedEdata(ch, dData);
			}
			if(!looped){
				this.seekMoveForward(1);
			}else{
				console.log('looped');
			}
		}

		this.systemTime = now;
		
	},
	
	soundEventDelayPush: function(ch, time, time_id, type, value)
	{
		// this.delayEventset[ch] = this.delayEventset[ch] == null ? {} : this.delayEventset[ch];
		// this.delayEventset[ch][type] = this.delayEventset[ch][type] == null ? {} : this.delayEventset[ch][type];
		this.delayEventset[ch][type][time_id | 0] = {time: time | 0, ch: ch, type: type, value: value};
	},
	
	getEventsFromTime: function(ch, time, filter)
	{
		var type, types = {}, res = {}, set = false, tindex;
		filter = filter == null ? AudioChannel.sortParam : this.typesArray(filter);
		// for(tindex = 0; tindex < filter.length; tindex++){
		filter.forEach(function(type, tindex){
			type = filter[tindex];
			if(this.eventsetData[ch] != null && this.eventsetData[ch][type] != null && this.eventsetData[ch][type][time] != null){
				res[type] = this.eventsetData[ch][type][time];
			}
		}, this);
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
		, timedStack = [], timedEvents, typedEvents, ev
		;
		types.forEach(function(type, tindex){
			typedEvents = Object.keys(this.eventsetData[ch][type]);
			typedEvents.forEach(function(t, i, ev){
				// if(ev[t] != null){
					events[t] = events[t] == null ? {} : events[t];
					events[t][type] = this.eventsetData[ch][type][t];
					// events[t] = this.eventsetData[ch][type][t];
				// }
			}, this);
			return events;
		}, this);
		
		timedEvents = Object.keys(events);
		timedEvents.forEach(function(t){
			types = Object.keys(events[t]);
			types.forEach(function(type, i, ev){
				timedStack.push(events[t][type]);
			}, this);
		}, this);

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
// console.log(events, start);

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

function makeEventsetData(channels){
	var eventset = [], type, ch, addEtc = 0
	;
	channels = channels == null ? litroSoundInstance.channel.length : channels;
	for(ch = 0; ch < channels + addEtc; ch++){
		// this.noteData.push({});
		eventset.push({});
		eventset[ch].note = {};
		for(i = 0; i < AudioChannel.sortParam.length; i++){
			eventset[ch][AudioChannel.sortParam[i]] = {};
		}
	}
	return eventset;
};


function LitroPlayPack(){return;};
LitroPlayPack.prototype = {
	init: function()
	{
		this.packList = [];
		this.parseFiles = {};
		// this.litroSound = litroSoundInstance;
		
		this.NONPACK_NAME = ' NO-PACK ';

	},
	
	listFromServer: function(user_id, page, limit, func, errorFunc)
	{
		var params = {page: page, limit: limit, user_id: user_id}
			, self = this;
		func = func == null ? function(){return;} : func;
		errorFunc = errorFunc == null ? function(){return;} : errorFunc;
		sendToAPIServer('GET', 'packlist', params, function(data){
			var i;
			if(data == null || data.error_code != null){
				errorFunc(data);
				return;
			}
			//取得ファイルでリストを更新
			for(i = 0; i < data.length; i++){
				self.packList[data[i].sound_id] = data[i];
			}
			func(self.serverFileList);
		}, errorFunc);
	},
	
	loadSoundPackage: function(user_id, pack_id, func, errorFunc)
	{
		var self = this
			, params = {user_id: user_id, pack_id: pack_id}
		;
		if(user_id == 0){
			errorFunc({error_code: 0, message: 'no user_id'});
			return;
		}
		if(packName == null){
			errorFunc({error_code: 0, message: 'no Package Name'});
			return;
		}
		func = func == null ? function(){return;} : func;
		errorFunc = errorFunc == null ? function(){return;} : errorFunc;
		
		//data : {sound_id, ?}
		sendToAPIServer('GET', 'packload', params, function(data){
			var i;
			if(data == null || data == false){
				errorFunc(data);
			}
			
			self.packList[packName] = {};
			for(i = 0; i < data.length; i++){
				self.packList[packName][data[i].title] = data[i];
			}
			
			func(self.packList[packName]);
			}, errorFunc);
	},
	
};

//TODO parserを作る？
function litroSoundParser(){return;};


var APIServer = {url: null};
function initAPIServer(apiUrl)
{
	APIServer.url = apiUrl;
};

function sendToAPIServer(method, api, params, func, errorFunc)
{
	var query = [], key, x = new XMLHttpRequest();
	if(APIServer.url == null){console.error('not initialize api server'); return;}
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
		x.open(method, APIServer.url + '/' + api + '?' + str , true);
		str = "";
	}else{
		x.open(method, APIServer.url + '/' + api, true);
	}
	x.withCredentials = true;
	x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
	// Set-Cookie:LITROSOUND=8lr6fpmr30focapfnejn807mo5;
	x.send(str);
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
		this.envelopes = {};
		this.refreshEnvelopeParams(1);
		
	},
	
	tune: function(name, param)
	{
		var p = this.tuneParams;
		return p[name] = (param == null) ? p[name] : param;
	},
	//高速化のためエンベロープオブジェクトをつくっとく
	refreshEnvelopeParams: function(clockRate)
	{
		var p = this.tuneParams;
		this.envelopes = {attack: p.attack * clockRate, decay: p.decay * clockRate, length: p. length * clockRate, release: p.release * clockRate, sustain: p.sustain, volumeLevel: p.volumeLevel};
	},
	
	// envelopes: function(clockRate)
	// {
		// var p = this.tuneParams;
		// clockRate == null ? 1 : clockRate;
		// return {attack: p.attack * clockRate, decay: p.decay * clockRate, length: p. length * clockRate, release: p.release * clockRate, sustain: p.sustain, volumeLevel: p.volumeLevel};
	// },
	
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
		var i, data, a;
		data = new Float32Array(datasize);
		for(i = 0; i < datasize; i++){
			data[i] = 0;
		}
		return data;
	},
	
	getDetunePosition: function()
	{
		if(this.tuneParams.detune == 0){return 0;}
		return ((this.detuneClock * this.tuneParams.detune * 0.1) | 0) % this.waveLength;
	},
	
	isNoiseType: function()
	{
		var type = this.tuneParams.waveType;
		return type > 11 && type < 16;
	},
	
	isEnable: function()
	{
		return this.tuneParams.enable == 1;
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
		var clock = this.envelopeClock, env = this.envelopes
		;
		if(clock >= env.attack + env.decay + env.length + env.release){
			return true;
		}
		return false;
	},
	
	nextWave: function(){
		if(this.waveLength == 0){return 0;}
		var vol, avol
		, wpos = this.waveClockPosition, wlen = this.waveLength
		, detune = this.getDetunePosition()
		;

		// if(wpos == 0 && this.isNoiseType()){
		if(wpos == 0){
			switch(this.tuneParams.waveType){
				case 12: noiseWave(this, 1); break;
				case 13: noiseWave(this, 6); break;
				case 14: noiseWave(this, 31); break;
				case 15: noiseWave(this, 69); break;
			}
		}
		vol = this.data[(wlen + wpos + detune) % wlen];
		if(this.envelopeEnd == true){
			//クリック音防止余韻
			avol = this.absorbVolume * Math.exp(-0.001 * this.absorbCount++);
			return vol + avol;
		}else if(this.envelopeStart == true){
			avol = -this.absorbVolume * Math.exp(-0.001 * this.absorbNegCount++);
		}else{
			avol = 0;
			return avol;
		}
		this.waveClockPosition = wpos + 1 < wlen ? wpos + 1 : 0;
		return vol + avol;
	},
	
};

function noiseWave(channel, type, shift)
{
	var i = 0
		, vol = litroSoundInstance.envelopedVolume(channel.id)
		, freq = channel.frequency
		, p = channel.noiseParam
		, clock = p.clock, reg = p.reg, pvol = p.volume
		, len = channel.waveLength, hlen = ((len - TOP_FREQ_LENGTH) / 2) | 0
		, data = channel.data
		;
	if(vol <= 0){vol = 0;}
		
	//p.shortType = type; //短周期タイプ

	for(i = channel.waveClockPosition; i < len; i++){
		if(clock++ >= hlen){
			reg >>= 1;
			reg |= ((reg ^ (reg >> type)) & 1) << 15;
			pvol =  ((reg & 1) * vol * 2.0) - vol;
			clock = 0;
		}
		data[i] = pvol;
	}
	p.reg = reg; p.clock = clock; p.volume = pvol;
	p.halfLength = hlen;
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
		, data = channel.data, len = channel.waveLength, plen = channel.prevLength
		;
	
	if(vol <= 0){vol = 0;}
	switchPos = ((len / (widthRate_l + widthRate_r)) * widthRate_l); // half wave length
	stairLen = switchPos / wResolute; //1cell length
	for(i = 0; i < wResolute; i++){
		stairPos += stairLen;
		wavePhase.push(stairPos);
	}
	triPhase.push(stairPos);
	
	switchPos = len - switchPos;
	stairLen = switchPos / wResolute;
	for(i = 0; i < wResolute; i++){
		stairPos += stairLen;
		wavePhase.push(stairPos);
	}	
	triPhase.push(stairPos);
	vol = 0;
	// stairHeight = 1;
	for(i = 0; i < len; i++){
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
		data[i] = vol;
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
		, data = channel.data, len = channel.waveLength, plen = channel.prevLength
		;
	
	if(vol <= 0){vol = 0;}
	switchPos = ((len / (widthRate_l + widthRate_r)) * widthRate_l); // half wave length
	stairLen = switchPos / wResolute; //1cell length
	for(i = 0; i < wResolute; i++){
		stairPos += stairLen;
		wavePhase.push(stairPos);
		if(i > 0 && i % vResolute == 0){
			triPhase.push(stairPos);
		}
	}
	triPhase.push(stairPos);
	
	switchPos = len - switchPos;
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
	for(i = 0; i < len; i++){
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
		data[i] = vol;
	}
}

function pulseWave(channel, widthRate_l, widthRate_r)
{
	var i
		, switchPos
		, vol = litroSoundInstance.envelopedVolume(channel.id)
		, data = channel.data, len = channel.waveLength, plen = channel.prevLength
		;
	
	if(vol < 0){vol = 0;}
	switchPos = ((len / (widthRate_l + widthRate_r)) * widthRate_l) | 0;
	for(i = 0; i < len; i++){
		if(i < switchPos){
			data[i] = vol;
		}else{
			data[i] = -vol;
		}
	}
	for(i; i < plen; i++){
		data[i] = 0;
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
	// litroSoundInstance.checkPerformance();
	// var ch;
	// for(ch = 0; ch < CHANNELS; ch++){
		// litroSoundInstance.refreshWave(ch);
	// }
	// if(litroSoundInstance.channel != null){
		// printDebug(litroSoundInstance.channel[0].waveClockPosition, 1);
		// printDebug(litroSoundInstance.channel[0].absorbPosition, 0);
		// , this.waveClockPosition, this.absorbPosition
	// }
	// litroPlayerInstance.playSound();
};


