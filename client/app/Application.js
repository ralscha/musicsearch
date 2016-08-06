Ext.define('MusicSearch.Application', {
	extend: 'Ext.app.Application',
	requires: [ 'Ext.direct.*', 'MusicSearch.*' ],
	name: 'MusicSearch',

	constructor: function() {
		soundManager.setup({
			url: serverUrl + 'resources/swf/'
		});

		// <debug>
		Ext.Ajax.on('beforerequest', function(conn, options, eOpts) {
			options.withCredentials = true;
		}, this);
		// </debug>

		REMOTING_API.url = serverUrl + REMOTING_API.url;
		REMOTING_API.maxRetries = 0;
		Ext.direct.Manager.addProvider(REMOTING_API);

		this.callParent();
	},

	onAppUpdate: function() {
		window.location.reload();
	}
});
