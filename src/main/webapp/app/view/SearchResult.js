Ext.define('MusicSearch.view.SearchResult', {
	extend: 'Ext.grid.Panel',
	inject: 'searchResultStore',
	controller: 'MusicSearch.controller.SearchResultController',
	title: 'Search Music',
	
	requires: [ 'Ext.ux.form.field.FilterField' ],
	
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
				xtype: 'filterfield',
				itemId: 'searchTextField',
				padding: 3,
				fieldLabel: 'Search',
				width: 500,
				labelWidth: 50
			}, {
				xtype: 'displayfield',
				itemId: 'searchInfoDisplayField',
				padding: '3 3 3 10',
				value: 'Please enter a search term'
			}, '->', {
				xtype: 'button',
				text: 'Add All to Playlist',
				itemId: 'addAllButton',
				icon: app_context_path + '/resources/images/navigate_plus.png'
			},{
				xtype: 'button',
				text: 'Add Selected to Playlist',
				disabled: true,
				itemId: 'addSelectedButton',
				icon: app_context_path + '/resources/images/navigate_plus.png'
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