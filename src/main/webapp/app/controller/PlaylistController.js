Ext.define('MusicSearch.controller.PlaylistController', {
	extend: 'Deft.mvc.ViewController',
	inject: 'playlistStore',

	currentSound: null,

	observe: {
		playlistStore: {
			datachanged: 'onPlaylistDatachanged',
			clear: 'onPlaylistDatachanged'
		}
	},

	control: {
		playlistGridPanelView: {
			selector: 'gridview',
			listeners: {
				beforedrop: 'onPlaylistGridPanelViewBeforedrop'
			}
		},
		view: {
			selectionchange: 'onSelectionchange',
			itemdblclick: 'onItemDblClick'
		},
		playButton: {
			click: 'onPlayButtonClick'
		},
		pauseButton: {
			click: 'onPauseButtonClick'
		},
		stopButton: {
			click: 'onStopButtonClick'
		},
		prevButton: {
			click: 'onPrevButtonClick'
		},
		nextButton: {
			click: 'onNextButtonClick'
		},
		removeButton: {
			click: 'onRemoveButtonClick'
		},
		clearButton: {
			click: 'onClearButton'
		},

		progressSlider: {
			change: 'onProgressSliderChange',	
			changecomplete: 'onProgressSliderChangeComplete'
		},
		volumeSlider: {
			change: 'onVolumeSliderChange'
		},
		progressText: true,
		downloadPlaylistButton: true
	},

	onPlaylistDatachanged: function(store) {
		if (store.getCount() > 0) {
			this.getPlayButton().enable();
			this.getClearButton().enable();
			this.getDownloadPlaylistButton().enable();
			
			var ids = [];
			store.each(function(item) {
				ids.push(item.getId());
			});
			var params = {};
			params.sf = ids.join(',');
			this.getDownloadPlaylistButton().setParams(params);
		} else {
			this.getPlayButton().disable();
			this.getPauseButton().disable();
			this.getStopButton().disable();
			this.getPrevButton().disable();
			this.getNextButton().disable();
			this.getRemoveButton().disable();
			this.getClearButton().disable();
			this.getProgressSlider().disable();
			this.getDownloadPlaylistButton().disable();
		}
		
		this.togglePrevNextButton();
				
	},

	onSelectionchange: function() {
		if (this.getView().getSelectionModel().hasSelection()) {
			this.getRemoveButton().enable();
		} else {
			this.getRemoveButton().disable();
		}
	},
	
	onItemDblClick: function(view, record) {
		this.playSong(record);		
	},

	onPlayButtonClick: function() {
		var selectedModels = this.getView().getSelectionModel().getSelection();
		if (selectedModels && selectedModels.length >= 1) {
			this.playSong(selectedModels[0]);
		} else {
			this.playSong(this.playlistStore.first());
		}
	},

	onPauseButtonClick: function(button) {
		if (button.pressed) {
			if (this.currentSound) {
				this.currentSound.pause();
			}
		} else {
			if (this.currentSound) {
				this.currentSound.resume();
			}

		}
	},
	
	onStopButtonClick: function() {
		this.stopSong();
		this.togglePrevNextButton();
	},
	
	onPrevButtonClick: function() {
		var songIndex = this.playlistStore.findExact('playing', true);
		if (songIndex !== -1) {			
			if (songIndex > 0) {
				this.playSong(this.playlistStore.getAt(songIndex-1));
			}
		}
	},
	
	onNextButtonClick: function() {
		var songIndex = this.playlistStore.findExact('playing', true);
		if (songIndex !== -1) {			
			if (songIndex < this.playlistStore.getCount()-1) {
				this.playSong(this.playlistStore.getAt(songIndex+1));
			}
		}		
	},

	onRemoveButtonClick: function() {
		var selectedModels = this.getView().getSelectionModel().getSelection();
		var playing = false;
		Ext.each(selectedModels, function(item) {
			if (item.data.playing) {
				playing = true;
				return false;
			}
		});
		
		if (playing) {
			this.stopSong();
		}
		
		this.playlistStore.remove(selectedModels);
	},

	onClearButton: function() {
		this.stopSong();		
		this.playlistStore.removeAll();
	},

	onVolumeSliderChange: function(slider, newValue) {
		if (this.currentSound) {
			this.currentSound.setVolume(newValue);
		}
	},

	onProgressSliderChange: function(slider, newValue) {
		var position; 
		var duration; 

		if (this.currentSound && this.currentSound.playState === 1) {
			position = this.currentSound.position;
			duration = this.currentSound.duration;
		} else {
			position = 0;
			duration = 0;			
		}
		
		if (!isNaN(position) && !isNaN(duration)) {
			var currentTimeFmt = MusicSearch.Utils.secondsToHms(position / 1000);
			var durationFmt = MusicSearch.Utils.secondsToHms(duration / 1000);
			this.getProgressText().setText(currentTimeFmt + ' / ' + durationFmt);
		}
	},
	
	onProgressSliderChangeComplete: function(slider, newValue) {
		if (this.currentSound) {
			this.currentSound.setPosition((newValue / 100) * this.currentSound.duration);
		}
	},

	togglePause: function(state) {
		this.getPauseButton().enable();
		this.getPauseButton().toggle(state, false);
	},
	
	togglePrevNextButton: function() {
		var songIndex = this.playlistStore.findExact('playing', true);
		if (songIndex !== -1) {
			if (songIndex > 0) {
				this.getPrevButton().enable();
			} else {
				this.getPrevButton().disable();
			}
			
			if (songIndex < this.playlistStore.getCount()-1) {
				this.getNextButton().enable();
			} else {
				this.getNextButton().disable();
			}
			
		} else {
			this.getPrevButton().disable();
			this.getNextButton().disable();
		}
	},

	setNowPlaying: function(song) {
		if (song) {
			this.getView().setTitle(
					'Now playing: ' + song.title + ' - ' + song.artist);
		} else {
			this.getView().setTitle('Now playing: ');
		}
	},

	updateProgress: function() {
		var slider = this.getProgressSlider();
		
		if (this.currentSound) {
			var duration = this.currentSound.duration;
	
			if (duration > 0) {
				if (!slider.thumbs[0].dragging) {
					slider.setValue((this.currentSound.position / duration) * 100);
				}
			} else {
				slider.setValue(0);
			}
		} else {
			slider.setValue(0);
		}
	},

	playSong: function(record) {
		var song = record.data;
		
		this.stopSong();

		var me = this;
		
		this.currentSound = soundManager.createSound({
			id: 'currentSound',
			url: app_context_path + '/downloadMusic?docId=' + song.id,
			type: song.encoding,		
			autoLoad: true,
			autoPlay: true,
			volume: this.getVolumeSlider().getValue(),
			onstop: function() {
				me.onSoundManagerStop(me, this);
			},
			onfinish: function() {
				me.onSoundManagerFinish(me, this);
			},
			onplay: function() {
				me.onSoundManagerPlay(me, this);
			},
			whileplaying: function() {
				me.onSoundManagerWhilePlaying(me, this);
			}
		});
		
		this.setNowPlaying(song);
		
		this.playlistStore.each(function(rec) { 
			rec.data.playing = false; 
		});
		
		song.playing = true;
		this.getView().getSelectionModel().select([record]);
		this.getView().getView().refresh();	
		
		this.togglePrevNextButton();
	},
	
	stopSong: function() {
		if (this.currentSound) {
			this.currentSound.stop();
			this.currentSound.destruct();
			this.currentSound = null;
		}		
	},

	onSoundManagerStop: function(controller, sound) {
		controller.togglePause(true);
		controller.getPauseButton().disable();
		controller.getStopButton().disable();
		controller.getProgressSlider().disable();
		controller.setNowPlaying(null);		
		controller.getProgressSlider().setValue(0);		
		this.deselectAll();
	},
	
	onSoundManagerFinish: function(controller, sound) {		
		var songIndex = this.playlistStore.findExact('playing', true);
		this.onSoundManagerStop(controller, sound);
		
		var record = this.playlistStore.getAt(songIndex+1);
		if (record) {
			this.playSong(record);
		} 
	},
	
	deselectAll: function() {
		var songIndex = this.playlistStore.findExact('playing', true);
		if (songIndex >= 0) {
			this.playlistStore.getAt(songIndex).data.playing = false;
			this.getView().getSelectionModel().deselectAll();
			this.getView().getView().refresh();
		}
	},
	
	onSoundManagerPlay: function(controller, sound) {
		controller.getStopButton().enable();
		controller.togglePause(false);
		controller.getProgressSlider().enable();
	},
	
	onSoundManagerWhilePlaying: function(controller, sound) {
		controller.updateProgress();
	},
	
	onPlaylistGridPanelViewBeforedrop: function(node, data, overModel,
			dropPosition, dropFunction, eOpts) {
		
		if (!data.copy) {
			return true;
		}
		
		var index;
		var record = this.getView().getView().getRecord(node);
		if (record == undefined) {
			index = this.playlistStore.getCount();
		} else {
			index = this.playlistStore.indexOf(record);
			if (dropPosition == 'after') {
				index++;
			}
		}		
		
		var insertRecords = [];
		for (var i = 0; i < data.records.length; i++) {
			if (this.playlistStore.indexOf(data.records[i]) === -1) {
				insertRecords.push(data.records[i]);				
			}
		}
		this.playlistStore.insert(index, insertRecords);
		return false;
	}

});
