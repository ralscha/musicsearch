Ext.define('MusicSearch.controller.SearchResultController', {
	extend: 'Deft.mvc.ViewController',
	inject: [ 'searchResultStore', 'playlistStore', 'messageBus' ],

	observe: {
		searchResultStore: {
			load: 'onSearchResultStoreLoad'
		},
		messageBus: {
			artistSelected: 'onArtistSelected'
		}
	},
	
	control: {
		searchTextField: {
			filter: 'onSearchTextFieldFilter'
		},
		downloadSelectedButton: true,
		addSelectedButton: {
			click: 'onAddSelectedButtonClick'
		},
		addAllButton: {
			click: 'onAddAllButtonClick'
		},
		searchInfoDisplayField: true,
		view: {
			selectionchange: 'onSelectionChange',
			itemdblclick: 'onItemDblClick'
		}
	},

	init: function() {

		searchService.getInfo(function(result) {
			var d = result.totalDuration;

			var days = Math.floor(d / (3600 * 24));
			var h = Math.floor(d % (3600 * 24) / 3600);
			var m = Math.floor(d % 3600 / 60);
			var s = Math.floor(d % 3600 % 60);

			var duration = days > 0 ? days + " Days " : "";
			duration += h > 0 ? h + " Hours " : "";
			duration += m > 0 ? m + " Minutes " : "";
			duration += s > 0 ? s + " Seconds" : "";

			this.getView().setTitle('Search Music: Total ' + result.noOfSongs + ' songs (' + duration + ')');
		}, this);

	},

	onArtistSelected: function(name) {
		var term = 'artist:"'+name+'"';
		this.getSearchTextField().setValue(term);
		this.searchSongs(term);
	},
	
	onSelectionChange: function() {
		var params = {};

		if (this.getView().getSelectionModel().hasSelection()) {
			this.getDownloadSelectedButton().enable();
			this.getAddSelectedButton().enable();
			var selectedRecords = this.getView().getSelectionModel().getSelection();
			var ids = Ext.Array.map(selectedRecords, function(item) {
				return item.getId();
			});
			params.sf = ids.join(',');
		} else {
			this.getDownloadSelectedButton().disable();
			this.getAddSelectedButton().disable();
		}

		this.getDownloadSelectedButton().setParams(params);
	},

	onItemDblClick: function(view, record) {
		if (this.playlistStore.indexOf(record) === -1) {
			this.playlistStore.add(record);
		}
	},

	onSearchTextFieldFilter: function(cmp, newValue) {
		this.searchSongs(newValue);
	},
	
	searchSongs: function(term) {
		var filterValue = Ext.String.trim(term) || '';

		if (!Ext.isEmpty(filterValue)) {
			this.searchResultStore.clearFilter(true);
			this.searchResultStore.removeAll();
			this.searchResultStore.filter('filter', filterValue);
		} else {
			this.searchResultStore.removeAll();
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
	},

	onAddSelectedButtonClick: function() {
		if (this.getView().getSelectionModel().hasSelection()) {

			var insertRecords = [];
			Ext.Array.forEach(this.getView().getSelectionModel().getSelection(), function(record) {
				if (this.playlistStore.indexOf(record) === -1) {
					insertRecords.push(record);
				}
			}, this);

			this.playlistStore.add(insertRecords);
			this.getAddSelectedButton().disable();
			this.getView().getSelectionModel().deselectAll();
		}
	},

	onAddAllButtonClick: function() {
		var insertRecords = [];
		this.searchResultStore.each(function(record) {
			if (this.playlistStore.indexOf(record) === -1) {
				insertRecords.push(record);
			}
		}, this);

		this.playlistStore.add(insertRecords);
	}

});
