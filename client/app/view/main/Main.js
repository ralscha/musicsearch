Ext.define('MusicSearch.view.main.Main', {
	extend: 'Ext.panel.Panel',

	requires: [ 'Ext.plugin.Viewport', 'Ext.window.MessageBox', 'MusicSearch.view.main.MainController', 'MusicSearch.view.main.MainModel' ],

	controller: {
		xclass: 'MusicSearch.view.main.MainController'
	},

	viewModel: {
		xclass: 'MusicSearch.view.main.MainModel'
	},

	layout: 'border',
	items: [ {
		xclass: 'MusicSearch.view.ArtistsGrid',
		region: 'west',
		collapsible: true,
		collapsed: true,
		split: true,
		width: 300,
		minWidth: 100
	}, {
		xclass: 'MusicSearch.view.SearchResultGrid',
		region: 'center'
	}, {
		xclass: 'MusicSearch.view.PlaylistGrid',
		region: 'south',
		minHeight: 300,
		height: 300,
		collapsible: true,
		split: true
	} ]

});
