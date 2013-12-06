/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */

var SAMPLE_RATE = 48000;
// var SAMPLE_RATE = 144000;
var MASTER_BUFFER_SIZE = 24000;
var PROCESS_BUFFER_SIZE = 1024;
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
	setSampleRate: function(rate, size){
		var i, channel, context, scriptProcess;
		context = this.context;
		context.sampleRate = rate;
		
		scriptProcess = context.createScriptProcessor(size, 1, 1);
		
		// scriptProcess = context.createScriptProcessor(null, 1, 1);
		scriptProcess.onaudioprocess = this.bufferProcess;
		scriptProcess.parent_audio = this;
		
		scriptProcess.connect(context.destination);
		
		for(i = 0; i < this.channel.length; i++){
			channel = new AudioChannel();
			channel.init(size, this.WAVE_VOLUME_RESOLUTION);
			this.channel[i] = channel;
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

			data[i] = (ch.nextWave() / parent.WAVE_VOLUME_RESOLUTION) * parent.masterVolume;
			for(c = 1; c < parent.channel.length; c++){
				ch = parent.channel[c];
				data[i] += (ch.nextWave() / parent.WAVE_VOLUME_RESOLUTION) * parent.masterVolume;
				
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
	
	setFrequency: function(channel, freq)
	{
		var pulseLength;
		this.channel[channel].frequency = freq;
		pulseLength = ((this.context.sampleRate / freq)) | 0;

		this.channel[channel].waveLength = pulseLength;
		
		// this.refreshWave(channel);
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
		, half = (pulseLength / 2) | 0
		, channel = this.channel[channelNum]
		, pulseLength = channel.waveLength
		, data = channel.data
		, freq = channel.frequency
		;
		
		if(freq == 0){
			for(i = 0; i < data.length; i++){
				// data[i] = 0.0000000001;
				data[i] = 0.0;
			}
			// this.channel[0].waveLength = 0;
			return;
		}

		switch(this.getChannel(channelNum, 'waveType')){
			case 0: pulseWave(channel, 1, 1); break;
			case 1: pulseWave(channel, 1, 2); break;
			case 2: pulseWave(channel, 1, 4); break;
			case 3: pulseWave(channel, 1, 2); break;
		}

		channel.envelopeClock++;

	},
	
	onNoteFromCode: function(channel, codenum, octave)
	{
		// console.log(codenum + ' ' + octave);
		var freq = this.freqByOctaveCodeNum(octave, codenum);
		// console.log(freq);
		this.channel.envelopeClock = 0;
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
		this.bufferSource = null;
		this.buffer = null;
		this.waveLength = 0;
		this.waveClockPosition = 0;
		this.envelopeClock = 0;
		this.data = this.allocBuffer(datasize);
		// this.waveType = 0;
		this.frequency = 1;
		this.WAVE_VOLUME_RESOLUTION = resolution;
		
		this.tuneParams = {
			volumeLevel:12,
			waveType:0,
			length:80,
			delay:0,
			sweep:0,
			attack:1,
			decay:8,
			sustain:10,
			release:32,
		};
		this.tuneParamsMax = {
			volumeLevel:15,
			waveType:3,
			length:255,
			delay:32,
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
			sweep:-32,
			attack:0,
			decay:0,
			sustain:0,
			release:0,
		};
		
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
	
	resetEnvelope: function()
	{
		this.envelopeClock = 0;
		// console.log(1);
	},
	
	nextWave: function(){
		if(this.waveLength == 0){
			return 0;
		}
		var d = this.data[this.waveClockPosition];
		this.waveClockPosition = (this.waveClockPosition + 1) % this.waveLength;
		// console.log(this.envelopeClock);
		return d;
	},
	
};
function phase(channel)
{
	var clock = channel.envelopeClock
	;
	clock -= channel.tune('attack');
	if(clock < 0){return 'a';}

	clock -= channel.tune('decay');
	if(clock < 0){return 'd';}

	clock -= channel.tune('length') - channel.tune('attack') - channel.tune('decay') - channel.tune('release');
	if(clock < 0){ return 's';}
	return 'r';

}
function pulseWave(channel, widthRate_l, widthRate_r)
{
	var i
		, half
		, switchPos
		, vLevel = channel.tune('volumeLevel')
		, vol = (channel.WAVE_VOLUME_RESOLUTION * (vLevel / channel.WAVE_VOLUME_RESOLUTION)) / 2
		, sLevel = channel.tune('sustain')
		, svol = (channel.WAVE_VOLUME_RESOLUTION * (sLevel / channel.WAVE_VOLUME_RESOLUTION)) / 2
		, dRelease = vLevel / (channel.tune('release') * 1000)
		, clock = channel.envelopeClock
		, d
		;
		
	switch(phase(channel)){
		case 'a': 
			d = vol / channel.tune('attack');
			vol = clock * d;
			break;
		case 'd': 
			clock -= channel.tune('attack');
			d = (vol - svol) / channel.tune('decay');
			vol -= clock * d;
			break;
		case 's': 
			clock -= channel.tune('attack') + channel.tune('decay');;
			vol = svol;
			break;
		case 'r': 
			clock -= channel.tune('length') - channel.tune('release') - ((channel.tune('attack') + channel.tune('decay')) );
			d = (svol) / channel.tune('release');
			vol = svol - (clock * d);
			break;
	}
	
	// console.log(fase(channel));
	
	if(vol < 0){vol = 0;}
	// if(vol == 0){return;}
	switchPos = ((channel.waveLength / (widthRate_l + widthRate_r)) * widthRate_l) | 0;
	for(i = 0; i < channel.waveLength; i++){
		if(i < switchPos){
			channel.data[i] = vol;
		}else{
			channel.data[i] = -vol;
		}
	}

}

var start = function() {
};

var change = function(){
	litroAudio.changeWave();
	// console.log(litroAudio.mode);
	litroAudio.mode = (litroAudio.mode + 1) % 4;
};

//call at 60fps
function litroSoundMain()
{
	var ch;
	for(ch = 0; ch < CHANNELS; ch++){
		LitroSoundGlobal.refreshWave(ch);
	}
};


