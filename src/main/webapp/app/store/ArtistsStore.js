Ext.define('MusicSearch.store.ArtistsStore', {
	extend: 'Ext.data.Store',
	model: 'MusicSearch.model.Artist',
	autoLoad: true,
	groupField: 'first'
});