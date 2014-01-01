/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */

var SAMPLE_RATE = 48000;
// var SAMPLE_RATE = 144000;
// var MASTER_BUFFER_SIZE = 24000;
var MASTER_BUFFER_SIZE = 24000;
var PROCESS_BUFFER_SIZE = 1024;
// var PROCESS_BUFFER_SIZE = 2048;
// var CHANNEL_BUFFER_SIZE = 48000;
var BUFFER_FRAMES = 60;
// var BUFFERS = 2;
var CHANNELS = 8;
var litroAudio = null;
var VOLUME_TEST = 0.2;
var LitroSoundGlobal = null;


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
		LitroSoundGlobal = this;
		this.masterVolume = VOLUME_TEST;
		this.WAVE_VOLUME_RESOLUTION = 15; //波形データのボリューム分解能
		this.outputBuffer = [];
		this.isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? true : false;

		
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
	
	setSampleRate: function(rate, size){
		var i, channel, context, scriptProcess;
		context = this.context;
		context.sampleRate = rate;
		
		scriptProcess = context.createScriptProcessor(size, 1, 1);
		
		// scriptProcess = context.createScriptProcessor(null, 1, 1);
		scriptProcess.onaudioprocess = this.bufferProcess;
		scriptProcess.parent_audio = this;
		
		scriptProcess.connect(context.destination);
		
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
		var parent = LitroSoundGlobal
			, i
			, ch
			, data = ev.outputBuffer.getChannelData(0);
		for(i = 0; i < data.length; i++){
			ch = parent.channel[0];
			// if(ch.isRefreshClock()){
				// parent.refreshWave(0);
			// }
			ch.refreshClock++;
			
			data[i] = (ch.nextWave() / parent.WAVE_VOLUME_RESOLUTION) * parent.masterVolume;
			// data[i] = (ch.nextWave() / parent.WAVE_VOLUME_RESOLUTION) * parent.masterVolume;

			for(c = 1; c < parent.channel.length; c++){
				ch = parent.channel[c];
				data[i] += (ch.nextWave() / parent.WAVE_VOLUME_RESOLUTION) * parent.masterVolume;
				// if(ch.isRefreshClock()){
					// parent.refreshWave(c);
				// }
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
	
	setChannel: function(ch, key, value)
	{
		ch = this.channel[ch];
		if(value > ch.tuneParamsMax[key]){
			value = ch.tuneParamsMin[key];
		}else if(value < ch.tuneParamsMin[key]){
			value = ch.tuneParamsMax[key];
		}
		return ch.tuneParams[key] = value;
	},
	
	refreshWave: function (channelNum)
	{
		var i
		, channel = this.channel[channelNum]
		, data = channel.data
		, freq
		;
		// if(channel.frequency == 0){
		if(channel.isFinishEnverope()){
			for(i = 0; i < data.length; i++){
				// data[i] = 0.0000000001;
				data[i] = 0.0;
			}
			// this.channel[0].waveLength = 0;
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
		this.setFrequency(channel, freq);
		this.channel[channel].resetEnvelope();
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
	
	//	console.log(data);
	startBuffer : function() {
	},
};

function AudioChannel()
{
	return;
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
			length:40,
			delay:0,
			detune:0,
			sweep:0,
			attack:1,
			decay:8,
			sustain:10,
			release:32,
		};
		this.tuneParamsMax = {
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
		};
		this.tuneParamsMin = {
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
		};
		
	},
	tuneMax: function(name)
	{
		return this.tuneParamsMax[name];
	},
	tune: function(name, param)
	{
		var p = this.tuneParams;
		return p[name] = (param == null) ? p[name] : p[name] + param;
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
		if(this.waveLength == 0){
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
			, fluct
			// , type = this.getNoiseType()
		;
		this.waveClockPosition = (this.waveClockPosition + 1) % this.bufferSize;
		// p.clock = (p.clock + 1 ) % this.waveLength;
		// p.clock = (p.clock + 1 ) % p.halfLength;
		
		if(p.clock++ >= p.halfLength){
			// printDebug(p.halfLength);
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
		, vol = channel.WAVE_VOLUME_RESOLUTION / channel.WAVE_VOLUME_RESOLUTION / 2
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
		LitroSoundGlobal.refreshWave(ch);
	}
};


