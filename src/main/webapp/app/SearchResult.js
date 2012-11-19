Ext.define('MusicSearch.SearchResult', {
	extend: 'Ext.grid.Panel',
	inject: 'searchResultStore',
	controller: 'MusicSearch.SearchResultController',
	title: 'Search Music',

	multiSelect: true,

	viewConfig: {
		plugins: {
			ptype: 'gridviewdragdrop',
			dragText: 'Drag {0} song{1} to the playlist',
			ddGroup: 'playlistGroup',
			enableDrop: false
		},
		copy: true
	},

	initComponent: function() {
		var me = this;

		me.store = me.searchResultStore;

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
				xtype: 'filterfield',
				itemId: 'searchTextField',
				padding: 3,
				fieldLabel: 'Search'
			}, {
				xtype: 'displayfield',
				itemId: 'searchInfoDisplayField',
				padding: '3 3 3 10',
				value: 'Please enter a search term'
			}, '->', {
				xtype: 'button',
				text: 'Add Selected to Playlist',
				disabled: true,
				itemId: 'addSelectedButton',
				icon: app_context_path + '/resources/images/navigate_plus.png',
			}, {
				xtype: 'button',
				text: 'Download Selected',
				icon: app_context_path + '/resources/images/download.png',
				disabled: true,
				href: app_context_path + '/downloadMusicZip',
				hrefTarget: '_self',
				itemId: 'downloadSelectedButton'
			} ]
		} ];

		me.callParent(arguments);
	}

});