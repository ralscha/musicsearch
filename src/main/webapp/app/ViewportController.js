Ext.define('MusicSearch.ViewportController', {
	extend: 'Deft.mvc.ViewController',
	inject: [ 'searchResultStore', 'playlistStore' ],

	playlistStore: null,
	player: null,

	observe: {
		searchResultStore: {
			load: 'onSearchResultStoreLoad'
		}
	},

	control: {
		searchTextField: {
			filter: 'onSearchTextFieldFilter'
		},
		searchResultGridPanel: true,
		searchInfoDisplayField: true,
		playlistGridPanel: true,
		playlistGridPanelView: {
			selector: '#playlistGridPanel > gridview',
			listeners: {
				beforedrop: 'onPlaylistGridPanelViewBeforedrop'
			}
		},
		volumeSlider: {
			change: 'onVolumeSliderChange'
		},
		playButton: {
			click: 'onPlayButtonClick'
		},
		pauseButton: {
			click: 'onPauseButtonClick'
		},
		progressSlider: {
			change: 'onProgressSliderChange',
			changecomplete: 'onProgressSliderChangeComplete'
		},
		progressText: true
	},

	init: function() {
		this.player = new Audio();
	},

	onPlayerTimeupdate: function(e) {
		console.log(e);
	},

	onPlayerEnded: function(e) {
		console.log(e);
	},

	isPlaying: function() {
		return !this.player.paused && !this.player.ended;
	},
	
	togglePause: function(state) {
		this.getPauseButton().toggle(state, false);
	},

	setNowPlaying: function(song) {
		this.getPlaylistGridPanel().setTitle(
				'Now playing: ' + song.title + ' - ' + song.artist);
	},

	startStatusTask: function() {
		Ext.TaskManager.stopAll();
		var task = {
			run: function() {
				this.statusHandler();
			},
			interval: 1000,
			scope: this
		};

		Ext.TaskManager.start(task);
	},
	
	statusHandler: function() {
		if (this.player.ended) {
			
		} 
		
		if (this.isPlaying()) {
			this.updateProgress();
		}
	},
	
	updateProgress: function() {
		var slider = this.getProgressSlider();
		var duration = this.player.duration;
		
		if (duration > 0) {
			if (!slider.thumbs[0].dragging) {
				slider.setValue((this.player.currentTime / duration) * 100);				
			}
		} else {
			slider.setValue(0);			
		}		
	},
	
	playSong: function(song) {
		this.togglePause(false);

		this.startStatusTask();
		
		var url = 'downloadMusic?name=' + song.fileName;
		
		soundManager.unload('mySound');
		soundManager.createSound({
			  id: 'mySound',
			  url: url,
			  autoLoad: true,
			  autoPlay: true,
			  type: song.encoding,
			  onload: function() {
			    console.log('The sound '+this.id+' loaded!');
			  },
			  volume: 100
			});
		
		
		
//		this.player.src = url;
//		this.player.load();
//		this.player.play();

		this.player.ontimeupdate = this.onPlayerTimeupdate;
		this.player.onended = this.onPlayerEnded;

		this.setNowPlaying(song);

		// this.playlistStore.each(function(record) {
		// record.dat.active = false;
		// });
		// song.active = true;
		// this.getPlaylistGridPanelView().refresh();
	},

	onVolumeSliderChange: function(slider, newValue) {
		this.player.volume = newValue / 100;
	},
	
	onProgressSliderChange: function(slider, newValue) {
		var currentTime = this.player.currentTime;
		var duration = this.player.duration;
		
		if (!isNaN(currentTime) && !isNaN(duration)) {
			var currentTimeFmt = MusicSearch.Utils.secondsToHms(currentTime);
			var durationFmt = MusicSearch.Utils.secondsToHms(duration);
			this.getProgressText().setText(currentTimeFmt + '/' + durationFmt);
		}		
	},
	
	onProgressSliderChangeComplete: function(slider, newValue) {
		console.log((newValue / 100) * this.player.duration);
		this.player.currentTime = (newValue / 100) * this.player.duration;
		console.log(this.player.currentTime);
	},

	onPlayButtonClick: function() {
		var selectedModels = this.getPlaylistGridPanel().getSelectionModel()
				.getSelection();
		if (selectedModels && selectedModels.length >= 1) {
			this.playSong(selectedModels[0].data);
		} else {
			this.playSong(this.playlistStore.first().data);
		}
	},

	onPauseButtonClick: function(button) {
		if (button.pressed) {
			this.player.pause();
		} else {
			this.player.play();
		}
	},

	onPlaylistGridPanelViewBeforedrop: function(node, data, overModel,
			dropPosition, dropFunction, eOpts) {
		// todo need better implementation for this
		for ( var i = 0; i < data.records.length; i++) {
			if (this.playlistStore.indexOfId(data.records[i].getId()) === -1) {
				this.playlistStore.add(data.records[i]);
			}
		}
		return false;
	},

	onSearchTextFieldFilter: function(cmp, newValue) {
		var searchResultStore = this.getSearchResultGridPanel().getStore();
		if (newValue) {
			searchResultStore.remoteFilter = false;
			searchResultStore.clearFilter(true);
			searchResultStore.remoteFilter = true;
			searchResultStore.removeAll();
			searchResultStore.filter('filter', newValue);
		} else {
			searchResultStore.removeAll();
			this.getSearchInfoDisplayField().setValue(
					'Please enter a search term');
		}
	},

	onSearchResultStoreLoad: function(store, records) {
		var output;
		if (store.getCount() > 0) {
			output = 'Found ';
			output += store.getCount();
			output += ' song';
			if (store.getCount() > 1) {
				output += 's';
			}
		} else {
			output = 'Nothing found';
		}

		this.getSearchInfoDisplayField().setValue(output);
	}

});
