Ext.define('MusicSearch.SearchResultController', {
	extend: 'Deft.mvc.ViewController',
	inject: [ 'searchResultStore', 'playlistStore' ],

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
		addSelectedButton: {
			click: 'onAddSelectedButtonClick'
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

			this.getView().setTitle(
					'Search Music: Total ' + result.noOfSongs + ' songs ('
							+ duration + ')');
		}, this);

	},

	onSelectionChange: function() {
		var params = {};

		if (this.getView().getSelectionModel().hasSelection()) {
			this.getDownloadSelectedButton().enable();
			this.getAddSelectedButton().enable();
			var selectedRecords = this.getView().getSelectionModel()
					.getSelection();
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
	},

	onAddSelectedButtonClick: function() {
		if (this.getView().getSelectionModel().hasSelection()) {
			Ext.Array.forEach(
					this.getView().getSelectionModel().getSelection(),
					function(record) {
						if (this.playlistStore.indexOf(record) === -1) {
							this.playlistStore.add(record);
						}
					}, this);
			this.getAddSelectedButton().disable();
		}
	}

});
