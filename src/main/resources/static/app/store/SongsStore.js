Ext.define('MusicSearch.store.SongsStore', {
	extend: 'Ext.data.Store',
	model: 'MusicSearch.model.Song',
	autoLoad: false,
	remoteSort: false,
	remoteFilter: true
});