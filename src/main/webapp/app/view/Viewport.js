Ext.define('MusicSearch.view.Viewport', {
	extend: 'Ext.Viewport',
	layout: 'border',	

	initComponent: function() {
		this.items = [ Ext.create('MusicSearch.view.Artists', {
			region: 'west',
			collapsible: true,
			collapsed: true,
			split: true,
			width: 300,
			minWidth: 100
		}), Ext.create('MusicSearch.view.SearchResult', {
			region: 'center'
		}), Ext.create('MusicSearch.view.Playlist', {
			region: 'south',
			minHeight: 300,
			height: 300,
			collapsible: true,
			split: true
		}) ];

		this.callParent(arguments);
	}

});