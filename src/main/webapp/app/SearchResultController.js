Ext.define('MusicSearch.SearchResultController', {
	extend: 'Deft.mvc.ViewController',
	inject: ['searchResultStore', 'playlistStore'],

	searchResultStore: null,
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
		downloadSelectedButton: true,
		searchInfoDisplayField: true,
		view: {
			selectionchange: 'onSelectionChange',
			itemdblclick: 'onItemDblClick'
		}
	},

	onSelectionChange: function() {
		var params = {};
		
		if (this.getView().getSelectionModel().hasSelection()) {
			this.getDownloadSelectedButton().enable();
			
			var selectedResults = this.getView().getSelectionModel().getSelection();
			var ids = Ext.Array.map(selectedResults, function(item) {
				return item.getId();
			});
			params.sf = ids.join(',');
		} else {			
			this.getDownloadSelectedButton().disable();
		}
		
		this.getDownloadSelectedButton().setParams(params);
	},
	
	onItemDblClick: function(view, record) {
		if (this.playlistStore.indexOf(record) === -1) {
			this.playlistStore.add(record);
		}
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
