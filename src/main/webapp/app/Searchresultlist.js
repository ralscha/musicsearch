Ext.define('MusicSearch.Searchresultlist', {
	extend: 'Ext.grid.Panel',
	inject: 'searchResultStore',
	title: 'Search Result',

	searchResultStore: null,

	initComponent: function() {
		var me = this;

		me.store = me.searchResultStore;

		me.columns = [ {
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
			format:'0'
		} ];

		me.callParent(arguments);
	}

});