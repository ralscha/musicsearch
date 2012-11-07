Ext.define('MusicSearch.Playlist', {
	extend: 'Ext.grid.Panel',
	controller: 'MusicSearch.PlaylistController',
	inject: 'playlistStore',
	title: 'Now playing:',
	multiSelect: true,
	sortableColumns: false,

	playlistStore: null,

	viewConfig: {
		getRowClass: function(rec, idx, rowPrms, ds) {
			return rec.data.playing ? 'playlist-playing-row' : '';
		},		
		plugins: {
			ptype: 'gridviewdragdrop',
			dropGroup: 'playlistGroup',
			enableDrag: false
		},
		copy: true
	},

	initComponent: function() {
		var me = this;

		me.store = me.playlistStore;

		me.columns = {
			defaults: {
				hideable: false
			},
			items: [ {
				xtype: 'gridcolumn',
				dataIndex: 'title',
				text: 'Title',
				flex: 4
			}, {
				xtype: 'gridcolumn',
				dataIndex: 'album',
				text: 'Album',
				flex: 2
			}, {
				xtype: 'gridcolumn',
				dataIndex: 'artist',
				text: 'Artist',
				flex: 2
			}, {
				xtype: 'gridcolumn',
				dataIndex: 'year',
				text: 'Year'
			}, {
				xtype: 'gridcolumn',
				dataIndex: 'durationInSeconds',
				text: 'Duration',
				align: 'right',
				renderer: function(value) {
					return value ? MusicSearch.Utils.secondsToHms(value) : '';
				}
			}, {
				xtype: 'numbercolumn',
				dataIndex: 'bitrate',
				text: 'Bitrate',
				align: 'right',
				format: '0'
			} ]
		};

		me.dockedItems = [ {
			xtype: 'toolbar',
			dock: 'top',
			items: [ {
				xtype: 'button',
				text: 'Play',
				disabled: true,
				icon: '../resources/images/media_play.png',
				itemId: 'playButton'
			}, {
				xtype: 'button',
				text: 'Pause',
				disabled: true,
				icon: '../resources/images/media_pause.png',
				enableToggle: true,
				itemId: 'pauseButton'
			}, {
				xtype: 'button',
				text: 'Stop',
				disabled: true,
				icon: '../resources/images/media_stop.png',
				itemId: 'stopButton'
			}, {
				xtype: 'button',
				text: 'Prev',
				disabled: true,
				icon: '../resources/images/media_step_back.png',
				itemId: 'prevButton'
			}, {
				xtype: 'button',
				text: 'Next',
				disabled: true,
				icon: '../resources/images/media_step_forward.png',
				itemId: 'nextButton'
			}, {
				xtype: 'button',
				text: 'Remove from playlist',
				disabled: true,
				icon: '../resources/images/navigate_minus.png',
				itemId: 'removeButton'
			}, {
				xtype: 'button',
				text: 'Clear playlist',
				disabled: true,
				icon: '../resources/images/eraser.png',
				itemId: 'clearButton'
			}, '-', {
				xtype: 'slider',
				itemId: 'progressSlider',
				disabled: true,
				decimalPrecision: 1,
				width: 250,
				useTips: false
			}, ' ', {
				xtype: 'tbtext',
				itemId: 'progressText',
				text: '0:00/0:00'
			}, '->', {
				xtype: 'button',
				text: 'Download Playlist',
				icon: '../resources/images/download.png',
				disabled: true,
				href: app_context_path + 'downloadMusicZip',
				hrefTarget: '_self',
				itemId: 'downloadPlaylistButton'
			} ]
		}, {

			xtype: 'toolbar',
			dock: 'right',
			items: [ '->', {
				xtype: 'slider',
				itemId: 'volumeSlider',
				maxValue: 100,
				value: 50,
				height: 160,
				vertical: true
			}, {
				xtype: 'image',
				src: 'resources/images/loudspeaker.png',
				height: 24,
				width: 24
			} ]

		} ];

		me.callParent(arguments);
	}

});