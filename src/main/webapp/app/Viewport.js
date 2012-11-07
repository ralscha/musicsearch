Ext.define('MusicSearch.Viewport', {
	extend: 'Ext.Viewport',
	layout: 'border',
	requires: [ 'Ext.ux.form.field.FilterField' ],

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [ Ext.create('MusicSearch.SearchResult', {
				region: 'center',
				padding: 10
			}), Ext.create('MusicSearch.Playlist', {
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