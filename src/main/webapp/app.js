Ext.define('MusicSearch.App', {
	extend: 'Deft.mvc.Application',

	init: function() {
		Ext.fly('followingBallsG').destroy();

		Ext.tip.QuickTipManager.init();

		Deft.Injector.configure({
			searchResultStore: 'MusicSearch.SongsStore',
			playlistStore: 'MusicSearch.PlaylistStore'
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

soundManager.setup({
	url: app_context_path + '/resources/swf/',
	flashVersion: 9,
	onready: function() {
		Ext.create('MusicSearch.App');
	}
});
