Ext.define('MusicSearch.Util', {
	singleton: true,

	secondsToHms: function(d) {
		if (d) {
			var no = Number(d);
			var h = Math.floor(no / 3600);
			var m = Math.floor(no % 3600 / 60);
			var s = Math.floor(no % 3600 % 60);
			return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "00:") + (s < 10 ? "0" : "") + s);
		}
		return '';
	}

});