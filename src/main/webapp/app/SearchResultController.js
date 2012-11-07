Ext.define('MusicSearch.SearchResultController', {
	extend: 'Deft.mvc.ViewController',
	inject: 'searchResultStore',

	searchResultStore: null,

	observe: {
		searchResultStore: {
			load: 'onSearchResultStoreLoad'
		}
	},

	control: {
		searchTextField: {
			filter: 'onSearchTextFieldFilter'
		},
		searchInfoDisplayField: true
	},

	onSearchTextFieldFilter: function(cmp, newValue) {		
		var filterValue = Ext.String.trim(newValue) || '';
		
		if (!Ext.isEmpty(filterValue)) {
			this.searchResultStore.remoteFilter = false;
			this.searchResultStore.clearFilter(true);
			this.searchResultStore.remoteFilter = true;
			
			this.searchResultStore.removeAll();
			
			this.searchResultStore.filter('filter', filterValue);
		} else {
			this.searchResultStore.removeAll();
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
