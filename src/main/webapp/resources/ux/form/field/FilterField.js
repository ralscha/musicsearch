Ext.define('Ext.ux.form.field.FilterField', {
	extend: 'Ext.form.field.Trigger',
	alias: 'widget.filterfield',
	triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
	

	initComponent: function() {
		this.plugins = [ Ext.create('Ext.ux.form.field.ClearButton', {hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}) ],		
		
		this.on('specialkey', function(f, e) {
			if (e.getKey() == e.ENTER) {
				this.fireEvent('filter', this, this.getValue());
			}
		}, this);
		this.on('change', function(f, val) {
			if (!val) {
				this.fireEvent('filter', this, this.getValue());
			}
		}, this);
		
		this.callParent(arguments);
	},

	onTriggerClick: function() {
		this.fireEvent('filter', this, this.getValue());
	},
});
