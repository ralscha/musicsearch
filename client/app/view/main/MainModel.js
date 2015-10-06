Ext.define('MusicSearch.view.main.MainModel', {
	extend: 'Ext.app.ViewModel',
	required: [ 'MusicSearch.model.Artist', 'MusicSearch.model.Song' ],

	data: {
		nowPlaying: 'Now playing:',
		selectedSongsId: null,
		playingSound: null,
		progressSliderDragging: false,
		hasPlaylist: false
	},

	stores: {
		artists: {
			model: 'MusicSearch.model.Artist',
			autoLoad: true,
			groupField: 'first',
			pageSize: 0
		},
		playlist: {
			model: 'MusicSearch.model.Song',
			listeners: {
				datachanged: 'onPlaylistDatachanged'
			}
		},
		songs: {
			model: 'MusicSearch.model.Song',
			autoLoad: false,
			remoteSort: false,
			remoteFilter: true,
			listeners: {
				load: 'onSongsLoaded'
			}
		}
	},

	formulas: {
		showPrevButton: function(get) {
			var ps = get('playingSound');
			if (ps) {
				if (ps.songIndex > 0) {
					return true;
				}
				else {
					return false;
				}
			}
			return false;
		},
		showNextButton: function(get) {
			var ps = get('playingSound');
			if (ps) {
				var store = get('playlist');
				if (ps.songIndex < store.getCount() - 1) {
					return true;
				}
				else {
					return false;
				}
			}
			return false;
		},
		nowPlaying: function(get) {
			var ps = get('playingSound');
			if (ps) {
				return 'Now playing: ' + ps.song.get('title') + ' - ' + ps.song.get('artist')
			}
			return 'Now playing: ';
		},
		progressText: function(get) {
			var ps = get('playingSound');
			var dragging = get('progressSliderDragging');
			if (ps) {
				var position = ps.position;
				var duration = ps.duration;
				if (!isNaN(position) && !isNaN(duration)) {
					var currentTimeFmt = MusicSearch.Util.secondsToHms(position / 1000);
					var durationFmt = MusicSearch.Util.secondsToHms(duration / 1000);
					if (!dragging) {
						return currentTimeFmt + ' / ' + durationFmt;
					}

					var sliderPos = get('progressSlider.value');
					var newPos = (sliderPos / 100) * ps.duration;
					var newPosString = MusicSearch.Util.secondsToHms(newPos / 1000);
					return currentTimeFmt + ' (' + newPosString + ') ' + ' / ' + durationFmt;
				}
			}
			return '0:00/0:00';
		}
	}

});
