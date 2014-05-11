Ext.define('MusicSearch.view.Artists', {
	extend: 'Ext.grid.Panel',
	inject: 'artistsStore',
	controller: 'MusicSearch.controller.ArtistsController',
	title: 'Artists',

	initComponent: function() {
		var me = this;

		me.store = me.artistsStore;

		me.features = [ {
			ftype: 'grouping',
			groupHeaderTpl: '{name}',
			startCollapsed: true
		} ];

		me.columns = {
			items: [ {
				dataIndex: 'name',
				text: 'Name',
				hideable: false,
				flex: 1
			} ]
		};

		me.callParent(arguments);
	}

});