Ext.define('MusicSearch.controller.ArtistsController', {
	extend: 'Deft.mvc.ViewController',
	inject: [ 'messageBus' ],

	control: {
		view: {
			itemdblclick: 'onItemDblClick'
		}
	},

	onItemDblClick: function(view, record) {
		this.messageBus.fireEvent('artistSelected', record.get('name'));
		this.getView().collapse();
	}

});
