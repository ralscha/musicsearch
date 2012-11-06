Ext.define('MusicSearch.ViewportController', {
	extend: 'Deft.mvc.ViewController',
	inject: ['searchResultStore', 'playlistStore'],

	playlistStore: null,
	
	observe: {
		searchResultStore: {
			load: 'onSearchResultStoreLoad'
		}
	},

	control: {
		searchTextField: {
			filter: 'onSearchTextFieldFilter'
		},
		searchResultGridPanel: true,
		searchInfoDisplayField: true,
		playlistGridPanelView: {
			selector: '#playlistGridPanel > gridview',
			listeners: {
				beforedrop: 'onPlaylistGridPanelViewBeforedrop'
			}

		}
	},

	init: function() {
		//todo remove method if not needed
		//console.log('init');
	},

	onPlaylistGridPanelViewBeforedrop: function(node, data, overModel,
			dropPosition, dropFunction, eOpts) {
		//todo need better implementation for this
		for ( var i = 0; i < data.records.length; i++) {
			if (this.playlistStore.indexOfId(data.records[i].getId()) === -1) {
				this.playlistStore.add(data.records[i]);
			}
		}
		return false;
	},

	onSearchTextFieldFilter: function(cmp, newValue) {
		var searchResultStore = this.getSearchResultGridPanel().getStore();
		if (newValue) {
			searchResultStore.remoteFilter = false;
			searchResultStore.clearFilter(true);
			searchResultStore.remoteFilter = true;
			searchResultStore.removeAll();
			searchResultStore.filter('filter', newValue);
		} else {
			searchResultStore.removeAll();
			this.getSearchInfoDisplayField().setValue(
					'Please enter a search term');
		}
	},

	onSearchResultStoreLoad: function(store, records) {
		var output;
		if (store.getCount() > 0) {
			output = 'Found ';
			output += store.getCount();
			output += ' song';
			if (store.getCount() > 1) {
				output += 's';
			}
		} else {
			output = 'Nothing found';
		}

		this.getSearchInfoDisplayField().setValue(output);
	}

});
