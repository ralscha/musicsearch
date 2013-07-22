Ext.define('App.overrides.view.Table', {
    override: 'Ext.view.Table',


    getRecord: function (node) {
        node = this.getNode(node);
        if (node) {
            //var recordIndex = node.getAttribute('data-recordIndex');
            //if (recordIndex) {
            //    recordIndex = parseInt(recordIndex, 10);
            //    if (recordIndex > -1) {
            //        // The index is the index in the original Store, not in a GroupStore
            //        // The Grouping Feature increments the index to skip over unrendered records in collapsed groups
            //        return this.store.data.getAt(recordIndex);
            //    }
            //}
            return this.dataSource.data.get(node.getAttribute('data-recordId'));
        }
    },


    indexInStore: function (node) {
        node = this.getNode(node, true);
        if (!node && node !== 0) {
            return -1;
        }
        //var recordIndex = node.getAttribute('data-recordIndex');
        //if (recordIndex) {
        //    return parseInt(recordIndex, 10);
        //}
        return this.dataSource.indexOf(this.getRecord(node));
    }
});

Ext.define('MusicSearch.App', {
	extend: 'Deft.mvc.Application',

	init: function() {
		Ext.fly('followingBallsG').destroy();

		Ext.tip.QuickTipManager.init();

		Deft.Injector.configure({
			searchResultStore: 'MusicSearch.store.SongsStore',
			playlistStore: 'MusicSearch.store.PlaylistStore',
			artistsStore: 'MusicSearch.store.ArtistsStore',
			messageBus: 'Ext.util.Observable'
		});

		Ext.create('MusicSearch.view.Viewport');
	}
});

Ext.namespace('MusicSearch.Utils');
MusicSearch.Utils.secondsToHms = function(d) {
	var no = Number(d);
	var h = Math.floor(no / 3600);
	var m = Math.floor(no % 3600 / 60);
	var s = Math.floor(no % 3600 % 60);
	return ((h > 0 ? h + ":" : "")
			+ (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "00:")
			+ (s < 10 ? "0" : "") + s);
};

soundManager.setup({
	url: app_context_path + '/resources/swf/',
	flashVersion: 9,
	preferFlash: true,
	onready: function() {
		Ext.create('MusicSearch.App');
	}
});
