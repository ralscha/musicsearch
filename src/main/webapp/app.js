Ext.onReady(function() {
	Ext.fly('appLoadingIndicator').destroy();
		
	Ext.tip.QuickTipManager.init();
	
	
	Deft.Injector.configure({
		searchResultStore: 'MusicSearch.SongsStore'
	});
	
	Ext.create('MusicSearch.Viewport');
	
});