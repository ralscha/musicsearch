Ext.define('MusicSearch.view.Playlist', {
	extend: 'Ext.grid.Panel',
	controller: 'MusicSearch.controller.PlaylistController',
	inject: 'playlistStore',
	title: 'Now playing:',
	multiSelect: true,
	sortableColumns: false,

	viewConfig: {
		getRowClass: function(rec, idx, rowPrms, ds) {
			return rec.data.playing ? 'playlist-playing-row' : '';
		},
		plugins: {
			ptype: 'gridviewdragdrop',
			ddGroup: 'playlistGroup',
			dragText: 'Drag and drop to reorganize'
		}
	},

	initComponent: function() {
		var me = this;

		me.store = me.playlistStore;

		me.columns = {
			defaults: {
				hideable: false
			},
			items: [ {
				dataIndex: 'title',
				text: 'Title',
				flex: 4
			}, {
				dataIndex: 'album',
				text: 'Album',
				flex: 2
			}, {
				dataIndex: 'artist',
				text: 'Artist',
				flex: 2
			}, {
				dataIndex: 'year',
				text: 'Year'
			}, {
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
				tooltip: 'Play',
				disabled: true,
				icon: app_context_path + '/resources/images/media_play.png',
				itemId: 'playButton'
			}, {
				xtype: 'button',
				tooltip: 'Pause',
				disabled: true,
				icon: app_context_path + '/resources/images/media_pause.png',
				enableToggle: true,
				itemId: 'pauseButton'
			}, {
				xtype: 'button',
				tooltip: 'Stop',
				disabled: true,
				icon: app_context_path + '/resources/images/media_stop.png',
				itemId: 'stopButton'
			}, {
				xtype: 'button',
				tooltip: 'Previous',
				disabled: true,
				icon: app_context_path + '/resources/images/media_step_back.png',
				itemId: 'prevButton'
			}, {
				xtype: 'button',
				tooltip: 'Next',
				disabled: true,
				icon: app_context_path + '/resources/images/media_step_forward.png',
				itemId: 'nextButton'
			}, '-', {
				xtype: 'button',
				text: 'Remove',
				tooltip: 'Remove from playlist',
				disabled: true,
				icon: app_context_path + '/resources/images/navigate_minus.png',
				itemId: 'removeButton'
			}, {
				xtype: 'button',
				text: 'Clear',
				tooltip: 'Clear playlist',
				disabled: true,
				icon: app_context_path + '/resources/images/eraser.png',
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
				text: 'Download',
				tooltip: 'Download Playlist',
				icon: app_context_path + '/resources/images/download.png',
				disabled: true,
				href: app_context_path + '/downloadMusicZip',
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
				src: app_context_path + '/resources/images/loudspeaker.png',
				height: 24,
				width: 24
			} ]

		} ];

		me.callParent(arguments);
	}

});