var CC={init:function(){var a=this;$(function(){a.ui();a.midi();a.recorder()})},func:(function(){var a=this;return{triggerEvent:function(c,b){var c=new CustomEvent(c,{detail:b,bubbles:true,cancelable:true});a.dispatchEvent(c)},onEvent:function(b,c){a.addEventListener(b,function(d){c(d.detail)})},error:function(b){this.triggerEvent("cc-error",{msg:b})}}}()),registry:{}};CC.midi=function(){console.log("Initializing MIDI...");var a=null,b=null,h=this;window.AudioContext=window.AudioContext||window.webkitAudioContext;b=new AudioContext();if(navigator.requestMIDIAccess){navigator.requestMIDIAccess().then(e,g);console.log("%cMIDI Initialized!","color: green")}else{console.log("%cMIDI Initalization Failed","color: orange");this.func.error("No MIDI support present in your browser.")}function e(l){a=l;var k=false;var i=a.inputs.values();for(var j=i.next();j&&!j.done;j=i.next()){j.value.onmidimessage=f;k=true}if(!k){this.func.error("No MIDI Devices Present")}}function g(i){this.func.error(i)}function f(i){switch(i.data[0]&240){case 144:if(i.data[2]!=0){d(i.data[1]);return}case 128:c(i.data[1]);return}}function d(i){h.func.triggerEvent("noteOn",{noteNumber:i})}function c(i){h.func.triggerEvent("noteOff",{noteNumber:i})}};CC.recorder=function(){console.log("%cRecorder Initialized","color: green");var b=this,a=[];this.registry.recording=false;this.registry.recorded_notes=[];this.func.onEvent("noteOn",function(c){a.push(c.noteNumber)});this.func.onEvent("noteOff",function(c){if(b.registry.recording){b.registry.recorded_notes.push(a.slice())}a.splice(a.indexOf(c.noteNumber),1)});this.func.onEvent("startRecording",function(c){console.log("Recording Started...");b.registry.recording=true});this.func.onEvent("stopRecording",function(c){console.log("Recording Stopped.");b.registry.recording=false})};CC.ui=function(){var b=this,a={alert:function(e,c,f){c=c||"warning";f=f||false;var d='<div class="alert alert-'+c;if(f){d+=' alert-dismissable" role="alert">';d+='<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'}else{d+='" role="alert">'}d+=e;d+="</div>";return d}};this.func.onEvent("cc-error",function(c){$("#cc-alerts").append(a.alert(c.msg,"danger",true))});$(document).on("click","#cc-recordBtn",function(c){c.preventDefault();b.func.triggerEvent("startRecording");$(this).addClass("hidden");$("#cc-stopRecordBtn").removeClass("hidden")});$(document).on("click","#cc-stopRecordBtn",function(c){c.preventDefault();b.func.triggerEvent("stopRecording");$(this).addClass("hidden");$("#cc-recordBtn").removeClass("hidden")});$(document).on("click","#cc-loadSongBtn",function(c){c.preventDefault();b.func.triggerEvent("loadSong")})};CC.init();