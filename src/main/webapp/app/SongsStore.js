Ext.define('MusicSearch.SongsStore', {
	extend: 'Ext.data.Store',
	model: 'MusicSearch.Song',
	autoLoad: false,
	remoteSort: false,
	remoteFilter: true
});