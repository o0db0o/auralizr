;(function(){

function auralizr() {
	var self = this;

	this.isMicEnabled = false;
	this.irArray = {};
	this.startRequest = false;

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	this.audioContext = new AudioContext();
	this.convolver = this.audioContext.createConvolver();

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	navigator.getUserMedia( {audio:true}, function (stream) {
		self.isMicEnabled = true;
		var mediaStreamSource = self.audioContext.createMediaStreamSource( stream );
		mediaStreamSource.connect(self.convolver);
		if (self.startRequest){
			self.start();
		}
	} );
}

auralizr.prototype.load= function(irURL, key, callback) {
	var self = this;

	var ir_request = new XMLHttpRequest();
	ir_request.open("GET", irURL, true);
	ir_request.responseType = "arraybuffer";
	ir_request.onload = function () {
		self.irArray[key] = self.audioContext.createBuffer(ir_request.response, false);
		callback(key);
	};
	ir_request.send();
};

auralizr.prototype.isReady= function(key) {
	return this.isMicEnabled && this.irArray.hasOwnProperty(key) && this.irArray[key] !== undefined;
};

auralizr.prototype.use= function(key) {
	if ( this.irArray.hasOwnProperty(key) && this.irArray[key] !== undefined)
		this.convolver.buffer = this.irArray[key];
};

auralizr.prototype.start= function() {
	this.startRequest = true;
	if (this.isMicEnabled && this.convolver.buffer !== null){
		console.log("Starting auralizr");
		this.convolver.connect(this.audioContext.destination);
		this.startRequest = false;
	}
	else
		console.log("Couldn't start the auralizr");
};

auralizr.prototype.stop= function() {
	this.startRequest = false;
	console.log("Stopping auralizr");
	this.convolver.disconnect();
};


/**
   * Expose `auralizr`.
   */

  if ('undefined' == typeof module) {
    window.auralizr = auralizr;
  } else {
    module.exports = auralizr;
  }

})();



/*var convolver;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

// success callback when requesting audio input stream
function gotStream(stream) {
	// Create an AudioNode from the stream.
	var mediaStreamSource = audioContext.createMediaStreamSource( stream );

	convolver = audioContext.createConvolver();
	mediaStreamSource.connect(convolver);

	var ir_request = new XMLHttpRequest();
	ir_request.open("GET", "https://dl.dropboxusercontent.com/u/77191118/church_ir.wav", true);
	ir_request.responseType = "arraybuffer";
	ir_request.onload = function () {
		console.log("Download complete");
		convolver.buffer = audioContext.createBuffer(ir_request.response, false);
		document.getElementById('button').style.display = "";
	};
	ir_request.send();
	console.log("Downloading...");
	// Connect it to the destination to hear yourauralizr (or any other node for processing!)
}


function buttonClicked(){
	var button = document.getElementById('button');

	if(button.innerHTML == '▶'){
		button.innerHTML = '❚❚';
		convolver.connect( audioContext.destination );
	}else if(button.innerHTML == '❚❚'){
		button.innerHTML = '▶';
		convolver.disconnect();
	}
}*/