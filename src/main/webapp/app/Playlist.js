Ext.define('MusicSearch.Playlist', {
	extend: 'Ext.grid.Panel',
	// store: 'Playlist',
	title: 'Now playing:',
	multiSelect: true,
	sortableColumns: false,

	initComponent: function() {
		var me = this;

		me.columns = [ {
			xtype: 'gridcolumn',
			dataIndex: 'string',
			text: 'String'
		}, {
			xtype: 'numbercolumn',
			dataIndex: 'number',
			text: 'Number'
		}, {
			xtype: 'datecolumn',
			dataIndex: 'date',
			text: 'Date'
		}, {
			xtype: 'booleancolumn',
			dataIndex: 'bool',
			text: 'Boolean'
		} ];

		me.dockedItems = [ {
			xtype: 'toolbar',
			dock: 'top',
			items: [ {
				xtype: 'button',
				text: 'Play',
				icon: '../resources/images/media_play.png',
				itemId: 'playButton'
			}, {
				xtype: 'button',
				text: 'Pause',
				icon: '../resources/images/media_pause.png',
				enableToggle: true,
				itemId: 'pauseButton'
			}, {
				xtype: 'button',
				text: 'Prev',
				icon: '../resources/images/media_step_back.png',
				itemId: 'prevButton'
			}, {
				xtype: 'button',
				text: 'Next',
				icon: '../resources/images/media_step_forward.png',
				itemId: 'nextButton'
			}, {
				xtype: 'button',
				text: 'Remove from playlist',
				icon: '../resources/images/navigate_minus.png',
				itemId: 'removeButton'
			}, {
				xtype: 'button',
				text: 'Clear playlist',
				icon: '../resources/images/eraser.png',
				itemId: 'clearButton'
			}, '-', {
				xtype: 'slider',
				itemId: 'progressSlider',
				decimalPrecision: 1,
				width: 250,
				useTips: false
			}, ' ', {
				xtype: 'tbtext',
				itemId: 'progressText',
				text: '0:00/0:00'
			} ]
		}, {

			
			xtype: 'toolbar',
			dock: 'right',
			items: [ 
				'->',
				{
					xtype: 'slider',
					itemId: 'volumeSlider',
					maxValue: 100,
					height: 160,
					vertical: true
				}, {
					xtype: 'image',
					src: 'resources/images/loudspeaker.png',
					height: 24,
					width: 24
				}]
			
			
		} ];

		me.callParent(arguments);
	}

});