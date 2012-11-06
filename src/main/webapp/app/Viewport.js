Ext.define('MusicSearch.Viewport', {
	extend: 'Ext.Viewport',
	controller: 'MusicSearch.ViewportController',
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
			}, Ext.create('MusicSearch.SearchResult', {
				itemId: 'searchResultGridPanel',
				region: 'center',
				padding: 10
			}), Ext.create('MusicSearch.Playlist', {
				itemId: 'playlistGridPanel',
				region: 'south',
				padding: 10,
				minHeight: 300,
				height: 300,
				collapsible: true,
				split: true
			}) ]
		});

		me.callParent(arguments);
	}

});