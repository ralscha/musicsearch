Ext.define('MusicSearch.Viewport', {
	extend: 'Ext.Viewport',
	controller: 'MusicSearch.ViewportController',
	inject: 'searchResultStore',
	
	layout: 'border',
	requires: [ 'Ext.ux.form.field.FilterField' ],

	searchResultStore: null,
	
	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [ {
				xtype: 'container',
				region: 'north',
				layout: 'hbox',
				items: [ {
					xtype: 'filterfield',
					itemId: 'searchTextField',
					padding: 10,
					width: 400,
					fieldLabel: 'Search'
				}, {
					xtype: 'displayfield',
					itemId: 'searchInfoDisplayField',
					padding: 10,
					value: 'Please enter a search term'
				} ]
			}, {
				xtype: 'gridpanel',
				itemId: 'searchResultGridPanel',
				region: 'center',
				padding: 10,
				title: 'Search Result',
				store: me.searchResultStore,
				columns: [ {
					xtype: 'gridcolumn',
					dataIndex: 'title',
					text: 'Title'
				}, {
					xtype: 'gridcolumn',
					dataIndex: 'album',
					text: 'Album'
				}, {
					xtype: 'gridcolumn',
					dataIndex: 'artist',
					text: 'Artist'
				}, {
					xtype: 'gridcolumn',
					dataIndex: 'year',
					text: 'Year'
				}, {
					xtype: 'gridcolumn',
					dataIndex: 'durationInSeconds',
					text: 'Duration',
					renderer: function(value) {
						if (value) {
							var min = Math.floor(value / 60);
							var sec = value % 60;
							return min + ":" + sec;
						}
						return value;
					}
				}, {
					xtype: 'gridcolumn',
					dataIndex: 'fileName',
					text: 'File'
				} ]
			}, {
				xtype: 'gridpanel',
				itemId: 'playlistGridPanel',
				region: 'south',
				height: 350,
				padding: 10,
				title: 'Playlist',
				columns: [ {
					xtype: 'gridcolumn',
					dataIndex: 'string',
					text: 'String'
				}, {
					xtype: 'numbercolumn',
					dataIndex: 'number',
					text: 'Number'
				}, {
					xtype: 'datecolumn',
					dataIndex: 'date',
					text: 'Date'
				}, {
					xtype: 'booleancolumn',
					dataIndex: 'bool',
					text: 'Boolean'
				} ]
			} ]
		});

		me.callParent(arguments);
	}

});