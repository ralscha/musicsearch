Ext.define('MusicSearch.App', {
	extend: 'Deft.mvc.Application',

	init: function() {
		console.log('application init');

		Ext.fly('followingBallsG').destroy();

		Ext.tip.QuickTipManager.init();

		Deft.Injector.configure({
			searchResultStore: 'MusicSearch.SongsStore'
		});

		Ext.create('MusicSearch.Viewport');
	}
});

Ext.namespace('MusicSearch.Utils');
MusicSearch.Utils.secondsToHms = function(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" : "")
			+ (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:")
			+ (s < 10 ? "0" : "") + s);
};

Ext.create('MusicSearch.App');
