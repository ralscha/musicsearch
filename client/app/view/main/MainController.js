Ext.define('MusicSearch.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	init: function() {
		searchService.getInfo(function(result) {
			var d = result.totalDuration;

			var days = Math.floor(d / (3600 * 24));
			var h = Math.floor(d % (3600 * 24) / 3600);
			var m = Math.floor(d % 3600 / 60);
			var s = Math.floor(d % 3600 % 60);

			var duration = days > 0 ? days + " Days " : "";
			duration += h > 0 ? h + " Hours " : "";
			duration += m > 0 ? m + " Minutes " : "";
			duration += s > 0 ? s + " Seconds" : "";

			this.getViewModel().set('searchResultTitle', 'MusicSearch: Total ' + result.noOfSongs + ' songs (' + duration + ')');
		}, this);
	},

	onArtistDblClick: function(view, record) {
		var term = 'artist:"' + record.get('name') + '"';
		this.lookup('filterField').setValue(term);
		this.lookup('artistsGrid').collapse();
	},

	onSelectionChange: function() {
		var sm = this.lookup('searchResult').getSelectionModel();

		if (sm.hasSelection()) {
			var selectedRecords = sm.getSelection();
			var ids = Ext.Array.map(selectedRecords, function(item) {
				return item.getId();
			});
			this.getViewModel().set('selectedSongsId', ids.join(','));
		}
		else {
			this.getViewModel().set('selectedSongsId', null);
		}
	},

	onSongDblClick: function(view, record) {
		var playlist = this.getStore('playlist');
		if (playlist.indexOf(record) === -1) {
			playlist.add(record);
		}
	},

	onFilter: function(cmp, newValue) {
		var val = Ext.isString(newValue) ? newValue : this.lookup('filterField').getValue();
		this.searchSongs(val);
	},

	onFilterClear: function(tf) {
		tf.setValue('');
	},

	searchSongs: function(term) {
		var vm = this.getViewModel();
		var filterValue = Ext.String.trim(term) || '';
		var songsStore = this.getStore('songs');
		vm.set('hasSongs', false);
		if (!Ext.isEmpty(filterValue)) {
			songsStore.clearFilter(true);
			songsStore.removeAll();
			songsStore.filter('filter', filterValue);
		}
		else {
			songsStore.removeAll();
			vm.set('searchInfo', '');
		}
	},

	onSongsLoaded: function(store, records) {
		var vm = this.getViewModel();

		var output;
		if (store.getCount() > 0) {
			output = 'Found ' + Ext.util.Format.plural(store.getCount(), 'song', 'songs');
			vm.set('hasSongs', true);
		}
		else {
			output = 'Nothing found';
			vm.set('hasSongs', false);
		}

		vm.set('searchInfo', output);
	},

	onAddSelectedButtonClick: function() {
		var playlist = this.getStore('playlist');
		var sm = this.lookup('searchResult').getSelectionModel();
		var insertRecords = [];

		Ext.Array.forEach(sm.getSelection(), function(record) {
			if (playlist.indexOf(record) === -1) {
				insertRecords.push(record);
			}
		}, this);

		playlist.add(insertRecords);
		sm.deselectAll();
	},

	onAddAllButtonClick: function() {
		var insertRecords = [];
		var playlist = this.getStore('playlist');

		this.getStore('songs').each(function(record) {
			if (playlist.indexOf(record) === -1) {
				insertRecords.push(record);
			}
		}, this);

		playlist.add(insertRecords);
	},

	onPlaylistDatachanged: function(store) {
		this.getViewModel().set('hasPlaylist', store.getCount() > 0);
	},

	onPlaylistItemDblClick: function(view, record) {
		this.playSong(record);
	},

	onPlayButtonClick: function() {
		var selectedModels = this.lookup('playlistGrid').getSelectionModel().getSelection();
		if (selectedModels && selectedModels.length >= 1) {
			this.playSong(selectedModels[0]);
		}
		else {
			this.playSong(this.getStore('playlist').first());
		}
	},

	onPauseButtonClick: function(button) {
		var ps = this.getViewModel().get('playingSound');
		if (button.pressed) {
			if (ps) {
				ps.pause();
			}
		}
		else {
			if (ps) {
				ps.resume();
			}
		}
	},

	onStopButtonClick: function() {
		this.stopSong();
	},

	onPrevButtonClick: function() {
		var playlistStore = this.getStore('playlist');
		var songIndex = this.getViewModel().get('playingSound').songIndex;
		if (songIndex !== -1) {
			if (songIndex > 0) {
				this.playSong(playlistStore.getAt(songIndex - 1));
			}
		}
	},

	onNextButtonClick: function() {
		var playlistStore = this.getStore('playlist');
		var songIndex = this.getViewModel().get('playingSound').songIndex;
		if (songIndex !== -1) {
			if (songIndex < playlistStore.getCount() - 1) {
				this.playSong(playlistStore.getAt(songIndex + 1));
			}
		}
	},

	onRemoveButtonClick: function() {
		var selectedModels = this.lookup('playlistGrid').getSelectionModel().getSelection();
		var playing = false;
		Ext.each(selectedModels, function(item) {
			if (item.get('playing')) {
				playing = true;
				return false;
			}
		});

		if (playing) {
			this.stopSong();
		}

		this.getStore('playlist').remove(selectedModels);
	},

	onClearPlaylistButtonClick: function() {
		this.stopSong();
		this.getStore('playlist').removeAll();
	},

	onVolumeSliderChange: function(slider, newValue) {
		var ps = this.getViewModel().get('playingSound');
		if (ps) {
			ps.setVolume(newValue);
		}
	},

	onProgressSliderDragStart: function() {
		this.getViewModel().set('progressSliderDragging', true);
	},

	onProgressSliderChangeComplete: function(slider, newValue) {
		this.getViewModel().set('progressSliderDragging', false);
		var ps = this.getViewModel().get('playingSound');
		if (ps) {
			ps.setPosition((newValue / 100) * ps.duration);
		}
	},

	updateProgress: function() {
		var slider = this.lookup('progressSlider');
		var ps = this.getViewModel().get('playingSound');
		if (ps) {
			var duration = ps.duration;

			if (duration > 0) {
				if (!slider.thumbs[0].dragging) {
					slider.setValue((ps.position / duration) * 100);
				}
			}
			else {
				slider.setValue(0);
			}
		}
		else {
			slider.setValue(0);
		}
	},

	playSong: function(song) {
		this.stopSong();

		var me = this;

		var playingSound = soundManager.createSound({
			id: 'currentSound',
			url: 'downloadMusic?docId=' + song.getId(),
			type: song.get('encoding'),
			autoLoad: true,
			autoPlay: true,
			volume: this.lookup('volumeSlider').getValue(),

			onstop: function() {
				me.onSoundManagerStop();
			},
			onfinish: function() {
				me.onSoundManagerFinish();
			},
			whileplaying: function() {
				me.updateProgress();
			}
		});

		var ix = -1;
		this.getStore('playlist').each(function(rec, i, len) {
			if (rec.getId() === song.getId()) {
				rec.set('playing', true);
				ix = i;
			}
			else {
				rec.set('playing', false);
			}
		});

		this.lookup('playlistGrid').getSelectionModel().select(song);

		playingSound.song = song;
		playingSound.songIndex = ix;
		this.getViewModel().set('playingSound', playingSound);

		this.lookup('pauseButton').toggle(false, false);
	},

	stopSong: function() {
		var ps = this.getViewModel().get('playingSound');
		if (ps) {
			ps.song.set('playing', false);
			ps.stop();
			ps.destruct();
			this.getViewModel().set('playingSound', null);
		}
	},

	onSoundManagerStop: function() {
		this.lookup('pauseButton').toggle(false, false);

		var playingSound = this.getViewModel().get('playingSound');
		this.getViewModel().set('playingSound', null);

		this.lookup('progressSlider').setValue(0);

		if (playingSound) {
			playingSound.song.set('playing', false);
		}
		this.lookup('playlistGrid').getSelectionModel().deselectAll();
	},

	onSoundManagerFinish: function(controller, sound) {
		var playlistStore = this.getStore('playlist');
		this.lookup('progressSlider').setValue(0);

		var songIndex = this.getViewModel().get('playingSound').songIndex;
		var record = playlistStore.getAt(songIndex + 1);
		if (record) {
			this.playSong(record);
		}
		else {
			this.stopSong();
		}
	}
});
