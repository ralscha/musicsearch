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
				glyph: 0xe801,
				itemId: 'playButton'
			}, {
				xtype: 'button',
				tooltip: 'Pause',
				disabled: true,
				glyph: 0xe802,
				enableToggle: true,
				itemId: 'pauseButton'
			}, {
				xtype: 'button',
				tooltip: 'Stop',
				disabled: true,
				glyph: 0xe803,
				itemId: 'stopButton'
			}, {
				xtype: 'button',
				tooltip: 'Previous',
				disabled: true,
				glyph: 0xe805,
				itemId: 'prevButton'
			}, {
				xtype: 'button',
				tooltip: 'Next',
				disabled: true,
				glyph: 0xe804,
				itemId: 'nextButton'
			}, '-', {
				xtype: 'button',
				text: 'Remove',
				tooltip: 'Remove from playlist',
				disabled: true,
				glyph: 0xe806,
				itemId: 'removeButton'
			}, {
				xtype: 'button',
				text: 'Clear',
				tooltip: 'Clear playlist',
				disabled: true,
				glyph: 0xe809,
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
				glyph: 0xe808,
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
				glyph: 0xe80a
			} ]

		} ];

		me.callParent(arguments);
	}

});