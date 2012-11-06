Ext.define('MusicSearch.ViewportController', {
	extend: 'Deft.mvc.ViewController',	
	inject: 'searchResultStore',
	
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
		searchInfoDisplayField: true
	},

	init: function() {
		console.log('init');
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
			this.getSearchInfoDisplayField().setValue('Please enter a search term');
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
