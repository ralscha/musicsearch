Ext.define('MusicSearch.Viewport', {
	extend: 'Ext.Viewport',
	layout: 'border',
	requires: [ 'Ext.ux.form.field.FilterField' ],

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [ {
				xtype: 'panel',
				title: 'test',
				collapsible: true,
				split: true,
				layout: 'fit',
				minWidth: 100,
				maxWidth: 200,
				region: 'west'
			}, Ext.create('MusicSearch.SearchResult', {
				region: 'center'
			}), Ext.create('MusicSearch.Playlist', {
				region: 'south',
				minHeight: 300,
				height: 300,
				collapsible: true,
				split: true
			}) ]
		});

		me.callParent(arguments);
	}

});