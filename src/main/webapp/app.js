Ext.onReady(function() {
	Ext.fly('appLoadingIndicator').destroy();
		
	Ext.tip.QuickTipManager.init();
	
//	Ext.create('Changelog.store.Roles');
//	Ext.create('Changelog.store.CustomersAll');
	
//	Deft.Injector.configure({
//		messageBus: 'Ext.util.Observable'
//	});
	
	Ext.create('MusicSearch.view.Viewport');
	
});