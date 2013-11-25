/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */

var SAMPLE_RATE = 48000;
// var SAMPLE_RATE = 144000;
var MASTER_BUFFER_SIZE = 24000;
var PROCESS_BUFFER_SIZE = 512;
// var CHANNEL_BUFFER_SIZE = 48000;
var BUFFER_FRAMES = 60;
// var BUFFERS = 2;
var CHANNELS = 4;
var litroAudio = null;
var VOLUME_TEST = 0.08;
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
			channel.init(size);
			this.channel[i] = channel;
		}
		return;
		
		for(i = 0; i < this.channel.length; i++){
			channel = new AudioChannel();
			// モノラル・sampleRate・サンプル数でAudioBufferを作成
			channel.buffer = context.createScriptProcesser(1, rate, size);
			// AudioSourceを作成
			channel.bufferSource = context.createBufferSource();
			
			// AudioSourceに作成した音声データを設定
			channel.bufferSource.buffer = channel.buffer;
			
			// 出力先を設定
			channel.bufferSource.connect(context.destination);

			//ループON
			channel.bufferSource.loop = true;
			channel.bufferSource.start(0);

			this.channel[i] = channel;

		}

		// data = this.channelBuffer.getChannelData(0);//monoral
		
	},
	
	bufferProcess: function(ev)
	{
		var parent = LitroSoundGlobal
			, i
			, data = ev.outputBuffer.getChannelData(0);
			// console.log(parent.channel[0]);
		for(i = 0; i < data.length; i++){
			data[i] = parent.channel[0].nextWave();
			for(c = 1; c < parent.channel.length; c++){
				data[i] += parent.channel[c].nextWave();
			}
		}
		// console.log(parent.channel[0]);
	},
	
	setFrequency: function(channel, freq){
		var half, i, pulseLength, data;
		data = this.channel[channel].data;
		
		if(freq == 0){
			for(i = 0; i < data.length; i++){
				data[i] = 0;
			}
			// this.channel[0].waveLength = 0;
			return;
		}
		pulseLength = ((this.context.sampleRate / freq)) | 0;
		half = (pulseLength / 2) | 0;

		for(i = 0; i < pulseLength; i++){
			if(i % pulseLength < half){
				data[i] = VOLUME_TEST;
			}else{
				data[i] = -VOLUME_TEST;
			}
		}
		this.channel[channel].waveLength = pulseLength;

	},
	

	setSampleRate_b: function(rate, size){
		var i, channel, context;
		context = this.context;
		context.sampleRate = rate;
		for(i = 0; i < this.channel.length; i++){
			channel = new AudioChannel();
			// モノラル・sampleRate・サンプル数でAudioBufferを作成
			channel.buffer = context.createBuffer(1, rate, size);
			// AudioSourceを作成
			channel.bufferSource = context.createBufferSource();
			
			// AudioSourceに作成した音声データを設定
			channel.bufferSource.buffer = channel.buffer;
			
			// 出力先を設定
			channel.bufferSource.connect(context.destination);

			//ループON
			channel.bufferSource.loop = true;
			channel.bufferSource.start(0);

			this.channel[i] = channel;

		}

		// data = this.channelBuffer.getChannelData(0);//monoral
		
	},
	setFrequency_b: function(freq){
		var half, i, pulseLength, data;
		data = this.channel[0].buffer.getChannelData(0);
		
		if(freq == 0){
			for(i = 0; i < data.length; i++){
				data[i] = 0.0000001;
			}
			return;
		}
		pulseLength = ((this.context.sampleRate / freq)) | 0;
		half = (pulseLength / 2) | 0;

		for(i = 0; i < data.length; i++){
			if(i % pulseLength < half){
				data[i] = VOLUME_TEST;
			}else{
				data[i] = -VOLUME_TEST;
			}
		}
	},
	
	onNoteFromCode: function(channel, codenum, octave)
	{
		// console.log(codenum + ' ' + octave);
		var freq = this.freqByOctaveCodeNum(octave, codenum);
		// console.log(freq);
		this.setFrequency(channel, freq);
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
	},
	
	noteOn: function(channel){
		this.channel[channel].bufferSource.start(0);
	},
	
	noteoff: function(channel){
		this.channel[channel].bufferSource.stop(0);
	},
	
	changeWave: function(){
		// console.log(this.channel);
		var i, data = this.channel[0].buffer.getChannelData(0);
		if(this.mode == 0){
			for ( i = 0; i < data.length; i++) {
				if ((i % 100) < 50) {
					data[i] = 0.02;
				} else {
					data[i] = -0.02;
				}
			}
		}else if(this.mode == 1){
			for ( i = 0; i < data.length; i++) {
				if ((i % 100) < 30) {
					data[i] = 0.02;
				} else {
					data[i] = -0.02;
				}
			}
		}else if(this.mode == 2){
			for ( i = 0; i < data.length; i++) {
				if ((i % 100) < 20) {
					data[i] = 0.02;
				} else {
					data[i] = -0.02;
				}
			}
		}else{
			for ( i = 0; i < data.length; i++) {
				data[i] = 0.00;
			}
			
		}
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
	init:function(datasize){
		// console.log(this.data);
		this.bufferSource = null;
		this.buffer = null;
		this.waveLength = 0;
		this.waveClockPosition = 0;
		this.data = this.allocBuffer(datasize);
	},
	
	allocBuffer: function(datasize){
		var i, data;
		data = [];
		for(i = 0; i < datasize; i++){
			data.push(0);
		}
		return data;
	},
	
	nextWave: function(){
		if(this.waveLength == 0){
			return 0;
		}
		var d = this.data[this.waveClockPosition];
		this.waveClockPosition = (this.waveClockPosition + 1) % this.waveLength;
		return d;
	},
	
};


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
	
};


